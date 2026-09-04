// === ELITE LA PEPTIDES — Navbar ===
// Dark glass nav with logo, scroll-aware opacity, mobile menu
// Colors: Navy bg + Cyan accents + Hot Pink for elite script

import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, ShieldCheck } from "lucide-react";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  MOBILE_MENU_LOGO_SIZE_CLASS,
  PRIMARY_LOGO_ALT,
  PRIMARY_LOGO_SIZE_CLASS,
  PRIMARY_LOGO_URL,
} from "@/lib/brandAssets";
import { useLocation } from "wouter";

const navLinks = [
  { label: "Shop", href: "/shop" },
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
  const { user: adminUser } = useAuth();
  const isAdmin = adminUser?.role === "admin";
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/")) {
      setLocation(href);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (location !== "/") {
      window.location.href = `/${href}`;
      return;
    }

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
          <div className="flex items-center justify-between h-24 lg:h-28">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center gap-3 group"
              onClick={(e) => {
                e.preventDefault();
                if (location === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  setLocation("/");
                }
              }}
            >
              <img
                src={PRIMARY_LOGO_URL}
                alt={PRIMARY_LOGO_ALT}
                className={`${PRIMARY_LOGO_SIZE_CLASS} transition-opacity duration-200 group-hover:opacity-90`}
                style={{ filter: "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.42))" }}
              />
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm font-medium tracking-widest uppercase transition-colors duration-200 text-white/70 hover:text-[#B9C0CA]"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Admin Link — only for admin users */}
            {isAdmin && (
              <button
                onClick={() => setLocation("/admin/orders")}
                className="hidden md:flex items-center gap-1.5 text-sm font-medium tracking-widest uppercase text-[#174A9B]/80 hover:text-[#174A9B] transition-colors duration-200"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
              >
                <ShieldCheck size={15} />
                Admin
              </button>
            )}

            {/* Auth CTA */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLocation("/account")}
                    className="flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-white/70 hover:text-[#B9C0CA] transition-colors"
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
                  className="text-sm font-medium tracking-widest uppercase px-4 py-1.5 rounded border border-[#B9C0CA]/40 text-[#B9C0CA] hover:bg-[#B9C0CA]/10 transition-colors"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden flex h-11 w-11 items-center justify-center rounded-lg text-white/80 hover:text-[#B9C0CA] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-navigation"
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "oklch(0.18 0.055 255 / 97%)", backdropFilter: "blur(20px)", overflowY: "auto" }}
      >
        <div className="flex min-h-full flex-col items-center justify-center gap-3 px-4 py-28 sm:gap-6">
          <img
            src={PRIMARY_LOGO_URL}
            alt={PRIMARY_LOGO_ALT}
            className={`${MOBILE_MENU_LOGO_SIZE_CLASS} mb-4`}
          />
          {navLinks.map((link, i) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="flex min-h-11 w-full max-w-xs items-center justify-center text-xl sm:text-2xl font-bold tracking-widest uppercase text-white/80 hover:text-[#B9C0CA] transition-colors"
              style={{ fontFamily: "'Cormorant Garamond', serif", animationDelay: `${i * 80}ms` }}
            >
              {link.label}
            </button>
          ))}
          {/* Mobile Admin Link */}
          {isAdmin && (
            <button
              onClick={() => { setMobileOpen(false); setLocation("/admin/orders"); }}
              className="flex items-center gap-2 text-xl font-bold tracking-widest uppercase text-[#174A9B]/80 hover:text-[#174A9B] transition-colors"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              <ShieldCheck size={18} />
              Admin
            </button>
          )}

          {/* Mobile Auth */}
          <div className="flex w-full max-w-xs flex-col items-center gap-3 border-t border-white/10 pt-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => { setMobileOpen(false); setLocation("/account"); }}
                  className="flex items-center gap-2 text-xl font-bold tracking-widest uppercase text-white/80 hover:text-[#B9C0CA] transition-colors"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
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
                className="text-xl font-bold tracking-widest uppercase text-[#B9C0CA] hover:text-white transition-colors"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
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
