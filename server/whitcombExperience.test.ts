import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

describe("Whitcomb hosted-card experience", () => {
  it("uses an additive migration and leaves the LAP order sequence untouched", () => {
    const sql = `${read("drizzle/0007_fearless_anita_blake.sql")}\n${read("drizzle/0008_mushy_hitman.sql")}`;
    expect(sql).toContain("paymentProviderReference");
    expect(sql).toContain("system_jobs");
    expect(sql).toContain("paymentMethod");
    expect(sql).not.toMatch(/DROP\s+(TABLE|COLUMN)/i);
    expect(sql).not.toContain("order_number_sequence");
    expect(sql).toContain("checkoutIdempotencyKey");
    expect(sql).toContain("paymentProviderCheckoutUrl");
    expect(sql).toContain("leaseExpiresAt");
  });

  it("keeps secrets and HMAC signing exclusively on the server", () => {
    const clientSource = [
      read("client/src/pages/Checkout.tsx"),
      read("client/src/pages/WhitcombReturn.tsx"),
      read("client/src/pages/Account.tsx"),
    ].join("\n");
    expect(clientSource).not.toContain("WHITCOMB_PROCESS_NOW_KEY");
    expect(clientSource).not.toContain("store-secret");
    expect(clientSource).not.toMatch(/cardNumber|securityCode|\bcvv\b/i);

    const serverSource = read("server/whitcomb.ts");
    expect(serverSource).toContain("createHmac(\"sha256\"");
    expect(serverSource).toContain("isWhitcombConfigured()");
    expect(serverSource).toContain("trustedUrl.origin !== WHITCOMB_BASE_URL");
  });

  it("preserves Zelle and adds hosted card checkout with authoritative return verification", () => {
    const checkout = read("client/src/pages/Checkout.tsx");
    const router = read("server/orderRouter.ts");
    const returnPage = read("client/src/pages/WhitcombReturn.tsx");
    expect(checkout).toContain('useState<"zelle" | "whitcomb_card">("zelle")');
    expect(checkout).toContain("Credit or Debit Card");
    expect(checkout).toContain("Card details never pass through this site");
    expect(router).toContain('z.enum(["zelle", "whitcomb_card"])');
    expect(router).toContain("reconcileWhitcombOrder");
    expect(returnPage).toContain("Card Payment Confirmed");
    expect(returnPage).toContain("confirmWhitcombReturn");
  });

  it("shows payment attribution in customer and Admin views and blocks manual card confirmation", () => {
    const account = read("client/src/pages/Account.tsx");
    const admin = read("client/src/pages/AdminOrders.tsx");
    const db = read("server/db.ts");
    const router = read("server/orderRouter.ts");
    expect(account).toContain("Resume Secure Card Payment");
    expect(admin).toContain("Whitcomb Card Payment");
    expect(admin).toContain('order.paymentMethod === "zelle"');
    expect(router).toContain("cannot be marked paid manually");
    expect(db).toContain('eq(orders.totalCents, input.amountCents)');
  });

  it("authenticates scheduled reconciliation by platform task UID and never by request payload", () => {
    const scheduled = read("server/whitcombScheduled.ts");
    const orchestration = read("server/paymentOrchestration.ts");
    const notification = read("server/_core/notification.ts");
    const shipstation = read("server/shipstation.ts");
    expect(scheduled).toContain("user.isCron");
    expect(scheduled).toContain("getSystemJobByTaskUid(user.taskUid)");
    expect(scheduled).not.toContain("req.body");
    expect(scheduled).toContain("claimSystemJobLease");
    expect(scheduled).toContain("ENDPOINT_DEADLINE_MS");
    expect(scheduled).toContain("getPendingWhitcombOrders(5");
    expect(orchestration).toContain("claimWhitcombPaymentPoll");
    expect(orchestration).toContain("sendPaymentConfirmedEmailAbortable");
    expect(orchestration).toContain("AbortSignal.timeout(8_000)");
    expect(notification).toContain("signal: AbortSignal = AbortSignal.timeout(8_000)");
    expect(shipstation).toContain("signal: AbortSignal.timeout(shipStationRequestTimeoutMs)");
    expect(read("server/whitcomb.ts")).toContain("signal: AbortSignal.timeout(whitcombRequestTimeoutMs)");
    expect(read("server/whitcombScheduled.test.ts")).toContain("returns 202 partial at the endpoint deadline");
    expect(read("server/_core/index.ts")).toContain("/api/scheduled/reconcile-whitcomb-payments");
  });

  it("deduplicates checkout and Zelle confirmation while strictly attaching one hosted session", () => {
    const router = read("server/orderRouter.ts");
    const db = read("server/db.ts");
    const checkout = read("client/src/pages/Checkout.tsx");
    expect(router).toContain("getOrderByCheckoutKey");
    expect(router).toContain("submitResultFromExistingOrder");
    expect(router).toContain("withoutHostedPaymentUrl");
    expect(router).toContain('code: "CONFLICT"');
    expect(checkout).toContain("crypto.randomUUID()");
    expect(db).toContain("Whitcomb payment session reference conflict");
    expect(db).toContain('eq(orders.status, "pending_payment")');
    expect(db).toContain('eq(orders.paymentMethod, "zelle")');
    expect(db.indexOf("tx.insert(orders)")).toBeLessThan(db.indexOf("tx\n      .insert(orderNumberSequence)"));
  });
});
