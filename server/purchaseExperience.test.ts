import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { products } from "../client/src/lib/products";

const shopSource = readFileSync("client/src/pages/Shop.tsx", "utf8");
const cartSource = readFileSync("client/src/components/FloatingCart.tsx", "utf8");
const checkoutSource = readFileSync("client/src/pages/Checkout.tsx", "utf8");
const accountSource = readFileSync("client/src/pages/Account.tsx", "utf8");

describe("elevated purchase and account experience", () => {
  it("keeps Shop confidence metrics dynamic and applies the boutique hierarchy", () => {
    expect(shopSource).toContain("value: `${products.length}`");
    expect(shopSource).toContain("value: `${categories.length - 1}`");
    expect(shopSource).toContain('value: "Secure"');
    expect(shopSource).toContain('value: "Tracked"');
    expect(shopSource).toContain("text-[1.85rem] sm:text-[2.15rem]");
    expect(shopSource).toContain("'Cormorant Garamond', serif");
    expect(shopSource).toContain("text-[0.82rem] sm:text-[0.9rem]");
    expect(shopSource).toContain("rounded-full border border-[#B9C0CA]");
    expect(shopSource).toContain("#245FC1");
    expect(shopSource).toContain("#10295E");
  });

  it("uses readable cart item, quantity, price, total, and tap-target typography", () => {
    expect(cartSource).toContain("text-[#10295E] text-xl leading-[1.05]");
    expect(cartSource).toContain("${item.unitPrice.toFixed(2)} per item");
    expect(cartSource).toContain("h-11 w-11");
    expect(cartSource).toContain("Item Total");
    expect(cartSource).toContain("product-boutique-cta w-full py-4");
    expect(cartSource).toContain("updateQty(item.productId, -1)");
    expect(cartSource).toContain("updateQty(item.productId, 1)");
    expect(cartSource).toContain("removeFromCart(item.productId)");
    expect(cartSource).toContain('setLocation("/checkout")');
  });

  it("preserves shipping, tax, Zelle, order submission, and dynamic confirmation values", () => {
    expect(checkoutSource).toContain('const ZELLE_PHONE = "(310) 975-9289"');
    expect(checkoutSource).toContain("const SHIPPING_FLAT = 7.00");
    expect(checkoutSource).toContain("const TAX_RATE = 0.08");
    expect(checkoutSource).toContain("const tax = subtotal * TAX_RATE");
    expect(checkoutSource).toContain("const total = subtotal + shipping + tax");
    expect(checkoutSource).toContain("submitOrder.mutate({ items: cart, ...form })");
    expect(checkoutSource).toContain("setOrderNumber(data.orderNumber ?? \"\")");
    expect(checkoutSource).toContain("setOrderTotal((data.totalCents ?? 0) / 100)");
    expect(checkoutSource).toContain("handleCopy(\"memo\", orderNumber)");
    expect(checkoutSource).toContain("{form.shipEmail}");
  });

  it("uses light purchase surfaces and readable entered form text", () => {
    expect(checkoutSource).toContain("const PURCHASE_PAGE_STYLE");
    expect(checkoutSource).toContain("linear-gradient(145deg, #F6F1E9 0%, #E9DCCB 55%, #DDD2C5 100%)");
    expect(checkoutSource).toContain("const PURCHASE_FIELD_STYLE");
    expect(checkoutSource).toContain('color: "#202833"');
    expect(checkoutSource).toContain("'Inter', sans-serif");
    expect(checkoutSource).toContain("placeholder:text-[#7C8693]");
    expect(checkoutSource).toContain("product-boutique-cta w-full py-5");
  });

  it("elevates the submitted payment, memo, shipment, and summary hierarchy", () => {
    expect(checkoutSource).toContain("Purchase recorded");
    expect(checkoutSource).toContain("Step 01 · Payment");
    expect(checkoutSource).toContain("Exact Amount to Send");
    expect(checkoutSource).toContain("Required Zelle Memo");
    expect(checkoutSource).toContain("Step 02 · Fulfillment");
    expect(checkoutSource).toContain("Include the order number as your Zelle memo");
    expect(checkoutSource).toContain("Order Summary");
    expect(checkoutSource).toContain("Total Due");
  });

  it("keeps customer and order data dynamic while elevating Account hierarchy", () => {
    expect(accountSource).toContain("{customer.firstName} {customer.lastName} · {customer.email}");
    expect(accountSource).toContain("{orders.length}");
    expect(accountSource).toContain("{order.orderNumber || `Order #${order.id}`}");
    expect(accountSource).toContain("{order.shipAddress}, {order.shipCity}, {order.shipState} {order.shipZip}");
    expect(accountSource).toContain("${((order.totalCents ?? 0) / 100).toFixed(2)}");
    expect(accountSource).toContain("STATUS_CONFIG[order.status]");
    expect(accountSource).toContain('href="sms:(310)975-9289"');
    expect(accountSource).toContain('href="mailto:support@laelitepeps.com"');
    expect(accountSource).toContain("Customer dashboard");
    expect(accountSource).toContain("ACCOUNT_PANEL_STYLE");
  });

  it("keeps protected owner-confirmed catalog prices", () => {
    expect(products.find(product => product.id === "tirzepatide-20mg")?.price).toBe("$175");
    expect(products.find(product => product.id === "retatrutide-30mg")?.price).toBe("$200");
  });

  it("contains no purchase-flow screenshot bypass", () => {
    for (const source of [shopSource, cartSource, checkoutSource, accountSource]) {
      expect(source).not.toContain("purchase-flow-audit");
      expect(source).not.toContain("purchase-audit");
      expect(source).not.toContain("checkout-audit");
    }
  });
});
