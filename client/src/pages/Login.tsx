// === LA ELITE PEPTIDES — Combined Login + Register Page ===
// Typography matches Checkout.tsx: Cormorant Garamond headings, Rajdhani labels/inputs, cyan CTA buttons

import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Eye, EyeOff, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { AUTH_LOGO_SIZE_CLASS, PRIMARY_LOGO_ALT, PRIMARY_LOGO_URL } from "@/lib/brandAssets";

// Matches CYAN_BTN from Checkout.tsx exactly
const CYAN_BTN: React.CSSProperties = {
  background: "linear-gradient(135deg, oklch(0.55 0.14 255), oklch(0.44 0.13 255))",
  boxShadow: "0 4px 24px oklch(0.55 0.14 255 / 40%)",
  color: "white",
  fontFamily: "'Rajdhani', sans-serif",
  letterSpacing: "0.14em",
};

// Matches input style from Checkout.tsx
const INPUT_STYLE: React.CSSProperties = {
  background: "oklch(0.29 0.085 255)",
  border: "1px solid oklch(0.44 0.13 255 / 60%)",
  color: "white",
  fontFamily: "'Rajdhani', sans-serif",
  fontWeight: 600,
};

// Matches label style from Checkout.tsx
const LABEL_CLASS = "block mb-2 text-base font-bold uppercase tracking-widest";
const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "'Rajdhani', sans-serif",
  color: "oklch(0.76 0.02 250)",
};

// Matches input class from Checkout.tsx
const INPUT_CLASS = "w-full px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#B9C0CA]/40 text-lg";

