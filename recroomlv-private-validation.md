# RECROOMLV Partner Program — Private Validation

**Status:** Implementation and private validation complete. This feature has **not** been checkpointed or published. Production remains on version `6143f876`.

## Implemented behavior

The only active partner code is **RECROOMLV**. The server trims and uppercases the entry, applies a 10% merchandise discount, preserves the existing $7 shipping charge, and calculates the existing 8% tax from the discounted merchandise subtotal. For example, a $150 Retatrutide order becomes $135 after discount, $10.80 tax, $7 shipping, and a $152.80 total.[1]

After the first successfully created qualifying order, the signed-in customer account stores the RECROOMLV benefit and future orders receive it automatically. Invalid codes are rejected before order creation. The server resolves cart product IDs against the canonical catalog and does not trust client-supplied names, categories, or prices.[1]

Every qualifying order stores the partner code, basis-point rate, and exact discount amount. The owner Admin view shows a prominent **Las Vegas gym · checkout code RECROOMLV** attribution block, includes the code in search, shows the discount in totals, and places the attribution in the initial Admin Notes field. Customer Account history and both order emails show the discount only for qualifying orders. ShipStation internal notes will also carry the gym attribution when an approved paid order is later synchronized.[2]

## Order numbering and database safety

The migration is additive: customer partner fields, immutable order discount fields, and a dedicated order-number sequence table were added without dropping or rewriting data. The sequence is configured to begin at `100099`; therefore, the next newly created order will be `LAP-100099`, followed by `LAP-100100` and so on. The existing historical order remains `LAP-100001` with its original totals and zero discount.[3]

Order number reservation, order insertion, item insertion, initial history insertion, and first-use account activation now occur in one database transaction. The private audits created no customers, no orders, no emails, no labels, and no provider calls. Final database inspection showed one unchanged historical order, zero enrolled partner accounts, and zero sequence rows before launch.[3]

## Validation results

| Gate | Result |
| --- | --- |
| TypeScript | Passed |
| Credential-safe Vitest suite | 150 passed; 4 live/credential workflows intentionally skipped |
| Production build | Passed in 6.12 seconds |
| First-use quote | $150.00 subtotal; -$15.00 discount; $7.00 shipping; $10.80 tax; $152.80 total |
| Returning account | Saved RECROOMLV benefit applied automatically without re-entering the code |
| Desktop checkout | Passed; no horizontal overflow |
| 375 px checkout | Passed; no horizontal overflow |
| 320 px checkout | Passed; no horizontal overflow |
| Customer Account at 375 px | Benefit, code, discount, and order total visible; no overflow |
| Owner Admin at desktop and 375 px | Gym attribution, code, discount, Admin Notes, payment and fulfillment controls visible; no overflow |
| Mutation audit | No order-submission request occurred |
| Runtime logs | Zero current-session server, browser-console, or network error patterns |
| Integrations | Resend and ShipStation remain configured and approved through the non-secret status endpoint |

## Protected storefront invariants

The implementation retains all 16 catalog products, four signature blends, all 16 mapped COAs, Retatrutide 30 mg at $200, Tirzepatide 20 mg at $175, $7 shipping, 8% tax, exact contact destinations, authentication, cart, customer account, admin payment/cancellation/fulfillment controls, Zelle instructions, and research-only safeguards.[1] [2]

## Customer Account simulation

A second read-only simulation was completed at desktop, 375 px, and 320 px to show exactly what a customer sees after a successful RECROOMLV order. The page displayed the **RECROOMLV partner benefit active** banner and explained that the 10% merchandise discount applies automatically to future orders. The qualifying order displayed `LAP-100099`, a `RECROOMLV` badge, the Las Vegas delivery address, `Partner discount (10%)` of `-$20.00`, the discounted order total of `$201.40`, and the existing phone and email support links.

All three widths had zero horizontal overflow. Every expected customer-visible field was present, and the simulation blocked every mutation request. A final database read confirmed that the test created no customer, partner enrollment, sequence row, or order; the sole historical `LAP-100001` order remained unchanged.

## Admin order-log simulation

A fresh read-only Admin simulation was completed at desktop and 375 px. The expanded `LAP-100099` order showed a `RECROOMLV` badge, a dedicated **Partner Attribution** panel reading **Las Vegas gym · checkout code RECROOMLV**, the $20.00 saved amount, the `-$20.00` discount line, the $201.40 order total, and the expected Zelle amount and `LAP-100099` memo.

The initial Admin Notes field contained **Partner attribution: RECROOMLV (Las Vegas gym)**. Search by partner code, note saving, payment confirmation, order status filters, and the existing fulfillment controls remained visible and contained. Both widths had zero horizontal overflow, and the simulation blocked every mutation request; no Admin action reached the application.

## Owner email alert — Option A

The owner selected Option A: specialize the existing owner order email rather than sending a second duplicate message. A successfully created RECROOMLV order now produces one email to `support@laelitepeps.com` with the subject **[RECROOMLV] Las Vegas Gym Order {order number} — {total}**. Its prominent alert panel identifies the Las Vegas gym, customer, partner code, discount amount, order number, and final total.

Ordinary orders retain the existing **🛒 New Order** subject and do not receive the partner alert panel. Mocked Resend tests proved exactly one provider call for each path. The complete private gate passed TypeScript, 152 active tests with four credential/live workflows intentionally skipped, and the production build in 5.80 seconds. No order submission, customer enrollment, live email, payment, label, or provider mutation occurred; the database remained at one unchanged historical order, zero partner accounts, and an empty `LAP-100099` sequence.

## References

[1]: ./server/partnerDiscount.ts "Server-authoritative partner-code and order-quote logic"
[2]: ./server/orderRouter.ts "Order creation, immutable discount attribution, notifications, and customer submission"
[3]: ./drizzle/0005_sour_ironclad.sql "Additive partner-program and order-sequence migration"
