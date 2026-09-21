import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  claimWhitcombPaymentPoll: vi.fn(),
  getOrderWithItems: vi.fn(),
  markOrderCancelledByWhitcomb: vi.fn(),
  markOrderPaidByWhitcomb: vi.fn(),
  recordWhitcombPaymentCheck: vi.fn(),
  updateOrderShipStation: vi.fn(),
  checkWhitcombPayment: vi.fn(),
  sendPaymentConfirmedEmailAbortable: vi.fn(),
  notifyOwner: vi.fn(),
  createOrUpdateSSOrder: vi.fn(),
  buildSSOrderPayload: vi.fn(),
  isShipStationConfigured: vi.fn(),
}));

vi.mock("./db", () => ({
  claimWhitcombPaymentPoll: mocks.claimWhitcombPaymentPoll,
  getOrderWithItems: mocks.getOrderWithItems,
  markOrderCancelledByWhitcomb: mocks.markOrderCancelledByWhitcomb,
  markOrderPaidByWhitcomb: mocks.markOrderPaidByWhitcomb,
  recordWhitcombPaymentCheck: mocks.recordWhitcombPaymentCheck,
  updateOrderShipStation: mocks.updateOrderShipStation,
}));
vi.mock("./whitcomb", () => ({ checkWhitcombPayment: mocks.checkWhitcombPayment }));
vi.mock("./email", () => ({ sendPaymentConfirmedEmailAbortable: mocks.sendPaymentConfirmedEmailAbortable }));
vi.mock("./_core/notification", () => ({ notifyOwner: mocks.notifyOwner }));
vi.mock("./shipstation", () => ({
  createOrUpdateSSOrder: mocks.createOrUpdateSSOrder,
  buildSSOrderPayload: mocks.buildSSOrderPayload,
}));
vi.mock("./integrationStatus", () => ({ isShipStationConfigured: mocks.isShipStationConfigured }));

import { reconcileWhitcombOrder } from "./paymentOrchestration";

const pendingOrder = {
  id: 10,
  orderNumber: "LAP-130002",
  status: "pending_payment",
  paymentMethod: "whitcomb_card",
  paymentProvider: "whitcomb",
  paymentProviderReference: "ws_paid",
  totalCents: 20140,
  shipName: "Test Buyer",
  shipEmail: "buyer@example.com",
  items: [],
};

const paidOrder = { ...pendingOrder, status: "paid", paymentProviderStatus: "paid" };

