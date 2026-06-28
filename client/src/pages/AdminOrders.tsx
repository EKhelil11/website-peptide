// === ELITE LA PEPTIDES — Admin Orders Dashboard ===
// Admin-only view to manage orders, mark paid, view ShipStation tracking

import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Package, CheckCircle, Truck, Clock, DollarSign, ArrowLeft, RefreshCw, ChevronDown, ChevronUp, Search } from "lucide-react";
import { toast } from "sonner";

const LOGO_URL = "/manus-storage/elite-la-peptides-logo_e9ec855c.png";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending_payment: { label: "Pending Payment", color: "oklch(0.75 0.15 80)" },
  paid:            { label: "Paid", color: "oklch(0.65 0.2 145)" },
  processing:      { label: "Processing", color: "oklch(0.72 0.18 210)" },
  shipped:         { label: "Shipped", color: "oklch(0.72 0.18 210)" },
  delivered:       { label: "Delivered", color: "oklch(0.65 0.2 145)" },
  cancelled:       { label: "Cancelled", color: "oklch(0.6 0.15 25)" },
};

type FilterTab = "all" | "pending_payment" | "paid" | "shipped" | "cancelled";

export default function AdminOrders() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [noteInputs, setNoteInputs] = useState<Record<number, string>>({});
  const [markPaidNotes, setMarkPaidNotes] = useState<Record<number, string>>({});
  const [search, setSearch] = useState("");

  const ordersQuery = trpc.orders.adminListOrders.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  const statsQuery = trpc.orders.adminStats.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  const utils = trpc.useUtils();

  const markPaid = trpc.orders.adminMarkPaid.useMutation({
    onSuccess: () => {
      utils.orders.adminListOrders.invalidate();
      utils.orders.adminStats.invalidate();
      toast.success("✅ Order marked as paid — queued for ShipStation");
    },
    onError: (e) => toast.error(e.message || "Failed to mark as paid"),
  });

  const updateNotes = trpc.orders.adminUpdateNotes.useMutation({
    onSuccess: () => {
      utils.orders.adminListOrders.invalidate();
      toast.success("Notes saved");
    },
    onError: () => toast.error("Failed to save notes"),
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
          <p className="text-white/50 mb-4" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Admin access required</p>
          <button onClick={() => setLocation("/")} className="text-[#00BFFF] text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            ← Back to site
          </button>
        </div>
      </div>
    );
  }

  const allOrders = ordersQuery.data ?? [];
  const stats = statsQuery.data;

  const filteredOrders = allOrders.filter(o => {
    const matchesTab = filterTab === "all" || o.status === filterTab;
    const q = search.toLowerCase();
    const matchesSearch = !q || (
      (o.orderNumber ?? "").toLowerCase().includes(q) ||
      (o.shipName ?? "").toLowerCase().includes(q) ||
      (o.shipEmail ?? "").toLowerCase().includes(q)
    );
    return matchesTab && matchesSearch;
  });

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: allOrders.length },
    { key: "pending_payment", label: "Pending Payment", count: allOrders.filter(o => o.status === "pending_payment").length },
    { key: "paid", label: "Paid", count: allOrders.filter(o => o.status === "paid" || o.status === "processing").length },
    { key: "shipped", label: "Shipped", count: allOrders.filter(o => o.status === "shipped" || o.status === "delivered").length },
    { key: "cancelled", label: "Cancelled", count: allOrders.filter(o => o.status === "cancelled").length },
  ];

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
            onClick={() => { ordersQuery.refetch(); statsQuery.refetch(); }}
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
          <h1 className="text-4xl sm:text-5xl text-white mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}>
            Order Management
          </h1>
          <p className="text-white/40 text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Zelle: (310) 975-9289 · Mark paid after confirming Zelle deposit
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pending Payment", value: stats?.pendingCount ?? 0, color: "oklch(0.75 0.15 80)", icon: <Clock size={16} /> },
            { label: "Paid / Processing", value: stats?.paidCount ?? 0, color: "oklch(0.65 0.2 145)", icon: <CheckCircle size={16} /> },
            { label: "Shipped", value: stats?.shippedCount ?? 0, color: "oklch(0.72 0.18 210)", icon: <Truck size={16} /> },
            { label: "Total Revenue", value: `$${((stats?.totalRevenueCents ?? 0) / 100).toFixed(2)}`, color: "oklch(0.6 0.27 0)", icon: <DollarSign size={16} /> },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-xl p-4"
              style={{ background: "oklch(0.17 0.055 255)", border: "1px solid oklch(0.28 0.08 255 / 50%)" }}
            >
              <div className="flex items-center gap-1.5 mb-1" style={{ color: stat.color }}>
                {stat.icon}
                <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{stat.label}</p>
              </div>
              <p className="text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif", color: stat.color }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search + Filter Tabs */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-6">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search orders, names, emails..."
              className="pl-8 pr-4 py-2 rounded-lg text-sm outline-none w-72"
              style={{
                background: "oklch(0.17 0.055 255)",
                border: "1px solid oklch(0.28 0.08 255 / 50%)",
                color: "white",
                fontFamily: "'Rajdhani', sans-serif",
              }}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterTab(tab.key)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                background: filterTab === tab.key ? "oklch(0.6 0.27 0 / 20%)" : "oklch(0.17 0.055 255)",
                border: filterTab === tab.key ? "1px solid oklch(0.6 0.27 0 / 50%)" : "1px solid oklch(0.28 0.08 255 / 40%)",
                color: filterTab === tab.key ? "oklch(0.6 0.27 0)" : "oklch(0.6 0.1 255)",
              }}
            >
              {tab.label} {tab.count > 0 && <span className="ml-1 opacity-60">({tab.count})</span>}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {ordersQuery.isLoading ? (
          <div className="text-white/40 text-sm py-8 text-center" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div
            className="rounded-xl p-10 text-center"
            style={{ background: "oklch(0.17 0.055 255)", border: "1px solid oklch(0.28 0.08 255 / 40%)" }}
          >
            <Package size={40} className="mx-auto mb-4 text-white/20" />
            <p className="text-white/50" style={{ fontFamily: "'Rajdhani', sans-serif" }}>No orders in this category</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map(order => {
              const isExpanded = expandedOrder === order.id;
              const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending_payment;
              const items = (order as any).items ?? [];

              return (
                <div
                  key={order.id}
                  className="rounded-xl overflow-hidden"
                  style={{ background: "oklch(0.17 0.055 255)", border: "1px solid oklch(0.28 0.08 255 / 50%)" }}
                >
                  {/* Order Row Header */}
                  <div
                    className="flex flex-wrap items-center gap-3 px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    {/* Order Number + Date */}
                    <div className="min-w-[110px]">
                      <p className="text-white font-bold text-sm" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
                        {order.orderNumber || `#${order.id}`}
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
                      <p className="text-xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif", color: "oklch(0.6 0.27 0)" }}>
                        ${((order.totalCents ?? 0) / 100).toFixed(2)}
                      </p>
                    </div>

                    {/* Status Badge */}
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

                    {/* Expand icon */}
                    <div className="text-white/30 ml-auto">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="px-5 pb-6 pt-3 border-t space-y-5" style={{ borderColor: "oklch(0.28 0.08 255 / 30%)" }}>
                      {/* Items */}
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                          Items
                        </p>
                        <div className="space-y-1">
                          {items.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-white/70" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                                {item.productName}{item.variantLabel ? ` (${item.variantLabel})` : ""} × {item.quantity}
                              </span>
                              <span className="text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                                ${((item.lineTotalCents ?? 0) / 100).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                        {/* Totals breakdown */}
                        <div className="mt-3 pt-3 border-t space-y-1" style={{ borderColor: "oklch(0.28 0.08 255 / 30%)" }}>
                          <div className="flex justify-between text-xs text-white/40" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                            <span>Subtotal</span><span>${((order.subtotalCents ?? 0) / 100).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs text-white/40" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                            <span>Shipping</span><span>${((order.shippingCents ?? 0) / 100).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs text-white/40" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                            <span>Tax (9%)</span><span>${((order.taxCents ?? 0) / 100).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-bold text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                            <span>Total</span><span>${((order.totalCents ?? 0) / 100).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                          Ship To
                        </p>
                        <p className="text-white text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                          {order.shipName} · {order.shipPhone || "No phone"}<br />
                          {order.shipAddress}{order.shipAddress2 ? `, ${order.shipAddress2}` : ""}<br />
                          {order.shipCity}, {order.shipState} {order.shipZip}
                        </p>
                      </div>

                      {/* Zelle Memo */}
                      {order.status === "pending_payment" && (
                        <div
                          className="rounded-lg px-4 py-3"
                          style={{ background: "oklch(0.75 0.15 80 / 10%)", border: "1px solid oklch(0.75 0.15 80 / 30%)" }}
                        >
                          <p className="text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "'Rajdhani', sans-serif", color: "oklch(0.75 0.15 80)" }}>
                            Zelle Payment Expected
                          </p>
                          <p className="text-white text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                            Amount: <strong>${((order.totalCents ?? 0) / 100).toFixed(2)}</strong> · Memo: <strong>{order.orderNumber}</strong>
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
                            {order.trackingCarrier && <span className="text-white/50 font-normal mr-2">{order.trackingCarrier}</span>}
                            {order.trackingNumber}
                          </p>
                          {order.shippedAt && (
                            <p className="text-white/40 text-xs mt-0.5" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                              Shipped: {new Date(order.shippedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}

                      {/* ShipStation */}
                      {order.shipstationOrderId && (
                        <div>
                          <p className="text-white/40 text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                            ShipStation
                          </p>
                          <p className="text-white/60 text-xs" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                            SS Order ID: {order.shipstationOrderId}
                            {order.shipstationSyncedAt && ` · Synced ${new Date(order.shipstationSyncedAt).toLocaleDateString()}`}
                          </p>
                        </div>
                      )}

                      {/* Admin Notes */}
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-widest mb-1.5" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                          Admin Notes
                        </p>
                        <div className="flex gap-2">
                          <textarea
                            rows={2}
                            value={noteInputs[order.id] ?? (order.adminNotes || "")}
                            onChange={e => setNoteInputs(prev => ({ ...prev, [order.id]: e.target.value }))}
                            className="flex-1 px-3 py-2 rounded-lg text-sm resize-none outline-none"
                            style={{
                              background: "oklch(0.19 0.06 255)",
                              border: "1px solid oklch(0.28 0.08 255 / 60%)",
                              color: "white",
                              fontFamily: "'Rajdhani', sans-serif",
                            }}
                            placeholder="Internal notes (not visible to customer)..."
                          />
                          <button
                            onClick={() => updateNotes.mutate({ orderId: order.id, adminNotes: noteInputs[order.id] ?? "" })}
                            className="px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all hover:opacity-90"
                            style={{
                              background: "oklch(0.19 0.06 255)",
                              border: "1px solid oklch(0.28 0.08 255 / 60%)",
                              color: "oklch(0.72 0.18 210)",
                              fontFamily: "'Rajdhani', sans-serif",
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {/* Mark Paid */}
                        {order.status === "pending_payment" && (
                          <div className="w-full space-y-2" style={{ background: "oklch(0.65 0.2 145 / 6%)", border: "1px solid oklch(0.65 0.2 145 / 25%)", borderRadius: "0.75rem", padding: "0.875rem" }}>
                            <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "'Rajdhani', sans-serif", color: "oklch(0.65 0.2 145)" }}>Confirm Zelle Payment Received</p>
                            <textarea
                              rows={2}
                              value={markPaidNotes[order.id] ?? ""}
                              onChange={e => setMarkPaidNotes(prev => ({ ...prev, [order.id]: e.target.value }))}
                              placeholder={`Optional note (e.g. Zelle confirmed $${((order.totalCents ?? 0) / 100).toFixed(2)} received)`}
                              className="w-full px-3 py-2 rounded-lg text-xs resize-none outline-none"
                              style={{
                                background: "oklch(0.19 0.06 255)",
                                border: "1px solid oklch(0.28 0.08 255 / 60%)",
                                color: "white",
                                fontFamily: "'Rajdhani', sans-serif",
                              }}
                            />
                            <button
                              onClick={() => markPaid.mutate({ orderId: order.id, paymentNotes: markPaidNotes[order.id] || "Zelle payment confirmed" })}
                              disabled={markPaid.isPending}
                              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90 disabled:opacity-50 w-full justify-center"
                              style={{
                                background: "oklch(0.65 0.2 145 / 25%)",
                                border: "1px solid oklch(0.65 0.2 145 / 50%)",
                                color: "oklch(0.65 0.2 145)",
                                fontFamily: "'Rajdhani', sans-serif",
                              }}
                            >
                              <CheckCircle size={14} />
                              {markPaid.isPending ? "Processing..." : `✓ Mark Paid — $${((order.totalCents ?? 0) / 100).toFixed(2)}`}
                            </button>
                          </div>
                        )}

                        {/* Payment confirmed info */}
                        {order.status !== "pending_payment" && order.paymentConfirmedAt && (
                          <div
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs"
                            style={{
                              background: "oklch(0.65 0.2 145 / 10%)",
                              border: "1px solid oklch(0.65 0.2 145 / 30%)",
                              color: "oklch(0.65 0.2 145)",
                              fontFamily: "'Rajdhani', sans-serif",
                            }}
                          >
                            <CheckCircle size={12} />
                            Paid {new Date(order.paymentConfirmedAt).toLocaleDateString()}
                          </div>
                        )}
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
