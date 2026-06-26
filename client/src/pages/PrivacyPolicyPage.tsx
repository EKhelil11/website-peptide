// === LA ELITE PEPTIDES — Privacy Policy Page ===
// Standalone legal page at /privacy-policy
// Legal entity: La Elits Sales LLC (operating as La Elite Peptides)

import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

const LOGO_URL = "/manus-storage/elite-la-peptides-logo_e9ec855c.png";

export default function PrivacyPolicyPage() {
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
            PRIVACY POLICY
          </h1>
          <p
            className="text-white/40 text-sm"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            La Elits Sales LLC, operating as La Elite Peptides &nbsp;·&nbsp; laelitepeps.com
          </p>
        </div>

        {/* Policy content */}
        <div style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.75 0.02 255)" }}>

          <PolicySection title="Overview">
            <p>La Elits Sales LLC, operating as La Elite Peptides ("La Elite Peptides," "we," "our," or "us") is committed to protecting your personal information. This Privacy Policy describes how we collect, use, and safeguard your data when you interact with our website at <a href="https://laelitepeps.com" className="text-[#00BFFF] hover:underline">laelitepeps.com</a>.</p>
          </PolicySection>

          <PolicySection title="1. Information We Collect">
            <p>When registering an account, subscribing to communications, or completing a transaction, you may be asked to provide:</p>
            <ul>
              <li>Full Name</li>
              <li>Email Address</li>
              <li>Phone Number</li>
              <li>Billing and Shipping Address</li>
              <li>Payment information (processed securely by our payment gateway partners)</li>
            </ul>
            <p>You may also visit our site anonymously. However, any access remains subject to our Terms of Use and this Privacy Policy.</p>
          </PolicySection>

          <PolicySection title="2. How Your Information Is Used">
            <p>We use the information collected for lawful and legitimate purposes, including:</p>
            <ul>
              <li>Processing orders and transactions</li>
              <li>Sending order confirmations, shipping updates, and account notifications</li>
              <li>Providing customer service or support</li>
              <li>Sending limited and optional promotional emails regarding offers, new products, or site updates</li>
              <li>Complying with legal obligations or responding to lawful governmental requests</li>
            </ul>
            <p>Your information will not be sold, exchanged, transferred, or given to any other company for any reason whatsoever, without your consent, other than for the express purpose of delivering the purchased product or service requested.</p>
          </PolicySection>

          <PolicySection title="3. Safeguarding Your Information">
            <p>We use industry-standard security protocols, including SSL encryption and secure payment gateways, to protect sensitive information during transmission. All payment data is encrypted and processed directly by our payment partners. We do not store full credit card or banking details on our servers once a transaction is complete.</p>
          </PolicySection>

          <PolicySection title="4. Cookies and Tracking Technology">
            <p>Our website uses cookies to remember items in your shopping cart, personalize your browsing experience, and analyze traffic and site performance. You can disable cookies in your browser settings, though doing so may impact your experience on our site.</p>
          </PolicySection>

          <PolicySection title="5. Disclosure to Third Parties">
            <p>We do not sell, rent, or license your personal data. We may disclose limited information to third-party service providers only to facilitate payment processing, fulfill orders, send transactional communications, and conduct fraud prevention. Each vendor we partner with is contractually bound to protect your data.</p>
          </PolicySection>

          <PolicySection title="6. Children's Privacy (COPPA Compliance)">
            <p>Our services are intended only for individuals who are at least 21 years old. We do not knowingly collect or store data from minors under the age of 18. If we become aware that personal information was collected from a minor, we will delete it immediately and restrict further access.</p>
          </PolicySection>

          <PolicySection title="7. SMS and Email Communications">
            <p>If you opt in to receive SMS alerts or emails from us, you agree to receive transactional updates, order confirmations, and limited marketing offers. Message and data rates may apply. You can unsubscribe from SMS at any time by replying "STOP" and from emails via the unsubscribe link in each message.</p>
          </PolicySection>

          <PolicySection title="8. Data Retention and Deletion">
            <p>We retain your personal information only for as long as necessary to fulfill the purposes described in this policy or to comply with legal obligations. You may request that we delete your data by contacting our support team.</p>
          </PolicySection>

          <PolicySection title="9. Your Consent">
            <p>By using our website, registering an account, or completing a purchase, you:</p>
            <ul>
              <li>Acknowledge that you are at least 21 years of age</li>
              <li>Consent to the collection, use, and storage of your personal data in accordance with this Privacy Policy</li>
              <li>Agree to abide by our Terms and Conditions</li>
            </ul>
          </PolicySection>

          <PolicySection title="10. Changes to This Policy">
            <p>We reserve the right to update or amend this Privacy Policy at any time. Revisions will be posted on this page and take effect immediately.</p>
          </PolicySection>

          <PolicySection title="11. Contact Information">
            <p>For questions, concerns, or data-related inquiries:</p>
            <p>
              📧 <a href="mailto:Support@laelitepeps.com" className="text-[#00BFFF] hover:underline">Support@laelitepeps.com</a>
              <br />
              📞 <a href="tel:+13109290403" className="text-[#00BFFF] hover:underline">(310) 929-0403</a>
              <br />
              🌐 <a href="https://laelitepeps.com" className="text-[#00BFFF] hover:underline">laelitepeps.com</a>
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
