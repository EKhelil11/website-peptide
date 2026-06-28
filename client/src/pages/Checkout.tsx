// === ELITE LA PEPTIDES — Checkout Page ===
// Redesigned to match site aesthetic: Bebas Neue headings, Rajdhani body, cyan blue CTA buttons

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, CheckCircle, Copy, Check, ShoppingBag, Truck, Shield } from "lucide-react";

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

// Cyan blue matching "Add to Cart" / "Buy Now" buttons on the product page
const CYAN_BTN = {
  background: "linear-gradient(135deg, oklch(0.65 0.22 210), oklch(0.55 0.25 230))",
  boxShadow: "0 4px 24px oklch(0.65 0.22 210 / 40%)",
  color: "white",
  fontFamily: "'Rajdhani', sans-serif",
  letterSpacing: "0.14em",
};

export default function Checkout() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const { cart, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [copied, setCopied] = useState<"phone" | "amount" | "memo" | null>(null);

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
    if (!loading && user && cart.length === 0 && !submitted) {
      setLocation("/#products");
    }
  }, [user, loading, cart.length, submitted]);

  // Sanitize cart — redirect if any item has invalid price
  useEffect(() => {
    if (!loading && cart.length > 0) {
      const hasInvalid = cart.some(item => !item.unitPrice || item.unitPrice <= 0 || isNaN(item.unitPrice));
      if (hasInvalid) {
        setLocation("/#products");
      }
    }
  }, [cart, loading]);

  const submitOrder = trpc.orders.submit.useMutation({
    onSuccess: (data) => {
      setOrderNumber(data.orderNumber ?? "");
      setOrderTotal((data.totalCents ?? 0) / 100);
      setSubmitted(true);
      clearCart();
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.12 0.05 255)" }}>
        <div className="text-white/50 text-xl tracking-widest uppercase" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice ?? 0) * item.quantity, 0);
  const shipping = SHIPPING_FLAT;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  const handleCopy = (type: "phone" | "amount" | "memo", value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    submitOrder.mutate({ items: cart, ...form });
  };

  // ─── Order Confirmed / Zelle Instructions ────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen" style={{ background: "oklch(0.12 0.05 255)" }}>
        {/* Nav */}
        <header className="sticky top-0 z-50 border-b" style={{ background: "oklch(0.15 0.055 255 / 95%)", backdropFilter: "blur(20px)", borderColor: "oklch(0.28 0.08 255 / 40%)" }}>
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-4">
            <img src={LOGO_URL} alt="LA Elite Peptides" className="h-10 w-auto" />
            <span className="text-white/60 text-base ml-2 uppercase tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
              Order Confirmed
            </span>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-6 py-12">
          {/* Success header */}
          <div className="text-center mb-10">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "oklch(0.65 0.22 210 / 15%)", border: "2px solid oklch(0.65 0.22 210 / 50%)" }}
            >
              <CheckCircle size={40} style={{ color: "oklch(0.72 0.18 210)" }} />
            </div>
            <h1 className="text-6xl text-white mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}>
              Order Placed!
            </h1>
            <p className="text-white/60 text-xl" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
              Order <span className="text-white font-bold">{orderNumber}</span> is confirmed
            </p>
          </div>

          {/* ── Zelle Payment Box ── */}
          <div
            className="rounded-2xl overflow-hidden mb-6"
            style={{ border: "2px solid oklch(0.65 0.22 210 / 50%)", background: "oklch(0.15 0.055 255)" }}
          >
            <div
              className="px-6 py-4"
              style={{ background: "oklch(0.65 0.22 210 / 15%)", borderBottom: "1px solid oklch(0.65 0.22 210 / 30%)" }}
            >
              <p className="text-2xl font-bold uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif", color: "oklch(0.85 0.18 210)", letterSpacing: "0.1em" }}>
                💳 Step 1 — Send Zelle Payment Now
              </p>
              <p className="text-white/70 text-base mt-1" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
                Open your bank app, go to Zelle, and send the exact amount below.
              </p>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Zelle Phone */}
              <div
                className="rounded-xl px-5 py-4 flex items-center justify-between"
                style={{ background: "oklch(0.19 0.06 255)", border: "1px solid oklch(0.35 0.1 255 / 50%)" }}
              >
                <div>
                  <p className="text-white/50 text-sm uppercase tracking-widest mb-1" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
                    Send Zelle To
                  </p>
                  <p className="text-white font-bold text-4xl" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
                    {ZELLE_PHONE}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy("phone", ZELLE_PHONE.replace(/\D/g, ""))}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-all"
                  style={{
                    background: copied === "phone" ? "oklch(0.5 0.2 145 / 20%)" : "oklch(0.65 0.22 210 / 20%)",
                    border: `1px solid ${copied === "phone" ? "oklch(0.5 0.2 145 / 50%)" : "oklch(0.65 0.22 210 / 40%)"}`,
                    color: copied === "phone" ? "oklch(0.7 0.2 145)" : "oklch(0.72 0.18 210)",
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  {copied === "phone" ? <Check size={16} /> : <Copy size={16} />}
                  {copied === "phone" ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* Amount */}
              <div
                className="rounded-xl px-5 py-4 flex items-center justify-between"
                style={{ background: "oklch(0.19 0.06 255)", border: "1px solid oklch(0.35 0.1 255 / 50%)" }}
              >
                <div>
                  <p className="text-white/50 text-sm uppercase tracking-widest mb-1" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
                    Exact Amount to Send
                  </p>
                  <p className="text-white font-bold text-5xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    ${orderTotal.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy("amount", orderTotal.toFixed(2))}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-all"
                  style={{
                    background: copied === "amount" ? "oklch(0.5 0.2 145 / 20%)" : "oklch(0.65 0.22 210 / 20%)",
                    border: `1px solid ${copied === "amount" ? "oklch(0.5 0.2 145 / 50%)" : "oklch(0.65 0.22 210 / 40%)"}`,
                    color: copied === "amount" ? "oklch(0.7 0.2 145)" : "oklch(0.72 0.18 210)",
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  {copied === "amount" ? <Check size={16} /> : <Copy size={16} />}
                  {copied === "amount" ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* Memo */}
              <div
                className="rounded-xl px-5 py-4 flex items-center justify-between"
                style={{ background: "oklch(0.19 0.06 255)", border: "1px solid oklch(0.35 0.1 255 / 50%)" }}
              >
                <div>
                  <p className="text-white/50 text-sm uppercase tracking-widest mb-1" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
                    Memo / Note (Required)
                  </p>
                  <p className="text-white font-bold text-3xl" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
                    {orderNumber}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy("memo", orderNumber)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-all"
                  style={{
                    background: copied === "memo" ? "oklch(0.5 0.2 145 / 20%)" : "oklch(0.65 0.22 210 / 20%)",
                    border: `1px solid ${copied === "memo" ? "oklch(0.5 0.2 145 / 50%)" : "oklch(0.65 0.22 210 / 40%)"}`,
                    color: copied === "memo" ? "oklch(0.7 0.2 145)" : "oklch(0.72 0.18 210)",
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  {copied === "memo" ? <Check size={16} /> : <Copy size={16} />}
                  {copied === "memo" ? "Copied!" : "Copy"}
                </button>
              </div>

              <p className="text-white/50 text-base text-center" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
                ⚠️ <strong className="text-white/80">Include the order number as your Zelle memo</strong> so we can match your payment.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div
            className="rounded-2xl px-6 py-5 mb-6"
            style={{ background: "oklch(0.15 0.055 255)", border: "1px solid oklch(0.28 0.08 255 / 50%)" }}
          >
            <p className="text-2xl font-bold uppercase tracking-widest mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", color: "oklch(0.85 0.18 210)", letterSpacing: "0.08em" }}>
              📦 Step 2 — We'll Ship Your Order
            </p>
            <p className="text-white/70 text-lg leading-relaxed" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
              Once we confirm your Zelle payment, your order status updates to <strong className="text-white">Paid</strong> and we begin preparing your shipment.
              A tracking number will be sent to <strong className="text-white">{form.shipEmail}</strong>.
            </p>
          </div>

          {/* Order Summary */}
          <div
            className="rounded-2xl px-6 py-5 mb-8"
            style={{ background: "oklch(0.15 0.055 255)", border: "1px solid oklch(0.28 0.08 255 / 50%)" }}
          >
            <p className="text-2xl font-bold uppercase tracking-widest mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", color: "white", letterSpacing: "0.08em" }}>
              Order Summary
            </p>
            <div className="space-y-3 mb-4">
              {cart.map(item => (
                <div key={item.productId} className="flex justify-between items-center">
                  <div>
                    <p className="text-white text-lg font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{item.productName}</p>
                    <p className="text-white/50 text-base" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Qty: {item.quantity} × ${(item.unitPrice ?? 0).toFixed(2)}</p>
                  </div>
                  <span className="text-white text-xl font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                    ${((item.unitPrice ?? 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2" style={{ borderColor: "oklch(0.28 0.08 255 / 40%)" }}>
              <div className="flex justify-between text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                <span className="text-white/60 font-semibold">Subtotal</span>
                <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                <span className="text-white/60 font-semibold">Shipping</span>
                <span className="text-white font-bold">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                <span className="text-white/60 font-semibold">Tax (9%)</span>
                <span className="text-white font-bold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: "oklch(0.28 0.08 255 / 40%)" }}>
                <span className="text-white text-2xl font-bold uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Total Due</span>
                <span className="text-white text-4xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  ${orderTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setLocation("/account")}
              className="flex-1 py-4 rounded-xl text-lg font-bold tracking-widest uppercase transition-all hover:opacity-90"
              style={{
                background: "oklch(0.19 0.06 255)",
                border: "1px solid oklch(0.35 0.1 255 / 60%)",
                color: "oklch(0.72 0.18 210)",
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: "0.1em",
              }}
            >
              My Orders
            </button>
            <button
              onClick={() => setLocation("/#products")}
              className="flex-1 py-4 rounded-xl text-lg font-bold tracking-widest uppercase transition-all hover:opacity-90"
              style={{ ...CYAN_BTN, letterSpacing: "0.1em" }}
            >
              Shop More
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Checkout Form ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.12 0.05 255)" }}>
      {/* Top Nav */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ background: "oklch(0.15 0.055 255 / 95%)", backdropFilter: "blur(20px)", borderColor: "oklch(0.28 0.08 255 / 40%)" }}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-4">
          <button onClick={() => window.history.back()} className="text-white/50 hover:text-[#00BFFF] transition-colors">
            <ArrowLeft size={22} />
          </button>
          <img src={LOGO_URL} alt="LA Elite Peptides" className="h-10 w-auto" />
          <span className="text-white/70 text-base ml-2 uppercase tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
            Checkout
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ── Shipping Form ── */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            <div>
              <h2 className="text-5xl text-white mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}>
                Shipping Information
              </h2>
              <p className="text-white/50 text-lg" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
                After submitting, you'll receive Zelle payment instructions with your exact total.
              </p>
            </div>

            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-base font-bold uppercase tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif", color: "oklch(0.72 0.18 210)" }}>
                  Full Name *
                </label>
                <input
                  required
                  value={form.shipName}
                  onChange={e => setForm(p => ({ ...p, shipName: e.target.value }))}
                  className="w-full px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00BFFF]/40 text-lg"
                  style={{ background: "oklch(0.19 0.06 255)", border: "1px solid oklch(0.35 0.1 255 / 60%)", color: "white", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block mb-2 text-base font-bold uppercase tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif", color: "oklch(0.72 0.18 210)" }}>
                  Email *
                </label>
                <input
                  required
                  type="email"
                  value={form.shipEmail}
                  onChange={e => setForm(p => ({ ...p, shipEmail: e.target.value }))}
                  className="w-full px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00BFFF]/40 text-lg"
                  style={{ background: "oklch(0.19 0.06 255)", border: "1px solid oklch(0.35 0.1 255 / 60%)", color: "white", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-2 text-base font-bold uppercase tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif", color: "oklch(0.72 0.18 210)" }}>
                Phone (optional)
              </label>
              <input
                type="tel"
                value={form.shipPhone}
                onChange={e => setForm(p => ({ ...p, shipPhone: e.target.value }))}
                className="w-full px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00BFFF]/40 text-lg"
                style={{ background: "oklch(0.19 0.06 255)", border: "1px solid oklch(0.35 0.1 255 / 60%)", color: "white", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                placeholder="(310) 000-0000"
              />
            </div>

            {/* Street */}
            <div>
              <label className="block mb-2 text-base font-bold uppercase tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif", color: "oklch(0.72 0.18 210)" }}>
                Street Address *
              </label>
              <input
                required
                value={form.shipAddress}
                onChange={e => setForm(p => ({ ...p, shipAddress: e.target.value }))}
                className="w-full px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00BFFF]/40 text-lg"
                style={{ background: "oklch(0.19 0.06 255)", border: "1px solid oklch(0.35 0.1 255 / 60%)", color: "white", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                placeholder="123 Main St"
              />
            </div>

            {/* Apt */}
            <div>
              <label className="block mb-2 text-base font-bold uppercase tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif", color: "oklch(0.72 0.18 210)" }}>
                Apt / Suite / Unit (optional)
              </label>
              <input
                value={form.shipAddress2}
                onChange={e => setForm(p => ({ ...p, shipAddress2: e.target.value }))}
                className="w-full px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00BFFF]/40 text-lg"
                style={{ background: "oklch(0.19 0.06 255)", border: "1px solid oklch(0.35 0.1 255 / 60%)", color: "white", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                placeholder="Apt 4B"
              />
            </div>

            {/* City / State / ZIP */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <div className="col-span-2 sm:col-span-1">
                <label className="block mb-2 text-base font-bold uppercase tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif", color: "oklch(0.72 0.18 210)" }}>
                  City *
                </label>
                <input
                  required
                  value={form.shipCity}
                  onChange={e => setForm(p => ({ ...p, shipCity: e.target.value }))}
                  className="w-full px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00BFFF]/40 text-lg"
                  style={{ background: "oklch(0.19 0.06 255)", border: "1px solid oklch(0.35 0.1 255 / 60%)", color: "white", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                  placeholder="Los Angeles"
                />
              </div>
              <div>
                <label className="block mb-2 text-base font-bold uppercase tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif", color: "oklch(0.72 0.18 210)" }}>
                  State *
                </label>
                <select
                  required
                  value={form.shipState}
                  onChange={e => setForm(p => ({ ...p, shipState: e.target.value }))}
                  className="w-full px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00BFFF]/40 text-lg"
                  style={{ background: "oklch(0.19 0.06 255)", border: "1px solid oklch(0.35 0.1 255 / 60%)", color: "white", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, cursor: "pointer" }}
                >
                  <option value="">State</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-base font-bold uppercase tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif", color: "oklch(0.72 0.18 210)" }}>
                  ZIP *
                </label>
                <input
                  required
                  value={form.shipZip}
                  onChange={e => setForm(p => ({ ...p, shipZip: e.target.value }))}
                  className="w-full px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00BFFF]/40 text-lg"
                  style={{ background: "oklch(0.19 0.06 255)", border: "1px solid oklch(0.35 0.1 255 / 60%)", color: "white", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                  placeholder="90001"
                  maxLength={10}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block mb-2 text-base font-bold uppercase tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif", color: "oklch(0.72 0.18 210)" }}>
                Order Notes (optional)
              </label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                className="w-full px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00BFFF]/40 resize-none text-lg"
                style={{ background: "oklch(0.19 0.06 255)", border: "1px solid oklch(0.35 0.1 255 / 60%)", color: "white", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                placeholder="Any special instructions..."
              />
            </div>

            {/* Error */}
            {submitOrder.error && (
              <div className="rounded-xl px-5 py-4 text-lg font-semibold" style={{ background: "oklch(0.4 0.2 25 / 20%)", border: "1px solid oklch(0.5 0.2 25 / 40%)", color: "oklch(0.8 0.15 25)", fontFamily: "'Rajdhani', sans-serif" }}>
                {submitOrder.error.message}
              </div>
            )}

            {/* Place Order Button — cyan blue matching Add to Cart */}
            <button
              type="submit"
              disabled={submitOrder.isPending || cart.length === 0}
              className="w-full py-5 rounded-xl font-bold text-xl tracking-widest uppercase transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ ...CYAN_BTN, fontSize: "1.25rem" }}
            >
              {submitOrder.isPending ? "Placing Order..." : `Place Order — $${total.toFixed(2)}`}
            </button>

            <p className="text-center text-white/40 text-base" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
              Zelle payment instructions will appear immediately after placing your order.
            </p>
          </form>

          {/* ── Order Summary Sidebar ── */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl p-6 sticky top-24"
              style={{ background: "oklch(0.17 0.055 255)", border: "1px solid oklch(0.28 0.08 255 / 50%)" }}
            >
              <h3 className="text-3xl text-white mb-5" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}>
                Order Summary
              </h3>

              <div className="space-y-4 mb-5">
                {cart.map(item => (
                  <div key={item.productId} className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-lg font-bold truncate" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                        {item.productName}
                      </p>
                      <p className="text-white/50 text-base" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
                        Qty: {item.quantity} × ${(item.unitPrice ?? 0).toFixed(2)}
                      </p>
                    </div>
                    <span className="text-white text-lg font-bold shrink-0" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                      ${((item.unitPrice ?? 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-5 space-y-3" style={{ borderColor: "oklch(0.28 0.08 255 / 40%)" }}>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-lg font-semibold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Subtotal</span>
                  <span className="text-white text-lg font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-lg font-semibold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Shipping</span>
                  <span className="text-white text-lg font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-lg font-semibold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Tax (9%)</span>
                  <span className="text-white text-lg font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: "oklch(0.28 0.08 255 / 40%)" }}>
                  <span className="text-white text-2xl font-bold uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}>Total</span>
                  <span className="text-white text-4xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-6 space-y-3">
                <div
                  className="rounded-xl px-4 py-3 flex items-center gap-3"
                  style={{ background: "oklch(0.65 0.22 210 / 10%)", border: "1px solid oklch(0.65 0.22 210 / 25%)" }}
                >
                  <ShoppingBag size={20} style={{ color: "oklch(0.72 0.18 210)", flexShrink: 0 }} />
                  <div>
                    <p className="text-white font-bold text-base uppercase tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Payment via Zelle</p>
                    <p className="text-white/60 text-sm" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>Send to {ZELLE_PHONE} after ordering</p>
                  </div>
                </div>
                <div
                  className="rounded-xl px-4 py-3 flex items-center gap-3"
                  style={{ background: "oklch(0.19 0.06 255)", border: "1px solid oklch(0.28 0.08 255 / 40%)" }}
                >
                  <Truck size={20} style={{ color: "oklch(0.72 0.18 210)", flexShrink: 0 }} />
                  <p className="text-white/70 text-base font-semibold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                    Flat-rate shipping $7.00 · 3–5 business days
                  </p>
                </div>
                <div
                  className="rounded-xl px-4 py-3 flex items-center gap-3"
                  style={{ background: "oklch(0.19 0.06 255)", border: "1px solid oklch(0.28 0.08 255 / 40%)" }}
                >
                  <Shield size={20} style={{ color: "oklch(0.72 0.18 210)", flexShrink: 0 }} />
                  <p className="text-white/70 text-base font-semibold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                    ≥99% Purity · Small-batch tested
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
