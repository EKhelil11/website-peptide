// === LA ELITE PEPTIDES — Shipping & Returns Page ===
// Standalone legal page at /shipping-returns
// Legal entity: LA Elite Sales LLC (operating as LA Elite Peptides)

import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { PRIMARY_LOGO_ALT, PRIMARY_LOGO_URL, UTILITY_LOGO_SIZE_CLASS } from "@/lib/brandAssets";

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.15 0.045 255)" }}>
      {/* Top nav */}
      <header
        className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between"
        style={{
          background: "oklch(0.15 0.045 255 / 95%)",
          borderBottom: "1px solid oklch(1 0 0 / 8%)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Link href="/">
          <img src={PRIMARY_LOGO_URL} alt={PRIMARY_LOGO_ALT} className={`${UTILITY_LOGO_SIZE_CLASS} cursor-pointer`} />
        </Link>
        <Link href="/">
          <button
            className="flex items-center gap-2 text-white/50 hover:text-[#B9C0CA] transition-colors text-sm"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <ArrowLeft size={14} />
            Back to Site
          </button>
        </Link>
      </header>

      {/* Page content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Page header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-[#B9C0CA]" />
            <span
              className="text-[#B9C0CA] text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              Legal
            </span>
          </div>
          <h1
            className="text-white mb-3"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
              letterSpacing: "0.04em",
              lineHeight: 1.05,
            }}
          >
            SHIPPING &amp; RETURNS
          </h1>
          <p
            className="text-white/40 text-sm"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            LA Elite Sales LLC, operating as LA Elite Peptides &nbsp;·&nbsp; Domestic U.S. shipping only
          </p>
        </div>

        {/* Policy content */}
        <div style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.82 0.025 100)" }}>

          <PolicySection title="Overview">
            <p>LA Elite Sales LLC (operating as LA Elite Peptides) provides discreet, trackable standard shipping to qualified research customers across all 50 states.</p>
          </PolicySection>

          <PolicySection title="Standard Shipping Service">
            <div
              className="rounded-lg p-4 sm:p-5 mb-4"
              style={{ background: "oklch(0.18 0.055 255)", border: "1px solid oklch(1 0 0 / 8%)" }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: "#B9C0CA" }}
                />
                <div>
                  <p className="text-white text-sm font-semibold" style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.05em" }}>
                    FLAT-RATE STANDARD SHIPPING
                  </p>
                  <p className="text-white/60 text-xs mt-0.5">$7.00 at checkout</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: "oklch(1 0 0 / 30%)" }}
                />
                <div>
                  <p className="text-white text-sm font-semibold" style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.05em" }}>
                    NATIONWIDE DELIVERY
                  </p>
                  <p className="text-white/60 text-xs mt-0.5">3–5 business days · All 50 states</p>
                </div>
              </div>
            </div>
            <p>Orders are fulfilled Monday through Friday, excluding federal holidays. The standard delivery window is 3–5 business days after an order is processed and accepted by the carrier. Carrier or holiday delays may affect timing.</p>
            <p>Tracking information is provided when available. Every order is prepared in discreet packaging with an unbranded exterior.</p>
          </PolicySection>

          <PolicySection title="All 50 States">
            <p>We ship within the United States. It is your responsibility to confirm that the products ordered are legally permitted in your jurisdiction. We assume no liability for shipments delayed, seized, or denied by third-party carriers or authorities.</p>
          </PolicySection>

          <PolicySection title="Return Eligibility">
            <p>You may request a return or refund within <strong className="text-white">14 days of confirmed delivery</strong> under the following conditions:</p>
            <ul>
              <li>The item(s) received were damaged, mislabeled, or incorrect due to our error.</li>
              <li>The product(s) remain unopened and unused, and are in original condition.</li>
            </ul>
            <p>
              Email{" "}
              <a href="mailto:Support@laelitepeps.com" className="text-[#B9C0CA] hover:underline">
                Support@laelitepeps.com
              </a>{" "}
              with your order number, a clear photo of the damage or incorrect item, and a description. We will arrange a free reshipment of the product.
            </p>
          </PolicySection>

          <PolicySection title="Returns Will NOT Be Accepted For">
            <ul>
              <li>Products suspected of being intended for human or animal use. Any such use is a direct violation of our Terms and voids all eligibility for return, refund, or replacement.</li>
              <li>Items that have been opened, tampered with, or stored improperly.</li>
              <li>Purchases made with the intent to resell or repackage.</li>
              <li>Orders returned due to buyer's remorse or accidental purchases.</li>
            </ul>
          </PolicySection>

          <PolicySection title="Return Procedure">
            <p>All returns must be pre-approved and accompanied by a Return Merchandise Authorization (RMA) number. Unauthorized returns will not be accepted. Refunds are processed to the original payment method within 5–10 business days after return receipt and inspection. Shipping costs are non-refundable unless the error originated on our end.</p>
            <p>A restocking fee of <strong className="text-white">20%</strong> may apply to non-defective returned items.</p>
          </PolicySection>

          <PolicySection title="Risk of Loss">
            <p>Once a package is marked as delivered by the carrier, all risk of loss or damage transfers to the recipient. Claims for carrier-related loss or delay must be pursued directly with the carrier.</p>
          </PolicySection>

          <PolicySection title="Refund Timeframe">
            <p>Refunds should settle and post to your account in <strong className="text-white">10–15 business days</strong>, depending on the payment method used and your financial institution's policies.</p>
          </PolicySection>

          <PolicySection title="Contact">
            <p>For shipping or return inquiries:</p>
            <p>
              Email: <a href="mailto:Support@laelitepeps.com" className="text-[#B9C0CA] hover:underline break-all">Support@laelitepeps.com</a>
              <br />
              Phone: <a href="tel:+13109759289" className="text-[#B9C0CA] hover:underline">(310) 975-9289</a>
            </p>
          </PolicySection>
        </div>
      </main>

      {/* Footer */}
      <PolicyFooter />
    </div>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2
        className="text-white mb-4 pb-2"
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 700,
          fontSize: "1.1rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          borderBottom: "1px solid oklch(1 0 0 / 8%)",
        }}
      >
        {title}
      </h2>
      <div
        className="space-y-3 text-[0.9rem] sm:text-sm leading-relaxed"
        style={{ color: "oklch(0.62 0.02 250)" }}
      >
        {children}
      </div>
    </section>
  );
}

function PolicyFooter() {
  return (
    <footer
      className="py-8 mt-8"
      style={{
        background: "oklch(0.13 0.04 255)",
        borderTop: "1px solid oklch(1 0 0 / 8%)",
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p
          className="text-white/25 text-xs"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          © {new Date().getFullYear()} LA Elite Sales LLC. All rights reserved. Operating as LA Elite Peptides.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/terms">
            <span className="text-white/30 text-xs hover:text-[#B9C0CA] transition-colors cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>Terms</span>
          </Link>
          <Link href="/shipping-returns">
            <span className="text-white/30 text-xs hover:text-[#B9C0CA] transition-colors cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>Shipping & Returns</span>
          </Link>
          <Link href="/privacy-policy">
            <span className="text-white/30 text-xs hover:text-[#B9C0CA] transition-colors cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>Privacy Policy</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
