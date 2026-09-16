// === ELITE LA PEPTIDES — Checkout Page ===
// Boutique purchase flow: Cormorant display, Rajdhani utility, Inter body, warm light surfaces

import { useState, useEffect, useMemo, type CSSProperties } from "react";
import { useLocation } from "wouter";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, CheckCircle, Copy, Check, ShoppingBag, Truck, Shield } from "lucide-react";
import { AUTH_LOGO_SIZE_CLASS, PRIMARY_LOGO_ALT, PRIMARY_LOGO_URL } from "@/lib/brandAssets";
const ZELLE_PHONE = "(310) 975-9289";
const SHIPPING_FLAT = 7.00;
const TAX_RATE = 0.08;

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

const BOUTIQUE_BTN = {
  color: "#10295E",
  fontFamily: "'Rajdhani', sans-serif",
  letterSpacing: "0.14em",
};

const PURCHASE_PAGE_STYLE: CSSProperties = {
  background: "radial-gradient(circle at 10% 0%, rgba(36,95,193,0.08), transparent 28rem), linear-gradient(145deg, #F6F1E9 0%, #E9DCCB 55%, #DDD2C5 100%)",
};

const PURCHASE_HEADER_STYLE: CSSProperties = {
  background: "rgba(246, 241, 233, 0.94)",
  backdropFilter: "blur(20px)",
  borderColor: "rgba(185, 192, 202, 0.72)",
  boxShadow: "0 8px 30px rgba(7, 21, 47, 0.08)",
};

const LIGHT_PANEL_STYLE: CSSProperties = {
  background: "linear-gradient(145deg, rgba(255,253,248,0.96), rgba(246,241,233,0.92))",
  border: "1px solid rgba(185, 192, 202, 0.78)",
  boxShadow: "0 20px 55px rgba(7, 21, 47, 0.12), inset 0 1px 0 rgba(255,255,255,0.95)",
};

const PURCHASE_FIELD_STYLE: CSSProperties = {
  background: "rgba(255, 253, 248, 0.92)",
  border: "1px solid rgba(124, 134, 147, 0.62)",
  color: "#202833",
  fontFamily: "'Inter', sans-serif",
  fontWeight: 550,
};

const PURCHASE_LABEL_STYLE: CSSProperties = {
  color: "#10295E",
  fontFamily: "'Rajdhani', sans-serif",
  fontWeight: 750,
};

