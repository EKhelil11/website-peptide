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
