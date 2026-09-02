import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const logoAssetModule = fs.readFileSync(
  path.join(projectRoot, "client/src/lib/brandAssets.ts"),
  "utf8",
);

const logoBearingSources = [
  "client/src/components/VideoIntro.tsx",
  "client/src/components/AgeVerification.tsx",
  "client/src/components/Navbar.tsx",
  "client/src/components/Footer.tsx",
  "client/src/pages/Account.tsx",
  "client/src/pages/AdminLogin.tsx",
  "client/src/pages/AdminOrders.tsx",
  "client/src/pages/CertificateOfAnalysis.tsx",
  "client/src/pages/Checkout.tsx",
  "client/src/pages/ForgotPassword.tsx",
  "client/src/pages/Login.tsx",
  "client/src/pages/PrivacyPolicyPage.tsx",
  "client/src/pages/ProductDetail.tsx",
  "client/src/pages/Register.tsx",
  "client/src/pages/ResetPassword.tsx",
  "client/src/pages/ShippingReturnsPage.tsx",
  "client/src/pages/TermsPage.tsx",
  "client/src/pages/VerifyEmail.tsx",
] as const;

describe("shared silver-and-blue logo asset", () => {
  it("uses the durable transparent owner-supplied logo asset", () => {
    expect(logoAssetModule).toContain(
      "/manus-storage/la-elite-peptides-silver-blue-logo-final_c61a4232.png",
    );
  });

  it.each(logoBearingSources)("uses the shared logo and accessible name in %s", relativePath => {
    const source = fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
    expect(source).toContain("PRIMARY_LOGO_URL");
    expect(source).toContain("PRIMARY_LOGO_ALT");
    expect(source).not.toContain("lap-logo-cropped_755f69ec.png");
    expect(source).not.toContain("inline-flex flex-col items-center gap-1 cursor-pointer");
  });

  it("defines reusable treatments for every logo context", () => {
    for (const token of [
      "PRIMARY_LOGO_SIZE_CLASS",
      "INTRO_LOGO_SIZE_CLASS",
      "AGE_GATE_LOGO_SIZE_CLASS",
      "MOBILE_MENU_LOGO_SIZE_CLASS",
      "UTILITY_LOGO_SIZE_CLASS",
      "AUTH_LOGO_SIZE_CLASS",
    ]) {
      expect(logoAssetModule).toContain(token);
    }
  });

  it("keeps the published header and footer logos on one shared size token", () => {
    expect(logoAssetModule).toContain("PRIMARY_LOGO_SIZE_CLASS");

    for (const relativePath of [
      "client/src/components/Navbar.tsx",
      "client/src/components/Footer.tsx",
    ]) {
      const source = fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
      expect(source).toContain("PRIMARY_LOGO_SIZE_CLASS");
    }
  });
});
