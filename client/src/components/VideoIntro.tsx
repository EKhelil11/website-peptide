// === ELITE LA PEPTIDES — Video Intro Splash ===
// Full-screen branded intro that fades out to reveal the main site.
// The legacy video was not present in the recovered Git repository, so the
// replacement uses a durable generated backdrop and preserves skip behavior.
// Skip button appears after 1.5s for user convenience

import { useEffect, useState } from "react";
import { PRIMARY_LOGO_URL } from "@/lib/brandAssets";

const INTRO_BACKDROP_URL = "/manus-storage/lap-intro-backdrop_0bbeb236.jpg";

interface VideoIntroProps {
  onComplete: () => void;
}

export default function VideoIntro({ onComplete }: VideoIntroProps) {
  const [fading, setFading] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  const handleComplete = () => {
    if (fading) return;
    setFading(true);
    // After fade-out transition, notify parent
    setTimeout(() => {
      onComplete();
    }, 700);
  };

  useEffect(() => {
    const skipTimer = setTimeout(() => setShowSkip(true), 1500);
    const completeTimer = setTimeout(() => handleComplete(), 4200);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(completeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: "#000",
        transition: "opacity 0.7s cubic-bezier(0.23, 1, 0.32, 1)",
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <img
        src={INTRO_BACKDROP_URL}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <img
          src={PRIMARY_LOGO_URL}
          alt="LA Elite Peptides — Trusted. Tested."
          className="w-[min(58.8vw,532px)] h-auto"
        />
        <p
          className="mt-6 text-sm sm:text-base uppercase text-white/65"
          style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: "0.32em" }}
        >
          Advanced Research Compounds
        </p>
      </div>

      {/* Dark vignette edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Skip button */}
      <button
        onClick={handleComplete}
        className="absolute bottom-8 right-8 flex items-center gap-2 px-5 py-2.5 rounded text-sm transition-all duration-300"
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(0,191,255,0.4)",
          color: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(8px)",
          opacity: showSkip ? 1 : 0,
          transform: showSkip ? "translateY(0) scale(1)" : "translateY(14px) scale(0.96)",
          pointerEvents: showSkip ? "auto" : "none",
          transition: "opacity 0.55s cubic-bezier(0.23,1,0.32,1), transform 0.55s cubic-bezier(0.23,1,0.32,1)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#00BFFF";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,191,255,0.8)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,191,255,0.4)";
        }}
      >
        Skip Intro
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </button>
    </div>
  );
}
