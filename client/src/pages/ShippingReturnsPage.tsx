// === LA ELITE PEPTIDES — Shipping & Returns Page ===
// Standalone legal page at /shipping-returns
// Legal entity: La Elits Sales LLC (operating as La Elite Peptides)

import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

const LOGO_URL = "/manus-storage/elite-la-peptides-logo_e9ec855c.png";

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.08 0.04 255)" }}>
      {/* Top nav */}
      <header
        className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between"
        style={{
          background: "oklch(0.08 0.04 255 / 95%)",
          borderBottom: "1px solid oklch(1 0 0 / 8%)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Link href="/">
          <img src={LOGO_URL} alt="La Elite Peptides" className="h-9 w-auto cursor-pointer" />
        </Link>
        <Link href="/">
          <button
            className="flex items-center gap-2 text-white/50 hover:text-[#00BFFF] transition-colors text-sm"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <ArrowLeft size={14} />
            Back to Site
          </button>
        </Link>
      </header>

      {/* Page content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page header */}
        <div className="mb-12">
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
            className="text-white mb-3"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
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
            La Elits Sales LLC, operating as La Elite Peptides &nbsp;·&nbsp; Domestic U.S. shipping only
          </p>
        </div>

        {/* Policy content */}
        <div style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.75 0.02 255)" }}>

          <PolicySection title="Overview">
            <p>La Elits Sales LLC (operating as La Elite Peptides) provides fast, secure shipping on all domestic orders.</p>
          </PolicySection>

          <PolicySection title="Shipping Tiers">
            <div
              className="rounded-lg p-5 mb-4"
              style={{ background: "oklch(0.12 0.05 255)", border: "1px solid oklch(1 0 0 / 8%)" }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: "#00BFFF" }}
                />
                <div>
                  <p className="text-white text-sm font-semibold" style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.05em" }}>
                    FREE USPS PRIORITY SHIPPING
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">On all U.S. orders over $250</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: "oklch(1 0 0 / 30%)" }}
                />
                <p className="text-white/60 text-sm">USPS Priority, UPS Ground, UPS 2-Day, and UPS Air Overnight (by request) available</p>
              </div>
            </div>
            <p>We fulfill orders Monday through Friday, excluding federal holidays. Orders placed before 2:00 PM PST are typically processed the same business day. Orders received after this time may ship the following business day.</p>
            <p>Once your order is processed, you will receive an email confirmation with tracking information. All shipments are professionally packed using thermally protective materials to preserve compound integrity in transit.</p>
          </PolicySection>

          <PolicySection title="Domestic Shipping Only">
            <p>We currently ship exclusively within the United States. It is your responsibility to confirm that the products ordered are legally permitted in your jurisdiction. We assume no liability for shipments delayed, seized, or denied by third-party carriers or authorities.</p>
          </PolicySection>

          <PolicySection title="Return Eligibility">
            <p>You may request a return or refund within <strong className="text-white">14 days of confirmed delivery</strong> under the following conditions:</p>
            <ul>
              <li>The item(s) received were damaged, mislabeled, or incorrect due to our error.</li>
              <li>The product(s) remain unopened and unused, and are in original condition.</li>
            </ul>
            <p>
              Email{" "}
              <a href="mailto:Support@laelitepeps.com" className="text-[#00BFFF] hover:underline">
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
              📧 <a href="mailto:Support@laelitepeps.com" className="text-[#00BFFF] hover:underline">Support@laelitepeps.com</a>
              <br />
              📞 <a href="tel:+13109290403" className="text-[#00BFFF] hover:underline">(310) 929-0403</a>
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
        className="space-y-3 text-sm leading-relaxed"
        style={{ color: "oklch(0.72 0.02 255)" }}
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
        background: "oklch(0.06 0.04 255)",
        borderTop: "1px solid oklch(1 0 0 / 8%)",
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p
          className="text-white/25 text-xs"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          © {new Date().getFullYear()} La Elits Sales LLC. All rights reserved. Operating as La Elite Peptides.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/terms">
            <span className="text-white/30 text-xs hover:text-[#00BFFF] transition-colors cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>Terms</span>
          </Link>
          <Link href="/shipping-returns">
            <span className="text-white/30 text-xs hover:text-[#00BFFF] transition-colors cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>Shipping & Returns</span>
          </Link>
          <Link href="/privacy-policy">
            <span className="text-white/30 text-xs hover:text-[#00BFFF] transition-colors cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>Privacy Policy</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
