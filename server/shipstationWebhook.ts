import { Express } from "express";
import { updateOrderShipStation, getPaidOrdersWithItems, getOrderByNumber } from "./db";
import { sendShippingConfirmationEmail } from "./email";

// Escape special XML characters to prevent malformed XML
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * ShipStation Custom Store orders endpoint.
 * ShipStation polls this URL every 15 minutes to pull new paid orders.
 * Configure in ShipStation: Settings → Selling Channels → Connect a Store → Custom Store
 * URL: https://laelitepeps.com/api/shipstation/orders
 * Auth: Basic Auth using your ShipStation API key as username and secret as password.
 *
 * ShipStation webhook endpoint.
 * ShipStation sends a POST to this URL when order status changes (e.g., shipped).
 * Configure in ShipStation: Settings → Integrations → Webhooks → Add Webhook
 * URL: https://laelitepeps.com/api/shipstation/webhook
 * Event: SHIP_NOTIFY
 */
export function registerShipStationWebhook(app: Express) {
  // Basic Auth middleware for ShipStation requests
  const shipstationAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"] || "";
    if (!authHeader.startsWith("Basic ")) {
      res.set("WWW-Authenticate", 'Basic realm="ShipStation"');
      return res.status(401).send("Unauthorized");
    }
    const decoded = Buffer.from(authHeader.slice(6), "base64").toString("utf8");
    const [key, secret] = decoded.split(":");
    const validKey = process.env.SHIPSTATION_API_KEY;
    const validSecret = process.env.SHIPSTATION_API_SECRET;
    if (key !== validKey || secret !== validSecret) {
      return res.status(401).send("Unauthorized");
    }
    next();
  };

  // ShipStation polls this to get new paid orders
  app.get("/api/shipstation/orders", shipstationAuth, async (req, res) => {
    try {
      const paidOrders = await getPaidOrdersWithItems();

      const orderXml = paidOrders.map(order => {
        const itemsXml = order.items.map(item => `
          <Item>
            <LineItemKey>${item.id}</LineItemKey>
            <SKU>${escapeXml(item.productId)}</SKU>
            <Name>${escapeXml(item.productName)}</Name>
            <Quantity>${item.quantity}</Quantity>
            <UnitPrice>${(item.unitPriceCents / 100).toFixed(2)}</UnitPrice>
          </Item>`).join("");

        const [firstName, ...lastParts] = (order.shipName || "Customer").split(" ");
        const lastName = lastParts.join(" ") || "";

        return `
        <Order>
          <OrderID>${order.id}</OrderID>
          <OrderNumber>${escapeXml(order.orderNumber || String(order.id))}</OrderNumber>
          <OrderDate>${order.createdAt.toISOString()}</OrderDate>
          <OrderStatus>paid</OrderStatus>
          <LastModified>${order.updatedAt.toISOString()}</LastModified>
          <ShippingMethod>Standard</ShippingMethod>
          <PaymentMethod>Zelle</PaymentMethod>
          <OrderTotal>${(order.totalCents / 100).toFixed(2)}</OrderTotal>
          <TaxAmount>${(order.taxCents / 100).toFixed(2)}</TaxAmount>
          <ShippingAmount>${(order.shippingCents / 100).toFixed(2)}</ShippingAmount>
          <CustomerNotes>${escapeXml(order.adminNotes || "")}</CustomerNotes>
          <Customer>
            <CustomerCode>${escapeXml(order.shipEmail || "")}</CustomerCode>
            <BillTo>
              <Name>${escapeXml(order.shipName || "")}</Name>
              <Email>${escapeXml(order.shipEmail || "")}</Email>
              <Phone>${escapeXml(order.shipPhone || "")}</Phone>
            </BillTo>
            <ShipTo>
              <Name>${escapeXml(order.shipName || "")}</Name>
              <Company></Company>
              <Address1>${escapeXml(order.shipAddress || "")}</Address1>
              <Address2>${escapeXml(order.shipAddress2 || "")}</Address2>
              <City>${escapeXml(order.shipCity || "")}</City>
              <State>${escapeXml(order.shipState || "")}</State>
              <PostalCode>${escapeXml(order.shipZip || "")}</PostalCode>
              <Country>${escapeXml(order.shipCountry || "US")}</Country>
              <Phone>${escapeXml(order.shipPhone || "")}</Phone>
              <Email>${escapeXml(order.shipEmail || "")}</Email>
            </ShipTo>
          </Customer>
          <Items>${itemsXml}
          </Items>
        </Order>`;
      }).join("");

      const xml = `<?xml version="1.0" encoding="utf-8"?>
<Orders pages="1">${orderXml}
</Orders>`;

      res.set("Content-Type", "application/xml");
      res.status(200).send(xml);
    } catch (error) {
      console.error("[ShipStation] Orders endpoint error:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  // ShipStation POSTs here when a label is created / order ships
  app.post("/api/shipstation/webhook", async (req, res) => {
    try {
      const payload = req.body;

      if (payload?.resource_type === "SHIP_NOTIFY" && payload?.resource_url) {
        const apiKey = process.env.SHIPSTATION_API_KEY;
        const apiSecret = process.env.SHIPSTATION_API_SECRET;
        if (!apiKey || !apiSecret) {
          console.warn("[ShipStation] API key/secret not configured");
          return res.status(200).json({ received: true });
        }

        const response = await fetch(payload.resource_url, {
          headers: {
            Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json() as any;
          const shipments = data?.shipments ?? [];

          for (const shipment of shipments) {
            const orderNumber = shipment?.orderNumber;
            const trackingNumber = shipment?.trackingNumber;
            const shipstationOrderId = String(shipment?.orderId ?? "");
            const carrier = shipment?.carrierCode || shipment?.carrier;
            const service = shipment?.serviceCode;

            if (orderNumber && trackingNumber) {
              // Look up order by orderNumber (LAP-XXXXX format) to get customer details
              const orderRecord = await getOrderByNumber(orderNumber);
              if (orderRecord) {
                await updateOrderShipStation(orderRecord.id, shipstationOrderId, trackingNumber, carrier, service);
                console.log(`[ShipStation] Updated order ${orderNumber} (#${orderRecord.id}) with tracking: ${trackingNumber}`);

                // Send shipping confirmation email to the customer
                if (orderRecord.shipEmail) {
                  await sendShippingConfirmationEmail({
                    orderNumber,
                    customerName: orderRecord.shipName ?? "Valued Customer",
                    customerEmail: orderRecord.shipEmail,
                    trackingNumber,
                    carrier,
                    service,
                    shipCity: orderRecord.shipCity ?? "",
                    shipState: orderRecord.shipState ?? "",
                    shipZip: orderRecord.shipZip ?? "",
                    items: orderRecord.items.map(i => ({
                      name: i.productName + (i.variantLabel ? ` (${i.variantLabel})` : ""),
                      quantity: i.quantity,
                    })),
                  }).catch(err => console.warn("[ShipStation] Failed to send shipping email:", err));
                }
              } else {
                // Fallback: try numeric ID for legacy orders
                const numericId = parseInt(orderNumber, 10);
                if (!isNaN(numericId)) {
                  await updateOrderShipStation(numericId, shipstationOrderId, trackingNumber, carrier, service);
                  console.log(`[ShipStation] Updated order #${numericId} with tracking: ${trackingNumber}`);
                }
              }
            }
          }
        }
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error("[ShipStation] Webhook error:", error);
      res.status(200).json({ received: true }); // Always return 200 to ShipStation
    }
  });
}
