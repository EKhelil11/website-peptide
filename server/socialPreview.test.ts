import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const html = readFileSync(new URL("../client/index.html", import.meta.url), "utf8");
const previewImage =
  "https://laelitepeps.com/manus-storage/la-elite-peptides-link-preview_7eee0874.jpg";

describe("public link-preview and search image metadata", () => {
  it("uses the owner-approved absolute image across canonical social metadata", () => {
    expect(html).toContain('<link rel="canonical" href="https://laelitepeps.com/" />');
    expect(html).toContain(`<link rel="image_src" href="${previewImage}" />`);
    expect(html).toContain(`<meta property="og:image" content="${previewImage}" />`);
    expect(html).toContain(`<meta property="og:image:secure_url" content="${previewImage}" />`);
    expect(html).toContain('<meta property="og:image:type" content="image/jpeg" />');
    expect(html).toContain('<meta property="og:image:width" content="1280" />');
    expect(html).toContain('<meta property="og:image:height" content="853" />');
    expect(html).toContain(`<meta name="twitter:image" content="${previewImage}" />`);
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(html).toContain('content="index, follow, max-image-preview:large"');
    expect(html).not.toContain("lap-social-preview_9a9180b3.jpg");
  });

  it("uses the approved Trusted. Tested. name and research-only-safe descriptions", () => {
    expect(html).toContain("LA Elite Peptides — Trusted. Tested.");
    expect(html).toContain("qualified in-vitro laboratory research");
    expect(html).toContain("product-specific Certificates of Analysis");
    expect(html).not.toContain("Research grade quality you can count on");
  });

  it("publishes valid Organization, WebSite, and WebPage JSON-LD with the preferred image", () => {
    const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    expect(match).not.toBeNull();

    const data = JSON.parse(match![1]);
    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@graph"].map((item: { "@type": string }) => item["@type"])).toEqual([
      "Organization",
      "WebSite",
      "WebPage",
    ]);

    const organization = data["@graph"][0];
    const webPage = data["@graph"][2];
    expect(organization.name).toBe("LA Elite Peptides");
    expect(organization.image.url).toBe(previewImage);
    expect(organization.image).toMatchObject({ width: 1280, height: 853 });
    expect(webPage.primaryImageOfPage.url).toBe(previewImage);
    expect(webPage.primaryImageOfPage).toMatchObject({ width: 1280, height: 853 });
    expect(data["@graph"].some((item: object) => "aggregateRating" in item)).toBe(false);
    expect(data["@graph"].some((item: object) => "review" in item)).toBe(false);
    expect(data["@graph"].some((item: object) => "offers" in item)).toBe(false);
  });
});
