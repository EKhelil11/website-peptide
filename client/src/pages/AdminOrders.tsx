// === ELITE LA PEPTIDES — Admin Orders Dashboard ===
// Admin-only view to manage orders, mark paid, view ShipStation tracking

import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Package, CheckCircle, Truck, Clock, DollarSign, ArrowLeft, RefreshCw, ChevronDown, ChevronUp, Search } from "lucide-react";
import { toast } from "sonner";

const LOGO_URL = "/manus-storage/lap-logo-cropped_755f69ec.png";

// All status colors use cyan/blue palette — no pink
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending_payment: {
    label: "Pending Payment",
    color: "#FFB800",
    bg: "rgba(255,184,0,0.08)",
    border: "rgba(255,184,0,0.3)",
  },
  paid: {
    label: "Paid",
    color: "#00E5A0",
    bg: "rgba(0,229,160,0.08)",
    border: "rgba(0,229,160,0.3)",
  },
  processing: {
    label: "Processing",
    color: "#00BFFF",
    bg: "rgba(0,191,255,0.08)",
    border: "rgba(0,191,255,0.3)",
  },
  shipped: {
    label: "Shipped",
    color: "#00BFFF",
    bg: "rgba(0,191,255,0.08)",
    border: "rgba(0,191,255,0.3)",
  },
  delivered: {
    label: "Delivered",
    color: "#00E5A0",
    bg: "rgba(0,229,160,0.08)",
    border: "rgba(0,229,160,0.3)",
  },
  cancelled: {
    label: "Cancelled",
    color: "#FF4D4D",
    bg: "rgba(255,77,77,0.08)",
    border: "rgba(255,77,77,0.3)",
  },
};

type FilterTab = "all" | "pending_payment" | "paid" | "shipped" | "cancelled";

const bebasNeu = "'Bebas Neue', sans-serif";
const rajdhani = "'Rajdhani', sans-serif";
const inter = "'Inter', sans-serif";

