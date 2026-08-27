# LA Elite Peptides Website Relaunch

## Pre-Domain-Change Readiness Checklist

**Prepared by:** Manus AI  
**Date:** August 27, 2026  
**Source:** [EKhelil11/website-peptide][1]  
**Target domain:** `https://laelitepeps.com`

> **Current recommendation:** The replacement application is ready for a temporary Manus publication and public acceptance testing. Do **not** reconnect `laelitepeps.com` until the published temporary URL passes the short acceptance sequence below.

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
2. Confirm whether the footer legal entity spelling **`La Elits Sales LLC`** is intentional. It was preserved from the source because the registered legal spelling cannot be inferred safely.
3. Confirm the replacement logo, product-vial renders, laboratory imagery, intro backdrop, and social-preview image are acceptable substitutes for the unavailable legacy media.
4. Keep both live-action flags disabled during initial public acceptance testing.

## Temporary-publication acceptance sequence

After this version is checkpointed, use the project’s **Publish** button to create the temporary Manus deployment. Do not attach the production domain yet. On the published temporary URL, verify the following sequence:

1. Open the home page in a private browser window and confirm the intro-to-age-gate flow.
2. Enter the site, browse the complete catalog, open several product details, and confirm every image loads.
3. Confirm customer sign-in loads and new registration clearly remains disabled.
4. Confirm `/admin` is available only to the intended Manus owner account and still shows an empty order database.
5. Confirm Resend and ShipStation remain labeled as disabled.
6. Confirm the page is usable on one desktop browser and one mobile browser.
7. Report the temporary public URL for a final HTTP, HTTPS, route, asset, and login-surface verification.

Only after all seven checks pass should `laelitepeps.com` be disconnected from the unavailable project and attached to this replacement project under **Settings → Domains**. Manus documents custom-domain connection and verification in its current website-builder guidance.[2]

## References

[1]: https://github.com/EKhelil11/website-peptide "LA Elite Peptides GitHub repository"
[2]: https://manus.im/docs/website-builder/custom-domains "Manus custom domains documentation"
