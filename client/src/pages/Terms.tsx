// === LA ELITE PEPTIDES — Terms of Sale ===
// Standalone /terms page — research-use-only terms of sale
// Dark navy theme matching site brand

import { Link } from "wouter";
import { ArrowLeft, AlertTriangle, FileText } from "lucide-react";
import { useEffect } from "react";

const LOGO_URL = "/manus-storage/elite-la-peptides-logo_e9ec855c.png";

const sections = [
  {
    id: "research-use",
    title: "1. Research Use Only",
    content: [
      "All products sold by LA Elite Peptides are strictly intended for in-vitro laboratory and scientific research purposes only. These compounds are not intended for use in humans or animals, and are not to be used as drugs, supplements, food additives, or for any other purpose outside of legitimate scientific research.",
      "By completing a purchase or inquiry through this website, the buyer expressly acknowledges and agrees that the compounds purchased will be used solely for in-vitro research and laboratory experimentation, and not for any therapeutic, diagnostic, or personal use.",
    ],
  },
  {
    id: "no-therapeutic-claims",
    title: "2. No Therapeutic or Medical Claims",
    content: [
      "LA Elite Peptides makes no representations, warranties, or claims — express or implied — that any product sold through this website is safe or effective for use in humans or animals, or that any product will diagnose, treat, cure, mitigate, or prevent any disease, condition, or health concern.",
      "All product descriptions, synopses, and research overviews provided on this website are for informational purposes only and are based on publicly available scientific literature. They do not constitute medical advice, clinical guidance, or endorsement of any therapeutic application.",
    ],
  },
  {
    id: "buyer-responsibility",
    title: "3. Buyer Responsibility and Eligibility",
    content: [
      "By placing an order, the buyer represents and warrants that: (a) they are purchasing the compounds solely for legitimate scientific research purposes; (b) they will use, handle, store, and dispose of the compounds in full compliance with all applicable federal, state, and local laws and regulations; (c) they understand the nature of research compounds and accept full responsibility for their proper and lawful use.",
      "LA Elite Peptides reserves the right to refuse any order at its sole discretion, including but not limited to orders where there is reason to believe the compounds may not be used for legitimate research purposes.",
    ],
  },
  {
    id: "compliance",
    title: "4. Regulatory Compliance",
    content: [
      "The compounds sold by LA Elite Peptides have not been evaluated or approved by the U.S. Food and Drug Administration (FDA) or any other regulatory authority for any therapeutic, diagnostic, or preventive use. These products are not classified as drugs, medical devices, or dietary supplements.",
      "It is the sole responsibility of the buyer to determine the legality of purchasing and using these compounds in their jurisdiction. LA Elite Peptides makes no representation that the products are legal for purchase or use in all jurisdictions.",
    ],
  },
  {
    id: "no-resale",
    title: "5. Prohibition on Resale for Human Use",
    content: [
      "The buyer agrees not to resell, redistribute, or transfer any product purchased from LA Elite Peptides for the purpose of human or animal consumption, therapeutic use, or any application outside of legitimate in-vitro scientific research.",
      "Any resale or redistribution of products purchased from LA Elite Peptides must be accompanied by clear disclosure that the products are for research use only and are not intended for human or animal consumption.",
    ],
  },
  {
    id: "limitation-of-liability",
    title: "6. Limitation of Liability",
    content: [
      "To the fullest extent permitted by applicable law, LA Elite Peptides shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from the purchase, handling, use, or misuse of any product sold through this website.",
      "The buyer assumes all risk associated with the purchase and use of research compounds. LA Elite Peptides' total liability for any claim arising from a purchase shall not exceed the purchase price of the product giving rise to the claim.",
    ],
  },
  {
    id: "indemnification",
    title: "7. Indemnification",
    content: [
      "The buyer agrees to indemnify, defend, and hold harmless LA Elite Peptides, its owners, employees, agents, and affiliates from and against any and all claims, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or related to: (a) the buyer's use or misuse of any product; (b) the buyer's violation of these Terms of Sale; or (c) the buyer's violation of any applicable law or regulation.",
    ],
  },
  {
    id: "changes",
    title: "8. Changes to Terms",
    content: [
      "LA Elite Peptides reserves the right to modify these Terms of Sale at any time without prior notice. The most current version of these terms will be posted on this page. Continued use of this website or placement of orders following any changes constitutes acceptance of the revised terms.",
    ],
  },
  {
    id: "contact",
    title: "9. Contact",
    content: [
      "For questions regarding these Terms of Sale, please contact us at LaElitePeptides@gmail.com or by phone at (310) 929-0403.",
    ],
  },
];

