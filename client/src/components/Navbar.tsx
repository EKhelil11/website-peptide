// === ELITE LA PEPTIDES — Navbar ===
// Dark glass nav with logo, scroll-aware opacity, mobile menu
// Colors: Navy bg + Cyan accents + Hot Pink for elite script

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const LOGO_URL = "/manus-storage/elite-la-peptides-logo_e9ec855c.png";

const navLinks = [
  { label: "Products", href: "#products" },
  { label: "Shipping", href: "#shipping" },
  { label: "About", href: "#about" },
  { label: "Science", href: "#science" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "nav-glass" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-3 group"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            >
              <img
                src={LOGO_URL}
                alt="LA Elite Peptides"
                className="h-10 lg:h-12 w-auto object-contain transition-opacity duration-200 group-hover:opacity-90"
                style={{ filter: "drop-shadow(0 0 8px rgba(0, 191, 255, 0.3))" }}
              />
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm font-medium tracking-widest uppercase transition-colors duration-200 text-white/70 hover:text-[#00BFFF]"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => handleNavClick("#products")}
                className="btn-primary px-5 py-2 rounded text-sm"
              >
                View Compounds
              </button>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-white/80 hover:text-[#00BFFF] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "oklch(0.12 0.05 255 / 97%)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <img src={LOGO_URL} alt="LA Elite Peptides" className="h-16 w-auto mb-4" />
          {navLinks.map((link, i) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-2xl font-bold tracking-widest uppercase text-white/80 hover:text-[#00BFFF] transition-colors"
              style={{ fontFamily: "'Bebas Neue', sans-serif", animationDelay: `${i * 80}ms` }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick("#products")}
            className="btn-primary px-8 py-3 rounded text-base mt-4"
          >
            View Compounds
          </button>
        </div>
      </div>
    </>
  );
}
