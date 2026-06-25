// === LA ELITE PEPTIDES — Products Section ===
// Filterable product grid with search bar + category tabs
// Background: dark navy with subtle molecular pattern

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { products } from "@/lib/products";
import ProductCard from "./ProductCard";

const PRODUCT_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663765469010/KeqNR4QdNviNNDWK3S7923/product-bg-dark-2HHK4jChuUruVvEKgHziDA.webp";

const filterTabs = [
  { label: "All", value: "All" },
  { label: "GLP / Metabolic", value: "GLP / Metabolic" },
  { label: "Longevity", value: "Longevity" },
  { label: "Recovery", value: "Recovery" },
  { label: "Cellular Health", value: "Cellular Health" },
  { label: "Hormone Support", value: "Hormone Support" },
  { label: "Stacks", value: "stack" },
];

export default function ProductsSection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const sectionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = products.filter((p) => {
    // Category filter
    const categoryMatch =
      activeFilter === "All"
        ? true
        : activeFilter === "stack"
        ? p.isStack
        : p.category.toLowerCase() === activeFilter.toLowerCase();

    // Search filter — match name, tagline, synopsis, benefits, category
    const q = searchQuery.toLowerCase().trim();
    const searchMatch =
      q === "" ||
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.synopsis.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.benefits.some((b) => b.toLowerCase().includes(q));

    return categoryMatch && searchMatch;
  });

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const items = sectionRef.current?.querySelectorAll(".animate-on-scroll");
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [filtered]);

  const clearSearch = () => {
    setSearchQuery("");
    inputRef.current?.focus();
  };

  return (
    <section
      id="products"
      ref={sectionRef}
      className="relative py-24"
      style={{
        background: `url(${PRODUCT_BG}) center/cover no-repeat fixed, oklch(0.12 0.05 255)`,
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "oklch(0.1 0.05 255 / 88%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 animate-on-scroll">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-[#00BFFF]" />
            <span
              className="text-[#00BFFF] text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              Our Formulations
            </span>
            <div className="h-px w-12 bg-[#00BFFF]" />
          </div>
          <h2
            className="text-white mb-4"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              letterSpacing: "0.04em",
            }}
          >
            PRECISION PEPTIDES
          </h2>
          <p
            className="text-white/60 max-w-2xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: 1.7 }}
          >
            Every compound in our catalog is rigorously sourced and formulated to pharmaceutical-grade standards for qualified research applications. All products are for in-vitro laboratory research use only.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-xl mx-auto mb-8 animate-on-scroll">
          <div
            className="relative flex items-center rounded-xl overflow-hidden transition-all duration-200"
            style={{
              background: "oklch(0.16 0.055 255 / 0.7)",
              border: "1px solid rgba(0,191,255,0.25)",
              boxShadow: searchQuery ? "0 0 20px rgba(0,191,255,0.15)" : "none",
            }}
          >
            <Search
              size={17}
              className="absolute left-4 text-[#00BFFF] pointer-events-none flex-shrink-0"
            />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by compound name or research area (e.g. metabolic, recovery, BDNF…)"
              className="w-full bg-transparent text-white placeholder-white/30 text-sm py-3.5 pl-11 pr-10 outline-none"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 text-white/40 hover:text-[#FF2D78] transition-colors p-1"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
          {searchQuery && (
            <p
              className="text-white/40 text-xs mt-2 text-center"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              {filtered.length === 0
                ? "No products match your search"
                : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`}
            </p>
          )}
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 animate-on-scroll">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-4 py-2 rounded text-xs tracking-widest uppercase transition-all duration-200 ${
                activeFilter === tab.value
                  ? "bg-[#00BFFF] text-[oklch(0.12_0.05_255)] font-bold shadow-[0_0_20px_rgba(0,191,255,0.3)]"
                  : "border border-white/15 text-white/60 hover:border-[#00BFFF]/40 hover:text-[#00BFFF]"
              }`}
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-on-scroll">
            <Search size={40} className="text-white/20 mx-auto mb-4" />
            <p
              className="text-white/40 text-lg mb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
            >
              No Products Found
            </p>
            <p className="text-white/30 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              Try a different search term or clear the filter.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}
              className="mt-4 px-5 py-2 rounded text-xs tracking-widest uppercase border border-[#00BFFF]/30 text-[#00BFFF] hover:bg-[#00BFFF]/10 transition-colors"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              Show All Products
            </button>
          </div>
        )}

        {/* Bottom note */}
        <p
          className="text-center text-white/30 text-xs mt-12 tracking-wide animate-on-scroll"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          * All compounds are strictly for in-vitro laboratory and scientific research use only.
        </p>
      </div>
    </section>
  );
}
