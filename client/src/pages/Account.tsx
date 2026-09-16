// === ELITE LA PEPTIDES — Account Dashboard ===
// Shows user's order history and account info

import { useEffect } from "react";
import { useLocation } from "wouter";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { trpc } from "@/lib/trpc";
import { ShoppingBag, Package, Clock, CheckCircle, Truck, XCircle, ArrowLeft, LogOut } from "lucide-react";
import { PRIMARY_LOGO_ALT, PRIMARY_LOGO_URL, UTILITY_LOGO_SIZE_CLASS } from "@/lib/brandAssets";

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  pending_payment: { label: "Pending Payment", icon: Clock, color: "#8A5A00" },
  paid:            { label: "Paid", icon: CheckCircle, color: "#2D6C47" },
  processing:      { label: "Processing", icon: Package, color: "#174A9B" },
  shipped:         { label: "Shipped", icon: Truck, color: "#2D6C47" },
  delivered:       { label: "Delivered", icon: CheckCircle, color: "#2D6C47" },
  cancelled:       { label: "Cancelled", icon: XCircle, color: "#A13939" },
};

const ACCOUNT_PAGE_STYLE = {
  background: "radial-gradient(circle at 12% 0%, rgba(36,95,193,0.08), transparent 30rem), linear-gradient(145deg, #F6F1E9 0%, #E9DCCB 58%, #DDD2C5 100%)",
};

const ACCOUNT_PANEL_STYLE = {
  background: "linear-gradient(145deg, rgba(255,253,248,0.96), rgba(246,241,233,0.92))",
  border: "1px solid rgba(185,192,202,0.78)",
  boxShadow: "0 18px 48px rgba(7,21,47,0.11), inset 0 1px 0 rgba(255,255,255,0.95)",
};

