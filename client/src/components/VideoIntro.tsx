// === ELITE LA PEPTIDES — Video Intro Splash ===
// Full-screen video that plays on first site load, then fades out to reveal the main site.
// Video: /manus-storage/intro-video_96c41449.mp4
// Behavior: autoplay muted, on end → fade out overlay → show site
// Skip button appears after 1.5s for user convenience

import { useEffect, useRef, useState } from "react";

const INTRO_VIDEO_URL = "/manus-storage/intro-video_96c41449.mp4";

interface VideoIntroProps {
  onComplete: () => void;
}

export default function VideoIntro({ onComplete }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
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
    const video = videoRef.current;
    if (!video) return;

    // Show skip button after 1.5s
    const skipTimer = setTimeout(() => setShowSkip(true), 1500);

    const handleEnded = () => handleComplete();
    const handleError = () => handleComplete(); // fallback if video fails

    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);

    // Attempt autoplay
    video.play().catch(() => {
      // If autoplay is blocked, show skip immediately and complete
      setShowSkip(true);
      setTimeout(() => handleComplete(), 500);
    });

    return () => {
      clearTimeout(skipTimer);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
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
      {/* Video */}
      <video
        ref={videoRef}
        src={INTRO_VIDEO_URL}
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-contain"
        style={{ maxWidth: "100vw", maxHeight: "100vh" }}
      />

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
          transform: showSkip ? "translateY(0)" : "translateY(10px)",
          pointerEvents: showSkip ? "auto" : "none",
          transition: "opacity 0.4s ease, transform 0.4s ease",
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
