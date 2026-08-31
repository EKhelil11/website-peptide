# LA Elite Peptides Website Relaunch

## Pre-Domain-Change Readiness Checklist

**Prepared by:** Manus AI  
**Date:** August 28, 2026  
**Source:** [EKhelil11/website-peptide][1]  
**Target domain:** `https://laelitepeps.com`

> **Current status:** The replacement application passed temporary deployment testing and is now live at `https://laelitepeps.com`. The `www` hostname redirects securely to the apex domain. Resend and ShipStation remain disabled pending credentials, reauthorization, and explicit owner approval.

## Current status

| Area | Status | Verification |
|---|---|---|
| Full-stack architecture | **Passed** | React, Node/Express, tRPC, Drizzle, MySQL, server routes, and user capability are present in the new project. |
| Repository import | **Passed** | The GitHub source was cloned separately, inspected before editing, and selectively imported while retaining current Manus OAuth/runtime protections. |
| TypeScript | **Passed** | `pnpm check` completed without errors. |
| Automated tests | **Passed** | All **19 tests** passed, including the opt-in database-backed customer/order/admin workflow. |
| Production build | **Passed** | Vite client build and bundled Express server build completed. A non-blocking bundle-size warning remains. |
| Database migrations | **Passed** | All five included Drizzle migrations were applied in order to the new empty project database. |
| Database connectivity | **Passed** | Customer sessions, order insertion, order items, status history, cancellation, admin notes, payment transition, and statistics were exercised with outbound integrations mocked. |
| Database cleanup | **Passed** | Final verification returned zero customers, sessions, orders, order items, and order-status rows. |
| Storefront and products | **Passed** | Age gate, intro handoff, catalog filtering, product details, pricing visibility, and research-use notices were checked in preview. |
| Cart and checkout | **Passed without order submission** | Authenticated add-to-cart, cart totals, checkout totals, shipping fields, Zelle instructions, and integration warnings were verified. No browser order was placed. |
| Customer authentication | **Passed with relaunch limitation** | Valid and invalid login paths were tested. New registration and password recovery are intentionally disabled until transactional email is reauthorized. |
| Admin workflow | **Passed** | Owner access, empty order dashboard, filters, statistics, admin authorization, notes, and payment-state logic were verified. |
| Email safety | **Passed—disabled** | Resend credentials are absent and the live-action gate defaults to false. No live email was sent. |
| Fulfillment safety | **Passed—disabled** | ShipStation credentials are absent and the live-action gate defaults to false. No live fulfillment request was sent. |
| Media restoration | **Passed with replacements** | Inaccessible legacy media was replaced with durable project assets. All active assets return HTTP 200; eleven final vial labels were audited. |
| Responsive presentation | **Passed** | Representative 1280×720 and 375×812 views were checked for age verification, authentication, registration, products, and admin. |
| Runtime logs | **Passed** | No new console or HTTP 4xx/5xx errors appeared after final validation. The intentional invalid-login test correctly returned HTTP 401. |
| Temporary public deployment | **Passed** | HTTPS, intro and age gate, storefront, product deep routes, durable assets, legal routes, authentication rejection and success, cart, checkout without submission, account state, admin protection, and disabled integrations were verified at `peptideweb-yaousumk.manus.space`. |
| Public database cleanup | **Passed** | The isolated public-test customer and session were removed; customers, sessions, orders, items, and status-history tables returned zero rows. |
| Production apex domain | **Passed** | `https://laelitepeps.com` returns the replacement application over HTTPS with working storefront, product, login, admin-protection, and legal deep routes. |
| Production www hostname | **Passed** | `www.laelitepeps.com` resolves to the project endpoint and returns HTTP 301 to `https://laelitepeps.com` with valid wildcard certificate coverage. |
| Final runtime and data state | **Passed** | Production logs showed zero error-severity events, durable assets returned HTTP 200 after redirects, integrations remained disabled, and all customer/commerce tables remained empty. |

