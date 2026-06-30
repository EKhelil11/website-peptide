# Elite LA Peptides — TODO

## Completed
- [x] Basic homepage layout and hero section
- [x] Navigation menu
- [x] Product catalog with 10 products
- [x] Product detail pages with Quick Facts, mechanism, benefits
- [x] Age verification gate
- [x] Shipping section (nationwide 3-5 days only)
- [x] FAQ section
- [x] Floating Text Us SMS button
- [x] Video intro (desktop only, skip on mobile)
- [x] Glow Stack and Wolverine Stack content/breakdown fixes
- [x] Sermorelin 10mg product added at $75
- [x] Hero stat updated to 10 Premium Peptides
- [x] Email updated to support@laelitepeps.com site-wide
- [x] Purity updated to 99%+ in FAQ

## Commerce Infrastructure (In Progress)
- [x] Database schema: orders, order_items tables
- [x] Register page (styled to match existing site theme)
- [x] Login page (styled to match existing site theme)
- [x] Auth-gated order portal route (/shop)
- [x] Product catalog in order portal (pulls from products.ts)
- [x] Cart functionality (add/remove items, quantity)
- [x] Order submission form (name, email, shipping address)
- [x] Order notification to owner via email (support@laelitepeps.com) and SMS (310-929-0403)
- [x] Order confirmation page shown to customer after submission
- [x] Account dashboard (/account) — order history, order status
- [x] ShipStation webhook endpoint (POST /api/shipstation/webhook)
- [x] ShipStation API key stored in secrets
- [x] Zelle/ACH payment instructions (placeholder, activate later — bank account not yet set up)
- [x] Admin order management view (mark paid, mark shipped)
- [x] Nav bar: add Login / My Account links

## Cart Integration on Product Pages
- [x] Create global CartContext to share cart state across all pages
- [x] ProductsSection: show "Add to Cart" instead of "Inquire" when user is logged in
- [x] ProductDetail: show "Add to Cart" instead of "Inquire" when user is logged in
- [x] Floating cart icon/drawer visible on all pages when logged in (links to /checkout)

## Hero Image Enhancement
- [x] Generate custom blue cinematic research lab hero image
- [x] Upload hero image to webdev static assets
- [x] Implement hero background with dark navy gradient overlay
- [x] Update hero headline text to premium medical institution copy

## About Section Enhancement
- [x] Generate warm collaborative scientist team image (Option 2)
- [x] Implement image in About Our Research section with split layout

## GLP Product Description Compliance Update
- [x] Audit all GLP product descriptions for non-compliant language (weight loss, weight reduction, human use)
- [x] Rewrite all GLP product descriptions with compliant metabolic signaling / energy regulation language
- [x] Add standard research-use-only disclaimer block to all GLP product pages

## GLP Disclaimer Block
- [x] Add Peptides Collective verbatim disclaimer block to Retatrutide product page and all GLP product descriptions

## Product Filter Tab Redesign (Peptides Collective Style)
- [x] Remap all product categories to: GLP, Metabolics, Peptides, Blends
- [x] Update ProductsSection.tsx filter tabs to: All / GLP / Metabolics / Peptides / Blends
- [x] Update categories array in products.ts to match new tab structure

## GLP Full Wording Overhaul (Peptides Collective Approved Language)
- [x] Replace all "appetite suppression" language with peptide-mediated endocrine communication wording
- [x] Replace all GLP-1 agonist weight reduction language with tri-agonist multi-receptor research wording
- [x] Add verbatim Peptides Collective disclaimer block to all GLP product descriptions

## Product Detail Page Rebuild (Peptides Collective Style)
- [x] Two-column layout: image left, details right
- [x] Thumbnail image carousel
- [x] Size/variant selector dropdown
- [x] Quantity stepper (+/-)
- [x] Dual CTA buttons: Add to Cart + Buy Now
- [x] Tabbed description section with molecular data table
- [x] Related products carousel at bottom

