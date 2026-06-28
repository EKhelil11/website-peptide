// === ELITE LA PEPTIDES — Product Card ===
// Dark card with cyan glow on hover, badge, synopsis, price placeholder
// CTA: "Inquire" button linking to contact section

import { Link, useLocation } from "wouter";
import { ShoppingCart, ArrowRight, Lock } from "lucide-react";
import type { Product } from "@/lib/products";
import { useAuth } from "@/_core/hooks/useAuth";

const VIAL_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663765469010/KeqNR4QdNviNNDWK3S7923/peptide-vial-KdSBvv2H7a9bZfeH52wPjY.webp";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const animationDelay = `${index * 80}ms`;
  const [, navigate] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const hasAcceptedTerms = isAuthenticated && Boolean((user as any)?.termsAcceptedAt);

  const handleLoginGate = () => {
    navigate("/research-access");
  };

  return (
    <div
      className="product-card rounded-lg overflow-hidden animate-on-scroll flex flex-col"
      style={{ animationDelay }}
    >
      {/* Card image area */}
      <div
        className="relative h-44 overflow-hidden flex-shrink-0 group/cardimg"
        style={{
          background: "linear-gradient(135deg, oklch(0.14 0.055 255) 0%, oklch(0.2 0.07 240) 100%)",
        }}
      >
        <img
          src={product.images?.[0] || VIAL_IMG}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-500 ease-out group-hover/cardimg:scale-110"
          style={{ objectPosition: "center 20%" }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 30%, oklch(0.17 0.055 255) 100%)",
          }}
        />
        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className={product.isStack ? "badge-stack" : "badge-single"}>
            {product.badge || (product.isStack ? "Stack" : "Single")}
          </span>
        </div>
        {/* Category */}
        <div className="absolute top-3 right-3">
          <span
            className="text-white/50 text-xs tracking-widest uppercase"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
          >
            {product.category}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Product name + dose */}
        <div className="mb-1">
          <h3
            className="text-white leading-tight"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1.6rem",
              letterSpacing: "0.04em",
            }}
          >
            {product.name}
          </h3>
          {product.isStack && product.stackName && (
            <div
              className="text-[#FF2D78] text-xs tracking-widest uppercase"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              {product.stackName}
            </div>
          )}
        </div>

        {/* Content */}
        {product.content && (
          <div
            className="text-[#00BFFF] text-xs tracking-wide mb-1"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
          >
            Content: {product.content}
          </div>
        )}

        {/* Tagline */}
        <p
          className="text-white/60 text-sm mb-3 leading-snug"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
        >
          {product.tagline}
        </p>

        {/* Synopsis — 3 lines clamped */}
        <div className="mb-4 flex-1">
          <p
            className="text-white/70 text-sm leading-relaxed line-clamp-3"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {product.synopsis}
          </p>
          <Link href={`/product/${product.id}`}>
            <button
              className="mt-2 flex items-center gap-1 text-[#00BFFF] text-xs font-semibold tracking-wide uppercase hover:text-[#00BFFF]/80 transition-colors"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              <ArrowRight size={13} /> Full Details
            </button>
          </Link>
        </div>

        {/* Divider */}
        <div className="border-t border-white/8 pt-4 mt-auto">
          {hasAcceptedTerms ? (
            /* Authenticated + terms accepted: show real price and Add to Cart */
            <div className="flex items-center justify-between">
              <div>
                {product.price ? (
                  <span
                    className="text-[#00BFFF]"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem" }}
                  >
                    {product.price}
                  </span>
                ) : (
                  <span className="text-white/30 text-xs tracking-widest uppercase"
                    style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
                    Coming Soon
                  </span>
                )}
              </div>
              {product.price ? (
                <Link href={`/product/${product.id}`}>
                  <button className="btn-primary flex items-center gap-2 px-4 py-2 rounded text-xs">
                    <ShoppingCart size={14} />
                    Add to Cart
                  </button>
                </Link>
              ) : (
                <span className="text-white/30 text-xs tracking-widest uppercase"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  Coming Soon
                </span>
              )}
            </div>
          ) : (
            /* Unauthenticated or terms not accepted: show login gate */
            <button
              onClick={handleLoginGate}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded border border-cyan-500/40 text-cyan-400 text-xs tracking-widest uppercase hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-200"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              <Lock size={13} />
              Login to View Pricing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
