import { describe, expect, it } from "vitest";
import { evaluateIntegrationStatus } from "./integrationStatus";
import { buildSSOrderPayload } from "./shipstation";

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
    const payload = buildSSOrderPayload({
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

    expect(payload.orderStatus).toBe("awaiting_shipment");
    expect(payload.orderKey).toBe("LAP-CONTRACT");
    expect(payload.amountPaid).toBe(17.8);
  });
});