export default function Checkout() {
  const { customer, isLoading } = useCustomerAuth();
  const [, setLocation] = useLocation();
  const { cart, clearCart } = useCart();
  const integrationStatus = trpc.integrations.status.useQuery();
  const emailConfigured = integrationStatus.data?.email.configured ?? false;
  const fulfillmentConfigured = integrationStatus.data?.shipstation.configured ?? false;
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [orderReceipt, setOrderReceipt] = useState<{
    subtotalCents: number;
    discountCents: number;
    partnerCode: string | null;
    shippingCents: number;
    taxCents: number;
  } | null>(null);
  const [confirmedItems, setConfirmedItems] = useState(cart);
  const [partnerCodeDraft, setPartnerCodeDraft] = useState("");
  const [requestedPartnerCode, setRequestedPartnerCode] = useState("");
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
    if (!isLoading && !customer) {
      setLocation("/login");
      return;
    }
    if (customer) {
      setForm(prev => ({
        ...prev,
        shipName: prev.shipName || `${customer.firstName} ${customer.lastName}` || "",
        shipEmail: prev.shipEmail || customer.email || "",
      }));
    }
    if (!isLoading && customer && cart.length === 0 && !submitted) {
      setLocation("/#products");
    }
  }, [customer, isLoading, cart.length, submitted]);

  // Sanitize cart — redirect if any item has invalid price
  useEffect(() => {
    if (!isLoading && cart.length > 0) {
      const hasInvalid = cart.some(item => !item.unitPrice || item.unitPrice <= 0 || isNaN(item.unitPrice));
      if (hasInvalid) {
        setLocation("/#products");
      }
    }
  }, [cart, isLoading]);

  const quoteInput = useMemo(() => ({
    items: cart.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
    partnerCode: requestedPartnerCode || undefined,
  }), [cart, requestedPartnerCode]);

  const orderQuote = trpc.orders.quote.useQuery(quoteInput, {
    enabled: !!customer && cart.length > 0,
    retry: false,
  });

  const submitOrder = trpc.orders.submit.useMutation({
    onSuccess: (data) => {
      setOrderNumber(data.orderNumber ?? "");
      setOrderTotal((data.totalCents ?? 0) / 100);
      setOrderReceipt({
        subtotalCents: data.subtotalCents,
        discountCents: data.discountCents,
        partnerCode: data.partnerCode,
        shippingCents: data.shippingCents,
        taxCents: data.taxCents,
      });
      setSubmitted(true);
      clearCart();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={PURCHASE_PAGE_STYLE}>
        <div className="text-[#10295E] text-xl tracking-[0.16em] uppercase" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>Preparing Checkout...</div>
      </div>
    );
  }

  if (!customer) return null;

  const localSubtotal = cart.reduce((sum, item) => sum + (item.unitPrice ?? 0) * item.quantity, 0);
  const subtotal = (orderQuote.data?.subtotalCents ?? Math.round(localSubtotal * 100)) / 100;
  const discount = (orderQuote.data?.discountCents ?? 0) / 100;
  const shipping = (orderQuote.data?.shippingCents ?? Math.round(SHIPPING_FLAT * 100)) / 100;
  const tax = (orderQuote.data?.taxCents ?? Math.round(localSubtotal * TAX_RATE * 100)) / 100;
  const total = (orderQuote.data?.totalCents ?? Math.round((localSubtotal + SHIPPING_FLAT + localSubtotal * TAX_RATE) * 100)) / 100;
  const appliedPartnerCode = orderQuote.data?.partnerCode ?? null;
  const hasSavedPartnerBenefit = customer.partnerCode === "RECROOMLV" && customer.partnerDiscountBps === 1000;

  const handleCopy = (type: "phone" | "amount" | "memo", value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || orderQuote.isLoading || orderQuote.error) return;
    setConfirmedItems(cart);
    submitOrder.mutate({
      items: cart,
      ...form,
      partnerCode: requestedPartnerCode || undefined,
    });
  };

  // ─── Order Confirmed / Zelle Instructions ────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen text-[#202833]" style={PURCHASE_PAGE_STYLE}>
        {/* Nav */}
        <header className="sticky top-0 z-50 border-b" style={PURCHASE_HEADER_STYLE}>
          <div className="max-w-5xl mx-auto px-6 h-24 flex items-center gap-4">
            <img src={PRIMARY_LOGO_URL} alt={PRIMARY_LOGO_ALT} className={AUTH_LOGO_SIZE_CLASS} />
            <span className="hidden min-[360px]:inline text-[#10295E] text-base ml-2 uppercase tracking-[0.16em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>
              Order Confirmed
            </span>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          {/* Success header */}
          <div className="text-center mb-10">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "linear-gradient(145deg, #245FC1, #10295E)", border: "2px solid rgba(185, 192, 202, 0.9)", boxShadow: "0 14px 34px rgba(7,21,47,0.2)" }}
            >
              <CheckCircle size={40} style={{ color: "#F6F1E9" }} />
            </div>
            <p className="text-[#174A9B] text-xs uppercase tracking-[0.2em] mb-2" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>Purchase recorded</p>
            <h1 className="text-5xl sm:text-6xl text-[#10295E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650, letterSpacing: "0.035em" }}>
              Order Placed!
            </h1>
            <p className="text-[#4B5563] text-base sm:text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
              Order <span className="text-[#10295E] font-semibold">{orderNumber}</span> is confirmed
            </p>
            {orderReceipt?.partnerCode && (
              <p className="mx-auto mt-4 w-fit rounded-full border border-[#174A9B]/25 bg-[#174A9B]/[0.07] px-4 py-2 text-sm uppercase tracking-[0.12em] text-[#174A9B]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}>
                {orderReceipt.partnerCode} · 10% partner benefit applied
              </p>
            )}
          </div>

          {/* ── Zelle Payment Box ── */}
          <div
            className="rounded-[1.75rem] overflow-hidden mb-6"
            style={LIGHT_PANEL_STYLE}
          >
            <div
              className="px-6 py-4"
              style={{ background: "linear-gradient(135deg, rgba(233,220,203,0.78), rgba(246,241,233,0.92))", borderBottom: "1px solid rgba(185,192,202,0.72)" }}
            >
              <p className="text-[#174A9B] text-xs uppercase tracking-[0.18em] mb-1" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>Step 01 · Payment</p>
              <p className="text-2xl sm:text-3xl leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#10295E", fontWeight: 650, letterSpacing: "0.025em" }}>
                Send Zelle Payment Now
              </p>
              <p className="text-[#4B5563] text-base mt-2 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Open your bank app, go to Zelle, and send the exact amount below.
              </p>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Zelle Phone */}
              <div
                className="rounded-2xl px-4 sm:px-5 py-4 flex flex-col min-[390px]:flex-row min-[390px]:items-center min-[390px]:justify-between gap-4"
                style={{ background: "rgba(255, 253, 248, 0.82)", border: "1px solid rgba(185, 192, 202, 0.78)" }}
              >
                <div>
                  <p className="text-[#5F6977] text-xs uppercase tracking-[0.15em] mb-1" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>
                    Send Zelle To
                  </p>
                  <p className="text-[#10295E] text-3xl sm:text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650, letterSpacing: "0.035em" }}>
                    {ZELLE_PHONE}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy("phone", ZELLE_PHONE.replace(/\D/g, ""))}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm uppercase tracking-[0.12em] transition-all"
                  style={{
                    background: copied === "phone" ? "rgba(57, 135, 90, 0.12)" : "rgba(233, 220, 203, 0.7)",
                    border: `1px solid ${copied === "phone" ? "rgba(57, 135, 90, 0.45)" : "rgba(185, 192, 202, 0.9)"}`,
                    color: copied === "phone" ? "#2D6C47" : "#174A9B",
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 800,
                  }}
                >
                  {copied === "phone" ? <Check size={16} /> : <Copy size={16} />}
                  {copied === "phone" ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* Amount */}
              <div
                className="rounded-2xl px-4 sm:px-5 py-4 flex flex-col min-[390px]:flex-row min-[390px]:items-center min-[390px]:justify-between gap-4"
                style={{ background: "rgba(246, 241, 233, 0.9)", border: "1px solid rgba(185, 192, 202, 0.78)" }}
              >
                <div>
                  <p className="text-[#5F6977] text-xs uppercase tracking-[0.15em] mb-1" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>
                    Exact Amount to Send
                  </p>
                  <p className="text-[#10295E] text-4xl sm:text-5xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>
                    ${orderTotal.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy("amount", orderTotal.toFixed(2))}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm uppercase tracking-[0.12em] transition-all"
                  style={{
                    background: copied === "amount" ? "rgba(57, 135, 90, 0.12)" : "rgba(233, 220, 203, 0.7)",
                    border: `1px solid ${copied === "amount" ? "rgba(57, 135, 90, 0.45)" : "rgba(185, 192, 202, 0.9)"}`,
                    color: copied === "amount" ? "#2D6C47" : "#174A9B",
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 800,
                  }}
                >
                  {copied === "amount" ? <Check size={16} /> : <Copy size={16} />}
                  {copied === "amount" ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* Memo */}
              <div
                className="rounded-2xl px-4 sm:px-5 py-4 flex flex-col min-[390px]:flex-row min-[390px]:items-center min-[390px]:justify-between gap-4"
                style={{
                  background: "linear-gradient(135deg, rgba(233,220,203,0.82), rgba(255,253,248,0.92))",
                  border: "2px solid rgba(23, 74, 155, 0.38)",
                  boxShadow: "0 14px 30px rgba(7, 21, 47, 0.09)",
                }}
              >
                <div>
                  <p className="text-[#174A9B] text-xs uppercase tracking-[0.14em] mb-1" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}>
                    Required Zelle Memo
                  </p>
                  <p className="text-3xl sm:text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650, letterSpacing: "0.035em", color: "#10295E" }}>
                    {orderNumber}
                  </p>
                  <p className="text-[#4B5563] text-sm mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Paste this into the Memo field in Zelle
                  </p>
                </div>
                <button
                  onClick={() => handleCopy("memo", orderNumber)}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm uppercase tracking-[0.12em] transition-all"
                  style={{
                    background: copied === "memo" ? "rgba(57, 135, 90, 0.12)" : "rgba(255, 253, 248, 0.84)",
                    border: `1px solid ${copied === "memo" ? "rgba(57, 135, 90, 0.45)" : "rgba(185, 192, 202, 0.9)"}`,
                    color: copied === "memo" ? "#2D6C47" : "#174A9B",
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 800,
                  }}
                >
                  {copied === "memo" ? <Check size={16} /> : <Copy size={16} />}
                  {copied === "memo" ? "Copied!" : "Copy"}
                </button>
              </div>

              <p className="text-[#4B5563] text-sm sm:text-base text-center leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                <strong className="text-[#10295E]">Include the order number as your Zelle memo</strong> so we can match your payment.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div
            className="rounded-[1.5rem] px-5 sm:px-6 py-5 mb-6"
            style={LIGHT_PANEL_STYLE}
          >
            <p className="text-[#174A9B] text-xs uppercase tracking-[0.18em] mb-1" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>Step 02 · Fulfillment</p>
            <p className="text-2xl sm:text-3xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#10295E", fontWeight: 650, letterSpacing: "0.025em" }}>
              We'll Ship Your Order
            </p>
            <p className="text-[#4B5563] text-base sm:text-lg leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Once we confirm your Zelle payment, your order status updates to <strong className="text-[#10295E]">Paid</strong> and we begin preparing your shipment.
              {emailConfigured && fulfillmentConfigured ? (
                <> A tracking number will be sent to <strong className="text-[#10295E] break-words">{form.shipEmail}</strong>.</>
              ) : (
                <> Automated email and fulfillment updates are temporarily disabled during the relaunch. Save your order number and check <strong className="text-[#10295E]">My Orders</strong> or contact support for updates.</>
              )}
            </p>
          </div>

          {/* Order Summary */}
          <div
            className="rounded-[1.5rem] px-5 sm:px-6 py-5 mb-8"
            style={LIGHT_PANEL_STYLE}
          >
            <p className="text-2xl sm:text-3xl mb-4 text-[#10295E]" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650, letterSpacing: "0.025em" }}>
              Order Summary
            </p>
            <div className="space-y-3 mb-4">
              {confirmedItems.map(item => (
                <div key={item.productId} className="flex justify-between items-center">
                  <div>
                    <p className="text-[#10295E] text-xl leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>{item.productName}</p>
                    <p className="text-[#5F6977] text-sm mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>Qty: {item.quantity} × ${(item.unitPrice ?? 0).toFixed(2)}</p>
                  </div>
                  <span className="text-[#10295E] text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>
                    ${((item.unitPrice ?? 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2" style={{ borderColor: "rgba(185, 192, 202, 0.72)" }}>
              <div className="flex justify-between items-center">
                <span className="text-[#4B5563] text-sm uppercase tracking-[0.12em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>Subtotal</span>
                <span className="text-[#10295E] text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>${((orderReceipt?.subtotalCents ?? 0) / 100).toFixed(2)}</span>
              </div>
              {(orderReceipt?.discountCents ?? 0) > 0 && (
                <div className="flex justify-between items-center text-[#174A9B]">
                  <span className="text-sm uppercase tracking-[0.12em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}>Partner discount (10%)</span>
                  <span className="text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>-${((orderReceipt?.discountCents ?? 0) / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-[#4B5563] text-sm uppercase tracking-[0.12em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>Shipping</span>
                <span className="text-[#10295E] text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>${((orderReceipt?.shippingCents ?? 0) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#4B5563] text-sm uppercase tracking-[0.12em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>Tax</span>
                <span className="text-[#10295E] text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>${((orderReceipt?.taxCents ?? 0) / 100).toFixed(2)}</span>
              </div>
              <div className="flex flex-col min-[360px]:flex-row min-[360px]:items-center min-[360px]:justify-between gap-1 pt-3 border-t" style={{ borderColor: "rgba(185, 192, 202, 0.72)" }}>
                <span className="text-[#10295E] text-2xl uppercase tracking-[0.05em]" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>Total Due</span>
                <span className="self-end min-[360px]:self-auto text-[#10295E] text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>
                  ${orderTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setLocation("/account")}
              className="flex-1 py-4 rounded-xl text-base tracking-[0.12em] uppercase transition-all hover:border-[#174A9B]/50 hover:text-[#174A9B]"
              style={{
                background: "rgba(255, 253, 248, 0.72)",
                border: "1px solid rgba(185, 192, 202, 0.9)",
                color: "#10295E",
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 800,
              }}
            >
              My Orders
            </button>
            <button
              onClick={() => setLocation("/#products")}
              className="product-boutique-cta flex-1 py-4 rounded-xl text-lg tracking-[0.1em] uppercase transition-all"
              style={{ ...BOUTIQUE_BTN, fontWeight: 800 }}
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
    <div className="min-h-screen text-[#202833]" style={PURCHASE_PAGE_STYLE}>
      {/* Top Nav */}
      <header
        className="sticky top-0 z-50 border-b"
        style={PURCHASE_HEADER_STYLE}
      >
        <div className="max-w-5xl mx-auto px-6 h-24 flex items-center gap-4">
          <button onClick={() => window.history.back()} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#B9C0CA]/80 text-[#5F6977] hover:border-[#174A9B]/45 hover:text-[#174A9B] transition-colors" aria-label="Return to previous page">
            <ArrowLeft size={22} />
          </button>
          <img src={PRIMARY_LOGO_URL} alt={PRIMARY_LOGO_ALT} className={AUTH_LOGO_SIZE_CLASS} />
          <span className="hidden min-[360px]:inline text-[#10295E] text-base ml-1 sm:ml-2 uppercase tracking-[0.16em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>
            Checkout
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ── Shipping Form ── */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6 rounded-[1.75rem] p-5 sm:p-7" style={LIGHT_PANEL_STYLE}>
            <div>
              <p className="text-[#174A9B] text-xs uppercase tracking-[0.2em] mb-2" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>Delivery details</p>
              <h2 className="text-4xl sm:text-5xl text-[#10295E] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650, letterSpacing: "0.035em" }}>
                Shipping Information
              </h2>
              <p className="text-[#4B5563] text-base sm:text-lg leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                After submitting, you'll receive Zelle payment instructions with your exact total.
              </p>
            </div>

            {!integrationStatus.isLoading && (!emailConfigured || !fulfillmentConfigured) && (
              <div
                className="rounded-xl px-5 py-4"
                style={{ background: "rgba(255,184,0,0.08)", border: "1px solid rgba(255,184,0,0.3)" }}
              >
                <p className="text-base font-bold uppercase tracking-wider" style={{ color: "#B9C0CA", fontFamily: "'Rajdhani', sans-serif" }}>
                  Relaunch Integration Notice
                </p>
                <p className="text-[#4B5563] text-sm mt-1 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Your order will still be recorded in My Orders, but automated email and fulfillment updates are temporarily disabled pending reauthorization and owner approval. Save the order number shown after checkout.
                </p>
              </div>
            )}

            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-sm uppercase tracking-[0.13em]" style={PURCHASE_LABEL_STYLE}>
                  Full Name *
                </label>
                <input
                  required
                  value={form.shipName}
                  onChange={e => setForm(p => ({ ...p, shipName: e.target.value }))}
                  className="w-full px-4 py-4 rounded-xl outline-none focus:ring-2 focus:ring-[#174A9B]/20 focus:border-[#174A9B]/55 text-base sm:text-lg placeholder:text-[#7C8693]"
                  style={PURCHASE_FIELD_STYLE}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm uppercase tracking-[0.13em]" style={PURCHASE_LABEL_STYLE}>
                  Email *
                </label>
                <input
                  required
                  type="email"
                  value={form.shipEmail}
                  onChange={e => setForm(p => ({ ...p, shipEmail: e.target.value }))}
                  className="w-full px-4 py-4 rounded-xl outline-none focus:ring-2 focus:ring-[#174A9B]/20 focus:border-[#174A9B]/55 text-base sm:text-lg placeholder:text-[#7C8693]"
                  style={PURCHASE_FIELD_STYLE}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-2 text-sm uppercase tracking-[0.13em]" style={PURCHASE_LABEL_STYLE}>
                Phone (optional)
              </label>
              <input
                type="tel"
                value={form.shipPhone}
                onChange={e => setForm(p => ({ ...p, shipPhone: e.target.value }))}
                className="w-full px-4 py-4 rounded-xl outline-none focus:ring-2 focus:ring-[#174A9B]/20 focus:border-[#174A9B]/55 text-base sm:text-lg placeholder:text-[#7C8693]"
                style={PURCHASE_FIELD_STYLE}
                placeholder="(310) 000-0000"
              />
            </div>

            {/* Street */}
            <div>
              <label className="block mb-2 text-sm uppercase tracking-[0.13em]" style={PURCHASE_LABEL_STYLE}>
                Street Address *
              </label>
              <input
                required
                value={form.shipAddress}
                onChange={e => setForm(p => ({ ...p, shipAddress: e.target.value }))}
                className="w-full px-4 py-4 rounded-xl outline-none focus:ring-2 focus:ring-[#174A9B]/20 focus:border-[#174A9B]/55 text-base sm:text-lg placeholder:text-[#7C8693]"
                style={PURCHASE_FIELD_STYLE}
                placeholder="123 Main St"
              />
            </div>

            {/* Apt */}
            <div>
              <label className="block mb-2 text-sm uppercase tracking-[0.13em]" style={PURCHASE_LABEL_STYLE}>
                Apt / Suite / Unit (optional)
              </label>
              <input
                value={form.shipAddress2}
                onChange={e => setForm(p => ({ ...p, shipAddress2: e.target.value }))}
                className="w-full px-4 py-4 rounded-xl outline-none focus:ring-2 focus:ring-[#174A9B]/20 focus:border-[#174A9B]/55 text-base sm:text-lg placeholder:text-[#7C8693]"
                style={PURCHASE_FIELD_STYLE}
                placeholder="Apt 4B"
              />
            </div>

            {/* City / State / ZIP */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <div className="col-span-2 sm:col-span-1">
                <label className="block mb-2 text-sm uppercase tracking-[0.13em]" style={PURCHASE_LABEL_STYLE}>
                  City *
                </label>
                <input
                  required
                  value={form.shipCity}
                  onChange={e => setForm(p => ({ ...p, shipCity: e.target.value }))}
                  className="w-full px-4 py-4 rounded-xl outline-none focus:ring-2 focus:ring-[#174A9B]/20 focus:border-[#174A9B]/55 text-base sm:text-lg placeholder:text-[#7C8693]"
                  style={PURCHASE_FIELD_STYLE}
                  placeholder="Los Angeles"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm uppercase tracking-[0.13em]" style={PURCHASE_LABEL_STYLE}>
                  State *
                </label>
                <select
                  required
                  value={form.shipState}
                  onChange={e => setForm(p => ({ ...p, shipState: e.target.value }))}
                  className="w-full px-4 py-4 rounded-xl outline-none focus:ring-2 focus:ring-[#174A9B]/20 focus:border-[#174A9B]/55 text-base sm:text-lg"
                  style={{ ...PURCHASE_FIELD_STYLE, cursor: "pointer" }}
                >
                  <option value="">State</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm uppercase tracking-[0.13em]" style={PURCHASE_LABEL_STYLE}>
                  ZIP *
                </label>
                <input
                  required
                  value={form.shipZip}
                  onChange={e => setForm(p => ({ ...p, shipZip: e.target.value }))}
                  className="w-full px-4 py-4 rounded-xl outline-none focus:ring-2 focus:ring-[#174A9B]/20 focus:border-[#174A9B]/55 text-base sm:text-lg placeholder:text-[#7C8693]"
                  style={PURCHASE_FIELD_STYLE}
                  placeholder="90001"
                  maxLength={10}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block mb-2 text-sm uppercase tracking-[0.13em]" style={PURCHASE_LABEL_STYLE}>
                Partner Code (optional)
              </label>
              {hasSavedPartnerBenefit ? (
                <div className="rounded-xl border border-[#174A9B]/25 bg-[#174A9B]/[0.07] px-4 py-4">
                  <p className="text-[#10295E] text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>RECROOMLV partner benefit</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#4B5563]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Your saved 10% merchandise discount is applied automatically to this and future orders.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col min-[420px]:flex-row gap-3">
                    <input
                      value={partnerCodeDraft}
                      onChange={e => setPartnerCodeDraft(e.target.value.toUpperCase())}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          setRequestedPartnerCode(partnerCodeDraft.trim().toUpperCase());
                        }
                      }}
                      className="min-h-12 flex-1 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#174A9B]/20 focus:border-[#174A9B]/55 text-base sm:text-lg placeholder:text-[#7C8693] uppercase"
                      style={PURCHASE_FIELD_STYLE}
                      placeholder="Enter partner code"
                      autoComplete="off"
                      maxLength={32}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (requestedPartnerCode) {
                          setPartnerCodeDraft("");
                          setRequestedPartnerCode("");
                        } else {
                          setRequestedPartnerCode(partnerCodeDraft.trim().toUpperCase());
                        }
                      }}
                      className="min-h-12 rounded-xl border border-[#174A9B]/30 bg-[#174A9B]/[0.07] px-5 text-sm uppercase tracking-[0.12em] text-[#174A9B] transition-colors hover:bg-[#174A9B]/[0.12]"
                      style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}
                    >
                      {requestedPartnerCode ? "Remove" : orderQuote.isFetching ? "Checking..." : "Apply"}
                    </button>
                  </div>
                  {orderQuote.error && requestedPartnerCode && (
                    <p className="mt-2 text-sm font-semibold text-[#A13939]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {orderQuote.error.message}
                    </p>
                  )}
                  {appliedPartnerCode && !orderQuote.error && (
                    <p className="mt-2 text-sm font-semibold text-[#2D6C47]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      RECROOMLV accepted. Your 10% merchandise discount will remain on this account for future orders.
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block mb-2 text-sm uppercase tracking-[0.13em]" style={PURCHASE_LABEL_STYLE}>
                Order Notes (optional)
              </label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                className="w-full px-4 py-4 rounded-xl outline-none focus:ring-2 focus:ring-[#174A9B]/20 focus:border-[#174A9B]/55 resize-none text-base sm:text-lg placeholder:text-[#7C8693]"
                style={PURCHASE_FIELD_STYLE}
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
              disabled={
                submitOrder.isPending ||
                orderQuote.isLoading ||
                !!orderQuote.error ||
                cart.length === 0 ||
                (!hasSavedPartnerBenefit && partnerCodeDraft.trim().toUpperCase() !== requestedPartnerCode)
              }
              className="product-boutique-cta w-full py-5 rounded-xl text-lg sm:text-xl tracking-[0.14em] uppercase transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ ...BOUTIQUE_BTN, fontWeight: 800 }}
            >
              {submitOrder.isPending ? "Placing Order..." : `Place Order — $${total.toFixed(2)}`}
            </button>

            <p className="text-center text-[#5F6977] text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
              Zelle payment instructions will appear immediately after placing your order.
            </p>
          </form>

          {/* ── Order Summary Sidebar ── */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl p-6 sticky top-24"
              style={LIGHT_PANEL_STYLE}
            >
              <p className="text-[#174A9B] text-xs uppercase tracking-[0.18em] mb-2" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>Your selection</p>
              <h3 className="text-3xl sm:text-4xl text-[#10295E] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650, letterSpacing: "0.035em" }}>
                Order Summary
              </h3>

              <div className="space-y-4 mb-5">
                {cart.map(item => (
                  <div key={item.productId} className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[#10295E] text-xl leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>
                        {item.productName}
                      </p>
                      <p className="text-[#5F6977] text-sm mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Qty: {item.quantity} × ${(item.unitPrice ?? 0).toFixed(2)}
                      </p>
                    </div>
                    <span className="text-[#10295E] text-xl shrink-0" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>
                      ${((item.unitPrice ?? 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-5 space-y-3" style={{ borderColor: "rgba(185, 192, 202, 0.72)" }}>
                <div className="flex justify-between items-center">
                  <span className="text-[#4B5563] text-sm uppercase tracking-[0.12em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>Subtotal</span>
                  <span className="text-[#10295E] text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-[#174A9B]">
                    <span className="text-sm uppercase tracking-[0.12em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}>Partner discount (10%)</span>
                    <span className="text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-[#4B5563] text-sm uppercase tracking-[0.12em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>Shipping</span>
                  <span className="text-[#10295E] text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#4B5563] text-sm uppercase tracking-[0.12em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>Tax</span>
                  <span className="text-[#10295E] text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: "rgba(185, 192, 202, 0.72)" }}>
                  <span className="text-[#10295E] text-2xl uppercase" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650, letterSpacing: "0.05em" }}>Total</span>
                  <span className="text-[#10295E] text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-6 space-y-3">
                <div
                  className="rounded-xl px-4 py-3 flex items-center gap-3"
                  style={{ background: "rgba(233, 220, 203, 0.52)", border: "1px solid rgba(185, 192, 202, 0.72)" }}
                >
                  <ShoppingBag size={20} style={{ color: "oklch(0.76 0.02 250)", flexShrink: 0 }} />
                  <div>
                    <p className="text-[#10295E] text-base uppercase tracking-[0.12em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>Payment via Zelle</p>
                    <p className="text-[#4B5563] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>Send to {ZELLE_PHONE} after ordering. Any orders placed after 8 p.m. will be processed the next day.</p>
                  </div>
                </div>
                <div
                  className="rounded-xl px-4 py-3 flex items-center gap-3"
                  style={{ background: "rgba(246, 241, 233, 0.76)", border: "1px solid rgba(185, 192, 202, 0.72)" }}
                >
                  <Truck size={20} style={{ color: "oklch(0.76 0.02 250)", flexShrink: 0 }} />
                  <p className="text-[#4B5563] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Flat-rate shipping $7.00 · 3–5 business days
                  </p>
                </div>
                {/* Purity badge hidden until product testing complete */}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
