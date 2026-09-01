/**
 * ShipStation API helper
 * Docs: https://www.shipstation.com/docs/api/
 *
 * Authentication: HTTP Basic — API Key as username, API Secret as password.
 * Base URL: https://ssapi.shipstation.com
 */

import { ENV } from "./_core/env";
import { isShipStationConfigured } from "./integrationStatus";

const SS_BASE = "https://ssapi.shipstation.com";
type ShipStationFetch = typeof globalThis.fetch;
const defaultShipStationFetch: ShipStationFetch = globalThis.fetch.bind(globalThis);
let shipStationFetch = defaultShipStationFetch;

export function __setShipStationFetchForTests(fetcher?: ShipStationFetch) {
  if (ENV.isProduction) throw new Error("ShipStation test transport is unavailable in production");
  shipStationFetch = fetcher ?? defaultShipStationFetch;
}

function authHeader(): string {
  if (!isShipStationConfigured()) {
    throw new Error("ShipStation is disabled pending credentials and owner approval");
  }
  const key = ENV.shipstationApiKey;
  const secret = ENV.shipstationApiSecret;
  if (!key || !secret) throw new Error("ShipStation API credentials not configured");
  return "Basic " + Buffer.from(`${key}:${secret}`).toString("base64");
}

async function ssRequest<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown
): Promise<T> {
  const res = await shipStationFetch(`${SS_BASE}${path}`, {
    method,
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`ShipStation ${method} ${path} → ${res.status}: ${text.substring(0, 300)}`);
  }
  return text ? (JSON.parse(text) as T) : ({} as T);
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SSOrderItem {
  lineItemKey: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number; // dollars
}

export interface SSCreateOrderPayload {
  orderNumber: string;
  orderKey: string;
  orderDate: string; // ISO 8601
  orderStatus: "awaiting_payment" | "awaiting_shipment" | "shipped" | "on_hold" | "cancelled";
  customerUsername?: string;
  customerEmail: string;
  billTo: SSAddress;
  shipTo: SSAddress;
  items: SSOrderItem[];
  amountPaid: number; // dollars
  taxAmount: number;
  shippingAmount: number;
  internalNotes?: string;
  gift?: boolean;
  requestedShippingService?: string;
  carrierCode?: string;
  serviceCode?: string;
  packageCode?: string;
  confirmation?: string;
  shipDate?: string;
  weight?: { value: number; units: "ounces" | "grams" | "pounds" };
}

export interface SSAddress {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  residential?: boolean;
}

export interface SSOrderResponse {
  orderId: number;
  orderNumber: string;
  orderKey: string;
  orderStatus: string;
  orderDate: string;
  createDate: string;
  modifyDate: string;
}

export interface SSShipmentItem {
  orderId: number;
  orderNumber: string;
  shipDate: string;
  trackingNumber: string;
  carrierCode: string;
  serviceCode: string;
  voided: boolean;
}

export interface SSShipmentsResponse {
  shipments: SSShipmentItem[];
  total: number;
  page: number;
  pages: number;
}

// ─── Public helpers ──────────────────────────────────────────────────────────

/**
 * Create or update an order in ShipStation.
 * ShipStation uses orderKey for idempotency — same key = update, not duplicate.
 */
export async function createOrUpdateSSOrder(
  payload: SSCreateOrderPayload
): Promise<SSOrderResponse> {
  return ssRequest<SSOrderResponse>("POST", "/orders/createorder", payload);
}

/**
 * Fetch shipments for a given ShipStation order ID.
 * Returns the latest tracking info.
 */
export async function getSSShipmentsForOrder(
  ssOrderId: number
): Promise<SSShipmentItem[]> {
  const data = await ssRequest<SSShipmentsResponse>(
    "GET",
    `/shipments?orderId=${ssOrderId}&pageSize=10`
  );
  return data.shipments ?? [];
}

/**
 * Fetch shipments by order number (useful when we don't have the SS order ID yet).
 */
export async function getSSShipmentsByOrderNumber(
  orderNumber: string
): Promise<SSShipmentItem[]> {
  const data = await ssRequest<SSShipmentsResponse>(
    "GET",
    `/shipments?orderNumber=${encodeURIComponent(orderNumber)}&pageSize=10`
  );
  return data.shipments ?? [];
}

/**
 * Build a ShipStation order payload from our internal order + items.
 */
export function buildSSOrderPayload(order: {
  orderNumber: string;
  shipName: string | null;
  shipEmail: string | null;
  shipPhone: string | null;
  shipAddress: string | null;
  shipAddress2: string | null | undefined;
  shipCity: string | null;
  shipState: string | null;
  shipZip: string | null;
  shipCountry: string | null;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  createdAt: Date;
  status: string;
  items: Array<{
    productId: string;
    productName: string;
    variantLabel: string | null | undefined;
    quantity: number;
    unitPriceCents: number;
  }>;
}): SSCreateOrderPayload {
  const shipTo: SSAddress = {
    name: order.shipName ?? "Customer",
    street1: order.shipAddress ?? "",
    street2: order.shipAddress2 ?? undefined,
    city: order.shipCity ?? "",
    state: order.shipState ?? "",
    postalCode: order.shipZip ?? "",
    country: order.shipCountry ?? "US",
    phone: order.shipPhone ?? undefined,
    residential: true,
  };

  const ssStatus =
    order.status === "paid" || order.status === "processing"
      ? "awaiting_shipment"
      : order.status === "shipped"
      ? "shipped"
      : order.status === "cancelled"
      ? "cancelled"
      : "awaiting_payment";

  return {
    orderNumber: order.orderNumber,
    orderKey: order.orderNumber, // idempotency key
    orderDate: order.createdAt.toISOString(),
    orderStatus: ssStatus,
    customerEmail: order.shipEmail ?? "",
    billTo: shipTo,
    shipTo,
    items: order.items.map((item, idx) => ({
      lineItemKey: `${order.orderNumber}-${idx + 1}`,
      sku: item.productId,
      name: item.productName + (item.variantLabel ? ` (${item.variantLabel})` : ""),
      quantity: item.quantity,
      unitPrice: item.unitPriceCents / 100,
    })),
    amountPaid: order.totalCents / 100,
    taxAmount: order.taxCents / 100,
    shippingAmount: order.shippingCents / 100,
    internalNotes: `LA Elite Peptides order. Payment via Zelle.`,
    requestedShippingService: "USPS Priority Mail",
  };
}
