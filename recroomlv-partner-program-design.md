# RECROOMLV Partner Program — Private Design Record

**Status:** Private implementation design. No checkpoint or publication is authorized.

## Protected baseline

The published storefront currently contains 16 products, four signature blends, owner-confirmed prices including Retatrutide 30 mg at $200 and Tirzepatide 20 mg at $175, $7 flat shipping, 8% tax, 16 product-specific COAs, authenticated customer checkout, admin order management, Zelle instructions, and configured Resend and ShipStation integrations. The database contains one historical order, `LAP-100001`; it will not be renumbered or otherwise changed.

## Program rules

| Rule | Private implementation decision |
| --- | --- |
| Active code | `RECROOMLV`, normalized by trimming and uppercasing |
| Discount | 10% of merchandise subtotal, rounded to cents |
| Shipping | Existing $7 flat shipping remains unchanged |
| Tax | Existing 8% rate is calculated from the discounted merchandise subtotal |
| First use | A signed-in customer enters the valid code and successfully creates a qualifying order |
| Future use | The account stores the active partner code and automatically receives the same 10% merchandise discount on later orders |
| Invalid codes | Rejected clearly; they do not create an order, persist eligibility, or alter totals |
| Historical orders | Preserve their stored totals and numbers exactly |
| Admin attribution | Store the applied code and discount amount on the order and show a read-only Las Vegas gym attribution block in admin; keep freeform admin notes separate |
| Order numbering | Reserve numbers from a dedicated database sequence beginning at `100099`, producing `LAP-100099`, `LAP-100100`, and so on without depending on order-table IDs |

## Data model

The `customers` table receives nullable `partnerCode`, `partnerDiscountBps`, and `partnerCodeActivatedAt` fields. The `orders` table receives nullable `partnerCode` plus non-null `discountBps` and `discountCents` fields defaulting to zero so preexisting rows remain valid. A dedicated `order_number_sequence` table supplies concurrency-safe unique suffixes and starts at `100099`.

## Transaction boundary

Order creation will run in one database transaction that reserves the next order number, inserts the immutable order totals and partner attribution, inserts items and initial history, and activates the customer benefit only when the first qualifying order succeeds. A failed order cannot leave a customer partially enrolled.

## Server authority

The server will resolve each cart item against the canonical product catalog and calculate merchandise subtotal, discount, tax, shipping, and total. Client-supplied names, categories, and prices will not determine charged totals. A read-only quote procedure will provide the same authoritative calculation to checkout before submission.

## Presentation

Checkout will provide an optional partner-code field, clear valid/invalid feedback, an automatic-benefit message for returning partner accounts, and a conditional `Partner discount (10%)` row. The order confirmation, customer order history, owner notification/email, ShipStation internal notes, and admin order detail will display discount information only when the saved order has an applied partner code.