export default function Account() {
  const { customer, isLoading, logout } = useCustomerAuth();
  const [, setLocation] = useLocation();
  const integrationStatus = trpc.integrations.status.useQuery();
  const emailConfigured = integrationStatus.data?.email.configured ?? false;
  const fulfillmentConfigured = integrationStatus.data?.shipstation.configured ?? false;

  useEffect(() => {
    if (!isLoading && !customer) {
      setLocation("/login");
    }
  }, [customer, isLoading]);

  const ordersQuery = trpc.orders.myOrders.useQuery(undefined, {
    enabled: !!customer,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={ACCOUNT_PAGE_STYLE}>
        <div className="text-[#10295E] text-base tracking-[0.16em] uppercase" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>Preparing Your Account...</div>
      </div>
    );
  }

  if (!customer) return null;

  const orders = ordersQuery.data ?? [];

  return (
    <div className="min-h-screen text-[#202833]" style={ACCOUNT_PAGE_STYLE}>
      {/* Top Nav */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(246, 241, 233, 0.94)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(185, 192, 202, 0.72)",
          boxShadow: "0 8px 30px rgba(7,21,47,0.08)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setLocation("/shop")} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#B9C0CA]/80 text-[#5F6977] hover:border-[#174A9B]/45 hover:text-[#174A9B] transition-colors" aria-label="Return to shop">
              <ArrowLeft size={20} />
            </button>
            <img src={PRIMARY_LOGO_URL} alt={PRIMARY_LOGO_ALT} className={UTILITY_LOGO_SIZE_CLASS} />
          </div>
          <button
            onClick={logout}
            className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-[#5F6977] hover:bg-white/55 hover:text-[#174A9B] transition-colors text-sm"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[#174A9B] text-xs uppercase tracking-[0.2em] mb-2" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>Customer dashboard</p>
          <h1
            className="text-5xl sm:text-6xl text-[#10295E] mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650, letterSpacing: "0.035em" }}
          >
            My Account
          </h1>
          <p className="text-[#4B5563] text-base break-words" style={{ fontFamily: "'Inter', sans-serif" }}>
            {customer.firstName} {customer.lastName} · {customer.email}
          </p>
          {customer.partnerCode === "RECROOMLV" && customer.partnerDiscountBps === 1000 && (
            <div className="mt-4 w-fit max-w-full rounded-xl border border-[#174A9B]/25 bg-[#174A9B]/[0.07] px-4 py-3">
              <p className="text-[#10295E] text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>RECROOMLV partner benefit active</p>
              <p className="mt-1 text-[#4B5563] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>Your 10% merchandise discount applies automatically to future orders.</p>
            </div>
          )}
        </div>

        {!integrationStatus.isLoading && (!emailConfigured || !fulfillmentConfigured) && (
          <div
            className="rounded-xl px-5 py-4 mb-8"
            style={{ background: "rgba(255,184,0,0.08)", border: "1px solid rgba(255,184,0,0.3)" }}
          >
            <p className="text-sm font-bold uppercase tracking-wider" style={{ color: "#B9C0CA", fontFamily: "'Rajdhani', sans-serif" }}>
              Relaunch Integration Notice
            </p>
            <p className="text-[#4B5563] text-sm mt-1 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Automated email and fulfillment updates are temporarily disabled pending reauthorization and owner approval. Order records and status changes remain visible on this page; contact support if you need a manual update.
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <button
            onClick={() => setLocation("/shop")}
            className="flex min-h-[118px] items-center gap-4 rounded-2xl p-5 text-left transition-all hover:translate-y-[-1px]"
            style={{
              ...ACCOUNT_PANEL_STYLE,
              background: "linear-gradient(135deg, rgba(255,253,248,0.96), rgba(233,220,203,0.82))",
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(145deg, #245FC1, #10295E)", border: "1px solid #B9C0CA", boxShadow: "0 8px 20px rgba(7,21,47,0.18)" }}
            >
              <ShoppingBag size={20} style={{ color: "#F6F1E9" }} />
            </div>
            <div>
              <p className="text-[#10295E] text-2xl leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>
                Place New Order
              </p>
              <p className="text-[#5F6977] text-sm mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                Browse our full catalog
              </p>
            </div>
          </button>

          <div
            className="flex min-h-[118px] items-center gap-4 rounded-2xl p-5"
            style={ACCOUNT_PANEL_STYLE}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(145deg, #245FC1, #10295E)", border: "1px solid #B9C0CA", boxShadow: "0 8px 20px rgba(7,21,47,0.18)" }}
            >
              <Package size={20} style={{ color: "#F6F1E9" }} />
            </div>
            <div>
              <p className="text-[#10295E] text-2xl leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>
                <span className="mr-1.5">{orders.length}</span> Total Orders
              </p>
              <p className="text-[#5F6977] text-sm mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                Questions? Text (310) 975-9289
              </p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div>
          <h2
            className="text-4xl text-[#10295E] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650, letterSpacing: "0.035em" }}
          >
            Order History
          </h2>

          {ordersQuery.isLoading ? (
            <div className="text-[#5F6977] text-sm py-8 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div
              className="rounded-xl p-10 text-center"
              style={{
                ...ACCOUNT_PANEL_STYLE,
              }}
            >
              <Package size={40} className="mx-auto mb-4 text-[#7C8693]" />
              <p className="text-[#4B5563] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                No orders yet. Ready to place your first order?
              </p>
              <button
                onClick={() => setLocation("/shop")}
                className="px-6 py-2.5 rounded-lg font-bold text-sm tracking-widest uppercase transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, oklch(0.55 0.14 255), oklch(0.44 0.13 255))",
                  color: "white",
                  fontFamily: "'Rajdhani', sans-serif",
                }}
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending_payment;
                const StatusIcon = statusCfg.icon;

                return (
                  <div
                    key={order.id}
                    className="rounded-xl p-5"
                    style={{
                      ...ACCOUNT_PANEL_STYLE,
                    }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <p
                          className="text-[#10295E] text-2xl"
                          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650, letterSpacing: "0.035em" }}
                        >
                          {order.orderNumber || `Order #${order.id}`}
                        </p>
                        <p className="text-[#5F6977] text-sm mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric", month: "long", day: "numeric"
                          })}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {/* Order status badge */}
                        <span
                          className="flex min-h-9 items-center gap-1.5 px-3 py-1 rounded-full text-sm uppercase tracking-[0.1em]"
                          style={{
                            background: `${statusCfg.color}18`,
                            border: `1px solid ${statusCfg.color}40`,
                            color: statusCfg.color,
                            fontFamily: "'Rajdhani', sans-serif",
                            fontWeight: 800,
                          }}
                        >
                          <StatusIcon size={11} />
                          {statusCfg.label}
                        </span>
                        {order.partnerCode && (
                          <span
                            className="flex min-h-9 items-center rounded-full border border-[#174A9B]/25 bg-[#174A9B]/[0.07] px-3 py-1 text-sm uppercase tracking-[0.1em] text-[#174A9B]"
                            style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}
                          >
                            {order.partnerCode}
                          </span>
                        )}
  
                      </div>
                    </div>

                    {/* Shipping address */}
                    <p className="text-[#4B5563] text-sm sm:text-base leading-relaxed mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <span className="text-[#174A9B] font-semibold">Ship to:</span> {order.shipAddress}, {order.shipCity}, {order.shipState} {order.shipZip}
                    </p>

                    {/* Tracking */}
                    {order.trackingNumber && (
                      <div
                        className="flex items-center gap-2 rounded-lg px-3 py-2 mb-3 text-xs"
                        style={{
                          background: "oklch(0.65 0.2 145 / 10%)",
                          border: "1px solid oklch(0.65 0.2 145 / 30%)",
                          color: "oklch(0.65 0.2 145)",
                          fontFamily: "'Rajdhani', sans-serif",
                        }}
                      >
                        <Truck size={12} />
                        Tracking: <strong>{order.trackingNumber}</strong>
                      </div>
                    )}

                    {/* Total */}
                    {(order.discountCents ?? 0) > 0 && (
                      <div className="mb-2 flex justify-between items-center text-[#174A9B]">
                        <span className="text-sm uppercase tracking-[0.12em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}>
                          Partner discount (10%)
                        </span>
                        <span className="text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}>
                          -${((order.discountCents ?? 0) / 100).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: "rgba(185,192,202,0.72)" }}>
                      <span className="text-[#4B5563] text-sm uppercase tracking-[0.12em]" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 750 }}>
                        Order Total
                      </span>
                      <span
                        className="text-[#10295E] text-3xl"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 650 }}
                      >
                        ${((order.totalCents ?? 0) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Contact footer */}
        <div className="mt-10 text-center">
          <p className="text-[#4B5563] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
            Questions about your order?
          </p>
          <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            <a href="sms:(310)975-9289" className="text-[#174A9B] font-semibold hover:text-[#10295E] transition-colors">
              Text (310) 975-9289
            </a>
            <span className="hidden sm:inline text-[#7C8693]">or</span>
            <a href="mailto:support@laelitepeps.com" className="text-[#174A9B] font-semibold hover:text-[#10295E] transition-colors break-words">
              support@laelitepeps.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
