// Blends page — dedicated page for all blend/stack products
// Filters products where category === "Blends"

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

const blendProducts = products.filter((p) => p.category === "Blends");

export default function Blends() {
  // Always scroll to top when landing on this page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

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
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    const items = document.querySelectorAll(".animate-on-scroll");
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#060d1a] text-white">
      <AnnouncementBar />
      <Navbar />

      {/* Page Header */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px]" />
        </div>

        <div className="container max-w-6xl mx-auto px-4 relative z-10 text-center">
          {/* Label */}
          <p className="text-xs font-bold tracking-[4px] text-cyan-400 uppercase mb-4">
            Precision Formulated
          </p>

          {/* Title */}
          <h1
            className="font-bebas text-5xl md:text-7xl tracking-widest text-white mb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            RESEARCH{" "}
            <span className="text-cyan-400">BLENDS</span>
          </h1>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-400" />
          </div>

          {/* Description */}
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Multi-peptide stacks engineered for synergistic research protocols.
            Each blend combines complementary compounds in a single vial for
            streamlined research workflows.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400">{blendProducts.length}</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Blends Available</p>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400">1:1</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Precision Ratio</p>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400">100%</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Pharma Grade</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blends Grid */}
      <section className="pb-24">
        <div className="container max-w-6xl mx-auto px-4">
          {blendProducts.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              No blend products found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blendProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-on-scroll"
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>
          )}

          {/* Back to all products */}
          <div className="text-center mt-16">
            <a
              href="/#products"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
              View All Products
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
