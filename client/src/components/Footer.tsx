// === ELITE LA PEPTIDES — Footer & Contact Section ===
// Dark footer with brand logo, links, disclaimer
// Contact section with simple form placeholder

import { Mail, MapPin, Instagram, Phone } from "lucide-react";

const LOGO_URL = "/manus-storage/elite-la-peptides-logo_e9ec855c.png";

export default function Footer() {
  return (
    <>
      {/* Contact Section */}
      <section
        id="contact"
        className="py-24 relative"
        style={{ background: "oklch(0.15 0.055 255)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: Contact info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-12 bg-[#00BFFF]" />
                <span
                  className="text-[#00BFFF] text-xs tracking-[0.3em] uppercase"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
                >
                  Get In Touch
                </span>
              </div>
              <h2
                className="text-white mb-6"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                  letterSpacing: "0.04em",
                  lineHeight: 1.05,
                }}
              >
                READY TO ELEVATE
                <br />
                <span style={{ color: "#00BFFF" }}>YOUR BIOLOGY?</span>
              </h2>
              <p
                className="text-white/60 mb-8 leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                Have questions about our products, dosing protocols, or research applications? Our team is here to help. Reach out and we'll respond within 24 hours.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/60">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: "oklch(0.72 0.18 210 / 12%)", border: "1px solid oklch(0.72 0.18 210 / 25%)" }}
                  >
                    <Mail size={14} style={{ color: "#00BFFF" }} />
                  </div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>
                    LaElitePeptides@gmail.com
                  </span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: "oklch(0.72 0.18 210 / 12%)", border: "1px solid oklch(0.72 0.18 210 / 25%)" }}
                  >
                    <Phone size={14} style={{ color: "#00BFFF" }} />
                  </div>
                  <a
                    href="tel:+13109290403"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}
                    className="hover:text-[#00BFFF] transition-colors"
                  >
                    (310) 929-0403
                  </a>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: "oklch(0.72 0.18 210 / 12%)", border: "1px solid oklch(0.72 0.18 210 / 25%)" }}
                  >
                    <MapPin size={14} style={{ color: "#00BFFF" }} />
                  </div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>
                    Los Angeles, California
                  </span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: "oklch(0.72 0.18 210 / 12%)", border: "1px solid oklch(0.72 0.18 210 / 25%)" }}
                  >
                    <Instagram size={14} style={{ color: "#00BFFF" }} />
                  </div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>
                    @laelitepeptides
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Contact form */}
            <div
              className="p-8 rounded-lg"
              style={{
                background: "oklch(0.17 0.055 255)",
                border: "1px solid oklch(1 0 0 / 8%)",
              }}
            >
              <h4
                className="text-white mb-6"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", letterSpacing: "0.05em" }}
              >
                Send Us a Message
              </h4>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-white/50 text-xs tracking-widest uppercase mb-1"
                      style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="John"
                      className="w-full px-4 py-3 rounded text-sm text-white placeholder-white/30 outline-none focus:border-[#00BFFF]/50 transition-colors"
                      style={{
                        background: "oklch(0.14 0.05 255)",
                        border: "1px solid oklch(1 0 0 / 10%)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-white/50 text-xs tracking-widest uppercase mb-1"
                      style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Doe"
                      className="w-full px-4 py-3 rounded text-sm text-white placeholder-white/30 outline-none focus:border-[#00BFFF]/50 transition-colors"
                      style={{
                        background: "oklch(0.14 0.05 255)",
                        border: "1px solid oklch(1 0 0 / 10%)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="block text-white/50 text-xs tracking-widest uppercase mb-1"
                    style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded text-sm text-white placeholder-white/30 outline-none focus:border-[#00BFFF]/50 transition-colors"
                    style={{
                      background: "oklch(0.14 0.05 255)",
                      border: "1px solid oklch(1 0 0 / 10%)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-white/50 text-xs tracking-widest uppercase mb-1"
                    style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                  >
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 rounded text-sm text-white placeholder-white/30 outline-none focus:border-[#00BFFF]/50 transition-colors resize-none"
                    style={{
                      background: "oklch(0.14 0.05 255)",
                      border: "1px solid oklch(1 0 0 / 10%)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  />
                </div>
                <button type="submit" className="btn-primary w-full py-3 rounded text-sm">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-12 relative"
        style={{
          background: "oklch(0.1 0.05 255)",
          borderTop: "1px solid oklch(1 0 0 / 8%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Logo + tagline */}
            <div>
              <img src={LOGO_URL} alt="LA Elite Peptides" className="h-12 w-auto mb-3" />
              <p
                className="text-white/40 text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                Premium research peptides for the performance-driven. Los Angeles, CA.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h5
                className="text-white/70 text-xs tracking-widest uppercase mb-4"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
              >
                Quick Links
              </h5>
              <ul className="space-y-2">
                {["Products", "Shipping", "About", "Science", "Contact"].map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => document.querySelector(`#${link.toLowerCase()}`)?.scrollIntoView({ behavior: "smooth" })}
                      className="text-white/40 text-sm hover:text-[#00BFFF] transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div>
              <h5
                className="text-white/70 text-xs tracking-widest uppercase mb-4"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
              >
                Disclaimer
              </h5>
              <p
                className="text-white/30 text-xs leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                All products sold by LA Elite Peptides are intended for research purposes only. These products are not intended to diagnose, treat, cure, or prevent any disease. Not for human consumption. Must be 18+ to purchase.
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderTop: "1px solid oklch(1 0 0 / 6%)" }}
          >
            <p
              className="text-white/25 text-xs"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              © {new Date().getFullYear()} LA Elite Peptides. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-[#00BFFF]/30" />
              <span
                className="text-[#FF2D78]/60 text-xs italic"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Precise. Potent. Elite.
              </span>
              <div className="h-px w-8 bg-[#00BFFF]/30" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
