// === ELITE LA PEPTIDES — Login Page ===
// Styled to match Midnight Clinic theme

import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const LOGO_URL = "/manus-storage/elite-la-peptides-logo_e9ec855c.png";

export default function Login() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && user) {
      setLocation("/shop");
    }
  }, [user, loading, setLocation]);

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  const handleRegister = () => {
    const url = new URL(getLoginUrl());
    url.searchParams.set("type", "signUp");
    window.location.href = url.toString();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "oklch(0.12 0.05 255)" }}
    >
      {/* Back to site */}
      <a
        href="/"
        className="absolute top-6 left-6 text-white/50 hover:text-[#00BFFF] text-sm tracking-widest uppercase transition-colors"
        style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
      >
        ← Back to Site
      </a>

      <div
        className="w-full max-w-md rounded-2xl p-8 sm:p-10"
        style={{
          background: "oklch(0.17 0.055 255)",
          border: "1px solid oklch(0.28 0.08 255 / 60%)",
          boxShadow: "0 0 40px oklch(0.72 0.18 210 / 8%)",
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={LOGO_URL} alt="LA Elite Peptides" className="h-14 w-auto" />
        </div>

        <h1
          className="text-3xl text-center text-white mb-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
        >
          Member Access
        </h1>
        <p className="text-center text-white/50 text-sm mb-8" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          Sign in to your account to place orders
        </p>

        {/* Research use disclaimer */}
        <div
          className="rounded-lg px-4 py-3 mb-8 text-xs text-center"
          style={{
            background: "oklch(0.72 0.18 210 / 8%)",
            border: "1px solid oklch(0.72 0.18 210 / 20%)",
            color: "oklch(0.72 0.18 210)",
            fontFamily: "'Rajdhani', sans-serif",
          }}
        >
          All products are sold strictly for research use only. Must be 21+ to access.
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-lg font-bold text-sm tracking-widest uppercase mb-4 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, oklch(0.6 0.27 0), oklch(0.55 0.25 355))",
            color: "white",
            fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: "0.12em",
            boxShadow: "0 4px 20px oklch(0.6 0.27 0 / 30%)",
          }}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        {/* Register Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-3 rounded-lg font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "transparent",
            border: "1px solid oklch(0.72 0.18 210 / 40%)",
            color: "oklch(0.72 0.18 210)",
            fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: "0.12em",
          }}
        >
          Create Account
        </button>

        <p className="text-center text-white/30 text-xs mt-6" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          By signing in you agree to our{" "}
          <a href="#" className="text-white/50 hover:text-[#00BFFF] underline transition-colors">
            Terms of Service
          </a>
        </p>
      </div>

      {/* Footer note */}
      <p className="mt-8 text-white/25 text-xs text-center" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
        Questions? Text us at (310) 975-9289 or email support@laelitepeps.com
      </p>
    </div>
  );
}
