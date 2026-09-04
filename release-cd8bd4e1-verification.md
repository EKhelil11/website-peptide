# Production Verification — Checkpoint cd8bd4e1

## Release propagation and application markers

The apex custom domain and Manus production domain served the same application asset after the deployment-success notification. The published JavaScript contains the shared `data-route-transition` shell, the product-/lot-specific hero purity scope, all 16 `card-crisp` product assets, and the shared `COA-Reported` label. The production stylesheet contains the responsive Age Verification primary CTA treatment. The latest production runtime-log sample contained zero genuine uncaught, fatal, exception, HTTP 4xx/5xx, or error-level events after expected unauthenticated session messages were excluded.

## Live homepage and hero

The custom-domain homepage rendered the full Wellness Clinic hero with four uniform statistic cards: 16 current compounds, four signature blends, US research support, and the product-/lot-scoped `>99% COA-Reported Purity` card. The fourth card visibly used the shared Cormorant `COA-Reported` and Rajdhani `Purity` hierarchy while preserving the existing navy/silver card design and scope line.

## Live Shop and product assets

The custom-domain Shop loaded successfully with the published 16-product catalog, elevated metric strip, and protected public prices. Retatrutide 30 mg remained `$200`. Rendered product markup referenced the new durable crisp assets, including `Reta10Mg-card-crisp_20eb1ab9.webp` and `Reta30BlueFinal-card-crisp_4d9ceaea.webp`; the representative crisp asset returned HTTP 200. No cart or authentication action was triggered.

The live catalog view retained all 16 canonical products and referenced the crisp durable files throughout the full product grid. Retatrutide 10 mg, Retatrutide 30 mg, and Tirzepatide 20 mg remained first in order at `$150`, `$200`, and `$175`. The product cards remained intentionally lazy-loaded; the browser’s extracted production markup exposed each new URL while off-screen transparent images awaited intersection. Private desktop and mobile visual review had already confirmed the cool-silver/navy stage, vial clarity, and containment before publication.

## Live Age Verification

The secondary Manus production domain opened on its real first-visit Age Verification state. The published navy panel, silver/champagne 21+ medallion, high-contrast ivory heading and research-only copy, desktop brushed-silver primary CTA, deep navy two-line label, and readable subordinate Exit Site action were all visible and contained. No temporary bypass or review query controlled the gate.

After entering the site through the real production CTA, the full published homepage rendered with the four-card hero and current navigation. Direct DOM targeting found the live `#about` section and its exact elevated Who We Are heading and unchanged research-only paragraphs, preparing the section for final visual proof-badge verification without altering business state.

The live Who We Are viewport confirmed the brighter weighted body typography, research-only emphasis, laboratory image, shared `COA-Reported`/`Purity` evidence hierarchy, product- and lot-specific disclosure, and the `Trusted. Tested.` proof pill aligned at the right page margin beneath the complete composition. The footer proof badge remained a separate unchanged placement.

## Live route transition

A real client-side Shop-to-home navigation on the published Manus domain mounted the shared route shell and active Web Animation. The measured duration was 220 ms with `cubic-bezier(0.23, 1, 0.32, 1)` easing. During the entrance, opacity was progressing at `0.83776` and the vertical transform was approximately 6 pixels; after completion, the transform resolved to none and scroll position was restored to zero. The navigation did not touch cart, authentication, or commerce state.

## Final production integrity

The apex, `www`, and Manus domains remained configured, with the apex and Manus domains serving the same published application asset after propagation. Public Shop, Retatrutide 30 mg product, and representative COA routes returned HTTP 200. A representative crisp product asset returned HTTP 200, and all 16 crisp asset references were present in the production bundle. The approved social/search preview image metadata remained published.

Retatrutide 30 mg remained `$200`; Tirzepatide 20 mg remained `$175`; the catalog remained 16 products with four signature blends; and all 16 mapped COAs, customer/admin authentication, cart, checkout, account/order data, flat `$7` shipping, 8% tax, Zelle instructions, Resend, and ShipStation remained protected. The read-only integration response reported both providers as credentials-present, owner-approved, and configured. No order, email, label, database, secret, DNS, or domain mutation occurred during verification.
