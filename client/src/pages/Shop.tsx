// === ELITE LA PEPTIDES — Shop / Order Portal ===
// Login-gated product catalog with cart

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { products } from "@/lib/products";
import { ShoppingCart, Plus, Minus, X, Package, LogOut, User } from "lucide-react";

const LOGO_URL = "/manus-storage/LAELITELOGONEW_dark_bg_2eaa3f51.png";

export type CartItem = {
  productId: string;
  productName: string;
  productCategory: string;
  quantity: number;
  unitPrice: number;
};

export default function Shop() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = getLoginUrl();
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.12 0.05 255)" }}>
        <div className="text-white/50 text-sm tracking-widest uppercase" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!user) return null;

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = selectedCategory === "All" ? products : products.filter(p => p.category === selectedCategory);

  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: typeof products[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        productId: product.id,
        productName: product.name,
        productCategory: product.category,
        quantity: 1,
        unitPrice: parseFloat((product.price ?? "0").replace(/[^0-9.]/g, "")),
      }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(i => i.productId === productId ? { ...i, quantity: i.quantity + delta } : i)
        .filter(i => i.quantity > 0);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    // Store cart in sessionStorage for checkout page
    sessionStorage.setItem("elitela_cart", JSON.stringify(cart));
    setLocation("/checkout");
  };

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.12 0.05 255)" }}>
      {/* Top Nav */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "oklch(0.15 0.055 255 / 95%)",
          backdropFilter: "blur(20px)",
          borderColor: "oklch(0.28 0.08 255 / 40%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/">
            <img src={LOGO_URL} alt="LA Elite Peptides" className="h-14 w-auto max-w-[260px]" />
          </a>

          <div className="flex items-center gap-4">
            {/* Account */}
            <button
              onClick={() => setLocation("/account")}
              className="flex items-center gap-2 text-white/60 hover:text-[#00BFFF] transition-colors text-sm"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
            >
              <User size={16} />
              <span className="hidden sm:inline">{user.name || "Account"}</span>
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="text-white/40 hover:text-white/70 transition-colors"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm tracking-widest uppercase transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, oklch(0.6 0.27 0), oklch(0.55 0.25 355))",
                color: "white",
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: "0.1em",
              }}
            >
              <ShoppingCart size={16} />
              <span>Cart</span>
              {cartCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "oklch(0.72 0.18 210)", color: "oklch(0.12 0.05 255)" }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <h1
          className="text-4xl sm:text-5xl text-white mb-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
        >
          Order Portal
        </h1>
        <p className="text-white/50 text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          Welcome back, {user.name || user.email}. All products are for research use only.
        </p>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                background: selectedCategory === cat ? "oklch(0.6 0.27 0)" : "oklch(0.19 0.06 255)",
                color: selectedCategory === cat ? "white" : "oklch(0.72 0.18 210)",
                border: `1px solid ${selectedCategory === cat ? "oklch(0.6 0.27 0)" : "oklch(0.28 0.08 255 / 60%)"}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(product => {
            const inCart = cart.find(i => i.productId === product.id);
            return (
              <div
                key={product.id}
                className="rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:translate-y-[-2px]"
                style={{
                  background: "oklch(0.17 0.055 255)",
                  border: "1px solid oklch(0.28 0.08 255 / 50%)",
                  boxShadow: "0 4px 20px oklch(0.12 0.05 255 / 60%)",
                }}
              >
                {/* Category badge */}
                <div className="px-4 pt-4 pb-2">
                  <span
                    className="text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded"
                    style={{
                      background: "oklch(0.72 0.18 210 / 12%)",
                      color: "oklch(0.72 0.18 210)",
                      fontFamily: "'Rajdhani', sans-serif",
                    }}
                  >
                    {product.category}
                  </span>
                </div>

                {/* Product info */}
                <div className="px-4 pb-4 flex-1 flex flex-col">
                  <h3
                    className="text-lg text-white mb-1 leading-tight"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
                  >
                    {product.name}
                  </h3>
                  <p className="text-white/40 text-xs mb-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                    {product.content}
                  </p>
                  <p className="text-white/50 text-xs mb-4 flex-1 line-clamp-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                    {product.tagline}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span
                      className="text-2xl font-bold"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", color: "oklch(0.6 0.27 0)" }}
                    >
                      ${product.price}
                    </span>

                    {inCart ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(product.id, -1)}
                          className="w-7 h-7 rounded flex items-center justify-center transition-colors hover:bg-white/10"
                          style={{ border: "1px solid oklch(0.28 0.08 255 / 60%)", color: "white" }}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-white font-bold text-sm w-5 text-center">{inCart.quantity}</span>
                        <button
                          onClick={() => updateQty(product.id, 1)}
                          className="w-7 h-7 rounded flex items-center justify-center transition-colors hover:bg-white/10"
                          style={{ border: "1px solid oklch(0.28 0.08 255 / 60%)", color: "white" }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold tracking-widest uppercase transition-all hover:opacity-90"
                        style={{
                          background: "linear-gradient(135deg, oklch(0.6 0.27 0), oklch(0.55 0.25 355))",
                          color: "white",
                          fontFamily: "'Rajdhani', sans-serif",
                        }}
                      >
                        <Plus size={12} />
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          {/* Drawer */}
          <div
            className="w-full max-w-md flex flex-col"
            style={{
              background: "oklch(0.15 0.055 255)",
              borderLeft: "1px solid oklch(0.28 0.08 255 / 50%)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "oklch(0.28 0.08 255 / 40%)" }}>
              <h2
                className="text-2xl text-white"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
              >
                Your Cart ({cartCount})
              </h2>
              <button onClick={() => setCartOpen(false)} className="text-white/50 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-white/30">
                  <Package size={32} className="mb-3" />
                  <p style={{ fontFamily: "'Rajdhani', sans-serif" }}>Your cart is empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 rounded-lg p-3"
                    style={{ background: "oklch(0.19 0.06 255)" }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                        {item.productName}
                      </p>
                      <p className="text-white/40 text-xs" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                        ${item.unitPrice} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.productId, -1)} className="w-6 h-6 rounded flex items-center justify-center text-white/60 hover:text-white transition-colors" style={{ border: "1px solid oklch(0.28 0.08 255 / 60%)" }}>
                        <Minus size={10} />
                      </button>
                      <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.productId, 1)} className="w-6 h-6 rounded flex items-center justify-center text-white/60 hover:text-white transition-colors" style={{ border: "1px solid oklch(0.28 0.08 255 / 60%)" }}>
                        <Plus size={10} />
                      </button>
                    </div>
                    <span className="text-white font-bold text-sm w-14 text-right" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                    <button onClick={() => removeFromCart(item.productId)} className="text-white/30 hover:text-red-400 transition-colors ml-1">
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-6 py-5 border-t" style={{ borderColor: "oklch(0.28 0.08 255 / 40%)" }}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/60 text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Order Total</span>
                  <span
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-lg font-bold text-sm tracking-widest uppercase transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.6 0.27 0), oklch(0.55 0.25 355))",
                    color: "white",
                    fontFamily: "'Rajdhani', sans-serif",
                    letterSpacing: "0.12em",
                    boxShadow: "0 4px 20px oklch(0.6 0.27 0 / 30%)",
                  }}
                >
                  Proceed to Checkout
                </button>
                <p className="text-center text-white/25 text-xs mt-3" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  We'll contact you to arrange payment
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
