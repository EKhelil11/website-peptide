// === LA ELITE PEPTIDES — FAQ Section ===
// Research-use-only FAQ: catalog documentation, ordering, and shipping.

import { useState } from "react";
import { ChevronDown, MessageCircle, Truck, FlaskConical } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
  category: "research" | "shipping";
}

const faqs: FAQItem[] = [
  // Research
  {
    category: "research",
    q: "What are research peptides?",
    a: "Research peptides are synthetic amino acid chains produced for use in scientific and laboratory research settings. They are used by qualified researchers to study biological processes, cellular signaling pathways, and molecular mechanisms. All peptides sold by LA Elite Peptides are strictly for in-vitro and laboratory research purposes only.",
  },
  {
    category: "research",
    q: "Where can I find product testing documents?",
    a: "Each product page includes a product-specific Certificate of Analysis (COA) status link. A report is shown only after an authentic document has been received and matched to that catalog item; until then, the page clearly states that no verified file is available.",
  },
  {
    category: "research",
    q: "How should research peptides be stored?",
    a: "Lyophilized (freeze-dried) research peptides should be stored in a cool, dry environment away from direct light — ideally at 2–8°C (36–46°F) in a laboratory refrigerator. Proper laboratory handling procedures should always be followed.",
  },
  {
    category: "research",
    q: "How will I know when a COA is available?",
    a: "Open the COA status link on the relevant product page. The status remains pending until a verified document has been matched to that catalog item; no laboratory, lot, date, purity, identity, or analytical result is represented before then.",
  },
  // Shipping
  {
    category: "shipping",
    q: "How long does shipping take?",
    a: "All orders ship nationwide to all 50 states. Delivery typically takes 3–5 business days from the date of dispatch. Orders are processed and shipped within 24 hours of confirmation. You will receive full tracking information once your order has been dispatched. All shipments are packaged in discreet, unmarked packaging with cold-pack insulation to maintain compound integrity during transit.",
  },
  {
    category: "shipping",
    q: "How do I place an order?",
    a: "Orders can be placed by texting or calling (310) 975-9289, or by emailing support@laelitepeps.com. Please include the product name(s), quantity required, and your delivery address. We will confirm your order and provide payment and fulfillment details promptly.",
  },
  {
    category: "shipping",
    q: "How is my order packaged?",
    a: "All orders are shipped in plain, discreet packaging with no external branding or product descriptions. Peptides are packed with cold insulation to preserve compound stability during transit. We prioritize both discretion and product integrity at every step of the fulfillment process.",
  },
];

