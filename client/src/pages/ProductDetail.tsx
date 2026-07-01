// === LA ELITE PEPTIDES — Product Detail Page ===
// Peptides Collective-style two-column layout
// Image carousel | Variant selector | Quantity stepper | Dual CTA | Tabbed description | Molecular data | Related products

import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import {
  ArrowLeft,
  FlaskConical,
  ShoppingCart,
  Zap,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Lock,
} from "lucide-react";
import { products, type Product } from "@/lib/products";

const VIAL_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663765469010/KeqNR4QdNviNNDWK3S7923/peptide-vial-KdSBvv2H7a9bZfeH52wPjY.webp";

// ─── Tabs ───────────────────────────────────────────────────────────────────
type Tab = "overview" | "mechanism" | "applications" | "molecular";

const TAB_LABELS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Research Overview" },
  { key: "mechanism", label: "Mechanism of Action" },
  { key: "applications", label: "Applications" },
  { key: "molecular", label: "Molecular Data" },
];

// ─── Molecular Data Table ───────────────────────────────────────────────────
function MolecularTable({ product }: { product: Product }) {
  const md = product.molecularData;
  if (!md) {
    return (
      <p className="text-white/50 text-sm italic">
        Molecular data not available for this compound.
      </p>
    );
  }
  const rows = [
    { label: "Sequence", value: md.sequence },
    { label: "Molecular Formula", value: md.molecularFormula },
    { label: "Molecular Weight", value: md.molecularWeight },
    { label: "PubChem CID", value: md.pubchemCid },
    { label: "CAS Number", value: md.casNumber },
    { label: "Form", value: md.form },
    { label: "Storage", value: md.storage },
  ].filter((r) => r.value);

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(({ label, value }, i) => (
            <tr
              key={label}
              className={i % 2 === 0 ? "bg-white/3" : "bg-transparent"}
            >
              <td
                className="px-5 py-3 text-white/50 uppercase tracking-widest text-xs font-semibold w-40"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                {label}
              </td>
              <td
                className="px-5 py-3 text-white/85"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Related Products ────────────────────────────────────────────────────────
function RelatedProducts({ current }: { current: Product }) {
  const related = products
    .filter((p) => p.id !== current.id && p.category === current.category)
    .slice(0, 4);

  if (related.length === 0) {
    const others = products.filter((p) => p.id !== current.id).slice(0, 4);
    if (others.length === 0) return null;
    return <RelatedGrid items={others} title="You May Also Like" />;
  }
  return <RelatedGrid items={related} title={`More in ${current.category}`} />;
}

function RelatedGrid({ items, title }: { items: Product[]; title: string }) {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-1 h-6 rounded-full"
          style={{ background: "linear-gradient(to bottom, #00BFFF, #FF2D78)" }}
        />
        <h2
          className="text-white"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "1.5rem",
            letterSpacing: "0.06em",
          }}
        >
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`}>
            <div
              className="rounded-xl border border-white/8 p-4 cursor-pointer transition-all duration-200 hover:border-[#00BFFF]/40 hover:scale-[1.02] group"
              style={{ background: "oklch(0.16 0.055 255 / 0.6)" }}
            >
              <div
                className="w-full rounded-lg overflow-hidden mb-3 flex items-center justify-center relative"
                style={{
                  background: "oklch(0.2 0.07 240)",
                  height: "220px",
                  padding: "14px",
                }}
              >
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: "radial-gradient(ellipse at 50% 60%, rgba(0,191,255,0.10) 0%, transparent 70%)",
                  }}
                />
                <img
                  src={p.images?.[0] || VIAL_IMG}
                  alt={p.name}
                  className="relative z-10 w-full h-full object-contain transition-all duration-250"
                  style={{ filter: "drop-shadow(0 0 8px rgba(0,191,255,0.35))" }}
                />
              </div>
              <p
                className="text-white text-sm font-medium truncate mt-1"
                style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.01em" }}
              >
                {p.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [activeImg, setActiveImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [qty, setQty] = useState(1);
  const [, navigate] = useLocation();
  const { isAuthenticated } = useCustomerAuth();

  // Build the returnTo URL for this product page so login redirects back here
  const returnToLogin = () => navigate(`/login?returnTo=/product/${id}`);
  const { addToCart, cartCount } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setActiveTab("overview");
    setActiveImg(0);
    setSelectedVariant(0);
    setQty(1);
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

  // Image carousel — use product.images if provided, else fallback to single vial
  const images = product.images && product.images.length > 0 ? product.images : [VIAL_IMG];
  const currentVariant = product.variants?.[selectedVariant];
  const displayPrice = currentVariant?.price ?? product.price ?? "Inquire";
  const displayContent = currentVariant?.content ?? product.detailContent ?? product.content;

  const handleAddToCart = () => {
    const priceStr = currentVariant?.price ?? product.price ?? "0";
    const unitPrice = parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
    const itemId = product.id + (currentVariant ? `-${currentVariant.label}` : "");
    const itemName = product.name + (currentVariant ? ` (${currentVariant.label})` : "");
    for (let i = 0; i < qty; i++) {
      addToCart({ productId: itemId, productName: itemName, productCategory: product.category, unitPrice });
    }
    toast.success(`${qty}\u00d7 ${product.name} added to cart`, {
      description: "Open your cart to checkout",
      duration: 2500,
    });
  };

  const handleBuyNow = () => {
    const priceStr = currentVariant?.price ?? product.price ?? "0";
    const unitPrice = parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
    const itemId = product.id + (currentVariant ? `-${currentVariant.label}` : "");
    const itemName = product.name + (currentVariant ? ` (${currentVariant.label})` : "");
    for (let i = 0; i < qty; i++) {
      addToCart({ productId: itemId, productName: itemName, productCategory: product.category, unitPrice });
    }
    setTimeout(() => navigate("/checkout"), 200);
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.12 0.04 255)", fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Top Nav ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/8"
        style={{ background: "oklch(0.12 0.04 255 / 0.95)", backdropFilter: "blur(12px)" }}
      >
        <Link href="/">
          <img
            src="/manus-storage/LAELITELOGONEW_dark_bg_2eaa3f51.png"
            alt="LA Elite Peptides"
            className="h-10 w-auto"
          />
        </Link>
        <button
            onClick={() => { navigate('/'); setTimeout(() => { document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }, 150); }}
            className="flex items-center gap-2 text-white/60 hover:text-[#00BFFF] transition-colors text-sm"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, letterSpacing: "0.08em" }}
          >
            <ArrowLeft size={16} />
            BACK TO PRODUCTS
          </button>
      </nav>

      {/* ── Breadcrumb ── */}
      <div className="max-w-6xl mx-auto px-6 pt-6 pb-2">
        <div
          className="flex items-center gap-2 text-white/35 text-xs tracking-widest uppercase"
          style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
        >
          <Link href="/"><span className="hover:text-[#00BFFF] transition-colors cursor-pointer">Home</span></Link>
          <span>/</span>
          <Link href="/#products"><span className="hover:text-[#00BFFF] transition-colors cursor-pointer">Products</span></Link>
          <span>/</span>
          <span className="text-[#00BFFF]">{product.name}</span>
        </div>
      </div>

      {/* ── TWO-COLUMN MAIN ── */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* ── LEFT: Image Carousel ── */}
        <div className="space-y-4">
          {/* Main image */}
          <div
            className="relative rounded-2xl overflow-hidden aspect-square"
            style={{
              maxWidth: '75%',
              margin: '0 auto',
              background: "oklch(0.18 0.07 240)",
              border: "1px solid oklch(0.4 0.15 220 / 0.25)",
              boxShadow: "0 0 60px oklch(0.6 0.18 220 / 0.2)",
            }}
          >
            {/* Cyan glow behind vial */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 60% 65% at 50% 52%, oklch(0.65 0.18 200 / 0.2) 0%, transparent 70%)",
              }}
            />
            <img
              src={images[activeImg]}
              alt={product.name}
              className="w-full h-full object-contain p-4 relative z-10"
              style={{ filter: "drop-shadow(0 0 28px oklch(0.7 0.2 200 / 0.5))" }}
            />
            {/* Prev/Next arrows — only show if multiple images */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: "oklch(0.12 0.04 255 / 0.8)", border: "1px solid rgba(0,191,255,0.3)", color: "#00BFFF" }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setActiveImg((prev) => (prev + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: "oklch(0.12 0.04 255 / 0.8)", border: "1px solid rgba(0,191,255,0.3)", color: "#00BFFF" }}
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className="w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200"
                  style={{
                    borderColor: activeImg === i ? "#00BFFF" : "rgba(255,255,255,0.1)",
                    opacity: activeImg === i ? 1 : 0.5,
                  }}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}

          {/* Research-use-only trust badge */}
          <div
            className="rounded-xl p-4 flex items-start gap-3 border border-[#FF2D78]/20"
            style={{ background: "oklch(0.16 0.04 10 / 0.25)" }}
          >
            <AlertTriangle size={16} className="text-[#FF2D78] flex-shrink-0 mt-0.5" />
            <p className="text-white/50 text-xs leading-relaxed">
              <span className="text-[#FF2D78] font-semibold" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.02em" }}>
                Research Use Only.
              </span>{" "}
              {product.disclaimer ||
                `${product.name} is sold strictly for in-vitro laboratory research use only. Not a drug, food additive, or dietary supplement. Not approved by the FDA for human or veterinary use.`}
            </p>
          </div>
        </div>

        {/* ── RIGHT: Product Details ── */}
        <div className="space-y-6">
          {/* Category + Stack badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs px-3 py-1 rounded-full tracking-widest uppercase"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                background: "rgba(0,191,255,0.12)",
                border: "1px solid rgba(0,191,255,0.3)",
                color: "#00BFFF",
              }}
            >
              {product.category}
            </span>
            {product.isStack && product.stackName && (
              <span
                className="text-xs px-3 py-1 rounded-full tracking-widest uppercase"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                  background: "rgba(255,45,120,0.12)",
                  border: "1px solid rgba(255,45,120,0.3)",
                  color: "#FF2D78",
                }}
              >
                {product.stackName}
              </span>
            )}
          </div>

          {/* Product name */}
          <h1
            className="text-white leading-none"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
              letterSpacing: "0.04em",
            }}
          >
            {product.name}
          </h1>

          {/* Tagline */}
          <p
            className="text-white/55 text-base leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            {product.tagline}
          </p>

          {/* Price — gated behind login */}
          {isAuthenticated ? (
            <div className="flex items-baseline gap-3">
              <span
                className="text-[#00BFFF]"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.8rem", letterSpacing: "0.04em" }}
              >
                {displayPrice}
              </span>
              <span
                className="text-white/70 text-lg"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: "0.04em" }}
              >
                {displayContent}
              </span>
            </div>
          ) : (
            <button
              onClick={returnToLogin}
              className="flex items-center gap-2 py-3 px-5 rounded-lg border border-cyan-500/40 text-cyan-400 text-sm tracking-widest uppercase hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-200"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              <Lock size={15} />
              Login to View Pricing
            </button>
          )}

          {/* Variant selector */}
          {product.variants && product.variants.length > 1 && (
            <div>
              <p
                className="text-white/50 text-xs tracking-widest uppercase mb-2"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
              >
                Select Size
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.variants.map((v, i) => (
                  <button
                    key={v.label}
                    onClick={() => setSelectedVariant(i)}
                    className="px-4 py-2 rounded-lg text-sm font-bold tracking-wide transition-all duration-200"
                    style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: 700,
                      background: selectedVariant === i ? "rgba(0,191,255,0.2)" : "rgba(255,255,255,0.05)",
                      border: selectedVariant === i ? "1.5px solid #00BFFF" : "1.5px solid rgba(255,255,255,0.12)",
                      color: selectedVariant === i ? "#00BFFF" : "rgba(255,255,255,0.6)",
                    }}
                  >
                    {v.label} — {v.price}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity stepper */}
          <div>
            <p
              className="text-white/50 text-xs tracking-widest uppercase mb-2"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              Quantity
            </p>
            <div className="flex items-center gap-0 w-fit rounded-lg overflow-hidden border border-white/15">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/8 transition-all duration-150"
              >
                <Minus size={14} />
              </button>
              <span
                className="w-12 h-10 flex items-center justify-center text-white font-bold text-base border-x border-white/15"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
              >
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/8 transition-all duration-150"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Dual CTA buttons — gated behind login */}
          {isAuthenticated ? (
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleAddToCart}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg font-bold tracking-widest uppercase text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                  background: "rgba(0,191,255,0.15)",
                  border: "1.5px solid rgba(0,191,255,0.5)",
                  color: "#00BFFF",
                }}
              >
                <ShoppingCart size={16} />
                ADD TO CART
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg font-bold tracking-widest uppercase text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #00BFFF 0%, #0080FF 100%)",
                  border: "none",
                  color: "#000",
                }}
              >
                <Zap size={16} />
                BUY NOW
              </button>
            </div>
          ) : (
            <button
              onClick={returnToLogin}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg border border-cyan-500/40 text-cyan-400 text-sm tracking-widest uppercase hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-200"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              <Lock size={15} />
              Login to View Pricing & Order
            </button>
          )}

          {/* Trust signals */}
          <div
            className="grid grid-cols-2 gap-3 pt-2"
          >
            {[
              { icon: "🇺🇸", label: "US Research" },
              // { icon: "🔬", label: "≥99% Purity" }, // Hidden until 3rd-party testing complete
              // { icon: "📋", label: "COA Available" }, // Hidden until COAs are ready
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="rounded-lg p-3 text-center border border-white/8"
                style={{ background: "oklch(0.16 0.055 255 / 0.4)" }}
              >
                <div className="text-lg mb-1">{icon}</div>
                <p
                  className="text-white/80 text-sm tracking-wide"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Research benefits list */}
          <div
            className="rounded-xl p-5 border border-white/8"
            style={{ background: "oklch(0.16 0.055 255 / 0.5)" }}
          >
            <p
              className="text-cyan-400 text-sm tracking-widest uppercase mb-3"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, letterSpacing: "0.12em" }}
            >
              Research Highlights
            </p>
            <ul className="space-y-2.5">
              {product.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-[#00BFFF] flex-shrink-0 mt-0.5" />
                  <span className="text-white/90 text-base leading-snug" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── TABBED DESCRIPTION SECTION ── */}
      <div
        className="border-t border-white/8 mt-4"
        style={{ background: "oklch(0.13 0.045 255)" }}
      >
        <div className="max-w-6xl mx-auto px-6 pt-8">
          {/* Tab bar */}
          <div className="flex gap-0 border-b border-white/10 overflow-x-auto">
            {TAB_LABELS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="px-5 py-3 text-sm font-bold tracking-wide whitespace-nowrap transition-all duration-200 border-b-2 -mb-px"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  borderBottomColor: activeTab === key ? "#00BFFF" : "transparent",
                  color: activeTab === key ? "#00BFFF" : "rgba(255,255,255,0.4)",
                  background: "transparent",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="py-8">
            {activeTab === "overview" && (
              <div className="max-w-3xl">
                <p className="text-white/70 leading-relaxed text-base">{product.plainEnglish}</p>
              </div>
            )}
            {activeTab === "mechanism" && (
              <div className="max-w-3xl">
                <p className="text-white/70 leading-relaxed text-base">{product.howItWorks}</p>
              </div>
            )}
            {activeTab === "applications" && (
              <div className="max-w-3xl space-y-4">
                <p className="text-white/70 leading-relaxed text-base">{product.whoIsItFor}</p>
                {/* Quick facts */}
                <div
                  className="rounded-xl border border-white/8 overflow-hidden mt-6"
                  style={{ background: "oklch(0.16 0.055 255 / 0.5)" }}
                >
                  {[
                    { label: "Compound", value: product.name },
                    { label: "Content", value: displayContent },
                    { label: "Category", value: product.category },
                    { label: "Price", value: displayPrice },
                  ].map(({ label, value }, i) => (
                    <div
                      key={label}
                      className="flex justify-between items-center px-5 py-3.5 border-b border-white/5 last:border-0"
                      style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}
                    >
                      <span
                        className="text-cyan-400/80 uppercase tracking-widest text-sm"
                        style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
                      >
                        {label}
                      </span>
                      <span
                        className="text-white text-base"
                        style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "molecular" && (
              <div className="max-w-3xl">
                <MolecularTable product={product} />
              </div>
            )}
          </div>

          {/* Disclaimer block — always visible below tabs */}
          <div
            className="rounded-xl p-5 border border-[#FF2D78]/20 flex gap-4 mb-10"
            style={{ background: "oklch(0.16 0.04 10 / 0.3)" }}
          >
            <AlertTriangle size={18} className="text-[#FF2D78] flex-shrink-0 mt-0.5" />
            <div>
              <p
                className="text-[#FF2D78] text-xs mb-1"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, letterSpacing: "0.02em" }}
              >
                Research Use Only — Important Notice
              </p>
              <p className="text-white/55 text-sm leading-relaxed">
                {product.disclaimer ||
                  `${product.name} is sold strictly for in-vitro laboratory research use only. It is not a drug, food additive, cosmetic, or dietary supplement. This material is not approved by the FDA or any regulatory authority for human or veterinary use, and any discussion of clinical application is for scientific context only — not product endorsement.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RELATED PRODUCTS ── */}
      <div
        className="border-t border-white/8 pt-12"
        style={{ background: "oklch(0.12 0.04 255)" }}
      >
        <RelatedProducts current={product} />
      </div>

      {/* ── Footer strip ── */}
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
