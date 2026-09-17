import { describe, expect, it } from "vitest";
import { generateOrderNumber } from "./db";
import {
  calculateOrderQuote,
  InvalidCartItemError,
  InvalidPartnerCodeError,
  normalizePartnerCode,
  PARTNER_CODE,
  PARTNER_DISCOUNT_BPS,
  resolvePartnerBenefit,
} from "./partnerDiscount";

describe("RECROOMLV partner pricing", () => {
  it("normalizes the partner code case-insensitively after trimming", () => {
    expect(normalizePartnerCode("  recroomlv  ")).toBe(PARTNER_CODE);
    expect(normalizePartnerCode("   ")).toBeNull();
    expect(normalizePartnerCode(undefined)).toBeNull();
  });

  it("applies 10% to merchandise, leaves shipping at $7, and taxes the discounted subtotal", () => {
    const quote = calculateOrderQuote({
      items: [{ productId: "retatrutide-30mg", quantity: 1 }],
      requestedCode: "recroomlv",
    });

    expect(quote).toMatchObject({
      partnerCode: PARTNER_CODE,
      discountBps: PARTNER_DISCOUNT_BPS,
      firstUse: true,
      automatic: false,
      subtotalCents: 20_000,
      discountCents: 2_000,
      discountedSubtotalCents: 18_000,
      shippingCents: 700,
      taxCents: 1_440,
      totalCents: 20_140,
    });
  });

  it("automatically reapplies the saved benefit without another checkout code", () => {
    const benefit = resolvePartnerBenefit({
      savedCode: PARTNER_CODE,
      savedDiscountBps: PARTNER_DISCOUNT_BPS,
    });
    const quote = calculateOrderQuote({
      items: [{ productId: "tirzepatide-20mg", quantity: 1 }],
      savedCode: PARTNER_CODE,
      savedDiscountBps: PARTNER_DISCOUNT_BPS,
    });

    expect(benefit).toEqual({
      partnerCode: PARTNER_CODE,
      discountBps: PARTNER_DISCOUNT_BPS,
      firstUse: false,
      automatic: true,
    });
    expect(quote).toMatchObject({
      subtotalCents: 17_500,
      discountCents: 1_750,
      taxCents: 1_260,
      shippingCents: 700,
      totalCents: 17_710,
    });
  });

  it("does not discount an unrelated account or an order without a code", () => {
    const quote = calculateOrderQuote({
      items: [{ productId: "retatrutide-30mg", quantity: 1 }],
    });

    expect(quote.partnerCode).toBeNull();
    expect(quote.discountCents).toBe(0);
    expect(quote.taxCents).toBe(1_600);
    expect(quote.totalCents).toBe(22_300);
  });

  it("rejects invalid codes and unknown or fabricated product variants", () => {
    expect(() => calculateOrderQuote({
      items: [{ productId: "retatrutide-30mg", quantity: 1 }],
      requestedCode: "NOTRECROOM",
    })).toThrow(InvalidPartnerCodeError);

    expect(() => calculateOrderQuote({
      items: [{ productId: "not-a-product", quantity: 1 }],
    })).toThrow(InvalidCartItemError);

    expect(() => calculateOrderQuote({
      items: [{ productId: "retatrutide-30mg-999 mg", quantity: 1 }],
    })).toThrow(InvalidCartItemError);
  });

  it("resolves current variant cart IDs against canonical catalog prices", () => {
    const quote = calculateOrderQuote({
      items: [{ productId: "retatrutide-30mg-30 mg", quantity: 2 }],
      requestedCode: PARTNER_CODE,
    });

    expect(quote.items[0]).toMatchObject({
      productId: "retatrutide-30mg",
      productName: "Retatrutide",
      variantLabel: "30 mg",
      unitPriceCents: 20_000,
      lineTotalCents: 40_000,
      quantity: 2,
    });
  });

  it("formats dedicated sequence IDs directly as the new human-readable order numbers", () => {
    expect(generateOrderNumber(100_099)).toBe("LAP-100099");
    expect(generateOrderNumber(100_100)).toBe("LAP-100100");
    expect(generateOrderNumber(130_002)).toBe("LAP-130002");
    expect(generateOrderNumber(130_003)).toBe("LAP-130003");
  });
});
