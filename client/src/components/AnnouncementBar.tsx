// === ELITE LA PEPTIDES — Announcement Bar (Scrolling Ticker) ===
// Fixed just below the navbar. Navbar is h-16 (64px) on mobile, h-20 (80px) on lg+

import { useState } from "react";
import { X } from "lucide-react";

// Repeat the message so the scroll loop is seamless
const SEGMENT =
  "\u2756 COMING SOON \u2014 Online Ordering Launching Soon  \u2756  Text us at (310) 929-0403 to place your order today  \u00a0\u00a0\u00a0\u00a0";
const TICKER = SEGMENT.repeat(6);

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <>
      {/* Push page content down so the fixed bar doesn't overlap */}
      <div className="h-8 w-full" />

      {/* Fixed ticker bar */}
      <div
        className="elite-ticker-bar fixed left-0 right-0 z-40 overflow-hidden flex items-center"
        style={{
          top: "64px",   /* mobile: below h-16 navbar */
          height: "32px",
          background:
            "linear-gradient(90deg, #1a0a2e 0%, #0d1a3a 50%, #1a0a2e 100%)",
          borderTop: "1px solid rgba(0,191,255,0.15)",
          borderBottom: "1px solid rgba(255,45,120,0.2)",
        }}
      >
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-10 pointer-events-none z-10"
          style={{ background: "linear-gradient(to right, #1a0a2e, transparent)" }}
        />

        {/* Scrolling text */}
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            animation: "eliteTicker 35s linear infinite",
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 600,
            fontSize: "0.72rem",
            letterSpacing: "0.07em",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          <span style={{ color: "#FF2D78" }}>✦</span>
          &nbsp;{TICKER}
          <span style={{ color: "#FF2D78" }}>✦</span>
          &nbsp;{TICKER}
        </div>

        {/* Right fade */}
        <div
          className="absolute right-6 top-0 bottom-0 w-10 pointer-events-none z-10"
          style={{ background: "linear-gradient(to left, #1a0a2e, transparent)" }}
        />

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-1 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors z-20"
          aria-label="Dismiss"
        >
          <X size={12} />
        </button>
      </div>

      <style>{`
        @keyframes eliteTicker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        /* Desktop: navbar is h-20 = 80px */
        @media (min-width: 1024px) {
          .elite-ticker-bar {
            top: 80px !important;
          }
        }
      `}</style>
    </>
  );
}
