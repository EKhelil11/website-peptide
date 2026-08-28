# LA Elite Peptides repository inspection

**Source:** `https://github.com/EKhelil11/website-peptide`  
**Branch:** `main`  
**Inspected commit:** `f64a146596cbad89228e743dd52ee0aefd2bad08`

## Confirmed architecture

| Area | Repository implementation |
|---|---|
| Frontend | React 19, Vite 7, TypeScript, Tailwind CSS 4, Wouter, React Query |
| API | Express 4 with tRPC 11 at `/api/trpc` |
| Database | Drizzle ORM with MySQL and five included SQL migrations |
| Authentication | Manus OAuth for administrators plus separate email/password customer sessions |
| Commerce | Static product catalog, client cart, persisted orders and order items |
| Email | Resend; designed to skip sends when `RESEND_API_KEY` is absent |
| Fulfillment | ShipStation API, custom-store feed, and webhook endpoints |
| Storage | Manus Forge/storage proxy integration |
| Testing | Vitest tests for logout, customer authentication, Resend configuration, and ShipStation configuration |

## Environment-variable inventory

The repository references `DATABASE_URL`, `JWT_SECRET`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`, `VITE_APP_ID`, `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `VITE_FRONTEND_FORGE_API_URL`, `VITE_FRONTEND_FORGE_API_KEY`, `VITE_OAUTH_PORTAL_URL`, `RESEND_API_KEY`, `SHIPSTATION_API_KEY`, `SHIPSTATION_API_SECRET`, `NODE_ENV`, and `PORT`. No values were printed or copied from any prior project.

## Data-restoration boundary

The GitHub repository contains source code and migrations only. It does not contain the prior project database, customer accounts, password hashes, orders, customer sessions, uploaded files, or previous secret values. The replacement must use a new empty database and fresh runtime configuration. This is a rebuild from source, not a restoration of historical Task Data.

## Import considerations

The repository's `template.json` still identifies the original scaffold as static, but the current source has evolved into a full-stack Express, tRPC, Drizzle, and MySQL application. The replacement project must therefore use a new full-stack scaffold. The production entrypoint is `server/_core/index.ts`; the older `server/index.ts` is only a static server and is not the package build target.

The storefront design is documented as **Midnight Clinic** and should be preserved. Product images already use `/manus-storage/...` references, so the repository does not contain local image or video files that require migration.

## Initial risks to validate

| Risk | Validation needed |
|---|---|
| Optional email credentials absent | Registration and order flows must not crash; no live email should be sent in testing |
| Optional ShipStation credentials absent | Payment and tracking actions must not create live fulfillment traffic |
| New empty database | All five migrations must apply in order and create the required tables |
| Admin authorization | The new owner identity must be recognized through fresh Manus OAuth values |
| Existing product/customer UI | Routes and visual behavior must remain unchanged except for deployment blockers |
| Email tax wording | Repository email templates may still display 9% while order calculations use 8%; confirm during build/runtime review before changing |

## Replacement-media validation

The generated replacement logo passed a lightweight visual review: the text reads **LA ELITE PEPTIDES**, uses the established white, electric-cyan, and magenta palette, and is suitable for dark headers. The reference product vial also passed: it shows one complete research vial, the label reads **RETATRUTIDE**, **10 mg**, and **RESEARCH USE ONLY**, and it contains no purity percentage or unsupported certification claim. The remaining vial set was generated from this reference for consistency and remains subject to in-page rendering verification.

A fresh-origin browser run confirmed the replacement intro renders its generated dark laboratory backdrop, centered LA Elite Peptides wordmark, subtitle, and skip control. Without interaction, the intro faded out after its configured interval and handed off to the age-verification modal; the modal then displayed normally with working confirmation controls. This validates the automatic intro-to-age-gate transition. The generated-vial audit reported all eleven product names, dosages, and **RESEARCH USE ONLY** restrictions as correct, with no unsupported purity, certification, or medical-use claim detected; the Glow Stack filename uses the marketing nickname while its visible compound label correctly matches the catalog entry.

