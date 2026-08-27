// === LA ELITE PEPTIDES — Terms & Conditions Page ===
// Standalone legal page at /terms
// Legal entity: La Elits Sales LLC (operating as La Elite Peptides)

import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

const LOGO_URL = "/manus-storage/lap-logo-cropped_755f69ec.png";

export default function TermsPage() {
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
            TERMS &amp; CONDITIONS
          </h1>
          <p
            className="text-white/40 text-sm"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            La Elits Sales LLC, operating as La Elite Peptides &nbsp;·&nbsp; Effective upon site access
          </p>
        </div>

        {/* Policy content */}
        <div
          className="prose prose-invert max-w-none"
          style={{ fontFamily: "'Inter', sans-serif", color: "oklch(0.75 0.02 255)" }}
        >
          <PolicySection title="DISCLAIMER">
            <p>La Elite Peptides is a supplier of laboratory research materials intended strictly for in-vitro and analytical research purposes. All products are for research use only and are not intended for human consumption or clinical application.</p>
            <p>Welcome to La Elite Peptides, operated by La Elits Sales LLC. This Terms of Service governs the use of La Elits Sales LLC's website, products, and all associated social media platforms and communications. By visiting, accessing, or purchasing from our site or associated platforms, you acknowledge and agree to these Terms and Conditions, along with our Privacy Policy, Disclaimer, and any other legal notices published by us (collectively, the "Agreement"). These terms form a binding contract between you ("you," "user," or "customer") and La Elits Sales LLC, operating as La Elite Peptides ("La Elite Peptides," "we," "our," or "us").</p>
            <p>Your access and use of our services is contingent upon your acceptance of this Agreement. If you disagree with any part of it, do not use or access our services. This platform is intended exclusively for research professionals or individuals over 21 years of age, and use by anyone under that age is strictly prohibited.</p>
            <p>By accessing, visiting, or using our Services, you agree to be bound by the Terms of Service, Privacy Policy, Medical and Product Disclaimer, and Cookie Policy, all together referred to as the "Agreement."</p>
          </PolicySection>

          <PolicySection title="Research Use Only and Lab Use Only">
            <p>All products sold, listed, or otherwise displayed by La Elits Sales LLC (operating as La Elite Peptides) are provided strictly for laboratory and analytical in vitro research purposes only. These materials are not drugs, food additives, cosmetics, or dietary supplements and must never be used for human or veterinary applications under any circumstances.</p>
            <p>Our products are not approved, cleared, or evaluated by the FDA, nor any other regulatory body, and any suggestion — explicit or implied — of bodily introduction, therapeutic use, or consumption is a violation of federal law and a breach of our Terms of Sale.</p>
            <p>Under 21 CFR §§100–740, these compounds qualify as exempt research chemicals and are required to be labeled "For Research Use Only." Any product removed from its original packaging, repackaged, relabeled, redistributed, or used in a non-research context loses this designation and becomes subject to heightened regulatory scrutiny.</p>
            <p>La Elits Sales LLC (operating as La Elite Peptides) is not:</p>
            <ul>
              <li>A 503A compounding pharmacy</li>
              <li>A 503B outsourcing facility</li>
              <li>A licensed drug manufacturer</li>
            </ul>
            <p>as defined under the Federal Food, Drug, and Cosmetic Act.</p>
            <p>By placing an order, you expressly certify and warrant that:</p>
            <ul>
              <li>You are a qualified professional or institutional researcher operating in a lawful environment.</li>
              <li>You understand and accept all risks associated with laboratory research materials.</li>
              <li>You will not resell, repackage, or distribute our products for any off-label or unauthorized use.</li>
              <li>You will follow all applicable safety protocols and comply with state and federal law.</li>
            </ul>
          </PolicySection>

          <PolicySection title="Waiver and Indemnification">
            <p>By purchasing or using products from La Elite Peptides, you agree to indemnify and hold harmless La Elits Sales LLC and its affiliates, agents, owners, and employees against any and all claims, damages, liabilities, expenses, and losses, including reasonable legal fees, arising from your misuse or unauthorized handling of our products.</p>
            <p>You also waive any claims against us for injuries, damages, or losses resulting from improper use, storage, distribution, or disposal of our materials. You accept all legal and civil liability related to your research practices.</p>
            <p>I understand and acknowledge that the research compounds sold by La Elits Sales LLC (operating as La Elite Peptides) are intended solely for research purposes and are not approved by the U.S. Food and Drug Administration (FDA) for human use. I agree to use the compounds according to all applicable laws and regulations and take full responsibility for any risks associated with their purchase, possession, and use.</p>
            <p>I release, discharge, and waive any claims, demands, causes of action, suits, judgments, and liabilities of any kind that may arise from or be connected to the purchase, possession, or use of the research compounds.</p>
            <p>This indemnity waiver applies to me, my heirs, executors, administrators, successors, and assigns. By purchasing research compounds from La Elits Sales LLC (operating as La Elite Peptides), I confirm that I have read and understood this Indemnity Waiver and voluntarily agree to its terms and conditions.</p>
          </PolicySection>

          <PolicySection title="Product Representations">
            <p>Our products are not guaranteed to be sterile, pyrogen-free, or suitable for any specific application beyond research. We do not provide dosing instructions, health-related guidance, or guarantees of performance. We reserve the right to:</p>
            <ul>
              <li>Cancel any order if we suspect the product may be misused.</li>
              <li>Refuse service to individuals or institutions suspected of violating our terms.</li>
              <li>Limit purchases at our discretion.</li>
            </ul>
          </PolicySection>

          <PolicySection title="Eligibility to Purchase">
            <p>You must be at least 21 years of age and possess appropriate credentials to purchase from La Elite Peptides. By placing an order, you confirm that:</p>
            <ul>
              <li>You are purchasing solely for research.</li>
              <li>You are not acting on behalf of or distributing to any party intending human or animal use.</li>
              <li>You will not repackage, relabel, or redistribute any product purchased.</li>
            </ul>
          </PolicySection>

          <PolicySection title="Order Fulfillment">
            <p>Orders are accepted at our discretion and are subject to availability. Upon successful payment, you will receive confirmation. La Elite Peptides reserves the right to cancel or adjust any order due to inventory issues, compliance concerns, or other reasons. All orders are processed within a reasonable timeframe and shipping details will be provided to the purchaser.</p>
          </PolicySection>

          <PolicySection title="Returns, Refunds, and Exchanges">
            <p>We stand behind the integrity of our materials. If the product you received is defective, mislabeled, or damaged, please contact our support team within 7 days of receipt. We will offer refunds or exchanges on a case-by-case basis. Please note:</p>
            <ul>
              <li>We do not accept returns for opened or used products.</li>
              <li>We do not process refunds for any orders where usage for human or animal consumption is suspected.</li>
              <li>A Return Merchandise Authorization (RMA) number must be issued before shipping anything back to us.</li>
            </ul>
            <p>Refunds, when issued, are returned to the original payment method. Shipping costs are non-refundable unless an error on our part occurred.</p>
          </PolicySection>

          <PolicySection title="Pricing and Payments">
            <p>All prices are listed in U.S. dollars and are subject to change without notice. We accept a range of payment methods including ACH bank transfer, Zelle, and other approved methods. Payment for products must be made in full before delivery. Unpaid orders are cancelled automatically within 24 hours.</p>
            <p>La Elits Sales LLC shall not store any credit card details on its own servers. All payment processing is conducted in accordance with applicable security standards by our payment gateway providers.</p>
          </PolicySection>

          <PolicySection title="Shipping Policy">
            <p>We ship only to locations within the United States where such materials are legally permitted. All shipments are packed securely using pharmaceutical-grade thermal mailers to protect compound stability. Customers are responsible for ensuring that delivery to their jurisdiction complies with applicable laws. We are not liable for delays, loss, or damages once the package has been handed off to the shipping carrier.</p>
          </PolicySection>

          <PolicySection title="Cancellation">
            <p>All order cancellations must be made before the order is approved for processing. Once the order has been approved and is in the process of shipment, cancellations will not be entertained.</p>
          </PolicySection>

          <PolicySection title="Storage and Handling Disclaimer">
            <p>Our compounds are shipped with the assumption that the end-user is qualified to handle, store, and dispose of them appropriately. La Elite Peptides stores all inventory at -20°C or -80°C until time of shipping to preserve chemical integrity. Upon receipt, the end-user is responsible for maintaining optimal storage conditions.</p>
          </PolicySection>

          <PolicySection title="Intellectual Property">
            <p>All content on this site — including logos, branding, trademarks, product listings, COAs, and text — belongs to La Elits Sales LLC. Unauthorized use, reproduction, or redistribution is strictly prohibited.</p>
          </PolicySection>

          <PolicySection title="Governing Law">
            <p>These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Los Angeles County, California.</p>
          </PolicySection>

          <PolicySection title="Contact">
            <p>For questions regarding these Terms, contact us at:</p>
            <p>
              📧 <a href="mailto:Support@laelitepeps.com" className="text-[#00BFFF] hover:underline">Support@laelitepeps.com</a>
              <br />
              📞 <a href="tel:+13109759289" className="text-[#00BFFF] hover:underline">(310) 975-9289</a>
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
