// === ELITE LA PEPTIDES — Video Intro Splash ===
// Full-screen branded intro that fades out to reveal the main site.
// The legacy video was not present in the recovered Git repository, so the
// replacement uses the owner-supplied gym image and preserves skip behavior.
// Skip button appears after 1.5s for user convenience

import { useEffect, useState } from "react";
import { INTRO_LOGO_SIZE_CLASS, PRIMARY_LOGO_ALT, PRIMARY_LOGO_URL } from "@/lib/brandAssets";

const INTRO_BACKDROP_URL = "/manus-storage/la-elite-gym-intro_e541e0af-optimized_1f399001.webp";

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
        aria-hidden="true"
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[58%_center] sm:object-center"
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(2,10,24,0.9) 0%, rgba(2,10,24,0.7) 34%, rgba(2,10,24,0.28) 62%, rgba(2,10,24,0.12) 100%), linear-gradient(0deg, rgba(2,10,24,0.7) 0%, transparent 42%)",
        }}
      />

      <div className="relative z-10 flex h-full w-full items-center px-6 sm:px-10 lg:px-16">
        <div className="flex max-w-xl flex-col items-start text-left">
          <img
            src={PRIMARY_LOGO_URL}
            alt={PRIMARY_LOGO_ALT}
            className={`${INTRO_LOGO_SIZE_CLASS} !w-[min(72vw,460px)] !max-h-[150px] object-contain object-left`}
          />
          <div className="mt-6 h-px w-24 bg-gradient-to-r from-[#B9C0CA] to-transparent" />
          <p
            className="mt-5 text-sm uppercase text-white/88 sm:text-base"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: "0.26em" }}
          >
            Qualified In-Vitro Research Only
          </p>
          <p
            className="mt-2 max-w-md text-xs leading-relaxed text-white/62 sm:text-sm"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
          >
            Research compounds are not intended for human or animal use.
          </p>
        </div>
      </div>

      {/* Dark vignette edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.5) 100%)",
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
          border: "1px solid rgba(185,192,202,0.4)",
          color: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(8px)",
          opacity: showSkip ? 1 : 0,
          transform: showSkip ? "translateY(0) scale(1)" : "translateY(14px) scale(0.96)",
          pointerEvents: showSkip ? "auto" : "none",
          transition: "opacity 0.55s cubic-bezier(0.23,1,0.32,1), transform 0.55s cubic-bezier(0.23,1,0.32,1)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#B9C0CA";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(185,192,202,0.8)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(185,192,202,0.4)";
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
