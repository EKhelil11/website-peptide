// === LA ELITE PEPTIDES — Age Verification Modal ===
// Full-screen overlay shown on first visit requiring 21+ confirmation
// Stores result in sessionStorage so it only shows once per session

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

const LOGO_URL = "/manus-storage/lap-logo-cropped_755f69ec.png";
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
              background: "radial-gradient(circle, rgba(0,191,255,0.08) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(255,0,128,0.06) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="relative mx-4 max-w-md w-full text-center"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(0,191,255,0.04) 100%)",
              border: "1px solid rgba(0,191,255,0.2)",
              borderRadius: "20px",
              padding: "48px 40px",
              boxShadow: "0 0 60px rgba(0,191,255,0.1), 0 40px 80px rgba(0,0,0,0.6)",
            }}
          >
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src={LOGO_URL}
                alt="LA Elite Peptides"
                style={{ height: "72px", objectFit: "contain" }}
              />
            </div>

            {/* Age badge */}
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-5"
              style={{
                background: "linear-gradient(135deg, rgba(255,0,128,0.2), rgba(0,191,255,0.2))",
                border: "2px solid rgba(255,0,128,0.5)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.6rem",
                  color: "#FF0080",
                  lineHeight: 1,
                }}
              >
                21+
              </span>
            </div>

            {/* Headline */}
            <h2
              className="mb-2"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "2rem",
                letterSpacing: "0.08em",
                color: "#FFFFFF",
                lineHeight: 1.1,
              }}
            >
              AGE VERIFICATION
            </h2>

            {/* Subtext */}
            <p
              className="mb-2"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "1rem",
                color: "rgba(255,255,255,0.7)",
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              You must be <strong style={{ color: "#00BFFF" }}>21 years of age or older</strong> to access this site.
            </p>
            <p
              className="mb-8"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.35)",
                lineHeight: 1.5,
              }}
            >
              All products are sold strictly for in-vitro laboratory and scientific research purposes only.
            </p>

            {/* Divider */}
            <div
              className="mb-8"
              style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,191,255,0.3), transparent)" }}
            />

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirm}
                className="w-full py-4 font-bold tracking-widest transition-all duration-200 active:scale-95"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "1rem",
                  letterSpacing: "0.12em",
                  background: "linear-gradient(135deg, #00BFFF, #0080FF)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(0,191,255,0.3)",
                }}
              >
                YES, I AM 21 OR OLDER — ENTER SITE
              </button>

              <button
                onClick={handleDeny}
                className="w-full py-3 transition-all duration-200 active:scale-95"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "0.9rem",
                  letterSpacing: "0.08em",
                  background: "transparent",
                  color: "rgba(255,255,255,0.35)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                No, I am under 21 — Exit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
