import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { customerProtectedProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import {
  createOrder,
  getOrdersByUserId,
  getOrdersByCustomerId,
  getOrderWithItems,
  getOrderByNumber,
  getOrderByCheckoutKey,
  getAllOrdersWithItems,
  markOrderPaid,
  cancelOrder,
  updateOrderAdminNotes,
  getOrderStats,
  attachWhitcombPaymentSession,
} from "./db";
import { notifyOwner } from "./_core/notification";
import { sendNewOrderEmail, sendPaymentConfirmedEmail, sendCustomerOrderConfirmation, sendShippingConfirmationEmail } from "./email";
import { createOrUpdateSSOrder, buildSSOrderPayload, getSSShipmentsForOrder } from "./shipstation";
import { updateOrderShipStation } from "./db";
import { isShipStationConfigured } from "./integrationStatus";
import {
  calculateOrderQuote,
  InvalidCartItemError,
  InvalidPartnerCodeError,
  type PartnerCartInput,
} from "./partnerDiscount";
import { reconcileWhitcombOrder } from "./paymentOrchestration";
import { resolveWhitcombOrigin, startWhitcombPayment } from "./whitcomb";

const cartItemSchema = z.object({
  productId: z.string(),
  productName: z.string().optional(),
  variantLabel: z.string().optional(),
  productCategory: z.string().optional(),
  quantity: z.number().int().min(1),
  unitPrice: z.number().positive().optional(),
});

function getOrderQuote(
  items: PartnerCartInput[],
  partnerCode: string | undefined,
  customer: { partnerCode?: string | null; partnerDiscountBps?: number | null },
) {
  try {
    return calculateOrderQuote({
      items,
      requestedCode: partnerCode,
      savedCode: customer.partnerCode,
      savedDiscountBps: customer.partnerDiscountBps,
    });
  } catch (error) {
    if (error instanceof InvalidPartnerCodeError || error instanceof InvalidCartItemError) {
      throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
    }
    throw error;
  }
}

function submitResultFromExistingOrder(order: Awaited<ReturnType<typeof getOrderByCheckoutKey>>) {
  if (!order) throw new Error("Existing order is required");
  return {
    orderId: order.id,
    orderNumber: order.orderNumber ?? "",
    subtotalCents: order.subtotalCents,
    discountCents: order.discountCents ?? 0,
    partnerCode: order.partnerCode,
    shippingCents: order.shippingCents,
    taxCents: order.taxCents,
    totalCents: order.totalCents,
    paymentMethod: order.paymentMethod as "zelle" | "whitcomb_card",
    paymentUrl: order.status === "pending_payment" ? order.paymentProviderCheckoutUrl : null,
    success: true,
    replayed: true,
  };
}

function withoutHostedPaymentUrl<T extends { paymentProviderCheckoutUrl?: string | null }>(order: T) {
  const { paymentProviderCheckoutUrl: _privateHostedPaymentUrl, ...safeOrder } = order;
  return safeOrder;
}

export const orderRouter = router({
  // ─── Customer: Preview authoritative totals and partner benefit ───────────
  quote: customerProtectedProcedure
    .input(z.object({
      items: z.array(cartItemSchema).min(1),
      partnerCode: z.string().max(32).optional(),
    }))
    .query(({ ctx, input }) => {
      return getOrderQuote(input.items, input.partnerCode, ctx.customer);
    }),

  // ─── Customer: Submit a new order ────────────────────────────────────────
  submit: customerProtectedProcedure
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
        partnerCode: z.string().max(32).optional(),
        paymentMethod: z.enum(["zelle", "whitcomb_card"]).default("zelle"),
        checkoutIdempotencyKey: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const replay = await getOrderByCheckoutKey(ctx.customer.id, input.checkoutIdempotencyKey);
      if (replay) return submitResultFromExistingOrder(replay);

      const quote = getOrderQuote(input.items, input.partnerCode, ctx.customer);
      let selectedPaymentMethod: "zelle" | "whitcomb_card" = input.paymentMethod;
      const initialAdminNotes = [
        quote.partnerCode ? `Partner attribution: ${quote.partnerCode} (Las Vegas gym)` : null,
        input.notes?.trim() ? `Customer note: ${input.notes.trim()}` : null,
      ].filter(Boolean).join("\n") || null;

      let orderId: number;
      let orderNumber: string;
      try {
        const created = await createOrder(
          {
          userId: 0,
          customerId: ctx.customer.id,
          checkoutIdempotencyKey: input.checkoutIdempotencyKey,
          status: "pending_payment",
          subtotalCents: quote.subtotalCents,
          discountCents: quote.discountCents,
          discountBps: quote.discountBps,
          partnerCode: quote.partnerCode,
          shippingCents: quote.shippingCents,
          taxCents: quote.taxCents,
          totalCents: quote.totalCents,
          paymentMethod: selectedPaymentMethod,
          paymentProvider: selectedPaymentMethod === "whitcomb_card" ? "whitcomb" : null,
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
          adminNotes: initialAdminNotes,
          },
          quote.items.map(item => ({
          orderId: 0, // set in createOrder
          productId: item.productId,
          productName: item.productName,
          variantLabel: item.variantLabel,
          productCategory: item.productCategory,
          quantity: item.quantity,
          unitPriceCents: item.unitPriceCents,
          lineTotalCents: item.lineTotalCents,
          })),
          quote.firstUse && quote.partnerCode
            ? {
              customerId: ctx.customer.id,
              partnerCode: quote.partnerCode,
              discountBps: quote.discountBps,
              }
            : undefined,
        );
        orderId = created.orderId;
        orderNumber = created.orderNumber;
      } catch (error) {
        const concurrentReplay = await getOrderByCheckoutKey(ctx.customer.id, input.checkoutIdempotencyKey);
        if (concurrentReplay) return submitResultFromExistingOrder(concurrentReplay);
        throw error;
      }

      let paymentUrl: string | null = null;
      if (selectedPaymentMethod === "whitcomb_card") {
        try {
          const payment = await startWhitcombPayment({
            orderNumber,
            amountCents: quote.totalCents,
            email: input.shipEmail,
            fullName: input.shipName,
            phone: input.shipPhone,
            returnOrigin: resolveWhitcombOrigin(),
          });
          await attachWhitcombPaymentSession(orderId, payment.reference, payment.url, quote.totalCents);
          paymentUrl = payment.url;
        } catch (error) {
          const errorType = error instanceof Error ? error.name : "UnknownError";
          console.warn(`[Whitcomb] Checkout session unavailable for ${orderNumber}; card order remains pending for safe resume (${errorType}).`);
        }
      }

      // Notify owner
      const itemsSummary = quote.items
        .map(i => `  • ${i.productName}${i.variantLabel ? ` (${i.variantLabel})` : ""} x${i.quantity} — $${(i.lineTotalCents / 100).toFixed(2)}`)
        .join("\n");
      const partnerSummary = quote.partnerCode
        ? `\nPartner: RECROOMLV · Las Vegas gym\nDiscount (10%): -$${(quote.discountCents / 100).toFixed(2)}`
        : "";

      await notifyOwner({
        title: `🛒 New Order ${orderNumber} — $${(quote.totalCents / 100).toFixed(2)}`,
        content: `Order: ${orderNumber}\nCustomer: ${input.shipName} (${input.shipEmail})\nPhone: ${input.shipPhone || "N/A"}\nShip to: ${input.shipAddress}, ${input.shipCity}, ${input.shipState} ${input.shipZip}${partnerSummary}\n\nItems:\n${itemsSummary}\n\nSubtotal: $${(quote.subtotalCents / 100).toFixed(2)}${quote.discountCents > 0 ? `\nDiscount: -$${(quote.discountCents / 100).toFixed(2)}` : ""}\nShipping: $${(quote.shippingCents / 100).toFixed(2)}\nTax (8%): $${(quote.taxCents / 100).toFixed(2)}\nTotal: $${(quote.totalCents / 100).toFixed(2)}\n\nPayment: ${selectedPaymentMethod === "whitcomb_card" ? "Whitcomb hosted card checkout — awaiting verified payment" : `Zelle to (310) 975-9289 — Memo: ${orderNumber}`}`,
      }).catch(() => {});

      // Send rich HTML email to support@laelitepeps.com (owner notification)
      await sendNewOrderEmail({
        orderNumber,
        customerName: input.shipName,
        customerEmail: input.shipEmail,
        customerPhone: input.shipPhone,
        shipAddress: input.shipAddress,
        shipAddress2: input.shipAddress2,
        shipCity: input.shipCity,
        shipState: input.shipState,
        shipZip: input.shipZip,
        items: quote.items.map(i => ({
          name: i.productName + (i.variantLabel ? ` (${i.variantLabel})` : ""),
          quantity: i.quantity,
          unitPrice: i.unitPriceCents,
        })),
        subtotalCents: quote.subtotalCents,
        discountCents: quote.discountCents,
        partnerCode: quote.partnerCode,
        shippingCents: quote.shippingCents,
        taxCents: quote.taxCents,
        totalCents: quote.totalCents,
        paymentMethod: selectedPaymentMethod,
        paymentUrl,
      }).catch(() => {});

      // Send order confirmation email directly to the customer
      await sendCustomerOrderConfirmation({
        orderNumber,
        customerName: input.shipName,
        customerEmail: input.shipEmail,
        customerPhone: input.shipPhone,
        shipAddress: input.shipAddress,
        shipAddress2: input.shipAddress2,
        shipCity: input.shipCity,
        shipState: input.shipState,
        shipZip: input.shipZip,
        items: quote.items.map(i => ({
          name: i.productName + (i.variantLabel ? ` (${i.variantLabel})` : ""),
          quantity: i.quantity,
          unitPrice: i.unitPriceCents,
        })),
        subtotalCents: quote.subtotalCents,
        discountCents: quote.discountCents,
        partnerCode: quote.partnerCode,
        shippingCents: quote.shippingCents,
        taxCents: quote.taxCents,
        totalCents: quote.totalCents,
        paymentMethod: selectedPaymentMethod,
        paymentUrl,
      }).catch(() => {});

      return {
        orderId,
        orderNumber,
        subtotalCents: quote.subtotalCents,
        discountCents: quote.discountCents,
        partnerCode: quote.partnerCode,
        shippingCents: quote.shippingCents,
        taxCents: quote.taxCents,
        totalCents: quote.totalCents,
        paymentMethod: selectedPaymentMethod,
        paymentUrl,
        success: true,
      };
    }),

  // ─── Customer: Verify card payment after hosted-checkout return ────────────
  confirmWhitcombReturn: customerProtectedProcedure
    .input(z.object({ orderNumber: z.string().min(1).max(32) }))
    .mutation(async ({ ctx, input }) => {
      const order = await getOrderByNumber(input.orderNumber);
      if (!order || order.customerId !== ctx.customer.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }
      if (order.paymentMethod !== "whitcomb_card") {
        return { paid: order.status !== "pending_payment", status: order.status, orderId: order.id };
      }
      const result = await reconcileWhitcombOrder(order.id);
      return { paid: result.paid, status: result.status, orderId: order.id };
    }),

  // ─── Customer: Resume an open hosted card payment ─────────────────────────
  resumeWhitcombPayment: customerProtectedProcedure
    .input(z.object({ orderId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const order = await getOrderWithItems(input.orderId);
      if (!order || order.customerId !== ctx.customer.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }
      if (order.paymentMethod !== "whitcomb_card" || order.status !== "pending_payment") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This card payment cannot be resumed." });
      }
      if (order.paymentProviderReference) {
        const result = await reconcileWhitcombOrder(order.id);
        if (result.paid) return { paid: true, url: null };
        if (result.status === "cancelled") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "This card payment was cancelled. Please contact support." });
        }
        if (order.paymentProviderCheckoutUrl) {
          return { paid: false, url: order.paymentProviderCheckoutUrl };
        }
      }
      const payment = await startWhitcombPayment({
        orderNumber: order.orderNumber ?? String(order.id),
        amountCents: order.totalCents,
        email: order.shipEmail ?? ctx.customer.email,
        fullName: order.shipName ?? `${ctx.customer.firstName} ${ctx.customer.lastName}`,
        phone: order.shipPhone,
        returnOrigin: resolveWhitcombOrigin(),
      });
      await attachWhitcombPaymentSession(order.id, payment.reference, payment.url, order.totalCents);
      return { paid: payment.paid, url: payment.url };
    }),

  // ─── Customer: Get my orders ─────────────────────────────────────────────
  myOrders: customerProtectedProcedure.query(async ({ ctx }) => {
    const customerOrders = await getOrdersByCustomerId(ctx.customer.id);
    return customerOrders.map(withoutHostedPaymentUrl);
  }),

  // ─── Customer: Get a specific order with items ───────────────────────────
  getOrder: customerProtectedProcedure
    .input(z.object({ orderId: z.number() }))
    .query(async ({ ctx, input }) => {
      const order = await getOrderWithItems(input.orderId);
      if (!order) return null;
      if (order.customerId !== ctx.customer.id) return null;
      return withoutHostedPaymentUrl(order);
    }),

  // ─── Customer: Cancel a pending order ───────────────────────────────────
  cancelOrder: customerProtectedProcedure
    .input(z.object({ orderId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const order = await getOrderWithItems(input.orderId);
      if (!order) throw new Error("Order not found");
      if (order.customerId !== ctx.customer.id) throw new Error("Forbidden");
      if (order.status !== "pending_payment") throw new Error("Only pending orders can be cancelled");
      if (order.paymentMethod === "whitcomb_card") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Card-payment orders cannot be cancelled while a secure payment link is open. Contact support for help.",
        });
      }
      await cancelOrder(input.orderId, String(ctx.customer.id));
      return { success: true };
    }),

  // ─── Admin: Get all orders with items ───────────────────────────────────
  adminListOrders: adminProcedure.query(async () => {
    const allOrders = await getAllOrdersWithItems();
    return allOrders.map(withoutHostedPaymentUrl);
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
      const pendingOrder = await getOrderWithItems(input.orderId);
      if (!pendingOrder) throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      if (pendingOrder.paymentMethod !== "zelle") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Card payments are confirmed automatically by Whitcomb and cannot be marked paid manually.",
        });
      }
      const transitioned = await markOrderPaid(input.orderId, ctx.user.id, input.paymentNotes);
      if (!transitioned) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This order is no longer an unconfirmed Zelle order.",
        });
      }

      // Notify owner via Manus notification + Resend email
      const order = await getOrderWithItems(input.orderId);
      if (order) {
        await notifyOwner({
          title: `✅ Payment Confirmed — ${order.orderNumber}`,
          content: `Order ${order.orderNumber} marked as paid.\nCustomer: ${order.shipName} (${order.shipEmail})\nTotal: $${(order.totalCents / 100).toFixed(2)}\n\nOrder is now queued for ShipStation pickup.`,
        }).catch(() => {});

        await sendPaymentConfirmedEmail({
          orderNumber: order.orderNumber ?? "",
          customerName: order.shipName ?? "",
          customerEmail: order.shipEmail ?? "",
          totalCents: order.totalCents,
        }).catch(() => {});
      }

      let shipstationQueued = false;
      if (isShipStationConfigured()) {
        try {
          const freshOrder = await getOrderWithItems(input.orderId);
          if (freshOrder) {
            const ssPayload = buildSSOrderPayload({
              ...freshOrder,
              orderNumber: freshOrder.orderNumber ?? "",
              status: "paid",
            });
            const ssResponse = await createOrUpdateSSOrder(ssPayload);
            await updateOrderShipStation(input.orderId, String(ssResponse.orderId));
            shipstationQueued = true;
            await notifyOwner({
              title: `📦 Order ${freshOrder.orderNumber} pushed to ShipStation`,
              content: `ShipStation Order ID: ${ssResponse.orderId}\nStatus: ${ssResponse.orderStatus}\nReady for label printing.`,
            }).catch(() => {});
          }
        } catch (ssErr) {
          // Non-fatal — payment confirmation remains authoritative in the database.
          console.error("[ShipStation] Failed to push order:", ssErr);
        }
      }

      return { success: true, shipstationQueued };
    }),

  // ─── Admin: Sync tracking from ShipStation ───────────────────────────────
  adminSyncTracking: adminProcedure
    .input(z.object({ orderId: z.number() }))
    .mutation(async ({ input }) => {
      if (!isShipStationConfigured()) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "ShipStation is disabled pending reauthorization.",
        });
      }
      const order = await getOrderWithItems(input.orderId);
      if (!order) throw new Error("Order not found");
      if (!order.shipstationOrderId) throw new Error("Order not yet synced to ShipStation");

      const shipments = await getSSShipmentsForOrder(Number(order.shipstationOrderId));
      const shipped = shipments.find(s => !s.voided && s.trackingNumber);
      if (!shipped) return { success: false, message: "No shipment found yet in ShipStation" };

      await updateOrderShipStation(
        input.orderId,
        order.shipstationOrderId,
        shipped.trackingNumber,
        shipped.carrierCode,
        shipped.serviceCode,
        undefined
      );

      // Email customer with tracking
      if (order.shipEmail && order.orderNumber) {
        await sendShippingConfirmationEmail({
          orderNumber: order.orderNumber,
          customerName: order.shipName ?? "Customer",
          customerEmail: order.shipEmail,
          trackingNumber: shipped.trackingNumber,
          carrier: shipped.carrierCode,
          service: shipped.serviceCode,
          shipCity: order.shipCity ?? "",
          shipState: order.shipState ?? "",
          shipZip: order.shipZip ?? "",
          items: order.items.map(i => ({
            name: i.productName + (i.variantLabel ? ` (${i.variantLabel})` : ""),
            quantity: i.quantity,
          })),
        }).catch(() => {});
      }

      return { success: true, trackingNumber: shipped.trackingNumber, carrier: shipped.carrierCode };
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
      const order = await getOrderWithItems(input.orderId);
      return order ? withoutHostedPaymentUrl(order) : null;
    }),
});
