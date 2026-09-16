import { products } from "../client/src/lib/products";

export const PARTNER_CODE = "RECROOMLV";
export const PARTNER_DISCOUNT_BPS = 1_000;
export const TAX_RATE_BPS = 800;
export const SHIPPING_CENTS = 700;

export type PartnerCartInput = {
  productId: string;
  quantity: number;
};

export type CanonicalOrderItem = {
  productId: string;
  productName: string;
  variantLabel?: string;
  productCategory: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
};

export type PartnerBenefit = {
  partnerCode: string | null;
  discountBps: number;
  firstUse: boolean;
  automatic: boolean;
};

export type OrderQuote = PartnerBenefit & {
  items: CanonicalOrderItem[];
  subtotalCents: number;
  discountCents: number;
  discountedSubtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
};

export class InvalidPartnerCodeError extends Error {
  constructor() {
    super("This partner code is not valid.");
    this.name = "InvalidPartnerCodeError";
  }
}

export class InvalidCartItemError extends Error {
  constructor(productId: string) {
    super(`Product ${productId} is not available.`);
    this.name = "InvalidCartItemError";
  }
}

export function normalizePartnerCode(value?: string | null): string | null {
  const normalized = value?.trim().toUpperCase() ?? "";
  return normalized || null;
}

function parsePriceCents(value: string | null): number {
  if (!value) throw new Error("Product price is unavailable.");
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error("Product price is unavailable.");
  }
  return Math.round(parsed * 100);
}

function findProductForCartId(productId: string) {
  return products
    .slice()
    .sort((a, b) => b.id.length - a.id.length)
    .find(product => {
      const ids = [product.id, ...(product.legacyIds ?? [])];
      return ids.some(id => productId === id || productId.startsWith(`${id}-`));
    });
}

export function resolveCanonicalOrderItems(items: PartnerCartInput[]): CanonicalOrderItem[] {
  return items.map(item => {
    const product = findProductForCartId(item.productId);
    if (!product || !Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new InvalidCartItemError(item.productId);
    }

    const matchedId = [product.id, ...(product.legacyIds ?? [])]
      .sort((a, b) => b.length - a.length)
      .find(id => item.productId === id || item.productId.startsWith(`${id}-`))!;
    const requestedVariant = item.productId === matchedId
      ? null
      : item.productId.slice(matchedId.length + 1);
    const variant = requestedVariant
      ? product.variants?.find(option => option.label === requestedVariant)
      : undefined;

    if (requestedVariant && !variant) {
      throw new InvalidCartItemError(item.productId);
    }

    const unitPriceCents = parsePriceCents(variant?.price ?? product.price);

    return {
      productId: product.id,
      productName: product.name,
      variantLabel: variant?.label,
      productCategory: product.category,
      quantity: item.quantity,
      unitPriceCents,
      lineTotalCents: unitPriceCents * item.quantity,
    };
  });
}

export function resolvePartnerBenefit(input: {
  requestedCode?: string | null;
  savedCode?: string | null;
  savedDiscountBps?: number | null;
}): PartnerBenefit {
  const requestedCode = normalizePartnerCode(input.requestedCode);
  const savedCode = normalizePartnerCode(input.savedCode);
  const savedDiscountBps = input.savedDiscountBps ?? 0;
  const hasSavedBenefit = savedCode === PARTNER_CODE && savedDiscountBps === PARTNER_DISCOUNT_BPS;

  if (requestedCode && requestedCode !== PARTNER_CODE) {
    throw new InvalidPartnerCodeError();
  }

  if (requestedCode === PARTNER_CODE) {
    return {
      partnerCode: PARTNER_CODE,
      discountBps: PARTNER_DISCOUNT_BPS,
      firstUse: !hasSavedBenefit,
      automatic: false,
    };
  }

  if (hasSavedBenefit) {
    return {
      partnerCode: PARTNER_CODE,
      discountBps: PARTNER_DISCOUNT_BPS,
      firstUse: false,
      automatic: true,
    };
  }

  return {
    partnerCode: null,
    discountBps: 0,
    firstUse: false,
    automatic: false,
  };
}

export function calculateOrderQuote(input: {
  items: PartnerCartInput[];
  requestedCode?: string | null;
  savedCode?: string | null;
  savedDiscountBps?: number | null;
}): OrderQuote {
  const items = resolveCanonicalOrderItems(input.items);
  const benefit = resolvePartnerBenefit(input);
  const subtotalCents = items.reduce((sum, item) => sum + item.lineTotalCents, 0);
  const discountCents = Math.round((subtotalCents * benefit.discountBps) / 10_000);
  const discountedSubtotalCents = subtotalCents - discountCents;
  const taxCents = Math.round((discountedSubtotalCents * TAX_RATE_BPS) / 10_000);
  const totalCents = discountedSubtotalCents + SHIPPING_CENTS + taxCents;

  return {
    ...benefit,
    items,
    subtotalCents,
    discountCents,
    discountedSubtotalCents,
    shippingCents: SHIPPING_CENTS,
    taxCents,
    totalCents,
  };
}
