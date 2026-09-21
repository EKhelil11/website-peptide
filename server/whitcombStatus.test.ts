import { describe, expect, it } from "vitest";
import { evaluateIntegrationStatus } from "./integrationStatus";

describe("Whitcomb integration approval gate", () => {
  it("stays disabled without a Process Now key", () => {
    expect(evaluateIntegrationStatus({}).whitcomb.configured).toBe(false);
  });

  it("does not enable live checkout from credentials alone", () => {
    const status = evaluateIntegrationStatus({ whitcombProcessNowKey: "WPN-SECURE" }).whitcomb;
    expect(status.credentialsPresent).toBe(true);
    expect(status.approved).toBe(false);
    expect(status.configured).toBe(false);
  });

  it("requires both the key and explicit owner live approval", () => {
    const status = evaluateIntegrationStatus({
      whitcombProcessNowKey: "WPN-SECURE",
      liveWhitcombEnabled: true,
    }).whitcomb;
    expect(status.configured).toBe(true);
    expect(status.message).toContain("approved for live use");
  });
});
