import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const clientRoot = path.join(projectRoot, "client/src");
const footerSource = fs.readFileSync(path.join(clientRoot, "components/Footer.tsx"), "utf8");
const heroSource = fs.readFileSync(path.join(clientRoot, "components/HeroSection.tsx"), "utf8");
const purityHeadingSource = fs.readFileSync(
  path.join(clientRoot, "components/PurityBadgeHeading.tsx"),
  "utf8",
);
const shopSource = fs.readFileSync(path.join(clientRoot, "pages/Shop.tsx"), "utf8");

describe("premium Contact, hero, and Shop typography", () => {
  it("elevates Contact labels, values, and support copy without changing destinations", () => {
    expect(footerSource).toContain("contact-method-label");
    expect(footerSource).toContain("contact-method-value");
    expect(footerSource).toContain("contact-method-note");
    expect(footerSource).toContain("'Cormorant Garamond', serif");
    expect(footerSource).toContain("'Rajdhani', sans-serif");
    expect(footerSource).toContain("'Inter', sans-serif");
    expect(footerSource).toContain('href: "mailto:Support@laelitepeps.com"');
    expect(footerSource).toContain('href: "tel:+13109759289"');
    expect(footerSource).toContain('href: "https://instagram.com/laelitepeptides"');
    expect(footerSource).toContain('value: "Los Angeles, California"');
  });

  it("uses the fourth purity card's shared heading hierarchy for the first three hero metrics", () => {
    expect(heroSource).toContain('headingPrimary: "Current"');
    expect(heroSource).toContain('headingSecondary: "Compounds"');
    expect(heroSource).toContain('headingPrimary: "Signature"');
    expect(heroSource).toContain('headingSecondary: "Blends"');
    expect(heroSource).toContain('headingPrimary: "Research"');
    expect(heroSource).toContain('headingSecondary: "Support"');
    expect(heroSource).toContain("primary={'headingPrimary' in stat ? stat.headingPrimary : stat.label}");
    expect(heroSource).toContain("secondary={'headingSecondary' in stat ? stat.headingSecondary : \"\"}");
    expect(heroSource).toContain('fullLabel={stat.label}');
    expect(purityHeadingSource).toContain('primary = "COA-Reported"');
    expect(purityHeadingSource).toContain('secondary = "Purity"');
    expect(purityHeadingSource).toContain("{fullLabel}");
  });

  it("preserves dynamic hero counts and every signature-blend destination", () => {
    expect(heroSource).toContain("catalogCounts.compounds");
    expect(heroSource).toContain("catalogCounts.signatureBlends");
    expect(heroSource).toContain("products.filter((product) => product.isStack)");
    expect(heroSource).toContain('href={`/product/${s.id}`}');
    expect(heroSource).toContain("hero-stat-link");
    expect(heroSource).toContain('scope: "Product-/lot-specific reports"');
  });

  it("changes only typography inside the existing Shop metric boxes", () => {
    expect(shopSource).toContain('value: `${products.length}`');
    expect(shopSource).toContain('value: `${categories.length - 1}`');
    expect(shopSource).toContain('value: "Secure"');
    expect(shopSource).toContain('value: "Tracked"');
    expect(shopSource).toContain('label: "Current research compounds"');
    expect(shopSource).toContain('label: "Catalog categories"');
    expect(shopSource).toContain('label: "Account-protected checkout"');
    expect(shopSource).toContain('label: "Order status workflow"');
    expect(shopSource).toContain("text-[1.85rem] sm:text-[2.15rem]");
    expect(shopSource).toContain("text-[0.82rem] sm:text-[0.9rem]");
    expect(shopSource).toContain("text-[#B9C0CA]/65");
    expect(shopSource).toContain("text-[#465161]");
    expect(shopSource).toContain("rounded-2xl border border-[#B9C0CA]/65 bg-white/60");
    expect(shopSource).toContain("grid grid-cols-2 lg:grid-cols-4");
  });

  it("does not leak temporary typography review hooks", () => {
    for (const source of [footerSource, heroSource, purityHeadingSource, shopSource]) {
      expect(source).not.toContain("typography-audit");
      expect(source).not.toContain("auditOnly");
    }
  });
});
