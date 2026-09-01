// === ELITE LA PEPTIDES — Email Helper (Resend) ===
// Sends transactional emails to support@laelitepeps.com for new orders and payment confirmations.
// Uses Resend shared domain (onboarding@resend.dev) until laelitepeps.com domain is verified.

import { Resend } from "resend";
import { ENV } from "./_core/env";
import { isEmailConfigured } from "./integrationStatus";

const FROM_ADDRESS = "La Elite Peptides <noreply@laelitepeps.com>";
const TO_ADDRESS = "support@laelitepeps.com";

type ResendClient = Pick<Resend, "emails">;
type ResendClientFactory = (apiKey: string) => ResendClient;

const defaultResendClientFactory: ResendClientFactory = apiKey => new Resend(apiKey);
let resendClientFactory = defaultResendClientFactory;

export function __setResendClientFactoryForTests(factory?: ResendClientFactory) {
  if (ENV.isProduction) throw new Error("Resend test factory is unavailable in production");
  resendClientFactory = factory ?? defaultResendClientFactory;
}

function getResend(): ResendClient | null {
  if (!isEmailConfigured()) return null;
  return resendClientFactory(ENV.resendApiKey);
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
          <td style="padding:4px 0;color:#6b7280;">Tax (8%)</td>
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

// ─── Customer Order Confirmation Email ─────────────────────────────────────

export async function sendCustomerOrderConfirmation(params: NewOrderEmailParams): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn("[Email] RESEND_API_KEY not set — skipping customer confirmation email");
    return;
  }

  const itemsHtml = params.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#374151;">${item.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-size:14px;color:#374151;">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;font-size:14px;color:#374151;">$${((item.unitPrice * item.quantity) / 100).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const shippingLine = params.shipAddress2
    ? `${params.shipAddress}, ${params.shipAddress2}`
    : params.shipAddress;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Arial,sans-serif;background:#f3f4f6;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background:#0f172a;padding:28px 32px;text-align:center;">
      <h1 style="color:#06b6d4;font-size:24px;margin:0;letter-spacing:3px;font-weight:900;">LA ELITE PEPTIDES</h1>
      <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;letter-spacing:1px;">ADVANCED PEPTIDE RESEARCH</p>
    </div>

    <!-- Confirmation Banner -->
    <div style="background:#f0fdf4;border-bottom:2px solid #bbf7d0;padding:20px 32px;text-align:center;">
      <p style="font-size:22px;margin:0;color:#166534;">✅ Order Confirmed</p>
      <p style="color:#166534;margin:6px 0 0;font-size:14px;">Thank you, ${params.customerName}. We've received your order.</p>
    </div>

    <!-- Body -->
    <div style="padding:32px;">

      <!-- Order Number + Zelle Instructions -->
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:20px;margin-bottom:28px;">
        <h2 style="font-size:15px;color:#1e40af;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">Next Step: Send Zelle Payment</h2>
        <table style="width:100%;border-collapse:collapse;font-size:15px;">
          <tr>
            <td style="padding:4px 0;color:#374151;width:120px;">Send to:</td>
            <td style="padding:4px 0;font-weight:700;color:#0f172a;">(310) 975-9289</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#374151;">Amount:</td>
            <td style="padding:4px 0;font-weight:700;color:#06b6d4;font-size:18px;">$${(params.totalCents / 100).toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#374151;">Memo:</td>
            <td style="padding:4px 0;font-weight:700;color:#0f172a;font-family:monospace;font-size:16px;">${params.orderNumber}</td>
          </tr>
        </table>
        <p style="margin:12px 0 0;font-size:12px;color:#6b7280;">Orders placed after 8 PM will be processed the next business day.</p>
      </div>

      <!-- Order Summary -->
      <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin:0 0 10px;">Order Summary — ${params.orderNumber}</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="padding:8px 12px;text-align:left;font-size:12px;font-weight:600;color:#6b7280;border-bottom:2px solid #e5e7eb;">Product</th>
            <th style="padding:8px 12px;text-align:center;font-size:12px;font-weight:600;color:#6b7280;border-bottom:2px solid #e5e7eb;">Qty</th>
            <th style="padding:8px 12px;text-align:right;font-size:12px;font-weight:600;color:#6b7280;border-bottom:2px solid #e5e7eb;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <!-- Totals -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px;font-size:14px;">
        <tr>
          <td style="padding:3px 0;color:#6b7280;">Subtotal</td>
          <td style="padding:3px 0;text-align:right;color:#374151;">$${(params.subtotalCents / 100).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding:3px 0;color:#6b7280;">Shipping</td>
          <td style="padding:3px 0;text-align:right;color:#374151;">$${(params.shippingCents / 100).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding:3px 0;color:#6b7280;">Tax (8%)</td>
          <td style="padding:3px 0;text-align:right;color:#374151;">$${(params.taxCents / 100).toFixed(2)}</td>
        </tr>
        <tr style="border-top:2px solid #e5e7eb;">
          <td style="padding:10px 0 4px;font-weight:700;color:#0f172a;font-size:16px;">Total Due</td>
          <td style="padding:10px 0 4px;text-align:right;font-weight:700;color:#06b6d4;font-size:18px;">$${(params.totalCents / 100).toFixed(2)}</td>
        </tr>
      </table>

      <!-- Shipping Address -->
      <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin:0 0 8px;">Ships To</h3>
      <p style="font-size:14px;color:#374151;margin:0 0 4px;">${params.customerName}</p>
      <p style="font-size:14px;color:#6b7280;margin:0 0 2px;">${shippingLine}</p>
      <p style="font-size:14px;color:#6b7280;margin:0 0 24px;">${params.shipCity}, ${params.shipState} ${params.shipZip}</p>

      <!-- What Happens Next -->
      <div style="background:#f8fafc;border-radius:6px;padding:16px;font-size:13px;color:#374151;">
        <p style="margin:0 0 8px;font-weight:600;color:#0f172a;">What happens next:</p>
        <ol style="margin:0;padding-left:20px;line-height:1.8;">
          <li>Send your Zelle payment to <strong>(310) 975-9289</strong> with memo <strong>${params.orderNumber}</strong></li>
          <li>We'll confirm your payment and begin processing your order</li>
          <li>You'll receive a shipping notification with tracking once dispatched</li>
        </ol>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#0f172a;padding:20px 32px;text-align:center;">
      <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">Questions? Contact us at <a href="mailto:support@laelitepeps.com" style="color:#06b6d4;text-decoration:none;">support@laelitepeps.com</a></p>
      <p style="margin:0;font-size:11px;color:#475569;">La Elite Peptides · (310) 975-9289 · For research use only</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: params.customerEmail,
      replyTo: "support@laelitepeps.com",
      subject: `Order Confirmed — ${params.orderNumber} | La Elite Peptides`,
      html,
    });

    if (error) {
      console.warn("[Email] Resend error sending customer confirmation:", error);
    } else {
      console.log(`[Email] Customer confirmation sent to ${params.customerEmail} for ${params.orderNumber}`);
    }
  } catch (err) {
    console.warn("[Email] Failed to send customer confirmation email:", err);
  }
}

