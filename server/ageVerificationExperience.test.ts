import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(
  path.join(projectRoot, "client/src/components/AgeVerification.tsx"),
  "utf8",
);
const themeCss = fs.readFileSync(path.join(projectRoot, "client/src/index.css"), "utf8");

describe("elevated Age Verification experience", () => {
  it("uses distinct premium panel, 21+ badge, and CTA contracts", () => {
    expect(source).toContain("age-verification-panel");
    expect(source).toContain("age-verification-badge");
    expect(source).toContain("age-verification-primary-cta");
    expect(source).toContain("age-verification-secondary-cta");
  });

  it("uses high-contrast ivory, champagne, silver, and navy CTA colors", () => {
    expect(source).toContain("#FFFCF7");
    expect(source).toContain("#F2DFC5");
    expect(source).toContain("#0A2458");
    expect(themeCss).toContain("linear-gradient(135deg, #FFFCF7 0%, #F2DFC5 46%, #C9D0DA 100%)");
    expect(source).not.toContain('color: "rgba(255,255,255,0.35)"');
  });

  it("preserves the mobile CTA and adds a desktop-only brushed-silver treatment", () => {
    expect(themeCss).toContain(".age-verification-primary-cta");
    expect(themeCss).toContain("@media (min-width: 768px)");
    expect(themeCss).toContain("#BCC5D1");
    expect(themeCss).toContain("#9EA9B8");
    expect(themeCss).toContain("repeating-linear-gradient");
    expect(source).toContain("relative z-10");
  });

  it("retains exact access and research-only requirements", () => {
    expect(source).toContain("21 years of age or older");
    expect(source).toContain("strictly for in-vitro laboratory and scientific research purposes only");
    expect(source).toContain("Yes, I am 21 or older");
    expect(source).toContain("Enter Site →");
    expect(source).toContain("No, I am under 21 — Exit Site");
  });

  it("preserves desktop intro handoff, route bypasses, and session behavior", () => {
    expect(source).toContain("INTRO_COMPLETE_EVENT");
    expect(source).toContain("window.innerWidth >= 768");
    expect(source).toContain('sessionStorage.setItem("age_verified", "true")');
    expect(source).toContain('window.location.href = "https://www.google.com"');
    expect(source).toContain('const BYPASS_ROUTES = ["/admin", "/account", "/checkout"');
  });

  it("provides visible keyboard focus and reduced-motion-safe controls", () => {
    expect(source.match(/focus-visible:ring-2/g)?.length).toBe(2);
    expect(source.match(/motion-reduce:transition-none/g)?.length).toBe(2);
    expect(source.match(/motion-reduce:transform-none/g)?.length).toBe(2);
  });

  it("contains no development-only review bypass", () => {
    expect(source).not.toContain("-audit");
    expect(source).not.toContain("import.meta.env.DEV");
  });
});
