// === LA ELITE PEPTIDES — Products Section ===
// Filterable product grid with warm limestone surfaces and royal-blue controls.

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { categories, products } from "@/lib/products";
import ProductCard from "./ProductCard";

const PRODUCT_BG = "/manus-storage/lap-product-section-background_f1688370.jpg";

const filterTabs = categories.map((category) => ({ label: category, value: category }));

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
      className="relative py-20 sm:py-32 text-[#202833]"
      style={{
        background: `url(${PRODUCT_BG}) center/cover no-repeat, #DDD2C5`,
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(246,241,233,0.93)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 animate-on-scroll">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-[#B9C0CA]" />
            <span
              className="text-[#7C8693] text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              Our Formulations
            </span>
            <div className="h-px w-12 bg-[#B9C0CA]" />
          </div>
          <h2
            className="text-[#10295E] mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 600,
              letterSpacing: "-0.015em",
            }}
          >
            CURATED RESEARCH CATALOG
          </h2>
          <p
            className="text-[#4B5563] max-w-2xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: 1.7 }}
          >
            Explore the current LA Elite Peptides catalog by compound or research area. Product information is presented for qualified laboratory research, and every item remains strictly for in-vitro research use only.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-xl mx-auto mb-8 animate-on-scroll">
          <div
            className="relative flex items-center rounded-xl overflow-hidden transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(124,134,147,0.34)",
              boxShadow: searchQuery ? "0 0 0 3px rgba(36,95,193,0.12)" : "none",
            }}
          >
            <Search
              size={17}
              className="absolute left-4 text-[#174A9B] pointer-events-none flex-shrink-0"
            />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by compound name or research area (e.g. metabolic, recovery, BDNF…)"
              className="w-full bg-transparent text-[#202833] placeholder-[#7C8693] text-sm py-3.5 pl-11 pr-10 outline-none"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 text-[#7C8693] hover:text-[#174A9B] transition-colors p-1"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
          {searchQuery && (
            <p
              className="text-[#7C8693] text-xs mt-2 text-center"
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
                  ? "bg-[#174A9B] text-white font-bold shadow-[0_8px_20px_rgba(23,74,155,0.24)]"
                  : "border border-[#B9C0CA] text-[#4B5563] hover:border-[#174A9B]/50 hover:text-[#174A9B]"
              }`}
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-on-scroll">
            <Search size={40} className="text-[#B9C0CA] mx-auto mb-4" />
            <p
              className="text-[#10295E] text-lg mb-2"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, letterSpacing: "0" }}
            >
              No Products Found
            </p>
            <p className="text-[#7C8693] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              Try a different search term or clear the filter.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}
              className="mt-4 px-5 py-2 rounded text-xs tracking-widest uppercase border border-[#174A9B]/40 text-[#174A9B] hover:bg-[#174A9B]/8 transition-colors"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              Show All Products
            </button>
          </div>
        )}

        {/* Bottom note */}
        <p
          className="text-center text-[#7C8693] text-xs mt-12 tracking-wide animate-on-scroll"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          * All compounds are strictly for in-vitro laboratory and scientific research use only.
        </p>
      </div>
    </section>
  );
}
