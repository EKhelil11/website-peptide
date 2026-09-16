import { afterEach, describe, expect, it, vi } from "vitest";
import { ENV } from "./_core/env";
import {
  __setResendClientFactoryForTests,
  sendNewOrderEmail,
  sendVerificationEmail,
} from "./email";
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

  it("sends exactly one specialized RECROOMLV Las Vegas gym owner alert", async () => {
    ENV.resendApiKey = "credential-present";
    ENV.liveEmailEnabled = true;
    const send = vi.fn().mockResolvedValue({ data: { id: "partner-alert-id" }, error: null });
    const factory = vi.fn(() => ({ emails: { send } }) as never);
    __setResendClientFactoryForTests(factory);

    await sendNewOrderEmail({
      orderNumber: "LAP-100099",
      customerName: "Rec Room Customer",
      customerEmail: "customer-preview@example.com",
      customerPhone: "(702) 555-0100",
      shipAddress: "100 Partner Way",
      shipCity: "Las Vegas",
      shipState: "NV",
      shipZip: "89109",
      items: [{ name: "Retatrutide (30 mg)", quantity: 1, unitPrice: 20_000 }],
      subtotalCents: 20_000,
      discountCents: 2_000,
      partnerCode: "RECROOMLV",
      shippingCents: 700,
      taxCents: 1_440,
      totalCents: 20_140,
    });

    expect(factory).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledTimes(1);
    const payload = send.mock.calls[0][0];
    expect(payload.to).toBe("support@laelitepeps.com");
    expect(payload.subject).toBe("[RECROOMLV] Las Vegas Gym Order LAP-100099 — $201.40");
    expect(payload.html).toContain("RECROOMLV Partner Alert");
    expect(payload.html).toContain("New Las Vegas gym client order");
    expect(payload.html).toContain("Order <strong>LAP-100099</strong>");
    expect(payload.html).toContain("Customer <strong>Rec Room Customer</strong>");
    expect(payload.html).toContain("Partner code <strong>RECROOMLV</strong>");
    expect(payload.html).toContain("Discount <strong>-$20.00</strong>");
    expect(payload.html).toContain("Total <strong>$201.40</strong>");
  });

  it("keeps the standard single owner email unchanged for non-partner orders", async () => {
    ENV.resendApiKey = "credential-present";
    ENV.liveEmailEnabled = true;
    const send = vi.fn().mockResolvedValue({ data: { id: "standard-order-id" }, error: null });
    const factory = vi.fn(() => ({ emails: { send } }) as never);
    __setResendClientFactoryForTests(factory);

    await sendNewOrderEmail({
      orderNumber: "LAP-100100",
      customerName: "Standard Customer",
      customerEmail: "standard-preview@example.com",
      shipAddress: "200 Research Way",
      shipCity: "Los Angeles",
      shipState: "CA",
      shipZip: "90001",
      items: [{ name: "Retatrutide (30 mg)", quantity: 1, unitPrice: 20_000 }],
      subtotalCents: 20_000,
      discountCents: 0,
      partnerCode: null,
      shippingCents: 700,
      taxCents: 1_600,
      totalCents: 22_300,
    });

    expect(factory).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledTimes(1);
    const payload = send.mock.calls[0][0];
    expect(payload.subject).toBe("🛒 New Order LAP-100100 — $223.00");
    expect(payload.html).toContain("New Order Received");
    expect(payload.html).not.toContain("RECROOMLV Partner Alert");
    expect(payload.html).not.toContain("Las Vegas Gym Order");
  });
});
