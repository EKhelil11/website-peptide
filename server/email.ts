// === ELITE LA PEPTIDES — Email Helper (Resend) ===
// Sends transactional emails to support@laelitepeps.com for new orders and payment confirmations.
// Uses Resend shared domain (onboarding@resend.dev) until laelitepeps.com domain is verified.

import { Resend } from "resend";
import { ENV } from "./_core/env";

const FROM_ADDRESS = "La Elite Peptides <onboarding@resend.dev>";
const TO_ADDRESS = "support@laelitepeps.com";

function getResend(): Resend | null {
  if (!ENV.resendApiKey) return null;
  return new Resend(ENV.resendApiKey);
}

export interface NewOrderEmailParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shipAddress: string;
  shipAddress2?: string;
  shipCity: string;
  shipState: string;
  shipZip: string;
  items: Array<{ name: string; quantity: number; unitPrice: number }>;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
}

export async function sendNewOrderEmail(params: NewOrderEmailParams): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn("[Email] RESEND_API_KEY not set — skipping order email");
    return;
  }

  const itemsHtml = params.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;">${item.name}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">$${(item.unitPrice / 100).toFixed(2)}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">$${((item.unitPrice * item.quantity) / 100).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const shippingLine = params.shipAddress2
    ? `${params.shipAddress}, ${params.shipAddress2}`
    : params.shipAddress;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f3f4f6;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background:#0f172a;padding:24px 32px;">
      <h1 style="color:#06b6d4;font-size:22px;margin:0;letter-spacing:2px;">LA ELITE PEPTIDES</h1>
      <p style="color:#94a3b8;margin:4px 0 0;font-size:13px;">New Order Received</p>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <h2 style="font-size:18px;color:#0f172a;margin:0 0 4px;">Order ${params.orderNumber}</h2>
      <p style="color:#6b7280;font-size:13px;margin:0 0 24px;">Awaiting Zelle payment confirmation</p>

      <!-- Customer Info -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr>
          <td style="width:50%;vertical-align:top;padding-right:16px;">
            <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin:0 0 8px;">Customer</h3>
            <p style="margin:0;font-size:14px;color:#0f172a;">${params.customerName}</p>
            <p style="margin:2px 0;font-size:14px;color:#6b7280;">${params.customerEmail}</p>
            ${params.customerPhone ? `<p style="margin:2px 0;font-size:14px;color:#6b7280;">${params.customerPhone}</p>` : ""}
          </td>
          <td style="width:50%;vertical-align:top;">
            <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin:0 0 8px;">Ship To</h3>
            <p style="margin:0;font-size:14px;color:#0f172a;">${params.customerName}</p>
            <p style="margin:2px 0;font-size:14px;color:#6b7280;">${shippingLine}</p>
            <p style="margin:2px 0;font-size:14px;color:#6b7280;">${params.shipCity}, ${params.shipState} ${params.shipZip}</p>
          </td>
        </tr>
      </table>

      <!-- Items Table -->
      <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin:0 0 8px;">Order Items</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151;border-bottom:2px solid #e5e7eb;">Product</th>
            <th style="padding:8px 12px;text-align:center;font-weight:600;color:#374151;border-bottom:2px solid #e5e7eb;">Qty</th>
            <th style="padding:8px 12px;text-align:right;font-weight:600;color:#374151;border-bottom:2px solid #e5e7eb;">Unit Price</th>
            <th style="padding:8px 12px;text-align:right;font-weight:600;color:#374151;border-bottom:2px solid #e5e7eb;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <!-- Totals -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
        <tr>
          <td style="padding:4px 0;color:#6b7280;">Subtotal</td>
          <td style="padding:4px 0;text-align:right;color:#374151;">$${(params.subtotalCents / 100).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#6b7280;">Shipping</td>
          <td style="padding:4px 0;text-align:right;color:#374151;">$${(params.shippingCents / 100).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#6b7280;">Tax (9%)</td>
          <td style="padding:4px 0;text-align:right;color:#374151;">$${(params.taxCents / 100).toFixed(2)}</td>
        </tr>
        <tr style="border-top:2px solid #e5e7eb;">
          <td style="padding:8px 0 4px;font-weight:700;color:#0f172a;font-size:16px;">Total</td>
          <td style="padding:8px 0 4px;text-align:right;font-weight:700;color:#06b6d4;font-size:16px;">$${(params.totalCents / 100).toFixed(2)}</td>
        </tr>
      </table>

      <!-- Zelle Reminder -->
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:16px;margin-bottom:0;">
        <p style="margin:0;font-size:13px;color:#166534;font-weight:600;">💚 Awaiting Zelle Payment</p>
        <p style="margin:6px 0 0;font-size:13px;color:#166534;">
          Customer should send <strong>$${(params.totalCents / 100).toFixed(2)}</strong> to <strong>(310) 975-9289</strong> with memo: <strong>${params.orderNumber}</strong>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
        La Elite Peptides · support@laelitepeps.com · (310) 975-9289
      </p>
    </div>
  </div>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      subject: `🛒 New Order ${params.orderNumber} — $${(params.totalCents / 100).toFixed(2)}`,
      html,
    });

    if (error) {
      console.warn("[Email] Resend error sending new order email:", error);
    } else {
      console.log(`[Email] New order email sent for ${params.orderNumber}`);
    }
  } catch (err) {
    console.warn("[Email] Failed to send new order email:", err);
  }
}

export async function sendPaymentConfirmedEmail(params: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalCents: number;
}): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f3f4f6;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:#0f172a;padding:24px 32px;">
      <h1 style="color:#06b6d4;font-size:22px;margin:0;letter-spacing:2px;">LA ELITE PEPTIDES</h1>
      <p style="color:#94a3b8;margin:4px 0 0;font-size:13px;">Payment Confirmed</p>
    </div>
    <div style="padding:32px;">
      <h2 style="font-size:18px;color:#0f172a;margin:0 0 16px;">✅ Payment Confirmed — ${params.orderNumber}</h2>
      <p style="color:#374151;font-size:14px;">
        <strong>${params.customerName}</strong> (${params.customerEmail})<br>
        Total paid: <strong style="color:#06b6d4;">$${(params.totalCents / 100).toFixed(2)}</strong>
      </p>
      <p style="color:#6b7280;font-size:13px;">Order is now queued for ShipStation pickup and fulfillment.</p>
    </div>
    <div style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">La Elite Peptides · support@laelitepeps.com</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      subject: `✅ Payment Confirmed — ${params.orderNumber} ($${(params.totalCents / 100).toFixed(2)})`,
      html,
    });
    if (error) console.warn("[Email] Resend error sending payment confirmed email:", error);
    else console.log(`[Email] Payment confirmed email sent for ${params.orderNumber}`);
  } catch (err) {
    console.warn("[Email] Failed to send payment confirmed email:", err);
  }
}
