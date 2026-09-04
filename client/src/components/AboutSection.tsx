// === ELITE LA PEPTIDES — About & Science Section ===
// Split heritage-luxury layout: research context left, laboratory image right.

import { useEffect, useRef } from "react";
import { FlaskConical, Shield, Zap, Award } from "lucide-react";
import PurityBadgeHeading from "@/components/PurityBadgeHeading";

const LAB_IMG = "/manus-storage/la-elite-who-we-are-lab_b1963ab1-optimized_acd7650b.webp";

const pillars = [
  {
    icon: FlaskConical,
    title: "Product Documentation",
    desc: "Each catalog page presents the compound format, research context, and current Certificate of Analysis status in one place.",
  },
  {
    icon: Shield,
    title: "Research Context",
    desc: "Product descriptions summarize the scientific pathways and research areas associated with each listed compound.",
  },
  {
    icon: Zap,
    title: "Clearly Listed Formats",
    desc: "Compound names, vial contents, category, pricing, and research-use restrictions are presented consistently throughout the catalog.",
  },
  {
    icon: Award,
    title: "Los Angeles Support",
    desc: "Our support team assists qualified researchers with product information, ordering questions, and account or shipment status.",
  },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

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
  }, []);

  return (
    <>
      {/* About Section */}
      <section
        id="about"
        ref={sectionRef}
        className="py-24 relative overflow-hidden"
        style={{ background: "oklch(0.25 0.08 255)" }}
      >
        {/* Decorative brushed-silver line. */}
        <div
          className="absolute left-0 top-0 w-1 h-full"
          style={{ background: "linear-gradient(to bottom, transparent, oklch(0.76 0.02 250), transparent)" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <div className="flex items-center gap-3 mb-4 animate-on-scroll">
                <div className="h-px w-12 bg-[#B9C0CA]" />
                <span
                  className="text-[#B9C0CA] text-xs tracking-[0.3em] uppercase"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
                >
                  Who We Are
                </span>
              </div>

              <h2
                className="text-white mb-6 animate-on-scroll"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  letterSpacing: "0.04em",
                  lineHeight: 1.05,
                }}
              >
                LOS ANGELES ROOTS.
                <br />
                <span style={{ color: "#B9C0CA" }}>RESEARCH FOCUSED.</span>
                <br />
                CLEARLY DOCUMENTED.
              </h2>

              <div className="who-we-are-copy mb-8 space-y-5 border-l border-[#B9C0CA]/45 pl-4 sm:pl-5 animate-on-scroll">
                <p
                  className="text-[#F7F2EA]/88 leading-[1.82] tracking-[0.005em]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 450,
                    fontSize: "clamp(1.02rem, 1.2vw, 1.1rem)",
                    textShadow: "0 1px 16px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  LA Elite Peptides provides a focused online catalog for qualified researchers seeking clearly presented compound information and a direct ordering workflow. <span className="font-semibold text-white">We are not a supplement company, and every product is offered strictly for in-vitro laboratory research use only.</span>
                </p>

                <p
                  className="text-[#E8EDF4]/82 leading-[1.82] tracking-[0.005em]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 425,
                    fontSize: "clamp(1rem, 1.15vw, 1.075rem)",
                    textShadow: "0 1px 16px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  Based in Los Angeles, our catalog spans metabolic pathway research, cellular biology, longevity studies, signaling research, and related laboratory applications. Product pages identify vial contents, research context, and whether a verified Certificate of Analysis has been posted.
                </p>
              </div>

            </div>

            {/* Image */}
            <div className="relative animate-on-scroll">
              <div
                className="rounded-lg overflow-hidden group"
                style={{
                  boxShadow: "0 20px 80px oklch(0.76 0.02 250 / 15%), 0 0 0 1px oklch(0.76 0.02 250 / 15%)",
                }}
              >
                <img
                  src={LAB_IMG}
                  alt="LA Elite Peptides laboratory team conducting analytical research"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-80 lg:h-[420px] object-cover object-center transition-transform duration-700"
                  style={{
                    objectPosition: "center 46%",
                    transform: "scale(1)",
                    transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                />
              </div>
              {/* Floating accent card */}
              <div
                className="absolute -bottom-8 left-4 sm:-left-6 w-[min(17rem,calc(100%-2rem))] p-4 sm:p-5 rounded-xl"
                style={{
                  background: "linear-gradient(145deg, oklch(0.18 0.055 255 / 96%), oklch(0.25 0.08 255 / 94%))",
                  border: "1px solid oklch(0.76 0.02 250 / 38%)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 18px 45px rgba(3, 17, 45, 0.34)",
                }}
              >
                <div className="flex items-end gap-2.5">
                  <div
                    className="text-[#F6F1E9]"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 2.75rem)", lineHeight: 1 }}
                  >
                    &gt;99%
                  </div>
                  <PurityBadgeHeading className="pb-0.5 leading-none" />
                </div>
                <div
                  className="mt-2.5 border-t border-white/14 pt-2.5 text-[0.72rem] leading-relaxed text-white/72"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 450 }}
                >
                  Product- and lot-specific results. See each posted Certificate of Analysis.
                </div>
              </div>
            </div>
          </div>

          <div className="brand-proof-page-margin mt-14 flex w-full justify-end sm:mt-16 animate-on-scroll">
            <div className="brand-proof-line flex w-fit max-w-full items-center justify-start gap-3 rounded-full border border-[#B9C0CA]/30 bg-white/[0.06] px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_28px_rgba(0,0,0,0.24)]">
              <div className="h-px w-7 shrink-0 bg-gradient-to-r from-[#B9C0CA]/35 to-[#E9DCCB]" />
              <span
                className="whitespace-nowrap text-lg italic tracking-[0.06em] text-[#F7F2EA] sm:text-xl"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 650,
                  textShadow: "0 2px 14px rgba(0, 0, 0, 0.75)",
                }}
              >
                Trusted. Tested.
              </span>
              <div className="h-px w-7 shrink-0 bg-gradient-to-l from-[#B9C0CA]/35 to-[#E9DCCB]" />
            </div>
          </div>
        </div>
      </section>

      {/* Science / Pillars Section */}
      <section
        id="science"
        className="relative overflow-hidden py-20 sm:py-24"
        style={{ background: "linear-gradient(145deg, #F7F2EA 0%, #EFE4D3 52%, #E8D7BD 100%)" }}
      >
        <div
          className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full opacity-35 blur-3xl"
          style={{ background: "#D7E0ED" }}
        />
        <div
          className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full opacity-40 blur-3xl"
          style={{ background: "#E2CAA7" }}
        />
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, #AEB7C4 28%, #2457A7 50%, #AEB7C4 72%, transparent)" }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll mb-10 grid items-end gap-7 sm:mb-14 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-12 bg-[#2457A7]" />
                <span
                  className="text-xs uppercase tracking-[0.3em] text-[#2457A7]"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
                >
                  Our Standards
                </span>
              </div>
              <h2
                className="max-w-2xl text-[#10295E]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.7rem, 6vw, 4.8rem)",
                  letterSpacing: "0.025em",
                  lineHeight: 0.94,
                }}
              >
                THE ELITE
                <span className="block text-[#2457A7]">DIFFERENCE.</span>
              </h2>
            </div>
            <div className="lg:justify-self-end">
              <div className="standards-collection-badge mb-4 inline-flex items-center gap-3 rounded-2xl border border-[#AEB7C4]/80 bg-white/65 px-3 py-2.5 pr-5 shadow-[0_10px_28px_rgba(16,41,94,0.09)]">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/60 bg-gradient-to-br from-[#2C64BA] to-[#10295E] text-[1.15rem] leading-none text-white shadow-[0_8px_18px_rgba(36,87,167,0.24)]"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
                  aria-hidden="true"
                >
                  IV
                </span>
                <span>
                  <span
                    className="block text-[0.6rem] uppercase tracking-[0.24em] text-[#6B7480]"
                    style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}
                  >
                    Four-point standard
                  </span>
                  <span
                    className="block text-[1.05rem] leading-tight text-[#10295E]"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650, letterSpacing: "0.02em" }}
                  >
                    Clear from catalog to support
                  </span>
                </span>
              </div>
              <p
                className="max-w-xl text-base leading-relaxed text-[#374151]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 450 }}
              >
                Four practical standards keep compound information, documentation, catalog
                formats, and research support clear at every step.
              </p>
            </div>
          </div>

          <div className="standards-editorial-grid grid gap-4 sm:grid-cols-2 sm:gap-5">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <article
                  key={pillar.title}
                  className="standards-feature-card group animate-on-scroll relative overflow-hidden rounded-[1.6rem] border border-[#B9C0CA]/80 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#2457A7]/45 motion-reduce:transform-none motion-reduce:transition-none sm:p-7 lg:p-8"
                  style={{
                    animationDelay: `${i * 80}ms`,
                    background: i === 1 || i === 2
                      ? "linear-gradient(145deg, rgba(241,229,210,0.98), rgba(255,252,247,0.9))"
                      : "linear-gradient(145deg, rgba(255,252,247,0.98), rgba(235,239,245,0.9))",
                    boxShadow: "0 16px 42px rgba(16, 41, 94, 0.1), inset 0 1px 0 rgba(255,255,255,0.95)",
                  }}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-[3px]"
                    style={{ background: "linear-gradient(to right, #AEB7C4, #2457A7 52%, #D8DDE5)" }}
                  />
                  <span
                    className="absolute right-5 top-4 text-[2.8rem] leading-none text-[#10295E]/[0.07] sm:right-6 sm:top-5"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>

                  <div className="relative flex items-start gap-5">
                    <div
                      className="standards-icon-medallion flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/35 text-white transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none sm:h-16 sm:w-16"
                      style={{
                        background: "linear-gradient(145deg, #2C64BA, #10295E)",
                        boxShadow: "0 12px 28px rgba(36, 87, 167, 0.24), inset 0 1px 0 rgba(255,255,255,0.26)",
                      }}
                    >
                      <Icon size={25} strokeWidth={1.55} />
                    </div>
                    <div className="min-w-0 pt-1">
                      <div
                        className="standards-feature-badge mb-2.5 inline-flex items-center gap-2 rounded-full border border-[#AEB7C4]/70 bg-white/65 px-3 py-1 text-[#66717F] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                      >
                        <span
                          className="text-[0.58rem] uppercase tracking-[0.2em]"
                          style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}
                        >
                          Standard
                        </span>
                        <span
                          className="text-[1rem] leading-none text-[#2457A7]"
                          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
                        >
                          0{i + 1}
                        </span>
                      </div>
                      <h3
                        className="pr-7 text-[1.45rem] text-[#10295E] sm:text-[1.6rem]"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650, letterSpacing: "0.015em", lineHeight: 1.02 }}
                      >
                        {pillar.title}
                      </h3>
                    </div>
                  </div>
                  <p
                    className="relative mt-5 border-t border-[#B9C0CA]/65 pt-5 text-sm leading-relaxed text-[#4B5563]"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 450 }}
                  >
                    {pillar.desc}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
