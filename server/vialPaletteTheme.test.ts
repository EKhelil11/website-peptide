import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const clientRoot = path.join(projectRoot, "client/src");

function collectSourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(fullPath);
    return /\.(css|ts|tsx)$/.test(entry.name) ? [fullPath] : [];
  });
}

const allClientSource = collectSourceFiles(clientRoot)
  .map(file => fs.readFileSync(file, "utf8"))
  .join("\n");

const themeCss = fs.readFileSync(path.join(clientRoot, "index.css"), "utf8");
const indexHtml = fs.readFileSync(path.join(projectRoot, "client/index.html"), "utf8");
const heroSource = fs.readFileSync(
  path.join(clientRoot, "components/HeroSection.tsx"),
  "utf8",
);
const introSource = fs.readFileSync(
  path.join(clientRoot, "components/VideoIntro.tsx"),
  "utf8",
);
const aboutSource = fs.readFileSync(
  path.join(clientRoot, "components/AboutSection.tsx"),
  "utf8",
);
const faqSource = fs.readFileSync(
  path.join(clientRoot, "components/FAQSection.tsx"),
  "utf8",
);
const footerSource = fs.readFileSync(
  path.join(clientRoot, "components/Footer.tsx"),
  "utf8",
);
const productsSource = fs.readFileSync(
  path.join(clientRoot, "lib/products.ts"),
  "utf8",
);
const shippingSource = fs.readFileSync(
  path.join(clientRoot, "components/ShippingSection.tsx"),
  "utf8",
);
const productDetailSource = fs.readFileSync(
  path.join(clientRoot, "pages/ProductDetail.tsx"),
  "utf8",
);
const productCardSource = fs.readFileSync(
  path.join(clientRoot, "components/ProductCard.tsx"),
  "utf8",
);
const purityBadgeHeadingSource = fs.readFileSync(
  path.join(clientRoot, "components/PurityBadgeHeading.tsx"),
  "utf8",
);