// ─── Shipping Confirmation Email ────────────────────────────────────────────

export interface ShippingConfirmationEmailParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  trackingNumber: string;
  carrier?: string;
  service?: string;
  shipCity: string;
  shipState: string;
  shipZip: string;
  items: Array<{ name: string; quantity: number }>;
}

function getTrackingUrl(carrier: string | undefined, trackingNumber: string): string {
  const c = (carrier || "").toLowerCase();
  if (c.includes("ups")) return `https://www.ups.com/track?tracknum=${trackingNumber}`;
  if (c.includes("fedex")) return `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`;
  if (c.includes("usps") || c.includes("stamps")) return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
  if (c.includes("dhl")) return `https://www.dhl.com/us-en/home/tracking.html?tracking-id=${trackingNumber}`;
  // Generic fallback — 17track covers most carriers
  return `https://t.17track.net/en#nums=${trackingNumber}`;
}

function formatCarrierName(carrier: string | undefined): string {
  if (!carrier) return "Carrier";
  const c = carrier.toLowerCase();
  if (c.includes("ups")) return "UPS";
  if (c.includes("fedex")) return "FedEx";
  if (c.includes("usps") || c.includes("stamps")) return "USPS";
  if (c.includes("dhl")) return "DHL";
  return carrier.toUpperCase();
}