Resetting the preview session and reloading reproduced the same automatic handoff to the age gate, confirming the behavior is not dependent on a stale session. The dedicated manual-skip click remains the final intro-flow check.

A subsequent fresh-session check exposed an overlay-order defect: the age gate could become visible 200 ms after mount and cover the desktop intro before its 4.2-second completion. The application now emits an explicit intro-complete event from the home page, and the age-verification component waits for that event on desktop `/` visits while retaining immediate age-gate behavior on mobile and bypass routes. The generated logo was also deterministically cropped to a tighter horizontal canvas and uploaded to durable project storage so it renders legibly in headers and the age-verification card.

The corrected manual-skip sequence passed a controlled browser timing test. At 1.8 seconds after a clean home remount, the skip button was visible, the age gate was not visible, and the intro-seen marker was unset. After clicking **Skip Intro** and waiting for the fade, the skip control was gone, the intro-seen marker was set, and the age-verification modal was visible. This confirms the manual and automatic handoff paths are both functional.

The renamed Glow Stack asset resolved at HTTP 200 and loaded on the correct product-detail route with the expected **GHK-CU + BPC-157 + TB-500**, **70 mg**, and research-use-only label. The in-page screenshot also exposed a new visual defect not detected by the isolated audit: the generated batch vial images contain a baked gray checkerboard instead of real transparency. The images require background-removal edits before the product cards and detail pages can be approved.

After the deterministic alpha-mask fallback and durable re-upload, the updated storefront rendered the new laboratory hero, tightly framed logo, and product catalog successfully. The visible Retatrutide 10 mg, Retatrutide 30 mg, and NAD+ 500 mg cards showed clean vial edges over the native dark card background with no checkerboard. All active `/manus-storage/` media URLs returned HTTP 200, and no direct legacy CloudFront media reference remains in application source. The owner later confirmed the legal entity name as `LA Elite Sales LLC`, and the footer and legal pages were updated accordingly.

The final Glow Stack detail route rendered the renamed 70 mg RGBA cutout cleanly on its dark panel with no checkerboard and retained working research tabs, quantity controls, related-product links, and login-gated purchase controls. An unauthenticated visit to `/checkout` correctly redirected to `/login`, displaying the combined sign-in/create-account interface and preventing order creation without a customer session.

The post-fallback audit of the final eleven product files passed every item. Product names and dosages remained exact, **RESEARCH USE ONLY** was present on every label, each asset retained the approved centered cyan/magenta vial composition, and no unsupported purity, certification, pharmaceutical-approval, or medical-use claim appeared. File inspection confirmed the ten corrected cutouts and the retained Retatrutide 10 mg reference use RGBA output.

Additional product-detail browser checks confirmed the final BPC-157 / TB-500 20 mg and Sermorelin 10 mg cutouts render cleanly without checkerboards. Their related-product areas simultaneously rendered CJC-1295 + Ipamorelin, Glow Stack, GHK-CU, Kisspeptin, and Semax cutouts over the dark application panels, extending in-app evidence beyond the earlier Retatrutide, NAD+, and Glow Stack samples.

Customer account safety checks passed for the current credential state. `/register` shows a prominent reauthorization notice and a disabled **Registration Temporarily Disabled** action, so no unverifiable account can be created while Resend is unavailable. `/forgot-password` likewise shows **Email Recovery Disabled** and cannot trigger a live email send. The sign-in interface remains available for existing customers after migration, while the database is intentionally empty.

The combined `/login` page now matches the dedicated registration guard: its create-account card displays the transactional-email reauthorization notice and the submit action reads **Registration Temporarily Disabled**. The independent sign-in form remains active and accepted non-existent test credentials for a negative authentication check without creating any database record.

