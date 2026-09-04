// === LA ELITE PEPTIDES — Floating "Text Us" SMS Button ===
// Sticky hot-pink pill button fixed to bottom-right corner
// Links to sms:(310)975-9289 for one-tap mobile contact
// Pulse ring animation to draw attention

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingTextButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Delay fade-in by 2s to let the page settle after intro
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <a
      href="sms:+13109759289"
      aria-label="Text us at (310) 975-9289"
      className="floating-text-btn"
      style={{
        position: "fixed",
        bottom: "5.5rem",
        right: "1.5rem",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.65rem 1.2rem",
        borderRadius: "9999px",
        background: "#174A9B",
        color: "#fff",
        fontFamily: "'Rajdhani', sans-serif",
        fontWeight: 700,
        fontSize: "0.9rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        textDecoration: "none",
        boxShadow: "0 4px 24px rgba(167, 122, 44, 0.45), 0 2px 8px rgba(0,0,0,0.3)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.95)",
        transition:
          "opacity 500ms cubic-bezier(0.23,1,0.32,1), transform 500ms cubic-bezier(0.23,1,0.32,1), box-shadow 150ms ease",
        pointerEvents: visible ? "auto" : "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.06)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
          "0 6px 32px rgba(167, 122, 44, 0.65), 0 2px 10px rgba(0,0,0,0.35)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
          "0 4px 24px rgba(167, 122, 44, 0.45), 0 2px 8px rgba(0,0,0,0.3)";
      }}
    >
      {/* Pulse ring */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "9999px",
          border: "2px solid rgba(167, 122, 44, 0.6)",
          animation: "textBtnPulse 2.2s ease-out infinite",
          pointerEvents: "none",
        }}
      />
      <MessageCircle size={17} strokeWidth={2.5} />
      <span>Text Us</span>
    </a>
  );
}
