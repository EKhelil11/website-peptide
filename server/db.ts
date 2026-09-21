import { eq, desc, and, or, isNull, isNotNull, gt, lt, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  customers, orders, orderItems, orderNumberCounters, orderStatusHistory, systemJobs,
  InsertOrder, InsertOrderItem,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function acceptTerms(userId: number, termsVersion: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({ termsAcceptedAt: new Date(), termsVersion }).where(eq(users.id, userId));
}

// ─── Order number generation ────────────────────────────────────────────────

export function generateOrderNumber(id: number): string {
  return `LAP-${id}`;
}

// ─── Orders ────────────────────────────────────────────────────────────────

export async function createOrder(
  orderData: InsertOrder,
  items: InsertOrderItem[],
  activatePartnerBenefit?: {
    customerId: number;
    partnerCode: string;
    discountBps: number;
  },
): Promise<{ orderId: number; orderNumber: string }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.transaction(async tx => {
    // Insert the order first so its unique checkout idempotency key wins before
    // any customer-facing LAP sequence number is reserved.
    const [result] = await tx.insert(orders).values({
      ...orderData,
      orderNumber: null,
    });
    const orderId = Number((result as { insertId: number }).insertId);

    // Increment one named row instead of relying on AUTO_INCREMENT. TiDB can
    // allocate AUTO_INCREMENT IDs in large blocks, which exposed LAP-160002
    // after LAP-130002. The row-level update serializes concurrent checkouts.
    const [counterResult] = await tx
      .update(orderNumberCounters)
      .set({
        lastIssuedNumber: sql`${orderNumberCounters.lastIssuedNumber} + 1`,
      })
      .where(eq(orderNumberCounters.name, "orders"));
    if (Number((counterResult as { affectedRows?: number }).affectedRows ?? 0) !== 1) {
      throw new Error("Order number counter is not initialized");
    }
    const [counter] = await tx
      .select({ lastIssuedNumber: orderNumberCounters.lastIssuedNumber })
      .from(orderNumberCounters)
      .where(eq(orderNumberCounters.name, "orders"))
      .limit(1);
    if (!counter) throw new Error("Order number counter could not be read");
    const orderNumber = generateOrderNumber(counter.lastIssuedNumber);
    await tx.update(orders).set({ orderNumber }).where(eq(orders.id, orderId));

    if (items.length > 0) {
      const itemsWithOrderId = items.map(item => ({ ...item, orderId }));
      await tx.insert(orderItems).values(itemsWithOrderId);
    }

    await tx.insert(orderStatusHistory).values({
      orderId,
      fromStatus: null,
      toStatus: "pending_payment",
      changedBy: "system",
      note: orderData.partnerCode
        ? `Order placed with partner code ${orderData.partnerCode}`
        : "Order placed",
      createdAt: Date.now(),
    });

    if (activatePartnerBenefit) {
      await tx
        .update(customers)
        .set({
          partnerCode: activatePartnerBenefit.partnerCode,
          partnerDiscountBps: activatePartnerBenefit.discountBps,
          partnerCodeActivatedAt: new Date(),
        })
        .where(eq(customers.id, activatePartnerBenefit.customerId));
    }

    return { orderId, orderNumber };
  });
}

export async function getOrdersByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

export async function getOrdersByCustomerId(customerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(eq(orders.customerId, customerId)).orderBy(desc(orders.createdAt));
}

export async function getOrderWithItems(orderId: number) {
  const db = await getDb();
  if (!db) return null;
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  const history = await db.select().from(orderStatusHistory).where(eq(orderStatusHistory.orderId, orderId));
  return { ...order, items, history };
}

export async function getOrderByNumber(orderNumber: string) {
  const db = await getDb();
  if (!db) return null;
  const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return { ...order, items };
}

export async function getOrderByCheckoutKey(customerId: number, checkoutIdempotencyKey: string) {
  const db = await getDb();
  if (!db) return null;
  const [order] = await db.select().from(orders).where(and(
    eq(orders.customerId, customerId),
    eq(orders.checkoutIdempotencyKey, checkoutIdempotencyKey),
  )).limit(1);
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return { ...order, items };
}

