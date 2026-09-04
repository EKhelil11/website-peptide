// === ELITE LA PEPTIDES — Hero Section ===
// Full-viewport vial-label hero with research-focused messaging.

import React, { useEffect, useRef } from "react";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import { catalogCounts, products } from "@/lib/products";

const HERO_BG = "/manus-storage/la-elite-peptides-wellness-clinic-hero_97eecfe8-optimized_1b05f19b.webp";

export default function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const signatureBlends = products.filter((product) => product.isStack);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    // Staggered entrance
    const children = el.querySelectorAll(".hero-item");
    children.forEach((child, i) => {
      (child as HTMLElement).style.animationDelay = `${i * 150}ms`;
      (child as HTMLElement).classList.add("animate-fade-up");
    });
  }, []);

  const scrollToProducts = () => {
    document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "oklch(0.16 0.05 255)" }}
    >
      {/* ── Full-cover hero background (all screen sizes) ── */}
      <div
        className="hero-clinic-image absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Navy label overlay — heavier on the text side and transparent over the vial lineup. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(100deg, rgba(7,21,47,0.95) 0%, rgba(16,41,94,0.86) 40%, rgba(16,41,94,0.38) 72%, rgba(7,21,47,0.12) 100%)",
        }}
      />
      {/* Warm-stone light and navy bottom fade tie the photograph into the page. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(246,241,233,0.05) 0%, transparent 20%, transparent 62%, rgba(7,21,47,0.82) 100%)",
        }}
      />
      {/* Bottom fade into next section */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to top, oklch(0.16 0.05 255) 0%, transparent 100%)",
        }}
      />

      {/* Brushed-silver glow orb. */}
      <div
        className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, oklch(0.76 0.02 250 / 10%) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Royal-blue accent orb. */}
      <div
        className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, oklch(0.55 0.14 255 / 8%) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-16">
        <div className="hero-content-shift max-w-3xl" ref={contentRef}>
          {/* Eyebrow */}
          <div className="hero-item opacity-0 mb-5 flex items-center gap-3">
            <div className="h-px w-12 bg-[#B9C0CA]" />
            <span
              className="text-[#B9C0CA] text-xs tracking-[0.35em] uppercase"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              Los Angeles Peptide Research Institute
            </span>
          </div>

          {/* Main headline — ivory with a brushed-silver second line. */}
          <h1
            className="hero-headline-contrast hero-item opacity-0 leading-none mb-4 sm:mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(3rem, 6.3vw, 6.25rem)",
              fontWeight: 600,
              letterSpacing: "-0.025em",
              textShadow: "0 2px 60px rgba(0,0,0,0.7)",
              whiteSpace: "normal",
            }}
          >
            <span className="text-white block">LONGEVITY ANALYTICS</span>
            <span
              className="hero-research-line block"
            >
              RESEARCH COMPOUNDS
            </span>
          </h1>

          {/* Boutique research-supply positioning */}
          <div
            className="hero-description-contrast hero-item opacity-0 text-[#F6F1E9] mb-6 sm:mb-8 max-w-2xl leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.01em" }}
          >
            <p className="text-[1.03rem] font-medium">
              A boutique supplier of premium research compounds, created for qualified researchers who demand exceptional quality, consistency, and transparency.
            </p>
            <p className="hidden sm:block mt-3 text-[0.92rem] text-white/82">
              Our carefully curated catalog focuses on high-grade research materials selected to meet exacting standards. Every detail reflects our commitment to providing a refined, dependable, and professional research supply experience.
            </p>
            <p
              className="mt-3 text-sm text-[#F7F1E8] uppercase tracking-[0.11em]"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}
            >
              Premium compounds. Rigorous standards. Uncompromising quality.
            </p>
            <p className="mt-2 text-[0.72rem] text-white/60 uppercase tracking-[0.08em]">
              Strictly for qualified in-vitro laboratory research.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="hero-item opacity-0 flex flex-wrap gap-4">
            <button
              onClick={scrollToProducts}
              className="btn-primary px-8 py-3 rounded text-sm"
            >
              Explore Compounds
            </button>
            <button
              onClick={() => document.querySelector("#science")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-3 rounded text-sm border border-white/20 text-white/80 hover:border-[#B9C0CA]/50 hover:text-[#B9C0CA] transition-all duration-200"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}
            >
              Our Science
            </button>
          </div>

          {/* Premium research statistics */}
          <div className="hero-stats-grid hero-item opacity-0 mt-12 grid grid-cols-1 sm:grid-cols-[0.9fr_1.25fr_0.9fr] gap-3 max-w-3xl">
            {[
              { value: `${catalogCounts.compounds}`, label: "Current Compounds" },
              {
                value: `${catalogCounts.signatureBlends}`,
                label: "Signature Blends",
                stacks: signatureBlends.map((product) => ({
                  name: product.stackName || product.name,
                  id: product.id,
                })),
              },
              { value: "US", label: "Research Support" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`hero-stat-card ${i === 1 ? "hero-stat-card-featured" : ""}`}
              >
                <span className="hero-stat-index">0{i + 1}</span>
                <div
                  className="hero-stat-value"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {stat.value}
                </div>
                <div
                  className="hero-stat-label"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}
                >
                  {stat.label}
                </div>
                {'stacks' in stat && stat.stacks && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(stat.stacks as { name: string; id: string }[]).map((s) => (
                      <Link
                        key={s.id}
                        href={`/product/${s.id}`}
                        className="hero-stat-link"
                      >
                        {s.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToProducts}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-[#B9C0CA] transition-colors animate-bounce"
        aria-label="Scroll to products"
      >
        <ChevronDown size={28} />
      </button>
    </section>
  );
}
