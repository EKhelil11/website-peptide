# Private Product-Lineup Image Validation

## Baseline audit

The preserved owner originals are 1024×1535 RGB PNG files averaging roughly 1.3–1.5 MB for the current vial set. The existing performance derivatives are approximately 1000×1499 lossy WebP files averaging roughly 130–170 KB. Both retain a full white background rather than transparency.

A representative Retatrutide 30 mg comparison confirmed that the current derivative preserves the correct vial, blue cap, label, strength, logo, and wording, but the aggressive reduction from 1.54 MB to 170 KB softens fine cap texture, metallic lettering edges, small `Trusted · Tested` text, and molecule-line detail. Because the white field remains inside the image itself, the surrounding champagne card stage cannot provide contrast behind the vial label or glass edges.

The correction should therefore use a higher-quality derivative generated from the preserved original and a content-preserving background-isolation method that removes only the edge-connected white studio field. The label, glass, shadows, cap, text, proportions, and all internal white areas must remain unchanged. The resulting transparent vial can then sit on one shared cool-silver/navy image stage that improves separation without editing the product artwork.

## Lossless transparency prototype

The deterministic edge-connected background method was applied to all 16 preserved originals at their full 1024×1535 dimensions. Visual checks of Retatrutide 30 mg and KLOW Blend confirmed that cap texture, metallic lettering, logo, vial glass, internal white label areas, dose text, molecule linework, and lower glass shadow remained intact across both a single compound and a multi-compound blend.

The lossless transparent WebP set totals 15.47 MB, a 30.62% reduction from the 22.29 MB original PNG set but substantially heavier than the current mobile-optimized set. These lossless files are therefore accepted only as local fidelity masters, not as storefront delivery assets. The final web derivatives should retain the verified transparency mask and full dimensions while using a high-quality, alpha-preserving WebP encoding that targets a materially smaller payload.

## Balanced storefront derivatives

The verified transparency mask was re-encoded at full 1024×1535 dimensions using quality 96 WebP with maximum alpha quality. The final 16-file set totals 3.32 MB, an 85.09% reduction from the original PNG set and a 78.51% reduction from the lossless transparency prototypes. Individual files range from approximately 183 KB to 252 KB.

Visual checks of the balanced Retatrutide 30 mg and KLOW Blend files confirmed that the high-quality output retains the cap texture, silver neck detail, glass outline, metallic logo edges, small `Trusted · Tested` text, primary compound name, dose, molecule linework, and `Research Only` band across both a single compound and a multi-compound blend. The label whites and all internal product content remain intact; only the edge-connected studio field is transparent. This quality and payload balance is suitable for the lazy-loaded home and Shop product cards.

## Product-card staging and responsive review

All 16 balanced files were uploaded successfully and mapped to their canonical products. The shared image stage now uses a cool-silver radial field with soft navy edge depth, a white spotlight ellipse, and a restrained navy pedestal shadow. The transparent vial sits at full opacity with an additional navy drop shadow, allowing the white label, silver glass, and blue cap to separate from the card while preserving the existing ivory product-information body.

The former white-to-gold image field and bottom wash overlay were removed. The category label now sits in a contained ivory capsule above the image, preventing it from disappearing against either silver or navy stage tones. Explicit 1024×1535 dimensions reduce layout shift, while lazy loading and asynchronous decoding remain enabled.

Focused full-lineup screenshots passed at desktop, 375 px, and 320 px. Representative single compounds, dual agonists, HGH activators, signature blends, mitochondrial compounds, and remaining categories all retained consistent vial scale, crisp label edges, contained badges, readable card content, and full-width actions without horizontal overflow. The temporary development-only lineup isolation and age-overlay suppression were removed immediately after review.

## Complete mobile-first route review

The complete Home, Shop, Retatrutide 30 mg product detail, and Login/Create Account routes were captured at both 375 px and 320 px with the final route-transition shell active. The four-stat hero, product catalog, streamlined shipping, evidence sections, right-margin `Trusted. Tested.` proof pill, FAQ, contact section, Shop metrics, product evidence/COA hierarchy, forms, and footer all remained contained without horizontal overflow.

The product detail route displayed the new full-resolution Retatrutide vial with sharper cap, silver neck, label, and dose text against its navy image stage. The Login/Create Account fields retained full-width tap targets and readable labels at 320 px. The Shop headline retained the corrected whole-word `COMPOUNDS` wrapping.

