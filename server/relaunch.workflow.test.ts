import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./email", () => ({
  sendNewOrderEmail: vi.fn().mockResolvedValue(false),
  sendPaymentConfirmedEmail: vi.fn().mockResolvedValue(false),
  sendCustomerOrderConfirmation: vi.fn().mockResolvedValue(false),
  sendShippingConfirmationEmail: vi.fn().mockResolvedValue(false),
}));

vi.mock("./shipstation", () => ({
  buildSSOrderPayload: vi.fn(() => ({})),
  createOrUpdateSSOrder: vi.fn(),
  getSSShipmentsForOrder: vi.fn(),
}));

import {
  customerSessions,
  customers,
  orderItems,
  orders,
  orderStatusHistory,
} from "../drizzle/schema";
import type { TrpcContext } from "./_core/context";
import { getCustomerFromSession, loginCustomer } from "./customerAuth";
import { getDb } from "./db";
import { appRouter } from "./routers";

const runDatabaseWorkflow = process.env.RUN_DB_INTEGRATION_TESTS === "1";
const describeDatabase = runDatabaseWorkflow ? describe : describe.skip;

describeDatabase("relaunch database workflow", () => {
  const email = "relaunch-workflow-test@invalid.example";
  const password = "RelaunchTestOnly-2026!";
  let customerId = 0;
  let sessionToken = "";

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("DATABASE_URL is required for the relaunch workflow test");

    await db.delete(customers).where(eq(customers.email, email));
    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await db.insert(customers).values({
      email,
      passwordHash,
      firstName: "Relaunch",
      lastName: "Workflow Test",
      emailVerified: 1,
    });
    customerId = Number((result as { insertId: number }).insertId);
  });

  afterAll(async () => {
    const db = await getDb();
    if (!db || !customerId) return;

    const testOrders = await db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.customerId, customerId));

    for (const order of testOrders) {
      await db.delete(orderStatusHistory).where(eq(orderStatusHistory.orderId, order.id));
      await db.delete(orderItems).where(eq(orderItems.orderId, order.id));
    }
    await db.delete(orders).where(eq(orders.customerId, customerId));
    await db.delete(customerSessions).where(eq(customerSessions.customerId, customerId));
    await db.delete(customers).where(eq(customers.id, customerId));
  });

  it("authenticates a verified customer and resolves the persisted session", async () => {
    const login = await loginCustomer(email, password, true);
    sessionToken = login.token;

    expect(login.customer.id).toBe(customerId);
    expect(login.customer.email).toBe(email);
    expect(login.expiresAt).toBeGreaterThan(Date.now());

    const sessionCustomer = await getCustomerFromSession(sessionToken);
    expect(sessionCustomer?.id).toBe(customerId);
  });

  it("persists, reads, cancels, and administers orders without live side effects", async () => {
    expect(sessionToken).not.toBe("");

    const customerContext = {
      req: { cookies: { lap_customer_session: sessionToken } },
      res: {},
      user: null,
    } as unknown as TrpcContext;
    const customerCaller = appRouter.createCaller(customerContext);

    const firstOrder = await customerCaller.orders.submit({
      items: [
        {
          productId: "retatrutide-10mg",
          productName: "Retatrutide",
          productCategory: "GLP",
          quantity: 1,
          unitPrice: 100,
        },
      ],
      shipName: "Relaunch Workflow Test",
      shipEmail: email,
      shipAddress: "1 Test Way",
      shipCity: "Los Angeles",
      shipState: "CA",
      shipZip: "90001",
    });

    expect(firstOrder.success).toBe(true);
    expect(firstOrder.totalCents).toBe(11_500);
    expect(firstOrder.orderNumber).toMatch(/^LAP-\d+$/);

    const persisted = await customerCaller.orders.getOrder({ orderId: firstOrder.orderId });
    expect(persisted?.items).toHaveLength(1);
    expect(persisted?.history[0]?.toStatus).toBe("pending_payment");

    await customerCaller.orders.cancelOrder({ orderId: firstOrder.orderId });
    const cancelled = await customerCaller.orders.getOrder({ orderId: firstOrder.orderId });
    expect(cancelled?.status).toBe("cancelled");
    expect(cancelled?.history.map(entry => entry.toStatus)).toContain("cancelled");

    const secondOrder = await customerCaller.orders.submit({
      items: [
        {
          productId: "nad-500mg",
          productName: "NAD+",
          productCategory: "Metabolics",
          quantity: 2,
          unitPrice: 75,
        },
      ],
      shipName: "Relaunch Workflow Test",
      shipEmail: email,
      shipAddress: "1 Test Way",
      shipCity: "Los Angeles",
      shipState: "CA",
      shipZip: "90001",
    });

    await expect(customerCaller.orders.adminListOrders()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });

    const adminContext = {
      req: {},
      res: {},
      user: {
        id: 999_999,
        openId: "relaunch-test-admin",
        role: "admin",
      },
    } as unknown as TrpcContext;
    const adminCaller = appRouter.createCaller(adminContext);

    await adminCaller.orders.adminUpdateNotes({
      orderId: secondOrder.orderId,
      adminNotes: "Temporary relaunch workflow validation",
    });
    const payment = await adminCaller.orders.adminMarkPaid({
      orderId: secondOrder.orderId,
      paymentNotes: "Test-only payment transition",
    });

    expect(payment.shipstationQueued).toBe(false);
    const administered = await adminCaller.orders.adminGetOrder({ orderId: secondOrder.orderId });
    expect(administered?.status).toBe("paid");
    expect(administered?.adminNotes).toBe("Temporary relaunch workflow validation");
    expect(administered?.shipstationOrderId).toBeNull();

    const visibleToCustomer = await customerCaller.orders.myOrders();
    expect(visibleToCustomer.map(order => order.id)).toEqual(
      expect.arrayContaining([firstOrder.orderId, secondOrder.orderId]),
    );

    const stats = await adminCaller.orders.adminStats();
    expect(stats.paidCount).toBeGreaterThanOrEqual(1);
  });
});
