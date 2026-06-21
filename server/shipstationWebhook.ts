import { Express } from "express";
import { updateOrderShipStation } from "./db";

/**
 * ShipStation webhook endpoint.
 * ShipStation sends a POST to this URL when order status changes (e.g., shipped).
 * Configure in ShipStation: Settings → Integrations → Webhooks → Add Webhook
 * URL: https://laelitepeps.com/api/shipstation/webhook
 * Event: SHIP_NOTIFY
 */
export function registerShipStationWebhook(app: Express) {
  app.post("/api/shipstation/webhook", async (req, res) => {
    try {
      const payload = req.body;

      // ShipStation sends resource_url on SHIP_NOTIFY events
      // The resource_url contains the shipment details
      if (payload?.resource_type === "SHIP_NOTIFY" && payload?.resource_url) {
        const apiKey = process.env.SHIPSTATION_API_KEY;
        const apiSecret = process.env.SHIPSTATION_API_SECRET;
        if (!apiKey || !apiSecret) {
          console.warn("[ShipStation] API key/secret not configured");
          return res.status(200).json({ received: true });
        }

        // Fetch shipment details from ShipStation API
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

            if (orderNumber && trackingNumber) {
              const orderId = parseInt(orderNumber, 10);
              if (!isNaN(orderId)) {
                await updateOrderShipStation(orderId, shipstationOrderId, trackingNumber);
                console.log(`[ShipStation] Updated order #${orderId} with tracking: ${trackingNumber}`);
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
