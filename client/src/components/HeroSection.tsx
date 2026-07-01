// === ELITE LA PEPTIDES — Hero Section ===
// Full-viewport hero with DNA banner, brand tagline, animated entrance
// Background: hero-banner.jpg (dark navy + cyan DNA helix)
// Text: White headline, cyan accent, hot pink "elite" script feel

import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663765469010/KeqNR4QdNviNNDWK3S7923/hero-lab-v1-MpwjhNoxPjv6x5LEznRSix.webp";

export default function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null);

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
      style={{ background: "oklch(0.09 0.05 255)" }}
    >
      {/* ── Full-cover hero background (all screen sizes) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Dark navy gradient overlay — heavier on left where text lives, lighter on right to reveal lab */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(110deg, rgba(5,10,30,0.92) 0%, rgba(5,10,30,0.78) 40%, rgba(5,10,30,0.45) 70%, rgba(5,10,30,0.25) 100%)",
        }}
      />
      {/* Additional bottom-to-top navy fade for seamless section transition */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,10,30,0.3) 0%, transparent 20%, transparent 75%, rgba(5,10,30,0.6) 100%)",
        }}
      />
      {/* Bottom fade into next section */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to top, oklch(0.09 0.05 255) 0%, transparent 100%)",
        }}
      />

      {/* Cyan glow orb */}
      <div
        className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, oklch(0.72 0.18 210 / 10%) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Hot pink accent orb bottom-left */}
      <div
        className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, oklch(0.6 0.27 0 / 6%) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-3xl" ref={contentRef}>
          {/* Eyebrow */}
          <div className="hero-item opacity-0 mb-5 flex items-center gap-3">
            <div className="h-px w-12 bg-[#00BFFF]" />
            <span
              className="text-[#00BFFF] text-xs tracking-[0.35em] uppercase"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              Advanced Peptide Research Institute
            </span>
          </div>

          {/* Main Headline — 2 lines: white + cyan */}
          <h1
            className="hero-item opacity-0 leading-none mb-6"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.8rem, 7vw, 6.5rem)",
              letterSpacing: "0.03em",
              textShadow: "0 2px 60px rgba(0,0,0,0.7)",
              whiteSpace: "nowrap",
            }}
          >
            <span className="text-white block">LONGEVITY ANALYTICS</span>
            <span
              className="block"
              style={{ color: "#00BFFF", textShadow: "0 0 60px rgba(0, 191, 255, 0.5)" }}
            >
              RESEARCH COMPOUNDS
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="hero-item opacity-0 text-white/80 mb-8 max-w-xl leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.1rem", fontWeight: 300, letterSpacing: "0.01em" }}
          >
            Pharmaceutical-grade peptides formulated in certified research facilities. Every compound is rigorously third-party tested for purity, potency, and sterility — delivering the standard that serious researchers demand.
          </p>

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
              className="px-8 py-3 rounded text-sm border border-white/20 text-white/80 hover:border-[#00BFFF]/50 hover:text-[#00BFFF] transition-all duration-200"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}
            >
              Our Science
            </button>
          </div>

          {/* Stats row */}
          <div className="hero-item opacity-0 mt-16 flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:gap-12">
            {[
              { value: "11", label: "Premium Peptides" },
              { value: "3", label: "Signature Stacks", stacks: [
                { name: "Wolverine Stack", id: "bpc157-tb500-wolverine" },
                { name: "GH Synergy", id: "cjc1295-ipamorelin-10mg" },
                { name: "Glow Stack", id: "ghk-cu-bpc157-tb500-glow" },
              ] },
              { value: "100%", label: "Research Grade" },
            ].map((stat, i, arr) => (
              <div key={stat.label} className="flex items-start gap-12">
                {/* Horizontal divider on mobile, vertical on sm+ */}
                {i > 0 && (
                  <>
                    {/* Mobile: horizontal line */}
                    <div className="block sm:hidden h-px w-32" style={{ background: "linear-gradient(to right, transparent, rgba(0,191,255,0.4) 30%, rgba(0,191,255,0.4) 70%, transparent)" }} />
                    {/* Desktop: vertical line */}
                    <div className="hidden sm:block w-px self-stretch" style={{ background: "linear-gradient(to bottom, transparent, rgba(0,191,255,0.3) 30%, rgba(0,191,255,0.3) 70%, transparent)", minHeight: "3.5rem" }} />
                  </>
                )}
                <div>
                <div
                  className="text-[#00BFFF]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", lineHeight: 1 }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-white/60 text-sm tracking-widest uppercase mt-1"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                >
                  {stat.label}
                </div>
                {'stacks' in stat && stat.stacks && (
                  <div className="mt-2 flex flex-col gap-0.5">
                    {(stat.stacks as { name: string; id: string }[]).map((s) => (
                      <Link
                        key={s.id}
                        href={`/product/${s.id}`}
                        className="text-white/60 text-sm transition-all duration-200 hover:text-[#00BFFF] hover:tracking-wider"
                        style={{
                          fontFamily: "'Rajdhani', sans-serif",
                          fontWeight: 500,
                          letterSpacing: "0.04em",
                          textShadow: "none",
                          display: "inline-block",
                          textDecoration: "none",
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.textShadow = "0 0 12px rgba(0,191,255,0.7)";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.textShadow = "none";
                        }}
                      >
                        · {s.name}
                      </Link>
                    ))}
                  </div>
                )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToProducts}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-[#00BFFF] transition-colors animate-bounce"
        aria-label="Scroll to products"
      >
        <ChevronDown size={28} />
      </button>
    </section>
  );
}
