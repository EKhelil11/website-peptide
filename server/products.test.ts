import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { catalogCounts, findProductById, products } from "../client/src/lib/products";

const projectRoot = path.resolve(import.meta.dirname, "..");
const heroSource = fs.readFileSync(path.join(projectRoot, "client/src/components/HeroSection.tsx"), "utf8");
const aboutSource = fs.readFileSync(path.join(projectRoot, "client/src/components/AboutSection.tsx"), "utf8");

const expectedCatalog = [
  ["retatrutide-10mg", "$150", "/manus-storage/Reta10Mg_c8429e02-optimized_a621611b.webp"],
  ["retatrutide-30mg", "$200", "/manus-storage/Reta30BlueFinal_a4815d6f-optimized_40b4c2a1.webp"],
  ["tirzepatide-20mg", "$175", "/manus-storage/Tirzepatide20mg_6cd95bb5-optimized_47994734.webp"],
  ["tirzepatide-40mg", "$200", "/manus-storage/Tirzepatide40mg_7e16f7e2-optimized_7ee57055.webp"],
  ["cjc1295-ipamorelin-10mg", "$80", "/manus-storage/CJCIpamoreline10Mg_5d73519c-optimized_0bd8d7ec.webp"],
  ["sermorelin-10mg", "$75", "/manus-storage/semerelin10_648172ea-optimized_5d70044e.webp"],
  ["tesamorelin-10mg", "$70", "/manus-storage/Tesamorelin10Mg_9758abb9-optimized_047809a9.webp"],
  ["bpc157-tb500-wolverine", "$100", "/manus-storage/Wolverine1010_55ef84ca-optimized_1961bbb6.webp"],
  ["ghk-cu-bpc157-tb500-glow", "$120", "/manus-storage/GLOW70MG_ffa067ff-optimized_decb6517.webp"],
  ["ghk-cu-tb500-bpc157-kpv-klow", "$130", "/manus-storage/Klow80MG_329db60a-optimized_e152532d.webp"],
  ["nad-500mg", "$100", "/manus-storage/NAD-Plus-500mg_96c2d34f-optimized_4c0dc5da.webp"],
  ["mots-c-10mg", "$70", "/manus-storage/MOTSC10_eb4d383a-optimized_53fa8b2f.webp"],
  ["ss-31-50mg", "$70", "/manus-storage/ss-3150Mg_e5197e43-optimized_98b362f8.webp"],
  ["ghk-cu-100mg", "$80", "/manus-storage/GHKCU_6ed5c2e6-optimized_70147f0b.webp"],
  ["kisspeptin-10mg", "$80", "/manus-storage/kisspeptin10mg_39626528-optimized_dc695724.webp"],
  ["semax-10mg", "$60", "/manus-storage/Semax10_cb70da9c-optimized_f11efad4.webp"],
] as const;

describe("finalized research catalog", () => {
  it("contains the 16 owner-confirmed products in GLP-first and HGH-activator-second order", () => {
    expect(products).toHaveLength(16);
    expect(products.map(product => product.id)).toEqual(expectedCatalog.map(([id]) => id));
    expect(products.slice(0, 4).every(product => product.category === "GLP")).toBe(true);
    expect(products.slice(4, 7).every(product => product.category === "HGH Activators")).toBe(true);
  });

  it("preserves every existing price and uses the five owner-confirmed new prices", () => {
    for (const [id, price] of expectedCatalog) {
      expect(products.find(product => product.id === id)?.price).toBe(price);
    }
    expect(products.find(product => product.id === "retatrutide-30mg")?.variants).toEqual([
      { label: "30 mg", price: "$200", content: "30 mg per vial" },
    ]);
  });

  it("maps every canonical product to its matching owner-supplied durable image", () => {
    for (const [id, , image] of expectedCatalog) {
      expect(products.find(product => product.id === id)?.images).toEqual([image]);
    }
  });

  it("uses the accurate GHK-Cu 100 mg canonical ID while preserving the former URL as an alias", () => {
    expect(findProductById("ghk-cu-100mg")?.content).toBe("100 mg per vial");
    expect(findProductById("ghk-cu-50mg")?.id).toBe("ghk-cu-100mg");
  });

  it("derives the current compound and signature-blend counts from the catalog", () => {
    expect(catalogCounts.compounds).toBe(16);
    expect(catalogCounts.signatureBlends).toBe(4);
    expect(products.filter(product => product.isStack).map(product => product.stackName)).toEqual([
      "GH Synergy",
      "Wolverine Stack",
      "Glow Stack",
      "KLOW Blend",
    ]);
    expect(heroSource).toContain("catalogCounts.compounds");
    expect(heroSource).toContain("catalogCounts.signatureBlends");
    expect(aboutSource).not.toContain("catalogCounts.compounds");
    expect(aboutSource).toContain("COA-Reported Purity");
    expect(aboutSource).not.toMatch(/>\s*11\s*</);
  });

  it("provides comprehensive research-only details, handling, documentation sources, and disclaimers", () => {
    for (const product of products) {
      expect(product.synopsis.length).toBeGreaterThan(80);
      expect(product.plainEnglish.length).toBeGreaterThan(250);
      expect(product.howItWorks.length).toBeGreaterThan(250);
      expect(product.whoIsItFor.length).toBeGreaterThan(150);
      expect(product.benefits.length).toBeGreaterThanOrEqual(6);
      expect(product.researchClassification.length).toBeGreaterThan(20);
      expect(product.handling).toContain("matched Certificate of Analysis");
      expect(product.references.length).toBeGreaterThanOrEqual(1);
      expect(product.references.every(reference => reference.url.startsWith("https://"))).toBe(true);
      expect(product.disclaimer?.toLowerCase()).toContain("in-vitro laboratory research");
      expect(product.disclaimer?.toLowerCase()).toContain("not intended for human or animal use");
    }
  });

  it("does not convert artwork purity language into unsupported catalog-wide claims", () => {
    const descriptiveText = products
      .map(({ coa: _coa, ...product }) => product)
      .map(product => JSON.stringify(product).toLowerCase())
      .join(" ");
    expect(descriptiveText).not.toMatch(/99\s*%\s*pure|third-party tested|pharmaceutical-grade/);
    expect(descriptiveText).not.toMatch(/research cycle|6\s*[-–]\s*7 week/);
  });
});
