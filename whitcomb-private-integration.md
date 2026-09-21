# Whitcomb Payments Private Integration Record

**Status:** Private development only. The current public release remains `fd3194dc`; this card-payment work has not been checkpointed or published. Live card checkout remains disabled unless `ENABLE_LIVE_WHITCOMB=true` is explicitly approved and securely configured.

## Sources reviewed

The integration design is based on Whitcomb Payments’ official custom-site Process Now API documentation at <https://www.whitcombpayments.com/portal/docs/?p=1>, Whitcomb’s security statement at <https://www.whitcombpayments.com/security/>, Whitcomb’s system status page at <https://www.whitcombpayments.com/status/>, and the owner-supplied `whitcomb-process-now.zip` WordPress/WooCommerce plugin.

The supplied archive’s SHA-256 digest was recorded during inspection. Its files were inventoried and statically reviewed without executing the plugin. The package is a WooCommerce plugin, so it cannot be installed directly into the React/Express storefront. Its payment design matches Whitcomb’s documented custom-site API: one-time activation, HMAC-SHA256 signed server calls, hosted card entry, server-side status confirmation, and polling rather than merchant webhooks. No obvious shell-command execution, dynamic evaluation, or credential-exfiltration primitive was found in the reviewed source. PHP syntax validation could not run because PHP is not installed in the sandbox; the TypeScript implementation does not execute or depend on the PHP plugin.

## Provider constraints and verified status

Whitcomb requires card entry on its hosted payment page; LA Elite Peptides never collects or stores raw card numbers or security codes. Signed requests use a base64url JSON payload plus an HMAC-SHA256 signature keyed by a server-only store secret. Payment is authoritative only when `/api/pn-checkout` with action `status` returns `paid: true`; a browser redirect is not proof of payment.

Whitcomb documents one order per charge, USD integer cents, exact order-number idempotency, same-host return URL pinning, no merchant webhook, no refund API, and polling no more often than every five minutes. It has no sandbox. Whitcomb can arm an account for a one-payment trial, which is a real charge and ends the trial. A real trial therefore requires separate owner confirmation of the exact charge, test customer, consumed order number, transactional emails, and fulfillment consequences.

The owner supplied the Process Now activation key through the secure credential field. A credential-safe live test called only activation and signed ping endpoints; it did not create an order, payment link, or charge. Whitcomb returned `status=active` and `armed=true`. The key, derived brand code, and derived store secret were not printed, logged, or stored in source.

## Selected architecture

Card payment supplements Zelle. The customer explicitly chooses Zelle or Credit or Debit Card. The server derives totals from the canonical catalog, preserves RECROOMLV merchandise-discount arithmetic, and only then requests Whitcomb’s hosted payment page. Whitcomb’s return origin is pinned to `https://laelitepeps.com`, and a returned hosted URL must parse as HTTPS with the exact `https://whitcombpayments.com` origin.

Each checkout page generates one stable UUID idempotency key. The database stores it under a unique constraint scoped by customer lookup. A normal retry returns the already committed order; a concurrent unique-key race also returns the winning order without creating another hosted session or sending another order email. The uniquely keyed order row is inserted before the LAP sequence reservation, so a duplicate checkout cannot consume a second customer-facing order number.

The order stores immutable payment-method attribution, provider reference, trusted hosted URL, provider amount, provider status, check timestamp, check count, and paid timestamp. Session attachment permits only a null or identical existing reference and verifies the affected row. Resume reuses the stored trusted URL rather than asking Whitcomb for a second session. If initial session creation is interrupted or ambiguous, the order remains a pending card order and routes the customer to My Account for safe resume; it never silently becomes Zelle, preventing a customer from paying the same order twice by different methods.

A dedicated return page asks the server to verify customer ownership, provider reference, and exact integer-cent amount. Paid responses that omit the amount or report a mismatch are rejected. An atomic database compare-and-set claims each provider poll before network access; losing return, resume, or scheduler requests serve cached state instead of contacting Whitcomb. Status recording and paid/cancelled transitions must present the same claim timestamp, preventing a slow or stale response from overwriting newer state. Admin sees card attribution and provider status but cannot manually mark a card order paid. The database’s pending-card-to-paid transition is conditional and idempotent, so duplicate polls do not resend notifications or duplicate fulfillment.

