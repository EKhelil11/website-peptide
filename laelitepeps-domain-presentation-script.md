# Presentation Script: Reconnecting `laelitepeps.com`

**Format:** 12-slide instructional presentation  
**Suggested duration:** 7–10 minutes  
**Audience:** LA Elite Peptides website owner or administrator  
**Presenter:** Manus AI

---

## Cover

**Title:** Reconnect `laelitepeps.com`

**Subtitle:** A safe, step-by-step guide for restoring the LA Elite Peptides website

**Presenter:** Manus AI

---

## Slide 1 — The Domain Reaches Manus

### On-screen content

| Check | Current result |
|---|---|
| Domain registration | Active |
| Root and `www` DNS | Resolving |
| HTTPS certificate | Valid |
| Website routing | 503 with underlying 404 |

**Key message:** The connection to the correct website project is missing or stale.

### Speaker script

“Before changing anything, let’s clarify what is working. The domain is registered, both the root and `www` addresses resolve, and a valid HTTPS certificate is already present. The live site currently returns a 503 response with an underlying 404. This pattern indicates that traffic is reaching the hosting edge, but the domain is not routing to the correct active project. We will therefore repair the project binding rather than transfer the domain or rebuild its DNS from scratch.”

### Presenter cue

Pause on the final row and emphasize that this is primarily a **routing and project-binding issue**.

---

## Slide 2 — Prepare Before Disconnecting

### On-screen content

1. Confirm access to the old Manus project.
2. Confirm access to the current `website-peptide` project.
3. Save or publish the latest website checkpoint.
4. Keep the registrar or DNS panel available as a fallback.

### Speaker script

“Start by confirming that you can access both the project that previously used the domain and the current LA Elite Peptides project. The current website should have a recent checkpoint ready to publish. Keep the domain-management panel available, but do not edit DNS yet. The first objective is to remove the stale project association cleanly.”

### Presenter cue

Do not proceed until the correct destination project is clearly identified.

---

## Slide 3 — Disconnect the Old Project

### On-screen content

**Old project → Settings → Domains → `laelitepeps.com` → Disconnect**

Remove both hostnames if they appear separately:

- `laelitepeps.com`
- `www.laelitepeps.com`

### Speaker script

“Open the Manus project that previously held the domain. In the project management panel, select Settings and then Domains. Find `laelitepeps.com` and choose Disconnect, Remove, or Unbind. If the root domain and `www` hostname appear as separate entries, remove both. This releases the custom domain so it can be assigned to the correct project.”

### Presenter cue

Confirm that the old project no longer lists either hostname before moving forward.

---

## Slide 4 — Connect the Correct Project

### On-screen content

**Current project → Settings → Domains → Connect existing domain**

Enter:

`laelitepeps.com`

### Speaker script

“Now open the correct `website-peptide` project for LA Elite Peptides. Go to Settings, select Domains, and choose Connect existing domain. Enter `laelitepeps.com` without `http`, `https`, or a trailing slash. The project should now begin checking ownership and current DNS configuration.”

### Presenter cue

Double-check the spelling before confirming. Domain changes should never be made to a look-alike hostname.

---

## Slide 5 — Enable Root and `www`

### On-screen content

**Enable: Set up both**

| Hostname | Role |
|---|---|
| `laelitepeps.com` | Primary domain |
| `www.laelitepeps.com` | Redirect to primary |

### Speaker script

“When prompted, enable the option labeled Set up both. This connects the root domain and the `www` hostname together. Manus specifically recommends reconnecting with this option when the `www` hostname has routing or certificate problems.[1] Set `laelitepeps.com` as the primary address and configure `www.laelitepeps.com` to redirect to it.”

### Presenter cue

The intended result is one canonical website address, not two competing versions.

---

## Slide 6 — Use Only the DNS Values Shown

### On-screen content

If Manus reports **Connected**, do not change DNS.

If Manus provides new records:

| Host | Action |
|---|---|
| `@` | Replace only the conflicting website A/CNAME record |
| `www` | Replace only the conflicting website A/CNAME record |

### Speaker script

“Allow Manus to check the domain first. If the domain is recognized as connected, do not make unnecessary DNS changes. If new A or CNAME records are displayed, copy the record type, host, value, and TTL exactly as shown. Remove only the conflicting website record for `@` or `www` before adding the new value. Manus documentation notes that an existing A record may need to be removed before the new Manus-provided A or CNAME record is added.[1]”

### Presenter cue

Never guess a destination value. The connection panel is the authoritative source for the current project.

