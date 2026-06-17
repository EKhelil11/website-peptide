// === LA ELITE PEPTIDES — FAQ Section ===
// Accordion-style FAQ covering peptide usage, shipping, and safety
// Dark navy theme with cyan/pink brand accents

import { useState } from "react";
import { ChevronDown, MessageCircle, Truck, ShieldCheck } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
  category: "usage" | "shipping" | "safety";
}

const faqs: FAQItem[] = [
  // Usage
  {
    category: "usage",
    q: "What are peptides and how do they work?",
    a: "Peptides are short chains of amino acids — the same building blocks that make up proteins in your body. They act as biological messengers, signaling your cells to perform specific functions like burning fat, repairing tissue, boosting growth hormone, or improving cognitive function. Because they mimic naturally occurring compounds, they tend to work with your body's own systems rather than overriding them.",
  },
  {
    category: "usage",
    q: "How do I administer peptides?",
    a: "Most peptides are administered via subcutaneous (under the skin) injection using a small insulin syringe. The most common sites are the abdomen, thigh, or upper arm. Each product page includes specific dosing guidance. We strongly recommend consulting a licensed healthcare professional before beginning any peptide protocol.",
  },
  {
    category: "usage",
    q: "How should I store my peptides?",
    a: "Lyophilized (freeze-dried) peptides should be stored in a cool, dry place away from direct light — ideally in the refrigerator (2–8°C / 36–46°F). Once reconstituted with bacteriostatic water, keep refrigerated and use within 30 days. Never freeze reconstituted peptides, and always handle vials with clean hands or gloves.",
  },
  {
    category: "usage",
    q: "Can I stack multiple peptides together?",
    a: "Yes — many of our products are designed to work synergistically. Our Wolverine Stack (BPC-157 + TB-500) and Glow Stack (GHK-CU + BPC-157 + TB-500) are pre-curated combinations for maximum recovery and skin health. When stacking independently, we recommend starting one peptide at a time to assess your individual response before combining.",
  },
  {
    category: "usage",
    q: "How long before I see results?",
    a: "Results vary by peptide and individual. Some compounds like Semax and MOTS-C can produce noticeable effects within days. Others, like GHK-CU for skin or CJC-1295 for growth hormone support, typically show meaningful results after 4–8 weeks of consistent use. Retatrutide for weight management generally shows significant progress within a 6–7 week cycle.",
  },
  // Shipping
  {
    category: "shipping",
    q: "Do you offer local delivery in Los Angeles?",
    a: "Yes! We offer same-day local delivery throughout the greater Los Angeles area. Simply contact us via text at (310) 929-0403 or email at LaElitePeptides@gmail.com to place your order. Local delivery orders placed before 2 PM are typically delivered the same day.",
  },
  {
    category: "shipping",
    q: "Do you ship to other states?",
    a: "Absolutely. We ship to all 50 states via 2-day priority shipping. All orders are packaged in discreet, unmarked packaging with no indication of contents on the outside. Orders are dispatched within 24 hours of confirmation and include full tracking information sent directly to you.",
  },
  {
    category: "shipping",
    q: "How is my order packaged?",
    a: "All orders are shipped in discreet, plain packaging with no branding or product descriptions visible on the exterior. Peptides are packed with appropriate cold-pack insulation to maintain integrity during transit. We take privacy and product quality seriously at every step of the delivery process.",
  },
  {
    category: "shipping",
    q: "How do I place an order?",
    a: "You can place an order by texting or calling us at (310) 929-0403, or by emailing LaElitePeptides@gmail.com. Include the product name(s), quantity, and your delivery address. We'll confirm your order and provide payment and delivery details promptly.",
  },
  // Safety
  {
    category: "safety",
    q: "Are these products safe?",
    a: "Our peptides are manufactured to pharmaceutical-grade standards with rigorous quality control. However, all peptides on this site are intended for research purposes only and are not approved by the FDA for human consumption. We strongly recommend consulting a licensed healthcare professional before beginning any peptide protocol, especially if you have pre-existing medical conditions or are taking medications.",
  },
  {
    category: "safety",
    q: "Are there any side effects?",
    a: "Side effects vary by compound and individual. Common mild effects can include temporary injection site redness, water retention, or fatigue as your body adjusts. More specific effects depend on the peptide — for example, GLP-1 class peptides like Retatrutide may cause nausea initially. We recommend starting at the lower end of the suggested dose range and monitoring your response carefully.",
  },
  {
    category: "safety",
    q: "Who should NOT use peptides?",
    a: "Peptides are not recommended for pregnant or breastfeeding individuals, those under 18, or people with active cancer diagnoses (as some peptides can stimulate cell growth). Individuals with hormone-sensitive conditions should consult their doctor before use. Always disclose peptide use to your healthcare provider.",
  },
  {
    category: "safety",
    q: "What is your disclaimer policy?",
    a: "All products sold by LA Elite Peptides are intended strictly for research purposes only. They are not intended to diagnose, treat, cure, or prevent any disease. These statements have not been evaluated by the Food and Drug Administration. By purchasing, you confirm you are a qualified researcher and agree to use these products in compliance with all applicable laws and regulations.",
  },
];

const categories = [
  { key: "all", label: "All Questions", icon: MessageCircle },
  { key: "usage", label: "Usage & Dosing", icon: MessageCircle },
  { key: "shipping", label: "Shipping & Delivery", icon: Truck },
  { key: "safety", label: "Safety & Disclaimers", icon: ShieldCheck },
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
              Got Questions?
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
            Everything you need to know about our peptides, ordering process, and safety guidelines.
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
                : item.category === "safety"
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
                      className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
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
                    style={{
                      borderTop: `1px solid ${categoryColor}20`,
                    }}
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

        {/* Bottom CTA */}
        <div
          className="mt-14 text-center rounded-2xl px-8 py-10"
          style={{
            background: "linear-gradient(135deg, oklch(0.14 0.06 255 / 0.8), oklch(0.12 0.04 255 / 0.8))",
            border: "1px solid rgba(0,191,255,0.15)",
          }}
        >
          <p
            className="text-white/80 mb-2"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: "0.05em" }}
          >
            Still Have Questions?
          </p>
          <p
            className="text-white/40 text-sm mb-6"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            Our team is available to answer any questions about products, dosing, or ordering.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="sms:+13109290403"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded text-sm font-bold tracking-widest uppercase transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{
                background: "#FF2D78",
                color: "white",
                fontFamily: "'Rajdhani', sans-serif",
              }}
            >
              Text Us: (310) 929-0403
            </a>
            <a
              href="mailto:LaElitePeptides@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded text-sm font-bold tracking-widest uppercase transition-all duration-200 hover:border-[#00BFFF]/60 hover:text-[#00BFFF]"
              style={{
                border: "1px solid rgba(0,191,255,0.3)",
                color: "rgba(255,255,255,0.7)",
                fontFamily: "'Rajdhani', sans-serif",
              }}
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
