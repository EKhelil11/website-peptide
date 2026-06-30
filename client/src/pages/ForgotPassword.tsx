// === LA ELITE PEPTIDES — Forgot Password Page ===

import { useState } from "react";
import { Link } from "wouter";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const forgotMutation = trpc.customer.forgotPassword.useMutation({
    onSuccess: () => setSent(true),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotMutation.mutate({ email, origin: window.location.origin });
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
            <div className="inline-flex flex-col items-center gap-1 cursor-pointer">
              <span className="text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.1em" }}>LA ELITE</span>
              <span className="tracking-[0.35em] text-xs uppercase" style={{ color: "oklch(0.72 0.18 210)", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>PEPTIDES</span>
            </div>
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
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "#22c55e" }} />
              <h2 className="text-white mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.06em" }}>CHECK YOUR EMAIL</h2>
              <p className="text-white/55 text-sm mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                If an account exists for <strong style={{ color: "oklch(0.72 0.18 210)" }}>{email}</strong>, we sent a password reset link. It expires in 2 hours.
              </p>
              <Link href="/login">
                <span className="text-sm cursor-pointer hover:underline" style={{ color: "oklch(0.72 0.18 210)", fontFamily: "'Inter', sans-serif" }}>
                  ← Back to Sign In
                </span>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <h1 className="text-white mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.06em" }}>FORGOT PASSWORD</h1>
                <p className="text-white/45 text-sm" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                      style={{ background: "oklch(0.11 0.04 255)", border: "1px solid oklch(0.72 0.18 210 / 0.15)", fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold tracking-wider uppercase text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.72 0.18 210), oklch(0.65 0.2 220))",
                    color: "oklch(0.09 0.04 255)",
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  {forgotMutation.isPending ? (
                    <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
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
