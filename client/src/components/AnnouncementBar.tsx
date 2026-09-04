// === ELITE LA PEPTIDES — Announcement Bar (Scrolling Ticker) ===
// Fixed just below the navbar. Navbar is h-20 (80px) on mobile, h-24 (96px) on lg+

import { useState } from "react";
import { X } from "lucide-react";

// Option D — Premium brand feel, open for business
const SEGMENT =
  "\u2756 LA ELITE PEPTIDES \u00a0\u00b7\u00a0 NOW OPEN \u00a0\u00b7\u00a0 RESEARCH USE ONLY \u00a0\u00b7\u00a0 VIEW PRODUCT DOCUMENT STATUS \u00a0\u00b7\u00a0 ORDER TODAY \u00a0\u00b7\u00a0 (310)\u00a0975-9289 \u00a0\u00a0\u00a0\u00a0\u00a0\u00a0";
const TICKER = SEGMENT.repeat(6);

export default function AnnouncementBar() {
  // Temporarily hidden — ShipStation integration in progress
  return null;

  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <>
      {/* Push page content down so the fixed bar doesn't overlap */}
      <div className="h-11 w-full" />

      {/* Fixed ticker bar — taller and wider */}
      <div
        className="elite-ticker-bar fixed left-0 right-0 z-40 overflow-hidden flex items-center"
        style={{
          top: "80px",   /* mobile: below h-20 navbar */
          height: "44px",
          background:
            "linear-gradient(90deg, #07152F 0%, #174A9B 50%, #07152F 100%)",
          borderTop: "1px solid oklch(0.76 0.02 250 / 40%)",
          borderBottom: "1px solid oklch(0.76 0.02 250 / 40%)",
          boxShadow: "0 2px 12px oklch(0.55 0.14 255 / 20%)",
        }}
      >
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none z-10"
          style={{ background: "linear-gradient(to right, #07152F, transparent)" }}
        />

        {/* Scrolling text */}
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            animation: "eliteTicker 60s linear infinite",
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 700,
            fontSize: "0.85rem",
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.92)",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#B9C0CA", fontSize: "1rem" }}>✦</span>
          &nbsp;{TICKER}
          <span style={{ color: "#B9C0CA", fontSize: "1rem" }}>✦</span>
          &nbsp;{TICKER}
        </div>

        {/* Right fade */}
        <div
          className="absolute right-7 top-0 bottom-0 w-12 pointer-events-none z-10"
          style={{ background: "linear-gradient(to left, #07152F, transparent)" }}
        />

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/80 transition-colors z-20"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>

      <style>{`
        @keyframes eliteTicker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        /* Desktop: navbar is h-24 = 96px */
        @media (min-width: 1024px) {
          .elite-ticker-bar {
            top: 96px !important;
          }
        }
      `}</style>
    </>
  );
}
