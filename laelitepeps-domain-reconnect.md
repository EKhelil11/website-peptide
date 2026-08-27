# Reconnecting `laelitepeps.com`

**Prepared by:** Manus AI  
**Checked:** August 27, 2026

## Diagnosis

The domain’s public DNS and certificate are already reaching the Manus/Cloudflare edge. Both `laelitepeps.com` and `www.laelitepeps.com` resolve to `104.18.26.246`, HTTP redirects to HTTPS, and the current certificate covers the root domain plus wildcard subdomains. However, HTTPS returns **503** with an underlying **404**, which strongly indicates that the domain-to-project binding is stale or missing rather than a basic DNS or SSL failure.[1]

| Item | Current status | Meaning |
|---|---|---|
| Root domain | Resolves | DNS is active |
| `www` hostname | Resolves | `www` reaches the same edge |
| HTTPS certificate | Valid for root and wildcard | SSL has already been provisioned |
| Website response | 503 with underlying 404 | The domain is not routing to an active published project |
| Authoritative nameservers | `ns1.globaldomaingroup.com`, `ns2.globaldomaingroup.com` | Do not replace these merely to reconnect the site |
| Email routing | Google MX record present | Preserve MX and email-related TXT records |

## Safe disconnect-and-reconnect sequence

First, open the Manus project to which the domain was previously connected. In the project’s management panel, go to **Settings → Domains**, select `laelitepeps.com`, and choose **Disconnect**, **Remove**, or **Unbind**. If the domain is attached to an older project, remove it there before trying to connect it to the current **LA Elite Peptides** project.

Next, open the correct `website-peptide` project and make sure its latest checkpoint is ready. Go to **Settings → Domains**, choose **Connect existing domain**, and enter `laelitepeps.com`. Enable **Set up both** so that the root domain and `www.laelitepeps.com` are connected together; Manus specifically recommends this when reconnecting to resolve `www` certificate or routing problems.[2]

Set `laelitepeps.com` as the primary domain and redirect `www.laelitepeps.com` to it, unless you intentionally want `www` to be primary. Complete the connection and then click **Publish** in the project interface. Manus provisions SSL automatically after the domain is connected.[3]

If Manus displays DNS records for manual entry, use **exactly the values shown in the domain connection panel**. In the DNS manager, remove only conflicting website records for the root host (`@`) and `www`, then add the new Manus-provided A or CNAME records. Do **not** delete the nameservers, the Google MX record, or email-verification TXT records. Manus documentation also warns that an existing A record may need to be removed before adding the newly supplied A or CNAME record.[2]

## Verification

After reconnection, the Manus Domains panel should show both hostnames as connected and SSL as active. Test all four addresses:

| Address | Expected behavior |
|---|---|
| `http://laelitepeps.com` | Redirects to `https://laelitepeps.com/` |
| `https://laelitepeps.com` | Loads the current LA Elite Peptides website |
| `http://www.laelitepeps.com` | Redirects to HTTPS and then the primary hostname |
| `https://www.laelitepeps.com` | Loads or redirects without a certificate warning |

> **Important:** The current evidence points to a project binding problem. Do not transfer the domain or change its nameservers as a first step; that could disrupt the existing Google email routing.

## References

[1]: https://dns.google/resolve?name=laelitepeps.com&type=A "Google Public DNS — laelitepeps.com A record"
[2]: https://help.manus.im/en/articles/11711203-how-can-i-connect-the-website-created-by-manus-to-my-custom-domain "Manus Help Center — Connect a website to a custom domain"
[3]: https://manus.im/docs/website-builder/custom-domains "Manus Documentation — Custom Domains"
