import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

const productDetail = read("client/src/pages/ProductDetail.tsx");
const products = read("client/src/lib/products.ts");
const applicationsStart = productDetail.indexOf('activeTab === "applications"');
const molecularStart = productDetail.indexOf('activeTab === "molecular"');
const applicationsSource = productDetail.slice(applicationsStart, molecularStart);

describe("shared product Applications specification typography", () => {
  it("uses the surrounding Inter body family for specification labels and values", () => {
    expect(applicationsStart).toBeGreaterThan(-1);
    expect(molecularStart).toBeGreaterThan(applicationsStart);
    expect(applicationsSource).toContain("product-application-specs");
    expect(applicationsSource).toContain("product-application-spec-label");
    expect(applicationsSource).toContain("product-application-spec-value");
    expect(applicationsSource.match(/'Inter', sans-serif/g)?.length).toBe(2);
    expect(applicationsSource).not.toContain("'Rajdhani', sans-serif");
    expect(applicationsSource).toContain('fontWeight: 700');
    expect(applicationsSource).toContain('fontWeight: 500');
    expect(applicationsSource).toContain("leading-relaxed");
    expect(applicationsSource).toContain("break-words");
    expect(applicationsSource).toContain("max-[359px]:flex-col");
    expect(applicationsSource).toContain("max-[359px]:text-left");
  });

  it("keeps every displayed specification sourced from canonical product data", () => {
    for (const expression of [
      "product.name",
      "displayContent",
      "product.category",
      "product.researchClassification",
      "displayPrice",
    ]) {
      expect(applicationsSource).toContain(expression);
    }
  });

  it("preserves the protected Retatrutide 30 mg price and content", () => {
    const retatrutide30 = products.slice(
      products.indexOf('id: "retatrutide-30mg"'),
      products.indexOf('id: "tirzepatide-20mg"'),
    );
    expect(retatrutide30).toContain('price: "$200"');
    expect(retatrutide30).toContain('content: "30 mg per vial"');
  });
});