The full-page screenshot tool does not scroll through every mobile card before capture, so intentionally lazy-loaded images below the initial viewport remain as stable reserved image-stage spaces in those long contact sheets. This is expected browser behavior, not a missing-asset state: visible cards loaded their crisp vial asset, all 16 durable uploads succeeded, explicit image dimensions prevent collapse, and the separate isolated lineup review confirmed the card image treatment. Lazy loading remains enabled to protect mobile payload and scrolling performance.

## Elevated Age Verification

The real first-visit gate was captured without any bypass at desktop, 375 px, and 320 px. The modal now uses a bordered navy gradient panel with a brighter top rule, larger silver/champagne 21+ medallion, high-contrast ivory Cormorant heading, brighter Inter access and research-only copy, and a clearer divider.

The primary action is now a complete ivory/champagne/silver surface with navy text separated into `Yes, I am 21 or older` and `Enter Site →` lines. The secondary `No, I am under 21 — Exit Site` action remains visually subordinate but readable inside a silver-edged navy control. Both actions include visible keyboard focus, hover/active feedback, and reduced-motion-safe classes.

All three screenshots confirmed the complete logo, badge, heading, copy, divider, and controls remain visible and contained. At 320 px, the two-line primary hierarchy avoids cramped wrapping and preserves comfortable touch height. The existing 21+ requirement, in-vitro research-only statement, desktop intro handoff, mobile intro bypass, route bypass list, session storage, confirm behavior, and underage exit destination remain unchanged.

The desktop primary action now adds a distinctly brushed-silver gradient with alternating polished and shadowed silver stops, a subtle horizontal grain, deep navy text, white/silver edging, and a restrained metallic glow. A breakpoint-scoped rule applies this treatment only from 768 px upward. The 375 px comparison retained the owner-approved mobile ivory/champagne/silver gradient exactly, with unchanged two-line CTA hierarchy, contrast, dimensions, and containment.

The 320 px comparison also retained the approved mobile gradient, spacing, and CTA wording without clipping or overflow. The desktop-only grain and silver-stop override did not leak below the 768 px breakpoint.

## Final combined validation

`pnpm check` passed. All 129 active Vitest tests passed across 16 active test files; four live/credential workflows remained intentionally skipped. `pnpm build` passed with route-specific chunks and the existing main-bundle advisory.

All 16 crisp durable product assets returned HTTP 200. The final client source contained zero temporary review hooks, Retatrutide 30 mg remained `$200`, the canonical catalog remained 16 products with four signature blends, and the mobile intro bypass remained active below 768 px. Resend and ShipStation credentials and explicit enablement remained present through boolean-only checks. `git diff --check` passed, and current-session browser, server, and network errors were zero.

No order, email, label, checkout, database, secret, DNS, domain, or production action was triggered. The live site remains unchanged at checkpoint `3971b2e1` pending explicit owner approval of this complete private refinement.

## Shared purity typography

The hero fourth statistic and the Who We Are image badge now render one shared `PurityBadgeHeading` component, guaranteeing the same Cormorant `COA-Reported` line and Rajdhani uppercase `Purity` line in both placements while preserving one exact accessible `COA-Reported Purity` label.

Desktop and 375 px screenshots confirmed the fourth hero card retains the exact shared card dimensions, navy/silver treatment, `>99%` value hierarchy, sequence number, and product-/lot-specific scope. The two-line evidence label matches the Who We Are font hierarchy without altering the other three hero statistics or introducing a separate visual pattern.

The 320 px screenshot confirmed the same Cormorant/Rajdhani label remains contained and legible on the narrowest supported phone. `COA-Reported` and `Purity` retain their two-line relationship, the scope line remains readable, and no change appears in the other three cards. The temporary hero isolation and age-overlay suppression were removed immediately afterward.

The final shared-typography revalidation passed `pnpm check`, all 129 active Vitest tests, and the production build, with four live/credential workflows intentionally skipped. Exactly one shared purity component usage remains in Hero and one in Who We Are; all 16 crisp assets returned HTTP 200; no temporary review hook remains; `git diff --check` passed; Resend and ShipStation remain configured through boolean-only checks; and current-session runtime errors remained at zero.
