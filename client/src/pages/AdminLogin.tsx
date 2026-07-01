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
        <div className="w-8 h-8 border-2 border-[#00BFFF]/30 border-t-[#00BFFF] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050D1A]">
      <div
        className="w-full max-w-sm mx-4 rounded-2xl border border-white/10 p-10 flex flex-col items-center gap-6"
        style={{ background: "oklch(0.12 0.05 255 / 90%)", backdropFilter: "blur(20px)" }}
      >
        {/* Shield Icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: "oklch(0.15 0.08 255)", boxShadow: "0 0 24px rgba(0,191,255,0.2)" }}
        >
          <ShieldCheck size={32} className="text-[#00BFFF]" />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1
            className="text-2xl font-bold tracking-widest uppercase text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.15em" }}
          >
            Admin Access
          </h1>
          <p className="text-sm text-white/40 mt-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Elite LA Peptides — Restricted Area
          </p>
        </div>

        {/* Login Button */}
        <button
          onClick={handleAdminLogin}
          className="w-full py-3 rounded-lg font-bold tracking-widest uppercase text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            background: "linear-gradient(135deg, #00BFFF, #0080FF)",
            color: "#fff",
            boxShadow: "0 0 20px rgba(0,191,255,0.3)",
          }}
        >
          Sign In with Manus
        </button>

        <p className="text-xs text-white/20 text-center" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