Submitting non-existent customer credentials returned the expected generic **Invalid email or password** message and did not create a session. The owner browser session successfully reached `/admin`; the dashboard loaded with zero orders and zero revenue from the new empty database, displayed both Resend and ShipStation as disabled pending authorization, and exposed the expected search, status filters, refresh action, and back-to-site navigation without invoking any order side effect.

A temporary verified customer record with an `.invalid.example` address was created solely for authenticated browser testing. The combined sign-in form accepted the test credentials while its separate account-creation panel remained disabled. No order or outbound integration action was performed during setup; the temporary customer is scheduled for cleanup after the cart and checkout UI checks.

The temporary verified customer authenticated through the live customer-session code path and returned to the storefront with the customer name and sign-out control visible. Authenticated catalog pricing appeared for all products, the global cart control became available, and navigation to the product grid preserved the updated media and filtering interface.

Adding Retatrutide 10 mg from the authenticated catalog succeeded, displayed the expected toast, navigated to the correct product detail, and updated the global cart count to one. The cart drawer showed the correct product, `$150.00` unit price and total, quantity controls, removal action, and a **Proceed to Checkout** handoff. No order was submitted.

The authenticated checkout page loaded with the temporary customer’s name and email, preserved the cart item, and calculated `$150.00` subtotal, `$7.00` shipping, `$12.00` tax, and `$169.00` total. It displayed the relaunch integration notice and Zelle instructions; the order-submit action was deliberately not used. The customer account page then loaded the same live session, showed zero orders from the empty database, and clearly disclosed that email and fulfillment automation remain disabled while database-backed order visibility will continue to function.

The opt-in database integration suite exercised the real customer login/session path, order insertion and item persistence, customer ownership checks, cancellation history, admin authorization, admin notes, payment-status transition, statistics, and disabled ShipStation queue behavior with outbound notification, email, and fulfillment modules mocked. All 19 tests passed, TypeScript reported no errors, and the production build completed. The temporary browser and database workflow records were removed; direct verification returned zero customers, sessions, orders, order items, and status-history rows.

Responsive screenshots were captured at 1280×720 and 375×812 for the age gate, customer sign-in, registration-disabled state, product access, and owner admin dashboard. The age modal remains centered and readable, the mobile login stacks its sign-in and disabled-registration cards cleanly, the dedicated registration screen remains contained without horizontal overflow, and the admin statistics, filters, and integration warnings adapt to a two-column mobile grid. No clipping or inaccessible primary action was observed in the captured views.

The owner confirmed **LA Elite Sales LLC** as the exact legal entity name. The storefront footer, Terms and Conditions, Shipping and Returns policy, Privacy Policy, and readiness checklist were corrected consistently; the former `La Elits Sales LLC` spelling no longer appears in those sources. Full-page previews confirmed the updated name in each legal-page header and footer. The post-correction TypeScript check, all 19 tests, and production build passed.

The main storefront was then re-opened after the correction. Its extracted footer line reads exactly: `© 2026 LA Elite Sales LLC. All rights reserved. Operating as LA Elite Peptides.` The full-page preview showed the footer remained contained and aligned with the existing three-column design.

A dedicated footer viewport check confirmed the logo and tagline remain in the left column, quick links and legal links remain in their intended columns, the disclaimer retains readable spacing, and the corrected copyright line remains fully contained in the bottom bar without overlap or clipping.

## Temporary Public Deployment Verification

After the owner resolved the account-side hosting access issue, a fresh no-cache request to `https://peptideweb-yaousumk.manus.space` returned the LA Elite Peptides application over HTTPS instead of the prior billing-unavailable page. The published intro rendered with the replacement laboratory backdrop and skip control, then automatically handed off to the 21+ age-verification modal without overlap. The public page title and extracted content identify the intended LA Elite Peptides release.