export default function AdminOrders() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [noteInputs, setNoteInputs] = useState<Record<number, string>>({});
  const [markPaidNotes, setMarkPaidNotes] = useState<Record<number, string>>({});
  const [search, setSearch] = useState("");
  const integrationStatus = trpc.integrations.status.useQuery();

  const ordersQuery = trpc.orders.adminListOrders.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  const statsQuery = trpc.orders.adminStats.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  const utils = trpc.useUtils();

  const markPaid = trpc.orders.adminMarkPaid.useMutation({
    onSuccess: (data) => {
      utils.orders.adminListOrders.invalidate();
      utils.orders.adminStats.invalidate();
      toast.success(
        data.shipstationQueued
          ? "Order marked as paid and queued for ShipStation"
          : "Order marked as paid; ShipStation is currently disabled",
      );
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

  const syncTracking = trpc.orders.adminSyncTracking.useMutation({
    onSuccess: (data) => {
      utils.orders.adminListOrders.invalidate();
      if (data.success) {
        toast.success(`📦 Tracking synced: ${data.trackingNumber} (${data.carrier})`);
      } else {
        toast.info("No shipment found in ShipStation yet — try again after printing the label");
      }
    },
    onError: (e) => toast.error(e.message || "Failed to sync tracking"),
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050D1A]">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#00BFFF]/30 border-t-[#00BFFF] rounded-full animate-spin mx-auto" />
          <p className="text-white/50 text-lg tracking-[0.2em] uppercase" style={{ fontFamily: rajdhani }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050D1A]">
        <div className="text-center space-y-4">
          <p
            className="text-white/50 text-xl tracking-widest uppercase"
            style={{ fontFamily: rajdhani }}
          >
            Admin access required
          </p>
          <button
            onClick={() => setLocation("/")}
            className="text-[#00BFFF] text-base hover:text-white transition-colors"
            style={{ fontFamily: rajdhani }}
          >
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
    { key: "all", label: "All Orders", count: allOrders.length },
    { key: "pending_payment", label: "Pending Payment", count: allOrders.filter(o => o.status === "pending_payment").length },
    { key: "paid", label: "Paid", count: allOrders.filter(o => o.status === "paid" || o.status === "processing").length },
    { key: "shipped", label: "Shipped", count: allOrders.filter(o => o.status === "shipped" || o.status === "delivered").length },
    { key: "cancelled", label: "Cancelled", count: allOrders.filter(o => o.status === "cancelled").length },
  ];

  return (
    <div className="min-h-screen bg-[#050D1A]">
      {/* Top Nav */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(5,13,26,0.95)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(0,191,255,0.12)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation("/")}
              className="text-white/40 hover:text-[#00BFFF] transition-colors"
              title="Back to site"
            >
              <ArrowLeft size={20} />
            </button>
            <img src={LOGO_URL} alt="LA Elite Peptides" className="h-14 w-auto max-w-[260px]" />
            <span
              className="text-xs font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded"
              style={{
                fontFamily: rajdhani,
                background: "rgba(0,191,255,0.1)",
                border: "1px solid rgba(0,191,255,0.25)",
                color: "#00BFFF",
              }}
            >
              Admin
            </span>
          </div>
          <button
            onClick={() => { ordersQuery.refetch(); statsQuery.refetch(); }}
            className="text-white/30 hover:text-[#00BFFF] transition-colors"
            title="Refresh orders"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Page Header */}
        <div className="mb-10">
          <p
            className="text-[#00BFFF] text-sm tracking-[0.3em] uppercase mb-1"
            style={{ fontFamily: rajdhani, fontWeight: 600 }}
          >
            Elite LA Peptides
          </p>
          <h1
            className="text-white leading-none mb-3"
            style={{
              fontFamily: bebasNeu,
              fontSize: "clamp(3rem, 8vw, 5rem)",
              letterSpacing: "0.06em",
            }}
          >
            Order Management
          </h1>
          <p
            className="text-white/40 text-base tracking-wider"
            style={{ fontFamily: rajdhani }}
          >
            Zelle: (310) 975-9289 · Mark paid after confirming Zelle deposit
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 mb-8">
          {[integrationStatus.data?.email, integrationStatus.data?.shipstation].filter(Boolean).map((integration) => (
            <div
              key={integration!.message}
              className="rounded-xl px-4 py-3 text-sm"
              style={{
                background: integration!.configured ? "rgba(0,229,160,0.06)" : "rgba(255,184,0,0.06)",
                border: `1px solid ${integration!.configured ? "rgba(0,229,160,0.22)" : "rgba(255,184,0,0.22)"}`,
                color: integration!.configured ? "#00E5A0" : "#FFB800",
                fontFamily: inter,
              }}
            >
              {integration!.message}
            </div>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            {
              label: "Pending Payment",
              value: stats?.pendingCount ?? 0,
              color: "#FFB800",
              bg: "rgba(255,184,0,0.06)",
              border: "rgba(255,184,0,0.2)",
              icon: <Clock size={18} />,
            },
            {
              label: "Paid / Processing",
              value: stats?.paidCount ?? 0,
              color: "#00E5A0",
              bg: "rgba(0,229,160,0.06)",
              border: "rgba(0,229,160,0.2)",
              icon: <CheckCircle size={18} />,
            },
            {
              label: "Shipped",
              value: stats?.shippedCount ?? 0,
              color: "#00BFFF",
              bg: "rgba(0,191,255,0.06)",
              border: "rgba(0,191,255,0.2)",
              icon: <Truck size={18} />,
            },
            {
              label: "Total Revenue",
              value: `$${((stats?.totalRevenueCents ?? 0) / 100).toFixed(2)}`,
              color: "#00BFFF",
              bg: "rgba(0,191,255,0.06)",
              border: "rgba(0,191,255,0.2)",
              icon: <DollarSign size={18} />,
            },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-xl p-5"
              style={{
                background: stat.bg,
                border: `1px solid ${stat.border}`,
              }}
            >
              <div className="flex items-center gap-2 mb-2" style={{ color: stat.color }}>
                {stat.icon}
                <p
                  className="text-xs uppercase tracking-[0.15em]"
                  style={{ fontFamily: rajdhani, fontWeight: 600 }}
                >
                  {stat.label}
                </p>
              </div>
              <p
                className="leading-none"
                style={{
                  fontFamily: bebasNeu,
                  fontSize: "clamp(2rem, 5vw, 2.75rem)",
                  letterSpacing: "0.05em",
                  color: stat.color,
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-5">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search orders, names, emails..."
              className="pl-9 pr-4 py-2.5 rounded-lg outline-none w-80"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(0,191,255,0.15)",
                color: "white",
                fontFamily: inter,
                fontSize: "0.9rem",
              }}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-7">
          {tabs.map(tab => {
            const active = filterTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilterTab(tab.key)}
                className="px-4 py-2 rounded-lg font-bold uppercase tracking-[0.15em] transition-all text-sm"
                style={{
                  fontFamily: rajdhani,
                  background: active ? "rgba(0,191,255,0.15)" : "rgba(255,255,255,0.04)",
                  border: active ? "1px solid rgba(0,191,255,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  color: active ? "#00BFFF" : "rgba(255,255,255,0.5)",
                }}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-1.5 opacity-60">({tab.count})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        {ordersQuery.isLoading ? (
          <div
            className="text-white/40 text-base py-12 text-center tracking-widest uppercase"
            style={{ fontFamily: rajdhani }}
          >
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div
            className="rounded-xl p-12 text-center"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(0,191,255,0.1)",
            }}
          >
            <Package size={48} className="mx-auto mb-4 text-white/15" />
            <p
              className="text-white/40 text-lg tracking-widest uppercase"
              style={{ fontFamily: rajdhani }}
            >
              No orders in this category
            </p>
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
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(0,191,255,0.1)",
                  }}
                >
                  {/* Order Row Header */}
                  <div
                    className="flex flex-wrap items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    {/* Order Number + Date */}
                    <div className="min-w-[120px]">
                      <p
                        className="text-white leading-none"
                        style={{
                          fontFamily: bebasNeu,
                          fontSize: "1.25rem",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {order.orderNumber || `#${order.id}`}
                      </p>
                      <p
                        className="text-white/40 text-sm mt-0.5"
                        style={{ fontFamily: inter }}
                      >
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Customer */}
                    <div className="flex-1 min-w-[160px]">
                      <p
                        className="text-white text-base font-semibold"
                        style={{ fontFamily: inter }}
                      >
                        {order.shipName}
                      </p>
                      <p
                        className="text-white/40 text-sm"
                        style={{ fontFamily: inter }}
                      >
                        {order.shipEmail}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="text-right min-w-[80px]">
                      <p
                        className="text-[#00BFFF] leading-none"
                        style={{
                          fontFamily: bebasNeu,
                          fontSize: "1.6rem",
                          letterSpacing: "0.04em",
                        }}
                      >
                        ${((order.totalCents ?? 0) / 100).toFixed(2)}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <span
                      className="px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-[0.12em]"
                      style={{
                        background: statusCfg.bg,
                        border: `1px solid ${statusCfg.border}`,
                        color: statusCfg.color,
                        fontFamily: rajdhani,
                      }}
                    >
                      {statusCfg.label}
                    </span>

                    {/* Expand icon */}
                    <div className="text-white/30 ml-auto">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div
                      className="px-5 pb-7 pt-5 border-t space-y-6"
                      style={{ borderColor: "rgba(0,191,255,0.1)" }}
                    >
                      {/* Items */}
                      <div>
                        <p
                          className="text-white/40 text-xs uppercase tracking-[0.2em] mb-3"
                          style={{ fontFamily: rajdhani, fontWeight: 700 }}
                        >
                          Items Ordered
                        </p>
                        <div className="space-y-2">
                          {items.map((item: any) => (
                            <div key={item.id} className="flex justify-between">
                              <span
                                className="text-white/80 text-base"
                                style={{ fontFamily: inter }}
                              >
                                {item.productName}{item.variantLabel ? ` (${item.variantLabel})` : ""} × {item.quantity}
                              </span>
                              <span
                                className="text-white font-semibold text-base"
                                style={{ fontFamily: inter }}
                              >
                                ${((item.lineTotalCents ?? 0) / 100).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Totals breakdown */}
                        <div
                          className="mt-4 pt-4 border-t space-y-2"
                          style={{ borderColor: "rgba(0,191,255,0.1)" }}
                        >
                          {[
                            { label: "Subtotal", value: order.subtotalCents },
                            { label: "Shipping", value: order.shippingCents },
                            { label: "Tax (8%)", value: order.taxCents },
                          ].map(row => (
                            <div
                              key={row.label}
                              className="flex justify-between text-white/40 text-sm"
                              style={{ fontFamily: inter }}
                            >
                              <span>{row.label}</span>
                              <span>${((row.value ?? 0) / 100).toFixed(2)}</span>
                            </div>
                          ))}
                          <div
                            className="flex justify-between text-white font-bold text-base pt-1"
                            style={{ fontFamily: inter }}
                          >
                            <span>Total</span>
                            <span>${((order.totalCents ?? 0) / 100).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <p
                          className="text-white/40 text-xs uppercase tracking-[0.2em] mb-2"
                          style={{ fontFamily: rajdhani, fontWeight: 700 }}
                        >
                          Ship To
                        </p>
                        <p
                          className="text-white/80 text-base leading-relaxed"
                          style={{ fontFamily: inter }}
                        >
                          {order.shipName} · {order.shipPhone || "No phone"}<br />
                          {order.shipAddress}{order.shipAddress2 ? `, ${order.shipAddress2}` : ""}<br />
                          {order.shipCity}, {order.shipState} {order.shipZip}
                        </p>
                      </div>

                      {/* Zelle Memo */}
                      {order.status === "pending_payment" && (
                        <div
                          className="rounded-lg px-4 py-4"
                          style={{
                            background: "rgba(255,184,0,0.06)",
                            border: "1px solid rgba(255,184,0,0.25)",
                          }}
                        >
                          <p
                            className="text-xs uppercase tracking-[0.2em] mb-2 font-bold"
                            style={{ fontFamily: rajdhani, color: "#FFB800" }}
                          >
                            Zelle Payment Expected
                          </p>
                          <p
                            className="text-white text-base"
                            style={{ fontFamily: inter }}
                          >
                            Amount: <strong>${((order.totalCents ?? 0) / 100).toFixed(2)}</strong> · Memo: <strong>{order.orderNumber}</strong>
                          </p>
                        </div>
                      )}

                      {/* Tracking */}
                      {order.trackingNumber && (
                        <div>
                          <p
                            className="text-white/40 text-xs uppercase tracking-[0.2em] mb-2"
                            style={{ fontFamily: rajdhani, fontWeight: 700 }}
                          >
                            Tracking
                          </p>
                          <p
                            className="text-[#00BFFF] text-base font-bold"
                            style={{ fontFamily: inter }}
                          >
                            {order.trackingCarrier && (
                              <span className="text-white/50 font-normal mr-2">{order.trackingCarrier}</span>
                            )}
                            {order.trackingNumber}
                          </p>
                          {order.shippedAt && (
                            <p
                              className="text-white/40 text-sm mt-1"
                              style={{ fontFamily: inter }}
                            >
                              Shipped: {new Date(order.shippedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}

                      {/* ShipStation */}
                      {order.shipstationOrderId && (
                        <div>
                          <p
                            className="text-white/40 text-xs uppercase tracking-[0.2em] mb-2"
                            style={{ fontFamily: rajdhani, fontWeight: 700 }}
                          >
                            ShipStation
                          </p>
                          <p
                            className="text-white/60 text-sm"
                            style={{ fontFamily: inter }}
                          >
                            SS Order ID: {order.shipstationOrderId}
                            {order.shipstationSyncedAt && ` · Synced ${new Date(order.shipstationSyncedAt).toLocaleDateString()}`}
                          </p>
                        </div>
                      )}

                      {/* Admin Notes */}
                      <div>
                        <p
                          className="text-white/40 text-xs uppercase tracking-[0.2em] mb-2"
                          style={{ fontFamily: rajdhani, fontWeight: 700 }}
                        >
                          Admin Notes
                        </p>
                        <div className="flex gap-2">
                          <textarea
                            rows={2}
                            value={noteInputs[order.id] ?? (order.adminNotes || "")}
                            onChange={e => setNoteInputs(prev => ({ ...prev, [order.id]: e.target.value }))}
                            className="flex-1 px-3 py-2.5 rounded-lg text-sm resize-none outline-none"
                            style={{
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(0,191,255,0.15)",
                              color: "white",
                              fontFamily: inter,
                              fontSize: "0.9rem",
                            }}
                            placeholder="Internal notes (not visible to customer)..."
                          />
                          <button
                            onClick={() => updateNotes.mutate({ orderId: order.id, adminNotes: noteInputs[order.id] ?? "" })}
                            className="px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-[0.12em] transition-all hover:opacity-90"
                            style={{
                              background: "rgba(0,191,255,0.1)",
                              border: "1px solid rgba(0,191,255,0.25)",
                              color: "#00BFFF",
                              fontFamily: rajdhani,
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 pt-1">
                        {/* Mark Paid */}
                        {order.status === "pending_payment" && (
                          <div
                            className="w-full space-y-3 rounded-xl p-4"
                            style={{
                              background: "rgba(0,229,160,0.05)",
                              border: "1px solid rgba(0,229,160,0.2)",
                            }}
                          >
                            <p
                              className="text-sm uppercase tracking-[0.15em] font-bold"
                              style={{ fontFamily: rajdhani, color: "#00E5A0" }}
                            >
                              Confirm Zelle Payment Received
                            </p>
                            <textarea
                              rows={2}
                              value={markPaidNotes[order.id] ?? ""}
                              onChange={e => setMarkPaidNotes(prev => ({ ...prev, [order.id]: e.target.value }))}
                              placeholder={`Optional note (e.g. Zelle confirmed $${((order.totalCents ?? 0) / 100).toFixed(2)} received)`}
                              className="w-full px-3 py-2.5 rounded-lg text-sm resize-none outline-none"
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(0,191,255,0.15)",
                                color: "white",
                                fontFamily: inter,
                                fontSize: "0.9rem",
                              }}
                            />
                            <button
                              onClick={() => markPaid.mutate({ orderId: order.id, paymentNotes: markPaidNotes[order.id] || "Zelle payment confirmed" })}
                              disabled={markPaid.isPending}
                              className="flex items-center gap-2 px-5 py-3 rounded-xl text-base font-bold uppercase tracking-[0.15em] transition-all hover:opacity-90 disabled:opacity-50 w-full justify-center"
                              style={{
                                background: "rgba(0,229,160,0.15)",
                                border: "1px solid rgba(0,229,160,0.4)",
                                color: "#00E5A0",
                                fontFamily: rajdhani,
                              }}
                            >
                              <CheckCircle size={16} />
                              {markPaid.isPending ? "Processing..." : `✓ Mark Paid — $${((order.totalCents ?? 0) / 100).toFixed(2)}`}
                            </button>
                          </div>
                        )}

                        {/* Sync Tracking from ShipStation */}
                        {order.shipstationOrderId && !order.trackingNumber && (
                          <button
                            onClick={() => syncTracking.mutate({ orderId: order.id })}
                            disabled={syncTracking.isPending}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl text-base font-bold uppercase tracking-[0.15em] transition-all hover:opacity-90 disabled:opacity-50"
                            style={{
                              background: "rgba(0,191,255,0.08)",
                              border: "1px solid rgba(0,191,255,0.25)",
                              color: "#00BFFF",
                              fontFamily: rajdhani,
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                            </svg>
                            {syncTracking.isPending ? "Syncing..." : "Sync Tracking from ShipStation"}
                          </button>
                        )}

                        {/* Payment confirmed info */}
                        {order.status !== "pending_payment" && order.paymentConfirmedAt && (
                          <div
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm"
                            style={{
                              background: "rgba(0,229,160,0.06)",
                              border: "1px solid rgba(0,229,160,0.2)",
                              color: "#00E5A0",
                              fontFamily: inter,
                            }}
                          >
                            <CheckCircle size={14} />
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
