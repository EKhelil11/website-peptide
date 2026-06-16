// === ELITE LA PEPTIDES — Shipping & Delivery Section ===
// Two-column layout: Local Delivery (LA) vs Out-of-State Shipping
// Dark card style matching Midnight Clinic theme

import { useEffect, useRef } from "react";
import { MapPin, Truck, Clock, CheckCircle, Package, Zap } from "lucide-react";

const localFeatures = [
  { icon: Zap, text: "Same-day delivery available in Los Angeles" },
  { icon: Clock, text: "Order by 12PM for same-day dispatch" },
  { icon: MapPin, text: "Serving LA, Beverly Hills, Santa Monica, West Hollywood & surrounding areas" },
  { icon: CheckCircle, text: "Direct hand-delivery — cold-chain maintained" },
  { icon: Package, text: "Discreet, unmarked packaging on every order" },
];

const shippingFeatures = [
  { icon: Truck, text: "2-Day Priority shipping to all 50 states" },
  { icon: Clock, text: "Orders ship within 24 hours of confirmation" },
  { icon: Package, text: "Insulated cold-pack packaging for temperature-sensitive peptides" },
  { icon: CheckCircle, text: "Full tracking provided on every shipment" },
  { icon: Zap, text: "Overnight express available at checkout" },
];

