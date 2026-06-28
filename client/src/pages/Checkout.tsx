// === ELITE LA PEPTIDES — Checkout Page ===
// Order submission with $7 flat shipping, 9% tax, Zelle payment instructions

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { CartItem } from "./Shop";
import { ArrowLeft, CheckCircle, Copy, Check } from "lucide-react";

const LOGO_URL = "/manus-storage/elite-la-peptides-logo_e9ec855c.png";
const ZELLE_PHONE = "(310) 975-9289";
const SHIPPING_FLAT = 7.00;
const TAX_RATE = 0.09;

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

export default function Checkout() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    shipName: "",
    shipEmail: "",
    shipPhone: "",
    shipAddress: "",
    shipAddress2: "",
    shipCity: "",
    shipState: "",
    shipZip: "",
    notes: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = getLoginUrl();
      return;
    }
    if (user) {
      setForm(prev => ({
        ...prev,
        shipName: prev.shipName || user.name || "",
        shipEmail: prev.shipEmail || user.email || "",
      }));
    }
    const stored = sessionStorage.getItem("elitela_cart");
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        setLocation("/shop");
      }
    } else {
      setLocation("/shop");
    }
  }, [user, loading]);

  const submitOrder = trpc.orders.submit.useMutation({
    onSuccess: (data) => {
      setOrderNumber(data.orderNumber);
      setOrderTotal(data.totalCents / 100);
      setSubmitted(true);
      sessionStorage.removeItem("elitela_cart");
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.12 0.05 255)" }}>
        <div className="text-white/50 text-sm tracking-widest uppercase" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = SHIPPING_FLAT;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(ZELLE_PHONE.replace(/\D/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    submitOrder.mutate({
      items: cart,
      ...form,
    });
  };

  const inputStyle = {
    background: "oklch(0.19 0.06 255)",
    border: "1px solid oklch(0.28 0.08 255 / 60%)",
    color: "white",
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "0.95rem",
  };

  const labelStyle = {
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 600,
    letterSpacing: "0.08em",
    fontSize: "0.75rem",
    textTransform: "uppercase" as const,
    color: "oklch(0.72 0.18 210)",
  };

  // ─── Order Confirmed / Zelle Instructions ───────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: "oklch(0.12 0.05 255)" }}>
        <div
          className="w-full max-w-lg rounded-2xl overflow-hidden"
          style={{ border: "1px solid oklch(0.28 0.08 255 / 60%)" }}
        >
          {/* Header */}
          <div
            className="px-8 py-6 text-center"
            style={{ background: "oklch(0.17 0.055 255)" }}
          >
            <CheckCircle size={48} className="mx-auto mb-3" style={{ color: "oklch(0.72 0.18 210)" }} />
            <h1
              className="text-4xl text-white mb-1"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
            >
              Order Confirmed!
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Order <strong className="text-white/80">{orderNumber}</strong> has been placed
            </p>
          </div>

          {/* Zelle Payment Instructions */}
          <div
            className="px-8 py-6"
            style={{ background: "oklch(0.14 0.05 255)" }}
          >
            <div
              className="rounded-xl p-5 mb-5"
              style={{
                background: "oklch(0.19 0.06 255)",
                border: "2px solid oklch(0.72 0.18 210 / 40%)",
              }}
            >
              <p
                className="text-xs uppercase tracking-widest mb-3"
                style={{ fontFamily: "'Rajdhani', sans-serif", color: "oklch(0.72 0.18 210)" }}
              >
                Step 1 — Send Zelle Payment
              </p>
              <p className="text-white/60 text-sm mb-4" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Open your bank's Zelle app and send the exact amount below to:
              </p>

              {/* Zelle phone */}
              <div
                className="flex items-center justify-between rounded-lg px-4 py-3 mb-3"
                style={{ background: "oklch(0.22 0.07 255)", border: "1px solid oklch(0.35 0.1 255 / 50%)" }}
              >
                <div>
                  <p className="text-white/40 text-xs mb-0.5" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Zelle to</p>
                  <p className="text-white font-bold text-lg" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
                    {ZELLE_PHONE}
                  </p>
                </div>
                <button
                  onClick={handleCopyPhone}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                  style={{
                    background: copied ? "oklch(0.5 0.2 145 / 20%)" : "oklch(0.72 0.18 210 / 15%)",
                    border: `1px solid ${copied ? "oklch(0.5 0.2 145 / 40%)" : "oklch(0.72 0.18 210 / 30%)"}`,
                    color: copied ? "oklch(0.7 0.2 145)" : "oklch(0.72 0.18 210)",
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* Amount */}
              <div
                className="flex items-center justify-between rounded-lg px-4 py-3 mb-3"
                style={{ background: "oklch(0.22 0.07 255)", border: "1px solid oklch(0.35 0.1 255 / 50%)" }}
              >
                <div>
                  <p className="text-white/40 text-xs mb-0.5" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Amount</p>
                  <p className="text-white font-bold text-2xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    ${orderTotal.toFixed(2)}
                  </p>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    background: "oklch(0.6 0.27 0 / 15%)",
                    border: "1px solid oklch(0.6 0.27 0 / 30%)",
                    color: "oklch(0.75 0.2 25)",
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  Exact amount
                </span>
              </div>

              {/* Memo */}
              <div
                className="flex items-center justify-between rounded-lg px-4 py-3"
                style={{ background: "oklch(0.22 0.07 255)", border: "1px solid oklch(0.35 0.1 255 / 50%)" }}
              >
                <div>
                  <p className="text-white/40 text-xs mb-0.5" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Memo / Note</p>
                  <p className="text-white font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
                    {orderNumber}
                  </p>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    background: "oklch(0.72 0.18 210 / 10%)",
                    border: "1px solid oklch(0.72 0.18 210 / 25%)",
                    color: "oklch(0.72 0.18 210)",
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  Include this
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div
              className="rounded-xl p-4 mb-5"
              style={{
                background: "oklch(0.19 0.06 255)",
                border: "1px solid oklch(0.28 0.08 255 / 50%)",
              }}
            >
              <p
                className="text-xs uppercase tracking-widest mb-2"
                style={{ fontFamily: "'Rajdhani', sans-serif", color: "oklch(0.72 0.18 210)" }}
              >
                Step 2 — Wait for Confirmation
              </p>
              <p className="text-white/60 text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Once we receive your Zelle payment, your order status will update to <strong className="text-white/80">Paid</strong> and we'll begin preparing your shipment. You'll receive a tracking number via email at <strong className="text-white/80">{form.shipEmail}</strong>.
              </p>
            </div>

            {/* Order summary */}
            <div
              className="rounded-xl p-4 mb-5"
              style={{
                background: "oklch(0.19 0.06 255)",
                border: "1px solid oklch(0.28 0.08 255 / 50%)",
              }}
            >
              <p className="text-white/40 text-xs mb-3 uppercase tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Order Summary</p>
              {cart.map(item => (
                <div key={item.productId} className="flex justify-between text-sm mb-1.5">
                  <span className="text-white/70" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                    {item.productName} × {item.quantity}
                  </span>
                  <span className="text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t mt-3 pt-3 space-y-1.5" style={{ borderColor: "oklch(0.28 0.08 255 / 40%)" }}>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Subtotal</span>
                  <span className="text-white/70" style={{ fontFamily: "'Rajdhani', sans-serif" }}>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Shipping</span>
                  <span className="text-white/70" style={{ fontFamily: "'Rajdhani', sans-serif" }}>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Tax (9%)</span>
                  <span className="text-white/70" style={{ fontFamily: "'Rajdhani', sans-serif" }}>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-1.5 border-t" style={{ borderColor: "oklch(0.28 0.08 255 / 40%)" }}>
                  <span className="text-white font-bold uppercase tracking-widest text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Total Due</span>
                  <span className="text-white font-bold text-2xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    ${orderTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setLocation("/account")}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold tracking-widest uppercase transition-all hover:opacity-90"
                style={{
                  background: "oklch(0.19 0.06 255)",
                  border: "1px solid oklch(0.28 0.08 255 / 60%)",
                  color: "oklch(0.72 0.18 210)",
                  fontFamily: "'Rajdhani', sans-serif",
                }}
              >
                My Orders
              </button>
              <button
                onClick={() => setLocation("/shop")}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold tracking-widest uppercase transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, oklch(0.6 0.27 0), oklch(0.55 0.25 355))",
                  color: "white",
                  fontFamily: "'Rajdhani', sans-serif",
                }}
              >
                Shop More
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Checkout Form ───────────────────────────────────────────────────────────
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <button onClick={() => setLocation("/shop")} className="text-white/50 hover:text-[#00BFFF] transition-colors">
            <ArrowLeft size={20} />
          </button>
          <img src={LOGO_URL} alt="LA Elite Peptides" className="h-9 w-auto" />
          <span
            className="text-white/60 text-sm ml-2"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, letterSpacing: "0.1em" }}
          >
            CHECKOUT
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
            <div>
              <h2
                className="text-3xl text-white mb-1"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
              >
                Shipping Information
              </h2>
              <p className="text-white/40 text-xs" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                After submitting, you'll receive Zelle payment instructions with your exact total.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle} className="block mb-1.5">Full Name *</label>
                <input
                  required
                  value={form.shipName}
                  onChange={e => setForm(p => ({ ...p, shipName: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#FF2D78]/40"
                  style={inputStyle}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label style={labelStyle} className="block mb-1.5">Email *</label>
                <input
                  required
                  type="email"
                  value={form.shipEmail}
                  onChange={e => setForm(p => ({ ...p, shipEmail: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#FF2D78]/40"
                  style={inputStyle}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label style={labelStyle} className="block mb-1.5">Phone (optional)</label>
              <input
                type="tel"
                value={form.shipPhone}
                onChange={e => setForm(p => ({ ...p, shipPhone: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#FF2D78]/40"
                style={inputStyle}
                placeholder="(310) 000-0000"
              />
            </div>

            <div>
              <label style={labelStyle} className="block mb-1.5">Street Address *</label>
              <input
                required
                value={form.shipAddress}
                onChange={e => setForm(p => ({ ...p, shipAddress: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#FF2D78]/40"
                style={inputStyle}
                placeholder="123 Main St"
              />
            </div>

            <div>
              <label style={labelStyle} className="block mb-1.5">Apt / Suite / Unit (optional)</label>
              <input
                value={form.shipAddress2}
                onChange={e => setForm(p => ({ ...p, shipAddress2: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#FF2D78]/40"
                style={inputStyle}
                placeholder="Apt 4B"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label style={labelStyle} className="block mb-1.5">City *</label>
                <input
                  required
                  value={form.shipCity}
                  onChange={e => setForm(p => ({ ...p, shipCity: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#FF2D78]/40"
                  style={inputStyle}
                  placeholder="Los Angeles"
                />
              </div>
              <div>
                <label style={labelStyle} className="block mb-1.5">State *</label>
                <select
                  required
                  value={form.shipState}
                  onChange={e => setForm(p => ({ ...p, shipState: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#FF2D78]/40"
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="">State</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle} className="block mb-1.5">ZIP *</label>
                <input
                  required
                  value={form.shipZip}
                  onChange={e => setForm(p => ({ ...p, shipZip: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#FF2D78]/40"
                  style={inputStyle}
                  placeholder="90001"
                  maxLength={10}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle} className="block mb-1.5">Order Notes (optional)</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#FF2D78]/40 resize-none"
                style={inputStyle}
                placeholder="Any special instructions..."
              />
            </div>

            {submitOrder.error && (
              <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "oklch(0.4 0.2 25 / 20%)", border: "1px solid oklch(0.5 0.2 25 / 40%)", color: "oklch(0.8 0.15 25)", fontFamily: "'Rajdhani', sans-serif" }}>
                {submitOrder.error.message}
              </div>
            )}

            <button
              type="submit"
              disabled={submitOrder.isPending || cart.length === 0}
              className="w-full py-3.5 rounded-lg font-bold text-sm tracking-widest uppercase transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, oklch(0.6 0.27 0), oklch(0.55 0.25 355))",
                color: "white",
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: "0.12em",
                boxShadow: "0 4px 20px oklch(0.6 0.27 0 / 30%)",
              }}
            >
              {submitOrder.isPending ? "Placing Order..." : `Place Order — $${total.toFixed(2)}`}
            </button>

            <p className="text-center text-white/30 text-xs" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              You'll receive Zelle payment instructions immediately after placing your order.
            </p>
          </form>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div
              className="rounded-xl p-5 sticky top-24"
              style={{
                background: "oklch(0.17 0.055 255)",
                border: "1px solid oklch(0.28 0.08 255 / 50%)",
              }}
            >
              <h3
                className="text-xl text-white mb-4"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
              >
                Order Summary
              </h3>
              <div className="space-y-3 mb-4">
                {cart.map(item => (
                  <div key={item.productId} className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                        {item.productName}
                      </p>
                      <p className="text-white/40 text-xs" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                        Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                      </p>
                    </div>
                    <span className="text-white text-sm font-medium shrink-0" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2" style={{ borderColor: "oklch(0.28 0.08 255 / 40%)" }}>
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Subtotal</span>
                  <span className="text-white text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Shipping</span>
                  <span className="text-white text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Tax (9%)</span>
                  <span className="text-white text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: "oklch(0.28 0.08 255 / 40%)" }}>
                  <span className="text-white font-bold uppercase tracking-widest text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Total</span>
                  <span className="text-white font-bold text-2xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment method note */}
              <div
                className="mt-4 rounded-lg px-3 py-3 text-xs space-y-1"
                style={{
                  background: "oklch(0.72 0.18 210 / 8%)",
                  border: "1px solid oklch(0.72 0.18 210 / 20%)",
                  color: "oklch(0.72 0.18 210)",
                  fontFamily: "'Rajdhani', sans-serif",
                }}
              >
                <p className="font-bold uppercase tracking-widest">💳 Payment via Zelle</p>
                <p className="text-white/50">After placing your order, you'll receive instructions to send payment via Zelle to {ZELLE_PHONE}.</p>
              </div>

              <div
                className="mt-3 rounded-lg px-3 py-2.5 text-xs"
                style={{
                  background: "oklch(0.19 0.06 255)",
                  border: "1px solid oklch(0.28 0.08 255 / 40%)",
                  color: "oklch(0.6 0.1 255)",
                  fontFamily: "'Rajdhani', sans-serif",
                }}
              >
                🚚 Flat-rate shipping $7.00 · 3–5 business days
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
