import { describe, expect, it } from "vitest";
import { products } from "../client/src/lib/products";

describe("Retatrutide 30 mg catalog pricing", () => {
  it("uses a $200 unit price in the canonical product and variant data", () => {
    const product = products.find(item => item.id === "retatrutide-30mg");

    expect(product).toBeDefined();
    expect(product?.content).toBe("30 mg per vial");
    expect(product?.price).toBe("$200");
    expect(product?.variants).toEqual([
      { label: "30mg", price: "$200", content: "30 mg per vial" },
    ]);
  });
});