const categories = [
  { key: "all", label: "All Questions", icon: MessageCircle },
  { key: "research", label: "Research & Documents", icon: FlaskConical },
  { key: "shipping", label: "Shipping & Orders", icon: Truck },
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
      style={{ background: "oklch(0.15 0.045 255)" }}
    >
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.91 0.025 80) 1px, transparent 1px), linear-gradient(90deg, oklch(0.91 0.025 80) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#B9C0CA]" />
            <span
              className="text-[#D9C9B4] text-[0.68rem] tracking-[0.32em] uppercase"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}
            >
              Got Questions?
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#B9C0CA]" />
          </div>
          <h2
            className="text-white mb-5"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.8rem, 7vw, 5rem)",
              fontWeight: 600,
              letterSpacing: "0.025em",
              lineHeight: 0.9,
            }}
          >
            FREQUENTLY
            <span className="block italic text-[#B9C0CA]">ASKED.</span>
          </h2>
          <p
            className="text-white/65 max-w-xl mx-auto text-sm sm:text-[0.95rem]"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: 1.75 }}
          >
            Common questions about our research catalog, document status, ordering process, and shipping.
          </p>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-10 sm:mb-12">
          {categories.map(({ key, label, icon: Icon }, categoryIndex) => (
            <button
              key={key}
              onClick={() => { setActiveCategory(key); setOpenIndex(null); }}
              className={`faq-category-badge group flex min-h-12 items-center gap-2.5 rounded-2xl border px-3 py-2.5 pr-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E9DCCB]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07152F] motion-reduce:transition-none ${
                activeCategory === key
                  ? "border-[#D9C9B4]/80 bg-gradient-to-br from-[#FFFDF8] to-[#E9DCCB] text-[#10295E] shadow-[0_12px_30px_rgba(0,0,0,0.22)]"
                  : "border-white/14 bg-white/[0.035] text-white/68 hover:-translate-y-0.5 hover:border-[#B9C0CA]/55 hover:bg-white/[0.07] hover:text-white motion-reduce:transform-none"
              }`}
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-xl border ${activeCategory === key ? "border-[#AEB7C4]/70 bg-[#10295E] text-white" : "border-white/12 bg-white/[0.05] text-[#D9C9B4]"}`}>
                <Icon size={14} strokeWidth={1.7} />
              </span>
              <span className="text-left">
                <span
                  className={`block text-[0.54rem] uppercase tracking-[0.2em] ${activeCategory === key ? "text-[#657080]" : "text-white/42"}`}
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}
                >
                  0{categoryIndex + 1}
                </span>
                <span
                  className="block text-[0.98rem] leading-none"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650, letterSpacing: "0.015em" }}
                >
                  {label}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {filtered.map((item, i) => {
            const isOpen = openIndex === i;
            const categoryColor =
              item.category === "shipping" ? "#B9C0CA" : "#E9DCCB";

            return (
              <div
                key={i}
                className="faq-question-card overflow-hidden rounded-2xl transition-all duration-200 motion-reduce:transition-none"
                style={{
                  background: isOpen
                    ? "linear-gradient(145deg, rgba(20,48,98,0.96), rgba(7,21,47,0.96))"
                    : "rgba(255,255,255,0.035)",
                  border: isOpen
                    ? `1px solid ${categoryColor}70`
                    : "1px solid rgba(185,192,202,0.14)",
                  boxShadow: isOpen ? `0 18px 45px rgba(0,0,0,0.2), inset 0 1px 0 ${categoryColor}18` : "inset 0 1px 0 rgba(255,255,255,0.025)",
                }}
              >
                <button
                  onClick={() => toggle(i)}
                  className="group flex min-h-[5.25rem] w-full items-center justify-between gap-4 px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E9DCCB]/70 sm:px-6 sm:py-5"
                  aria-expanded={isOpen}
                >
                  <div className="flex min-w-0 items-center gap-3.5 sm:gap-4">
                    <span
                      className="faq-question-number flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-[1.2rem] leading-none sm:h-12 sm:w-12 sm:text-[1.35rem]"
                      style={{ borderColor: `${categoryColor}55`, background: `${categoryColor}0F`, color: categoryColor, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span
                        className="mb-1 block text-[0.56rem] uppercase tracking-[0.22em] text-white/42"
                        style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}
                      >
                        {item.category === "shipping" ? "Shipping & Orders" : "Research & Documents"}
                      </span>
                      <span
                        className="block text-[1.1rem] leading-[1.08] text-white transition-colors group-hover:text-[#F6F1E9] sm:text-[1.25rem]"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650, letterSpacing: "0.01em" }}
                      >
                        {item.q}
                      </span>
                    </span>
                  </div>
                  <span className="faq-chevron-medallion flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <ChevronDown
                      size={17}
                      className="transition-transform duration-300 motion-reduce:transition-none"
                      style={{
                        color: categoryColor,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </span>
                </button>

                {isOpen && (
                  <div
                    className="px-4 pb-6 sm:px-6 sm:pl-[6.85rem]"
                    style={{ borderTop: `1px solid ${categoryColor}20` }}
                  >
                    <p
                      className="pt-5 text-sm text-white/72 sm:text-[0.94rem]"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: 1.8 }}
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
