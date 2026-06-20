// === ELITE LA PEPTIDES — Hero Section ===
// Full-viewport hero with DNA banner, brand tagline, animated entrance
// Background: hero-banner.jpg (dark navy + cyan DNA helix)
// Text: White headline, cyan accent, hot pink "elite" script feel

import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663765469010/KeqNR4QdNviNNDWK3S7923/hero-new-v2-DfBwUaxsg7ZSRm6yZqwbRR.webp";

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
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Dark overlay so text stays readable — heavier on left where text lives */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, oklch(0.06 0.05 255 / 88%) 0%, oklch(0.08 0.05 255 / 65%) 45%, oklch(0.06 0.05 255 / 30%) 100%)",
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
          <div className="hero-item opacity-0 mb-4 flex items-center gap-3">
            <div className="h-px w-12 bg-[#00BFFF]" />
            <span
              className="text-[#00BFFF] text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              Premium Research Peptides
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className="hero-item opacity-0 text-white leading-none mb-2"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3.5rem, 9vw, 7rem)",
              letterSpacing: "0.03em",
              textShadow: "0 2px 40px rgba(0,0,0,0.5)",
            }}
          >
            YOUR EDGE,
          </h1>
          <h1
            className="hero-item opacity-0 leading-none mb-6"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3.5rem, 9vw, 7rem)",
              letterSpacing: "0.03em",
              color: "#00BFFF",
              textShadow: "0 0 40px rgba(0, 191, 255, 0.4)",
            }}
          >
            ENGINEERED.
          </h1>

          {/* Subheading */}
          <p
            className="hero-item opacity-0 text-white/75 mb-8 max-w-xl leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.1rem", fontWeight: 300 }}
          >
            Pharmaceutical-grade research peptides for qualified researchers and scientific study. From metabolic pathways to cellular regeneration — LA Elite Peptides supplies rigorously tested compounds for legitimate research purposes only.
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
          <div className="hero-item opacity-0 mt-16 flex flex-wrap gap-8">
            {[
              { value: "10", label: "Premium Peptides" },
              { value: "3", label: "Signature Stacks" },
              { value: "100%", label: "Research Grade" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  className="text-[#00BFFF]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem", lineHeight: 1 }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-white/50 text-xs tracking-widest uppercase mt-1"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                >
                  {stat.label}
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
