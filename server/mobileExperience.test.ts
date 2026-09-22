import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { products } from "../client/src/lib/products";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) => fs.readFileSync(path.join(root, relativePath), "utf8");

const app = read("client/src/App.tsx");
const home = read("client/src/pages/Home.tsx");
const hero = read("client/src/components/HeroSection.tsx");
const shop = read("client/src/pages/Shop.tsx");
const login = read("client/src/pages/Login.tsx");
const register = read("client/src/pages/Register.tsx");
const productDetail = read("client/src/pages/ProductDetail.tsx");
const navbar = read("client/src/components/Navbar.tsx");
const productCard = read("client/src/components/ProductCard.tsx");
const about = read("client/src/components/AboutSection.tsx");
const shippingReturns = read("client/src/pages/ShippingReturnsPage.tsx");
const ageVerification = read("client/src/components/AgeVerification.tsx");

describe("private mobile experience and loading contracts", () => {
  it("keeps the opening intro off mobile while retaining the desktop session behavior", () => {
    expect(home).toContain("window.innerWidth < 768");
    expect(home).toContain("const skipIntro = isMobile || alreadySeen");
    expect(home).toContain("!introComplete && <VideoIntro");
    expect(ageVerification).not.toContain("mobile-audit");
  });

  it("contains the shop hero and controls at narrow phone widths", () => {
    expect(shop).toContain("min-w-0 max-w-full");
    expect(shop).toContain('fontSize: "clamp(2.45rem, 13vw, 7rem)"');
    expect(shop).toContain('overflowWrap: "normal"');
    expect(shop).toContain('block whitespace-nowrap text-[#B9C0CA]">COMPOUNDS');
    expect(shop).toContain("w-full min-w-0 min-[360px]:w-auto");
    expect(shop).not.toContain('fontSize: "clamp(3.6rem, 8vw, 7rem)"');
  });

  it("surfaces the home catalog action sooner without removing desktop copy", () => {
    expect(hero).toContain("hidden sm:block mt-3");
    expect(hero).toContain("pt-20 sm:pt-24");
    expect(hero).toContain("mb-6 sm:mb-8");
  });

  it("stacks dense authentication fields and preserves useful mobile header width", () => {
    expect(login).toContain("shrink-0 whitespace-nowrap");
    expect(login).toContain("!w-[170px] sm:!w-[300px]");
    expect(login.match(/grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5/g)?.length).toBe(2);
    expect(register).toContain("grid grid-cols-1 sm:grid-cols-2 gap-3");
    expect(register).toContain("p-6 sm:p-8");
  });

  it("improves product compliance readability and balances the five mobile tabs", () => {
    expect(productDetail).toContain("text-[0.92rem] leading-[1.75] text-white/84 sm:text-[0.96rem]");
    expect(productDetail).toContain("product-detail-tabs sticky top-[88px] z-40 grid grid-cols-2");
    expect(productDetail).toContain("sm:flex sm:flex-wrap");
    expect(productDetail).toContain("min-h-12");
    expect(productDetail).not.toContain("tracking-wide whitespace-nowrap transition-all");
  });

  it("provides explicit mobile menu state, scrolling, and minimum tap targets", () => {
    expect(navbar).toContain("aria-expanded={mobileOpen}");
    expect(navbar).toContain('aria-controls="mobile-navigation"');
    expect(navbar).toContain('overflowY: "auto"');
    expect(navbar).toContain("min-h-11 w-full max-w-xs");
  });

  it("aligns the policy page with the approved fulfillment presentation", () => {
    expect(shippingReturns).toContain("FLAT-RATE STANDARD SHIPPING");
    expect(shippingReturns).toContain("$7.00 at checkout");
    expect(shippingReturns).toContain("3–5 business days · All 50 states");
    expect(shippingReturns).toContain("unbranded exterior");
    expect(shippingReturns).not.toMatch(/overnight|same business day|thermally protective/i);
  });

  it("splits non-home routes and defers below-the-fold image work", () => {
    expect(app).toMatch(/import \{[^}]*lazy[^}]*Suspense[^}]*\} from "react"/);
    expect(app.match(/= lazy\(\(\) => import\(/g)?.length).toBeGreaterThanOrEqual(17);
    expect(app).toContain("<Suspense fallback={<RouteFallback />}> ".trim());
    expect(productCard).toContain('loading="lazy"');
    expect(productCard).toContain('decoding="async"');
    expect(about).toContain('loading="lazy"');
    expect(products.every(product => product.images?.every(image => image.endsWith(".webp")))).toBe(true);
  });
});
