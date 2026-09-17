# Release c7d63bf4 — RECROOMLV Verification

**Status:** Published and under read-only post-release verification.

## Release propagation

The apex, `www`, and Manus domains serve the same active client bundle, `/assets/index-C-hKFxXG.js`. Public Shop, Account, Admin, and Checkout routes returned HTTP 200 on all three domains. The public non-secret integration-status procedure reported both transactional email and ShipStation as configured and approved on every domain.

## Published client contracts

The live client bundle references the published Checkout, Account, and Admin chunks. The Checkout chunk contains RECROOMLV and the 10% partner-discount presentation. The Account chunk contains the saved-benefit and future-order wording. The Admin chunk contains partner-code search and Las Vegas gym attribution.

## Read-only live UI audit

A temporary external audit loaded the actual published c7d63bf4 client from `laelitepeps.com`. It supplied read-only authenticated responses and blocked every mutation request. No order was submitted.

| Surface | Width | Result |
| --- | ---: | --- |
| Checkout | 1440 px | RECROOMLV accepted; future benefit notice; -$20.00 discount; $7.00 shipping; $14.40 tax; $201.40 total; Place Order $201.40; no overflow |
| Checkout | 375 px | Same values and controls; no overflow |
| Checkout | 320 px | Same values and controls; no overflow |
| Customer Account | 375 px | Saved-benefit banner, LAP-100099, RECROOMLV badge, -$20.00 discount, and $201.40 total; no overflow |
| Admin Order Management | 375 px | Las Vegas gym attribution, partner search, discount, Zelle memo, Admin Notes, and Mark Paid control; no overflow |

The live audit selected the exact Retatrutide 30 mg product at $200.00 before showing the server-contract quote values. Every captured case reported an empty blocked-mutation list because the Place Order and Admin actions were not invoked.

Visual review confirmed the 375 px Customer Account clearly presents the saved RECROOMLV benefit, automatic future-order message, qualifying-order badge, `LAP-100099`, Las Vegas address, `-$20.00` discount, `$201.40` order total, and existing support links. The 375 px Admin view clearly presents the code badge, Las Vegas gym partner panel, $20.00 saved amount, item and total breakdown, Zelle amount/memo, populated Admin Notes, search and status filters, and Mark Paid control without clipping or horizontal overflow.

## Order numbering and production data

The dedicated `order_number_sequence` table remains empty and its database definition retains `AUTO_INCREMENT=100099`; therefore, the first order created through the new c7d63bf4 transaction will reserve `LAP-100099`, followed by sequential values. The historical `LAP-100001` order remains unchanged and no customer account has a saved partner benefit yet.

A separate non-partner order numbered `LAP-130001` exists with a creation timestamp of September 16, 2026 at 00:48:21, before c7d63bf4 began serving at approximately 02:47. It has no discount or partner code and was not created by this release verification. It was left untouched. The new dedicated sequence intentionally still starts at the owner-requested `LAP-100099`.

## Email contract

Credential-safe mocked Resend tests passed after publication. A qualifying order generated exactly one owner-email call to `support@laelitepeps.com` with the subject `[RECROOMLV] Las Vegas Gym Order LAP-100099 — $201.40` and the partner alert content. A non-partner order retained the standard `🛒 New Order` subject and no partner panel. The production order router contains one owner order-email call site, so the specialization does not add a duplicate message. No live email was sent.

## Protected invariants and production health

TypeScript and all 152 credential-safe tests passed after publication; four live/credential workflows remained intentionally skipped. Catalog regression coverage confirmed 16 products, four signature blends, Retatrutide 30 mg at $200, and Tirzepatide 20 mg at $175. Checkout constants remain $7 shipping and 8% tax. All 16 mapped COA PDFs returned HTTP 200 from the custom domain, and exact contact destinations remained unchanged.

All three live domains served the same c7d63bf4 client bundle and reported Resend and ShipStation configured and approved through the non-secret status procedure. The latest production log sample contained no error pattern. Live verification did not submit an order or invoke payment, email, note-saving, status-changing, label, or fulfillment mutations.
