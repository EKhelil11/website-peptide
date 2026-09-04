// === LA ELITE PEPTIDES — Age Verification Modal ===
// Full-screen overlay shown on first visit requiring 21+ confirmation
// Stores result in sessionStorage so it only shows once per session

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { AGE_GATE_LOGO_SIZE_CLASS, PRIMARY_LOGO_ALT, PRIMARY_LOGO_URL } from "@/lib/brandAssets";

const INTRO_SEEN_KEY = "elitela_intro_seen";
const INTRO_COMPLETE_EVENT = "elitela:intro-complete";

// Routes that bypass age verification entirely
const BYPASS_ROUTES = ["/admin", "/account", "/checkout", "/api", "/register", "/login", "/verify-email", "/forgot-password", "/reset-password"];

export default function AgeVerification() {
  const [visible, setVisible] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    // Skip age gate for admin/account/checkout routes
    const isBypassRoute = BYPASS_ROUTES.some((r) => location.startsWith(r));
    if (isBypassRoute) {
      // Auto-verify so the gate never shows on protected routes
      sessionStorage.setItem("age_verified", "true");
      setVisible(false);
      return;
    }

    // Show only if not already verified this session. On the desktop home page,
    // wait for the intro to complete so the two full-screen overlays do not overlap.
    const verified = sessionStorage.getItem("age_verified");
    if (!verified) {
      let timer: ReturnType<typeof setTimeout> | undefined;
      const showGate = () => {
        timer = setTimeout(() => setVisible(true), 200);
      };

      const introPending =
        location === "/" &&
        window.innerWidth >= 768 &&
        sessionStorage.getItem(INTRO_SEEN_KEY) !== "1";

      if (introPending) {
        window.addEventListener(INTRO_COMPLETE_EVENT, showGate, { once: true });
        return () => {
          window.removeEventListener(INTRO_COMPLETE_EVENT, showGate);
          if (timer) clearTimeout(timer);
        };
      }

      showGate();
      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [location]);

  const handleConfirm = () => {
    sessionStorage.setItem("age_verified", "true");
    setVisible(false);
  };

  const handleDeny = () => {
    // Redirect away if under 21
    window.location.href = "https://www.google.com";
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            background: "rgba(0, 6, 20, 0.97)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Ambient glow effects */}
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(185,192,202,0.08) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(36,95,193,0.08) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="age-verification-panel relative mx-4 w-full max-w-md rounded-[1.4rem] border border-[#E9DCCB]/45 bg-[#071D3D]/96 p-6 text-center shadow-[0_34px_90px_rgba(0,0,0,0.62),0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.12)] sm:p-10"
            style={{
              background:
                "linear-gradient(145deg, rgba(16,41,94,0.98) 0%, rgba(7,29,61,0.98) 52%, rgba(5,20,45,0.99) 100%)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-x-8 top-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,252,247,0.92), transparent)" }}
              aria-hidden="true"
            />
            {/* Logo */}
            <div className="mb-5 flex justify-center sm:mb-6">
              <img
                src={PRIMARY_LOGO_URL}
                alt={PRIMARY_LOGO_ALT}
                className={AGE_GATE_LOGO_SIZE_CLASS}
              />
            </div>

            {/* Age badge */}
            <div
              className="age-verification-badge relative mx-auto mb-5 inline-flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-white/70 shadow-[0_12px_32px_rgba(0,0,0,0.34),0_0_28px_rgba(233,220,203,0.24)]"
              style={{
                background: "linear-gradient(145deg, #FFFCF7 0%, #E9DCCB 52%, #B9C0CA 100%)",
              }}
            >
              <span className="absolute inset-[5px] rounded-full border border-[#10295E]/20" aria-hidden="true" />
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#10295E",
                  lineHeight: 1,
                  letterSpacing: "0.02em",
                }}
              >
                21+
              </span>
            </div>

            {/* Headline */}
            <h2
              className="mb-3"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 8vw, 2.45rem)",
                fontWeight: 650,
                letterSpacing: "0.055em",
                color: "#FFFCF7",
                lineHeight: 1.02,
                textShadow: "0 2px 18px rgba(0,0,0,0.38)",
              }}
            >
              AGE VERIFICATION
            </h2>

            {/* Subtext */}
            <p
              className="mb-2"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.98rem",
                color: "#E8EDF5",
                fontWeight: 500,
                lineHeight: 1.62,
              }}
            >
              You must be <strong style={{ color: "#F2DFC5", fontWeight: 700 }}>21 years of age or older</strong> to access this site.
            </p>
            <p
              className="mb-7 sm:mb-8"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.84rem",
                color: "#C9D2E0",
                fontWeight: 450,
                lineHeight: 1.65,
              }}
            >
              All products are sold strictly for in-vitro laboratory and scientific research purposes only.
            </p>

            {/* Divider */}
            <div
              className="mb-7 sm:mb-8"
              style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(233,220,203,0.74), transparent)" }}
            />

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirm}
                className="age-verification-primary-cta relative w-full overflow-hidden rounded-xl border border-white/80 px-4 py-3.5 text-center transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-0.5 hover:brightness-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFCF7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071D3D] active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
                style={{
                  color: "#0A2458",
                  cursor: "pointer",
                }}
              >
                <span
                  className="relative z-10 block text-[0.7rem] uppercase tracking-[0.16em]"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}
                >
                  Yes, I am 21 or older
                </span>
                <span
                  className="relative z-10 mt-0.5 block text-[1.05rem] uppercase tracking-[0.2em]"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}
                >
                  Enter Site →
                </span>
              </button>

              <button
                onClick={handleDeny}
                className="age-verification-secondary-cta w-full rounded-xl border border-[#B9C0CA]/45 bg-white/[0.035] px-4 py-3.5 transition-[transform,background-color,border-color,color] duration-200 hover:border-[#E9DCCB]/70 hover:bg-white/[0.07] hover:text-[#FFFCF7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9C0CA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071D3D] active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "0.84rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "#C9D2E0",
                  cursor: "pointer",
                }}
              >
                No, I am under 21 — Exit Site
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
