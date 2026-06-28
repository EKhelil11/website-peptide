import { describe, it, expect } from "vitest";
import { Resend } from "resend";

describe("Resend API key validation", () => {
  it("should have a valid Resend API key configured", async () => {
    const apiKey = process.env.RESEND_API_KEY;
    expect(apiKey, "RESEND_API_KEY must be set").toBeTruthy();
    expect(apiKey!.startsWith("re_"), "API key should start with re_").toBe(true);

    // Key is send-only restricted — verify it can reach the Resend API
    // by attempting a send to a test address (will fail gracefully if domain unverified)
    const resend = new Resend(apiKey!);
    const { error } = await resend.emails.send({
      from: "La Elite Peptides <onboarding@resend.dev>",
      to: "delivered@resend.dev", // Resend's official test address
      subject: "API Key Validation Test",
      html: "<p>Test</p>",
    });
    // A restricted send-only key should succeed on send (not get 401)
    expect(
      error === null || (error as any)?.statusCode !== 401,
      `Resend API key rejected: ${JSON.stringify(error)}`
    ).toBe(true);
  }, 15000);
});
