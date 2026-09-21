import {
  claimWhitcombPaymentPoll,
  getOrderWithItems,
  markOrderCancelledByWhitcomb,
  markOrderPaidByWhitcomb,
  recordWhitcombPaymentCheck,
  updateOrderShipStation,
} from "./db";
import { sendPaymentConfirmedEmailAbortable } from "./email";
import { notifyOwner } from "./_core/notification";
import { buildSSOrderPayload, createOrUpdateSSOrder } from "./shipstation";
import { isShipStationConfigured } from "./integrationStatus";
import { checkWhitcombPayment } from "./whitcomb";

export const WHITCOMB_MIN_CHECK_INTERVAL_MS = 5 * 60 * 1000;

export async function reconcileWhitcombOrder(orderId: number) {
  const order = await getOrderWithItems(orderId);
  if (!order) throw new Error("Order not found");
  if (order.paymentMethod !== "whitcomb_card" || order.paymentProvider !== "whitcomb") {
    throw new Error("Order is not a Whitcomb card-payment order");
  }
  if (!order.paymentProviderReference) throw new Error("Whitcomb payment reference is missing");
  if (["paid", "processing", "shipped", "delivered"].includes(order.status)) {
    return { paid: true, status: order.status, order, cached: true } as const;
  }
  if (order.status === "cancelled") {
    return { paid: false, status: "cancelled", order, cached: true } as const;
  }

  const now = Date.now();
  if (
    order.paymentProviderLastCheckedAt &&
    now - order.paymentProviderLastCheckedAt < WHITCOMB_MIN_CHECK_INTERVAL_MS
  ) {
    return {
      paid: false,
      status: order.paymentProviderStatus || "open",
      order,
      cached: true,
    } as const;
  }

  const claimed = await claimWhitcombPaymentPoll(
    order.id,
    order.paymentProviderReference,
    now,
    now - WHITCOMB_MIN_CHECK_INTERVAL_MS,
  );
  if (!claimed) {
    const current = await getOrderWithItems(order.id);
    const currentStatus = current?.status ?? order.status;
    return {
      paid: ["paid", "processing", "shipped", "delivered"].includes(currentStatus),
      status: current?.paymentProviderStatus || currentStatus,
      order: current ?? order,
      cached: true,
    } as const;
  }

  const payment = await checkWhitcombPayment(order.paymentProviderReference);
  if (payment.reference !== order.paymentProviderReference) {
    throw new Error("Whitcomb payment reference mismatch");
  }
  if (payment.paid && payment.amountCents !== order.totalCents) {
    await recordWhitcombPaymentCheck(order.id, order.paymentProviderReference, {
      status: "amount_mismatch",
      amountCents: payment.amountCents,
      checkedAt: now,
    });
    throw new Error("Whitcomb payment amount does not match the order total");
  }

  await recordWhitcombPaymentCheck(order.id, order.paymentProviderReference, {
    status: payment.status,
    amountCents: payment.amountCents,
    paidAt: payment.paidAt,
    checkedAt: now,
  });

  if (!payment.paid && payment.status === "cancelled") {
    await markOrderCancelledByWhitcomb(order.id, order.paymentProviderReference, now);
    const cancelledOrder = await getOrderWithItems(order.id);
    return { paid: false, status: "cancelled", order: cancelledOrder ?? order } as const;
  }

  if (!payment.paid) {
    return { paid: false, status: payment.status, order } as const;
  }

  const transitioned = await markOrderPaidByWhitcomb(order.id, {
    reference: order.paymentProviderReference,
    amountCents: order.totalCents,
    paidAt: payment.paidAt ?? now,
    checkedAt: now,
  });
  if (!transitioned) {
    const current = await getOrderWithItems(order.id);
    return { paid: current?.status === "paid" || current?.status === "processing" || current?.status === "shipped" || current?.status === "delivered", status: "paid", order: current ?? order } as const;
  }

  const paidOrder = await getOrderWithItems(order.id);
  if (!paidOrder) throw new Error("Paid order could not be reloaded");

  await Promise.allSettled([
    notifyOwner({
      title: `✅ Card Payment Confirmed — ${paidOrder.orderNumber}`,
      content: `Whitcomb confirmed $${(paidOrder.totalCents / 100).toFixed(2)} for ${paidOrder.orderNumber}. The order is ready for fulfillment.`,
    }, AbortSignal.timeout(8_000)),
    ...(paidOrder.shipEmail && paidOrder.orderNumber
      ? [sendPaymentConfirmedEmailAbortable({
          orderNumber: paidOrder.orderNumber,
          customerName: paidOrder.shipName ?? "Customer",
          customerEmail: paidOrder.shipEmail,
          totalCents: paidOrder.totalCents,
        }, AbortSignal.timeout(8_000))]
      : []),
  ]);

  let shipstationQueued = false;
  if (isShipStationConfigured() && paidOrder.orderNumber) {
    try {
      const payload = buildSSOrderPayload({
        ...paidOrder,
        orderNumber: paidOrder.orderNumber,
        status: "paid",
      });
      const response = await createOrUpdateSSOrder(payload);
      await updateOrderShipStation(paidOrder.id, String(response.orderId));
      shipstationQueued = true;
    } catch {
      console.error(`[ShipStation] Failed to push Whitcomb-paid order ${paidOrder.orderNumber}.`);
    }
  }

  return { paid: true, status: "paid", order: paidOrder, shipstationQueued } as const;
}
