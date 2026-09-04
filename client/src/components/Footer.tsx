// === LA ELITE PEPTIDES — Footer & Contact Section ===
// Warm boutique contact section followed by the dark brand/legal footer
// Contact form opens the visitor's email app addressed to Support@laelitepeps.com

import { useState } from "react";
import { Link } from "wouter";
import { Mail, MapPin, Instagram, Phone, CheckCircle, ArrowUpRight } from "lucide-react";
import { PRIMARY_LOGO_ALT, PRIMARY_LOGO_SIZE_CLASS, PRIMARY_LOGO_URL } from "@/lib/brandAssets";

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
    background: "#FFFDF8",
    border: "1px solid rgba(185, 192, 202, 0.72)",
    color: "#202833",
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
        className="contact-boutique-section relative overflow-hidden py-20 sm:py-24"
        style={{ background: "linear-gradient(145deg, #F7F2EA 0%, #EFE4D3 52%, #E8D7BD 100%)" }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-45" aria-hidden="true">
          <div className="absolute -left-24 top-14 h-72 w-72 rounded-full border border-[#174A9B]/10" />
          <div className="absolute -right-20 bottom-8 h-80 w-80 rounded-full border border-[#B9C0CA]/45" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B9C0CA] to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-10 lg:gap-16 items-start">
            {/* Left: Contact info */}
            <div className="lg:pt-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-12 bg-[#174A9B]" />
                <span
                  className="text-[#174A9B] text-xs tracking-[0.3em] uppercase"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
                >
                  Get In Touch
                </span>
              </div>
              <h2
                className="text-[#10295E] mb-5"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                  letterSpacing: "0.04em",
                  lineHeight: 1.05,
                }}
              >
                RESEARCH
                <br />
                <span style={{ color: "#174A9B" }}>INQUIRIES</span>
              </h2>
              <p
                className="text-[#4B5563] mb-8 max-w-xl leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
              >
                Have questions about our research compounds, product specifications, or ordering process? Our team can assist with catalog information, account access, and order support.
              </p>

              <div className="grid grid-cols-1 2xl:grid-cols-2 gap-3">
                {[
                  { icon: Mail, label: "Email", value: "Support@laelitepeps.com", note: "Research and order support", href: "mailto:Support@laelitepeps.com" },
                  { icon: Phone, label: "Phone", value: "(310) 975-9289", note: "Call or text our support line", href: "tel:+13109759289" },
                  { icon: MapPin, label: "Location", value: "Los Angeles, California", note: "US-based research supplier" },
                  { icon: Instagram, label: "Instagram", value: "@laelitepeptides", note: "Catalog and company updates", href: "https://instagram.com/laelitepeptides", external: true },
                ].map(({ icon: Icon, label, value, note, href, external }) => (
                  <div
                    key={label}
                    className="contact-method-card group relative min-w-0 overflow-hidden rounded-2xl border border-[#B9C0CA]/70 bg-[#FFFDF8]/80 p-4 shadow-[0_12px_35px_rgba(16,41,94,0.08)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[#174A9B]/35 hover:shadow-[0_16px_40px_rgba(16,41,94,0.12)] motion-reduce:transform-none"
                  >
                    <div className="flex items-start gap-3">
                      <div className="contact-method-medallion flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/70 bg-gradient-to-br from-[#245FC1] to-[#10295E] shadow-[0_7px_18px_rgba(16,41,94,0.2)] ring-1 ring-[#B9C0CA]/70">
                        <Icon size={17} className="text-[#F7F2EA]" />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <span className="block text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#174A9B]" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                          {label}
                        </span>
                        {href ? (
                          <a
                            href={href}
                            target={external ? "_blank" : undefined}
                            rel={external ? "noopener noreferrer" : undefined}
                            className="mt-1 inline-flex max-w-full items-center gap-1.5 break-words text-sm font-semibold text-[#10295E] transition-colors hover:text-[#245FC1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174A9B]/40"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {value}
                            <ArrowUpRight size={13} className="shrink-0 opacity-55" />
                          </a>
                        ) : (
                          <span className="mt-1 block text-sm font-semibold text-[#10295E]" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {value}
                          </span>
                        )}
                        <span className="mt-1.5 block text-xs leading-relaxed text-[#68717D]" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {note}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Contact form */}
            <div
              className="contact-inquiry-panel rounded-[1.5rem] p-5 sm:p-8"
              style={{
                background: "linear-gradient(150deg, rgba(255,253,248,0.96) 0%, rgba(239,228,211,0.96) 100%)",
                border: "1px solid rgba(185,192,202,0.8)",
                boxShadow: "0 24px 70px rgba(16,41,94,0.14), inset 0 1px 0 rgba(255,255,255,0.9)",
              }}
            >
              <span className="mb-3 block text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#174A9B]" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Private research inquiry
              </span>
              <h4
                className="text-[#10295E] mb-6"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(1.85rem, 5vw, 2.35rem)", letterSpacing: "0.04em", lineHeight: 1 }}
              >
                SEND AN INQUIRY
              </h4>

              {/* Success state */}
              {formState === "success" ? (
                <div
                  className="flex flex-col items-center justify-center py-12 text-center gap-4"
                  style={{ minHeight: "320px" }}
                >
                  <CheckCircle size={48} style={{ color: "#174A9B" }} />
                  <h5
                    className="text-[#10295E] text-lg"
                    style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
                  >
                    Email Draft Opened
                  </h5>
                  <p
                    className="text-[#5F6977] text-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Complete and send the message in your email app. Replies will be directed to {email || "your email"}.
                  </p>
                  <button
                    onClick={() => setFormState("idle")}
                    className="mt-2 text-[#174A9B] text-sm underline underline-offset-4 hover:text-[#10295E] transition-colors"
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
                        className="block text-[#5F6977] text-xs tracking-widest uppercase mb-1"
                        style={labelStyle}
                      >
                        First Name <span className="text-[#174A9B]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full rounded-lg px-4 py-3 text-sm placeholder-[#8A929D] outline-none transition-shadow focus:border-[#174A9B] focus:ring-2 focus:ring-[#174A9B]/15"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-[#5F6977] text-xs tracking-widest uppercase mb-1"
                        style={labelStyle}
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full rounded-lg px-4 py-3 text-sm placeholder-[#8A929D] outline-none transition-shadow focus:border-[#174A9B] focus:ring-2 focus:ring-[#174A9B]/15"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="block text-[#5F6977] text-xs tracking-widest uppercase mb-1"
                      style={labelStyle}
                    >
                      Email <span className="text-[#174A9B]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full rounded-lg px-4 py-3 text-sm placeholder-[#8A929D] outline-none transition-shadow focus:border-[#174A9B] focus:ring-2 focus:ring-[#174A9B]/15"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-[#5F6977] text-xs tracking-widest uppercase mb-1"
                      style={labelStyle}
                    >
                      Message <span className="text-[#174A9B]">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us how we can help..."
                      className="w-full resize-none rounded-lg px-4 py-3 text-sm placeholder-[#8A929D] outline-none transition-shadow focus:border-[#174A9B] focus:ring-2 focus:ring-[#174A9B]/15"
                      style={inputStyle}
                    />
                  </div>

                  <button
                    type="submit"
                    className="product-boutique-cta flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm"
                  >
                    Send Message
                  </button>

                  <p
                    className="text-[#68717D] text-xs text-center leading-relaxed"
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
          background: "oklch(0.18 0.055 255)",
          borderTop: "1px solid oklch(1 0 0 / 8%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_0.5fr_0.5fr] gap-8 mb-8">
            {/* Logo + tagline */}
            <div>
              <img
                src={PRIMARY_LOGO_URL}
                alt={PRIMARY_LOGO_ALT}
                className={`${PRIMARY_LOGO_SIZE_CLASS} mb-4`}
              />
              <p
                className="text-white/40 text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                Curated research compounds for qualified researchers. Los Angeles, CA. All products are strictly for in-vitro laboratory research use only.
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
                {[
                  { label: "Shop", href: "/shop" },
                  { label: "Shipping", href: "/#shipping" },
                  { label: "About", href: "/#about" },
                  { label: "Science", href: "/#science" },
                  { label: "FAQ", href: "/#faq" },
                  { label: "Contact", href: "/#contact" },
                ].map(link => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-white/40 text-sm hover:text-[#B9C0CA] transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {link.label}
                    </a>
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
                    <span className="text-white/40 text-sm hover:text-[#B9C0CA] transition-colors cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>Terms &amp; Conditions</span>
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-returns">
                    <span className="text-white/40 text-sm hover:text-[#B9C0CA] transition-colors cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>Shipping &amp; Returns</span>
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy">
                    <span className="text-white/40 text-sm hover:text-[#B9C0CA] transition-colors cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>Privacy Policy</span>
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
              © {new Date().getFullYear()} LA Elite Sales LLC. All rights reserved. Operating as LA Elite Peptides.
            </p>
            <div className="brand-proof-footer flex items-center gap-3 rounded-full border border-[#B9C0CA]/30 bg-white/[0.06] px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_28px_rgba(0,0,0,0.24)]">
              <div className="h-px w-7 bg-gradient-to-r from-[#B9C0CA]/35 to-[#E9DCCB]" />
              <span
                className="text-lg italic tracking-[0.06em] text-[#F7F2EA] sm:text-xl"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 650,
                  textShadow: "0 2px 14px rgba(0, 0, 0, 0.75)",
                }}
              >
                Trusted. Tested.
              </span>
              <div className="h-px w-7 bg-gradient-to-l from-[#B9C0CA]/35 to-[#E9DCCB]" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
