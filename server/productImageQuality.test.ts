import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { products } from "../client/src/lib/products";

const projectRoot = path.resolve(import.meta.dirname, "..");
const productCardSource = fs.readFileSync(
  path.join(projectRoot, "client/src/components/ProductCard.tsx"),
  "utf8",
);

describe("crisp product-lineup image presentation", () => {
  it("maps all 16 canonical products to unique crisp durable WebP assets", () => {
    const images = products.flatMap(product => product.images ?? []);
    expect(images).toHaveLength(16);
    expect(new Set(images).size).toBe(16);
    expect(images.every(image => /^\/manus-storage\/.+-card-crisp_[a-f0-9]+\.webp$/.test(image))).toBe(true);
  });

  it("removes the former aggressively optimized product image mappings", () => {
    const images = products.flatMap(product => product.images ?? []);
    expect(images.every(image => !image.includes("-optimized_"))).toBe(true);
  });

  it("uses a cool-silver and navy contrast stage rather than the former white-gold field", () => {
    expect(productCardSource).toContain("product-image-stage");
    expect(productCardSource).toContain("#D9E1EC");
    expect(productCardSource).toContain("#8FA1BA");
    expect(productCardSource).toContain("#10295E");
    expect(productCardSource).not.toContain("linear-gradient(135deg, #E9DCCB 0%, #F6F1E9 100%)");
  });

  it("renders vial artwork at full opacity with deterministic dimensions and edge separation", () => {
    expect(productCardSource).toContain("width={1024}");
    expect(productCardSource).toContain("height={1535}");
    expect(productCardSource).toContain("drop-shadow-[0_16px_14px_rgba(16,41,94,0.28)]");
    expect(productCardSource).not.toContain("opacity-95");
  });

  it("preserves lazy asynchronous image loading for mobile performance", () => {
    expect(productCardSource).toContain('loading="lazy"');
    expect(productCardSource).toContain('decoding="async"');
  });
});
