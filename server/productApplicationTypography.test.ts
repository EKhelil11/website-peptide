import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

const productDetail = read("client/src/pages/ProductDetail.tsx");
const products = read("client/src/lib/products.ts");
const tabsStart = productDetail.indexOf("product-detail-tabs");
const disclaimerStart = productDetail.indexOf("Disclaimer block");
const tabsSource = productDetail.slice(tabsStart, disclaimerStart);
const overviewStart = productDetail.indexOf('activeTab === "overview"');
const mechanismStart = productDetail.indexOf('activeTab === "mechanism"');
const applicationsStart = productDetail.indexOf('activeTab === "applications"');
const molecularStart = productDetail.indexOf('activeTab === "molecular"');
const handlingStart = productDetail.indexOf('activeTab === "handling"');
const overviewSource = productDetail.slice(overviewStart, mechanismStart);
const mechanismSource = productDetail.slice(mechanismStart, applicationsStart);
const applicationsSource = productDetail.slice(applicationsStart, molecularStart);
const molecularSource = productDetail.slice(molecularStart, handlingStart);
const handlingSource = productDetail.slice(handlingStart, disclaimerStart);
const molecularTableSource = productDetail.slice(
  productDetail.indexOf("function MolecularTable"),
  productDetail.indexOf("function RelatedProducts"),
);

describe("shared product full-detail typography", () => {
  it("uses readable Inter tab labels and a clear Cormorant active-section heading", () => {
    expect(tabsStart).toBeGreaterThan(-1);
    expect(disclaimerStart).toBeGreaterThan(tabsStart);
    expect(tabsSource).toContain("grid grid-cols-2");
    expect(tabsSource).toContain("min-h-12");
    expect(tabsSource).toContain("focus-visible:ring-2");
    expect(tabsSource).toContain("'Inter', sans-serif");
    expect(tabsSource).toContain("Full Product Details");
    expect(tabsSource).toContain("activeTabLabel");
    expect(tabsSource).toContain("'Cormorant Garamond', serif");
  });

  it("elevates Research Overview with consistent body typography and contrast", () => {
    expect(overviewSource).toContain("product-overview-content");
    expect(overviewSource).toContain("product-tab-lead");
    expect(overviewSource.match(/product-tab-body/g)?.length).toBe(2);
    expect(overviewSource.match(/'Inter', sans-serif/g)?.length).toBe(4);
    expect(overviewSource).toContain("leading-[1.8]");
    expect(overviewSource).toContain("text-white/78");
    expect(overviewSource).not.toContain("'Rajdhani', sans-serif");
  });

  it("applies the same readable body role to Mechanism and Applications", () => {
    expect(mechanismSource).toContain("product-mechanism-content");
    expect(mechanismSource).toContain("product-tab-body");
    expect(mechanismSource).toContain("leading-[1.82]");
    expect(mechanismSource).toContain("'Inter', sans-serif");
    expect(applicationsSource).toContain("product-applications-content");
    expect(applicationsSource).toContain("product-tab-body");
    expect(applicationsSource).toContain("leading-[1.82]");
  });

  it("uses the surrounding Inter body family for Applications labels and values", () => {
    expect(applicationsStart).toBeGreaterThan(-1);
    expect(molecularStart).toBeGreaterThan(applicationsStart);
    expect(applicationsSource).toContain("product-application-specs");
    expect(applicationsSource).toContain("product-application-spec-label");
    expect(applicationsSource).toContain("product-application-spec-value");
    expect(applicationsSource.match(/'Inter', sans-serif/g)?.length).toBe(3);
    expect(applicationsSource).not.toContain("'Rajdhani', sans-serif");
    expect(applicationsSource).toContain("fontWeight: 700");
    expect(applicationsSource).toContain("fontWeight: 500");
    expect(applicationsSource).toContain("leading-relaxed");
    expect(applicationsSource).toContain("break-words");
    expect(applicationsSource).toContain("max-[359px]:flex-col");
    expect(applicationsSource).toContain("max-[359px]:text-left");
  });

  it("keeps every displayed Applications specification sourced from canonical product data", () => {
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

  it("makes Molecular Data readable and resilient to narrow technical values", () => {
    expect(molecularSource).toContain("MolecularTable product={product}");
    expect(molecularTableSource).toContain("product-molecular-table");
    expect(molecularTableSource).toContain("product-molecular-label");
    expect(molecularTableSource).toContain("product-molecular-value");
    expect(molecularTableSource.match(/'Inter', sans-serif/g)?.length).toBe(3);
    expect(molecularTableSource).not.toContain("'Rajdhani', sans-serif");
    expect(molecularTableSource).toContain("[overflow-wrap:anywhere]");
    expect(molecularTableSource).toContain("max-[359px]:block");
  });

  it("uses readable Inter roles throughout Handling, Documentation, and References", () => {
    expect(handlingSource).toContain("product-handling-content");
    expect(handlingSource.match(/'Inter', sans-serif/g)?.length).toBeGreaterThanOrEqual(5);
    expect(handlingSource).not.toContain("'Rajdhani', sans-serif");
    expect(handlingSource.match(/product-tab-body/g)?.length).toBe(2);
    expect(handlingSource).toContain("leading-[1.8]");
    expect(handlingSource).toContain("leading-[1.75]");
    expect(handlingSource).toContain("leading-[1.7]");
  });

  it("preserves all five full-detail sections and research-only safeguards", () => {
    for (const label of [
      "Research Overview",
      "Mechanism of Action",
      "Applications",
      "Molecular Data",
      "Handling & Sources",
    ]) {
      expect(productDetail).toContain(label);
    }
    expect(productDetail).toContain("Research Use Only — Important Notice");
    expect(productDetail).toContain("sold strictly for in-vitro laboratory research use only");
    expect(productDetail).not.toMatch(/research cycle|how to administer|personal use/i);
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
