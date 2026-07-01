// === ELITE LA PEPTIDES — Admin Login ===
// Hidden page at /admin/login — triggers Manus OAuth flow for admin access
// Not linked from main nav; access directly via URL

import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && user?.role === "admin") {
      // Already logged in as admin — go straight to orders
      setLocation("/admin/orders");
    }
  }, [user, loading, setLocation]);

  const handleAdminLogin = () => {
    window.location.href = getLoginUrl();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050D1A]">
        <div className="w-10 h-10 border-2 border-[#00BFFF]/30 border-t-[#00BFFF] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#050D1A] relative overflow-hidden"
    >
      {/* Ambient glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0,191,255,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-md mx-6 rounded-2xl border p-12 flex flex-col items-center gap-8"
        style={{
          background: "oklch(0.12 0.05 255 / 90%)",
          backdropFilter: "blur(24px)",
          borderColor: "rgba(0,191,255,0.15)",
          boxShadow: "0 0 60px rgba(0,191,255,0.06), 0 24px 64px rgba(0,0,0,0.5)",
        }}
      >
        {/* Shield Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: "oklch(0.15 0.08 255)",
            boxShadow: "0 0 40px rgba(0,191,255,0.25), 0 0 80px rgba(0,191,255,0.1)",
            border: "1px solid rgba(0,191,255,0.2)",
          }}
        >
          <ShieldCheck size={40} className="text-[#00BFFF]" />
        </div>

        {/* Title block */}
        <div className="text-center space-y-2">
          <p
            className="text-[#00BFFF] text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
          >
            Elite LA Peptides
          </p>
          <h1
            className="text-white leading-none"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.8rem, 8vw, 4.5rem)",
              letterSpacing: "0.08em",
            }}
          >
            Admin Access
          </h1>
          <p
            className="text-white/40 text-base tracking-wider"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Restricted Area — Authorized Personnel Only
          </p>
        </div>

        {/* Divider */}
        <div
          className="w-full h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(0,191,255,0.3), transparent)" }}
        />

        {/* Login Button */}
        <button
          onClick={handleAdminLogin}
          className="w-full py-4 rounded-xl font-bold tracking-[0.2em] uppercase transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "1.25rem",
            letterSpacing: "0.2em",
            background: "linear-gradient(135deg, #00BFFF, #0080FF)",
            color: "#fff",
            boxShadow: "0 0 30px rgba(0,191,255,0.35), 0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          Sign In with Manus
        </button>

        <p
          className="text-white/20 text-sm tracking-widest uppercase text-center"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          Unauthorized access is prohibited
        </p>
      </div>
    </div>
  );
}
