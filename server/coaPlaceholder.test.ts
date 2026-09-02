import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { products } from "../client/src/lib/products";

const projectRoot = path.resolve(import.meta.dirname, "..");
const readSource = (relativePath: string) => fs.readFileSync(path.join(projectRoot, relativePath), "utf8");

describe("product Certificate of Analysis placeholders", () => {
  const appSource = readSource("client/src/App.tsx");
  const detailSource = readSource("client/src/pages/ProductDetail.tsx");
  const coaSource = readSource("client/src/pages/CertificateOfAnalysis.tsx");

  it("registers one product-specific COA route", () => {
    expect(appSource).toContain('import CertificateOfAnalysis from "./pages/CertificateOfAnalysis"');
    expect(appSource).toContain('<Route path="/coa/:id" component={CertificateOfAnalysis} />');
  });

  it("adds the shared COA status link to every canonical product detail page", () => {
    expect(products).toHaveLength(11);
    expect(detailSource).toContain('href={`/coa/${product.id}`}');
    expect(detailSource).toContain("Certificate of Analysis (COA)");
    expect(detailSource).toContain("Pending verified upload");
  });

  it("uses canonical product IDs and shows a clear missing-product state", () => {
    expect(coaSource).toContain("products.find(item => item.id === id)");
    expect(coaSource).toContain("COA RECORD NOT FOUND");
    expect(coaSource).toContain('href="/shop"');
  });

  it("states that no verified document is currently available", () => {
    expect(coaSource).toContain("A verified report has not yet been uploaded");
    expect(coaSource).toContain("Verified file");
    expect(coaSource).toContain("Not yet available");
    expect(coaSource).toContain("Unavailable until verification");
  });

  it("does not fabricate report metadata or analytical claims", () => {
    expect(coaSource).not.toMatch(/passed testing|independent laboratory|third-party tested|99(?:\.|%)|batch passed/i);
    expect(coaSource).not.toMatch(/href=["'`][^"'`]*\.pdf/i);
  });

  it("keeps research-use limitations visible", () => {
    expect(coaSource).toContain("strictly for in-vitro laboratory and scientific research only");
    expect(coaSource).toContain("not intended for human or animal consumption");
  });
});
