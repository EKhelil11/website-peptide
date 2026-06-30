// === LA ELITE PEPTIDES — Footer & Contact Section ===
// Dark footer with brand logo, links, disclaimer
// Contact form wired to Formspree → forwards to Support@laelitepeps.com

import { useState } from "react";
import { Link } from "wouter";
import { Mail, MapPin, Instagram, Phone, CheckCircle } from "lucide-react";

const LOGO_URL = "/manus-storage/LAELITELOGONEW_dark_bg_2eaa3f51.png";

const CONTACT_EMAIL = "support@laelitepeps.com";

type FormState = "idle" | "success";

export default function Footer() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email || !message) return;

    const fullName = `${firstName} ${lastName}`.trim();
    const subject = encodeURIComponent(`Research Inquiry from ${fullName}`);
    const body = encodeURIComponent(
      `Name: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    setFormState("success");
    setFirstName("");
    setLastName("");
    setEmail("");
    setMessage("");
  };

  const inputStyle = {
    background: "oklch(0.14 0.05 255)",
    border: "1px solid oklch(1 0 0 / 10%)",
    fontFamily: "'Inter', sans-serif",
  };

  const labelStyle = {
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 600,
  } as React.CSSProperties;

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
                RESEARCH
                <br />
                <span style={{ color: "#00BFFF" }}>INQUIRIES</span>
              </h2>
              <p
                className="text-white/60 mb-8 leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                Have questions about our research compounds, product specifications, or ordering process? Our team is here to assist. Reach out and we'll respond within 24 hours.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/60">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: "oklch(0.72 0.18 210 / 12%)", border: "1px solid oklch(0.72 0.18 210 / 25%)" }}
                  >
                    <Mail size={14} style={{ color: "#00BFFF" }} />
                  </div>
                  <a
                    href="mailto:Support@laelitepeps.com"
                    className="hover:text-[#00BFFF] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}
                  >
                    Support@laelitepeps.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: "oklch(0.72 0.18 210 / 12%)", border: "1px solid oklch(0.72 0.18 210 / 25%)" }}
                  >
                    <Phone size={14} style={{ color: "#00BFFF" }} />
                  </div>
                  <a
                    href="tel:+13109759289"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}
                    className="hover:text-[#00BFFF] transition-colors"
                  >
                    (310) 975-9289
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
                  <a
                    href="https://instagram.com/laelitepeptides"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#00BFFF] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}
                  >
                    @laelitepeptides
                  </a>
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

              {/* Success state */}
              {formState === "success" ? (
                <div
                  className="flex flex-col items-center justify-center py-12 text-center gap-4"
                  style={{ minHeight: "320px" }}
                >
                  <CheckCircle size={48} style={{ color: "#00BFFF" }} />
                  <h5
                    className="text-white text-lg"
                    style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
                  >
                    Message Sent!
                  </h5>
                  <p
                    className="text-white/50 text-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Thank you for reaching out. We'll respond to your inquiry within 24 hours at {email || "your email"}.
                  </p>
                  <button
                    onClick={() => setFormState("idle")}
                    className="mt-2 text-[#00BFFF] text-sm underline underline-offset-4 hover:text-white transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-white/50 text-xs tracking-widest uppercase mb-1"
                        style={labelStyle}
                      >
                        First Name <span className="text-[#C9A84C]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full px-4 py-3 rounded text-sm text-white placeholder-white/30 outline-none focus:border-[#00BFFF]/50 transition-colors"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-white/50 text-xs tracking-widest uppercase mb-1"
                        style={labelStyle}
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full px-4 py-3 rounded text-sm text-white placeholder-white/30 outline-none focus:border-[#00BFFF]/50 transition-colors"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="block text-white/50 text-xs tracking-widest uppercase mb-1"
                      style={labelStyle}
                    >
                      Email <span className="text-[#C9A84C]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded text-sm text-white placeholder-white/30 outline-none focus:border-[#00BFFF]/50 transition-colors"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-white/50 text-xs tracking-widest uppercase mb-1"
                      style={labelStyle}
                    >
                      Message <span className="text-[#C9A84C]">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us how we can help..."
                      className="w-full px-4 py-3 rounded text-sm text-white placeholder-white/30 outline-none focus:border-[#00BFFF]/50 transition-colors resize-none"
                      style={inputStyle}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full py-3 rounded text-sm flex items-center justify-center gap-2"
                  >
                    Send Message
                  </button>

                  <p
                    className="text-white/25 text-xs text-center"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Clicking Send will open your email app addressed to support@laelitepeps.com
                  </p>
                </form>
              )}
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
              <img src={LOGO_URL} alt="LA Elite Peptides" className="h-20 w-auto max-w-[320px] mb-3" />
              <p
                className="text-white/40 text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                Pharmaceutical-grade research peptides for qualified researchers. Los Angeles, CA. All products for research use only.
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
                {["Products", "Shipping", "About", "Science", "FAQ", "Contact"].map((link) => (
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

            {/* Legal links */}
            <div>
              <h5
                className="text-white/70 text-xs tracking-widest uppercase mb-4"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
              >
                Legal
              </h5>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms">
                    <span className="text-white/40 text-sm hover:text-[#00BFFF] transition-colors cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>Terms &amp; Conditions</span>
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-returns">
                    <span className="text-white/40 text-sm hover:text-[#00BFFF] transition-colors cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>Shipping &amp; Returns</span>
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy">
                    <span className="text-white/40 text-sm hover:text-[#00BFFF] transition-colors cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>Privacy Policy</span>
                  </Link>
                </li>
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
                All products sold by LA Elite Peptides are strictly for in-vitro laboratory and scientific research purposes only. These compounds are not intended for human or animal consumption and have not been evaluated by the FDA for any therapeutic use.
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
              © {new Date().getFullYear()} La Elits Sales LLC. All rights reserved. Operating as La Elite Peptides.
            </p>
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-[#00BFFF]/30" />
              <span
                className="text-[#C9A84C]/60 text-xs italic"
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
