# Whitcomb dormant release — final publication verification

**Checkpoint:** `0af5679e`  
**Publication status:** Live on September 21, 2026  
**Card availability:** Disabled pending a separate owner approval

## Publication resolution

Checkpoint `0af5679e` was already saved correctly, but production continued serving the previous frontend and backend because the separate Website Canvas **Publish latest version** control had not been activated. The sandbox Manus login was blocked by Cloudflare error 600010, so the owner-approved publication was completed through the authenticated **My Browser** session. Manus confirmed: **“Your site has been updated.”** No second checkpoint was created.

## Live verification

All three public domains now serve the same new production bundle:

| Domain | JavaScript | CSS |
|---|---|---|
| `laelitepeps.com` | `/assets/index-DJ9d5G0W.js` | `/assets/index-5Orri2Lq.css` |
| `www.laelitepeps.com` | `/assets/index-DJ9d5G0W.js` | `/assets/index-5Orri2Lq.css` |
| `peptideweb-yaousumk.manus.space` | `/assets/index-DJ9d5G0W.js` | `/assets/index-5Orri2Lq.css` |

The production build generated a different JavaScript fingerprint than the local build, so verification used cross-domain bundle equality and deployed feature markers rather than the local JavaScript filename. The deployed entry bundle contains the `/payment/whitcomb-return` route marker. That callback route returned HTTP 200 on all three domains.

The public integration-status endpoint is sanitized and reports Resend and ShipStation as configured while reporting Whitcomb as unavailable with the message: **“Whitcomb hosted card checkout is disabled pending owner approval.”** It exposes no activation key, API key, provider secret, credential-presence field, or approval flag.

The apex domain returned HTTP 200 for `/`, `/shop`, `/product/retatrutide`, `/account`, `/admin/orders`, `/contact`, `/terms`, and `/privacy`. All 16 durable Certificate of Analysis PDFs returned HTTP 200.

The WebDev service is healthy at checkpoint `0af5679e`. TypeScript and language-service checks report no errors. The only recent advisory is the pre-existing `baseline-browser-mapping` freshness notice; no new application error was reported.

## Database and side-effect proof

The production database still contains only the two protected historical orders: `LAP-100001` and `LAP-130001`. There are zero Whitcomb orders and zero `system_jobs` rows. The dedicated order-number sequence remains `AUTO_INCREMENT=130002`, so the next successfully created order remains `LAP-130002`.

Publication did not enable live Whitcomb checkout, create a reconciliation schedule, create an order or hosted payment session, make a card charge, send email, create a ShipStation order or label, issue a refund or void, or change historical orders. Each of those actions remains behind its own separate explicit approval gate.