---

## Slide 7 — Protect Email and Nameservers

### On-screen content

**Do not delete or replace:**

- `ns1.globaldomaingroup.com`
- `ns2.globaldomaingroup.com`
- Google MX records
- Email-verification or SPF/DKIM/DMARC TXT records

### Speaker script

“The domain currently uses Global Domain Group nameservers and has Google email routing. These records are not the cause of the website-routing problem. Do not change the nameservers, remove Google MX records, or delete email-related TXT records. Doing so could interrupt email or move DNS authority away from the current provider. Only the website records for the root host and `www` should be touched if Manus explicitly supplies replacements.”

### Presenter cue

Present this as the most important safety warning in the process.

---

## Slide 8 — Publish the Current Website

### On-screen content

1. Confirm both hostnames are attached.
2. Confirm the latest checkpoint is selected.
3. Click **Publish**.
4. Keep the browser window open while status updates.

### Speaker script

“After the domain is attached to the correct project, confirm that both the root and `www` hostnames appear in the Domains panel. Select the latest website checkpoint and click Publish. Connecting a domain alone may not route visitors to the newest project version until that project has been published. Manus automatically provisions and configures SSL after a custom domain is connected.[2]”

### Presenter cue

Wait for the interface to show the deployment and domain as active before testing.

---

## Slide 9 — Verify All Four Addresses

### On-screen content

| Test address | Expected result |
|---|---|
| `http://laelitepeps.com` | Redirects to HTTPS |
| `https://laelitepeps.com` | Loads LA Elite Peptides |
| `http://www.laelitepeps.com` | Redirects to HTTPS and the primary host |
| `https://www.laelitepeps.com` | Loads or redirects without an SSL warning |

### Speaker script

“Test every version of the address, not just the homepage link you normally use. The two HTTP addresses should redirect to HTTPS. The secure root domain should load the current LA Elite Peptides website. The secure `www` address should either load the site or redirect to the root domain without a certificate warning. Use a private browser window or another device to reduce the effect of cached redirects.”

### Presenter cue

Confirm that the final address in the browser is the intended primary domain.

---

## Slide 10 — Allow Time for Status Changes

### On-screen content

**Immediate:** Project binding and publishing status  
**May take longer:** DNS caches and fresh SSL status

Avoid repeated disconnects while propagation is in progress.

### Speaker script

“Some status updates may appear quickly, while DNS caches and certificate checks can take longer. Avoid repeatedly disconnecting and reconnecting during this period, because that can restart validation or create uncertainty about which configuration is active. Recheck the Domains panel and the four test addresses after the platform has had time to process the change.”

### Presenter cue

Distinguish normal propagation delay from a persistent configuration error.

---

## Slide 11 — If the 503 Persists

### On-screen content

| Check | Corrective action |
|---|---|
| Domain still listed on old project | Remove it completely |
| Current project not published | Publish the latest checkpoint |
| Root connected but `www` missing | Reconnect with **Set up both** |
| Manus requests different DNS | Replace only conflicting `@`/`www` records |
| Domain panel remains failed | Capture the status message for support |

### Speaker script

“If the site still returns a 503 after reconnection, check whether the domain remains attached to another project, whether the current project was actually published, and whether both hostnames were configured. If Manus displays a failed verification state, capture the exact message and the DNS records shown in the panel. Do not compensate by changing unrelated nameservers or email records.”

### Presenter cue

Use the platform’s status message as the next diagnostic input rather than making broad DNS changes.

---

## Slide 12 — Successful Reconnection

### On-screen content

**Success means:**

- The current LA Elite Peptides site loads over HTTPS.
- `www` redirects to the chosen primary hostname.
- No 503, 404, or certificate warning appears.
- Business email continues to function.

### Speaker script

“The reconnection is complete when the current LA Elite Peptides website loads securely, `www` follows the chosen redirect, no routing or certificate error appears, and existing business email continues to work. The domain remains registered where it is; only its association with the correct website project has been repaired.”

### Presenter cue

End by opening `https://laelitepeps.com` in a private browser window and displaying the live homepage.

---

## Optional Closing

**Title:** Domain Reconnected

**Subtitle:** `laelitepeps.com` now routes securely to LA Elite Peptides

---

## References

[1]: https://help.manus.im/en/articles/11711203-how-can-i-connect-the-website-created-by-manus-to-my-custom-domain "Manus Help Center — How to connect a Manus website to a custom domain"
[2]: https://manus.im/docs/website-builder/custom-domains "Manus Documentation — Custom Domains"
