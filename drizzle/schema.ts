import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  // Compliance: timestamped record of Research Use Only terms acceptance
  termsAcceptedAt: timestamp("termsAcceptedAt"),
  termsVersion: varchar("termsVersion", { length: 16 }),
  // Extended profile fields for order portal
  phone: varchar("phone", { length: 32 }),
  shippingAddress: text("shippingAddress"),
  shippingCity: varchar("shippingCity", { length: 128 }),
  shippingState: varchar("shippingState", { length: 64 }),
  shippingZip: varchar("shippingZip", { length: 20 }),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Orders ────────────────────────────────────────────────────────────────

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]).default("pending").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["awaiting_payment", "paid", "refunded"]).default("awaiting_payment").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 64 }).default("pending"),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  // Shipping info captured at time of order
  shipName: varchar("shipName", { length: 256 }),
  shipEmail: varchar("shipEmail", { length: 320 }),
  shipPhone: varchar("shipPhone", { length: 32 }),
  shipAddress: text("shipAddress"),
  shipCity: varchar("shipCity", { length: 128 }),
  shipState: varchar("shipState", { length: 64 }),
  shipZip: varchar("shipZip", { length: 20 }),
  // ShipStation integration
  shipstationOrderId: varchar("shipstationOrderId", { length: 128 }),
  trackingNumber: varchar("trackingNumber", { length: 256 }),
  // Customer notes
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// ─── Order Items ────────────────────────────────────────────────────────────

export const orderItems = mysqlTable("order_items", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: varchar("productId", { length: 128 }).notNull(),
  productName: varchar("productName", { length: 256 }).notNull(),
  productCategory: varchar("productCategory", { length: 128 }),
  quantity: int("quantity").notNull().default(1),
  unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull(),
  lineTotal: decimal("lineTotal", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;
