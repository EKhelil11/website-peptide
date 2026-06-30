// === LA ELITE PEPTIDES — Combined Login + Register Page ===
// NuRev-style side-by-side layout with email verification, Remember Me, and marketing opt-in

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Mail, Lock, Eye, EyeOff, User, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { trpc } from "@/lib/trpc";

const LOGO_URL = "/manus-storage/elite-la-peptides-logo_e9ec855c.png";

export default function Login() {
  const [, setLocation] = useLocation();

  // ── Login state ──────────────────────────────────────────────────────────
  const [loginForm, setLoginForm] = useState({ email: "", password: "", rememberMe: false });
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginError, setLoginError] = useState("");

  // ── Register state ────────────────────────────────────────────────────────
  const [regForm, setRegForm] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "", marketingOptIn: false,
  });
  const [showRegPw, setShowRegPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);

  // ── Session check ─────────────────────────────────────────────────────────
  const { data: customer, isLoading: checkingSession } = trpc.customer.me.useQuery(undefined, { retry: false });
  const utils = trpc.useUtils();

  useEffect(() => {
    if (!checkingSession && customer) setLocation("/");
  }, [customer, checkingSession, setLocation]);

  // ── Mutations ─────────────────────────────────────────────────────────────
  const loginMutation = trpc.customer.login.useMutation({
    onSuccess: async () => {
      await utils.customer.me.invalidate();
      setLocation("/");
    },
    onError: (err) => setLoginError(err.message),
  });

  const registerMutation = trpc.customer.register.useMutation({
    onSuccess: () => setRegSuccess(true),
    onError: (err) => setRegError(err.message),
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    loginMutation.mutate({ email: loginForm.email, password: loginForm.password });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    if (regForm.password !== regForm.confirmPassword) {
      setRegError("Passwords do not match.");
      return;
    }
    if (regForm.password.length < 8) {
      setRegError("Password must be at least 8 characters.");
      return;
    }
    registerMutation.mutate({
      email: regForm.email,
      password: regForm.password,
      firstName: regForm.firstName,
      lastName: regForm.lastName,
      origin: window.location.origin,
    });
  };

  const inputStyle = {
    background: "oklch(0.11 0.04 255)",
    border: "1px solid oklch(0.72 0.18 210 / 0.15)",
    fontFamily: "'Inter', sans-serif",
  };

  const labelStyle = {
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 600 as const,
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

      <div className="relative z-10 w-full max-w-5xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={LOGO_URL} alt="LA Elite Peptides" className="h-14 w-auto" />
        </div>

        {/* Compliance banner */}
        <div
          className="flex items-center gap-3 rounded-xl px-5 py-3 mb-8 mx-auto max-w-2xl"
          style={{ background: "oklch(0.72 0.18 210 / 0.08)", border: "1px solid oklch(0.72 0.18 210 / 0.2)" }}
        >
          <ShieldCheck size={18} style={{ color: "oklch(0.72 0.18 210)", flexShrink: 0 }} />
          <p className="text-white/60 text-xs leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
            An account is required to browse pricing and purchase. All products are sold strictly for{" "}
            <span className="text-white/80 font-medium">research use only</span> — not for human consumption.
          </p>
        </div>

        {/* Side-by-side cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── LOGIN CARD ─────────────────────────────────────────────── */}
          <div
            className="rounded-2xl p-8 border"
            style={{
              background: "oklch(0.13 0.055 255 / 0.95)",
              borderColor: "oklch(0.72 0.18 210 / 0.2)",
              boxShadow: "0 0 60px oklch(0.72 0.18 210 / 0.06)",
            }}
          >
            <div className="mb-7">
              <h2 className="text-white mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.06em" }}>
                SIGN IN
              </h2>
              <p className="text-white/45 text-sm" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                Access your existing account.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-white/55 text-xs mb-1.5 tracking-wider uppercase" style={labelStyle}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                  <input
                    type="email" placeholder="you@example.com" required autoComplete="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-white placeholder-white/25 outline-none transition-all"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-white/55 text-xs tracking-wider uppercase" style={labelStyle}>Password</label>
                  <a href="/forgot-password" className="text-xs hover:underline" style={{ color: "oklch(0.72 0.18 210)", fontFamily: "'Inter', sans-serif" }}>
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                  <input
                    type={showLoginPw ? "text" : "password"} placeholder="Your password" required autoComplete="current-password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm text-white placeholder-white/25 outline-none transition-all"
                    style={inputStyle}
                  />
                  <button type="button" onClick={() => setShowLoginPw(!showLoginPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showLoginPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={loginForm.rememberMe}
                  onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded accent-cyan-400"
                />
                <span className="text-white/45 text-xs group-hover:text-white/60 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Remember me for 30 days
                </span>
              </label>

              {/* Error */}
              {loginError && (
                <div className="rounded-lg p-3" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
                  <p className="text-red-400 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{loginError}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit" disabled={loginMutation.isPending}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold tracking-wider uppercase text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
                style={{
                  background: loginMutation.isPending ? "oklch(0.72 0.18 210 / 0.5)" : "linear-gradient(135deg, oklch(0.72 0.18 210), oklch(0.65 0.2 220))",
                  color: "oklch(0.09 0.04 255)",
                  fontFamily: "'Rajdhani', sans-serif", fontWeight: 700,
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
          </div>

          {/* ── REGISTER CARD ──────────────────────────────────────────── */}
          <div
            className="rounded-2xl p-8 border"
            style={{
              background: "oklch(0.13 0.055 255 / 0.95)",
              borderColor: "oklch(0.72 0.18 210 / 0.12)",
              boxShadow: "0 0 60px oklch(0.72 0.18 210 / 0.04)",
            }}
          >
            {regSuccess ? (
              /* ── Success state ── */
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <CheckCircle size={48} className="mb-4" style={{ color: "oklch(0.72 0.18 210)" }} />
                <h2 className="text-white mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.06em" }}>
                  CHECK YOUR EMAIL
                </h2>
                <p className="text-white/55 text-sm leading-relaxed max-w-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                  We sent a verification link to <span className="text-white/80">{regForm.email}</span>. Click it to activate your account and start shopping.
                </p>
                <p className="text-white/30 text-xs mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Didn't receive it? Check your spam folder.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-7">
                  <h2 className="text-white mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.06em" }}>
                    CREATE ACCOUNT
                  </h2>
                  <p className="text-white/45 text-sm" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                    Free account — access full catalog and pricing.
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Name row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/55 text-xs mb-1.5 tracking-wider uppercase" style={labelStyle}>First Name</label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                        <input
                          type="text" placeholder="John" required
                          value={regForm.firstName}
                          onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-white placeholder-white/25 outline-none transition-all"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/55 text-xs mb-1.5 tracking-wider uppercase" style={labelStyle}>Last Name</label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                        <input
                          type="text" placeholder="Doe" required
                          value={regForm.lastName}
                          onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-white placeholder-white/25 outline-none transition-all"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-white/55 text-xs mb-1.5 tracking-wider uppercase" style={labelStyle}>Email Address</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                      <input
                        type="email" placeholder="you@example.com" required autoComplete="email"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-white placeholder-white/25 outline-none transition-all"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/55 text-xs mb-1.5 tracking-wider uppercase" style={labelStyle}>Password</label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                        <input
                          type={showRegPw ? "text" : "password"} placeholder="Min 8 chars" required autoComplete="new-password"
                          value={regForm.password}
                          onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                          className="w-full pl-9 pr-8 py-2.5 rounded-lg text-sm text-white placeholder-white/25 outline-none transition-all"
                          style={inputStyle}
                        />
                        <button type="button" onClick={() => setShowRegPw(!showRegPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                          {showRegPw ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/55 text-xs mb-1.5 tracking-wider uppercase" style={labelStyle}>Confirm</label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                        <input
                          type={showConfirmPw ? "text" : "password"} placeholder="Repeat" required autoComplete="new-password"
                          value={regForm.confirmPassword}
                          onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                          className="w-full pl-9 pr-8 py-2.5 rounded-lg text-sm text-white placeholder-white/25 outline-none transition-all"
                          style={inputStyle}
                        />
                        <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                          {showConfirmPw ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Marketing opt-in */}
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={regForm.marketingOptIn}
                      onChange={(e) => setRegForm({ ...regForm, marketingOptIn: e.target.checked })}
                      className="w-4 h-4 rounded accent-cyan-400 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-white/40 text-xs group-hover:text-white/55 transition-colors leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                      I want to receive updates on new products, restocks, and promotions.
                    </span>
                  </label>

                  {/* Error */}
                  {regError && (
                    <div className="rounded-lg p-3" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
                      <p className="text-red-400 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{regError}</p>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit" disabled={registerMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold tracking-wider uppercase text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
                    style={{
                      background: registerMutation.isPending ? "oklch(0.22 0.06 255 / 0.8)" : "oklch(0.18 0.06 255)",
                      color: "white",
                      fontFamily: "'Rajdhani', sans-serif", fontWeight: 700,
                      border: "1px solid oklch(0.72 0.18 210 / 0.3)",
                    }}
                  >
                    {registerMutation.isPending ? (
                      <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                    ) : (
                      <>CREATE ACCOUNT <ArrowRight size={16} /></>
                    )}
                  </button>

                  <p className="text-white/25 text-xs text-center leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                    By creating an account you agree to our{" "}
                    <a href="/terms" className="hover:underline" style={{ color: "oklch(0.72 0.18 210 / 0.7)" }}>Terms of Service</a>
                    {" "}and{" "}
                    <a href="/privacy" className="hover:underline" style={{ color: "oklch(0.72 0.18 210 / 0.7)" }}>Privacy Policy</a>.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-8 mt-8">
          {["US-Based Support", "Research Use Only", "Secure Checkout"].map((badge) => (
            <div key={badge} className="flex items-center gap-1.5">
              <CheckCircle size={13} style={{ color: "oklch(0.72 0.18 210 / 0.6)" }} />
              <span className="text-white/30 text-xs tracking-wider uppercase" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
                {badge}
              </span>
            </div>
          ))}
        </div>

        <p className="text-center text-white/20 text-xs mt-4" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          Questions? Text us at (310) 975-9289 or email support@laelitepeps.com
        </p>
      </div>
    </div>
  );
}
