# LA Elite Peptides Domain Cutover Guide

**Production domain:** `laelitepeps.com`  
**Verified temporary site:** `https://peptideweb-yaousumk.manus.space`  
**Cutover-ready checkpoint:** `7471f85e`  
**Prepared by:** Manus AI  
**Date:** August 28, 2026

> **Safety rule:** Do not delete nameservers, MX records, email-related TXT records, or the temporary Manus domain. The temporary site is your working fallback while `laelitepeps.com` is connected.

## Before starting

Open `https://peptideweb-yaousumk.manus.space` in a private browser window. Confirm that you see the **LA Elite Peptides** intro and 21+ age gate rather than a maintenance or billing page. If the temporary site does not load, stop and do not change the production domain.

Keep this guide open in a separate tab. The cutover changes live website traffic, but it should not affect domain ownership or email when the safeguards below are followed.

| Confirm before proceeding | Expected result |
|---|---|
| Temporary website | LA Elite Peptides loads at `peptideweb-yaousumk.manus.space` |
| Project checkpoint | The current project shows checkpoint `7471f85e` or a newer checkpoint |
| Integrations | Resend and ShipStation remain disabled |
| Fallback | The temporary `*.manus.space` URL remains attached |

## Part 1: Open the correct replacement project

1. In Manus, open the **website-peptide** project containing the verified LA Elite Peptides preview.
2. Open the project’s right-side **Management UI**.
3. Select **Settings**.
4. Select **Domains** in the Settings navigation.
5. Before changing anything, confirm that `peptideweb-yaousumk.manus.space` appears as the current working domain.

**Stop if:** the project preview does not show the rebuilt LA Elite Peptides storefront, or the temporary domain is missing. Do not connect `laelitepeps.com` to an uncertain project.

## Part 2: Start connecting the existing domain

1. In **Settings → Domains**, choose **Connect existing domain**, **Add domain**, or the similarly named button shown in the panel.
2. Enter only:

   `laelitepeps.com`

3. Do not enter `https://`, a page path, or a trailing slash.
4. If the panel offers an option to configure both the root and `www` hostnames, enable it. The desired pair is:

   - `laelitepeps.com`
   - `www.laelitepeps.com`

5. Choose `laelitepeps.com` as the **primary** or **canonical** domain if the panel asks.
6. Keep the temporary Manus domain enabled.

## Part 3: Handle the old-project attachment safely

The unavailable prior project may still own the domain binding. Use the outcome that matches what you see.

| What the Domains panel shows | Safe action |
|---|---|
| The domain connects without an ownership error | Continue to Part 4. |
| “Already connected,” “In use,” or “Attached to another project” | Stop. Do not change DNS. If the old project is visible, disconnect the domain from that project’s **Settings → Domains** panel only. Then return to the replacement project and retry. |
| The old project is unavailable and there is no disconnect option | Stop and contact [Manus Support](https://help.manus.im). Provide `laelitepeps.com`, the temporary URL, and checkpoint `7471f85e`; ask them to release the stale project binding. |
| The panel asks you to purchase or transfer the domain | Stop. You already own the domain; do not purchase or transfer it. |

> Disconnecting the **website binding** is not the same as transferring domain ownership or deleting DNS. Do not initiate a registrar transfer.

## Part 4: Follow only the DNS instructions shown by Manus

Because the domain already resolves to Manus, the Domains panel may verify it automatically. If it does, do not edit DNS.

If the panel displays required DNS records, copy the exact record type, host, and destination that it shows. Change only conflicting website-routing records for the root (`@`) or `www` hostname.

| DNS item | What to do |
|---|---|
| Root website record (`@`) | Replace only if Manus explicitly provides a new required value. |
| `www` website record | Replace only if Manus explicitly provides a new required value. |
| Nameservers | **Do not change.** |
| MX records | **Do not remove or edit.** These control email delivery. |
| SPF, DKIM, DMARC, or other email TXT records | **Do not remove or edit.** |
| Unrelated subdomains | Leave unchanged. |

If you are unsure whether a displayed record is a website or email record, stop and send a screenshot before making the change.

## Part 5: Wait for verification

1. Return to **Settings → Domains** after submitting the connection.
2. Wait for `laelitepeps.com` to show a state such as **Connected**, **Verified**, or **Active**.
3. Confirm that `www.laelitepeps.com` is also connected or redirects to the root domain.
4. Do not repeatedly disconnect and reconnect while verification is pending.
5. Do not remove the temporary Manus domain.

DNS and certificate changes can take time. A pending state is safer than repeatedly changing records.

## Part 6: Verify the live domain

Once the panel shows the domain as active, open a private browser window and check these addresses:

| Address | Expected result |
|---|---|
| `https://laelitepeps.com` | LA Elite Peptides intro and age gate load securely |
| `https://www.laelitepeps.com` | Redirects to the primary domain or loads the same secure site |
| `https://laelitepeps.com/product/retatrutide-10mg` | Product detail loads with its image and research notice |
| `https://laelitepeps.com/login` | Customer sign-in loads; registration remains temporarily disabled |
| `https://laelitepeps.com/admin` | Anonymous visitors see **Admin access required** |
| `https://laelitepeps.com/terms` | Legal page displays **LA Elite Sales LLC** |

Look for the browser’s HTTPS lock or secure-connection indicator. Do not enter real customer information or place an order during this first production-domain check.

## Part 7: What to send back for final verification

After completing the connection, reply with **connected** and include the exact status shown beside `laelitepeps.com` in **Settings → Domains**. If possible, include a screenshot of that domain-status row. Do not include account credentials, API keys, DNS-provider passwords, or secret values.

The final verification will check public DNS, HTTPS certificate coverage, root and `www` behavior, redirects, deep routes, durable media, authentication surfaces, integration-disabled status, and the empty replacement database.

## Rollback if the production domain does not work

If `laelitepeps.com` does not load the replacement site after the domain panel reports it active:

1. Do not delete DNS records or nameservers.
2. Confirm that `https://peptideweb-yaousumk.manus.space` still works.
3. In the replacement project’s **Settings → Domains** panel, disconnect only `laelitepeps.com` if an immediate rollback is required.
4. Leave the temporary Manus domain active.
5. Report the exact error page, domain-panel status, and approximate time of the attempt.

This rollback removes the new website binding without deleting the replacement project, database, checkpoint, or temporary fallback URL.
