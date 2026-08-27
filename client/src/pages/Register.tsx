// === LA ELITE PEPTIDES — Customer Registration Page ===
// Wired to real customerRouter backend — no Manus OAuth

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Register() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState<"form" | "verify">("form");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const integrationStatus = trpc.integrations.status.useQuery();
  const emailConfigured = integrationStatus.data?.email.configured ?? false;

  const registerMutation = trpc.customer.register.useMutation({
    onSuccess: () => setStep("verify"),
    onError: (err) => setError(err.message),
  });

  const resendMutation = trpc.customer.resendVerification.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!emailConfigured) {
      setError("Account creation is temporarily unavailable while email verification is being reauthorized.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    registerMutation.mutate({
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      origin: window.location.origin,
    });
  };

  const handleResend = () => {
    resendMutation.mutate({ email: form.email, origin: window.location.origin });
  };

  if (step === "verify") {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "oklch(0.09 0.04 255)" }}
      >
        <div
          className="fixed inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.8 0.1 220) 1px, transparent 1px), linear-gradient(90deg, oklch(0.8 0.1 220) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 w-full max-w-md text-center">
          <div
            className="rounded-2xl p-10 border"
            style={{
              background: "oklch(0.13 0.055 255 / 0.95)",
              borderColor: "oklch(0.72 0.18 210 / 0.3)",
              boxShadow: "0 0 60px oklch(0.72 0.18 210 / 0.08)",
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "oklch(0.72 0.18 210 / 0.15)", border: "1px solid oklch(0.72 0.18 210 / 0.3)" }}
            >
              <Mail size={28} style={{ color: "oklch(0.72 0.18 210)" }} />
            </div>
            <h2
              className="text-white mb-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.06em" }}
            >
              CHECK YOUR EMAIL
            </h2>
            <p className="text-white/55 text-sm mb-2 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
              We sent a verification link to
            </p>
            <p className="mb-6 text-sm font-semibold" style={{ color: "oklch(0.72 0.18 210)", fontFamily: "'Rajdhani', sans-serif" }}>
              {form.email}
            </p>
            <p className="text-white/40 text-xs leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
              Click the link in the email to verify your account. The link expires in 24 hours.
            </p>
            <div className="mt-8 pt-6 border-t border-white/8">
              <p className="text-white/35 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                Didn't receive it?{" "}
                <button
                  className="hover:underline transition-colors"
                  style={{ color: "oklch(0.72 0.18 210)" }}
                  onClick={handleResend}
                  disabled={resendMutation.isPending}
                >
                  {resendMutation.isPending ? "Sending..." : "Resend email"}
                </button>
              </p>
              {resendMutation.isSuccess && (
                <p className="text-green-400 text-xs mt-2">Verification email resent!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "oklch(0.09 0.04 255)" }}
    >
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.8 0.1 220) 1px, transparent 1px), linear-gradient(90deg, oklch(0.8 0.1 220) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex flex-col items-center gap-1 cursor-pointer">
              <span className="text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.1em" }}>
                LA ELITE
              </span>
              <span className="tracking-[0.35em] text-xs uppercase" style={{ color: "oklch(0.72 0.18 210)", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
                PEPTIDES
              </span>
            </div>
          </Link>
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
              CREATE ACCOUNT
            </h1>
            <p className="text-white/45 text-sm" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
              Join LA Elite Peptides for order tracking and exclusive access.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!integrationStatus.isLoading && !emailConfigured && (
              <div className="rounded-lg p-3" style={{ background: "rgba(255,184,0,0.08)", border: "1px solid rgba(255,184,0,0.3)" }}>
                <p className="text-sm" style={{ color: "#FFB800", fontFamily: "'Inter', sans-serif" }}>
                  New account registration is temporarily disabled while transactional email is reauthorized.
                </p>
              </div>
            )}
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "First Name", key: "firstName", placeholder: "John" },
                { label: "Last Name", key: "lastName", placeholder: "Doe" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-white/55 text-xs mb-1.5 tracking-wider uppercase" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
                    {label}
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                    <input
                      type="text"
                      placeholder={placeholder}
                      required
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-white placeholder-white/25 outline-none transition-all"
                      style={{ background: "oklch(0.11 0.04 255)", border: "1px solid oklch(0.72 0.18 210 / 0.15)", fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                </div>
              ))}
            </div>

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
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-white placeholder-white/25 outline-none transition-all"
                  style={{ background: "oklch(0.11 0.04 255)", border: "1px solid oklch(0.72 0.18 210 / 0.15)", fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/55 text-xs mb-1.5 tracking-wider uppercase" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-white/55 text-xs mb-1.5 tracking-wider uppercase" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat password"
                  required
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm text-white placeholder-white/25 outline-none transition-all"
                  style={{ background: "oklch(0.11 0.04 255)", border: "1px solid oklch(0.72 0.18 210 / 0.15)", fontFamily: "'Inter', sans-serif" }}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Research disclaimer */}
            <div
              className="flex items-start gap-2.5 rounded-lg p-3"
              style={{ background: "oklch(0.72 0.18 210 / 0.06)", border: "1px solid oklch(0.72 0.18 210 / 0.12)" }}
            >
              <ShieldCheck size={14} className="flex-shrink-0 mt-0.5" style={{ color: "oklch(0.72 0.18 210)" }} />
              <p className="text-white/45 text-xs leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                By creating an account you confirm you are a qualified researcher and agree that all products are for{" "}
                <strong className="text-white/60">in-vitro research use only</strong>.
              </p>
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
              disabled={registerMutation.isPending || integrationStatus.isLoading || !emailConfigured}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold tracking-wider uppercase text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
              style={{
                background: registerMutation.isPending
                  ? "oklch(0.72 0.18 210 / 0.5)"
                  : "linear-gradient(135deg, oklch(0.72 0.18 210), oklch(0.65 0.2 220))",
                color: "oklch(0.09 0.04 255)",
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                boxShadow: registerMutation.isPending ? "none" : "0 0 24px oklch(0.72 0.18 210 / 0.3)",
              }}
            >
              {registerMutation.isPending ? (
                <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              ) : !emailConfigured ? (
                <>REGISTRATION TEMPORARILY DISABLED</>
              ) : (
                <>CREATE ACCOUNT <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/8 text-center">
            <p className="text-white/35 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
              Already have an account?{" "}
              <Link href="/login">
                <span className="hover:underline cursor-pointer transition-colors" style={{ color: "oklch(0.72 0.18 210)" }}>
                  Sign in
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
