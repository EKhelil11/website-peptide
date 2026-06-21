import { z } from "zod";
import { protectedProcedure, adminProcedure, router } from "./_core/trpc";
import {
  createOrder,
  getOrdersByUserId,
  getOrderWithItems,
  getAllOrders,
  updateOrderStatus,
  updateOrderPaymentStatus,
} from "./db";
import { notifyOwner } from "./_core/notification";

const cartItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  productCategory: z.string().optional(),
  quantity: z.number().int().min(1),
  unitPrice: z.number().positive(),
});

export const orderRouter = router({
  // Submit a new order
  submit: protectedProcedure
    .input(
      z.object({
        items: z.array(cartItemSchema).min(1),
        shipName: z.string().min(1),
        shipEmail: z.string().email(),
        shipPhone: z.string().optional(),
        shipAddress: z.string().min(1),
        shipCity: z.string().min(1),
        shipState: z.string().min(1),
        shipZip: z.string().min(1),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const totalAmount = input.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      );

      const orderId = await createOrder(
        {
          userId: ctx.user.id,
          totalAmount: totalAmount.toFixed(2) as any,
          shipName: input.shipName,
          shipEmail: input.shipEmail,
          shipPhone: input.shipPhone,
          shipAddress: input.shipAddress,
          shipCity: input.shipCity,
          shipState: input.shipState,
          shipZip: input.shipZip,
          notes: input.notes,
          status: "pending",
          paymentStatus: "awaiting_payment",
        },
        input.items.map(item => ({
          orderId: 0, // will be set in createOrder
          productId: item.productId,
          productName: item.productName,
          productCategory: item.productCategory,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toFixed(2) as any,
          lineTotal: (item.unitPrice * item.quantity).toFixed(2) as any,
        }))
      );

      // Notify owner via Manus notification
      const itemsSummary = input.items
        .map(i => `  • ${i.productName} x${i.quantity} — $${(i.unitPrice * i.quantity).toFixed(2)}`)
        .join("\n");

      await notifyOwner({
        title: `🛒 New Order #${orderId} — $${totalAmount.toFixed(2)}`,
        content: `Customer: ${input.shipName} (${input.shipEmail})\nPhone: ${input.shipPhone || "N/A"}\nShip to: ${input.shipAddress}, ${input.shipCity}, ${input.shipState} ${input.shipZip}\n\nItems:\n${itemsSummary}\n\nTotal: $${totalAmount.toFixed(2)}\n\nNotes: ${input.notes || "None"}\n\nReply to customer at: ${input.shipEmail}`,
      }).catch(() => {}); // don't fail order if notification fails

      return { orderId, success: true };
    }),

  // Get current user's orders
  myOrders: protectedProcedure.query(async ({ ctx }) => {
    return getOrdersByUserId(ctx.user.id);
  }),

  // Get a specific order with items (user can only see their own)
  getOrder: protectedProcedure
    .input(z.object({ orderId: z.number() }))
    .query(async ({ ctx, input }) => {
      const order = await getOrderWithItems(input.orderId);
      if (!order) return null;
      // Users can only see their own orders; admins can see all
      if (order.userId !== ctx.user.id && ctx.user.role !== "admin") return null;
      return order;
    }),

  // Admin: get all orders
  adminListOrders: adminProcedure.query(async () => {
    return getAllOrders();
  }),

  // Admin: update order status
  adminUpdateStatus: adminProcedure
    .input(
      z.object({
        orderId: z.number(),
        status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      await updateOrderStatus(input.orderId, input.status);
      return { success: true };
    }),

  // Admin: mark as paid
  adminMarkPaid: adminProcedure
    .input(
      z.object({
        orderId: z.number(),
        paymentMethod: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await updateOrderPaymentStatus(input.orderId, "paid", input.paymentMethod);
      return { success: true };
    }),
});