export default function Login() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  // Read ?returnTo= param so we can redirect back after login
  const returnTo = new URLSearchParams(search).get("returnTo") || "/";

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
  const { data: integrationStatus } = trpc.integrations.status.useQuery(undefined, { retry: false });
  const emailRegistrationEnabled = integrationStatus?.email.configured === true;
  const utils = trpc.useUtils();

  useEffect(() => {
    if (!checkingSession && customer) setLocation(returnTo);
  }, [customer, checkingSession, setLocation, returnTo]);

  // ── Mutations ─────────────────────────────────────────────────────────────
  const loginMutation = trpc.customer.login.useMutation({
    onSuccess: async () => {
      await utils.customer.me.invalidate();
      setLocation(returnTo);
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
    if (!emailRegistrationEnabled) {
      setRegError("New account registration is temporarily disabled while transactional email is reauthorized.");
      return;
    }
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

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.18 0.055 255)" }}
    >
      {/* Top Nav — matches Checkout.tsx header exactly */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ background: "oklch(0.25 0.08 255 / 95%)", backdropFilter: "blur(20px)", borderColor: "oklch(0.32 0.10 255 / 40%)" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-24 flex items-center gap-3 sm:gap-4">
          <a href="/" className="shrink-0 whitespace-nowrap text-white/50 hover:text-[#B9C0CA] transition-colors text-xs sm:text-base font-bold uppercase tracking-[0.12em] sm:tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            ← Back to Site
          </a>
          <img src={PRIMARY_LOGO_URL} alt={PRIMARY_LOGO_ALT} decoding="async" className={`${AUTH_LOGO_SIZE_CLASS} !w-[170px] sm:!w-[300px] ml-auto`} />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Compliance banner */}
        <div
          className="flex items-start gap-3 rounded-xl px-4 sm:px-5 py-4 mb-8"
          style={{ background: "oklch(0.55 0.14 255 / 10%)", border: "1px solid oklch(0.55 0.14 255 / 25%)" }}
        >
          <ShieldCheck size={20} style={{ color: "oklch(0.76 0.02 250)", flexShrink: 0 }} />
          <p className="text-white/70 text-sm sm:text-base leading-relaxed" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
            An account is required to add products to cart and complete checkout. Catalog pricing is available publicly. All products are sold strictly for{" "}
            <span className="text-white font-bold">research use only</span> — not for human consumption.
          </p>
        </div>

        {/* Side-by-side cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── LOGIN CARD ─────────────────────────────────────────────── */}
          <div
            className="rounded-2xl p-5 sm:p-8 border"
            style={{
              background: "oklch(0.25 0.08 255)",
              borderColor: "oklch(0.32 0.10 255 / 50%)",
            }}
          >
            <div className="mb-7">
              <h2 className="text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.8rem", letterSpacing: "0.06em" }}>
                SIGN IN
              </h2>
              <p className="text-white/50 text-lg" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
                Access your existing account.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className={LABEL_CLASS} style={LABEL_STYLE}>
                  Email Address
                </label>
                <input
                  type="email" placeholder="you@example.com" required autoComplete="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className={INPUT_CLASS}
                  style={INPUT_STYLE}
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={LABEL_CLASS} style={LABEL_STYLE}>Password</label>
                  <a href="/forgot-password" className="text-sm sm:text-base font-bold hover:underline" style={{ color: "oklch(0.76 0.02 250)", fontFamily: "'Rajdhani', sans-serif" }}>
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPw ? "text" : "password"} placeholder="Your password" required autoComplete="current-password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className={`${INPUT_CLASS} pr-12`}
                    style={INPUT_STYLE}
                  />
                  <button type="button" onClick={() => setShowLoginPw(!showLoginPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                    {showLoginPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={loginForm.rememberMe}
                  onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                  className="w-5 h-5 rounded accent-[#B9C0CA]"
                />
                <span className="text-white/60 text-base group-hover:text-white/80 transition-colors font-semibold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  Remember me for 30 days
                </span>
              </label>

              {/* Error */}
              {loginError && (
                <div className="rounded-xl px-5 py-4 text-base font-semibold" style={{ background: "oklch(0.4 0.2 25 / 20%)", border: "1px solid oklch(0.5 0.2 25 / 40%)", color: "oklch(0.8 0.15 25)", fontFamily: "'Rajdhani', sans-serif" }}>
                  {loginError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit" disabled={loginMutation.isPending}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-xl tracking-widest uppercase transition-all duration-200 active:scale-[0.98] disabled:opacity-60 hover:opacity-90"
                style={{ ...CYAN_BTN, fontSize: "1.2rem" }}
              >
                {loginMutation.isPending ? (
                  <span className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <>SIGN IN <ArrowRight size={18} /></>
                )}
              </button>
            </form>
          </div>

          {/* ── REGISTER CARD ──────────────────────────────────────────── */}
          <div
            className="rounded-2xl p-5 sm:p-8 border"
            style={{
              background: "oklch(0.25 0.08 255)",
              borderColor: "oklch(0.32 0.10 255 / 50%)",
            }}
          >
            {regSuccess ? (
              /* ── Success state ── */
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <CheckCircle size={56} className="mb-5" style={{ color: "oklch(0.76 0.02 250)" }} />
                <h2 className="text-white mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.8rem", letterSpacing: "0.06em" }}>
                  CHECK YOUR EMAIL
                </h2>
                <p className="text-white/60 text-lg leading-relaxed max-w-xs" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
                  We sent a verification link to <span className="text-white font-bold">{regForm.email}</span>. Click it to activate your account and start shopping.
                </p>
                <p className="text-white/35 text-base mt-4" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  Didn't receive it? Check your spam folder.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-7">
                  <h2 className="text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.8rem", letterSpacing: "0.06em" }}>
                    CREATE ACCOUNT
                  </h2>
                  <p className="text-white/50 text-lg" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
                    Free account — add products to cart and complete checkout.
                  </p>
                </div>

                {!emailRegistrationEnabled && (
                  <div
                    className="rounded-xl px-5 py-4 mb-5 text-base font-semibold"
                    style={{
                      background: "oklch(0.72 0.16 75 / 12%)",
                      border: "1px solid oklch(0.72 0.16 75 / 35%)",
                      color: "oklch(0.84 0.13 80)",
                      fontFamily: "'Rajdhani', sans-serif",
                    }}
                  >
                    New account registration is temporarily disabled while transactional email is reauthorized.
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                  {/* Name row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className={LABEL_CLASS} style={LABEL_STYLE}>First Name</label>
                      <input
                        type="text" placeholder="John" required
                        value={regForm.firstName}
                        onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })}
                        className={INPUT_CLASS}
                        style={INPUT_STYLE}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS} style={LABEL_STYLE}>Last Name</label>
                      <input
                        type="text" placeholder="Doe" required
                        value={regForm.lastName}
                        onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })}
                        className={INPUT_CLASS}
                        style={INPUT_STYLE}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className={LABEL_CLASS} style={LABEL_STYLE}>Email Address</label>
                    <input
                      type="email" placeholder="you@example.com" required autoComplete="email"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className={INPUT_CLASS}
                      style={INPUT_STYLE}
                    />
                  </div>

                  {/* Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className={LABEL_CLASS} style={LABEL_STYLE}>Password</label>
                      <div className="relative">
                        <input
                          type={showRegPw ? "text" : "password"} placeholder="Min 8 chars" required autoComplete="new-password"
                          value={regForm.password}
                          onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                          className={`${INPUT_CLASS} pr-12`}
                          style={INPUT_STYLE}
                        />
                        <button type="button" onClick={() => setShowRegPw(!showRegPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                          {showRegPw ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className={LABEL_CLASS} style={LABEL_STYLE}>Confirm</label>
                      <div className="relative">
                        <input
                          type={showConfirmPw ? "text" : "password"} placeholder="Repeat" required autoComplete="new-password"
                          value={regForm.confirmPassword}
                          onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                          className={`${INPUT_CLASS} pr-12`}
                          style={INPUT_STYLE}
                        />
                        <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                          {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Marketing opt-in */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={regForm.marketingOptIn}
                      onChange={(e) => setRegForm({ ...regForm, marketingOptIn: e.target.checked })}
                      className="w-5 h-5 rounded accent-[#B9C0CA] mt-0.5 flex-shrink-0"
                    />
                    <span className="text-white/60 text-base group-hover:text-white/80 transition-colors leading-relaxed font-semibold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                      I want to receive updates on new products, restocks, and promotions.
                    </span>
                  </label>

                  {/* Error */}
                  {regError && (
                    <div className="rounded-xl px-5 py-4 text-base font-semibold" style={{ background: "oklch(0.4 0.2 25 / 20%)", border: "1px solid oklch(0.5 0.2 25 / 40%)", color: "oklch(0.8 0.15 25)", fontFamily: "'Rajdhani', sans-serif" }}>
                      {regError}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit" disabled={registerMutation.isPending || !emailRegistrationEnabled}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-xl tracking-widest uppercase transition-all duration-200 active:scale-[0.98] disabled:opacity-60 hover:opacity-90"
                    style={{
                      background: "oklch(0.29 0.085 255)",
                      color: "white",
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: 700,
                      border: "1px solid oklch(0.55 0.14 255 / 40%)",
                      fontSize: "1.2rem",
                      letterSpacing: "0.14em",
                    }}
                  >
                    {registerMutation.isPending ? (
                      <span className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                    ) : !emailRegistrationEnabled ? (
                      <>REGISTRATION TEMPORARILY DISABLED</>
                    ) : (
                      <>CREATE ACCOUNT <ArrowRight size={18} /></>
                    )}
                  </button>

                  <p className="text-white/35 text-base text-center leading-relaxed" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                    By creating an account you agree to our{" "}
                    <a href="/terms" className="hover:underline font-bold" style={{ color: "oklch(0.76 0.02 250)" }}>Terms of Service</a>
                    {" "}and{" "}
                    <a href="/privacy" className="hover:underline font-bold" style={{ color: "oklch(0.76 0.02 250)" }}>Privacy Policy</a>.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Trust badges — matches Checkout footer style */}
        <div className="flex items-center justify-center gap-8 mt-10 flex-wrap">
          {["US-Based Support", "Research Use Only", "Secure Checkout"].map((badge) => (
            <div key={badge} className="flex items-center gap-2">
              <CheckCircle size={16} style={{ color: "oklch(0.76 0.02 250 / 0.7)" }} />
              <span className="text-white/40 text-base tracking-widest uppercase font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                {badge}
              </span>
            </div>
          ))}
        </div>

        <p className="text-center text-white/30 text-base mt-4" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          Questions? Text us at (310) 975-9289 or email support@laelitepeps.com
        </p>
      </div>
    </div>
  );
}