export default function Terms() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.09 0.05 255)" }}
    >
      {/* Top nav bar */}
      <div
        className="sticky top-0 z-50 border-b"
        style={{
          background: "oklch(0.1 0.05 255 / 95%)",
          borderColor: "oklch(1 0 0 / 8%)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <button className="flex items-center gap-2 text-white/60 hover:text-[#00BFFF] transition-colors text-sm"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, letterSpacing: "0.06em" }}
            >
              <ArrowLeft size={15} />
              BACK TO SITE
            </button>
          </Link>
          <img src={LOGO_URL} alt="LA Elite Peptides" className="h-8 w-auto" />
        </div>
      </div>

      {/* Hero band */}
      <div
        className="py-16 border-b"
        style={{
          background: "linear-gradient(135deg, oklch(0.12 0.06 255) 0%, oklch(0.1 0.04 255) 100%)",
          borderColor: "oklch(0.72 0.18 210 / 15%)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-[#00BFFF]" />
            <span
              className="text-[#00BFFF] text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              Legal
            </span>
          </div>
          <h1
            className="text-white mb-4"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}
          >
            TERMS OF SALE
          </h1>
          <p
            className="text-white/50 max-w-2xl"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: 1.7 }}
          >
            Please read these Terms of Sale carefully before placing an order. By purchasing any product from LA Elite Peptides, you agree to be bound by these terms.
          </p>
          <div className="mt-6 text-white/30 text-xs" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Last updated: June 2026
          </div>
        </div>
      </div>

      {/* Research-use-only banner */}
      <div
        className="border-b"
        style={{
          background: "oklch(0.14 0.04 10 / 0.4)",
          borderColor: "oklch(0.6 0.27 0 / 20%)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-start gap-4">
          <AlertTriangle size={20} className="text-[#FF2D78] flex-shrink-0 mt-0.5" />
          <div>
            <p
              className="text-[#FF2D78] text-xs tracking-widest uppercase mb-1"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              Research Use Only — Important Notice
            </p>
            <p
              className="text-white/60 text-sm leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
            >
              All products sold by LA Elite Peptides are strictly for in-vitro laboratory and scientific research purposes only. These compounds are not intended for human or animal consumption and have not been evaluated by the FDA for any therapeutic use.
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* Sidebar table of contents */}
          <aside className="hidden lg:block">
            <div
              className="sticky top-24 rounded-xl p-5 border"
              style={{
                background: "oklch(0.13 0.05 255)",
                borderColor: "oklch(1 0 0 / 8%)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <FileText size={14} style={{ color: "#00BFFF" }} />
                <span
                  className="text-[#00BFFF] text-xs tracking-widest uppercase"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
                >
                  Contents
                </span>
              </div>
              <nav className="space-y-2">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-white/40 hover:text-[#00BFFF] transition-colors text-xs leading-snug"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Sections */}
          <div className="lg:col-span-3 space-y-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2
                  className="text-white mb-4 pb-3 border-b"
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    letterSpacing: "0.05em",
                    borderColor: "oklch(0.72 0.18 210 / 15%)",
                  }}
                >
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.content.map((para, i) => (
                    <p
                      key={i}
                      className="text-white/60 leading-relaxed text-sm"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            {/* Bottom CTA */}
            <div
              className="rounded-xl p-6 border text-center"
              style={{
                background: "oklch(0.13 0.055 255)",
                borderColor: "oklch(0.72 0.18 210 / 20%)",
              }}
            >
              <p
                className="text-white/40 text-xs tracking-widest uppercase mb-3"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
              >
                Questions About These Terms?
              </p>
              <p
                className="text-white/50 text-sm mb-4"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                Contact us at{" "}
                <a
                  href="mailto:LaElitePeptides@gmail.com"
                  className="text-[#00BFFF] hover:underline"
                >
                  LaElitePeptides@gmail.com
                </a>
              </p>
              <Link href="/">
                <button
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded text-xs"
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    background: "oklch(0.72 0.18 210 / 12%)",
                    border: "1px solid oklch(0.72 0.18 210 / 30%)",
                    color: "#00BFFF",
                  }}
                >
                  <ArrowLeft size={13} />
                  Return to Site
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
