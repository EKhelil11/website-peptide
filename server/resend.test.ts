import { describe, expect, it } from "vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ENV } from "./_core/env";
import { __setResendClientFactoryForTests, sendVerificationEmail } from "./email";
import { evaluateIntegrationStatus } from "./integrationStatus";

const originalResendApiKey = ENV.resendApiKey;
const originalLiveEmailEnabled = ENV.liveEmailEnabled;

afterEach(() => {
  ENV.resendApiKey = originalResendApiKey;
  ENV.liveEmailEnabled = originalLiveEmailEnabled;
  __setResendClientFactoryForTests();
});

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

  it("does not construct or call Resend when credentials exist without approval", async () => {
    ENV.resendApiKey = "credential-present";
    ENV.liveEmailEnabled = false;
    const send = vi.fn();
    const factory = vi.fn(() => ({ emails: { send } }) as never);
    __setResendClientFactoryForTests(factory);

    await sendVerificationEmail({
      email: "controlled@example.com",
      firstName: "Controlled",
      token: "not-a-live-token",
      origin: "https://laelitepeps.com",
    });

    expect(factory).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it("calls the injected Resend client once when credentials and approval are present", async () => {
    ENV.resendApiKey = "credential-present";
    ENV.liveEmailEnabled = true;
    const send = vi.fn().mockResolvedValue({ data: { id: "controlled-id" }, error: null });
    const factory = vi.fn(() => ({ emails: { send } }) as never);
    __setResendClientFactoryForTests(factory);

    await sendVerificationEmail({
      email: "controlled@example.com",
      firstName: "Controlled",
      token: "not-a-live-token",
      origin: "https://laelitepeps.com",
    });

    expect(factory).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledTimes(1);
  });
});
