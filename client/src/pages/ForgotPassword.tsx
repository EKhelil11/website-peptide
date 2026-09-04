// === LA ELITE PEPTIDES — Forgot Password Page ===

import { useState } from "react";
import { Link } from "wouter";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { AUTH_LOGO_SIZE_CLASS, PRIMARY_LOGO_ALT, PRIMARY_LOGO_URL } from "@/lib/brandAssets";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const integrationStatus = trpc.integrations.status.useQuery();
  const emailConfigured = integrationStatus.data?.email.configured ?? false;

  const forgotMutation = trpc.customer.forgotPassword.useMutation({
    onSuccess: () => setSent(true),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailConfigured) return;
    forgotMutation.mutate({ email, origin: window.location.origin });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "oklch(0.15 0.045 255)" }}
    >
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.91 0.025 80) 1px, transparent 1px), linear-gradient(90deg, oklch(0.91 0.025 80) 1px, transparent 1px)",
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
            background: "oklch(0.22 0.065 255 / 0.95)",
            borderColor: "oklch(0.76 0.02 250 / 0.2)",
            boxShadow: "0 0 60px oklch(0.76 0.02 250 / 0.06)",
          }}
        >
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "#22c55e" }} />
              <h2 className="text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", letterSpacing: "0.06em" }}>CHECK YOUR EMAIL</h2>
              <p className="text-white/55 text-sm mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                If an account exists for <strong style={{ color: "oklch(0.76 0.02 250)" }}>{email}</strong>, we sent a password reset link. It expires in 2 hours.
              </p>
              <Link href="/login">
                <span className="text-sm cursor-pointer hover:underline" style={{ color: "oklch(0.76 0.02 250)", fontFamily: "'Inter', sans-serif" }}>
                  ← Back to Sign In
                </span>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <h1 className="text-white mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", letterSpacing: "0.06em" }}>FORGOT PASSWORD</h1>
                <p className="text-white/45 text-sm" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!integrationStatus.isLoading && !emailConfigured && (
                  <div className="rounded-lg p-3" style={{ background: "rgba(255,184,0,0.08)", border: "1px solid rgba(255,184,0,0.3)" }}>
                    <p className="text-sm" style={{ color: "#B9C0CA", fontFamily: "'Inter', sans-serif" }}>
                      Password recovery is temporarily disabled while transactional email is reauthorized.
                    </p>
                  </div>
                )}
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-white placeholder-white/25 outline-none"
                      style={{ background: "oklch(0.17 0.05 255)", border: "1px solid oklch(0.76 0.02 250 / 0.15)", fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotMutation.isPending || integrationStatus.isLoading || !emailConfigured}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold tracking-wider uppercase text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.76 0.02 250), oklch(0.62 0.02 250))",
                    color: "oklch(0.15 0.045 255)",
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  {forgotMutation.isPending ? (
                    <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : !emailConfigured ? (
                    <>EMAIL RECOVERY DISABLED</>
                  ) : (
                    <>SEND RESET LINK <ArrowRight size={16} /></>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-white/8 text-center">
                <Link href="/login">
                  <span className="text-white/35 text-xs cursor-pointer hover:underline" style={{ fontFamily: "'Inter', sans-serif" }}>
                    ← Back to Sign In
                  </span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
