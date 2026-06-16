// === ELITE LA PEPTIDES — Products Section ===
// Filterable product grid with category tabs
// Background: dark navy with subtle molecular pattern

import { useState, useEffect, useRef } from "react";
import { products } from "@/lib/products";
import ProductCard from "./ProductCard";

const PRODUCT_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663765469010/KeqNR4QdNviNNDWK3S7923/product-bg-dark-2HHK4jChuUruVvEKgHziDA.webp";

const filterTabs = [
  { label: "All", value: "All" },
  { label: "Metabolic", value: "Metabolic" },
  { label: "Longevity", value: "Longevity" },
  { label: "Recovery", value: "Recovery" },
  { label: "Stacks", value: "stack" },
];

export default function ProductsSection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const sectionRef = useRef<HTMLDivElement>(null);

  const filtered = products.filter((p) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "stack") return p.isStack;
    return p.category.toLowerCase().includes(activeFilter.toLowerCase());
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
        <div className="text-center mb-12 animate-on-scroll">
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
            Every compound in our catalog is rigorously sourced and formulated to pharmaceutical-grade standards. Science-backed. LA-tested. Elite-approved.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 animate-on-scroll">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-5 py-2 rounded text-xs tracking-widest uppercase transition-all duration-200 ${
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Bottom note */}
        <p
          className="text-center text-white/30 text-xs mt-12 tracking-wide animate-on-scroll"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          * These products are intended for research purposes only. Not for human consumption. Consult a licensed healthcare professional.
        </p>
      </div>
    </section>
  );
}
