import { describe, expect, it } from "vitest";
import { evaluateIntegrationStatus } from "./integrationStatus";

describe("Resend configuration state", () => {
  it("disables transactional email when no credential is present", () => {
    const status = evaluateIntegrationStatus({});
    expect(status.email.configured).toBe(false);
    expect(status.email.message).toContain("disabled");
  });

  it("reports configured without returning the credential", () => {
    const credential = "resend-test-credential";
    const status = evaluateIntegrationStatus({
      resendApiKey: credential,
      liveEmailEnabled: true,
    });
    expect(status.email.configured).toBe(true);
    expect(JSON.stringify(status)).not.toContain(credential);
  });

  it("keeps email disabled when credentials exist without owner approval", () => {
    const status = evaluateIntegrationStatus({ resendApiKey: "credential-present" });
    expect(status.email.credentialsPresent).toBe(true);
    expect(status.email.approved).toBe(false);
    expect(status.email.configured).toBe(false);
    expect(status.email.message).toContain("owner approval");
  });
});
