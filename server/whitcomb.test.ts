import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createHmac } from "node:crypto";
import { ENV } from "./_core/env";
import {
  __setWhitcombApprovalForTests,
  __setWhitcombFetchForTests,
  __setWhitcombRequestTimeoutForTests,
  checkWhitcombPayment,
  signWhitcombPayload,
  startWhitcombPayment,
  WhitcombError,
} from "./whitcomb";

const originalKey = ENV.whitcombProcessNowKey;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("Whitcomb Process Now client", () => {
  beforeEach(() => {
    ENV.whitcombProcessNowKey = "WPN-TEST-ONLY-KEY";
    __setWhitcombApprovalForTests(true);
  });

  afterEach(() => {
    __setWhitcombFetchForTests();
    __setWhitcombApprovalForTests(false);
    __setWhitcombRequestTimeoutForTests();
    ENV.whitcombProcessNowKey = originalKey;
    vi.restoreAllMocks();
  });

  it("signs the exact base64url payload with HMAC-SHA256 and a deterministic timestamp", () => {
    const envelope = signWhitcombPayload({ a: "status", ref: "ws_test" }, "brand", "secret", 1234);
    const decoded = JSON.parse(Buffer.from(envelope.p, "base64url").toString("utf8"));
    expect(decoded).toEqual({ a: "status", ref: "ws_test", b: "brand", t: 1234 });
    expect(envelope.s).toBe(createHmac("sha256", "secret").update(envelope.p).digest("hex"));
    expect(envelope.p).not.toContain("=");
  });

  it("aborts a hanging Whitcomb transport at the configured request deadline", async () => {
    __setWhitcombRequestTimeoutForTests(5);
    const fetcher = vi.fn((_url: string | URL | Request, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
    }));
    __setWhitcombFetchForTests(fetcher as typeof fetch);

    await expect(startWhitcombPayment({
      orderNumber: "LAP-130002",
      amountCents: 20140,
      email: "buyer@example.com",
      fullName: "Test Buyer",
      returnOrigin: "https://laelitepeps.com",
    })).rejects.toMatchObject({ name: "AbortError" });
    expect(fetcher).toHaveBeenCalledWith(
      "https://whitcombpayments.com/api/activate",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("opens hosted card checkout only after activation and an armed signed status check", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ ok: true, brand: "lap", secret: "store-secret", status: "active", armed: true }))
      .mockResolvedValueOnce(jsonResponse({ ok: true, status: "active", armed: true }))
      .mockResolvedValueOnce(jsonResponse({ ok: true, url: "https://whitcombpayments.com/pay/?t=ws_test", reference: "ws_test" }));
    __setWhitcombFetchForTests(fetcher as typeof fetch);

    const result = await startWhitcombPayment({
      orderNumber: "LAP-130002",
      amountCents: 20140,
      email: "buyer@example.com",
      fullName: "Test Buyer",
      phone: "3105550100",
      returnOrigin: "https://laelitepeps.com",
    });

    expect(result).toEqual({
      url: "https://whitcombpayments.com/pay/?t=ws_test",
      reference: "ws_test",
      paid: false,
      reused: false,
    });
    expect(fetcher).toHaveBeenCalledTimes(3);
    const checkoutEnvelope = JSON.parse(String((fetcher.mock.calls[2][1] as RequestInit).body));
    const checkoutPayload = JSON.parse(Buffer.from(checkoutEnvelope.p, "base64url").toString("utf8"));
    expect(checkoutPayload).toMatchObject({
      a: "checkout",
      oid: "LAP-130002",
      c: 20140,
      cur: "USD",
      ret: "https://laelitepeps.com/payment/whitcomb-return?order=LAP-130002",
      u: "https://laelitepeps.com",
    });
    expect(checkoutPayload).not.toHaveProperty("cardNumber");
    expect(checkoutPayload).not.toHaveProperty("cvv");
  });

  it("does not request a payment session while Whitcomb is paused or not armed", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ ok: true, brand: "lap", secret: "store-secret", status: "active", armed: false }))
      .mockResolvedValueOnce(jsonResponse({ ok: true, status: "active", armed: false, why: "temporarily paused" }));
    __setWhitcombFetchForTests(fetcher as typeof fetch);

    await expect(startWhitcombPayment({
      orderNumber: "LAP-130002",
      amountCents: 20140,
      email: "buyer@example.com",
      fullName: "Test Buyer",
      returnOrigin: "https://laelitepeps.com",
    })).rejects.toMatchObject({ code: "not_armed", status: 503 });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("rejects a checkout URL outside Whitcomb's exact HTTPS origin", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ ok: true, brand: "lap", secret: "store-secret", status: "active", armed: true }))
      .mockResolvedValueOnce(jsonResponse({ ok: true, status: "active", armed: true }))
      .mockResolvedValueOnce(jsonResponse({ ok: true, url: "https://whitcombpayments.com.evil.example/pay/?t=ws_test", reference: "ws_test" }));
    __setWhitcombFetchForTests(fetcher as typeof fetch);

    await expect(startWhitcombPayment({
      orderNumber: "LAP-130002",
      amountCents: 20140,
      email: "buyer@example.com",
      fullName: "Test Buyer",
      returnOrigin: "https://laelitepeps.com",
    })).rejects.toMatchObject({ code: "invalid_session", status: 502 });
  });

  it("maps paid status with authoritative cents and paid timestamp", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ ok: true, brand: "lap", secret: "store-secret", status: "active", armed: true }))
      .mockResolvedValueOnce(jsonResponse({ ok: true, reference: "ws_paid", status: "paid", paid: true, amount_cents: 20140, paid_at: "2026-09-20T18:00:00.000Z" }));
    __setWhitcombFetchForTests(fetcher as typeof fetch);

    await expect(checkWhitcombPayment("ws_paid")).resolves.toMatchObject({
      reference: "ws_paid",
      status: "paid",
      paid: true,
      amountCents: 20140,
      paidAt: Date.parse("2026-09-20T18:00:00.000Z"),
    });
  });

  it("keeps a cancelled payment unpaid", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ ok: true, brand: "lap", secret: "store-secret", status: "active", armed: true }))
      .mockResolvedValueOnce(jsonResponse({ ok: true, reference: "ws_cancelled", status: "cancelled", paid: false }));
    __setWhitcombFetchForTests(fetcher as typeof fetch);
    await expect(checkWhitcombPayment("ws_cancelled")).resolves.toMatchObject({ paid: false, status: "cancelled" });
  });

  it("rejects forged, stale, or unlinked provider responses instead of trusting the redirect", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ ok: true, brand: "lap", secret: "store-secret", status: "active", armed: true }))
      .mockResolvedValueOnce(jsonResponse({ error: "Signature rejected.", code: "unlinked" }, 401));
    __setWhitcombFetchForTests(fetcher as typeof fetch);
    await expect(checkWhitcombPayment("ws_forged")).rejects.toMatchObject<Partial<WhitcombError>>({
      status: 401,
      code: "unlinked",
    });
  });
});