export async function sendShippingConfirmationEmail(params: ShippingConfirmationEmailParams): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn("[Email] RESEND_API_KEY not set — skipping shipping confirmation email");
    return;
  }

  const trackingUrl = getTrackingUrl(params.carrier, params.trackingNumber);
  const carrierName = formatCarrierName(params.carrier);

  const itemsHtml = params.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#374151;">${item.name}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-size:14px;color:#374151;">${item.quantity}</td>
        </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Arial,sans-serif;background:#f3f4f6;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background:#0f172a;padding:28px 32px;text-align:center;">
      <h1 style="color:#06b6d4;font-size:24px;margin:0;letter-spacing:3px;font-weight:900;">LA ELITE PEPTIDES</h1>
      <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;letter-spacing:1px;">ADVANCED PEPTIDE RESEARCH</p>
    </div>

    <!-- Shipped Banner -->
    <div style="background:#0f172a;border-bottom:3px solid #06b6d4;padding:24px 32px;text-align:center;">
      <p style="font-size:32px;margin:0;">📦</p>
      <h2 style="color:#ffffff;font-size:22px;margin:8px 0 4px;letter-spacing:1px;">Your Order Has Shipped!</h2>
      <p style="color:#94a3b8;margin:0;font-size:14px;">Order ${params.orderNumber} is on its way to you.</p>
    </div>

    <!-- Body -->
    <div style="padding:32px;">

      <!-- Tracking Box -->
      <div style="background:#f0f9ff;border:2px solid #06b6d4;border-radius:8px;padding:24px;margin-bottom:28px;text-align:center;">
        <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;">${carrierName} Tracking Number</p>
        <p style="margin:0 0 16px;font-size:22px;font-weight:900;color:#0f172a;font-family:monospace;letter-spacing:2px;">${params.trackingNumber}</p>
        <a href="${trackingUrl}" style="display:inline-block;background:#06b6d4;color:#ffffff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:6px;text-decoration:none;letter-spacing:1px;">TRACK MY ORDER →</a>
      </div>

      <!-- Delivery Estimate -->
      <div style="background:#f8fafc;border-radius:6px;padding:16px 20px;margin-bottom:28px;display:flex;align-items:center;">
        <div>
          <p style="margin:0 0 2px;font-size:13px;font-weight:600;color:#374151;">Estimated Delivery</p>
          <p style="margin:0;font-size:13px;color:#6b7280;">3–5 business days · Nationwide shipping</p>
        </div>
      </div>

      <!-- Shipping To -->
      <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin:0 0 8px;">Shipping To</h3>
      <p style="font-size:14px;color:#374151;margin:0 0 2px;">${params.customerName}</p>
      <p style="font-size:14px;color:#6b7280;margin:0 0 24px;">${params.shipCity}, ${params.shipState} ${params.shipZip}</p>

      <!-- Items -->
      <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin:0 0 10px;">Items Shipped</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="padding:8px 12px;text-align:left;font-size:12px;font-weight:600;color:#6b7280;border-bottom:2px solid #e5e7eb;">Product</th>
            <th style="padding:8px 12px;text-align:center;font-size:12px;font-weight:600;color:#6b7280;border-bottom:2px solid #e5e7eb;">Qty</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <!-- Help -->
      <div style="background:#f8fafc;border-radius:6px;padding:16px 20px;font-size:13px;color:#374151;">
        <p style="margin:0 0 6px;font-weight:600;color:#0f172a;">Questions about your shipment?</p>
        <p style="margin:0;color:#6b7280;">Reply to this email or contact us at <a href="mailto:support@laelitepeps.com" style="color:#06b6d4;text-decoration:none;">support@laelitepeps.com</a> or <strong>(310) 975-9289</strong>.</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#0f172a;padding:20px 32px;text-align:center;">
      <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">La Elite Peptides · <a href="mailto:support@laelitepeps.com" style="color:#06b6d4;text-decoration:none;">support@laelitepeps.com</a> · (310) 975-9289</p>
      <p style="margin:0;font-size:11px;color:#475569;">For research use only</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: params.customerEmail,
      replyTo: "support@laelitepeps.com",
      subject: `Your Order ${params.orderNumber} Has Shipped! 📦 — La Elite Peptides`,
      html,
    });

    if (error) {
      console.warn("[Email] Resend error sending shipping confirmation:", error);
    } else {
      console.log(`[Email] Shipping confirmation sent to ${params.customerEmail} for ${params.orderNumber}`);
    }
  } catch (err) {
    console.warn("[Email] Failed to send shipping confirmation email:", err);
  }
}