The published age gate accepted the 21+ confirmation and revealed the complete storefront with the durable hero, catalog, product imagery, support information, legal links, and `LA Elite Sales LLC` footer. A direct HTTPS visit to `/product/ghk-cu-bpc157-tb500-glow` loaded the expected 70 mg Glow Stack research detail, research-use notice, and login-gated commerce surface, confirming the SPA deep route is active on the public deployment.

The published `/login` route rendered the existing-account sign-in form and clearly labeled the duplicate create-account form as **REGISTRATION TEMPORARILY DISABLED**, explaining that transactional email requires reauthorization. An anonymous visit to `/admin` returned the application’s **Admin access required** screen with no order data or management controls, confirming that the public deployment does not expose the administrative workflow without the owner session.

The dedicated published `/register` route displays the reauthorization notice and a disabled **REGISTRATION TEMPORARILY DISABLED** action. The published `/forgot-password` route likewise displays the transactional-email notice and a disabled **EMAIL RECOVERY DISABLED** action. Neither page presents a live email-triggering workflow while Resend credentials and owner approval are absent.

Direct HTTPS visits to the published `/terms` and `/privacy-policy` routes rendered their full legal content with the owner-confirmed **LA Elite Sales LLC** name in the headers, body references, and footers. Both pages retained the intended dark legal-page layout and working navigation back to the storefront and related policies.

The published sign-in form was submitted with a non-existent test email and synthetic password. The production backend returned the expected **Invalid email or password** message and left the browser on the sign-in page. No customer account, authenticated session, email, order, or fulfillment action was created by this rejection test.

For authenticated public cart and checkout validation, an isolated verified customer was inserted directly into the otherwise empty replacement database without invoking registration or email. The published sign-in form accepted the synthetic test account fields and was prepared for submission; the utility includes cleanup of its session and related records after the browser flow.

The isolated customer successfully authenticated through the published production login. The browser returned to the public storefront, displayed the customer first name **Public**, revealed catalog prices, exposed the sign-out control, and enabled the cart button. This confirms the deployed customer-session cookie, database lookup, and authenticated catalog state are functioning on the temporary public domain.

An initial catalog-card add-to-cart click did not produce a confirmed populated drawer; opening the drawer showed zero items. Because browser element indices can shift with the animated product grid, this result is treated as inconclusive rather than a cart defect. The public cart flow requires a second deterministic check from a direct product-detail page before acceptance.

The empty drawer was closed and the authenticated browser opened `/product/retatrutide-10mg` directly. The published page retained the customer session, rendered the $150 price, 10 mg variant, quantity control, research-use notice, durable product image, and explicit **ADD TO CART** and **BUY NOW** controls, providing a deterministic target for the second cart test.

The deterministic product-detail **ADD TO CART** action succeeded on the public deployment, displayed a `1× Retatrutide added to cart` confirmation, and updated the cart badge to one item. The opened cart drawer listed Retatrutide 10 mg at `$150.00`, quantity one, a `$150.00` order total, quantity/removal controls, and the **PROCEED TO CHECKOUT** action. This resolves the earlier inconclusive catalog-card result and confirms published cart state works.

The published authenticated checkout loaded without placing an order. It prefilled the isolated customer identity, retained Retatrutide 10 mg, and calculated `$150.00` subtotal, `$7.00` shipping, `$12.00` tax, and `$169.00` total. The page displayed the relaunch integration notice and Zelle instructions. The authenticated `/account` route then showed the same customer session, zero total orders, an empty order history, and the email/fulfillment-disabled notice. No order submission was performed.

The isolated public-test customer, its session, and any related records were removed after the browser checks. Final database counts returned zero customers, customer sessions, orders, order items, and status-history rows. Public integration status reported Resend and ShipStation credentials absent, owner approval false, and both integrations disabled. Representative durable logo, vial, Glow Stack, and laboratory assets returned HTTP 200. The temporary domain certificate covers `*.manus.space`, and production logs contained no error-severity entries during the final public checks.