export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getAllOrdersWithItems() {
  const db = await getDb();
  if (!db) return [];
  const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
  const results = [];
  for (const order of allOrders) {
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    results.push({ ...order, items });
  }
  return results;
}

export async function attachWhitcombPaymentSession(
  orderId: number,
  reference: string,
  checkoutUrl: string,
  amountCents: number,
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [existing] = await db.select({
    reference: orders.paymentProviderReference,
  }).from(orders).where(eq(orders.id, orderId)).limit(1);
  if (existing?.reference && existing.reference !== reference) {
    throw new Error("Whitcomb payment session reference conflict");
  }
  const [result] = await db.update(orders).set({
    paymentProviderReference: reference,
    paymentProviderCheckoutUrl: checkoutUrl,
    paymentProviderStatus: "open",
    paymentProviderAmountCents: amountCents,
    paymentProviderLastCheckedAt: null,
  }).where(and(
    eq(orders.id, orderId),
    eq(orders.paymentMethod, "whitcomb_card"),
    eq(orders.status, "pending_payment"),
    or(isNull(orders.paymentProviderReference), eq(orders.paymentProviderReference, reference)),
  ));
  if (Number((result as { affectedRows?: number }).affectedRows ?? 0) !== 1) {
    const [current] = await db.select({
      status: orders.status,
      method: orders.paymentMethod,
      reference: orders.paymentProviderReference,
      checkoutUrl: orders.paymentProviderCheckoutUrl,
    }).from(orders).where(eq(orders.id, orderId)).limit(1);
    if (
      current?.status === "pending_payment" &&
      current.method === "whitcomb_card" &&
      current.reference === reference &&
      current.checkoutUrl === checkoutUrl
    ) return;
    throw new Error("Whitcomb payment session could not be attached");
  }
}

export async function claimWhitcombPaymentPoll(
  orderId: number,
  reference: string,
  claimedAt: number,
  eligibleBefore: number,
): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.update(orders).set({
    paymentProviderLastCheckedAt: claimedAt,
    paymentProviderCheckCount: sql`${orders.paymentProviderCheckCount} + 1`,
  }).where(and(
    eq(orders.id, orderId),
    eq(orders.status, "pending_payment"),
    eq(orders.paymentMethod, "whitcomb_card"),
    eq(orders.paymentProvider, "whitcomb"),
    eq(orders.paymentProviderReference, reference),
    or(isNull(orders.paymentProviderLastCheckedAt), lt(orders.paymentProviderLastCheckedAt, eligibleBefore)),
  ));
  return Number((result as { affectedRows?: number }).affectedRows ?? 0) === 1;
}

export async function recordWhitcombPaymentCheck(
  orderId: number,
  reference: string,
  input: { status: string; amountCents?: number; paidAt?: number; checkedAt: number },
): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.update(orders).set({
    paymentProviderStatus: input.status,
    paymentProviderAmountCents: input.amountCents,
    ...(input.paidAt ? { paymentProviderPaidAt: input.paidAt } : {}),
  }).where(and(
    eq(orders.id, orderId),
    eq(orders.status, "pending_payment"),
    eq(orders.paymentMethod, "whitcomb_card"),
    eq(orders.paymentProviderReference, reference),
    eq(orders.paymentProviderLastCheckedAt, input.checkedAt),
  ));
  return Number((result as { affectedRows?: number }).affectedRows ?? 0) === 1;
}

