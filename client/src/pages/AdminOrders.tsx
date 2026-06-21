// === ELITE LA PEPTIDES — Admin Orders Dashboard ===
// Admin-only view to manage orders, mark paid, update status

import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Package, CheckCircle, Truck, Clock, XCircle, DollarSign, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const LOGO_URL = "/manus-storage/elite-la-peptides-logo_e9ec855c.png";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "oklch(0.75 0.15 80)" },
  { value: "confirmed", label: "Confirmed", color: "oklch(0.72 0.18 210)" },
  { value: "processing", label: "Processing", color: "oklch(0.72 0.18 210)" },
  { value: "shipped", label: "Shipped", color: "oklch(0.65 0.2 145)" },
  { value: "delivered", label: "Delivered", color: "oklch(0.65 0.2 145)" },
  { value: "cancelled", label: "Cancelled", color: "oklch(0.6 0.15 25)" },
] as const;

const PAYMENT_COLORS: Record<string, string> = {
  awaiting_payment: "oklch(0.75 0.15 80)",
  paid: "oklch(0.65 0.2 145)",
  refunded: "oklch(0.6 0.15 25)",
};

export default function AdminOrders() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const ordersQuery = trpc.orders.adminListOrders.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  const utils = trpc.useUtils();

  const updateStatus = trpc.orders.adminUpdateStatus.useMutation({
    onSuccess: () => {
      utils.orders.adminListOrders.invalidate();
      toast.success("Order status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const markPaid = trpc.orders.adminMarkPaid.useMutation({
    onSuccess: () => {
      utils.orders.adminListOrders.invalidate();
      toast.success("Order marked as paid");
    },
    onError: () => toast.error("Failed to mark as paid"),
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.12 0.05 255)" }}>
        <div className="text-white/50 text-sm tracking-widest uppercase" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.12 0.05 255)" }}>
        <div className="text-center">
          <p className="text-white/50 mb-4" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Admin access required
          </p>
          <button
            onClick={() => setLocation("/")}
            className="text-[#00BFFF] text-sm"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            ← Back to site
          </button>
        </div>
      </div>
    );
  }

  const orders = ordersQuery.data ?? [];
  const pendingCount = orders.filter(o => o.status === "pending").length;
  const awaitingPaymentCount = orders.filter(o => o.paymentStatus === "awaiting_payment").length;

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setLocation("/")} className="text-white/50 hover:text-[#00BFFF] transition-colors">
              <ArrowLeft size={20} />
            </button>
            <img src={LOGO_URL} alt="LA Elite Peptides" className="h-9 w-auto" />
            <span
              className="text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded"
              style={{
                background: "oklch(0.6 0.27 0 / 20%)",
                border: "1px solid oklch(0.6 0.27 0 / 40%)",
                color: "oklch(0.6 0.27 0)",
                fontFamily: "'Rajdhani', sans-serif",
              }}
            >
              Admin
            </span>
          </div>
          <button
            onClick={() => ordersQuery.refetch()}
            className="text-white/40 hover:text-white/70 transition-colors"
            title="Refresh orders"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl sm:text-5xl text-white mb-2"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}
          >
            Order Management
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Orders", value: orders.length, color: "oklch(0.72 0.18 210)" },
            { label: "Pending", value: pendingCount, color: "oklch(0.75 0.15 80)" },
            { label: "Awaiting Payment", value: awaitingPaymentCount, color: "oklch(0.75 0.15 80)" },
            {
              label: "Total Revenue",
              value: `$${orders.filter(o => o.paymentStatus === "paid").reduce((s, o) => s + Number(o.totalAmount), 0).toFixed(2)}`,
              color: "oklch(0.65 0.2 145)",
            },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-xl p-4"
              style={{
                background: "oklch(0.17 0.055 255)",
                border: "1px solid oklch(0.28 0.08 255 / 50%)",
              }}
            >
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                {stat.label}
              </p>
              <p
                className="text-2xl font-bold"
                style={{ fontFamily: "'Bebas Neue', sans-serif", color: stat.color }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Orders Table */}
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
            <p className="text-white/50" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              No orders yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => {
              const isExpanded = expandedOrder === order.id;
              const statusCfg = STATUS_OPTIONS.find(s => s.value === order.status) ?? STATUS_OPTIONS[0];
              const paymentColor = PAYMENT_COLORS[order.paymentStatus] ?? "oklch(0.75 0.15 80)";

              return (
                <div
                  key={order.id}
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: "oklch(0.17 0.055 255)",
                    border: "1px solid oklch(0.28 0.08 255 / 50%)",
                  }}
                >
                  {/* Order Row */}
                  <div
                    className="flex flex-wrap items-center gap-3 px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    {/* Order ID + Date */}
                    <div className="min-w-[100px]">
                      <p className="text-white font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
                        #{order.id}
                      </p>
                      <p className="text-white/40 text-xs" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Customer */}
                    <div className="flex-1 min-w-[140px]">
                      <p className="text-white text-sm font-medium" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                        {order.shipName}
                      </p>
                      <p className="text-white/40 text-xs" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                        {order.shipEmail}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="text-right min-w-[70px]">
                      <p
                        className="text-xl font-bold"
                        style={{ fontFamily: "'Bebas Neue', sans-serif", color: "oklch(0.6 0.27 0)" }}
                      >
                        ${Number(order.totalAmount).toFixed(2)}
                      </p>
                    </div>

                    {/* Status badges */}
                    <div className="flex flex-wrap gap-2">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                        style={{
                          background: `${statusCfg.color}18`,
                          border: `1px solid ${statusCfg.color}40`,
                          color: statusCfg.color,
                          fontFamily: "'Rajdhani', sans-serif",
                        }}
                      >
                        {statusCfg.label}
                      </span>
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                        style={{
                          background: `${paymentColor}18`,
                          border: `1px solid ${paymentColor}40`,
                          color: paymentColor,
                          fontFamily: "'Rajdhani', sans-serif",
                        }}
                      >
                        {order.paymentStatus.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div
                      className="px-5 pb-5 pt-2 border-t space-y-4"
                      style={{ borderColor: "oklch(0.28 0.08 255 / 30%)" }}
                    >
                      {/* Shipping */}
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                          Ship To
                        </p>
                        <p className="text-white text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                          {order.shipName} · {order.shipPhone || "No phone"}<br />
                          {order.shipAddress}, {order.shipCity}, {order.shipState} {order.shipZip}
                        </p>
                      </div>

                      {/* Notes */}
                      {order.notes && (
                        <div>
                          <p className="text-white/40 text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                            Notes
                          </p>
                          <p className="text-white/70 text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                            {order.notes}
                          </p>
                        </div>
                      )}

                      {/* Tracking */}
                      {order.trackingNumber && (
                        <div>
                          <p className="text-white/40 text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                            Tracking
                          </p>
                          <p className="text-[#00BFFF] text-sm font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                            {order.trackingNumber}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {/* Update Status */}
                        <select
                          value={order.status}
                          onChange={e =>
                            updateStatus.mutate({
                              orderId: order.id,
                              status: e.target.value as typeof order.status,
                            })
                          }
                          className="px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer transition-all"
                          style={{
                            background: "oklch(0.19 0.06 255)",
                            border: "1px solid oklch(0.28 0.08 255 / 60%)",
                            color: "white",
                            fontFamily: "'Rajdhani', sans-serif",
                          }}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>

                        {/* Mark Paid */}
                        {order.paymentStatus !== "paid" && (
                          <button
                            onClick={() =>
                              markPaid.mutate({ orderId: order.id, paymentMethod: "zelle" })
                            }
                            disabled={markPaid.isPending}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all hover:opacity-90"
                            style={{
                              background: "oklch(0.65 0.2 145 / 20%)",
                              border: "1px solid oklch(0.65 0.2 145 / 40%)",
                              color: "oklch(0.65 0.2 145)",
                              fontFamily: "'Rajdhani', sans-serif",
                            }}
                          >
                            <DollarSign size={12} />
                            Mark Paid
                          </button>
                        )}

                        {/* Email customer */}
                        <a
                          href={`mailto:${order.shipEmail}?subject=Your Elite LA Peptides Order %23${order.id}&body=Hi ${order.shipName},%0A%0AThank you for your order!`}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all hover:opacity-90"
                          style={{
                            background: "oklch(0.72 0.18 210 / 15%)",
                            border: "1px solid oklch(0.72 0.18 210 / 40%)",
                            color: "oklch(0.72 0.18 210)",
                            fontFamily: "'Rajdhani', sans-serif",
                          }}
                        >
                          Email Customer
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
