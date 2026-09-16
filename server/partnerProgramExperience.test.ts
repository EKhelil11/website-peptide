import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const readSource = (relativePath: string) => fs.readFileSync(path.join(projectRoot, relativePath), "utf8");

describe("RECROOMLV persistent partner-program experience", () => {
  const schema = readSource("drizzle/schema.ts");
  const migration = readSource("drizzle/0005_sour_ironclad.sql");
  const db = readSource("server/db.ts");
  const orderRouter = readSource("server/orderRouter.ts");
  const customerRouter = readSource("server/customerRouter.ts");
  const checkout = readSource("client/src/pages/Checkout.tsx");
  const account = readSource("client/src/pages/Account.tsx");
  const admin = readSource("client/src/pages/AdminOrders.tsx");
  const email = readSource("server/email.ts");
  const shipstation = readSource("server/shipstation.ts");

  it("adds only additive persistent customer and immutable order fields", () => {
    expect(schema).toContain('partnerCode: varchar("partnerCode", { length: 32 })');
    expect(schema).toContain('partnerDiscountBps: int("partnerDiscountBps").default(0).notNull()');
    expect(schema).toContain('partnerCodeActivatedAt: timestamp("partnerCodeActivatedAt")');
    expect(schema).toContain('discountCents: int("discountCents").notNull().default(0)');
    expect(schema).toContain('discountBps: int("discountBps").notNull().default(0)');
    expect(schema).toContain('mysqlTable("order_number_sequence"');
    expect(migration).toContain("AUTO_INCREMENT = 100099");
    expect(migration).not.toMatch(/DROP\s+(TABLE|COLUMN)/i);
  });

  it("creates orders and first-use eligibility in one transaction", () => {
    expect(db).toContain("return db.transaction(async tx => {");
    expect(db).toContain(".insert(orderNumberSequence)");
    expect(db).toContain("const orderNumber = generateOrderNumber(sequenceId)");
    expect(db).toContain("await tx.insert(orders).values");
    expect(db).toContain("await tx.insert(orderItems).values");
    expect(db).toContain("await tx.insert(orderStatusHistory).values");
    expect(db).toContain("partnerCodeActivatedAt: new Date()");
  });

  it("uses an authenticated authoritative quote for preview and submit", () => {
    expect(orderRouter).toContain("quote: customerProtectedProcedure");
    expect(orderRouter).toContain("calculateOrderQuote({");
    expect(orderRouter).toContain("requestedCode: partnerCode");
    expect(orderRouter).toContain("savedCode: customer.partnerCode");
    expect(orderRouter).toContain("savedDiscountBps: customer.partnerDiscountBps");
    expect(orderRouter).toContain('throw new TRPCError({ code: "BAD_REQUEST", message: error.message })');
    expect(orderRouter).toContain("discountCents: quote.discountCents");
    expect(orderRouter).toContain('Partner attribution: ${quote.partnerCode} (Las Vegas gym)');
  });

  it("exposes the saved benefit only to the signed-in customer and renders it in checkout/account", () => {
    expect(customerRouter).toContain("partnerCode: customer.partnerCode");
    expect(customerRouter).toContain("partnerDiscountBps: customer.partnerDiscountBps");
    expect(checkout).toContain("Partner Code (optional)");
    expect(checkout).toContain("RECROOMLV accepted. Your 10% merchandise discount will remain on this account for future orders.");
    expect(checkout).toContain("Your saved 10% merchandise discount is applied automatically to this and future orders.");
    expect(checkout).toContain("Partner discount (10%)");
    expect(account).toContain("RECROOMLV partner benefit active");
    expect(account).toContain("Partner discount (10%)");
  });

  it("makes partner attribution obvious in admin and searchable without replacing freeform notes", () => {
    expect(admin).toContain("Partner Attribution");
    expect(admin).toContain("Las Vegas gym · checkout code");
    expect(admin).toContain('(o.partnerCode ?? "").toLowerCase().includes(q)');
    expect(admin).toContain("Partner discount (10%)");
    expect(admin).toContain("adminNotes");
  });

  it("keeps order emails and later ShipStation handoff consistent with the saved discount", () => {
    expect(email).toContain("Partner discount (10%)");
    expect(email).toContain("[RECROOMLV] Las Vegas Gym Order ${params.orderNumber}");
    expect(email).toContain("RECROOMLV Partner Alert");
    expect(email).toContain("New Las Vegas gym client order");
    expect(shipstation).toContain("Partner code ${order.partnerCode} · Las Vegas gym");
    expect(shipstation).toContain("amountPaid: order.totalCents / 100");
    expect(shipstation).toContain("taxAmount: order.taxCents / 100");
    expect(shipstation).toContain("shippingAmount: order.shippingCents / 100");
  });
});