describe("vial-label blue-silver-limestone private-preview theme", () => {
  it("defines the complete image-led palette and keeps compatibility aliases", () => {
    for (const token of [
      "--vial-navy",
      "--vial-royal",
      "--vial-royal-bright",
      "--vial-silver",
      "--vial-pewter",
      "--vial-limestone",
      "--vial-champagne",
      "--vial-ivory",
      "--vial-charcoal",
      "--lux-ink",
      "--lux-green-900",
      "--lux-green-800",
      "--lux-green-700",
      "--lux-gold-700",
      "--lux-gold-500",
      "--lux-gold-300",
      "--lux-ivory",
      "--lux-stone",
      "--lux-sage",
      "--color-brand-navy",
      "--color-brand-cyan",
    ]) {
      expect(themeCss).toContain(token);
    }
  });

  it("retains and applies the new luxury display typeface", () => {
    expect(indexHtml).toContain("Cormorant+Garamond");
    expect(themeCss).toContain("font-family: 'Cormorant Garamond', serif");
    expect(allClientSource).not.toContain("Bebas Neue");
  });

  it("removes the superseded green, gold, cyan, pink, and midnight literals", () => {
    for (const legacyColor of [
      "#063D2C",
      "#09543C",
      "#0E6A4B",
      "#D6B56E",
      "#A77A2C",
      "#ECD9A5",
      "#C39A45",
      "#00BFFF",
      "#FF2D78",
      "#FF0080",
      "#0080FF",
      "#0D1B3E",
      "#050D1A",
    ]) {
      expect(allClientSource.toUpperCase()).not.toContain(legacyColor.toUpperCase());
    }
  });

  it("retains the supplied silver-and-blue logo without recoloring its asset", () => {
    expect(allClientSource).toContain(
      "/manus-storage/la-elite-peptides-silver-blue-logo-final_c61a4232-optimized_c3827f19.webp",
    );
  });

  it("uses the supplied wellness-clinic hero and derives the expanded inventory totals", () => {
    expect(heroSource).toContain(
      "/manus-storage/la-elite-peptides-wellness-clinic-hero_97eecfe8-optimized_1b05f19b.webp",
    );
    expect(heroSource).toContain("hero-clinic-image");
    expect(heroSource).not.toContain("hero-clinic-image-focus");
    expect(themeCss).toMatch(/\.hero-clinic-image\s*\{[\s\S]*?background-size:\s*cover;/);
    expect(themeCss).not.toContain(".hero-clinic-image-focus");
    expect(themeCss).toContain("background-position: 76% 50%");
    expect(themeCss).toContain("background-position: 88% 50%");
    expect(heroSource).toContain("hero-headline-contrast");
    expect(heroSource).toContain("hero-research-line");
    expect(heroSource).toContain("hero-content-shift");
    expect(heroSource).toContain("Los Angeles Peptide Research Institute");
    expect(heroSource).not.toContain("Advanced Peptide Research Institute");
    expect(heroSource).toContain("hero-description-contrast");
    expect(heroSource).toContain("A boutique supplier of premium research compounds");
    expect(heroSource).toContain("Premium compounds. Rigorous standards. Uncompromising quality.");
    expect(heroSource).toContain("Strictly for qualified in-vitro laboratory research.");
    expect(heroSource).not.toContain("A focused catalog of research compounds");
    expect(heroSource).toContain("hero-stats-grid");
    expect(heroSource).toContain("sm:grid-cols-2");
    expect(heroSource).toContain('value: ">99%"');
    expect(heroSource).toContain('label: "COA-Reported Purity"');
    expect(heroSource).toContain('scope: "Product-/lot-specific reports"');
    expect(heroSource).toContain("purityHeading: true");
    expect(heroSource).toContain('<PurityBadgeHeading className="block leading-none" />');
    expect(heroSource).toContain("hero-stat-card-featured");
    expect(heroSource).toContain("hero-stat-link");
    expect(heroSource).toContain("#F6F1E9");
    expect(themeCss).toContain(".hero-headline-contrast::before");
    expect(themeCss).toContain(".hero-research-line::before");
    expect(themeCss).toContain("border-left: 3px solid rgba(216, 221, 229, 0.9)");
    expect(themeCss).toContain("rgba(7, 21, 47, 0.96) 0%");
    expect(themeCss).toContain(".hero-content-shift");
    expect(themeCss).toContain("translateY(clamp(2.75rem, 5.5vh, 3.75rem))");
    expect(themeCss).toContain("translateY(1.25rem)");
    expect(themeCss).toContain(".hero-description-contrast");
    expect(themeCss).toContain(".hero-stat-card");
    expect(themeCss).toContain(".hero-stat-value");
    expect(themeCss).toContain(".hero-stat-link");
    expect(productsSource).toContain('id: "tirzepatide-20mg"');
    expect(productsSource).toContain('id: "tirzepatide-40mg"');
    expect(productsSource).toContain("catalogCounts");
    expect(heroSource).toContain("catalogCounts.compounds");
    expect(heroSource).toContain("catalogCounts.signatureBlends");
  });

  it("uses the owner-supplied gym intro with a protected logo composition and explicit research-only notice", () => {
    expect(introSource).toContain(
      "/manus-storage/la-elite-gym-intro_e541e0af-optimized_1f399001.webp",
    );
    expect(introSource).toContain("PRIMARY_LOGO_URL");
    expect(introSource).toContain("Qualified In-Vitro Research Only");
    expect(introSource).toContain("not intended for human or animal use");
    expect(introSource).toContain("object-[58%_center]");
    expect(introSource).not.toContain("lap-intro-backdrop_0bbeb236.jpg");
    expect(introSource).not.toContain("Advanced Research Compounds");
  });

  it("uses a concise lighter luxury shipping section with each core promise stated once", () => {
    expect(shippingSource).toContain("#F6F1E9");
    expect(shippingSource).toContain("#FFFCF7");
    expect(shippingSource).toContain("#2457A7");
    expect(shippingSource).toContain("#10295E");
    expect(shippingSource).toContain("#374151");
    expect(shippingSource.match(/All 50 States/g)?.length).toBe(1);
    expect(shippingSource.match(/3–5/g)?.length).toBe(1);
    expect(shippingSource.match(/Discreet Packaging/g)?.length).toBe(1);
    expect(shippingSource.match(/Tracking becomes available after the order ships/g)?.length).toBe(1);
    expect(shippingSource).toContain("Business Days");
    expect(shippingSource).toContain("Calculated at checkout");
    expect(shippingSource).toContain("Fulfillment is reserved for qualified in-vitro laboratory research orders");
    expect(shippingSource).not.toContain('style={{ background: "#10295E" }}');
    expect(shippingSource).not.toContain("Orders ship within 24 hours");
    expect(shippingSource).not.toContain("cold-chain integrity");
    expect(shippingSource).not.toContain("cold-pack packaging");
    expect(shippingSource).not.toContain("shipping-reassurance-card");
    expect(shippingSource).not.toContain("reassuranceItems");
    expect(shippingSource).toContain("motion-reduce:transform-none");
    expect(shippingSource).toContain("shipping-service-ledger");
    expect(shippingSource).toContain("shipping-service-step");
    expect(shippingSource).toContain("shipping-service-medallion");
    expect(shippingSource).toContain("shipping-service-badge");
    expect(shippingSource).toContain("shipping-service-title");
    expect(shippingSource).toContain("'Cormorant Garamond', serif");
    expect(shippingSource).toContain("0{index + 1}");
    expect(shippingSource).toContain("sm:ml-8");
  });

  it("uses the owner-supplied Who We Are laboratory image and evidence-scoped purity badge", () => {
    expect(aboutSource).toContain(
      "/manus-storage/la-elite-who-we-are-lab_b1963ab1-optimized_acd7650b.webp",
    );
    expect(aboutSource).toContain(
      'alt="LA Elite Peptides laboratory team conducting analytical research"',
    );
    expect(aboutSource).toContain("&gt;99%");
    expect(aboutSource).toContain("PurityBadgeHeading");
    expect(purityBadgeHeadingSource).toContain("COA-Reported Purity");
    expect(aboutSource).toContain("who-we-are-copy");
    expect(aboutSource).toContain('<PurityBadgeHeading className="pb-0.5 leading-none" />');
    expect(purityBadgeHeadingSource).toContain("COA-Reported Purity");
    expect(purityBadgeHeadingSource).toContain("'Cormorant Garamond', serif");
    expect(purityBadgeHeadingSource).toContain("'Rajdhani', sans-serif");
    expect(purityBadgeHeadingSource).toContain('className="block text-[0.9rem] tracking-[0.045em] text-[#F7F2EA] sm:text-base"');
    expect(purityBadgeHeadingSource).toContain('className="mt-1 block text-[0.62rem] uppercase tracking-[0.2em] text-[#B9C0CA]"');
    expect(aboutSource).toContain("fontWeight: 450");
    expect(aboutSource).toContain("Product- and lot-specific results");
    expect(aboutSource).toContain("See each posted Certificate of Analysis");
    expect(aboutSource).not.toContain("lap-about-laboratory_2d9792ee.jpg");
  });

  it("uses a lighter editorial Our Standards layout with four premium feature medallions", () => {
    expect(aboutSource).toContain("linear-gradient(145deg, #F7F2EA 0%, #EFE4D3 52%, #E8D7BD 100%)");
    expect(aboutSource).toContain("standards-editorial-grid");
    expect(aboutSource).toContain("standards-feature-card");
    expect(aboutSource).toContain("standards-icon-medallion");
    expect(aboutSource).toContain("standards-collection-badge");
    expect(aboutSource).toContain("standards-feature-badge");
    expect(aboutSource).toContain("Four-point standard");
    expect(aboutSource).toContain("'Cormorant Garamond', serif");
    expect(aboutSource).toContain("sm:grid-cols-2");
    expect(aboutSource).toContain("motion-reduce:transform-none");
    expect(aboutSource).not.toContain("MOLECULE_IMG");
    expect(aboutSource).not.toContain("oklch(0.18 0.055 255)");
  });

  it("uses elevated boutique FAQ badges, questions, answers, and interaction states", () => {
    expect(faqSource).toContain("faq-category-badge");
    expect(faqSource).toContain("faq-question-card");
    expect(faqSource).toContain("faq-question-number");
    expect(faqSource).toContain("faq-chevron-medallion");
    expect(faqSource).toContain("FREQUENTLY");
    expect(faqSource).toContain("ASKED.");
    expect(faqSource).toContain("'Cormorant Garamond', serif");
    expect(faqSource).toContain("'Rajdhani', sans-serif");
    expect(faqSource).toContain("'Inter', sans-serif");
    expect(faqSource).toContain("aria-expanded={isOpen}");
    expect(faqSource).toContain("focus-visible:ring-[#E9DCCB]/70");
    expect(faqSource).toContain("motion-reduce:transition-none");
  });

  it("uses a lighter boutique Get in Touch section with premium contact methods", () => {
    expect(footerSource).toContain("contact-boutique-section");
    expect(footerSource).toContain("linear-gradient(145deg, #F7F2EA 0%, #EFE4D3 52%, #E8D7BD 100%)");
    expect(footerSource).toContain("contact-method-card");
    expect(footerSource).toContain("contact-method-medallion");
    expect(footerSource).toContain("contact-inquiry-panel");
    expect(footerSource).toContain("Private research inquiry");
    expect(footerSource).toContain("product-boutique-cta");
    expect(footerSource).toContain("mailto:Support@laelitepeps.com");
    expect(footerSource).toContain("tel:+13109759289");
    expect(footerSource).not.toContain('background: "oklch(0.25 0.08 255)"');
    expect(footerSource).not.toContain('background: "oklch(0.28 0.08 255)"');
  });

  it("uses matching Trusted. Tested. proof badges with readable boutique contrast", () => {
    expect(aboutSource).toContain("brand-proof-line");
    expect(aboutSource).not.toContain("Los Angeles. Research Focused. Document Led.");
    expect(aboutSource).toContain("Trusted. Tested.");
    expect(aboutSource).toContain("w-fit max-w-full items-center justify-start");
    expect(aboutSource).toContain("text-[#F7F2EA]");
    expect(aboutSource).toContain("'Cormorant Garamond', serif");
    expect(aboutSource).toContain('textShadow: "0 2px 14px rgba(0, 0, 0, 0.75)"');

    expect(footerSource).toContain("brand-proof-footer");
    expect(footerSource).toContain("Trusted. Tested.");
    expect(footerSource).toContain("text-[#F7F2EA]");
    expect(footerSource).toContain("'Cormorant Garamond', serif");
    expect(footerSource).toContain('textShadow: "0 2px 14px rgba(0, 0, 0, 0.75)"');
  });

  it("uses one upscale boutique primary CTA for signed-in purchase and signed-out access states", () => {
    expect(themeCss).toContain(".product-boutique-cta");
    expect(themeCss).toContain("background: linear-gradient(135deg, #fffdf8 0%, #f1e5d2 44%, #b9c0ca 100%)");
    expect(themeCss).toContain(".product-boutique-cta:focus-visible");
    expect(themeCss).toContain("prefers-reduced-motion: reduce");
    expect(productDetailSource.match(/product-boutique-cta/g)?.length).toBe(2);
    expect(productDetailSource).toContain("BUY NOW");
    expect(productDetailSource).toContain("Login to View Pricing & Order");
  });

  it("uses the elevated shared COA and Research Highlights typography on every product detail", () => {
    expect(productDetailSource).toContain("coa-typography-panel");
    expect(productDetailSource).toContain("research-highlights-panel");
    expect(productDetailSource).toContain("Batch Documentation");
    expect(productDetailSource).toContain("Research Profile");
    expect(productDetailSource).toContain("'Cormorant Garamond', serif");
    expect(productDetailSource).toContain("'Inter', sans-serif");
    expect(productDetailSource).toContain("product.benefits.map");
    expect(productDetailSource).toContain("sm:flex-row");
    expect(productDetailSource).toContain("product.coa.purityResult");
    expect(productDetailSource).toContain("product.coa.lotBatch");
  });

  it("uses elevated high-contrast content, tagline, and summary typography across product surfaces", () => {
    expect(productCardSource).toContain("product-format-line");
    expect(productCardSource).toContain("product-card-tagline");
    expect(productCardSource).toContain("product-card-synopsis");
    expect(productCardSource).toContain("'Cormorant Garamond', serif");
    expect(productCardSource).toContain("fontWeight: 450");
    expect(productDetailSource).toContain("product-detail-format-line");
    expect(productDetailSource).toContain("product-detail-tagline");
    expect(productDetailSource).toContain("Research Format");
    expect(productDetailSource).toContain("{displayContent}");
  });

  it("defers below-the-fold product and laboratory images while prioritizing active product imagery", () => {
    expect(productCardSource).toContain('loading="lazy"');
    expect(productCardSource).toContain('decoding="async"');
    expect(aboutSource).toContain('loading="lazy"');
    expect(productDetailSource).toContain('fetchPriority="high"');
    expect(productDetailSource).toContain('loading="lazy"');
  });

  it("does not present unsupported pharmaceutical, purity, or testing claims in text", () => {
    const publicTrustCopy = `${heroSource}\n${aboutSource}\n${faqSource}`.toLowerCase();
    for (const unsupportedClaim of [
      "pharmaceutical-grade",
      "highest purity",
      "third-party tested",
      "documented purity",
      "100% research grade",
      "la-tested",
      "elite-approved",
    ]) {
      expect(publicTrustCopy).not.toContain(unsupportedClaim);
    }
    expect(faqSource).toContain("no verified file is available");
  });
});
