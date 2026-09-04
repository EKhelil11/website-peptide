// === ELITE LA PEPTIDES — Product Card ===
// Vial-label card with limestone image stage, ivory body, and royal-blue actions.
// CTA: "Inquire" button linking to contact section

import { Link, useLocation } from "wouter";
import { ShoppingCart, ArrowRight, Lock } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const VIAL_IMG = "/manus-storage/lap-vial-retatrutide-10mg_52f96021-optimized_683307ff.webp";

interface ProductCardProps {
  product: Product;
  index: number;
  showPublicPrice?: boolean;
}

export default function ProductCard({ product, index, showPublicPrice = false }: ProductCardProps) {
  const animationDelay = `${index * 80}ms`;
  const [, navigate] = useLocation();
  const { isAuthenticated } = useCustomerAuth();
  const { addToCart } = useCart();

  const handleLoginGate = () => {
    // Pass the product detail page as returnTo so login sends them back here
    navigate(`/login?returnTo=/product/${product.id}`);
  };

  const handleAddToCartAndNavigate = () => {
    if (!product.price) return;
    // Parse price string like "$100" → 100
    const numericPrice = parseFloat(product.price.replace(/[^0-9.]/g, ""));
    addToCart({
      productId: product.id,
      productName: product.name,
      productCategory: product.category,
      unitPrice: numericPrice,
    });
    toast.success(`${product.name} added to cart`, {
      description: "Navigating to product details…",
      duration: 2000,
    });
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="product-card group rounded-lg overflow-hidden animate-on-scroll flex flex-col"
      style={{ animationDelay }}
    >
      {/* Card image area — wrapper allows badge to escape overflow-hidden */}
      <div className="relative flex-shrink-0">
        <div
          className="relative h-64 overflow-hidden flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #E9DCCB 0%, #F6F1E9 100%)",
          }}
        >
          {/* Brushed-silver glow behind vial */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 55% 60% at 50% 55%, rgba(185,192,202,0.46) 0%, transparent 70%)",
            }}
          />
          <img
            src={product.images?.[0] || VIAL_IMG}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-auto max-w-full object-contain opacity-95 py-2 relative z-10 vial-img"
            style={{ maxHeight: "100%" }}
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 52%, rgba(246,241,233,0.92) 100%)",
            }}
          />
          {/* Category — bottom right, away from badge */}
          <div className="absolute bottom-3 right-3">
            <span
              className="text-[#7C8693] text-xs tracking-widest uppercase"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
            >
              {product.category}
            </span>
          </div>
        </div>
        {/* Badge — outside overflow-hidden so it never clips */}
        <div className="absolute top-3 left-3 z-20">
          <span className={product.isStack ? "badge-stack" : "badge-single"}>
            {product.badge || (product.isStack ? "Stack" : "Single")}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-6 flex flex-col flex-1">
        {/* Product name + dose */}
        <div className="mb-1">
          <h3
            className="text-[#10295E] leading-tight"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.6rem",
              letterSpacing: "0.04em",
            }}
          >
            {product.name}
          </h3>
          {product.isStack && product.stackName && (
            <div
              className="text-xs tracking-wide"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, letterSpacing: "0.05em", color: "#174A9B" }}
            >
              {product.stackName}
            </div>
          )}
        </div>

        {/* Content */}
        {product.content && (
          <div className="product-format-line mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-l-2 border-[#2457A7] pl-3">
            <span
              className="text-[0.62rem] uppercase tracking-[0.2em] text-[#5F6B7A]"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}
            >
              Content
            </span>
            <span
              className="text-[1.08rem] leading-none text-[#174A9B]"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, letterSpacing: "0.02em" }}
            >
              {product.content}
            </span>
          </div>
        )}

        {/* Tagline */}
        <p
          className="product-card-tagline mb-3 text-[1.06rem] leading-snug text-[#10295E]"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650, letterSpacing: "0.01em" }}
        >
          {product.tagline}
        </p>

        {/* Synopsis — 3 lines clamped */}
        <div className="mb-4 flex-1">
          <p
            className="product-card-synopsis line-clamp-3 text-sm leading-relaxed text-[#374151]"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 450 }}
          >
            {product.synopsis}
          </p>
          <Link href={`/product/${product.id}`}>
            <button
              className="mt-2 flex items-center gap-1 text-[#174A9B] text-xs font-semibold tracking-wide uppercase hover:text-[#245FC1] transition-colors"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              <ArrowRight size={13} /> Full Details
            </button>
          </Link>
        </div>

        {/* Divider */}
        <div className="border-t border-[#B9C0CA]/55 pt-4 mt-auto">
          {isAuthenticated ? (
            /* Authenticated + terms accepted: show real price and Add to Cart */
            <div className="flex items-center justify-between">
              <div>
                {product.price ? (
                  <span
                    className="text-[#174A9B]"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem" }}
                  >
                    {product.price}
                  </span>
                ) : (
                  <span className="text-[#7C8693] text-xs tracking-widest uppercase"
                    style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
                    Coming Soon
                  </span>
                )}
              </div>
              {product.price ? (
                <button
                  onClick={handleAddToCartAndNavigate}
                  className="btn-primary flex items-center gap-2 px-4 py-2 rounded text-xs"
                >
                  <ShoppingCart size={14} />
                  Add to Cart
                </button>
              ) : (
                <span className="text-[#7C8693] text-xs tracking-widest uppercase"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  Coming Soon
                </span>
              )}
            </div>
          ) : (
            /* Unauthenticated or terms not accepted: show login gate */
            <div className={showPublicPrice ? "flex items-center justify-between gap-4" : ""}>
              {showPublicPrice && product.price && (
                <span className="text-[#174A9B]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem" }}>
                  {product.price}
                </span>
              )}
              <button
                onClick={handleLoginGate}
                className={`${showPublicPrice ? "px-4" : "w-full"} flex items-center justify-center gap-2 py-2.5 rounded btn-primary text-xs tracking-widest uppercase transition-all duration-200`}
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
              >
                <ShoppingCart size={13} />
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
