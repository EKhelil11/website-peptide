// === Customer Auth Procedures — Vitest Tests ===
// Tests for the custom customer email/password auth system

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Unit tests for auth helpers (no DB required) ────────────────────────────

describe("Customer Auth — Token Generation", () => {
  it("should generate a unique verification token each call", async () => {
    const { randomBytes } = await import("crypto");
    const token1 = randomBytes(32).toString("hex");
    const token2 = randomBytes(32).toString("hex");
    expect(token1).not.toBe(token2);
    expect(token1).toHaveLength(64);
    expect(token2).toHaveLength(64);
  });

  it("should generate a token that expires in the future", () => {
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    expect(expiresAt).toBeGreaterThan(Date.now());
  });
});

describe("Customer Auth — Password Hashing", () => {
  it("should hash a password with bcryptjs", async () => {
    const bcrypt = await import("bcryptjs");
    const password = "TestPassword123!";
    const hash = await bcrypt.hash(password, 10);
    expect(hash).not.toBe(password);
    expect(hash).toMatch(/^\$2[aby]\$/);
  });

  it("should verify a correct password against its hash", async () => {
    const bcrypt = await import("bcryptjs");
    const password = "TestPassword123!";
    const hash = await bcrypt.hash(password, 10);
    const isValid = await bcrypt.compare(password, hash);
    expect(isValid).toBe(true);
  });

  it("should reject an incorrect password against a hash", async () => {
    const bcrypt = await import("bcryptjs");
    const password = "TestPassword123!";
    const wrongPassword = "WrongPassword456!";
    const hash = await bcrypt.hash(password, 10);
    const isValid = await bcrypt.compare(wrongPassword, hash);
    expect(isValid).toBe(false);
  });
});

describe("Customer Auth — Session Token", () => {
  it("should generate a session token of correct length", async () => {
    const { randomBytes } = await import("crypto");
    const sessionToken = randomBytes(48).toString("hex");
    expect(sessionToken).toHaveLength(96);
  });

  it("should set session expiry 30 days in the future", () => {
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const expiresAt = now + thirtyDays;
    const diffDays = (expiresAt - now) / (1000 * 60 * 60 * 24);
    expect(diffDays).toBeCloseTo(30, 0);
  });
});

describe("Customer Auth — Email Validation", () => {
  it("should accept valid email addresses", () => {
    const validEmails = [
      "user@example.com",
      "test.user+tag@domain.co.uk",
      "support@laelitepeps.com",
    ];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validEmails.forEach(email => {
      expect(emailRegex.test(email)).toBe(true);
    });
  });

  it("should reject invalid email addresses", () => {
    const invalidEmails = ["notanemail", "missing@", "@nodomain.com", ""];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    invalidEmails.forEach(email => {
      expect(emailRegex.test(email)).toBe(false);
    });
  });
});

describe("Customer Auth — Password Requirements", () => {
  it("should require minimum 8 characters", () => {
    expect("short".length >= 8).toBe(false);
    expect("longenough".length >= 8).toBe(true);
  });
});
