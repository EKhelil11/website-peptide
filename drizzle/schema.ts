import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar, bigint } from "drizzle-orm/mysql-core";

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
  // Human-readable order ID e.g. LAP-000123
  orderNumber: varchar("orderNumber", { length: 32 }).unique(),
  userId: int("userId").default(0).notNull(),
  customerId: int("customerId"),  // custom email/password customer (nullable for legacy orders)
  status: mysqlEnum("status", [
    "pending_payment",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]).default("pending_payment").notNull(),
  // Financials (stored in cents to avoid float issues)
  subtotalCents: int("subtotalCents").notNull().default(0),
  discountCents: int("discountCents").notNull().default(0),
  discountBps: int("discountBps").notNull().default(0),
  partnerCode: varchar("partnerCode", { length: 32 }),
  shippingCents: int("shippingCents").notNull().default(700), // $7.00 flat
  taxCents: int("taxCents").notNull().default(0),
  totalCents: int("totalCents").notNull().default(0),
  // Payment
  zellePhone: varchar("zellePhone", { length: 32 }).default("(310) 975-9289"),
  paymentConfirmedAt: bigint("paymentConfirmedAt", { mode: "number" }),
  paymentConfirmedBy: int("paymentConfirmedBy"), // admin user id
  paymentNotes: text("paymentNotes"),
  // Shipping info captured at time of order
  shipName: varchar("shipName", { length: 256 }),
  shipEmail: varchar("shipEmail", { length: 320 }),
  shipPhone: varchar("shipPhone", { length: 32 }),
  shipAddress: text("shipAddress"),
  shipAddress2: varchar("shipAddress2", { length: 256 }),
  shipCity: varchar("shipCity", { length: 128 }),
  shipState: varchar("shipState", { length: 4 }),
  shipZip: varchar("shipZip", { length: 20 }),
  shipCountry: varchar("shipCountry", { length: 4 }).default("US"),
  // ShipStation integration
  shipstationOrderId: varchar("shipstationOrderId", { length: 128 }),
  shipstationOrderKey: varchar("shipstationOrderKey", { length: 256 }),
  shipstationSyncedAt: bigint("shipstationSyncedAt", { mode: "number" }),
  // Tracking (populated by ShipStation webhook)
  trackingNumber: varchar("trackingNumber", { length: 256 }),
  trackingCarrier: varchar("trackingCarrier", { length: 64 }),
  trackingService: varchar("trackingService", { length: 128 }),
  shippedAt: bigint("shippedAt", { mode: "number" }),
  estimatedDelivery: bigint("estimatedDelivery", { mode: "number" }),
  // Internal admin notes
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// ─── Human-readable order number sequence ──────────────────────────────────

export const orderNumberSequence = mysqlTable("order_number_sequence", {
  id: int("id").autoincrement().primaryKey(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderNumberSequence = typeof orderNumberSequence.$inferSelect;

// ─── Order Items ────────────────────────────────────────────────────────────

export const orderItems = mysqlTable("order_items", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: varchar("productId", { length: 128 }).notNull(),
  productName: varchar("productName", { length: 256 }).notNull(),
  variantLabel: varchar("variantLabel", { length: 128 }),
  productCategory: varchar("productCategory", { length: 128 }),
  quantity: int("quantity").notNull().default(1),
  unitPriceCents: int("unitPriceCents").notNull(),
  lineTotalCents: int("lineTotalCents").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

// ─── Order Status History ───────────────────────────────────────────────────

export const orderStatusHistory = mysqlTable("order_status_history", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  fromStatus: varchar("fromStatus", { length: 64 }),
  toStatus: varchar("toStatus", { length: 64 }).notNull(),
  changedBy: varchar("changedBy", { length: 64 }).default("system"), // "system" or admin user id
  note: text("note"),
  createdAt: bigint("createdAt", { mode: "number" }).notNull(),
});

export type OrderStatusHistory = typeof orderStatusHistory.$inferSelect;

// ─── Customer Auth (separate from Manus OAuth users) ────────────────────────

export const customers = mysqlTable("customers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 256 }).notNull(),
  firstName: varchar("firstName", { length: 128 }).notNull(),
  lastName: varchar("lastName", { length: 128 }).notNull(),
  emailVerified: int("emailVerified").default(0).notNull(), // 0=unverified, 1=verified
  verificationToken: varchar("verificationToken", { length: 128 }),
  tokenExpiry: bigint("tokenExpiry", { mode: "number" }),
  resetToken: varchar("resetToken", { length: 128 }),
  resetTokenExpiry: bigint("resetTokenExpiry", { mode: "number" }),
  partnerCode: varchar("partnerCode", { length: 32 }),
  partnerDiscountBps: int("partnerDiscountBps").default(0).notNull(),
  partnerCodeActivatedAt: timestamp("partnerCodeActivatedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

export const customerSessions = mysqlTable("customer_sessions", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  token: varchar("token", { length: 256 }).notNull().unique(),
  expiresAt: bigint("expiresAt", { mode: "number" }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CustomerSession = typeof customerSessions.$inferSelect;
