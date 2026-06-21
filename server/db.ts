import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, orders, orderItems, InsertOrder, InsertOrderItem } from "../drizzle/schema";
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
    const values: InsertUser = {
      openId: user.openId,
    };
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

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ─── Orders ────────────────────────────────────────────────────────────────

export async function createOrder(
  orderData: InsertOrder,
  items: InsertOrderItem[]
): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(orders).values(orderData);
  const orderId = (result as any).insertId as number;

  if (items.length > 0) {
    const itemsWithOrderId = items.map(item => ({ ...item, orderId }));
    await db.insert(orderItems).values(itemsWithOrderId);
  }

  return orderId;
}

export async function getOrdersByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}

export async function getOrderWithItems(orderId: number) {
  const db = await getDb();
  if (!db) return null;

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) return null;

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));

  return { ...order, items };
}

export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function updateOrderStatus(
  orderId: number,
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
}

export async function updateOrderPaymentStatus(
  orderId: number,
  paymentStatus: "awaiting_payment" | "paid" | "refunded",
  paymentMethod?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(orders).set({
    paymentStatus,
    ...(paymentMethod ? { paymentMethod } : {}),
  }).where(eq(orders.id, orderId));
}

export async function getPaidOrdersWithItems() {
  const db = await getDb();
  if (!db) return [];

  // Fetch all paid orders that haven't been pushed to ShipStation yet
  const paidOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.paymentStatus, "paid"))
    .orderBy(desc(orders.createdAt));

  const results = [];
  for (const order of paidOrders) {
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));
    results.push({ ...order, items });
  }
  return results;
}

export async function updateOrderShipStation(
  orderId: number,
  shipstationOrderId: string,
  trackingNumber?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(orders).set({
    shipstationOrderId,
    ...(trackingNumber ? { trackingNumber, status: "shipped" } : {}),
  }).where(eq(orders.id, orderId));
}