// ─── Customer Email Verification ────────────────────────────────────────────

export async function sendVerificationEmail(params: {
  email: string;
  firstName: string;
  verificationToken: string;
  origin: string;
}): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn("[Email] RESEND_API_KEY not set — skipping verification email");
    return;
  }

  const verifyUrl = `${params.origin}/verify-email?token=${params.verificationToken}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Arial,sans-serif;background:#f3f4f6;margin:0;padding:20px;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:#0f172a;padding:28px 32px;text-align:center;">
      <h1 style="color:#06b6d4;font-size:24px;margin:0;letter-spacing:3px;font-weight:900;">LA ELITE PEPTIDES</h1>
      <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;letter-spacing:1px;">ADVANCED PEPTIDE RESEARCH</p>
    </div>
    <div style="padding:40px 32px;text-align:center;">
      <div style="width:64px;height:64px;background:#eff6ff;border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;font-size:28px;">✉️</div>
      <h2 style="font-size:22px;color:#0f172a;margin:0 0 12px;">Verify Your Email</h2>
      <p style="color:#6b7280;font-size:15px;margin:0 0 32px;">Hi ${params.firstName}, click the button below to verify your email address and activate your account.</p>
      <a href="${verifyUrl}" style="display:inline-block;background:#06b6d4;color:#ffffff;font-weight:700;font-size:15px;padding:14px 36px;border-radius:8px;text-decoration:none;letter-spacing:1px;">VERIFY MY EMAIL →</a>
      <p style="color:#9ca3af;font-size:12px;margin:24px 0 0;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
      <p style="color:#9ca3af;font-size:11px;margin:8px 0 0;word-break:break-all;">Or copy this link: ${verifyUrl}</p>
    </div>
    <div style="background:#0f172a;padding:16px 32px;text-align:center;">
      <p style="margin:0;font-size:11px;color:#475569;">La Elite Peptides · support@laelitepeps.com · For research use only</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: params.email,
      replyTo: "support@laelitepeps.com",
      subject: "Verify your email — La Elite Peptides",
      html,
    });
    if (error) console.warn("[Email] Resend error sending verification email:", error);
    else console.log(`[Email] Verification email sent to ${params.email}`);
  } catch (err) {
    console.warn("[Email] Failed to send verification email:", err);
  }
}

// ─── Password Reset Email ────────────────────────────────────────────────────

export async function sendPasswordResetEmail(params: {
  email: string;
  firstName: string;
  resetToken: string;
  origin: string;
}): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const resetUrl = `${params.origin}/reset-password?token=${params.resetToken}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Arial,sans-serif;background:#f3f4f6;margin:0;padding:20px;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:#0f172a;padding:28px 32px;text-align:center;">
      <h1 style="color:#06b6d4;font-size:24px;margin:0;letter-spacing:3px;font-weight:900;">LA ELITE PEPTIDES</h1>
    </div>
    <div style="padding:40px 32px;text-align:center;">
      <h2 style="font-size:22px;color:#0f172a;margin:0 0 12px;">Reset Your Password</h2>
      <p style="color:#6b7280;font-size:15px;margin:0 0 32px;">Hi ${params.firstName}, click below to reset your password. This link expires in 2 hours.</p>
      <a href="${resetUrl}" style="display:inline-block;background:#06b6d4;color:#ffffff;font-weight:700;font-size:15px;padding:14px 36px;border-radius:8px;text-decoration:none;letter-spacing:1px;">RESET PASSWORD →</a>
      <p style="color:#9ca3af;font-size:12px;margin:24px 0 0;">If you didn't request this, you can safely ignore this email.</p>
    </div>
    <div style="background:#0f172a;padding:16px 32px;text-align:center;">
      <p style="margin:0;font-size:11px;color:#475569;">La Elite Peptides · support@laelitepeps.com</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: params.email,
      replyTo: "support@laelitepeps.com",
      subject: "Reset your password — La Elite Peptides",
      html,
    });
    if (error) console.warn("[Email] Resend error sending password reset email:", error);
    else console.log(`[Email] Password reset email sent to ${params.email}`);
  } catch (err) {
    console.warn("[Email] Failed to send password reset email:", err);
  }
}
