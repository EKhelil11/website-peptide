// === ELITE LA PEPTIDES — Product Detail Page ===
// Full subpage for each product: plain English, how it works, who it's for, benefits, cycle, price
// Design: Midnight Clinic — dark navy, electric cyan, hot pink

import { useEffect } from "react";
import { useParams } from "wouter";
import { Link } from "wouter";
import { ArrowLeft, Clock, FlaskConical, Users, CheckCircle2, ShoppingCart, AlertTriangle } from "lucide-react";
import { products } from "@/lib/products";

const VIAL_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663765469010/KeqNR4QdNviNNDWK3S7923/peptide-vial-KdSBvv2H7a9bZfeH52wPjY.webp";
const LOGO_URL = "/manus-storage/elite-la-peptides-logo_e9ec855c.png";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);

  // Always land at the top of the page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  if (!product) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center px-4"
        style={{ background: "oklch(0.12 0.04 255)" }}
      >
        <FlaskConical size={48} className="text-[#00BFFF] mb-4" />
        <h1
          className="text-white text-4xl mb-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
        >
          Product Not Found
        </h1>
        <p className="text-white/50 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
          This compound doesn't exist in our catalog.
        </p>
        <Link href="/#products">
          <button className="btn-primary flex items-center gap-2 px-6 py-3 rounded">
            <ArrowLeft size={16} /> Back to Products
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.12 0.04 255)", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Top nav bar */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/8"
        style={{ background: "oklch(0.12 0.04 255 / 0.95)", backdropFilter: "blur(12px)" }}
      >
        <Link href="/">
          <img
            src="/manus-storage/elite-la-peptides-logo_e9ec855c.png"
            alt="LA Elite Peptides"
            className="h-10 w-auto"
          />
        </Link>
        <Link href="/#products">
          <button
            className="flex items-center gap-2 text-white/60 hover:text-[#00BFFF] transition-colors text-sm"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, letterSpacing: "0.08em" }}
          >
            <ArrowLeft size={16} />
            BACK TO PRODUCTS
          </button>
        </Link>
      </nav>

      {/* Prominent back button bar */}
      <div
        className="px-6 py-3 flex items-center gap-3"
        style={{ background: "oklch(0.14 0.05 255 / 0.7)", borderBottom: "1px solid rgba(0,191,255,0.1)" }}
      >
        <Link href="/#products">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              letterSpacing: "0.08em",
              background: "rgba(0,191,255,0.12)",
              border: "1px solid rgba(0,191,255,0.3)",
              color: "#00BFFF",
            }}
          >
            <ArrowLeft size={15} />
            ← BACK TO PRODUCTS
          </button>
        </Link>
        <span
          className="text-white/30 text-xs tracking-widest"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          {product.name} — Product Details
        </span>
      </div>

      {/* Hero band */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.055 255) 0%, oklch(0.18 0.07 240) 60%, oklch(0.16 0.05 270) 100%)",
          borderBottom: "1px solid oklch(0.3 0.12 240 / 0.3)",
        }}
      >
        {/* Decorative glow */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, oklch(0.6 0.18 220 / 0.15) 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, oklch(0.6 0.25 350 / 0.1) 0%, transparent 70%)",
            transform: "translate(-30%, 30%)",
          }}
        />

        <div className="max-w-5xl mx-auto px-6 py-16 relative z-10 flex flex-col md:flex-row gap-10 items-center">
          {/* Vial image with logo overlay */}
          <div
            className="relative flex-shrink-0 w-40 h-40 md:w-52 md:h-52 rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.2 0.07 240)",
              boxShadow: "0 0 40px oklch(0.6 0.18 220 / 0.3)",
              border: "1px solid oklch(0.4 0.15 220 / 0.3)",
            }}
          >
            <img src={VIAL_IMG} alt={product.name} className="w-full h-full object-cover opacity-80" />
          </div>

          {/* Title block */}
          <div className="flex-1">
            {/* Breadcrumb */}
            <div
              className="flex items-center gap-2 text-white/40 text-xs tracking-widest uppercase mb-3"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
            >
              <span>Products</span>
              <span>/</span>
              <span className="text-[#00BFFF]">{product.name}</span>
            </div>

            {/* Category badge */}
            <span
              className={`inline-block text-xs px-3 py-1 rounded-full mb-4 tracking-widest uppercase ${
                product.isStack
                  ? "bg-[#FF2D78]/20 text-[#FF2D78] border border-[#FF2D78]/30"
                  : "bg-[#00BFFF]/15 text-[#00BFFF] border border-[#00BFFF]/30"
              }`}
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              {product.category}
            </span>

            <h1
              className="text-white leading-none mb-2"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                letterSpacing: "0.04em",
              }}
            >
              {product.name}
            </h1>

            {product.isStack && product.stackName && (
              <div
                className="text-[#FF2D78] text-sm tracking-widest uppercase mb-2"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
              >
                {product.stackName}
              </div>
            )}

            <p
              className="text-white/60 text-base mb-6 max-w-xl"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
            >
              {product.synopsis}
            </p>

            {/* Quick facts row */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div
                className="flex items-center gap-2 text-white/50 text-sm"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
              >
                <FlaskConical size={15} className="text-[#00BFFF]" />
                <span>Dose: <span className="text-white">{product.dose}</span></span>
              </div>
              <div
                className="flex items-center gap-2 text-white/50 text-sm"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
              >
                <Clock size={15} className="text-[#00BFFF]" />
                <span>Cycle: <span className="text-white">{product.cycle}</span></span>
              </div>
            </div>

            {/* Price + CTA */}
            <div className="flex items-center gap-4">
              {product.price ? (
                <span
                  className="text-[#00BFFF]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.2rem", letterSpacing: "0.04em" }}
                >
                  {product.price}
                </span>
              ) : (
                <span
                  className="text-white/40 text-lg"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                >
                  Price Coming Soon
                </span>
              )}
              <a href="/#contact">
                <button className="btn-primary flex items-center gap-2 px-6 py-3 rounded">
                  <ShoppingCart size={16} />
                  INQUIRE NOW
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left: main content */}
        <div className="md:col-span-2 space-y-12">

          {/* In Plain English */}
          <section>
            <div
              className="flex items-center gap-3 mb-4"
            >
              <div
                className="w-1 h-8 rounded-full"
                style={{ background: "linear-gradient(to bottom, #00BFFF, #FF2D78)" }}
              />
              <span
                className="text-[#00BFFF] text-xs tracking-widest uppercase"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
              >
                What Is It?
              </span>
            </div>
            <h2
              className="text-white mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.04em" }}
            >
              Research Overview
            </h2>
            <p className="text-white/70 leading-relaxed text-base">
              {product.plainEnglish}
            </p>
          </section>

          {/* How It Works */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-1 h-8 rounded-full"
                style={{ background: "linear-gradient(to bottom, #00BFFF, #FF2D78)" }}
              />
              <span
                className="text-[#00BFFF] text-xs tracking-widest uppercase"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
              >
                How It Works
              </span>
            </div>
            <h2
              className="text-white mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.04em" }}
            >
              Mechanism of Action
            </h2>
            <p className="text-white/70 leading-relaxed text-base">
              {product.howItWorks}
            </p>
          </section>

          {/* Who Is It For */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-1 h-8 rounded-full"
                style={{ background: "linear-gradient(to bottom, #00BFFF, #FF2D78)" }}
              />
              <span
                className="text-[#00BFFF] text-xs tracking-widest uppercase"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
              >
                Who Is It Best For?
              </span>
            </div>
            <h2
              className="text-white mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.04em" }}
            >
              Research Applications
            </h2>
            <div
              className="rounded-xl p-5 border border-[#00BFFF]/20"
              style={{ background: "oklch(0.16 0.055 255 / 0.6)" }}
            >
              <Users size={20} className="text-[#00BFFF] mb-3" />
              <p className="text-white/80 leading-relaxed text-base">
                {product.whoIsItFor}
              </p>
            </div>
          </section>

          {/* Disclaimer */}
          <section
            className="rounded-xl p-5 border border-[#FF2D78]/20 flex gap-4"
            style={{ background: "oklch(0.16 0.04 10 / 0.3)" }}
          >
            <AlertTriangle size={20} className="text-[#FF2D78] flex-shrink-0 mt-0.5" />
            <div>
              <p
                className="text-[#FF2D78] text-xs tracking-widest uppercase mb-1"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
              >
                Research Use Only
              </p>
              <p className="text-white/50 text-sm leading-relaxed">
                All peptides sold by LA Elite Peptides are strictly for in-vitro laboratory and scientific research purposes only. Not intended for human or animal consumption. Not evaluated or approved by the FDA for any therapeutic use. By purchasing, you confirm you are a qualified researcher.
              </p>
            </div>
          </section>
        </div>

        {/* Right: sidebar */}
        <div className="space-y-6">
          {/* Benefits card */}
          <div
            className="rounded-xl p-6 border border-white/8"
            style={{ background: "oklch(0.16 0.055 255 / 0.6)" }}
          >
            <h3
              className="text-white mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.05em" }}
            >
              Research Benefits
            </h3>
            <ul className="space-y-3">
              {product.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 size={15} className="text-[#00BFFF] flex-shrink-0 mt-0.5" />
                  <span className="text-white/70 text-sm leading-snug">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick facts card */}
          <div
            className="rounded-xl p-6 border border-white/8"
            style={{ background: "oklch(0.16 0.055 255 / 0.6)" }}
          >
            <h3
              className="text-white mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.05em" }}
            >
              Quick Facts
            </h3>
            <div className="space-y-3 text-sm">
              {[
                { label: "Product", value: product.name },
                { label: "Category", value: product.category },
                { label: "Dose", value: product.dose },
                { label: "Cycle Length", value: product.cycle },
                { label: "Price", value: product.price || "Coming Soon" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span
                    className="text-white/40 uppercase tracking-wide text-xs"
                    style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-white font-medium"
                    style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA card */}
          <div
            className="rounded-xl p-6 border border-[#00BFFF]/20 text-center"
            style={{ background: "linear-gradient(135deg, oklch(0.18 0.07 240 / 0.8), oklch(0.16 0.055 255 / 0.8))" }}
          >
            <p
              className="text-white/60 text-xs tracking-widest uppercase mb-2"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
            >
              Interested in This Compound?
            </p>
            <p className="text-white/50 text-sm mb-4">
              Research inquiries, compound specifications, or bulk orders
            </p>
            <a href="/#contact" className="block">
              <button className="btn-primary w-full flex items-center justify-center gap-2 px-4 py-3 rounded">
                <ShoppingCart size={15} />
                INQUIRE NOW
              </button>
            </a>
            <div className="mt-3 space-y-1 text-xs text-white/30" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              <div>📍 Local Research Orders — Los Angeles</div>
              <div>📦 Bulk Research Pricing Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div
        className="border-t border-white/8 py-8 text-center"
        style={{ background: "oklch(0.1 0.03 255)" }}
      >
        <Link href="/#products">
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mx-auto"
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              letterSpacing: "0.08em",
              background: "rgba(0,191,255,0.12)",
              border: "1px solid rgba(0,191,255,0.3)",
              color: "#00BFFF",
            }}
          >
            <ArrowLeft size={15} />
            BACK TO PRODUCTS
          </button>
        </Link>
      </div>
    </div>
  );
}
