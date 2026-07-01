// SplashIntro.tsx
// Cinematic 6-second splash intro using the Elite LA Peptides vial artwork
// 4 scenes: fade-in → push-in + energy pulse → light sweep + shimmer → URL reveal

import { useEffect, useRef, useState } from "react";

const SPLASH_IMAGE = "/manus-storage/splash-vial-bg_3ae3ccdc.png";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  hue: number;
}

export default function SplashIntro({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [phase, setPhase] = useState<"scene1" | "scene2" | "scene3" | "scene4" | "done">("scene1");
  const [showUrl, setShowUrl] = useState(false);
  const [urlOpacity, setUrlOpacity] = useState(0);
  const [containerOpacity, setContainerOpacity] = useState(0);

  // Initialize particles
  const initParticles = (count: number, w: number, h: number): Particle[] => {
    return Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.3) * 0.6,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.2,
      hue: Math.random() > 0.85 ? 330 : 195, // mostly cyan, some pink
    }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d")!;

    particlesRef.current = initParticles(120, W, H);

    // Preload image
    const img = new Image();
    img.src = SPLASH_IMAGE;
    imgRef.current = img;

    // Fade in container
    setContainerOpacity(0);
    requestAnimationFrame(() => {
      setTimeout(() => setContainerOpacity(1), 50);
    });

    const TOTAL_DURATION = 6200; // ms
    const SCENE1_END = 1000;
    const SCENE2_END = 3000;
    const SCENE3_END = 5000;
    const SCENE4_END = 6200;

    let sweepX = -W;
    let urlFadeStart = -1;

    const draw = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const t = Math.min(elapsed / TOTAL_DURATION, 1);

      ctx.clearRect(0, 0, W, H);

      // ── Background: always dark navy
      ctx.fillStyle = "#050D1A";
      ctx.fillRect(0, 0, W, H);

      // ── Scene timing
      const inScene1 = elapsed < SCENE1_END;
      const inScene2 = elapsed >= SCENE1_END && elapsed < SCENE2_END;
      const inScene3 = elapsed >= SCENE2_END && elapsed < SCENE3_END;
      const inScene4 = elapsed >= SCENE3_END;

      // ── Global fade-in (scene 1)
      const globalAlpha = inScene1
        ? Math.min(elapsed / 800, 1)
        : 1;

      // ── Camera zoom: slow push-in during scene 2
      let scale = 1;
      let imgAlpha = globalAlpha;
      if (inScene2) {
        const s2t = (elapsed - SCENE1_END) / (SCENE2_END - SCENE1_END);
        scale = 1 + s2t * 0.06; // subtle 6% push-in
      } else if (inScene3 || inScene4) {
        scale = 1.06;
      }

      // ── Draw the vial image (centered, scaled)
      if (imgRef.current?.complete) {
        const iw = imgRef.current.naturalWidth;
        const ih = imgRef.current.naturalHeight;
        const aspect = iw / ih;
        let dw = W * scale;
        let dh = dw / aspect;
        if (dh < H * scale) {
          dh = H * scale;
          dw = dh * aspect;
        }
        const dx = (W - dw) / 2;
        const dy = (H - dh) / 2;

        ctx.globalAlpha = imgAlpha;
        ctx.drawImage(imgRef.current, dx, dy, dw, dh);
        ctx.globalAlpha = 1;
      }

      // ── Energy pulse (scene 2)
      if (inScene2) {
        const s2t = (elapsed - SCENE1_END) / (SCENE2_END - SCENE1_END);
        const pulseRadius = 80 + s2t * 220;
        const pulseAlpha = (1 - s2t) * 0.35;
        const grad = ctx.createRadialGradient(W / 2, H / 2 + 20, 0, W / 2, H / 2 + 20, pulseRadius);
        grad.addColorStop(0, `rgba(0,191,255,${pulseAlpha})`);
        grad.addColorStop(0.5, `rgba(0,191,255,${pulseAlpha * 0.4})`);
        grad.addColorStop(1, "rgba(0,191,255,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Second pulse slightly delayed
        const pulse2t = Math.max(0, s2t - 0.3);
        const pulse2Radius = 60 + pulse2t * 180;
        const pulse2Alpha = (1 - pulse2t) * 0.2;
        const grad2 = ctx.createRadialGradient(W / 2, H / 2 + 20, 0, W / 2, H / 2 + 20, pulse2Radius);
        grad2.addColorStop(0, `rgba(0,191,255,${pulse2Alpha})`);
        grad2.addColorStop(1, "rgba(0,191,255,0)");
        ctx.fillStyle = grad2;
        ctx.fillRect(0, 0, W, H);
      }

      // ── Light sweep (scene 3)
      if (inScene3) {
        const s3t = (elapsed - SCENE2_END) / (SCENE3_END - SCENE2_END);
        sweepX = -W * 0.3 + s3t * W * 1.6;
        const sweepWidth = W * 0.18;
        const sweepGrad = ctx.createLinearGradient(sweepX - sweepWidth, 0, sweepX + sweepWidth, 0);
        sweepGrad.addColorStop(0, "rgba(255,255,255,0)");
        sweepGrad.addColorStop(0.4, "rgba(255,255,255,0.08)");
        sweepGrad.addColorStop(0.5, "rgba(255,255,255,0.18)");
        sweepGrad.addColorStop(0.6, "rgba(255,255,255,0.08)");
        sweepGrad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = sweepGrad;
        ctx.fillRect(0, 0, W, H);
      }

      // ── Particles
      const particles = particlesRef.current;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        const pAlpha = p.alpha * globalAlpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.hue === 195
          ? `rgba(0,191,255,${pAlpha * 0.6})`
          : `rgba(255,45,120,${pAlpha * 0.4})`;
        ctx.fill();
      });

      // ── URL fade-in (scene 4)
      if (inScene4 && urlFadeStart < 0) {
        urlFadeStart = elapsed;
        setShowUrl(true);
      }
      if (urlFadeStart > 0) {
        const urlT = Math.min((elapsed - urlFadeStart) / 800, 1);
        setUrlOpacity(urlT);
      }

      // ── End
      if (elapsed >= TOTAL_DURATION) {
        setPhase("done");
        // Fade out container then call onComplete
        setContainerOpacity(0);
        setTimeout(() => onComplete(), 600);
        return;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-end justify-center"
      style={{
        opacity: containerOpacity,
        transition: "opacity 0.6s ease-out",
        background: "#050D1A",
        pointerEvents: "all",
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block" }}
      />

      {/* URL overlay */}
      {showUrl && (
        <div
          className="relative z-10 mb-10 text-center"
          style={{ opacity: urlOpacity, transition: "opacity 0.4s ease-out" }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(0.85rem, 1.8vw, 1.1rem)",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.85)",
              textShadow: "0 0 18px rgba(0,191,255,0.7), 0 0 40px rgba(0,191,255,0.3)",
            }}
          >
            www.laelitepeps.com
          </span>
        </div>
      )}

      {/* Skip button */}
      <button
        onClick={() => {
          cancelAnimationFrame(animRef.current);
          setContainerOpacity(0);
          setTimeout(() => onComplete(), 400);
        }}
        className="absolute bottom-6 right-6 z-20 text-white/40 hover:text-white/80 transition-colors duration-200"
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          fontWeight: 600,
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        SKIP INTRO ▶
      </button>
    </div>
  );
}
