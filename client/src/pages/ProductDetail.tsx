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
  FileText,
  Clock3,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { findProductById, products, type Product } from "@/lib/products";
import { PRIMARY_LOGO_ALT, PRIMARY_LOGO_URL, UTILITY_LOGO_SIZE_CLASS } from "@/lib/brandAssets";

const VIAL_IMG =
  "/manus-storage/lap-vial-retatrutide-10mg_52f96021-optimized_683307ff.webp";

// ─── Tabs ───────────────────────────────────────────────────────────────────
type Tab = "overview" | "mechanism" | "applications" | "molecular" | "handling";

const TAB_LABELS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Research Overview" },
  { key: "mechanism", label: "Mechanism of Action" },
  { key: "applications", label: "Applications" },
  { key: "molecular", label: "Molecular Data" },
  { key: "handling", label: "Handling & Sources" },
];

// ─── Molecular Data Table ───────────────────────────────────────────────────
function MolecularTable({ product }: { product: Product }) {
  const md = product.molecularData;
  if (!md) {
    return (
      <p
        className="product-tab-body text-[0.95rem] italic leading-[1.75] text-white/88 sm:text-base"
        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 430 }}
      >
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
    <div className="product-molecular-table overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(({ label, value }, i) => (
            <tr
              key={label}
              className={`${i % 2 === 0 ? "bg-white/3" : "bg-transparent"} max-[359px]:block`}
            >
              <td
                className="product-molecular-label w-40 px-5 py-3 text-[0.72rem] font-bold uppercase tracking-[0.12em] leading-relaxed text-[#D8DDE5] max-[359px]:block max-[359px]:w-full max-[359px]:pb-1"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {label}
              </td>
              <td
                className="product-molecular-value px-5 py-3 text-[0.98rem] leading-relaxed text-white/95 break-words [overflow-wrap:anywhere] max-[359px]:block max-[359px]:w-full max-[359px]:pt-0"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
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
          style={{ background: "linear-gradient(to bottom, #B9C0CA, #174A9B)" }}
        />
        <h2
          className="text-white"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
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
              className="rounded-xl border border-white/8 p-4 cursor-pointer transition-all duration-200 hover:border-[#B9C0CA]/40 hover:scale-[1.02] group"
              style={{ background: "oklch(0.27 0.08 255 / 0.6)" }}
            >
              <div
                className="w-full rounded-lg overflow-hidden mb-3 flex items-center justify-center relative"
                style={{
                  background: "oklch(0.29 0.085 255)",
                  height: "220px",
                  padding: "14px",
                }}
              >
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: "radial-gradient(ellipse at 50% 60%, rgba(185,192,202,0.10) 0%, transparent 70%)",
                  }}
                />
                <img
                  src={p.images?.[0] || VIAL_IMG}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  className="relative z-10 w-full h-full object-contain"
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(185,192,202,0.35))",
                    transition: "filter 0.25s cubic-bezier(0.23,1,0.32,1)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLImageElement).style.filter =
                      "drop-shadow(0 0 16px rgba(185,192,202,0.75)) drop-shadow(0 0 32px rgba(185,192,202,0.35))";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLImageElement).style.filter =
                      "drop-shadow(0 0 8px rgba(185,192,202,0.35))";
                  }}
                />
              </div>
              <p
                className="text-white text-sm font-medium truncate mt-1 text-center"
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
  const product = findProductById(id);

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const activeTabLabel = TAB_LABELS.find(({ key }) => key === activeTab)?.label ?? "Research Overview";
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
        style={{ background: "oklch(0.20 0.06 255)" }}
      >
        <FlaskConical size={48} className="text-[#B9C0CA] mb-4" />
        <h1
          className="text-white text-4xl mb-2"
          style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.05em" }}
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
      style={{ background: "oklch(0.20 0.06 255)", fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Top Nav ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/8"
        style={{ background: "oklch(0.20 0.06 255 / 0.95)", backdropFilter: "blur(12px)" }}
      >
        <Link href="/">
          <img
            src={PRIMARY_LOGO_URL}
            alt={PRIMARY_LOGO_ALT}
            className={UTILITY_LOGO_SIZE_CLASS}
          />
        </Link>
        <button
            onClick={() => { navigate('/'); setTimeout(() => { document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }, 150); }}
            className="flex items-center gap-2 text-white/60 hover:text-[#B9C0CA] transition-colors text-sm"
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
          <Link href="/"><span className="hover:text-[#B9C0CA] transition-colors cursor-pointer">Home</span></Link>
          <span>/</span>
          <Link href="/#products"><span className="hover:text-[#B9C0CA] transition-colors cursor-pointer">Products</span></Link>
          <span>/</span>
          <span className="text-[#B9C0CA]">{product.name}</span>
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
              background: "oklch(0.28 0.08 255)",
              border: "1px solid oklch(0.44 0.13 255 / 0.25)",
              boxShadow: "0 0 60px oklch(0.55 0.14 255 / 0.2)",
            }}
          >
            {/* Cyan glow behind vial */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 60% 65% at 50% 52%, oklch(0.76 0.02 250 / 0.2) 0%, transparent 70%)",
              }}
            />
            <img
              src={images[activeImg]}
              alt={product.name}
              decoding="async"
              fetchPriority="high"
              className="w-full h-full object-contain p-4 relative z-10"
              style={{ filter: "drop-shadow(0 0 28px oklch(0.82 0.085 88 / 0.5))" }}
            />
            {/* Prev/Next arrows — only show if multiple images */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: "oklch(0.20 0.06 255 / 0.8)", border: "1px solid rgba(185,192,202,0.3)", color: "#B9C0CA" }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setActiveImg((prev) => (prev + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: "oklch(0.20 0.06 255 / 0.8)", border: "1px solid rgba(185,192,202,0.3)", color: "#B9C0CA" }}
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
                    borderColor: activeImg === i ? "#B9C0CA" : "rgba(255,255,255,0.1)",
                    opacity: activeImg === i ? 1 : 0.5,
                  }}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}

          {/* Research-use-only trust badge */}
          <div
            className="rounded-xl p-3 sm:p-4 flex items-start gap-3 border border-[#76B8FF]/20"
            style={{ background: "oklch(0.18 0.055 255 / 0.72)" }}
          >
            <AlertTriangle size={16} className="text-[#76B8FF] flex-shrink-0 mt-0.5" />
            <p className="text-white/68 text-[0.8rem] sm:text-sm leading-relaxed">
              <span className="text-[#9DB6D8] font-semibold" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.02em" }}>
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
                background: "rgba(185,192,202,0.12)",
                border: "1px solid rgba(185,192,202,0.3)",
                color: "#B9C0CA",
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
                  background: "rgba(167,122,44,0.12)",
                  border: "1px solid rgba(167,122,44,0.3)",
                  color: "#174A9B",
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
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
              letterSpacing: "0.04em",
            }}
          >
            {product.name}
          </h1>

          {/* Public research format — updates with the selected variant. */}
          <div className="product-detail-format-line flex flex-wrap items-baseline gap-x-2 gap-y-1 border-l-2 border-[#76B8FF]/55 pl-3">
            <span
              className="text-[0.64rem] uppercase tracking-[0.22em] text-[#9DB6D8]"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}
            >
              Research Format
            </span>
            <span
              className="text-[1.2rem] leading-none text-[#F6F1E9]"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, letterSpacing: "0.02em" }}
            >
              {displayContent}
            </span>
          </div>

          {/* Tagline */}
          <p
            className="product-detail-tagline max-w-xl text-[1.28rem] leading-snug text-[#F6F1E9]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, letterSpacing: "0.012em" }}
          >
            {product.tagline}
          </p>

          {/* Price — gated behind login */}
          {isAuthenticated ? (
            <div className="flex items-baseline gap-3">
              <span
                className="text-[#B9C0CA]"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.8rem", letterSpacing: "0.04em" }}
              >
                {displayPrice}
              </span>
            </div>
          ) : (
            <button
              onClick={returnToLogin}
              className="flex items-center gap-2 py-3 px-5 rounded-lg border border-[#B9C0CA]/40 text-[#B9C0CA] text-sm tracking-widest uppercase hover:bg-[#B9C0CA]/10 hover:border-[#B9C0CA] transition-all duration-200"
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
                      background: selectedVariant === i ? "rgba(185,192,202,0.2)" : "rgba(255,255,255,0.05)",
                      border: selectedVariant === i ? "1.5px solid #B9C0CA" : "1.5px solid rgba(255,255,255,0.12)",
                      color: selectedVariant === i ? "#B9C0CA" : "rgba(255,255,255,0.6)",
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
                  background: "rgba(185,192,202,0.15)",
                  border: "1.5px solid rgba(185,192,202,0.5)",
                  color: "#B9C0CA",
                }}
              >
                <ShoppingCart size={16} />
                ADD TO CART
              </button>
              <button
                onClick={handleBuyNow}
                className="product-boutique-cta flex-1 min-w-[140px] flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg font-bold tracking-widest uppercase text-sm"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                }}
              >
                <Zap size={16} />
                BUY NOW
              </button>
            </div>
          ) : (
            <button
              onClick={returnToLogin}
              className="product-boutique-cta w-full flex items-center justify-center gap-2 py-4 rounded-lg text-sm tracking-widest uppercase"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}
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
              ].map(({ icon, label }) => (
              <div
                key={label}
                className="rounded-lg p-3 text-center border border-white/8"
                style={{ background: "oklch(0.27 0.08 255 / 0.4)" }}
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

          {/* Product-specific COA state — verified values apply only to the matched lot. */}
          <section
            id="product-evidence"
            className={`coa-typography-panel overflow-hidden rounded-2xl border ${product.coa ? "border-[#76B8FF]/30" : "border-[#B9C0CA]/20"}`}
            style={{ background: "linear-gradient(145deg, oklch(0.27 0.08 255 / 0.92), oklch(0.22 0.065 255 / 0.94))" }}
          >
            <div className="flex items-start gap-4 border-b border-white/10 px-4 py-5 sm:px-6 sm:py-6">
              <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border sm:h-12 sm:w-12 ${product.coa ? "bg-[#174A9B]/28 border-[#76B8FF]/35" : "bg-[#B9C0CA]/10 border-[#B9C0CA]/20"}`}>
                {product.coa ? <CheckCircle2 size={20} className="text-[#D8DDE5]" strokeWidth={1.7} /> : <FileText size={20} className="text-[#B9C0CA]" strokeWidth={1.7} />}
              </div>
              <div className="min-w-0">
                <p
                  className="mb-1 text-[0.64rem] uppercase tracking-[0.22em] text-[#9DB6D8]"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}
                >
                  Batch Documentation
                </p>
                <h2
                  className="text-[1.65rem] leading-none text-[#F6F1E9] sm:text-[1.85rem]"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650, letterSpacing: "0.015em" }}
                >
                  Certificate of Analysis <span className="text-[#B9C0CA]">(COA)</span>
                </h2>
                <p
                  className="mt-2 max-w-xl text-[0.82rem] leading-relaxed text-white/62 sm:text-sm"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                >
                  {product.coa
                    ? `Batch-matched Ethos report ${product.coa.reportId} is available for lot ${product.coa.lotBatch}.`
                    : "No matching report is currently posted for this product."}
                </p>
              </div>
            </div>
            <Link href={`/coa/${product.id}`}>
              <span className="group flex cursor-pointer flex-col gap-2.5 px-4 py-4 text-[#E9DCCB] transition-colors hover:bg-[#B9C0CA]/8 hover:text-white sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6">
                <span
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em]"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}
                >
                  {product.coa ? "View verified COA" : "View COA status"}
                </span>
                {product.coa ? (
                  <span
                    className="inline-flex items-center gap-2 text-[0.72rem] leading-relaxed text-[#D8DDE5] sm:text-right"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 550, letterSpacing: "0.025em" }}
                  >
                    <CheckCircle2 size={14} className="shrink-0 text-[#9DB6D8]" strokeWidth={1.8} />
                    <span>{product.coa.purityResult} · Lot {product.coa.lotBatch}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-white/45 text-[0.68rem] uppercase tracking-[0.12em]">
                    <Clock3 size={13} /> Pending verified upload
                  </span>
                )}
              </span>
            </Link>
          </section>

          {/* Research benefits list */}
          <section
            className="research-highlights-panel rounded-2xl border border-white/10 px-4 py-5 sm:px-6 sm:py-6"
            style={{ background: "linear-gradient(145deg, oklch(0.27 0.08 255 / 0.72), oklch(0.24 0.07 255 / 0.58))" }}
          >
            <p
              className="text-[0.64rem] uppercase tracking-[0.22em] text-[#9DB6D8]"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}
            >
              Research Profile
            </p>
            <h2
              className="mt-1 text-[1.7rem] leading-none text-[#F6F1E9] sm:text-[1.95rem]"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650, letterSpacing: "0.015em" }}
            >
              Research Highlights
            </h2>
            <ul className="mt-4 divide-y divide-white/8 border-t border-white/10">
              {product.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 py-3 first:pt-3 last:pb-0">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#76B8FF]/25 bg-[#174A9B]/22">
                    <CheckCircle2 size={12} className="text-[#C8D0DB]" strokeWidth={1.8} />
                  </span>
                  <span
                    className="text-[0.9rem] leading-relaxed text-white/78 sm:text-[0.95rem]"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 430 }}
                  >
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* ── TABBED DESCRIPTION SECTION ── */}
      <div
        className="border-t border-white/8 mt-4"
        style={{ background: "oklch(0.22 0.065 255)" }}
      >
        <div className="max-w-6xl mx-auto px-6 pt-8">
          {/* Tab bar */}
          <div className="product-detail-tabs grid grid-cols-2 sm:flex sm:flex-wrap sm:gap-0 border-b border-white/10">
            {TAB_LABELS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="min-h-12 px-3 py-3.5 text-[0.78rem] sm:px-5 sm:text-sm font-semibold leading-snug transition-all duration-200 border-b-2 -mb-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9C0CA]/70 focus-visible:ring-inset"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: activeTab === key ? 700 : 600,
                  letterSpacing: "0.01em",
                  borderBottomColor: activeTab === key ? "#B9C0CA" : "transparent",
                  color: activeTab === key ? "#FFFFFF" : "rgba(255,255,255,0.74)",
                  background: activeTab === key ? "rgba(185,192,202,0.06)" : "transparent",
                }}
                aria-pressed={activeTab === key}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="product-detail-tab-content py-7 sm:py-8">
            <div className="mb-5 border-b border-white/8 pb-4 sm:mb-6">
              <p
                className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#9DB6D8]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Full Product Details
              </p>
              <h2
                className="mt-1 text-[2.35rem] leading-[1.04] text-white sm:text-[3rem] lg:text-[3.5rem]"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650, letterSpacing: "0.01em" }}
              >
                {activeTabLabel}
              </h2>
            </div>
            {activeTab === "overview" && (
              <div className="product-overview-content max-w-3xl space-y-6">
                <div
                  className="rounded-xl border border-[#B9C0CA]/18 px-5 py-5 sm:px-6"
                  style={{ background: "rgba(185,192,202,0.06)" }}
                >
                  <p
                    className="text-[#B9C0CA] text-[0.72rem] uppercase tracking-[0.12em] leading-relaxed mb-2"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}
                  >
                    Research Classification
                  </p>
                  <p
                    className="product-tab-body text-white text-base leading-[1.75] sm:text-[1.05rem]"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 550 }}
                  >
                    {product.researchClassification}
                  </p>
                </div>
                <p
                  className="product-tab-lead text-[1.05rem] leading-[1.8] text-white sm:text-[1.12rem]"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  {product.synopsis}
                </p>
                <p
                  className="product-tab-body text-[0.98rem] leading-[1.8] text-white/90 sm:text-[1.03rem]"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 430 }}
                >
                  {product.plainEnglish}
                </p>
              </div>
            )}
            {activeTab === "mechanism" && (
              <div className="product-mechanism-content max-w-3xl">
                <p
                  className="product-tab-body text-[1rem] leading-[1.82] text-white/92 sm:text-[1.06rem]"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 430 }}
                >
                  {product.howItWorks}
                </p>
              </div>
            )}
            {activeTab === "applications" && (
              <div className="product-applications-content max-w-3xl space-y-5">
                <p
                  className="product-tab-body text-[1rem] leading-[1.82] text-white/92 sm:text-[1.06rem]"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 430 }}
                >
                  {product.whoIsItFor}
                </p>
                {/* Quick facts */}
                <div
                  className="product-application-specs rounded-xl border border-white/8 overflow-hidden mt-6"
                  style={{ background: "oklch(0.27 0.08 255 / 0.5)" }}
                >
                  {[
                    { label: "Compound", value: product.name },
                    { label: "Content", value: displayContent },
                    { label: "Category", value: product.category },
                    { label: "Classification", value: product.researchClassification },
                    { label: "Price", value: displayPrice },
                  ].map(({ label, value }, i) => (
                    <div
                      key={label}
                      className="product-application-spec-row flex justify-between items-start gap-5 max-[359px]:flex-col max-[359px]:gap-1.5 px-5 py-3.5 border-b border-white/5 last:border-0"
                      style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}
                    >
                      <span
                        className="product-application-spec-label shrink-0 text-[#B9C0CA]/85 uppercase tracking-[0.12em] text-[0.72rem] sm:text-xs leading-relaxed"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}
                      >
                        {label}
                      </span>
                      <span
                        className="product-application-spec-value min-w-0 max-w-[68%] text-right max-[359px]:max-w-none max-[359px]:w-full max-[359px]:text-left text-white/95 text-[0.98rem] sm:text-base leading-relaxed break-words"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, letterSpacing: "-0.01em" }}
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
            {activeTab === "handling" && (
              <div className="product-handling-content max-w-3xl space-y-6">
                <div
                  className="rounded-xl border border-white/10 p-5 sm:p-6"
                  style={{ background: "oklch(0.27 0.08 255 / 0.5)" }}
                >
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={19} className="text-[#B9C0CA] mt-0.5 flex-shrink-0" />
                    <div>
                      <p
                        className="text-[#B9C0CA] text-[0.72rem] uppercase tracking-[0.12em] leading-relaxed mb-2"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}
                      >
                        Laboratory Handling
                      </p>
                      <p
                        className="product-tab-body text-[0.98rem] leading-[1.8] text-white/92 sm:text-[1.03rem]"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 430 }}
                      >
                        {product.handling}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-xl border border-[#B9C0CA]/20 p-5"
                  style={{ background: "rgba(185,192,202,0.06)" }}
                >
                  <p
                    className="text-[#F6F1E9] text-[0.72rem] uppercase tracking-[0.12em] leading-relaxed"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}
                  >
                    Product Documentation
                  </p>
                  <p
                    className="product-tab-body mt-2 text-[0.95rem] leading-[1.75] text-white/88 sm:text-base"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 430 }}
                  >
                    {product.coa
                      ? `The owner-supplied COA has been matched to lot ${product.coa.lotBatch}. It reports ${product.coa.contentResult} and ${product.coa.purityResult}. These results apply only to the sample identified in report ${product.coa.reportId}.`
                      : "A product-specific COA location is reserved for a report that matches this compound and lot. Until a document is supplied and mapped, analytical identity and purity remain pending on the website."}
                  </p>
                  <Link href={`/coa/${product.id}`}>
                    <span
                      className="inline-flex items-center gap-2 mt-4 text-[#E9DCCB] hover:text-white text-xs uppercase tracking-[0.12em] cursor-pointer"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}
                    >
                      <FileText size={14} /> {product.coa ? "View report details" : "View COA status"}
                    </span>
                  </Link>
                </div>

                <div>
                  <p
                    className="text-[#B9C0CA] text-[0.72rem] uppercase tracking-[0.12em] leading-relaxed mb-3"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}
                  >
                    Research References
                  </p>
                  <div className="space-y-2">
                    {product.references.map((reference) => (
                      <a
                        key={reference.url}
                        href={reference.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-start justify-between gap-4 rounded-lg border border-white/8 px-4 py-3.5 text-white/90 hover:text-white hover:border-[#B9C0CA]/35 transition-colors"
                        style={{ background: "rgba(255,255,255,0.025)", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                      >
                        <span className="text-[0.94rem] leading-[1.7] sm:text-[0.98rem]">{reference.title}</span>
                        <ExternalLink size={14} className="text-[#B9C0CA] mt-0.5 flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Disclaimer block — always visible below tabs */}
          <div
            className="rounded-xl p-5 border border-[#174A9B]/20 flex gap-4 mb-10"
            style={{ background: "oklch(0.16 0.04 10 / 0.3)" }}
          >
            <AlertTriangle size={18} className="text-[#174A9B] flex-shrink-0 mt-0.5" />
            <div>
              <p
                className="text-[#174A9B] text-xs mb-1"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, letterSpacing: "0.02em" }}
              >
                Research Use Only — Important Notice
              </p>
              <p
                className="text-[0.92rem] leading-[1.75] text-white/84 sm:text-[0.96rem]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 430 }}
              >
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
        style={{ background: "oklch(0.20 0.06 255)" }}
      >
        <RelatedProducts current={product} />
      </div>

      {/* ── Footer strip ── */}
      <div
        className="border-t border-white/8 py-8 text-center"
        style={{ background: "#0B1D3F" }}
      >
        <Link href="/#products">
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mx-auto"
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              letterSpacing: "0.08em",
              background: "rgba(185,192,202,0.12)",
              border: "1px solid rgba(185,192,202,0.3)",
              color: "#B9C0CA",
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
