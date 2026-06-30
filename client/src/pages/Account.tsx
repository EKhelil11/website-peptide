// === ELITE LA PEPTIDES — Account Dashboard ===
// Shows user's order history and account info

import { useEffect } from "react";
import { useLocation } from "wouter";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { trpc } from "@/lib/trpc";
import { ShoppingBag, Package, Clock, CheckCircle, Truck, XCircle, ArrowLeft, LogOut } from "lucide-react";

const LOGO_URL = "/manus-storage/LAELITELOGONEW_dark_bg_2eaa3f51.png";

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  pending_payment: { label: "Pending Payment", icon: Clock, color: "oklch(0.75 0.15 80)" },
  paid:            { label: "Paid", icon: CheckCircle, color: "oklch(0.65 0.2 145)" },
  processing:      { label: "Processing", icon: Package, color: "oklch(0.72 0.18 210)" },
  shipped:         { label: "Shipped", icon: Truck, color: "oklch(0.65 0.2 145)" },
  delivered:       { label: "Delivered", icon: CheckCircle, color: "oklch(0.65 0.2 145)" },
  cancelled:       { label: "Cancelled", icon: XCircle, color: "oklch(0.6 0.15 25)" },
};

export default function Account() {
  const { customer, isLoading, logout } = useCustomerAuth();
  const [, setLocation] = useLocation();

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.12 0.05 255)" }}>
        <div className="text-white/50 text-sm tracking-widest uppercase" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Loading...</div>
      </div>
    );
  }

  if (!customer) return null;

  const orders = ordersQuery.data ?? [];

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.12 0.05 255)" }}>
      {/* Top Nav */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "oklch(0.15 0.055 255 / 95%)",
          backdropFilter: "blur(20px)",
          borderColor: "oklch(0.28 0.08 255 / 40%)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setLocation("/shop")} className="text-white/50 hover:text-[#00BFFF] transition-colors">
              <ArrowLeft size={20} />
            </button>
            <img src={LOGO_URL} alt="LA Elite Peptides" className="h-14 w-auto max-w-[260px]" />
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl sm:text-5xl text-white mb-2"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
          >
            My Account
          </h1>
          <p className="text-white/50 text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            {customer.firstName} {customer.lastName} · {customer.email}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <button
            onClick={() => setLocation("/shop")}
            className="flex items-center gap-4 rounded-xl p-5 text-left transition-all hover:translate-y-[-1px]"
            style={{
              background: "linear-gradient(135deg, oklch(0.6 0.27 0 / 20%), oklch(0.55 0.25 355 / 10%))",
              border: "1px solid oklch(0.6 0.27 0 / 40%)",
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "oklch(0.6 0.27 0 / 20%)" }}
            >
              <ShoppingBag size={20} style={{ color: "oklch(0.6 0.27 0)" }} />
            </div>
            <div>
              <p className="text-white font-bold text-sm uppercase tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Place New Order
              </p>
              <p className="text-white/40 text-xs" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Browse our full catalog
              </p>
            </div>
          </button>

          <div
            className="flex items-center gap-4 rounded-xl p-5"
            style={{
              background: "oklch(0.17 0.055 255)",
              border: "1px solid oklch(0.28 0.08 255 / 50%)",
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "oklch(0.72 0.18 210 / 15%)" }}
            >
              <Package size={20} style={{ color: "oklch(0.72 0.18 210)" }} />
            </div>
            <div>
              <p className="text-white font-bold text-sm uppercase tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                {orders.length} Total Orders
              </p>
              <p className="text-white/40 text-xs" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Questions? Text (310) 975-9289
              </p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div>
          <h2
            className="text-2xl text-white mb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
          >
            Order History
          </h2>

          {ordersQuery.isLoading ? (
            <div className="text-white/40 text-sm py-8 text-center" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div
              className="rounded-xl p-10 text-center"
              style={{
                background: "oklch(0.17 0.055 255)",
                border: "1px solid oklch(0.28 0.08 255 / 40%)",
              }}
            >
              <Package size={40} className="mx-auto mb-4 text-white/20" />
              <p className="text-white/50 mb-4" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                No orders yet. Ready to place your first order?
              </p>
              <button
                onClick={() => setLocation("/shop")}
                className="px-6 py-2.5 rounded-lg font-bold text-sm tracking-widest uppercase transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, oklch(0.65 0.22 210), oklch(0.55 0.20 230))",
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
                      background: "oklch(0.17 0.055 255)",
                      border: "1px solid oklch(0.28 0.08 255 / 50%)",
                    }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <p
                          className="text-white font-bold text-lg"
                          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
                        >
                          {order.orderNumber || `Order #${order.id}`}
                        </p>
                        <p className="text-white/40 text-xs" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric", month: "long", day: "numeric"
                          })}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {/* Order status badge */}
                        <span
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                          style={{
                            background: `${statusCfg.color}18`,
                            border: `1px solid ${statusCfg.color}40`,
                            color: statusCfg.color,
                            fontFamily: "'Rajdhani', sans-serif",
                          }}
                        >
                          <StatusIcon size={11} />
                          {statusCfg.label}
                        </span>
  
                      </div>
                    </div>

                    {/* Shipping address */}
                    <p className="text-white/40 text-xs mb-3" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                      📦 {order.shipAddress}, {order.shipCity}, {order.shipState} {order.shipZip}
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
                    <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: "oklch(0.28 0.08 255 / 30%)" }}>
                      <span className="text-white/50 text-xs uppercase tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                        Order Total
                      </span>
                      <span
                        className="text-white font-bold text-xl"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
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
          <p className="text-white/30 text-xs" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Questions about your order? Text us at{" "}
            <a href="sms:(310)975-9289" className="text-white/50 hover:text-[#00BFFF] transition-colors">
              (310) 975-9289
            </a>{" "}
            or email{" "}
            <a href="mailto:support@laelitepeps.com" className="text-white/50 hover:text-[#00BFFF] transition-colors">
              support@laelitepeps.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
