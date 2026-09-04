import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { findProductById, products, VERIFIED_COAS } from "../client/src/lib/products";

const projectRoot = path.resolve(import.meta.dirname, "..");
const readSource = (relativePath: string) => fs.readFileSync(path.join(projectRoot, relativePath), "utf8");

const expectedReports = {
  "retatrutide-10mg": ["A110001", "26EA0701-028", "10.17 mg/vial"],
  "retatrutide-30mg": ["A100001", "26EA0701-027", "30.64 mg/vial"],
  "tirzepatide-20mg": ["N100001", "26EA0729-039", "20.42 mg/vial"],
  "tirzepatide-40mg": ["P100001", "26EA0729-040", "40.69 mg/vial"],
  "cjc1295-ipamorelin-10mg": ["E100001", "26EA0701-034", "5.19 / 5.12 mg/vial"],
  "sermorelin-10mg": ["K100001", "26EA0701-040", "10.25 mg/vial"],
  "tesamorelin-10mg": ["T100001", "26EA0729-042", "10.04 mg/vial"],
  "bpc157-tb500-wolverine": ["C1000001", "26EA0701-032", "10.14 / 10.21 mg/vial"],
  "ghk-cu-bpc157-tb500-glow": ["F100001", "26EA0701-035", "51.16 / 10.14 / 10.26 mg/vial"],
  "ghk-cu-tb500-bpc157-kpv-klow": ["M100001", "26EA0729-043", "51.26 / 9.94 / 10.15 / 10.02 mg/vial"],
  "nad-500mg": ["B100001", "26EA0701-029", "536.29 mg/vial"],
  "mots-c-10mg": ["G100001", "26EA0701-036", "10.09 mg/vial"],
  "ss-31-50mg": ["S10001", "26EA0729-041", "51.22 mg/vial"],
  "ghk-cu-100mg": ["D100001", "26EA0701-033", "110.89 mg/vial"],
  "kisspeptin-10mg": ["H100001", "26EA0701-037", "10.27 mg/vial"],
  "semax-10mg": ["J1000001", "26EA0701-039", "10.18 mg/vial"],
} as const;

describe("product-specific Certificate of Analysis records", () => {
  const appSource = readSource("client/src/App.tsx");
  const detailSource = readSource("client/src/pages/ProductDetail.tsx");
  const coaSource = readSource("client/src/pages/CertificateOfAnalysis.tsx");

  it("registers one product-specific COA route", () => {
    expect(appSource).toContain('const CertificateOfAnalysis = lazy(() => import("./pages/CertificateOfAnalysis"))');
    expect(appSource).toContain('<Route path="/coa/:id" component={CertificateOfAnalysis} />');
  });

  it("maps one exact verified report to every catalog product", () => {
    expect(products).toHaveLength(16);
    expect(Object.keys(VERIFIED_COAS)).toHaveLength(16);
    expect(products.filter(product => product.coa)).toHaveLength(16);
    expect(products.filter(product => !product.coa)).toEqual([]);
  });

  it("locks every report to its exact product, lot, report ID, and measured content", () => {
    for (const [productId, [lot, reportId, contentResult]] of Object.entries(expectedReports)) {
      const product = products.find(item => item.id === productId);
      expect(product?.coa?.lotBatch).toBe(lot);
      expect(product?.coa?.reportId).toBe(reportId);
      expect(product?.coa?.contentResult).toContain(contentResult);
      expect(product?.coa?.purityResult).toBe(">99% chromatographic purity");
    }
  });

  it("uses complete durable PDF records with batch-level scope language", () => {
    for (const product of products.filter(item => item.coa)) {
      const coa = product.coa!;
      expect(coa.status).toBe("verified");
      expect(coa.laboratory).toBe("Ethos Analytics Laboratory");
      expect(coa.accreditation).toContain("117798");
      expect(coa.method).toBe("HPLC");
      expect(coa.documentUrl).toMatch(/^\/manus-storage\/coa-[a-z0-9-]+_[a-f0-9]{8}\.pdf$/);
      expect(coa.scopeNote).toContain(coa.lotBatch);
      expect(coa.scopeNote).toContain(coa.reportId);
      expect(coa.identityResult).toContain("USP <621>");
    }
  });

  it("keeps the old GHK-Cu route compatible with the corrected 100 mg canonical record", () => {
    expect(findProductById("ghk-cu-100mg")?.id).toBe("ghk-cu-100mg");
    expect(findProductById("ghk-cu-50mg")?.id).toBe("ghk-cu-100mg");
    expect(coaSource).toContain("findProductById(id)");
  });

  it("renders verified and pending states without treating one report as catalog-wide proof", () => {
    expect(detailSource).toContain('product.coa ? "View verified COA" : "View COA status"');
    expect(detailSource).toContain("These results apply only to the sample identified");
    expect(detailSource).toContain("Pending verified upload");
    expect(coaSource).toContain("Batch-matched report available");
    expect(coaSource).toContain("View signed COA PDF");
    expect(coaSource).toContain("Pending verified document upload");
    expect(coaSource).toContain("apply only to the identified sample");
  });

  it("keeps missing-product and research-use limitations visible", () => {
    expect(coaSource).toContain("COA RECORD NOT FOUND");
    expect(coaSource).toContain('href="/shop"');
    expect(coaSource).toContain("strictly for qualified in-vitro laboratory and scientific research only");
    expect(coaSource).toContain("not intended for human or animal consumption");
  });
});
