// === ELITE LA PEPTIDES — Announcement Bar ===
// Slim top banner for "Coming Soon — Online Ordering"

import { useState } from "react";
import { X, Sparkles } from "lucide-react";

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="relative z-[60] flex items-center justify-center gap-3 px-4 py-2 text-sm"
      style={{
        background: "linear-gradient(90deg, oklch(0.35 0.18 280) 0%, oklch(0.25 0.12 255) 50%, oklch(0.35 0.18 320) 100%)",
        borderBottom: "1px solid oklch(0.55 0.25 200 / 30%)",
      }}
    >
      <Sparkles size={13} className="text-[#00BFFF] flex-shrink-0" />
      <p
        className="text-white/90 tracking-wide text-center"
        style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, letterSpacing: "0.05em" }}
      >
        <span className="text-[#FF2D78] font-bold">COMING SOON</span>
        <span className="mx-2 text-white/40">—</span>
        Online ordering launching soon. Text us at{" "}
        <a
          href="sms:(310)929-0403"
          className="text-[#00BFFF] hover:text-white transition-colors underline underline-offset-2"
        >
          (310) 929-0403
        </a>{" "}
        to place your order today.
      </p>
      <Sparkles size={13} className="text-[#FF2D78] flex-shrink-0" />
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
