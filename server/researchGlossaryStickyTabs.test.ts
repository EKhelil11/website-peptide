import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

const glossary = read("client/src/components/ResearchGlossaryTooltip.tsx");
const productDetail = read("client/src/pages/ProductDetail.tsx");
const products = read("client/src/lib/products.ts");
const hero = read("client/src/components/HeroSection.tsx");
const styles = read("client/src/index.css");

const overviewStart = productDetail.indexOf('activeTab === "overview"');
const mechanismStart = productDetail.indexOf('activeTab === "mechanism"');
const overviewSource = productDetail.slice(overviewStart, mechanismStart);
const nonOverviewSource = `${productDetail.slice(0, overviewStart)}${productDetail.slice(mechanismStart)}`;
const tabBarStart = productDetail.indexOf("product-detail-tabs");
const tabContentStart = productDetail.indexOf("product-detail-tab-content");
const tabBarSource = productDetail.slice(tabBarStart, tabContentStart);
const heroLinkStyles = styles.slice(
  styles.indexOf(".hero-stat-link {"),
  styles.indexOf(".hero-stat-link:hover"),
);

const prohibitedGlossaryLanguage =
  /\b(dos(?:e|age|ing)|administ(?:er|ration)|cycl(?:e|ing)|stack(?:ing)?|personal use|human consumption|animal consumption|diagnos(?:e|is)|treat(?:ment)?|prevent(?:ion)?|safe(?:ty)?|efficacy|patient)\b/i;

describe("Research Overview glossary", () => {
  it("defines a broad but bounded set of laboratory terms", () => {
    for (const term of [
      "Multi-receptor agonist",
      "Receptor pharmacology",
      "Second-messenger assay",
      "Structure–activity relationship",
      "Metabolic signaling",
      "Lipid handling",
      "Energy-regulation pathway",
      "Peptide analogue",
      "Extracellular matrix",
      "Cellular bioenergetics",
      "Neuroendocrine signaling",
      "Neurotrophin-associated signaling",
    ]) {
      expect(glossary).toContain(`term: "${term}"`);
    }

    expect(glossary).toContain("Research terminology only");
    expect(glossary).toContain("laboratory");
    expect(glossary).not.toMatch(prohibitedGlossaryLanguage);
  });

  it("uses deterministic longest-first matching and never rewrites canonical product data", () => {
    expect(glossary).toContain("index === bestMatch.index && phrase.length > bestMatch.phrase.length");
    expect(glossary).toContain("usedTermIds.has(entry.id)");
    expect(glossary).toContain("text.slice(match.index, match.index + match.phrase.length)");
    expect(overviewSource.match(/renderResearchGlossaryText/g)?.length).toBe(3);
    expect(nonOverviewSource).not.toContain("renderResearchGlossaryText(");
    expect(productDetail).toContain("product.researchClassification");
    expect(productDetail).toContain("product.synopsis");
    expect(productDetail).toContain("product.plainEnglish");
  });

  it("supports visible, named hover, focus, tap, outside-click, close-button, and Escape behavior through Radix Popover", () => {
    expect(glossary).toContain("<Popover open={open} onOpenChange={setOpen}>");
    expect(glossary).toContain("<PopoverTrigger asChild>");
    expect(glossary).toContain('type="button"');
    expect(glossary).toContain("aria-label={`Explain ${entry.term}`}");
    expect(glossary).toContain("onPointerEnter");
    expect(glossary).toContain("onPointerLeave");
    expect(glossary).toContain("onFocus");
    expect(glossary).toContain("suppressNextFocusOpen");
    expect(glossary).toContain('role="dialog"');
    expect(glossary).toContain("onOpenChange={setOpen}");
    expect(glossary).toContain("Close ${entry.term} definition");
    expect(glossary).toContain("w-[min(20rem,calc(100vw-2rem))]");
    expect(glossary).toContain("motion-reduce:animate-none");
    expect(overviewSource).toContain("Select an underlined term for a plain-language laboratory definition.");
  });
});

describe("sticky Full Product Details navigation", () => {
  it("stays viewport-top sticky with an opaque premium surface and preserved mobile grid", () => {
    expect(tabBarSource).toContain("sticky top-[88px] z-40");
    expect(tabBarSource).toContain("grid grid-cols-2");
    expect(tabBarSource).toContain("bg-[#0B1D3D]/95");
    expect(tabBarSource).toContain("backdrop-blur-xl");
    expect(tabBarSource).toContain('role="tablist"');
    expect(tabBarSource).toContain('aria-label="Full Product Details sections"');
  });

  it("keeps all five labels and exposes selected-tab relationships", () => {
    for (const label of [
      "Research Overview",
      "Mechanism of Action",
      "Applications",
      "Molecular Data",
      "Handling & Sources",
    ]) {
      expect(productDetail).toContain(label);
    }

    expect(tabBarSource).toContain('role="tab"');
    expect(tabBarSource).toContain("aria-selected={activeTab === key}");
    expect(tabBarSource).toContain("aria-controls={`product-detail-panel-${key}`}");
    expect(tabBarSource).toContain('event.key === "ArrowRight"');
    expect(tabBarSource).toContain('event.key === "ArrowLeft"');
    expect(tabBarSource).toContain('event.key === "Home"');
    expect(tabBarSource).toContain('event.key === "End"');
    expect(productDetail).toContain('role="tabpanel"');
    expect(productDetail).toContain("aria-labelledby={`product-detail-tab-${activeTab}`}");
    expect(productDetail).toContain("scroll-mt-24");
  });
});

describe("hero Signature Blend typography", () => {
  it("upgrades only the existing hero blend links to the established Cormorant display family", () => {
    expect(hero).toContain('className="hero-stat-link"');
    expect(hero).toContain('href={`/product/${s.id}`}');
    expect(heroLinkStyles).toContain("font-family: 'Cormorant Garamond', serif");
    expect(heroLinkStyles).toContain("font-size: 1rem");
    expect(heroLinkStyles).toContain("font-weight: 700");
    expect(heroLinkStyles).not.toContain("'Rajdhani', sans-serif");
  });

  it("preserves all four exact hero blend names and routes from canonical product data", () => {
    for (const [name, id] of [
      ["GH Synergy", "cjc1295-ipamorelin-10mg"],
      ["Wolverine Stack", "bpc157-tb500-wolverine"],
      ["Glow Stack", "ghk-cu-bpc157-tb500-glow"],
      ["KLOW Blend", "ghk-cu-tb500-bpc157-kpv-klow"],
    ]) {
      const productSource = products.slice(products.indexOf(`id: "${id}"`));
      expect(productSource).toContain(`stackName: "${name}"`);
    }

    expect(hero).toContain("signatureBlends.map");
    expect(hero).toContain("name: product.stackName || product.name");
  });
});
