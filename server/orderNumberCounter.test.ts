import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateOrderNumber } from "./db";

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

describe("exact customer-facing order number counter", () => {
  const schema = read("drizzle/schema.ts");
  const migration = read("drizzle/0009_ancient_freak.sql");
  const db = read("server/db.ts");

  it("seeds the next order at LAP-130003 without modifying historical orders", () => {
    expect(schema).toContain('mysqlTable("order_number_counters"');
    expect(schema).toContain('name: varchar("name", { length: 64 }).primaryKey()');
    expect(schema).toContain('lastIssuedNumber: int("lastIssuedNumber").notNull()');
    expect(migration).toContain("VALUES ('orders', 130002)");
    expect(migration).not.toMatch(/UPDATE\s+`?orders`?|DELETE\s+FROM\s+`?orders`?|DROP\s+(TABLE|COLUMN)/i);
    expect(generateOrderNumber(130_003)).toBe("LAP-130003");
    expect(generateOrderNumber(130_004)).toBe("LAP-130004");
  });

  it("uses one atomic named-row increment inside the order transaction", () => {
    expect(db).toContain("return db.transaction(async tx => {");
    expect(db).toContain(".update(orderNumberCounters)");
    expect(db).toContain("lastIssuedNumber: sql`${orderNumberCounters.lastIssuedNumber} + 1`");
    expect(db).toContain('eq(orderNumberCounters.name, "orders")');
    expect(db).toContain('throw new Error("Order number counter is not initialized")');
    expect(db).toContain("generateOrderNumber(counter.lastIssuedNumber)");
    expect(db).not.toContain(".insert(orderNumberSequence)");
  });

  it("wins the checkout idempotency key before reserving a customer-facing number", () => {
    const orderInsert = db.indexOf("tx.insert(orders)");
    const counterUpdate = db.indexOf("tx\n      .update(orderNumberCounters)");
    expect(orderInsert).toBeGreaterThan(-1);
    expect(counterUpdate).toBeGreaterThan(-1);
    expect(orderInsert).toBeLessThan(counterUpdate);
  });
});
