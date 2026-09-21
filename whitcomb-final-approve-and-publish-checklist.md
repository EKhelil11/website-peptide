# Whitcomb Card Payments — Final “Approve and Publish” Checklist

**Store:** LA Elite Peptides  
**Merchant:** LA Elite Sales LLC  
**Prepared:** September 20, 2026  
**Current public release:** `c88c2e5e`
**Current status:** Whitcomb hosted card checkout is live beside Zelle; five-minute background reconciliation is enabled and healthy

## Approval structure

Making the card-payment option public requires **three distinct approvals**. This separation prevents a code publication from accidentally accepting live payments before the deployed return route and reconciliation controls are verified.

| Stage | Owner approval | Effect |
|---|---|---|
| 1. Publish dormant release | **Completed — checkpoint `0af5679e`.** | Published the code and callback route with card checkout disabled. |
| 2. Start reconciliation | **Completed — Heartbeat `fb4zcRcehdoFBprjmXYDNf`.** | Created the authenticated five-minute background safety net for customers who close the hosted payment page before returning. |
| 3. Enable card checkout | **Completed — checkpoint `c88c2e5e`.** | Makes **Credit or Debit Card** visible and usable alongside Zelle. The owner explicitly approved enablement without authorizing the separate reconciliation schedule. |

> **Important:** Stage 1 does not authorize Stage 2 or Stage 3. None of these stages authorizes a real test charge, refund, void, payment cancellation, customer email, or fulfillment test.

## Gate 1 — Ready to publish dormant code

All boxes must be confirmed immediately before the Stage 1 approval is executed.

| Check | Required result |
|---|---|
| Owner evidence decision | Pre-publication evidence remains accepted. |
| Whitcomb desk response | Review any response received before release. If it materially changes the API or validation requirements, stop and reassess. No response is required if the provider contract remains unchanged because the owner accepted the completed evidence. |
| Source review | Only the reviewed Whitcomb integration and intended release documentation are present. No secret or raw card field is committed. |
| TypeScript | `pnpm check` passes. |
| Automated tests | The complete credential-safe suite passes. Record the new exact count. |
| Production build | `pnpm build` passes. |
| Diff integrity | `git diff --check` passes. |
| Payment source audit | The approval-gated payment scanner passes after human review of any finding. |
| Independent review | No unresolved High or Medium payment-security finding. |
| Database integrity | Historical orders remain untouched; zero unexpected Whitcomb orders or provider references exist. |
| Order sequence | The next successful order remains `LAP-130002`. |
| Existing commerce | Sixteen products, four signature blends, protected prices, RECROOMLV, $7 shipping, 8% tax, COAs, Zelle, authentication, Account, Admin, Resend, and ShipStation remain intact. |
| Live card gate | `ENABLE_LIVE_WHITCOMB` remains disabled for the dormant publication. |
| Side effects | No order, payment session, charge, email, ShipStation order, label, or schedule is created during validation. |

### Stage 1 approval phrase

When every Gate 1 item passes, send exactly:

> **Approve and publish the Whitcomb card-payment release with live card checkout remaining disabled.**

That instruction authorizes one publication checkpoint only. It does not authorize live card acceptance.

## Gate 2 — Verify the dormant public release

After Stage 1 publication and before scheduling or enabling card checkout, verify the deployed release with read-only checks.

| Check | Required result |
|---|---|
| Domain propagation | `laelitepeps.com`, `www.laelitepeps.com`, and the Manus domain serve the same new bundle. |
| Existing storefront | Home, Shop, product detail, cart, Zelle checkout, Account, Admin, legal pages, and all 16 COAs still work. |
| Protected prices | Retatrutide 30 mg remains $200; Tirzepatide 20 mg remains $175; all other approved catalog prices remain unchanged. |
| Callback route | The Whitcomb return route loads on the production apex domain without creating or confirming a payment. |
| Public integration status | The endpoint exposes only sanitized availability and messages—never credentials, merchant secrets, provider payloads, or internal approval state. |
| Whitcomb readiness | A credential-safe server check reports the account active/armed without creating a hosted checkout session. |
| Database | Historical orders and `LAP-130002` remain unchanged; zero test card orders and zero unexpected schedule rows exist. |
| Runtime logs | No new payment, callback, authentication, database, email, or fulfillment error pattern appears. |
| Rollback readiness | The previous public release remains identified and restorable if the dormant release introduces a regression. |

