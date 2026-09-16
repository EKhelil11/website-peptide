import { eq, desc, and, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  customers, orders, orderItems, orderNumberSequence, orderStatusHistory,
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
    const [sequenceResult] = await tx
      .insert(orderNumberSequence)
      .values({ createdAt: new Date() });
    const sequenceId = Number((sequenceResult as { insertId: number }).insertId);
    const orderNumber = generateOrderNumber(sequenceId);

    const [result] = await tx.insert(orders).values({
      ...orderData,
      orderNumber,
    });
    const orderId = Number((result as { insertId: number }).insertId);

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

export async function markOrderPaid(
  orderId: number,
  adminUserId: number,
  paymentNotes?: string
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [existing] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!existing) throw new Error("Order not found");

  await db.update(orders).set({
    status: "paid",
    paymentConfirmedAt: Date.now(),
    paymentConfirmedBy: adminUserId,
    ...(paymentNotes ? { paymentNotes } : {}),
  }).where(eq(orders.id, orderId));

  await db.insert(orderStatusHistory).values({
    orderId,
    fromStatus: existing.status,
    toStatus: "paid",
    changedBy: String(adminUserId),
    note: paymentNotes || "Zelle payment confirmed by admin",
    createdAt: Date.now(),
  });
}

export async function updateOrderAdminNotes(orderId: number, adminNotes: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(orders).set({ adminNotes }).where(eq(orders.id, orderId));
}

export async function cancelOrder(orderId: number, cancelledBy: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [existing] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!existing) throw new Error("Order not found");

  await db.update(orders).set({ status: "cancelled" }).where(eq(orders.id, orderId));

  await db.insert(orderStatusHistory).values({
    orderId,
    fromStatus: existing.status,
    toStatus: "cancelled",
    changedBy: cancelledBy,
    note: "Order cancelled",
    createdAt: Date.now(),
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
