import { useEffect, useRef } from "react";
import { ArrowRight, CheckCircle, Package, Truck } from "lucide-react";

const shippingStandards = [
  {
    icon: Package,
    title: "Discreet Packaging",
    text: "Professional presentation with an unbranded exterior.",
  },
  {
    icon: CheckCircle,
    title: "Trackable Dispatch",
    text: "Tracking becomes available after the order ships.",
  },
];

export default function ShippingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    const items = sectionRef.current?.querySelectorAll(".animate-on-scroll");
    items?.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="shipping"
      ref={sectionRef}
      className="relative overflow-hidden py-24"
      style={{
        background:
          "linear-gradient(145deg, #F6F1E9 0%, #EFE4D2 52%, #E8D7BD 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute -left-32 top-16 h-80 w-80 rounded-full opacity-30 blur-3xl"
        style={{ background: "#D7E0ED" }}
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full opacity-35 blur-3xl"
        style={{ background: "#E4CFAE" }}
      />
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, #AEB7C4 28%, #2457A7 50%, #AEB7C4 72%, transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="animate-on-scroll mb-12 grid items-end gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-12 bg-[#2457A7]" />
              <span
                className="text-xs uppercase tracking-[0.32em] text-[#2457A7]"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
              >
                Nationwide Shipping
              </span>
            </div>
            <h2
              className="max-w-3xl text-[#10295E]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.8rem, 6vw, 5.2rem)",
                letterSpacing: "0.025em",
                lineHeight: 0.92,
              }}
            >
              RESEARCH SHIPPING,
              <span className="block text-[#2457A7]">REFINED.</span>
            </h2>
          </div>
          <p
            className="max-w-xl text-base leading-relaxed text-[#374151] lg:justify-self-end"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 450 }}
          >
            A composed fulfillment experience, presented with the same clarity and
            professionalism as our research catalog.
          </p>
        </div>

        <div
          className="animate-on-scroll overflow-hidden rounded-[2rem] border border-[#B9C0CA]/80 bg-[#FFFCF7]/95"
          style={{ boxShadow: "0 28px 80px rgba(16, 41, 94, 0.14)" }}
        >
          <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
            <div className="p-7 sm:p-10 lg:p-12">
              <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#2457A7]/20 bg-[#E7EEF8]"
                  style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)" }}
                >
                  <Truck size={30} className="text-[#2457A7]" strokeWidth={1.7} />
                </div>
                <div>
                  <div
                    className="mb-1 text-xs uppercase tracking-[0.28em] text-[#7C8796]"
                    style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
                  >
                    Coast-to-Coast Fulfillment
                  </div>
                  <h3
                    className="text-[#10295E]"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(2rem, 4vw, 3.2rem)",
                      lineHeight: 1,
                    }}
                  >
                    All 50 States. One Consistent Standard.
                  </h3>
                </div>
              </div>

              <div className="shipping-service-ledger relative space-y-3">
                <div
                  className="pointer-events-none absolute bottom-8 left-6 top-8 w-px"
                  style={{ background: "linear-gradient(to bottom, #2457A7, #AEB7C4 48%, transparent)" }}
                />
                {shippingStandards.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className={`shipping-service-step group relative grid grid-cols-[3.5rem_1fr] gap-4 rounded-2xl border px-4 py-5 transition-all duration-200 hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none sm:grid-cols-[4rem_1fr] sm:gap-5 sm:px-5 ${
                        index % 2 === 0
                          ? "border-[#CBD1DA]/90 bg-[#FFFCF7]/85"
                          : "border-[#B9C0CA]/75 bg-[#F1E5D2]/75 sm:ml-8"
                      }`}
                      style={{ boxShadow: "0 10px 28px rgba(16, 41, 94, 0.07)" }}
                    >
                      <div
                        className="shipping-service-medallion relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/35 text-white transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none sm:h-16 sm:w-16"
                        style={{
                          background: "linear-gradient(145deg, #2457A7, #10295E)",
                          boxShadow: "0 9px 22px rgba(36, 87, 167, 0.22), inset 0 1px 0 rgba(255,255,255,0.2)",
                        }}
                      >
                        <Icon size={20} strokeWidth={1.7} />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <div
                          className="shipping-service-badge mb-2.5 inline-flex items-center gap-2 rounded-full border border-[#AEB7C4]/70 bg-white/65 px-3 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                        >
                          <span
                            className="text-[0.58rem] uppercase tracking-[0.2em] text-[#66717F]"
                            style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}
                          >
                            Service
                          </span>
                          <span
                            className="text-[1rem] leading-none text-[#2457A7]"
                            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
                          >
                            0{index + 1}
                          </span>
                        </div>
                        <h4
                          className="shipping-service-title pr-2 text-[1.45rem] text-[#10295E] sm:text-[1.65rem]"
                          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650, letterSpacing: "0.015em", lineHeight: 1.02 }}
                        >
                          {item.title}
                        </h4>
                        <p
                          className="mt-2 max-w-md text-sm leading-relaxed text-[#4B5563]"
                          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 450 }}
                        >
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className="relative flex min-h-[290px] flex-col justify-between overflow-hidden border-t border-[#B9C0CA] p-8 lg:border-l lg:border-t-0 lg:p-10"
              style={{
                background:
                  "linear-gradient(155deg, #E7EEF8 0%, #F0E6D6 52%, #E8D6B8 100%)",
              }}
            >
              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full border border-[#2457A7]/15" />
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full border border-[#AEB7C4]/50" />
              <div className="relative z-10">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#2457A7]/20 bg-white/65 px-4 py-2 text-[#2457A7]">
                    <span className="text-[0.6rem] uppercase tracking-[0.2em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>
                      Standard
                    </span>
                    <span className="text-[1.05rem] leading-none" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
                      Delivery
                    </span>
                  </span>
                <div
                  className="mt-7 text-[#2457A7]"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(4.8rem, 9vw, 7.5rem)",
                    fontWeight: 600,
                    letterSpacing: "-0.06em",
                    lineHeight: 0.72,
                  }}
                >
                  3–5
                </div>
                <div
                  className="mt-5 text-sm uppercase tracking-[0.26em] text-[#10295E]"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
                >
                  Business Days
                </div>
              </div>

              <div className="relative z-10 mt-10 border-t border-[#AEB7C4]/70 pt-6">
                <div
                  className="text-xs uppercase tracking-[0.2em] text-[#7C8796]"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
                >
                  Shipping Rates
                </div>
                <div
                  className="mt-1 text-lg text-[#10295E]"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
                >
                  Calculated at checkout
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 border-t border-[#CBD1DA] bg-[#F1E5D2] px-7 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <p
              className="max-w-2xl text-sm leading-relaxed text-[#4B5563]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Fulfillment is reserved for qualified in-vitro laboratory research orders.
            </p>
            <button
              onClick={() => document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" })}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2457A7] px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(36,87,167,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#17468F]"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              Browse Research Catalog
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
