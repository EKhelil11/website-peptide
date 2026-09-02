# LA Elite Peptides Sales Platform Page Specification

## Objective

Create a dedicated public `/shop` page that makes the current LA Elite Peptides catalog easier to discover, compare, and purchase online. The page will reduce the distance between product discovery and the existing cart/product-detail flows while retaining the site’s established midnight-clinic identity and research-only positioning.

> The page is an original LA Elite Peptides implementation informed by public information-hierarchy patterns observed during the reference audit. It will not reproduce competitor copy, imagery, branding, discounts, badges, test values, or layout composition.

## Information Architecture

| Section | Purpose | Required behavior |
|---|---|---|
| Shared navigation | Provide consistent brand, account, and site navigation | The Products link opens `/shop`; non-shop section links return to their home-page anchors |
| Commerce hero | Explain the catalog and provide an immediate catalog action | Show research-only scope, product/category counts, and a scroll-to-catalog CTA |
| Confidence strip | Answer basic buying-path questions before browsing | State only verified application facts: current catalog size, category count, account-protected checkout, and tracked order status |
| Catalog toolbar | Let visitors find and compare compounds efficiently | Provide search, live category counts, canonical-order/name/price sorting, result count, and clear reset action |
| Product grid | Present the active catalog and purchase path | Use canonical product data and existing vial assets; show current prices; link to details; use existing customer authentication and shared cart behavior |
| Research-use notice | Keep the sales context qualified | Repeat that products are for in-vitro laboratory and scientific research only and are not for human or animal consumption |
| Assistance CTA | Give uncertain visitors a non-purchase path | Link to the existing contact section and research FAQ without inventing sales or clinical guidance |
| Shared footer | Preserve policies and business identity | Reuse the existing footer unchanged |

## Interaction Rules

The `/shop` route will be public for browsing. Signed-in customers can use the existing cart action; signed-out visitors who choose Add to Cart will be directed to the existing login flow with the relevant product-detail page preserved as the return destination. The global floating cart remains the sole cart drawer and checkout handoff, avoiding duplicate cart state.

Search will match product name, content, category, tagline, synopsis, and existing benefit terms. Category filters will use the canonical exported order: All, GLP, Metabolics, Peptides, and Blends. Sorting will include the canonical catalog order, name A–Z, price low-to-high, and price high-to-low. No item will be labeled as a bestseller, featured seller, or popular item without real order data.

## Visual Direction

The page will retain the current navy foundation, silver-blue LA Elite Peptides logo, cyan/royal-blue accents, Bebas Neue display type, Rajdhani utility labels, and Inter body text. The commerce hero will use asymmetric composition and restrained gradient depth rather than copying the reference site’s warm-white visual system. Product cards will reuse the existing vial imagery and established card styling.

## Compliance Boundaries

The page must not add administration instructions, dosing, cycles, stacking instructions, side-effect guidance, personal-use language, therapeutic promises, disease claims, customer testimonials, ratings, fabricated sales rankings, purity percentages, certificates, laboratory names, or shipping/returns promises beyond the application’s existing policy content. GLP descriptions remain framed around metabolic signaling and energy regulation. Existing catalog copy is not rewritten as part of this page.

## Acceptance Criteria

The `/shop` route renders directly instead of redirecting to the homepage. All 11 canonical products appear when no filter is active, Retatrutide 30 mg remains `$200`, category counts match the catalog, search and sorting work without server changes, and product-detail/cart actions use the existing routes and shared context. The page must remain usable at 375 px mobile width and standard desktop widths, with no email sends, order creation, payment, fulfillment, database mutation, integration changes, or domain changes during validation.