export default function ShippingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    const items = sectionRef.current?.querySelectorAll(".animate-on-scroll");
    items?.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="shipping"
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
      style={{ background: "oklch(0.13 0.052 255)" }}
    >
      {/* Subtle top border glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, oklch(0.72 0.18 210 / 50%), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 animate-on-scroll">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-[#00BFFF]" />
            <span
              className="text-[#00BFFF] text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              Delivery Options
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
            FAST. DISCREET. RELIABLE.
          </h2>
          <p
            className="text-white/55 max-w-xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: 1.7 }}
          >
            Whether you're in Los Angeles or anywhere across the country, we get your peptides to you quickly and safely.
          </p>
        </div>

        {/* Two-column cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LOCAL DELIVERY */}
          <div
            className="animate-on-scroll rounded-lg overflow-hidden"
            style={{
              background: "oklch(0.17 0.055 255)",
              border: "1px solid oklch(0.6 0.27 0 / 30%)",
              boxShadow: "0 0 40px oklch(0.6 0.27 0 / 8%)",
            }}
          >
            {/* Card header */}
            <div
              className="px-8 py-6 flex items-center gap-4"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.6 0.27 0 / 15%) 0%, transparent 100%)",
                borderBottom: "1px solid oklch(0.6 0.27 0 / 20%)",
              }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: "oklch(0.6 0.27 0 / 15%)",
                  border: "1px solid oklch(0.6 0.27 0 / 40%)",
                }}
              >
                <MapPin size={22} style={{ color: "#FF2D78" }} />
              </div>
              <div>
                <div
                  className="text-xs tracking-[0.25em] uppercase mb-0.5"
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 700,
                    color: "#FF2D78",
                  }}
                >
                  Los Angeles
                </div>
                <h3
                  className="text-white"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.8rem",
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                  }}
                >
                  LOCAL DELIVERY
                </h3>
              </div>
              {/* Badge */}
              <div className="ml-auto">
                <span
                  className="px-3 py-1 rounded text-xs font-bold tracking-widest uppercase"
                  style={{
                    background: "oklch(0.6 0.27 0 / 20%)",
                    border: "1px solid oklch(0.6 0.27 0 / 50%)",
                    color: "#FF2D78",
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  Same Day
                </span>
              </div>
            </div>

            {/* Card body */}
            <div className="px-8 py-6">
              <p
                className="text-white/60 mb-6 leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.9rem" }}
              >
                LA Elite Peptides offers direct local delivery throughout the greater Los Angeles area. Your order is handled personally — ensuring cold-chain integrity and same-day arrival.
              </p>
              <ul className="space-y-3">
                {localFeatures.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.text} className="flex items-start gap-3">
                      <div
                        className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: "oklch(0.6 0.27 0 / 10%)",
                          border: "1px solid oklch(0.6 0.27 0 / 25%)",
                        }}
                      >
                        <Icon size={13} style={{ color: "#FF2D78" }} />
                      </div>
                      <span
                        className="text-white/70 text-sm leading-snug"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {item.text}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* CTA */}
              <div className="mt-8 pt-6" style={{ borderTop: "1px solid oklch(1 0 0 / 8%)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div
                      className="text-white/40 text-xs tracking-widest uppercase"
                      style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                    >
                      Delivery Fee
                    </div>
                    <div
                      className="text-white/70 text-sm mt-0.5"
                      style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                    >
                      Contact us for rates
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <a
                      href="tel:+13109290403"
                      className="btn-pink px-5 py-2.5 rounded text-xs flex items-center gap-2"
                      style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}
                    >
                      📞 (310) 929-0403
                    </a>
                    <button
                      onClick={() =>
                        document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="text-[#FF2D78]/60 hover:text-[#FF2D78] text-xs transition-colors"
                      style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}
                    >
                      Or message us →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OUT-OF-STATE SHIPPING */}
          <div
            className="animate-on-scroll rounded-lg overflow-hidden"
            style={{
              background: "oklch(0.17 0.055 255)",
              border: "1px solid oklch(0.72 0.18 210 / 30%)",
              boxShadow: "0 0 40px oklch(0.72 0.18 210 / 8%)",
            }}
          >
            {/* Card header */}
            <div
              className="px-8 py-6 flex items-center gap-4"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.18 210 / 12%) 0%, transparent 100%)",
                borderBottom: "1px solid oklch(0.72 0.18 210 / 20%)",
              }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: "oklch(0.72 0.18 210 / 12%)",
                  border: "1px solid oklch(0.72 0.18 210 / 35%)",
                }}
              >
                <Truck size={22} style={{ color: "#00BFFF" }} />
              </div>
              <div>
                <div
                  className="text-xs tracking-[0.25em] uppercase mb-0.5"
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 700,
                    color: "#00BFFF",
                  }}
                >
                  Nationwide
                </div>
                <h3
                  className="text-white"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.8rem",
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                  }}
                >
                  OUT-OF-STATE SHIPPING
                </h3>
              </div>
              {/* Badge */}
              <div className="ml-auto">
                <span
                  className="px-3 py-1 rounded text-xs font-bold tracking-widest uppercase"
                  style={{
                    background: "oklch(0.72 0.18 210 / 15%)",
                    border: "1px solid oklch(0.72 0.18 210 / 45%)",
                    color: "#00BFFF",
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  2-Day Priority
                </span>
              </div>
            </div>

            {/* Card body */}
            <div className="px-8 py-6">
              <p
                className="text-white/60 mb-6 leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.9rem" }}
              >
                We ship to all 50 states via insulated, temperature-controlled packaging. Every order is tracked end-to-end and dispatched within 24 hours of confirmation.
              </p>
              <ul className="space-y-3">
                {shippingFeatures.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.text} className="flex items-start gap-3">
                      <div
                        className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: "oklch(0.72 0.18 210 / 10%)",
                          border: "1px solid oklch(0.72 0.18 210 / 25%)",
                        }}
                      >
                        <Icon size={13} style={{ color: "#00BFFF" }} />
                      </div>
                      <span
                        className="text-white/70 text-sm leading-snug"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {item.text}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* CTA */}
              <div className="mt-8 pt-6" style={{ borderTop: "1px solid oklch(1 0 0 / 8%)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div
                      className="text-white/40 text-xs tracking-widest uppercase"
                      style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                    >
                      Shipping Rates
                    </div>
                    <div
                      className="text-white/70 text-sm mt-0.5"
                      style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                    >
                      Calculated at checkout
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="btn-primary px-5 py-2.5 rounded text-xs"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom reassurance bar */}
        <div
          className="mt-10 animate-on-scroll rounded-lg px-8 py-5 flex flex-wrap items-center justify-center gap-8"
          style={{
            background: "oklch(0.15 0.05 255)",
            border: "1px solid oklch(1 0 0 / 6%)",
          }}
        >
          {[
            { icon: Package, label: "Discreet Packaging", sub: "No branding on exterior" },
            { icon: Clock, label: "24hr Dispatch", sub: "Mon – Sat" },
            { icon: CheckCircle, label: "Full Tracking", sub: "Every order" },
            { icon: Truck, label: "All 50 States", sub: "Nationwide coverage" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3">
                <Icon size={18} style={{ color: "#00BFFF", flexShrink: 0 }} />
                <div>
                  <div
                    className="text-white text-sm font-semibold"
                    style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.03em" }}
                  >
                    {item.label}
                  </div>
                  <div
                    className="text-white/40 text-xs"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {item.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