export async function markOrderPaidByWhitcomb(
  orderId: number,
  input: {
    reference: string;
    amountCents: number;
    paidAt: number;
    checkedAt: number;
  },
): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.transaction(async tx => {
    const [result] = await tx.update(orders).set({
      status: "paid",
      paymentProviderStatus: "paid",
      paymentProviderAmountCents: input.amountCents,
      paymentProviderPaidAt: input.paidAt,
      paymentConfirmedAt: input.paidAt,
      paymentConfirmedBy: null,
      paymentNotes: `Whitcomb card payment confirmed (${input.reference})`,
    }).where(and(
      eq(orders.id, orderId),
      eq(orders.status, "pending_payment"),
      eq(orders.paymentMethod, "whitcomb_card"),
      eq(orders.paymentProvider, "whitcomb"),
      eq(orders.paymentProviderReference, input.reference),
      eq(orders.totalCents, input.amountCents),
      eq(orders.paymentProviderLastCheckedAt, input.checkedAt),
      eq(orders.paymentProviderStatus, "paid"),
    ));
    if (Number((result as { affectedRows?: number }).affectedRows ?? 0) === 0) return false;

    await tx.insert(orderStatusHistory).values({
      orderId,
      fromStatus: "pending_payment",
      toStatus: "paid",
      changedBy: "whitcomb",
      note: `Whitcomb card payment confirmed (${input.reference})`,
      createdAt: input.paidAt,
    });
    return true;
  });
}

export async function markOrderCancelledByWhitcomb(
  orderId: number,
  reference: string,
  checkedAt: number,
): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const changedAt = Date.now();
  return db.transaction(async tx => {
    const [result] = await tx.update(orders).set({
      status: "cancelled",
      paymentProviderStatus: "cancelled",
    }).where(and(
      eq(orders.id, orderId),
      eq(orders.status, "pending_payment"),
      eq(orders.paymentMethod, "whitcomb_card"),
      eq(orders.paymentProvider, "whitcomb"),
      eq(orders.paymentProviderReference, reference),
      eq(orders.paymentProviderLastCheckedAt, checkedAt),
      eq(orders.paymentProviderStatus, "cancelled"),
    ));
    if (Number((result as { affectedRows?: number }).affectedRows ?? 0) !== 1) return false;
    await tx.insert(orderStatusHistory).values({
      orderId,
      fromStatus: "pending_payment",
      toStatus: "cancelled",
      changedBy: "whitcomb",
      note: "Whitcomb hosted card payment cancelled",
      createdAt: changedAt,
    });
    return true;
  });
}

export async function getPendingWhitcombOrders(limit = 5, lastCheckedBefore = Date.now() - 5 * 60 * 1000) {
  const db = await getDb();
  if (!db) return [];
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return db.select().from(orders).where(and(
    eq(orders.status, "pending_payment"),
    eq(orders.paymentMethod, "whitcomb_card"),
    eq(orders.paymentProvider, "whitcomb"),
    isNotNull(orders.paymentProviderReference),
    gt(orders.createdAt, cutoff),
    or(isNull(orders.paymentProviderLastCheckedAt), lt(orders.paymentProviderLastCheckedAt, lastCheckedBefore)),
  )).orderBy(desc(orders.createdAt)).limit(limit);
}

export async function getSystemJobByTaskUid(taskUid: string) {
  const db = await getDb();
  if (!db) return undefined;
  const [job] = await db.select().from(systemJobs)
    .where(eq(systemJobs.scheduleCronTaskUid, taskUid)).limit(1);
  return job;
}

export async function claimSystemJobLease(taskUid: string, now: number, leaseMs: number) {
  const db = await getDb();
  if (!db) return false;
  const [result] = await db.update(systemJobs).set({
    leaseExpiresAt: now + leaseMs,
    lastRunAt: now,
  }).where(and(
    eq(systemJobs.scheduleCronTaskUid, taskUid),
    or(isNull(systemJobs.leaseExpiresAt), lt(systemJobs.leaseExpiresAt, now)),
  ));
  return Number((result as { affectedRows?: number }).affectedRows ?? 0) === 1;
}

export async function releaseSystemJobLease(taskUid: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(systemJobs).set({ leaseExpiresAt: null })
    .where(eq(systemJobs.scheduleCronTaskUid, taskUid));
}