If any Gate 2 check fails, keep live card checkout disabled and correct or roll back the dormant release.

## Gate 3 — Create and verify reconciliation

Whitcomb uses authoritative status checks rather than a webhook for this integration.[1] The reconciliation schedule is the safety net for a customer who pays but closes the hosted page before returning.

Before requesting Stage 2 approval, confirm that the deployed callback exists and that the scheduled endpoint authenticates Manus task identity, validates the registered task identifier, uses the database lease, respects the five-minute provider interval, caps each batch, and enforces its deadline.

### Stage 2 approval phrase

> **Approve creation of the five-minute Whitcomb payment reconciliation schedule.**

The schedule was created as `whitcomb-payment-reconciliation` with cron `0 */5 * * * *`, callback `/api/scheduled/reconcile-whitcomb-payments`, and task UID `fb4zcRcehdoFBprjmXYDNf`. Its first automatic run completed in one attempt with HTTP 200 and `{ checked: 1, paid: 0, open: 1, cancelled: 0, errors: 0 }`. The real order `LAP-130002` remained provider-open and pending payment; no email, owner notification, paid transition, ShipStation handoff, or label was created.

## Gate 4 — Enable card checkout publicly

All boxes must pass before requesting Stage 3 approval.

| Check | Required result |
|---|---|
| Dormant release | Published and verified on all domains. |
| Callback | Production return route verified without a payment. |
| Reconciliation | Registered, authenticated, healthy, and non-overlapping. |
| Provider | Whitcomb remains active and armed. |
| Checkout copy | Zelle and **Credit or Debit Card** are both accurate and readable. |
| Amount authority | Product price, RECROOMLV discount, shipping, tax, and final total remain server-derived. |
| Hosted boundary | Card details are entered only on Whitcomb’s exact HTTPS origin. |
| Admin controls | Provider-controlled card orders cannot be manually marked paid. |
| Customer recovery | My Account can resume an eligible pending card payment without creating a second session. |
| Monitoring | Owner knows where to review Whitcomb portal status, Admin order attribution, and production logs. |

### Stage 3 approval phrase

> **Approve enabling live Whitcomb card checkout for customers.**

After enablement, verify—without placing an order—that the public checkout offers Zelle and Credit or Debit Card, the correct hosted-payment explanation appears, and the live integration status remains sanitized. Monitor logs and the scheduler closely during the first live-order window.

## Actions not authorized by these approvals

The three approval phrases above do **not** authorize any of the following actions:

| Action | Separate authorization required |
|---|---|
| Real test charge | Exact test customer, products, final amount, currency, order-number consumption, email recipients, fulfillment consequences, trial consequence, and refund path must be presented and confirmed. |
| Refund, void, or provider cancellation | Exact provider reference, order number, action, amount, fees, customer notice, and fulfillment consequences must be presented and confirmed. |
| Live email test | Exact recipient and message purpose must be approved. |
| Fulfillment or label test | Exact order and ShipStation consequence must be approved. |
| DNS, domain, billing, or account-security change | Requires its own explicit instruction. |

## Stop conditions

Do not publish or enable live card checkout if the final gate finds an unexpected database order/reference, changed order sequence, failed test/build, unresolved High or Medium security issue, provider inactive/paused state, unsanitized public response, invalid callback, unhealthy scheduler, or unexplained production error. Keep Zelle operational and the Whitcomb gate disabled until the issue is resolved.

## Owner-ready release status

| Decision | Current status |
|---|---|
| Pre-publication evidence | **Accepted** |
| Stage 1 dormant publication | **Completed — `0af5679e`** |
| Stage 2 reconciliation schedule | **Completed — enabled every five minutes; task UID `fb4zcRcehdoFBprjmXYDNf`** |
| Stage 3 live card enablement | **Completed — `c88c2e5e`** |
| Real test charge | **Not approved** |
| Refund/void/cancellation | **Not approved** |

## References

[1]: https://www.whitcombpayments.com/portal/docs/?p=1 "Whitcomb Payments Developer Documentation"

[2]: https://www.whitcombpayments.com/security/ "Whitcomb Payments Security"

[3]: https://www.whitcombpayments.com/status/ "Whitcomb Payments Status"
