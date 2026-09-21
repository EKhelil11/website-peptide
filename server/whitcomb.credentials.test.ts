import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";

const activationKey = process.env.WHITCOMB_PROCESS_NOW_KEY;
const liveIt = activationKey && process.env.RUN_WHITCOMB_CREDENTIAL_TEST === "true" ? it : it.skip;

function signPayload(fields: Record<string, unknown>, brand: string, secret: string) {
  const payload = { ...fields, b: brand, t: Date.now() };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(encoded).digest("hex");
  return { p: encoded, s: signature };
}

describe("Whitcomb Process Now credential", () => {
  liveIt(
    "activates the supplied key and completes a signed status check without starting a payment",
    async () => {
      const activationResponse = await fetch("https://whitcombpayments.com/api/activate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          k: activationKey,
          u: "https://laelitepeps.com",
          sn: "LA Elite Peptides",
          pv: "private-integration-validation",
        }),
        signal: AbortSignal.timeout(20_000),
      });

      expect(activationResponse.status).toBe(200);
      const activation = (await activationResponse.json()) as Record<string, unknown>;
      expect(activation.ok).toBe(true);
      expect(typeof activation.brand).toBe("string");
      expect((activation.brand as string).length).toBeGreaterThan(0);
      expect(typeof activation.secret).toBe("string");
      expect((activation.secret as string).length).toBeGreaterThan(0);

      const signed = signPayload(
        {
          a: "ping",
          u: "https://laelitepeps.com",
          sn: "LA Elite Peptides",
          pv: "private-integration-validation",
          cur: "USD",
        },
        activation.brand as string,
        activation.secret as string,
      );
      const pingResponse = await fetch("https://whitcombpayments.com/api/ingest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(signed),
        signal: AbortSignal.timeout(20_000),
      });

      expect(pingResponse.status).toBe(200);
      const ping = (await pingResponse.json()) as Record<string, unknown>;
      expect(ping.ok).toBe(true);
      expect(typeof ping.status).toBe("string");
      expect(typeof ping.armed).toBe("boolean");
      console.info(`[Whitcomb] Credential valid; status=${String(ping.status)}; armed=${String(ping.armed)}`);
    },
    45_000,
  );
});
