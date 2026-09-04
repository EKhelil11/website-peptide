// === ELITE LA PEPTIDES — Floating Cart ===
// Visible on all pages when user is logged in
// Shows cart count badge, opens side drawer, routes to /checkout

import { useState } from "react";
import { useLocation } from "wouter";
import { ShoppingCart, X, Plus, Minus, Package } from "lucide-react";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { useCart } from "@/contexts/CartContext";

export default function FloatingCart() {
  const { isAuthenticated } = useCustomerAuth();
  const { cart, cartCount, cartTotal, updateQty, removeFromCart } = useCart();
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();

  // Only show when logged in
  if (!isAuthenticated) return null;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    sessionStorage.setItem("elitela_cart", JSON.stringify(cart));
    setOpen(false);
    setLocation("/checkout");
  };

  return (
    <>
      {/* Floating Cart Button — bottom-left, above Text Us button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
        style={{
          background: "linear-gradient(135deg, oklch(0.55 0.14 255), oklch(0.44 0.13 255))",
          color: "white",
          fontFamily: "'Rajdhani', sans-serif",
          letterSpacing: "0.1em",
          boxShadow: "0 4px 24px oklch(0.55 0.14 255 / 40%)",
        }}
        aria-label="Open cart"
      >
        <ShoppingCart size={18} />
        <span className="hidden sm:inline">Cart</span>
        {cartCount > 0 && (
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: "oklch(0.76 0.02 250)",
              color: "oklch(0.18 0.055 255)",
            }}
          >
            {cartCount}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Drawer panel */}
          <div
            className="w-full max-w-md flex flex-col text-[#202833]"
            style={{
              background: "linear-gradient(155deg, #F6F1E9 0%, #E9DCCB 58%, #DDD2C5 100%)",
              borderLeft: "1px solid rgba(185, 192, 202, 0.9)",
              boxShadow: "-24px 0 70px rgba(7, 21, 47, 0.24)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 sm:px-6 py-5 border-b"
              style={{ borderColor: "rgba(185, 192, 202, 0.72)", background: "rgba(255, 253, 248, 0.66)" }}
            >
              <h2
                className="text-[1.9rem] text-[#10295E] leading-none"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650, letterSpacing: "0.035em" }}
              >
                Your Cart ({cartCount})
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#B9C0CA]/80 bg-white/55 text-[#5F6977] hover:border-[#174A9B]/45 hover:text-[#174A9B] transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-[#7C8693]">
                  <Package size={32} className="mb-3" />
                  <p className="text-lg" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>Your cart is empty</p>
                  <button
                    onClick={() => setOpen(false)}
                    className="mt-4 text-sm uppercase tracking-[0.13em] text-[#174A9B] hover:text-[#10295E] transition-colors"
                    style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div
                    key={item.productId}
                    className="rounded-2xl border border-[#B9C0CA]/70 bg-white/65 p-4 shadow-[0_12px_28px_rgba(7,21,47,0.09)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p
                          className="text-[#10295E] text-xl leading-[1.05]"
                          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650, letterSpacing: "0.02em" }}
                        >
                          {item.productName}
                        </p>
                        <p
                          className="mt-1.5 text-[#5F6977] text-sm"
                          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 550 }}
                        >
                          ${item.unitPrice.toFixed(2)} per item
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B9C0CA]/75 text-[#7C8693] hover:border-red-300 hover:text-red-600 transition-colors"
                        aria-label={`Remove ${item.productName} from cart`}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="mt-4 flex items-end justify-between gap-4 border-t border-[#B9C0CA]/55 pt-4">
                      <div>
                        <p className="mb-2 text-[#5F6977] text-xs uppercase tracking-[0.13em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>
                          Quantity
                        </p>
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => updateQty(item.productId, -1)}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#B9C0CA] bg-[#F6F1E9] text-[#174A9B] hover:border-[#174A9B]/50 hover:bg-white transition-colors"
                            aria-label={`Decrease ${item.productName} quantity`}
                          >
                            <Minus size={15} />
                          </button>
                          <span className="w-7 text-center text-[#10295E] text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.productId, 1)}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#B9C0CA] bg-[#F6F1E9] text-[#174A9B] hover:border-[#174A9B]/50 hover:bg-white transition-colors"
                            aria-label={`Increase ${item.productName} quantity`}
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[#5F6977] text-xs uppercase tracking-[0.13em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>
                          Item Total
                        </p>
                        <span className="mt-1 block text-[#10295E] text-2xl leading-none" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div
                className="px-4 sm:px-6 py-5 border-t"
                style={{ borderColor: "rgba(185, 192, 202, 0.72)", background: "rgba(255, 253, 248, 0.68)" }}
              >
                <div className="flex justify-between items-center mb-4">
                  <span
                    className="text-[#4B5563] text-sm uppercase tracking-[0.12em]"
                    style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}
                  >
                    Order Total
                  </span>
                  <span
                    className="text-4xl"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: "#10295E",
                      fontWeight: 650,
                    }}
                  >
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="product-boutique-cta w-full py-4 rounded-xl text-sm tracking-[0.14em] uppercase transition-all duration-200 active:scale-[0.98]"
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 800,
                  }}
                >
                  Proceed to Checkout
                </button>
                <p
                  className="text-center text-[#5F6977] text-sm mt-3"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Payment instructions provided at checkout
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
