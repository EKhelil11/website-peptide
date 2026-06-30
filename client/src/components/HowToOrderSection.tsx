// === ELITE LA PEPTIDES — How to Order Section ===
// 3-step guide: Browse → Create Account → Order via Zelle
// Warm gold accents, clean layout, approachable for all customers

import { Search, UserPlus, CreditCard } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Browse Compounds",
    description:
      "Explore our full catalog of research-grade peptides and signature stacks. View detailed compound profiles, research applications, and specifications.",
    cta: "No account needed to browse",
  },
  {
    number: "02",
    icon: UserPlus,
    title: "Create Your Account",
    description:
      "Sign up with your email in seconds. Once registered, pricing is unlocked and you can add compounds to your cart instantly.",
    cta: "Free — takes under a minute",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Order via Zelle",
    description:
      "Place your order and complete payment via Zelle to (310) 975-9289. Orders confirmed same day. Nationwide shipping in 3–5 business days.",
    cta: "Fast · Secure · Nationwide",
  },
];

export default function HowToOrderSection() {
  return (
    <section
      id="how-to-order"
      className="relative py-24 overflow-hidden"
      style={{ background: "oklch(0.11 0.05 255)" }}
    >
      {/* Subtle gold glow top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, oklch(0.74 0.12 75 / 8%) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 animate-on-scroll">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-[#C9A84C]" />
            <span
              className="text-[#C9A84C] text-xs tracking-[0.35em] uppercase"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              Simple Process
            </span>
            <div className="h-px w-12 bg-[#C9A84C]" />
          </div>
          <h2
            className="text-white mb-4"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              letterSpacing: "0.04em",
            }}
          >
            HOW TO ORDER
          </h2>
          <p
            className="text-white/55 max-w-xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", fontWeight: 300 }}
          >
            Getting started with LA Elite Peptides is straightforward. Three steps and you're set.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line — desktop only */}
          <div
            className="hidden md:block absolute top-14 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, transparent, oklch(0.74 0.12 75 / 30%) 20%, oklch(0.74 0.12 75 / 30%) 80%, transparent)",
            }}
          />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="animate-on-scroll flex flex-col items-center text-center"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Step number + icon */}
                <div className="relative mb-6">
                  {/* Outer ring */}
                  <div
                    className="w-28 h-28 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.74 0.12 75 / 15%) 0%, oklch(0.72 0.18 210 / 10%) 100%)",
                      border: "1px solid oklch(0.74 0.12 75 / 35%)",
                      boxShadow: "0 0 30px oklch(0.74 0.12 75 / 12%)",
                    }}
                  >
                    <Icon size={36} style={{ color: "#C9A84C" }} strokeWidth={1.5} />
                  </div>
                  {/* Step number badge */}
                  <div
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: "oklch(0.74 0.12 75)",
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "1rem",
                      color: "oklch(0.12 0.05 255)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {step.number}
                  </div>
                </div>

                {/* Title */}
                <h3
                  className="text-white mb-3"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.6rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  className="text-white/60 leading-relaxed mb-4 max-w-xs"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 300 }}
                >
                  {step.description}
                </p>

                {/* CTA tag */}
                <span
                  className="text-[#C9A84C] text-xs tracking-widest uppercase"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
                >
                  {step.cta}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-on-scroll">
          <p
            className="text-white/40 text-sm mb-2"
            style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.1em" }}
          >
            QUESTIONS? REACH US DIRECTLY
          </p>
          <a
            href="sms:+13109759289"
            className="text-[#C9A84C] font-bold tracking-wide hover:text-[#C9A84C]/80 transition-colors"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.06em" }}
          >
            (310) 975-9289
          </a>
        </div>
      </div>
    </section>
  );
}
