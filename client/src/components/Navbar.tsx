// === ELITE LA PEPTIDES — Navbar ===
// Dark glass nav with logo, scroll-aware opacity, mobile menu
// Colors: Navy bg + Cyan accents + Hot Pink for elite script

import { useState, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { useLocation } from "wouter";

const LOGO_URL = "/manus-storage/LAELITELOGONEW_dark_bg_2eaa3f51.png";

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
  const { customer, isAuthenticated, logout } = useCustomerAuth();
  const [location, setLocation] = useLocation();

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
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-3 group"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            >
              <img
                src={LOGO_URL}
                alt="LA Elite Peptides"
                className="h-16 lg:h-20 w-auto max-w-[300px] lg:max-w-[420px] object-contain transition-opacity duration-200 group-hover:opacity-90"
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
            </nav>

            {/* Auth CTA */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLocation("/account")}
                    className="flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-white/70 hover:text-[#00BFFF] transition-colors"
                    style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                  >
                    <User size={16} />
                    <span>{customer?.firstName ?? "Account"}</span>
                  </button>
                  <button
                    onClick={() => logout()}
                    className="flex items-center gap-1 text-xs font-medium tracking-widest uppercase text-white/40 hover:text-red-400 transition-colors"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                    title="Sign out"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setLocation(`/login?returnTo=${encodeURIComponent(location)}`)}
                  className="text-sm font-medium tracking-widest uppercase px-4 py-1.5 rounded border border-[#00BFFF]/40 text-[#00BFFF] hover:bg-[#00BFFF]/10 transition-colors"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                >
                  Sign In
                </button>
              )}
            </div>

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
          <img src={LOGO_URL} alt="LA Elite Peptides" className="h-20 w-auto max-w-[320px] mb-4" />
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
          {/* Mobile Auth */}
          <div className="flex flex-col items-center gap-3 pt-4 border-t border-white/10 w-48">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => { setMobileOpen(false); setLocation("/account"); }}
                  className="flex items-center gap-2 text-xl font-bold tracking-widest uppercase text-white/80 hover:text-[#00BFFF] transition-colors"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  <User size={18} />
                  {customer?.firstName ?? "Account"}
                </button>
                <button
                  onClick={() => { setMobileOpen(false); logout(); }}
                  className="flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-white/40 hover:text-red-400 transition-colors"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => { setMobileOpen(false); setLocation(`/login?returnTo=${encodeURIComponent(location)}`); }}
                className="text-xl font-bold tracking-widest uppercase text-[#00BFFF] hover:text-white transition-colors"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
