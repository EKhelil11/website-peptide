// === LA ELITE PEPTIDES — Reset Password Page ===

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { AUTH_LOGO_SIZE_CLASS, PRIMARY_LOGO_ALT, PRIMARY_LOGO_URL } from "@/lib/brandAssets";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [token, setToken] = useState<string>("");
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token") ?? "";
    setToken(t);
  }, []);

  const resetMutation = trpc.customer.resetPassword.useMutation({
    onSuccess: () => setSuccess(true),
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    resetMutation.mutate({ token, password: form.password });
  };

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
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <img src={PRIMARY_LOGO_URL} alt={PRIMARY_LOGO_ALT} className={`${AUTH_LOGO_SIZE_CLASS} mx-auto cursor-pointer`} />
          </Link>
        </div>

        <div
          className="rounded-2xl p-8 border"
          style={{
            background: "oklch(0.13 0.055 255 / 0.95)",
            borderColor: "oklch(0.72 0.18 210 / 0.2)",
            boxShadow: "0 0 60px oklch(0.72 0.18 210 / 0.06)",
          }}
        >
          {success ? (
            <div className="text-center py-4">
              <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "#22c55e" }} />
              <h2 className="text-white mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.06em" }}>PASSWORD UPDATED</h2>
              <p className="text-white/55 text-sm mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                Your password has been reset successfully. You can now sign in with your new password.
              </p>
              <button
                onClick={() => setLocation("/login")}
                className="w-full py-3 rounded-xl font-bold tracking-wider uppercase text-sm"
                style={{
                  background: "linear-gradient(135deg, oklch(0.72 0.18 210), oklch(0.65 0.2 220))",
                  color: "oklch(0.09 0.04 255)",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                }}
              >
                SIGN IN NOW →
              </button>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <h1 className="text-white mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.06em" }}>RESET PASSWORD</h1>
                <p className="text-white/45 text-sm" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                  Enter your new password below.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: "New Password", field: "password" as const, show: showPassword, toggle: () => setShowPassword(!showPassword), placeholder: "Min. 8 characters" },
                  { label: "Confirm Password", field: "confirm" as const, show: showConfirm, toggle: () => setShowConfirm(!showConfirm), placeholder: "Repeat password" },
                ].map(({ label, field, show, toggle, placeholder }) => (
                  <div key={field}>
                    <label className="block text-white/55 text-xs mb-1.5 tracking-wider uppercase" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
                      {label}
                    </label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                      <input
                        type={show ? "text" : "password"}
                        placeholder={placeholder}
                        required
                        value={form[field]}
                        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                        className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm text-white placeholder-white/25 outline-none"
                        style={{ background: "oklch(0.11 0.04 255)", border: "1px solid oklch(0.72 0.18 210 / 0.15)", fontFamily: "'Inter', sans-serif" }}
                      />
                      <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                        {show ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                ))}

                {error && (
                  <div className="rounded-lg p-3" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
                    <p className="text-red-400 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={resetMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold tracking-wider uppercase text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.72 0.18 210), oklch(0.65 0.2 220))",
                    color: "oklch(0.09 0.04 255)",
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  {resetMutation.isPending ? (
                    <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <>SET NEW PASSWORD <ArrowRight size={16} /></>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
