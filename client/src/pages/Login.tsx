// === LA ELITE PEPTIDES — Customer Login Page ===
// Custom email/password login — no Manus OAuth exposure

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

const LOGO_URL = "/manus-storage/elite-la-peptides-logo_e9ec855c.png";

export default function Login() {
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { data: customer, isLoading: checkingSession } = trpc.customer.me.useQuery(undefined, { retry: false });

  useEffect(() => {
    if (!checkingSession && customer) {
      setLocation("/account");
    }
  }, [customer, checkingSession, setLocation]);

  const utils = trpc.useUtils();

  const loginMutation = trpc.customer.login.useMutation({
    onSuccess: async () => {
      // Invalidate the customer.me cache so Account page sees the new session
      await utils.customer.me.invalidate();
      setLocation("/account");
    },
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ email: form.email, password: form.password });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "oklch(0.09 0.04 255)" }}
    >
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.8 0.1 220) 1px, transparent 1px), linear-gradient(90deg, oklch(0.8 0.1 220) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Back to site */}
      <a
        href="/"
        className="absolute top-6 left-6 text-white/40 hover:text-white/70 text-sm tracking-widest uppercase transition-colors"
        style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
      >
        ← Back to Site
      </a>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={LOGO_URL} alt="LA Elite Peptides" className="h-14 w-auto" />
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 border"
          style={{
            background: "oklch(0.13 0.055 255 / 0.95)",
            borderColor: "oklch(0.72 0.18 210 / 0.2)",
            boxShadow: "0 0 60px oklch(0.72 0.18 210 / 0.06)",
          }}
        >
          <div className="mb-7">
            <h1 className="text-white mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.06em" }}>
              SIGN IN
            </h1>
            <p className="text-white/45 text-sm" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
              Access your LA Elite Peptides account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-white/55 text-xs mb-1.5 tracking-wider uppercase" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-white placeholder-white/25 outline-none transition-all"
                  style={{ background: "oklch(0.11 0.04 255)", border: "1px solid oklch(0.72 0.18 210 / 0.15)", fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-white/55 text-xs tracking-wider uppercase" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
                  Password
                </label>
                <Link href="/forgot-password">
                  <span className="text-xs cursor-pointer hover:underline" style={{ color: "oklch(0.72 0.18 210)", fontFamily: "'Inter', sans-serif" }}>
                    Forgot password?
                  </span>
                </Link>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm text-white placeholder-white/25 outline-none transition-all"
                  style={{ background: "oklch(0.11 0.04 255)", border: "1px solid oklch(0.72 0.18 210 / 0.15)", fontFamily: "'Inter', sans-serif" }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg p-3" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
                <p className="text-red-400 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold tracking-wider uppercase text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
              style={{
                background: loginMutation.isPending
                  ? "oklch(0.72 0.18 210 / 0.5)"
                  : "linear-gradient(135deg, oklch(0.72 0.18 210), oklch(0.65 0.2 220))",
                color: "oklch(0.09 0.04 255)",
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                boxShadow: loginMutation.isPending ? "none" : "0 0 24px oklch(0.72 0.18 210 / 0.3)",
              }}
            >
              {loginMutation.isPending ? (
                <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <>SIGN IN <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/8 text-center">
            <p className="text-white/35 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
              Don't have an account?{" "}
              <Link href="/register">
                <span className="hover:underline cursor-pointer transition-colors" style={{ color: "oklch(0.72 0.18 210)" }}>
                  Create one
                </span>
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-white/25 text-xs mt-6" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          Questions? Text us at (310) 975-9289 or email support@laelitepeps.com
        </p>
      </div>
    </div>
  );
}
