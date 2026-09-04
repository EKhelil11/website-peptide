import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const appSource = readFileSync("client/src/App.tsx", "utf8");
const aboutSource = readFileSync("client/src/components/AboutSection.tsx", "utf8");
const footerSource = readFileSync("client/src/components/Footer.tsx", "utf8");
const ageVerificationSource = readFileSync("client/src/components/AgeVerification.tsx", "utf8");

describe("premium route transitions", () => {
  it("wraps the route switch once without remounting global providers", () => {
    expect(appSource).toContain("function RouteTransition()");
    expect(appSource).toContain("<RouteTransition />");
    expect(appSource).toContain("<CartProvider>");
    expect(appSource).toMatch(/<CartProvider>[\s\S]*<RouteTransition \/>[\s\S]*<\/CartProvider>/);
  });

  it("uses only short transform and opacity motion", () => {
    expect(appSource).toContain("const ROUTE_TRANSITION_DURATION = 0.22");
    expect(appSource).toContain("const ROUTE_TRANSITION_OFFSET = 10");
    expect(appSource).toContain("{ opacity: 0, y: ROUTE_TRANSITION_OFFSET }");
    expect(appSource).toContain("animate={{ opacity: 1, y: 0 }}");
    expect(appSource).not.toContain("AnimatePresence");
    expect(appSource).not.toMatch(/transition=\{\{[^}]*height|transition=\{\{[^}]*width/);
  });

  it("provides an immediate reduced-motion path", () => {
    expect(appSource).toContain("useReducedMotion");
    expect(appSource).toContain('data-route-transition={shouldReduceMotion ? "reduced" : "premium"}');
    expect(appSource).toContain("{ duration: 0 }");
    expect(ageVerificationSource).not.toContain("route-motion-audit");
  });

  it("preserves top-of-route and hash-anchor navigation", () => {
    expect(appSource).toContain("window.location.hash");
    expect(appSource).toContain("decodeURIComponent(hash.slice(1))");
    expect(appSource).toContain("document.getElementById(targetId)?.scrollIntoView");
    expect(appSource).toContain('window.scrollTo({ top: 0, left: 0, behavior: "instant" })');
    expect(appSource).toContain('const routeKey = location.split(/[?#]/)[0] || "/"');
  });

  it("keeps every existing public, customer, and admin route inside the shared switch", () => {
    for (const route of [
      "/",
      "/product/:id",
      "/coa/:id",
      "/shop",
      "/checkout",
      "/account",
      "/admin",
      "/admin/login",
      "/admin/orders",
      "/login",
      "/register",
      "/terms",
      "/shipping-returns",
      "/privacy-policy",
    ]) {
      expect(appSource).toContain(`path="${route}"`);
    }
  });
});

describe("Who We Are proof badge", () => {
  it("matches the footer wording and boutique proof-pill treatment at the left text margin", () => {
    expect(aboutSource).not.toContain("Los Angeles. Research Focused. Document Led.");
    expect(aboutSource).toContain("Trusted. Tested.");
    expect(aboutSource).toContain("brand-proof-page-margin mt-14 flex w-full justify-end");
    expect(aboutSource).toContain("brand-proof-line flex w-fit max-w-full items-center justify-start");
    expect(aboutSource).toContain("'Cormorant Garamond', serif");
    expect(aboutSource).toContain("whitespace-nowrap text-lg italic");
    expect(footerSource).toContain("brand-proof-footer");
    expect(footerSource).toContain("Trusted. Tested.");
  });
});
