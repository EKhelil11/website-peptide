import { z } from "zod";
import { protectedProcedure, adminProcedure, router } from "./_core/trpc";
import {
  createOrder,
  getOrdersByUserId,
  getOrderWithItems,
  getAllOrdersWithItems,
  markOrderPaid,
  cancelOrder,
  updateOrderAdminNotes,
  getOrderStats,
} from "./db";
import { notifyOwner } from "./_core/notification";

const TAX_RATE = 0.09;       // 9% flat
const SHIPPING_CENTS = 700;  // $7.00 flat

const cartItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  variantLabel: z.string().optional(),
  productCategory: z.string().optional(),
  quantity: z.number().int().min(1),
  unitPrice: z.number().positive(), // dollars
});

export const orderRouter = router({
  // ─── Customer: Submit a new order ────────────────────────────────────────
  submit: protectedProcedure
    .input(
      z.object({
        items: z.array(cartItemSchema).min(1),
        shipName: z.string().min(1),
        shipEmail: z.string().email(),
        shipPhone: z.string().optional(),
        shipAddress: z.string().min(1),
        shipAddress2: z.string().optional(),
        shipCity: z.string().min(1),
        shipState: z.string().min(2).max(4),
        shipZip: z.string().min(5),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const subtotalCents = Math.round(
        input.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) * 100
      );
      const taxCents = Math.round(subtotalCents * TAX_RATE);
      const totalCents = subtotalCents + taxCents + SHIPPING_CENTS;

      const { orderId, orderNumber } = await createOrder(
        {
          userId: ctx.user.id,
          status: "pending_payment",
          subtotalCents,
          shippingCents: SHIPPING_CENTS,
          taxCents,
          totalCents,
          zellePhone: "(310) 975-9289",
          shipName: input.shipName,
          shipEmail: input.shipEmail,
          shipPhone: input.shipPhone,
          shipAddress: input.shipAddress,
          shipAddress2: input.shipAddress2,
          shipCity: input.shipCity,
          shipState: input.shipState,
          shipZip: input.shipZip,
          shipCountry: "US",
        },
        input.items.map(item => ({
          orderId: 0, // set in createOrder
          productId: item.productId,
          productName: item.productName,
          variantLabel: item.variantLabel,
          productCategory: item.productCategory,
          quantity: item.quantity,
          unitPriceCents: Math.round(item.unitPrice * 100),
          lineTotalCents: Math.round(item.unitPrice * item.quantity * 100),
        }))
      );

      // Notify owner
      const itemsSummary = input.items
        .map(i => `  • ${i.productName}${i.variantLabel ? ` (${i.variantLabel})` : ""} x${i.quantity} — $${(i.unitPrice * i.quantity).toFixed(2)}`)
        .join("\n");

      await notifyOwner({
        title: `🛒 New Order ${orderNumber} — $${(totalCents / 100).toFixed(2)}`,
        content: `Order: ${orderNumber}\nCustomer: ${input.shipName} (${input.shipEmail})\nPhone: ${input.shipPhone || "N/A"}\nShip to: ${input.shipAddress}, ${input.shipCity}, ${input.shipState} ${input.shipZip}\n\nItems:\n${itemsSummary}\n\nSubtotal: $${(subtotalCents / 100).toFixed(2)}\nShipping: $${(SHIPPING_CENTS / 100).toFixed(2)}\nTax (9%): $${(taxCents / 100).toFixed(2)}\nTotal: $${(totalCents / 100).toFixed(2)}\n\nZelle: (310) 975-9289 — Memo: ${orderNumber}`,
      }).catch(() => {});

      return { orderId, orderNumber, totalCents, success: true };
    }),

  // ─── Customer: Get my orders ─────────────────────────────────────────────
  myOrders: protectedProcedure.query(async ({ ctx }) => {
    return getOrdersByUserId(ctx.user.id);
  }),

  // ─── Customer: Get a specific order with items ───────────────────────────
  getOrder: protectedProcedure
    .input(z.object({ orderId: z.number() }))
    .query(async ({ ctx, input }) => {
      const order = await getOrderWithItems(input.orderId);
      if (!order) return null;
      if (order.userId !== ctx.user.id && ctx.user.role !== "admin") return null;
      return order;
    }),

  // ─── Customer: Cancel a pending order ───────────────────────────────────
  cancelOrder: protectedProcedure
    .input(z.object({ orderId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const order = await getOrderWithItems(input.orderId);
      if (!order) throw new Error("Order not found");
      if (order.userId !== ctx.user.id && ctx.user.role !== "admin") throw new Error("Forbidden");
      if (order.status !== "pending_payment") throw new Error("Only pending orders can be cancelled");
      await cancelOrder(input.orderId, String(ctx.user.id));
      return { success: true };
    }),

  // ─── Admin: Get all orders with items ───────────────────────────────────
  adminListOrders: adminProcedure.query(async () => {
    return getAllOrdersWithItems();
  }),

  // ─── Admin: Get order stats ──────────────────────────────────────────────
  adminStats: adminProcedure.query(async () => {
    return getOrderStats();
  }),

  // ─── Admin: Mark order as paid ───────────────────────────────────────────
  adminMarkPaid: adminProcedure
    .input(
      z.object({
        orderId: z.number(),
        paymentNotes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await markOrderPaid(input.orderId, ctx.user.id, input.paymentNotes);

      // Notify customer (via owner notification for now)
      const order = await getOrderWithItems(input.orderId);
      if (order) {
        await notifyOwner({
          title: `✅ Payment Confirmed — ${order.orderNumber}`,
          content: `Order ${order.orderNumber} marked as paid.\nCustomer: ${order.shipName} (${order.shipEmail})\nTotal: $${(order.totalCents / 100).toFixed(2)}\n\nOrder is now queued for ShipStation pickup.`,
        }).catch(() => {});
      }

      return { success: true };
    }),

  // ─── Admin: Update admin notes ───────────────────────────────────────────
  adminUpdateNotes: adminProcedure
    .input(z.object({ orderId: z.number(), adminNotes: z.string() }))
    .mutation(async ({ input }) => {
      await updateOrderAdminNotes(input.orderId, input.adminNotes);
      return { success: true };
    }),

  // ─── Admin: Get single order detail ─────────────────────────────────────
  adminGetOrder: adminProcedure
    .input(z.object({ orderId: z.number() }))
    .query(async ({ input }) => {
      return getOrderWithItems(input.orderId);
    }),
});
