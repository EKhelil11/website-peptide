import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  getCustomerFromSession: vi.fn(),
  getOrderByCheckoutKey: vi.fn(),
  createOrder: vi.fn(),
  getOrderWithItems: vi.fn(),
  markOrderPaid: vi.fn(),
  cancelOrder: vi.fn(),
  startWhitcombPayment: vi.fn(),
  attachWhitcombPaymentSession: vi.fn(),
  notifyOwner: vi.fn(),
  sendNewOrderEmail: vi.fn(),
  sendCustomerOrderConfirmation: vi.fn(),
}));

vi.mock("./customerAuth", () => ({ getCustomerFromSession: mocks.getCustomerFromSession }));
vi.mock("./db", () => ({
  createOrder: mocks.createOrder,
  getOrdersByUserId: vi.fn(),
  getOrdersByCustomerId: vi.fn(),
  getOrderWithItems: mocks.getOrderWithItems,
  getOrderByNumber: vi.fn(),
  getOrderByCheckoutKey: mocks.getOrderByCheckoutKey,
  getAllOrdersWithItems: vi.fn(),
  markOrderPaid: mocks.markOrderPaid,
  cancelOrder: mocks.cancelOrder,
  updateOrderAdminNotes: vi.fn(),
  getOrderStats: vi.fn(),
  attachWhitcombPaymentSession: mocks.attachWhitcombPaymentSession,
  updateOrderShipStation: vi.fn(),
}));
vi.mock("./_core/notification", () => ({ notifyOwner: mocks.notifyOwner }));
vi.mock("./email", () => ({
  sendNewOrderEmail: mocks.sendNewOrderEmail,
  sendPaymentConfirmedEmail: vi.fn(),
  sendCustomerOrderConfirmation: mocks.sendCustomerOrderConfirmation,
  sendShippingConfirmationEmail: vi.fn(),
}));
vi.mock("./shipstation", () => ({
  createOrUpdateSSOrder: vi.fn(),
  buildSSOrderPayload: vi.fn(),
  getSSShipmentsForOrder: vi.fn(),
}));
vi.mock("./integrationStatus", () => ({ isShipStationConfigured: vi.fn(() => false) }));
vi.mock("./paymentOrchestration", () => ({ reconcileWhitcombOrder: vi.fn() }));
vi.mock("./whitcomb", () => ({
  resolveWhitcombOrigin: vi.fn(() => "https://laelitepeps.com"),
  startWhitcombPayment: mocks.startWhitcombPayment,
}));

import { orderRouter } from "./orderRouter";

const customer = {
  id: 77,
  email: "buyer@example.com",
  firstName: "Test",
  lastName: "Buyer",
  partnerCode: null,
  partnerDiscountBps: 0,
};

const existingOrder = {
  id: 41,
  orderNumber: "LAP-130002",
  customerId: customer.id,
  status: "pending_payment",
  subtotalCents: 20_000,
  discountCents: 0,
  partnerCode: null,
  shippingCents: 700,
  taxCents: 1_600,
  totalCents: 22_300,
  paymentMethod: "whitcomb_card",
  paymentProviderCheckoutUrl: "https://whitcombpayments.com/pay/?t=ws_existing",
  items: [],
};

const input = {
  checkoutIdempotencyKey: "d0d78162-57e3-4a78-a1e7-1c980f0c765a",
  items: [{ productId: "retatrutide-30mg", quantity: 1 }],
  shipName: "Test Buyer",
  shipEmail: "buyer@example.com",
  shipAddress: "100 Research Way",
  shipCity: "Los Angeles",
  shipState: "CA",
  shipZip: "90001",
  paymentMethod: "whitcomb_card" as const,
};