## Molecular Data Population (Peptides Collective)
- [x] Scrape Peptides Collective for molecular data on all 10 products
- [x] Add Sequence, Molecular Formula, Molecular Weight, PubChem CID, CAS # to all products in products.ts

## Compliance Login Wall (Peptides Collective Style)
- [x] Save checkpoint before compliance login wall changes
- [x] Add termsAcceptedAt timestamp field to users table in drizzle schema and push migration
- [x] Build registration page with inline scrollable T&C box and acceptance checkbox
- [x] Gate product pricing and Add to Cart behind login — show "Login to View Pricing" to unauthenticated visitors
- [x] Record timestamped terms acceptance in database on registration

## Policy Pages (Live on Site)
- [x] Update policy documents with legal entity name La Elits Sales LLC
- [x] Update policy documents with phone number (310) 929-0403
- [x] Build /terms page (Terms & Conditions)
- [x] Build /shipping-returns page (Shipping & Returns Policy)
- [x] Build /privacy-policy page (Privacy Policy)
- [x] Register all three routes in App.tsx
- [x] Add Legal section to main site footer with links to all three policy pages
- [x] Update footer copyright to La Elits Sales LLC

## Custom Vial Product Images
- [x] Generate white-background vial images with La Elite Peptides label for all 10 products
- [x] Upload all 10 vial images to webdev static assets
- [x] Update products.ts with new image URLs for all 10 products

## Zelle Order System (Full Build)

- [x] Database schema: orders, order_items, shipments, order_status_history — all columns migrated
- [x] tRPC: submit, myOrders, getOrder, cancelOrder (customer procedures)
- [x] tRPC: adminListOrders, adminStats, adminMarkPaid, adminUpdateNotes, adminGetOrder (admin procedures)
- [x] ShipStation webhook receiver: POST /api/webhooks/shipstation — auto-updates tracking number
- [x] Checkout page: shipping address form, $7 flat shipping, 9% tax, Zelle instructions on confirmation
- [x] Account page (/account): customer order history with status and tracking
- [x] Admin dashboard (/admin): stats cards, orders table, search, filter tabs, expand/collapse detail
- [x] Admin mark paid: notes input + green confirm button per order
- [x] Admin route guard: only role=admin can access /admin
- [x] Routes registered in App.tsx: /checkout, /account, /admin
- [x] Promote owner account to admin role in database

## Floating Cart & Checkout Redesign

- [x] Global CartContext — shared cart state across all pages
- [x] FloatingCart drawer component — dark blue, Bebas Neue + Rajdhani fonts, matching site aesthetic
- [x] Cart icon in main nav with item count badge
- [x] ProductDetail Add to Cart wired to CartContext
- [x] Shop page Add to Cart wired to CartContext (remove separate order portal)
- [x] Checkout page redesigned to match site fonts, colors, button styles

## BPC-157/TB-500 Vial Image Fix

- [x] Regenerate BPC-157/TB-500 vial image (v9) — grounded on surface with natural drop shadow, matching Retatrutide master style
- [x] Apply v9 image URL to products.ts for BPC-157/TB-500 Wolverine Stack product

## Custom Customer Auth System (Replacing Manus OAuth)
- [ ] Add customers table to drizzle schema (id, email, passwordHash, firstName, lastName, emailVerified, verificationToken, tokenExpiry, createdAt)
- [ ] Add customer sessions table (id, customerId, token, expiresAt)
- [ ] Run pnpm db:push to migrate schema
- [ ] Install bcryptjs for password hashing
- [ ] Create server/customerAuth.ts with register, login, verify email, logout helpers
- [ ] Create server/customerRouter.ts with tRPC procedures for all auth flows
- [ ] Add customer verification email template to email.ts
- [ ] Create Login.tsx page matching site design
- [ ] Update Register.tsx to wire to backend
- [ ] Create /verify-email page for token verification
- [ ] Protect /account and /checkout routes — redirect to /login if not authenticated
- [ ] Show customer name + logout in navbar when logged in
- [ ] Keep admin access via Manus OAuth on /admin only
- [ ] Write vitest tests for auth procedures
