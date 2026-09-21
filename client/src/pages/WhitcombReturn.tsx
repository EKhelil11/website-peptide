import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { CheckCircle, Clock, RefreshCw, XCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { AUTH_LOGO_SIZE_CLASS, PRIMARY_LOGO_ALT, PRIMARY_LOGO_URL } from "@/lib/brandAssets";

const PAGE_STYLE = {
  background: "radial-gradient(circle at 12% 0%, rgba(36,95,193,0.08), transparent 30rem), linear-gradient(145deg, #F6F1E9 0%, #E9DCCB 58%, #DDD2C5 100%)",
};

const PANEL_STYLE = {
  background: "linear-gradient(145deg, rgba(255,253,248,0.97), rgba(246,241,233,0.94))",
  border: "1px solid rgba(185,192,202,0.8)",
  boxShadow: "0 22px 58px rgba(7,21,47,0.13), inset 0 1px 0 rgba(255,255,255,0.95)",
};

export default function WhitcombReturn() {
  const { customer, isLoading } = useCustomerAuth();
  const [, setLocation] = useLocation();
  const started = useRef(false);
  const orderNumber = new URLSearchParams(window.location.search).get("order") ?? "";
  const confirmPayment = trpc.orders.confirmWhitcombReturn.useMutation();

  useEffect(() => {
    if (!isLoading && !customer) {
      setLocation("/login");
      return;
    }
    if (!isLoading && customer && orderNumber && !started.current) {
      started.current = true;
      confirmPayment.mutate({ orderNumber });
    }
  }, [customer, isLoading, orderNumber]);

  const retry = () => confirmPayment.mutate({ orderNumber });
  const paid = confirmPayment.data?.paid === true;
  const cancelled = confirmPayment.data?.status === "cancelled";

  return (
    <div className="min-h-screen px-4 py-8 text-[#202833] sm:py-12" style={PAGE_STYLE}>
      <div className="mx-auto max-w-2xl">
        <img src={PRIMARY_LOGO_URL} alt={PRIMARY_LOGO_ALT} className={`${AUTH_LOGO_SIZE_CLASS} mx-auto mb-8`} />
        <div className="rounded-[1.75rem] p-6 text-center sm:p-10" style={PANEL_STYLE}>
          {isLoading || confirmPayment.isPending ? (
            <>
              <RefreshCw className="mx-auto mb-5 animate-spin text-[#174A9B]" size={48} aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.2em] text-[#174A9B]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}>Secure verification</p>
              <h1 className="mt-2 text-4xl text-[#10295E] sm:text-5xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>Confirming Your Payment</h1>
              <p className="mt-4 text-base leading-relaxed text-[#4B5563]" style={{ fontFamily: "'Inter', sans-serif" }}>We’re checking the payment directly with Whitcomb Payments. Do not close this page.</p>
            </>
          ) : paid ? (
            <>
              <CheckCircle className="mx-auto mb-5 text-[#2D6C47]" size={54} aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.2em] text-[#2D6C47]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}>Payment verified</p>
              <h1 className="mt-2 text-4xl text-[#10295E] sm:text-5xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>Card Payment Confirmed</h1>
              <p className="mt-4 text-base leading-relaxed text-[#4B5563]" style={{ fontFamily: "'Inter', sans-serif" }}>Order <strong className="text-[#10295E]">{orderNumber}</strong> is paid and ready for fulfillment.</p>
            </>
          ) : cancelled ? (
            <>
              <XCircle className="mx-auto mb-5 text-[#A13939]" size={54} aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.2em] text-[#A13939]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}>Payment cancelled</p>
              <h1 className="mt-2 text-4xl text-[#10295E] sm:text-5xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>No Card Charge Confirmed</h1>
              <p className="mt-4 text-base leading-relaxed text-[#4B5563]" style={{ fontFamily: "'Inter', sans-serif" }}>Order <strong className="text-[#10295E]">{orderNumber}</strong> remains unpaid. Contact support if you would like help completing the order.</p>
            </>
          ) : (
            <>
              <Clock className="mx-auto mb-5 text-[#8A5A00]" size={54} aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.2em] text-[#8A5A00]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}>Awaiting confirmation</p>
              <h1 className="mt-2 text-4xl text-[#10295E] sm:text-5xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>Payment Not Yet Confirmed</h1>
              <p className="mt-4 text-base leading-relaxed text-[#4B5563]" style={{ fontFamily: "'Inter', sans-serif" }}>{confirmPayment.error?.message || "Whitcomb has not reported a completed payment yet. If you just paid, wait a moment and check again."}</p>
            </>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {!paid && !cancelled && (
              <button onClick={retry} disabled={confirmPayment.isPending || !orderNumber} className="min-h-12 flex-1 rounded-xl border border-[#174A9B]/30 bg-[#174A9B]/[0.08] px-5 text-sm uppercase tracking-[0.12em] text-[#174A9B] disabled:opacity-50" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}>
                Check Again
              </button>
            )}
            <button onClick={() => setLocation("/account")} className="min-h-12 flex-1 rounded-xl bg-[#10295E] px-5 text-sm uppercase tracking-[0.12em] text-white" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}>
              View My Orders
            </button>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-[#5F6977]" style={{ fontFamily: "'Inter', sans-serif" }}>LA Elite Peptides never receives or stores your card number or security code.</p>
        </div>
      </div>
    </div>
  );
}
