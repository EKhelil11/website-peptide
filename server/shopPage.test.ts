import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const readSource = (relativePath: string) =>
  fs.readFileSync(path.join(projectRoot, relativePath), "utf8");

describe("public sales platform page", () => {
  const appSource = readSource("client/src/App.tsx");
  const shopSource = readSource("client/src/pages/Shop.tsx");
  const navbarSource = readSource("client/src/components/Navbar.tsx");
  const productCardSource = readSource("client/src/components/ProductCard.tsx");
  const loginSource = readSource("client/src/pages/Login.tsx");
  const footerSource = readSource("client/src/components/Footer.tsx");

  it("routes /shop to the dedicated page instead of redirecting to the home catalog", () => {
    expect(appSource).toContain('import Shop from "./pages/Shop"');
    expect(appSource).toContain('<Route path="/shop" component={Shop} />');
    expect(appSource).not.toContain('<Route path="/shop"><Redirect');
  });

  it("uses the canonical catalog, categories, shared cards, navigation, and footer", () => {
    expect(shopSource).toContain('import { categories, products, type Product } from "@/lib/products"');
    expect(shopSource).toContain('import ProductCard from "@/components/ProductCard"');
    expect(shopSource).toContain("<Navbar />");
    expect(shopSource).toContain("<Footer />");
    expect(shopSource).toContain("showPublicPrice");
  });

  it("provides search, category counts, sorting, and a no-results reset", () => {
    expect(shopSource).toContain("categoryCounts");
    expect(shopSource).toContain('aria-label="Search the research catalog"');
    expect(shopSource).toContain('value="price-asc"');
    expect(shopSource).toContain('value="price-desc"');
    expect(shopSource).toContain("resetCatalog");
  });

  it("keeps public price discovery while preserving the existing login-gated cart action", () => {
    expect(productCardSource).toContain("showPublicPrice");
    expect(productCardSource).toContain("handleLoginGate");
    expect(productCardSource).toContain("Add to Cart");
  });

  it("links the shared navigation to Shop and retains explicit research-only safeguards", () => {
    expect(navbarSource).toContain('{ label: "Shop", href: "/shop" }');
    expect(shopSource).toContain("For in-vitro laboratory and scientific research only. Not for human or animal consumption.");
    expect(shopSource).toContain("not intended for human or animal consumption");
  });

  it("does not copy reference branding, promotions, reviews, or unsupported evidence claims", () => {
    expect(shopSource).not.toMatch(/Peptides Collective/i);
    expect(shopSource).not.toMatch(/WELCOME30|LABORDAY35/i);
    expect(shopSource).not.toMatch(/bestseller|testimonial|customer review|star rating/i);
    expect(shopSource).not.toMatch(/certificate of analysis|\bCOA\b|99(?:\.|%)/i);
  });

  it("keeps the purchase login gate consistent with public price discovery", () => {
    expect(loginSource).toContain("PRIMARY_LOGO_URL");
    expect(loginSource).toContain("Catalog pricing is available publicly.");
    expect(loginSource).not.toContain("required to browse pricing");
    expect(loginSource).not.toContain("access full catalog and pricing");
  });

  it("keeps footer navigation functional from the dedicated sales route", () => {
    expect(footerSource).toContain('{ label: "Shop", href: "/shop" }');
    expect(footerSource).toContain('{ label: "Shipping", href: "/#shipping" }');
    expect(footerSource).toContain('{ label: "Contact", href: "/#contact" }');
  });
});
