import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const shopSource = fs.readFileSync(
  path.join(projectRoot, "client/src/pages/Shop.tsx"),
  "utf8",
);
const productCardSource = fs.readFileSync(
  path.join(projectRoot, "client/src/components/ProductCard.tsx"),
  "utf8",
);

describe("Shop product-card visibility", () => {
  it("observes every animated Shop product card and reveals it when intersecting", () => {
    expect(shopSource).toContain("useEffect");
    expect(shopSource).toContain('catalogRef.current?.querySelectorAll(".animate-on-scroll")');
    expect(shopSource).toContain("new IntersectionObserver");
    expect(shopSource).toContain('entry.target.classList.add("visible")');
    expect(shopSource).toContain("observer.unobserve(entry.target)");
    expect(shopSource).toContain("items.forEach(item => observer.observe(item))");
    expect(shopSource).toContain("}, [visibleProducts]);");
  });

  it("reveals cards immediately when IntersectionObserver is unavailable", () => {
    expect(shopSource).toContain('if (!("IntersectionObserver" in window))');
    expect(shopSource).toContain('items.forEach(item => item.classList.add("visible"))');
  });

  it("retains all catalog controls and dynamic product rendering", () => {
    expect(shopSource).toContain('const [activeCategory, setActiveCategory] = useState("All")');
    expect(shopSource).toContain('const [searchQuery, setSearchQuery] = useState("")');
    expect(shopSource).toContain('const [sortOrder, setSortOrder] = useState<SortOrder>("catalog")');
    expect(shopSource).toContain("visibleProducts.map((product, index) =>");
    expect(shopSource).toContain("<ProductCard key={product.id} product={product} index={index} showPublicPrice />");
    expect(productCardSource).toContain("animate-on-scroll");
  });
});
