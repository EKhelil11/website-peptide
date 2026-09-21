import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  authenticateRequest: vi.fn(),
  claimSystemJobLease: vi.fn(),
  getPendingWhitcombOrders: vi.fn(),
  getSystemJobByTaskUid: vi.fn(),
  releaseSystemJobLease: vi.fn(),
  reconcileWhitcombOrder: vi.fn(),
}));

vi.mock("./_core/sdk", () => ({ sdk: { authenticateRequest: mocks.authenticateRequest } }));
vi.mock("./db", () => ({
  claimSystemJobLease: mocks.claimSystemJobLease,
  getPendingWhitcombOrders: mocks.getPendingWhitcombOrders,
  getSystemJobByTaskUid: mocks.getSystemJobByTaskUid,
  releaseSystemJobLease: mocks.releaseSystemJobLease,
}));
vi.mock("./paymentOrchestration", () => ({ reconcileWhitcombOrder: mocks.reconcileWhitcombOrder }));

import {
  __setWhitcombScheduledTimingsForTests,
  reconcileWhitcombPaymentsHandler,
} from "./whitcombScheduled";

function responseDouble() {
  let statusCode = 200;
  let body: unknown;
  const res = {
    status: vi.fn((code: number) => {
      statusCode = code;
      return res;
    }),
    json: vi.fn((value: unknown) => {
      body = value;
      return res;
    }),
  };
  return { res, status: () => statusCode, body: () => body };
}

describe("Whitcomb scheduled reconciliation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.authenticateRequest.mockResolvedValue({ isCron: true, taskUid: "task-whitcomb" });
    mocks.getSystemJobByTaskUid.mockResolvedValue({ taskUid: "task-whitcomb", name: "whitcomb-payment-reconciliation" });
    mocks.claimSystemJobLease.mockResolvedValue(true);
    mocks.getPendingWhitcombOrders.mockResolvedValue([]);
    mocks.releaseSystemJobLease.mockResolvedValue(undefined);
    __setWhitcombScheduledTimingsForTests({ leaseMs: 90, deadlineMs: 20 });
  });

  afterEach(() => {
    __setWhitcombScheduledTimingsForTests();
  });

  it("skips an overlapping run without reading orders or releasing another run's lease", async () => {
    mocks.claimSystemJobLease.mockResolvedValueOnce(false);
    const output = responseDouble();
    await reconcileWhitcombPaymentsHandler({} as never, output.res as never);

    expect(output.status()).toBe(200);
    expect(output.body()).toEqual({ ok: true, skipped: "overlap" });
    expect(mocks.getPendingWhitcombOrders).not.toHaveBeenCalled();
    expect(mocks.reconcileWhitcombOrder).not.toHaveBeenCalled();
    expect(mocks.releaseSystemJobLease).not.toHaveBeenCalled();
  });

  it("releases the lease after a completed bounded batch", async () => {
    mocks.getPendingWhitcombOrders.mockResolvedValueOnce([{ id: 10 }, { id: 11 }]);
    mocks.reconcileWhitcombOrder
      .mockResolvedValueOnce({ paid: true, status: "paid" })
      .mockResolvedValueOnce({ paid: false, status: "open" });
    const output = responseDouble();
    await reconcileWhitcombPaymentsHandler({} as never, output.res as never);

    expect(output.status()).toBe(200);
    expect(output.body()).toMatchObject({ ok: true, checked: 2, paid: 1, open: 1, errors: 0 });
    expect(mocks.getPendingWhitcombOrders).toHaveBeenCalledWith(5, expect.any(Number));
    expect(mocks.releaseSystemJobLease).toHaveBeenCalledWith("task-whitcomb");
  });

  it("returns 202 partial at the endpoint deadline and keeps the lease until expiry", async () => {
    mocks.getPendingWhitcombOrders.mockResolvedValueOnce([{ id: 10 }]);
    mocks.reconcileWhitcombOrder.mockReturnValueOnce(new Promise(() => {}));
    __setWhitcombScheduledTimingsForTests({ leaseMs: 90, deadlineMs: 5 });
    const output = responseDouble();
    await reconcileWhitcombPaymentsHandler({} as never, output.res as never);

    expect(output.status()).toBe(202);
    expect(output.body()).toMatchObject({ ok: true, partial: true, checked: 0 });
    expect(mocks.releaseSystemJobLease).not.toHaveBeenCalled();
  });
});
