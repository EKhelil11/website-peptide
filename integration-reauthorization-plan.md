# Resend and ShipStation Reauthorization Plan

**Prepared by:** Manus AI  
**Date:** August 31, 2026

## Current project state

The deployed project now has validated Resend and ShipStation credentials stored through secure project controls. The owner enabled both approval flags after one controlled verification-email test and one controlled ShipStation create–retrieve–soft-delete workflow. A cache-bypassed public integration-status request reports both integrations configured and approved.

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

## Ongoing Resend state

The owner chose to keep Resend enabled for production. The validated sending-only key remains stored securely, the live-email approval flag is enabled, and a cache-bypassed production API check reports email credentials present, owner approval true, and transactional email configured. ShipStation credentials are present, but its write-approval flag remains false pending the isolated test window.

## Controlled ShipStation result

The ShipStation credential was revalidated through a read-only carriers request before the write. A one-process owner-approved gate then created one zero-value order named **API TEST — DO NOT SHIP** with no rate, label, postage, pickup, or shipment request. ShipStation returned order ID `418473494`; the application retrieved the same order identity and soft-deleted it successfully. A subsequent active-order query returned zero matches for the test order number. The project-level ShipStation gate is disabled after testing, and the temporary runner was removed.

## Ongoing ShipStation state

The owner chose to enable ShipStation for production after the controlled test. Because repeated automated updates did not change the pre-existing approval flag, the owner updated `ENABLE_LIVE_SHIPSTATION` to lowercase `true` in project Secrets. Local runtime inspection confirmed the flag is true, and both the Resend non-delivery authentication check and ShipStation read-only carriers check passed. No additional email or ShipStation order was created during activation validation.

## Final production verification

A cache-bypassed request to the live integration-status API reported both Resend and ShipStation with credentials present, owner approval true, and configured true. The production apex and Retatrutide 30 mg route returned HTTP 200; `www` returned HTTP 301 to the apex. Final database counts were zero for customers, customer sessions, orders, order items, and status history. Available browser-console, development-server, and recent network-request logs contained zero error or HTTP 5xx entries. The dedicated production-log reader was attempted three times but could not locate the current runtime service; this observability limitation did not affect the live HTTP, provider, or database checks and is recorded rather than concealed.

## References

[1]: https://resend.com/docs/api-reference/introduction "Resend API introduction"
[2]: https://resend.com/docs/api-reference/emails/send-email "Resend send-email API"
[3]: https://resend.com/docs/dashboard/domains/introduction "Resend verified domains"
[4]: https://help.shipstation.com/hc/en-us/articles/360025856212-ShipStation-API "ShipStation API access and keys"
[5]: https://www.shipstation.com/docs/api/orders/create-update-order/ "ShipStation V1 create/update order"
[6]: https://www.shipstation.com/docs/api/orders/get-order/ "ShipStation V1 get order"
[7]: https://www.shipstation.com/docs/api/orders/delete/ "ShipStation V1 delete order"
