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
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-[#174A9B]" />
            <span
              className="text-[#174A9B] text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              Got Questions?
            </span>
            <div className="h-px w-12 bg-[#174A9B]" />
          </div>
          <h2
            className="text-white mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
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
            Common questions about our research catalog, document status, ordering process, and shipping.
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
                  ? "bg-[#174A9B] text-white font-bold shadow-[0_0_20px_rgba(167,122,44,0.3)]"
                  : "border border-white/15 text-white/50 hover:border-[#174A9B]/40 hover:text-[#174A9B]"
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
              item.category === "shipping" ? "#B9C0CA" : "#E9DCCB";

            return (
              <div
                key={i}
                className="rounded-xl overflow-hidden transition-all duration-200"
                style={{
                  background: isOpen
                    ? "rgba(16,41,94,0.92)"
                    : "rgba(7,21,47,0.72)",
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