## Credentials and approvals still required

| Integration | Current state | Required before activation |
|---|---|---|
| Resend transactional email | **Disabled** | Add a valid `RESEND_API_KEY`, confirm the sending domain/address in Resend, then explicitly set `ENABLE_LIVE_EMAIL=true` only for an approved controlled test. |
| ShipStation fulfillment | **Disabled** | Add valid `SHIPSTATION_API_KEY` and `SHIPSTATION_API_SECRET`, confirm webhook/feed settings, then explicitly set `ENABLE_LIVE_SHIPSTATION=true` only for an approved controlled test. |
| Live customer registration | **Disabled** | Complete the Resend steps above, send one controlled verification email, verify the activation link, then confirm registration may be reopened. |
| Live password recovery | **Disabled** | Complete the Resend steps above and verify one controlled reset-email flow. |
| Live order emails and fulfillment | **Disabled** | Approve a controlled test order only after the temporary published URL is validated. Do not enable either integration merely because credentials have been entered. |

Setting either live-action flag to `true` does not restore data or process old orders. It only permits future activity when valid credentials are also present and an applicable user, administrator, or webhook action occurs.

## Data that cannot be recovered from GitHub

| Data category | Relaunch status |
|---|---|
| Historical customer accounts | **Not recovered** |
| Historical passwords or password hashes | **Not recovered** |
| Historical orders and status history | **Not recovered** |
| Historical uploads or customer files | **Not recovered** |
| Historical customer sessions | **Not recovered** |
| Prior Task Data or project database records | **Not recovered and not reconstructed** |

The GitHub repository contains application source code, migrations, and static product data; it is not a substitute for the unavailable Task Data Backup. The replacement therefore starts with a new empty database.

## Owner confirmations before publication

Please confirm the following business-controlled details before directing customers to the replacement site:

1. Confirm the product catalog, displayed prices, Zelle telephone number, support email, Instagram handle, shipping price, tax calculation, and research-use language remain current.
2. The owner confirmed the legal entity spelling as **`LA Elite Sales LLC`**; the storefront footer and all legal-policy references now use that exact name.
3. Confirm the replacement logo, product-vial renders, laboratory imagery, intro backdrop, and social-preview image are acceptable substitutes for the unavailable legacy media.
4. Keep both live-action flags disabled during initial public acceptance testing.

## Completed temporary-publication acceptance sequence

The replacement was published at `https://peptideweb-yaousumk.manus.space` without attaching the production domain. The following sequence was completed:

1. **Passed:** The home page served over HTTPS and completed the intro-to-age-gate handoff.
2. **Passed:** The complete storefront and representative product-detail deep routes rendered with durable media.
3. **Passed:** Customer sign-in loaded; invalid credentials were rejected; an isolated verified test customer authenticated successfully; registration and recovery remained disabled.
4. **Passed:** Anonymous `/admin` access returned **Admin access required**; the owner workflow had already passed in preview against the same deployment code and empty database.
5. **Passed:** Public API status confirmed Resend and ShipStation credentials absent, approval false, and both integrations disabled.
6. **Passed:** Authenticated cart and checkout totals rendered correctly without submitting an order; the account page showed zero historical orders.
7. **Passed:** Production logs contained no error-severity events during verification, and final database counts returned zero after test cleanup.

All technical checks and the production cutover passed. `laelitepeps.com` is attached to the replacement project, `www` redirects to the apex, and `peptideweb-yaousumk.manus.space` remains available as a fallback. Historical Task Data was not restored; the production replacement begins with the verified empty database described above. Manus documents custom-domain management in its current website-builder guidance.[2]

## References

[1]: https://github.com/EKhelil11/website-peptide "LA Elite Peptides GitHub repository"
[2]: https://manus.im/docs/website-builder/custom-domains "Manus custom domains documentation"