describe("Whitcomb payment reconciliation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getOrderWithItems.mockResolvedValueOnce(pendingOrder).mockResolvedValue(paidOrder);
    mocks.claimWhitcombPaymentPoll.mockResolvedValue(true);
    mocks.recordWhitcombPaymentCheck.mockResolvedValue(undefined);
    mocks.markOrderCancelledByWhitcomb.mockResolvedValue(true);
    mocks.markOrderPaidByWhitcomb.mockResolvedValue(true);
    mocks.sendPaymentConfirmedEmailAbortable.mockResolvedValue(undefined);
    mocks.notifyOwner.mockResolvedValue(undefined);
    mocks.isShipStationConfigured.mockReturnValue(false);
  });

  it("marks paid only after a matching provider reference and exact authoritative amount", async () => {
    mocks.checkWhitcombPayment.mockResolvedValue({
      reference: "ws_paid",
      status: "paid",
      paid: true,
      amountCents: 20140,
      paidAt: 1_800_000_000_000,
    });

    const result = await reconcileWhitcombOrder(10);

    expect(result.paid).toBe(true);
    expect(mocks.markOrderPaidByWhitcomb).toHaveBeenCalledWith(10, expect.objectContaining({
      reference: "ws_paid",
      amountCents: 20140,
      paidAt: 1_800_000_000_000,
      checkedAt: expect.any(Number),
    }));
    expect(mocks.notifyOwner).toHaveBeenCalledTimes(1);
    expect(mocks.sendPaymentConfirmedEmailAbortable).toHaveBeenCalledTimes(1);
  });

  it("does not mark cancelled or open sessions paid", async () => {
    mocks.getOrderWithItems
      .mockReset()
      .mockResolvedValueOnce(pendingOrder)
      .mockResolvedValue({ ...pendingOrder, status: "cancelled", paymentProviderStatus: "cancelled" });
    mocks.checkWhitcombPayment.mockResolvedValue({
      reference: "ws_paid",
      status: "cancelled",
      paid: false,
    });
    const result = await reconcileWhitcombOrder(10);
    expect(result).toMatchObject({ paid: false, status: "cancelled" });
    expect(mocks.markOrderCancelledByWhitcomb).toHaveBeenCalledWith(10, "ws_paid", expect.any(Number));
    expect(mocks.markOrderPaidByWhitcomb).not.toHaveBeenCalled();
    expect(mocks.notifyOwner).not.toHaveBeenCalled();
  });

  it("returns a terminal paid order without another provider poll or side effect", async () => {
    mocks.getOrderWithItems.mockReset().mockResolvedValue(paidOrder);
    const result = await reconcileWhitcombOrder(10);
    expect(result).toMatchObject({ paid: true, status: "paid", cached: true });
    expect(mocks.checkWhitcombPayment).not.toHaveBeenCalled();
    expect(mocks.markOrderPaidByWhitcomb).not.toHaveBeenCalled();
    expect(mocks.notifyOwner).not.toHaveBeenCalled();
  });

  it("serves a recent pending status from the database without polling Whitcomb again", async () => {
    mocks.getOrderWithItems.mockReset().mockResolvedValue({
      ...pendingOrder,
      paymentProviderStatus: "open",
      paymentProviderLastCheckedAt: Date.now() - 60_000,
    });
    const result = await reconcileWhitcombOrder(10);
    expect(result).toMatchObject({ paid: false, status: "open", cached: true });
    expect(mocks.checkWhitcombPayment).not.toHaveBeenCalled();
    expect(mocks.recordWhitcombPaymentCheck).not.toHaveBeenCalled();
  });

  it("lets only the winning atomic poll claim contact Whitcomb", async () => {
    mocks.claimWhitcombPaymentPoll.mockResolvedValueOnce(false);
    mocks.getOrderWithItems
      .mockReset()
      .mockResolvedValueOnce(pendingOrder)
      .mockResolvedValue({ ...pendingOrder, paymentProviderLastCheckedAt: Date.now(), paymentProviderStatus: "open" });
    const result = await reconcileWhitcombOrder(10);
    expect(result).toMatchObject({ paid: false, status: "open", cached: true });
    expect(mocks.checkWhitcombPayment).not.toHaveBeenCalled();
    expect(mocks.recordWhitcombPaymentCheck).not.toHaveBeenCalled();
  });

  it("records and rejects an amount mismatch without any fulfillment or email side effect", async () => {
    mocks.checkWhitcombPayment.mockResolvedValue({
      reference: "ws_paid",
      status: "paid",
      paid: true,
      amountCents: 1,
      paidAt: 1_800_000_000_000,
    });
    await expect(reconcileWhitcombOrder(10)).rejects.toThrow("amount does not match");
    expect(mocks.recordWhitcombPaymentCheck).toHaveBeenCalledWith(10, "ws_paid", expect.objectContaining({
      status: "amount_mismatch",
      amountCents: 1,
    }));
    expect(mocks.markOrderPaidByWhitcomb).not.toHaveBeenCalled();
    expect(mocks.notifyOwner).not.toHaveBeenCalled();
    expect(mocks.sendPaymentConfirmedEmailAbortable).not.toHaveBeenCalled();
  });

  it("rejects a paid response that omits the authoritative amount", async () => {
    mocks.checkWhitcombPayment.mockResolvedValue({
      reference: "ws_paid",
      status: "paid",
      paid: true,
      paidAt: 1_800_000_000_000,
    });
    await expect(reconcileWhitcombOrder(10)).rejects.toThrow("amount does not match");
    expect(mocks.markOrderPaidByWhitcomb).not.toHaveBeenCalled();
  });

  it("suppresses duplicate notifications and fulfillment when another poll already transitioned the order", async () => {
    mocks.checkWhitcombPayment.mockResolvedValue({
      reference: "ws_paid",
      status: "paid",
      paid: true,
      amountCents: 20140,
      paidAt: 1_800_000_000_000,
    });
    mocks.markOrderPaidByWhitcomb.mockResolvedValue(false);
    const result = await reconcileWhitcombOrder(10);
    expect(result.paid).toBe(true);
    expect(mocks.notifyOwner).not.toHaveBeenCalled();
    expect(mocks.sendPaymentConfirmedEmailAbortable).not.toHaveBeenCalled();
    expect(mocks.createOrUpdateSSOrder).not.toHaveBeenCalled();
  });
});
