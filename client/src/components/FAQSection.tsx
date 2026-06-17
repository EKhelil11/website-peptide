// === LA ELITE PEPTIDES — FAQ Section ===
// Research-use-only FAQ: ordering, shipping, storage, and compliance
// Dark navy theme with cyan/pink brand accents

import { useState } from "react";
import { ChevronDown, MessageCircle, Truck, ShieldCheck, FlaskConical } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
  category: "research" | "shipping" | "compliance";
}

const faqs: FAQItem[] = [
  // Research
  {
    category: "research",
    q: "What are research peptides?",
    a: "Research peptides are synthetic amino acid chains produced for use in scientific and laboratory research settings. They are used by qualified researchers to study biological processes, cellular signaling pathways, and molecular mechanisms. All peptides sold by LA Elite Peptides are strictly for in-vitro and laboratory research purposes only and are not intended for human or animal consumption.",
  },
  {
    category: "research",
    q: "What purity and quality standards do your peptides meet?",
    a: "All of our research peptides are manufactured to pharmaceutical-grade standards with a minimum purity of 98%+. Each batch undergoes rigorous quality control testing including HPLC (High-Performance Liquid Chromatography) and mass spectrometry analysis to verify identity, purity, and potency. Certificates of Analysis (CoA) are available upon request.",
  },
  {
    category: "research",
    q: "How should research peptides be stored?",
    a: "Lyophilized (freeze-dried) research peptides should be stored in a cool, dry environment away from direct light — ideally at 2–8°C (36–46°F) in a laboratory refrigerator. Once reconstituted with an appropriate solvent for research use, they should remain refrigerated and be used within the timeframe appropriate for your research protocol. Proper laboratory handling procedures should always be followed.",
  },
  {
    category: "research",
    q: "Are your peptides tested before shipping?",
    a: "Yes. Every product in our catalog is tested for purity and identity prior to fulfillment. We source only from verified, GMP-compliant manufacturers and maintain strict quality assurance protocols.",
  },
  // Shipping
  {
    category: "shipping",
    q: "Do you offer local delivery in Los Angeles?",
    a: "Yes. We offer same-day local delivery throughout the greater Los Angeles area for qualified researchers. Contact us via text at (310) 929-0403 or email at LaElitePeptides@gmail.com to place your research order. Local delivery orders placed before 2 PM are typically fulfilled the same day.",
  },
  {
    category: "shipping",
    q: "Do you ship research peptides to other states?",
    a: "Yes, we ship to all 50 states via 2-day priority shipping. All research orders are packaged in discreet, unmarked packaging. Orders are dispatched within 24 hours of confirmation and include full tracking information. Peptides are shipped with appropriate cold-pack insulation to maintain compound integrity during transit.",
  },
  {
    category: "shipping",
    q: "How do I place a research order?",
    a: "Research orders can be placed by texting or calling (310) 929-0403, or by emailing LaElitePeptides@gmail.com. Please include the product name(s), quantity required, and your delivery address. We will confirm your order and provide payment and fulfillment details promptly.",
  },
  {
    category: "shipping",
    q: "How is my research order packaged?",
    a: "All research orders are shipped in plain, discreet packaging with no external branding or product descriptions. Peptides are packed with cold insulation to preserve compound stability during transit. We prioritize both discretion and product integrity at every step of the fulfillment process.",
  },
  // Compliance
  {
    category: "compliance",
    q: "Are these peptides intended for human consumption?",
    a: "No. All peptides sold by LA Elite Peptides are strictly for laboratory and research purposes only. They are not intended for human or animal consumption, and they have not been evaluated or approved by the Food and Drug Administration (FDA) for any therapeutic use. By purchasing, you confirm that you are a qualified researcher and will use these compounds solely in a research context.",
  },
  {
    category: "compliance",
    q: "What is your research disclaimer policy?",
    a: "All products sold by LA Elite Peptides are intended for in-vitro research and laboratory use only. These products are not drugs, supplements, or medical devices. They are not intended to diagnose, treat, cure, or prevent any disease or condition. These statements have not been evaluated by the FDA. Purchasers assume full responsibility for compliance with all applicable local, state, and federal laws and regulations.",
  },
  {
    category: "compliance",
    q: "Who is authorized to purchase research peptides?",
    a: "Our research peptides are sold exclusively to qualified researchers, licensed laboratories, academic institutions, and other entities engaged in legitimate scientific research. By completing a purchase, the buyer confirms they are of legal age, are a qualified researcher, and will use the compounds strictly for lawful research purposes in compliance with all applicable regulations.",
  },
  {
    category: "compliance",
    q: "Do you comply with applicable laws and regulations?",
    a: "Yes. LA Elite Peptides operates in full compliance with applicable federal and state laws governing the sale of research compounds. We do not sell to individuals who intend to use these compounds for personal consumption, and we reserve the right to refuse any order that we believe may not be for legitimate research purposes.",
  },
];

