import { describe, expect, it } from "vitest";

const runLiveCredentialTests = process.env.RUN_LIVE_CREDENTIAL_TESTS === "true";
const liveIt = runLiveCredentialTests ? it : it.skip;

describe("live integration credentials", () => {
  liveIt("authenticates a sending-only Resend key without delivering an email", async () => {
    const apiKey = process.env.RESEND_API_KEY;
    expect(apiKey, "RESEND_API_KEY must be configured").toBeTruthy();

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "la-elite-peptides-credential-check/1.0",
      },
      body: "{}",
    });

    const payload = (await response.json()) as { message?: string; name?: string };
    expect([400, 422], "Incomplete request should be rejected before sending").toContain(
      response.status,
    );
    expect(payload.message?.toLowerCase()).not.toContain("api key is invalid");
    expect(payload.message?.toLowerCase()).toMatch(/from|to|subject|required/);
  }, 20_000);

  liveIt("authenticates to ShipStation V1 with a read-only carriers request", async () => {
    const apiKey = process.env.SHIPSTATION_API_KEY;
    const apiSecret = process.env.SHIPSTATION_API_SECRET;
    expect(apiKey, "SHIPSTATION_API_KEY must be configured").toBeTruthy();
    expect(apiSecret, "SHIPSTATION_API_SECRET must be configured").toBeTruthy();

    const authorization = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
    const response = await fetch("https://ssapi.shipstation.com/carriers", {
      headers: {
        Authorization: `Basic ${authorization}`,
        "User-Agent": "la-elite-peptides-credential-check/1.0",
      },
    });

    expect(response.status, "ShipStation credential check should return HTTP 200").toBe(200);
    const payload = await response.json();
    expect(Array.isArray(payload), "ShipStation carriers response should be an array").toBe(true);
  }, 20_000);
});
