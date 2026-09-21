import { createHmac } from "node:crypto";
import { ENV } from "./_core/env";
import { isWhitcombConfigured } from "./integrationStatus";

const WHITCOMB_BASE_URL = "https://whitcombpayments.com";
const INTEGRATION_VERSION = "la-elite-web-1.0";

type WhitcombFetch = typeof globalThis.fetch;
const defaultWhitcombFetch: WhitcombFetch = globalThis.fetch.bind(globalThis);
let whitcombFetch = defaultWhitcombFetch;
let whitcombApprovalOverrideForTests = false;
let whitcombRequestTimeoutMs = 10_000;

export function __setWhitcombFetchForTests(fetcher?: WhitcombFetch) {
  if (ENV.isProduction) throw new Error("Whitcomb test transport is unavailable in production");
  whitcombFetch = fetcher ?? defaultWhitcombFetch;
  activationPromise = null;
}

export function __setWhitcombApprovalForTests(enabled = false) {
  if (ENV.isProduction) throw new Error("Whitcomb approval override is unavailable in production");
  whitcombApprovalOverrideForTests = enabled;
}

export function __setWhitcombRequestTimeoutForTests(timeoutMs = 10_000) {
  if (ENV.isProduction) throw new Error("Whitcomb timeout override is unavailable in production");
  whitcombRequestTimeoutMs = timeoutMs;
}

type WhitcombActivation = {
  merchant: string;
  brand: string;
  secret: string;
  status: string;
  armed: boolean;
  why: string;
  endpoint: string;
};

export type WhitcombPaymentStatus = {
  reference: string;
  status: "open" | "paid" | "cancelled" | string;
  paid: boolean;
  amountCents?: number;
  paidAt?: number;
  twin?: boolean;
};

export class WhitcombError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "WhitcombError";
  }
}

let activationPromise: Promise<WhitcombActivation> | null = null;

function base64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

export function signWhitcombPayload(
  fields: Record<string, unknown>,
  brand: string,
  secret: string,
  now = Date.now(),
) {
  const payload = { ...fields, b: brand, t: now };
  const encoded = base64Url(JSON.stringify(payload));
  return {
    p: encoded,
    s: createHmac("sha256", secret).update(encoded).digest("hex"),
  };
}

async function parseWhitcombResponse(response: Response) {
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    throw new WhitcombError(
      typeof data.error === "string" ? data.error : "Whitcomb Payments is temporarily unavailable.",
      response.status,
      typeof data.code === "string" ? data.code : undefined,
    );
  }
  return data;
}

async function activateWhitcomb(): Promise<WhitcombActivation> {
  if (!ENV.whitcombProcessNowKey.trim()) {
    throw new WhitcombError("Whitcomb Payments is not configured.", 503, "unconfigured");
  }

  const response = await whitcombFetch(`${WHITCOMB_BASE_URL}/api/activate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      k: ENV.whitcombProcessNowKey,
      u: "https://laelitepeps.com",
      sn: "LA Elite Peptides",
      pv: INTEGRATION_VERSION,
    }),
    signal: AbortSignal.timeout(whitcombRequestTimeoutMs),
  });
  const data = await parseWhitcombResponse(response);
  const brand = typeof data.brand === "string" ? data.brand : "";
  const secret = typeof data.secret === "string" ? data.secret : "";
  if (!brand || !secret || data.ok !== true) {
    throw new WhitcombError("Whitcomb activation returned an incomplete response.", 502, "activation_incomplete");
  }
  return {
    merchant: typeof data.merchant === "string" ? data.merchant : "",
    brand,
    secret,
    status: typeof data.status === "string" ? data.status : "unknown",
    armed: data.armed === true,
    why: typeof data.why === "string" ? data.why : "",
    endpoint: typeof data.endpoint === "string" ? data.endpoint : `${WHITCOMB_BASE_URL}/api/ingest`,
  };
}

async function getActivation() {
  activationPromise ??= activateWhitcomb().catch(error => {
    activationPromise = null;
    throw error;
  });
  return activationPromise;
}

async function signedPost(path: string, fields: Record<string, unknown>) {
  const activation = await getActivation();
  const envelope = signWhitcombPayload(fields, activation.brand, activation.secret);
  const response = await whitcombFetch(`${WHITCOMB_BASE_URL}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(envelope),
    signal: AbortSignal.timeout(whitcombRequestTimeoutMs),
  });
  return parseWhitcombResponse(response);
}

export async function getWhitcombConnectionStatus() {
  const activation = await getActivation();
  const data = await signedPost("/api/ingest", {
    a: "ping",
    u: "https://laelitepeps.com",
    sn: "LA Elite Peptides",
    pv: INTEGRATION_VERSION,
    cur: "USD",
  });
  return {
    status: typeof data.status === "string" ? data.status : activation.status,
    armed: data.armed === true,
    why: typeof data.why === "string" ? data.why : activation.why,
  };
}

export function resolveWhitcombOrigin() {
  return "https://laelitepeps.com";
}

export async function startWhitcombPayment(input: {
  orderNumber: string;
  amountCents: number;
  email: string;
  fullName: string;
  phone?: string | null;
  returnOrigin: string;
}) {
  if (!isWhitcombConfigured() && !whitcombApprovalOverrideForTests) {
    throw new WhitcombError("Credit-card checkout is not yet approved for live use.", 503, "not_approved");
  }
  const connection = await getWhitcombConnectionStatus();
  if (!connection.armed) {
    throw new WhitcombError("Credit-card checkout is temporarily unavailable.", 503, "not_armed");
  }

  const [firstName, ...lastNameParts] = input.fullName.trim().split(/\s+/);
  const data = await signedPost("/api/pn-checkout", {
    a: "checkout",
    oid: input.orderNumber,
    c: input.amountCents,
    cur: "USD",
    em: input.email,
    fn: firstName || "",
    ln: lastNameParts.join(" "),
    ph: input.phone || "",
    ret: `${input.returnOrigin}/payment/whitcomb-return?order=${encodeURIComponent(input.orderNumber)}`,
    u: input.returnOrigin,
  });

  const url = typeof data.url === "string" ? data.url : "";
  const reference = typeof data.reference === "string" ? data.reference : "";
  let trustedUrl: URL;
  try {
    trustedUrl = new URL(url);
  } catch {
    throw new WhitcombError("Whitcomb returned an invalid payment session.", 502, "invalid_session");
  }
  if (trustedUrl.origin !== WHITCOMB_BASE_URL || trustedUrl.protocol !== "https:" || !reference.startsWith("ws_")) {
    throw new WhitcombError("Whitcomb returned an invalid payment session.", 502, "invalid_session");
  }
  return { url: trustedUrl.toString(), reference, paid: data.paid === true, reused: data.reused === true };
}

export async function checkWhitcombPayment(reference: string): Promise<WhitcombPaymentStatus> {
  if (!reference.startsWith("ws_")) {
    throw new WhitcombError("Invalid Whitcomb payment reference.", 400, "invalid_reference");
  }
  const data = await signedPost("/api/pn-checkout", { a: "status", ref: reference });
  const status = typeof data.status === "string" ? data.status : "unknown";
  const paidAt = typeof data.paid_at === "string" ? Date.parse(data.paid_at) : undefined;
  return {
    reference: typeof data.reference === "string" ? data.reference : reference,
    status,
    paid: data.paid === true,
    amountCents: typeof data.amount_cents === "number" ? data.amount_cents : undefined,
    paidAt: Number.isFinite(paidAt) ? paidAt : undefined,
    twin: data.twin === true,
  };
}
