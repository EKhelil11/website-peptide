import { afterEach, describe, expect, it, vi } from "vitest";
import { ENV } from "./_core/env";
import { evaluateIntegrationStatus } from "./integrationStatus";
import {
  __setShipStationFetchForTests,
  __setShipStationRequestTimeoutForTests,
  buildSSOrderPayload,
  createOrUpdateSSOrder,
  deleteSSOrder,
  getSSOrder,
} from "./shipstation";

const originalShipstationApiKey = ENV.shipstationApiKey;
const originalShipstationApiSecret = ENV.shipstationApiSecret;
const originalLiveShipstationEnabled = ENV.liveShipstationEnabled;

afterEach(() => {
  ENV.shipstationApiKey = originalShipstationApiKey;
  ENV.shipstationApiSecret = originalShipstationApiSecret;
  ENV.liveShipstationEnabled = originalLiveShipstationEnabled;
  __setShipStationFetchForTests();
  __setShipStationRequestTimeoutForTests();
});

function controlledPayload() {
  return buildSSOrderPayload({
    orderNumber: "LAP-CONTRACT",
    shipName: "Contract Test",
    shipEmail: "contract@example.com",
    shipPhone: null,
    shipAddress: "1 Test Way",
    shipAddress2: null,
    shipCity: "Los Angeles",
    shipState: "CA",
    shipZip: "90001",
    shipCountry: "US",
    subtotalCents: 1000,
    shippingCents: 700,
    taxCents: 80,
    totalCents: 1780,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    status: "paid",
    items: [{
      productId: "contract-item",
      productName: "Contract Item",
      variantLabel: null,
      quantity: 1,
      unitPriceCents: 1000,
    }],
  });
}

describe("ShipStation configuration and payload", () => {
  it("is disabled unless both credentials are present", () => {
    expect(evaluateIntegrationStatus({}).shipstation.configured).toBe(false);
    expect(
      evaluateIntegrationStatus({ shipstationApiKey: "key-only" }).shipstation.configured,
    ).toBe(false);
    expect(
      evaluateIntegrationStatus({
        shipstationApiKey: "key",
        shipstationApiSecret: "secret",
        liveShipstationEnabled: true,
      }).shipstation.configured,
    ).toBe(true);
  });

  it("keeps fulfillment disabled when credentials exist without owner approval", () => {
    const status = evaluateIntegrationStatus({
      shipstationApiKey: "key",
      shipstationApiSecret: "secret",
    });
    expect(status.shipstation.credentialsPresent).toBe(true);
    expect(status.shipstation.approved).toBe(false);
    expect(status.shipstation.configured).toBe(false);
    expect(status.shipstation.message).toContain("owner approval");
  });

  it("builds an awaiting-shipment order without making a network request", () => {
    const payload = controlledPayload();

    expect(payload.orderStatus).toBe("awaiting_shipment");
    expect(payload.orderKey).toBe("LAP-CONTRACT");
    expect(payload.amountPaid).toBe(17.8);
  });

  it("does not contact ShipStation when credentials exist without approval", async () => {
    ENV.shipstationApiKey = "key";
    ENV.shipstationApiSecret = "secret";
    ENV.liveShipstationEnabled = false;
    const fetcher = vi.fn();
    __setShipStationFetchForTests(fetcher as never);

    await expect(createOrUpdateSSOrder(controlledPayload())).rejects.toThrow(
      "disabled pending credentials and owner approval",
    );
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("calls the injected ShipStation transport once when credentials and approval are present", async () => {
    ENV.shipstationApiKey = "key";
    ENV.shipstationApiSecret = "secret";
    ENV.liveShipstationEnabled = true;
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        orderId: 123,
        orderNumber: "LAP-CONTRACT",
        orderKey: "LAP-CONTRACT",
        orderStatus: "awaiting_shipment",
        orderDate: "2026-01-01T00:00:00.000Z",
        createDate: "2026-01-01T00:00:00.000Z",
        modifyDate: "2026-01-01T00:00:00.000Z",
      }), { status: 200, headers: { "Content-Type": "application/json" } }),
    );
    __setShipStationFetchForTests(fetcher as never);

    const result = await createOrUpdateSSOrder(controlledPayload());

    expect(result.orderId).toBe(123);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith(
      "https://ssapi.shipstation.com/orders/createorder",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("aborts a hanging ShipStation transport at the configured request deadline", async () => {
    ENV.shipstationApiKey = "key";
    ENV.shipstationApiSecret = "secret";
    ENV.liveShipstationEnabled = true;
    __setShipStationRequestTimeoutForTests(5);
    const fetcher = vi.fn((_url: string | URL | Request, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
    }));
    __setShipStationFetchForTests(fetcher as typeof fetch);

    await expect(createOrUpdateSSOrder(controlledPayload())).rejects.toMatchObject({ name: "AbortError" });
    expect(fetcher).toHaveBeenCalledWith(
      "https://ssapi.shipstation.com/orders/createorder",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("retrieves and soft-deletes an approved test order without requesting labels or postage", async () => {
    ENV.shipstationApiKey = "key";
    ENV.shipstationApiSecret = "secret";
    ENV.liveShipstationEnabled = true;
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({
          orderId: 123,
          orderNumber: "LAP-CONTRACT",
          orderKey: "LAP-CONTRACT",
          orderStatus: "awaiting_payment",
          orderDate: "2026-01-01T00:00:00.000Z",
          createDate: "2026-01-01T00:00:00.000Z",
          modifyDate: "2026-01-01T00:00:00.000Z",
        }), { status: 200, headers: { "Content-Type": "application/json" } }),
      )
      .mockResolvedValueOnce(new Response("", { status: 200 }));
    __setShipStationFetchForTests(fetcher as never);

    const order = await getSSOrder(123);
    await deleteSSOrder(123);

    expect(order.orderNumber).toBe("LAP-CONTRACT");
    expect(fetcher).toHaveBeenNthCalledWith(
      1,
      "https://ssapi.shipstation.com/orders/123",
      expect.objectContaining({ method: "GET" }),
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      2,
      "https://ssapi.shipstation.com/orders/123",
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});
