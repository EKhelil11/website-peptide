import { describe, it, expect } from "vitest";

describe("ShipStation API key", () => {
  it("should be set in environment", () => {
    const key = process.env.SHIPSTATION_API_KEY;
    expect(key).toBeTruthy();
    expect(typeof key).toBe("string");
    expect(key!.length).toBeGreaterThan(10);
  });

  it("should authenticate with ShipStation API", async () => {
    const key = process.env.SHIPSTATION_API_KEY;
    if (!key) {
      console.warn("SHIPSTATION_API_KEY not set, skipping live test");
      return;
    }

    const secret = process.env.SHIPSTATION_API_SECRET;
    const response = await fetch("https://ssapi.shipstation.com/accounts/listtags", {
      headers: {
        Authorization: `Basic ${Buffer.from(`${key}:${secret ?? ""}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
    });

    // 200 = valid key, 401 = invalid key
    expect(response.status).not.toBe(401);
    expect([200, 403, 404]).toContain(response.status);
  }, 15000);
});
