import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const logoAssetModule = fs.readFileSync(
  path.join(projectRoot, "client/src/lib/brandAssets.ts"),
  "utf8",
);

describe("shared silver-and-blue logo asset", () => {
  it("uses the durable transparent owner-supplied logo asset", () => {
    expect(logoAssetModule).toContain(
      "/manus-storage/la-elite-peptides-silver-blue-logo-final_c61a4232.png",
    );
  });

  it.each([
    "client/src/components/VideoIntro.tsx",
    "client/src/components/AgeVerification.tsx",
    "client/src/components/Navbar.tsx",
    "client/src/components/Footer.tsx",
  ])("uses the shared logo in %s", relativePath => {
    const source = fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
    expect(source).toContain("PRIMARY_LOGO_URL");
    expect(source).not.toContain("lap-logo-cropped_755f69ec.png");
  });

  it("keeps the published header and footer logos on one shared size token", () => {
    expect(logoAssetModule).toContain("PRIMARY_LOGO_SIZE_CLASS");

    for (const relativePath of [
      "client/src/components/Navbar.tsx",
      "client/src/components/Footer.tsx",
    ]) {
      const source = fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
      expect(source).toContain("PRIMARY_LOGO_SIZE_CLASS");
    }
  });
});