const categories = [
  { key: "all", label: "All Questions", icon: MessageCircle },
  { key: "research", label: "Research & Quality", icon: FlaskConical },
  { key: "shipping", label: "Shipping & Orders", icon: Truck },
  { key: "compliance", label: "Compliance & Legal", icon: ShieldCheck },
];

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = faqs.filter(
    (f) => activeCategory === "all" || f.category === activeCategory
  );

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      id="faq"
      className="relative py-24"
      style={{ background: "oklch(0.09 0.04 255)" }}
    >
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.8 0.1 220) 1px, transparent 1px), linear-gradient(90deg, oklch(0.8 0.1 220) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-[#FF2D78]" />
            <span
              className="text-[#FF2D78] text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              Research Inquiries
            </span>
            <div className="h-px w-12 bg-[#FF2D78]" />
          </div>
          <h2
            className="text-white mb-4"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              letterSpacing: "0.04em",
            }}
          >
            FREQUENTLY ASKED
          </h2>
          <p
            className="text-white/50 max-w-xl mx-auto text-sm"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: 1.7 }}
          >
            Common questions about our research peptides, ordering process, quality standards, and compliance policies.
          </p>
        </div>

        {/* Research-use banner */}
        <div
          className="mb-10 rounded-xl px-6 py-4 flex items-center gap-4"
          style={{
            background: "oklch(0.14 0.06 255 / 0.6)",
            border: "1px solid rgba(0,191,255,0.2)",
          }}
        >
          <FlaskConical size={20} className="text-[#00BFFF] flex-shrink-0" />
          <p
            className="text-white/70 text-xs leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            <span className="text-[#00BFFF] font-semibold">Research Use Only.</span>{" "}
            All products sold by LA Elite Peptides are strictly for in-vitro laboratory and scientific research purposes. Not for human or animal consumption. Not evaluated by the FDA.
          </p>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setActiveCategory(key); setOpenIndex(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-wider uppercase transition-all duration-200 ${
                activeCategory === key
                  ? "bg-[#FF2D78] text-white font-bold shadow-[0_0_20px_rgba(255,45,120,0.3)]"
                  : "border border-white/15 text-white/50 hover:border-[#FF2D78]/40 hover:text-[#FF2D78]"
              }`}
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {filtered.map((item, i) => {
            const isOpen = openIndex === i;
            const categoryColor =
              item.category === "shipping"
                ? "#00BFFF"
                : item.category === "compliance"
                ? "#FF2D78"
                : "#a78bfa";

            return (
              <div
                key={i}
                className="rounded-xl overflow-hidden transition-all duration-200"
                style={{
                  background: isOpen
                    ? "oklch(0.14 0.055 255 / 0.9)"
                    : "oklch(0.13 0.05 255 / 0.6)",
                  border: isOpen
                    ? `1px solid ${categoryColor}40`
                    : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: isOpen ? `0 0 20px ${categoryColor}15` : "none",
                }}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: categoryColor, marginTop: "7px" }}
                    />
                    <span
                      className="text-white text-sm leading-snug group-hover:text-white/90 transition-colors"
                      style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "1rem" }}
                    >
                      {item.q}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className="flex-shrink-0 transition-transform duration-300"
                    style={{
                      color: categoryColor,
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                {isOpen && (
                  <div
                    className="px-6 pb-5"
                    style={{ borderTop: `1px solid ${categoryColor}20` }}
                  >
                    <p
                      className="text-white/60 text-sm leading-relaxed pt-4"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: 1.75 }}
                    >
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
}