export async function markOrderPaid(
  orderId: number,
  adminUserId: number,
  paymentNotes?: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const confirmedAt = Date.now();
  return db.transaction(async tx => {
    const [result] = await tx.update(orders).set({
      status: "paid",
      paymentConfirmedAt: confirmedAt,
      paymentConfirmedBy: adminUserId,
      ...(paymentNotes ? { paymentNotes } : {}),
    }).where(and(
      eq(orders.id, orderId),
      eq(orders.status, "pending_payment"),
      eq(orders.paymentMethod, "zelle"),
    ));
    if (Number((result as { affectedRows?: number }).affectedRows ?? 0) !== 1) return false;

    await tx.insert(orderStatusHistory).values({
      orderId,
      fromStatus: "pending_payment",
      toStatus: "paid",
      changedBy: String(adminUserId),
      note: paymentNotes || "Zelle payment confirmed by admin",
      createdAt: confirmedAt,
    });
    return true;
  });
}

export async function updateOrderAdminNotes(orderId: number, adminNotes: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(orders).set({ adminNotes }).where(eq(orders.id, orderId));
}

export async function cancelOrder(
  orderId: number,
  cancelledBy: string,
  note = "Order cancelled",
): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.transaction(async tx => {
    const changedAt = Date.now();
    const [result] = await tx.update(orders).set({ status: "cancelled" }).where(and(
      eq(orders.id, orderId),
      eq(orders.status, "pending_payment"),
      eq(orders.paymentMethod, "zelle"),
    ));
    if (Number((result as { affectedRows?: number }).affectedRows ?? 0) !== 1) return false;

    await tx.insert(orderStatusHistory).values({
      orderId,
      fromStatus: "pending_payment",
      toStatus: "cancelled",
      changedBy: cancelledBy,
      note,
      createdAt: changedAt,
    });
    return true;
  });
}

// ─── ShipStation ────────────────────────────────────────────────────────────

/** Returns paid orders that haven't been synced to ShipStation yet */
export async function getPaidOrdersWithItems() {
  const db = await getDb();
  if (!db) return [];

  const paidOrders = await db
    .select()
    .from(orders)
    .where(and(eq(orders.status, "paid"), isNull(orders.shipstationOrderId)))
    .orderBy(desc(orders.createdAt));

  const results = [];
  for (const order of paidOrders) {
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    results.push({ ...order, items });
  }
  return results;
}

export async function updateOrderShipStation(
  orderId: number,
  shipstationOrderId: string,
  trackingNumber?: string,
  carrier?: string,
  service?: string,
  estimatedDelivery?: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [existing] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);

  await db.update(orders).set({
    shipstationOrderId,
    shipstationSyncedAt: Date.now(),
    ...(trackingNumber ? {
      trackingNumber,
      trackingCarrier: carrier,
      trackingService: service,
      estimatedDelivery,
      shippedAt: Date.now(),
      status: "shipped",
    } : {}),
  }).where(eq(orders.id, orderId));

  if (trackingNumber && existing) {
    await db.insert(orderStatusHistory).values({
      orderId,
      fromStatus: existing.status,
      toStatus: "shipped",
      changedBy: "system",
      note: `Shipped via ${carrier || "carrier"} — tracking: ${trackingNumber}`,
      createdAt: Date.now(),
    });
  }
}

// ─── Admin stats ────────────────────────────────────────────────────────────

export async function getOrderStats() {
  const db = await getDb();
  if (!db) return { pendingCount: 0, paidCount: 0, shippedCount: 0, totalRevenueCents: 0 };

  const allOrders = await db.select().from(orders);
  const pendingCount = allOrders.filter(o => o.status === "pending_payment").length;
  const paidCount = allOrders.filter(o => o.status === "paid" || o.status === "processing").length;
  const shippedCount = allOrders.filter(o => o.status === "shipped" || o.status === "delivered").length;
  const totalRevenueCents = allOrders
    .filter(o => o.status !== "cancelled" && o.status !== "pending_payment")
    .reduce((sum, o) => sum + (o.totalCents || 0), 0);

  return { pendingCount, paidCount, shippedCount, totalRevenueCents };
}
