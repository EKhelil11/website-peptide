# Resend and ShipStation Reauthorization Plan

**Prepared by:** Manus AI  
**Date:** August 31, 2026

## Current project state

The deployed project currently has no `RESEND_API_KEY`, `SHIPSTATION_API_KEY`, or `SHIPSTATION_API_SECRET` configured. The environment approval flags are also absent, which the application correctly interprets as disabled. The public integration-status endpoint therefore reports both integrations as unconfigured and unapproved.

The application uses Resend’s Node SDK with `noreply@laelitepeps.com` as the sender. Customer registration, resend-verification, and password-recovery routes are guarded by `isEmailConfigured()`. Payment confirmation and order workflows invoke email helpers only from guarded order procedures.

The application uses ShipStation API V1 at `https://ssapi.shipstation.com`, authenticated with HTTP Basic using the API key as username and API secret as password. A paid internal order can be transformed into an `awaiting_shipment` ShipStation order through `POST /orders/createorder`; the current code does not purchase labels or postage.

## Official provider requirements

Resend requires HTTPS API calls using a Bearer API key. Sending requires a verified domain, and the `from`, `to`, and `subject` fields are mandatory. Resend supports idempotency keys for avoiding duplicate sends, although the current SDK calls do not yet set one.[1][2][3]

ShipStation’s current help documentation says API V1 requires an API key and API secret and is available only on qualifying plans. Keys are shown only once when generated and have expiration dates. The V1 create/update-order endpoint uses `orderKey` for idempotency; retrieving the order uses its returned `orderId`; deleting an order is a soft delete that makes it inactive. These order API calls are separate from label creation, so the controlled test will not call any label, rate, manifest, or pickup endpoint.[4][5][6][7]

## Controlled test boundaries

| Integration | Approved test boundary | Explicitly excluded |
|---|---|---|
| Resend | Send one verification or password-reset email to an owner-approved recipient and confirm receipt/link host. | Bulk sends, marketing sends, customer-list imports, real-customer testing, or repeated retries. |
| ShipStation | Create one clearly labeled synthetic order, retrieve it, confirm status and payload, then soft-delete it. | Buying postage, generating a label, scheduling pickup, notifying a marketplace, or dispatching a shipment. |

Credentials alone must not activate either service. Direct email and ShipStation helper functions will be hardened to require the corresponding owner-approval environment flag, and deterministic tests will prove that the provider SDK/network call is not reached when the flag is false.

## Owner-approved tests

The owner approved one verification email to `support@laelitepeps.com`. The owner also approved a ShipStation workflow that creates one clearly labeled synthetic order, retrieves it, and soft-deletes it without requesting rates, generating a label, buying postage, scheduling a pickup, or dispatching a shipment. The email test remains blocked until the Resend key exposed in chat is revoked and replaced through secure project controls.

The exposed Resend validation keys were rotated. A new sending-only key restricted to `laelitepeps.com` was entered through secure project controls and passed a deliberately incomplete Resend API request: authentication succeeded, validation rejected the missing message fields, and no email was delivered. ShipStation V1 credentials also passed a read-only carriers request. Both live-action gates remain disabled.

The owner confirmed the exposed Resend keys are revoked and the final secure key is limited to sending access for `laelitepeps.com`. The owner approved the synthetic ShipStation destination **LA Elite Peptides API TEST — DO NOT SHIP**, `1 Test Way`, Los Angeles, CA 90001, US, using `support@laelitepeps.com`. The ShipStation order will be clearly labeled as a non-fulfillment test and soft-deleted immediately after retrieval.

## Controlled Resend result

The email approval gate was enabled only for the approved test window. The application created one isolated customer with a real 24-hour verification token and sent one idempotent verification email from `noreply@laelitepeps.com` to `support@laelitepeps.com`. Resend returned an accepted provider identifier, and the owner confirmed successful receipt and verification. The live-email gate was returned to disabled immediately afterward, the isolated customer and any sessions were deleted, and all customer and commerce table counts returned to zero.

## Retatrutide 30 mg pricing verification

The canonical catalog already contained the owner-requested **$200** Retatrutide 30 mg unit price. An automated regression test now locks both the product and variant records to `$200`. Authenticated preview checks confirmed `$200` on the shop and product-detail pages, `$200.00` for the cart line and subtotal, and a checkout total of `$223.00` consisting of the $200 subtotal, $7 shipping, and $16 tax. No order was submitted, and the isolated test customer and session were removed; all customer and commerce table counts returned to zero.

## References

[1]: https://resend.com/docs/api-reference/introduction "Resend API introduction"
[2]: https://resend.com/docs/api-reference/emails/send-email "Resend send-email API"
[3]: https://resend.com/docs/dashboard/domains/introduction "Resend verified domains"
[4]: https://help.shipstation.com/hc/en-us/articles/360025856212-ShipStation-API "ShipStation API access and keys"
[5]: https://www.shipstation.com/docs/api/orders/create-update-order/ "ShipStation V1 create/update order"
[6]: https://www.shipstation.com/docs/api/orders/get-order/ "ShipStation V1 get order"
[7]: https://www.shipstation.com/docs/api/orders/delete/ "ShipStation V1 delete order"