Zelle remains unchanged for customers. Admin Zelle confirmation now uses one conditional transactional pending-to-paid transition; a concurrent losing confirmation receives a conflict and cannot emit duplicate notifications, emails, history, or fulfillment calls. Its payment-confirmation email uses the same abortable, order-idempotent Resend transport as the card reconciliation flow.

Closed-tab reconciliation uses a platform Heartbeat endpoint authenticated by `user.isCron` and the platform task UID stored in `system_jobs`. A database lease prevents overlapping runs. Each invocation considers at most five eligible pending card orders whose last check is at least five minutes old. The endpoint has a 45-second deadline and a 90-second lease. Whitcomb and ShipStation HTTP calls have ten-second abort signals; owner notification and the direct Resend payment-confirmation request have eight-second abort signals. The Resend call also uses an order-scoped idempotency key. The scheduled job must not be created until after an owner-approved publication because the callback must exist on the deployed site first.

## Security and privacy controls

`WHITCOMB_PROCESS_NOW_KEY` is server-only. `ENABLE_LIVE_WHITCOMB` is a separate explicit approval gate. Credentials alone do not expose or enable live card checkout. Ordinary tests use injected provider doubles. The credential test additionally requires `RUN_WHITCOMB_CREDENTIAL_TEST=true`, preventing repeated live calls in the normal suite. Provider error bodies are not printed by checkout or scheduled reconciliation. The public integration-status procedure returns only UI-required availability and messages, not credential-presence or approval metadata. The stored hosted-payment URL is omitted from ordinary Account and Admin order responses and is returned only by authenticated submit or resume procedures.

An independent senior security review initially identified submit idempotency, concurrent Zelle confirmation, scheduler runtime, session-attachment, polling, forwarded-host, and logging concerns. Those findings were addressed with the controls described above and added regression coverage. A second read-only review identified non-atomic poll throttling and response-only notification timeouts; those were replaced with the atomic poll claim and real abortable transports described above. The final targeted independent review returned **SHIP for private owner review**, with no remaining High or Medium blockers. It explicitly did not authorize publication.

## Validation completed

TypeScript passed. The full credential-safe test suite passed **189 tests**, with five live/credential workflows intentionally skipped. Coverage includes HMAC construction, active/paused provider state, exact hosted origin, paid/cancelled/malformed responses, amount mismatch, missing amount, atomic poll-claim losers, terminal-state caching, idempotent paid transition, duplicate checkout replay, concurrent unique-key recovery, interrupted session creation, concurrent Zelle confirmation suppression, real hanging-transport aborts for notification, Resend, Whitcomb, and ShipStation, Resend idempotency, scheduler overlap rejection, completed-run lease release, deadline partial response with lease retention, approval gates, email content, and ShipStation mapping. The production build and `git diff --check` passed. The existing advisory that the main JavaScript chunk exceeds 500 kB remains unrelated and non-blocking.

A fully mocked, mutation-blocked browser audit covered checkout at 1440, 375, and 320 pixels, My Account at 375 pixels, Admin at 375 pixels, and the verified payment-return page at 375 pixels. All six surfaces had no horizontal overflow. No request reached a real mutation handler; the one return-confirmation POST was answered locally by the browser fixture.

The additive migrations were reviewed and applied to the private project database. Read-only verification found the same two historical orders, `LAP-100001` and `LAP-130001`, zero Whitcomb card orders, zero scheduled-job rows, and an `order_number_sequence` table definition with `AUTO_INCREMENT=130002`. No test order consumed `LAP-130002`.

## Deliberately not performed

No real order, hosted payment link, card charge, customer or owner email, ShipStation order, label, scheduled task, checkpoint, or publication was created during private implementation and validation. Because Whitcomb has no sandbox, the only remaining end-to-end proof is its one-payment trial, which is a real charge. That trial remains unperformed pending separate owner approval of the exact charge and consequences.
