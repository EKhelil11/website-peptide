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
            className="w-full max-w-md flex flex-col"
            style={{
              background: "oklch(0.25 0.08 255)",
              borderLeft: "1px solid oklch(0.32 0.10 255 / 50%)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: "oklch(0.32 0.10 255 / 40%)" }}
            >
              <h2
                className="text-2xl text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.06em" }}
              >
                Your Cart ({cartCount})
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-white/30">
                  <Package size={32} className="mb-3" />
                  <p style={{ fontFamily: "'Rajdhani', sans-serif" }}>Your cart is empty</p>
                  <button
                    onClick={() => setOpen(false)}
                    className="mt-4 text-xs uppercase tracking-widest text-white/40 hover:text-[#B9C0CA] transition-colors"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 rounded-lg p-3"
                    style={{ background: "oklch(0.29 0.085 255)" }}
                  >
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-white text-sm font-medium truncate"
                        style={{ fontFamily: "'Rajdhani', sans-serif" }}
                      >
                        {item.productName}
                      </p>
                      <p
                        className="text-white/40 text-xs"
                        style={{ fontFamily: "'Rajdhani', sans-serif" }}
                      >
                        ${item.unitPrice.toFixed(2)} each
                      </p>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.productId, -1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-white/60 hover:text-white transition-colors"
                        style={{ border: "1px solid oklch(0.32 0.10 255 / 60%)" }}
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.productId, 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-white/60 hover:text-white transition-colors"
                        style={{ border: "1px solid oklch(0.32 0.10 255 / 60%)" }}
                      >
                        <Plus size={10} />
                      </button>
                    </div>

                    {/* Line total */}
                    <span
                      className="text-white font-bold text-sm w-14 text-right"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-white/30 hover:text-red-400 transition-colors ml-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div
                className="px-6 py-5 border-t"
                style={{ borderColor: "oklch(0.32 0.10 255 / 40%)" }}
              >
                <div className="flex justify-between items-center mb-4">
                  <span
                    className="text-white/60 text-sm"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                  >
                    Order Total
                  </span>
                  <span
                    className="text-3xl font-bold"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: "oklch(0.76 0.02 250)",
                    }}
                  >
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-lg font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.55 0.14 255), oklch(0.44 0.13 255))",
                    color: "white",
                    fontFamily: "'Rajdhani', sans-serif",
                    letterSpacing: "0.12em",
                    boxShadow: "0 4px 20px oklch(0.55 0.14 255 / 30%)",
                  }}
                >
                  Proceed to Checkout
                </button>
                <p
                  className="text-center text-white/30 text-xs mt-3"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}
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
