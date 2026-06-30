// === LA ELITE PEPTIDES — Email Verification Page ===
// Handles the ?token= link sent to customer's email

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    setToken(t);
  }, []);

  const verifyMutation = trpc.customer.verifyEmail.useMutation({
    onSuccess: (data) => {
      setStatus("success");
      setMessage(`Your email ${data.email} has been verified. You can now sign in.`);
    },
    onError: (err) => {
      setStatus("error");
      setMessage(err.message);
    },
  });

  useEffect(() => {
    if (token && !verifyMutation.isPending && !verifyMutation.isSuccess && !verifyMutation.isError) {
      verifyMutation.mutate({ token });
    } else if (token === null && token !== undefined) {
      setStatus("error");
      setMessage("No verification token found. Please check your email link.");
    }
  }, [token]);

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
            borderColor: "oklch(0.72 0.18 210 / 0.2)",
            boxShadow: "0 0 60px oklch(0.72 0.18 210 / 0.06)",
          }}
        >
          {/* Logo text */}
          <div className="mb-8">
            <span className="text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", letterSpacing: "0.1em" }}>
              LA ELITE
            </span>
            <span className="block tracking-[0.35em] text-xs uppercase mt-0.5" style={{ color: "oklch(0.72 0.18 210)", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
              PEPTIDES
            </span>
          </div>

          {status === "loading" && (
            <>
              <Loader2 size={48} className="mx-auto mb-4 animate-spin" style={{ color: "oklch(0.72 0.18 210)" }} />
              <h2 className="text-white mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.06em" }}>
                VERIFYING EMAIL
              </h2>
              <p className="text-white/50 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                Please wait a moment...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "#22c55e" }} />
              <h2 className="text-white mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.06em" }}>
                EMAIL VERIFIED
              </h2>
              <p className="text-white/60 text-sm mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                {message}
              </p>
              <button
                onClick={() => setLocation("/login")}
                className="w-full py-3 rounded-xl font-bold tracking-wider uppercase text-sm transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, oklch(0.72 0.18 210), oklch(0.65 0.2 220))",
                  color: "oklch(0.09 0.04 255)",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                }}
              >
                SIGN IN NOW →
              </button>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle size={48} className="mx-auto mb-4" style={{ color: "#ef4444" }} />
              <h2 className="text-white mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.06em" }}>
                VERIFICATION FAILED
              </h2>
              <p className="text-white/60 text-sm mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                {message}
              </p>
              <button
                onClick={() => setLocation("/register")}
                className="w-full py-3 rounded-xl font-bold tracking-wider uppercase text-sm transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: "oklch(0.72 0.18 210 / 0.15)",
                  border: "1px solid oklch(0.72 0.18 210 / 0.3)",
                  color: "oklch(0.72 0.18 210)",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                }}
              >
                BACK TO REGISTER
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