function createContext(): TrpcContext {
  return {
    user: null,
    req: { cookies: { lap_customer_session: "test-session" } } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 9,
      openId: "admin-test",
      email: "admin@example.com",
      name: "Admin",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("checkout submission idempotency", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCustomerFromSession.mockResolvedValue(customer);
    mocks.notifyOwner.mockResolvedValue(undefined);
    mocks.sendNewOrderEmail.mockResolvedValue(undefined);
    mocks.sendCustomerOrderConfirmation.mockResolvedValue(undefined);
  });

  it("replays the committed order before pricing, sequence reservation, payment, or email side effects", async () => {
    mocks.getOrderByCheckoutKey.mockResolvedValue(existingOrder);
    const result = await orderRouter.createCaller(createContext()).submit(input);
    expect(result).toMatchObject({
      orderId: 41,
      orderNumber: "LAP-130002",
      paymentMethod: "whitcomb_card",
      paymentUrl: "https://whitcombpayments.com/pay/?t=ws_existing",
      replayed: true,
    });
    expect(mocks.createOrder).not.toHaveBeenCalled();
    expect(mocks.startWhitcombPayment).not.toHaveBeenCalled();
    expect(mocks.notifyOwner).not.toHaveBeenCalled();
    expect(mocks.sendNewOrderEmail).not.toHaveBeenCalled();
    expect(mocks.sendCustomerOrderConfirmation).not.toHaveBeenCalled();
  });

  it("recovers a concurrent unique-key insert race by returning the winning order without side effects", async () => {
    mocks.getOrderByCheckoutKey
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(existingOrder);
    mocks.createOrder.mockRejectedValueOnce(new Error("duplicate checkout idempotency key"));

    const result = await orderRouter.createCaller(createContext()).submit(input);
    expect(result).toMatchObject({ orderId: 41, orderNumber: "LAP-130002", replayed: true });
    expect(mocks.createOrder).toHaveBeenCalledTimes(1);
    expect(mocks.startWhitcombPayment).not.toHaveBeenCalled();
    expect(mocks.notifyOwner).not.toHaveBeenCalled();
    expect(mocks.sendNewOrderEmail).not.toHaveBeenCalled();
    expect(mocks.sendCustomerOrderConfirmation).not.toHaveBeenCalled();
  });

  it("keeps an ambiguous checkout-start failure as one pending card order for safe resume", async () => {
    mocks.getOrderByCheckoutKey.mockResolvedValueOnce(null);
    mocks.createOrder.mockResolvedValueOnce({ orderId: 41, orderNumber: "LAP-130002" });
    mocks.startWhitcombPayment.mockRejectedValueOnce(new Error("provider timeout"));

    const result = await orderRouter.createCaller(createContext()).submit(input);
    expect(result).toMatchObject({
      orderId: 41,
      orderNumber: "LAP-130002",
      paymentMethod: "whitcomb_card",
      paymentUrl: null,
    });
    expect(mocks.attachWhitcombPaymentSession).not.toHaveBeenCalled();
    expect(mocks.notifyOwner).toHaveBeenCalledTimes(1);
    expect(mocks.sendNewOrderEmail).toHaveBeenCalledWith(expect.objectContaining({ paymentMethod: "whitcomb_card", paymentUrl: null }));
    expect(mocks.sendCustomerOrderConfirmation).toHaveBeenCalledWith(expect.objectContaining({ paymentMethod: "whitcomb_card", paymentUrl: null }));
  });

  it("suppresses duplicate Zelle side effects when another admin already won the atomic transition", async () => {
    mocks.getOrderWithItems.mockResolvedValueOnce({
      ...existingOrder,
      paymentMethod: "zelle",
      paymentProviderCheckoutUrl: null,
    });
    mocks.markOrderPaid.mockResolvedValueOnce(false);

    await expect(orderRouter.createCaller(createAdminContext()).adminMarkPaid({ orderId: 41 }))
      .rejects.toMatchObject({ code: "CONFLICT" });
    expect(mocks.notifyOwner).not.toHaveBeenCalled();
    expect(mocks.sendNewOrderEmail).not.toHaveBeenCalled();
  });

  it("allows an admin to cancel one unpaid pending Zelle order with an audit reason", async () => {
    mocks.getOrderWithItems.mockResolvedValueOnce({
      ...existingOrder,
      paymentMethod: "zelle",
      paymentProviderCheckoutUrl: null,
    });
    mocks.cancelOrder.mockResolvedValueOnce(true);

    const result = await orderRouter.createCaller(createAdminContext()).adminCancelOrder({
      orderId: 41,
      reason: "Duplicate test order",
    });

    expect(result).toEqual({ success: true, orderNumber: "LAP-130002" });
    expect(mocks.cancelOrder).toHaveBeenCalledWith(
      41,
      "admin:9",
      "Order cancelled by admin: Duplicate test order",
    );
    expect(mocks.notifyOwner).not.toHaveBeenCalled();
    expect(mocks.sendNewOrderEmail).not.toHaveBeenCalled();
  });

  it("blocks Admin cancellation of a Whitcomb card order", async () => {
    mocks.getOrderWithItems.mockResolvedValueOnce(existingOrder);

    await expect(orderRouter.createCaller(createAdminContext()).adminCancelOrder({ orderId: 41 }))
      .rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(mocks.cancelOrder).not.toHaveBeenCalled();
  });

  it("blocks Admin cancellation after an order is paid", async () => {
    mocks.getOrderWithItems.mockResolvedValueOnce({
      ...existingOrder,
      status: "paid",
      paymentMethod: "zelle",
      paymentProviderCheckoutUrl: null,
    });

    await expect(orderRouter.createCaller(createAdminContext()).adminCancelOrder({ orderId: 41 }))
      .rejects.toMatchObject({ code: "CONFLICT" });
    expect(mocks.cancelOrder).not.toHaveBeenCalled();
  });

  it("returns a conflict when another actor wins the cancellation transition", async () => {
    mocks.getOrderWithItems.mockResolvedValueOnce({
      ...existingOrder,
      paymentMethod: "zelle",
      paymentProviderCheckoutUrl: null,
    });
    mocks.cancelOrder.mockResolvedValueOnce(false);

    await expect(orderRouter.createCaller(createAdminContext()).adminCancelOrder({ orderId: 41 }))
      .rejects.toMatchObject({ code: "CONFLICT" });
    expect(mocks.cancelOrder).toHaveBeenCalledTimes(1);
  });

  it("keeps customer cancellation on the same atomic unpaid-Zelle transition", async () => {
    mocks.getOrderWithItems.mockResolvedValueOnce({
      ...existingOrder,
      customerId: customer.id,
      paymentMethod: "zelle",
      paymentProviderCheckoutUrl: null,
    });
    mocks.cancelOrder.mockResolvedValueOnce(true);

    const result = await orderRouter.createCaller(createContext()).cancelOrder({ orderId: 41 });

    expect(result).toEqual({ success: true });
    expect(mocks.cancelOrder).toHaveBeenCalledWith(
      41,
      `customer:${customer.id}`,
      "Order cancelled by customer",
    );
  });
});
