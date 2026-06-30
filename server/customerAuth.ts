// === LA ELITE PEPTIDES — Customer Auth Helpers ===
// Separate from Manus OAuth — handles email/password auth for customers

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getDb } from "./db";
import { customers, customerSessions } from "../drizzle/schema";
import { eq, and, gt } from "drizzle-orm";

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const VERIFICATION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const RESET_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

// ─── Registration ────────────────────────────────────────────────────────────

export async function registerCustomer(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB_UNAVAILABLE");

  const email = input.email.toLowerCase().trim();

  const existing = await db
    .select({ id: customers.id })
    .from(customers)
    .where(eq(customers.email, email))
    .limit(1);

  if (existing.length > 0) throw new Error("EMAIL_EXISTS");

  const passwordHash = await bcrypt.hash(input.password, 12);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const tokenExpiry = Date.now() + VERIFICATION_DURATION_MS;

  const [result] = await db.insert(customers).values({
    email,
    passwordHash,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    emailVerified: 0,
    verificationToken,
    tokenExpiry,
  });

  return { id: (result as any).insertId as number, email, verificationToken };
}

// ─── Email Verification ──────────────────────────────────────────────────────

export async function verifyCustomerEmail(token: string) {
  const db = await getDb();
  if (!db) throw new Error("DB_UNAVAILABLE");

  const now = Date.now();

  const rows = await db
    .select()
    .from(customers)
    .where(and(eq(customers.verificationToken, token), gt(customers.tokenExpiry, now)))
    .limit(1);

  if (rows.length === 0) throw new Error("INVALID_OR_EXPIRED_TOKEN");

  const customer = rows[0];

  await db
    .update(customers)
    .set({ emailVerified: 1, verificationToken: null, tokenExpiry: null })
    .where(eq(customers.id, customer.id));

  return customer;
}

// ─── Login ───────────────────────────────────────────────────────────────────

export async function loginCustomer(email: string, password: string) {
  const db = await getDb();
  if (!db) throw new Error("DB_UNAVAILABLE");

  const normalizedEmail = email.toLowerCase().trim();

  const rows = await db
    .select()
    .from(customers)
    .where(eq(customers.email, normalizedEmail))
    .limit(1);

  if (rows.length === 0) throw new Error("INVALID_CREDENTIALS");

  const customer = rows[0];

  const passwordMatch = await bcrypt.compare(password, customer.passwordHash);
  if (!passwordMatch) throw new Error("INVALID_CREDENTIALS");

  if (!customer.emailVerified) throw new Error("EMAIL_NOT_VERIFIED");

  const token = crypto.randomBytes(48).toString("hex");
  const expiresAt = Date.now() + SESSION_DURATION_MS;

  await db.insert(customerSessions).values({ customerId: customer.id, token, expiresAt });

  return { customer, token, expiresAt };
}

// ─── Session Validation ──────────────────────────────────────────────────────

export async function getCustomerFromSession(token: string) {
  if (!token) return null;
  const db = await getDb();
  if (!db) return null;

  const now = Date.now();

  const rows = await db
    .select({ session: customerSessions, customer: customers })
    .from(customerSessions)
    .innerJoin(customers, eq(customerSessions.customerId, customers.id))
    .where(and(eq(customerSessions.token, token), gt(customerSessions.expiresAt, now)))
    .limit(1);

  if (rows.length === 0) return null;
  return rows[0].customer;
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export async function logoutCustomer(token: string) {
  const db = await getDb();
  if (!db) return;
  await db.delete(customerSessions).where(eq(customerSessions.token, token));
}

// ─── Password Reset ──────────────────────────────────────────────────────────

export async function createPasswordResetToken(email: string) {
  const db = await getDb();
  if (!db) return null;

  const normalizedEmail = email.toLowerCase().trim();

  const rows = await db
    .select({ id: customers.id, email: customers.email, firstName: customers.firstName })
    .from(customers)
    .where(eq(customers.email, normalizedEmail))
    .limit(1);

  if (rows.length === 0) return null; // Don't reveal whether email exists

  const customer = rows[0];
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = Date.now() + RESET_DURATION_MS;

  await db
    .update(customers)
    .set({ resetToken, resetTokenExpiry })
    .where(eq(customers.id, customer.id));

  return { customer, resetToken };
}

export async function resetPassword(token: string, newPassword: string) {
  const db = await getDb();
  if (!db) throw new Error("DB_UNAVAILABLE");

  const now = Date.now();

  const rows = await db
    .select()
    .from(customers)
    .where(and(eq(customers.resetToken, token), gt(customers.resetTokenExpiry, now)))
    .limit(1);

  if (rows.length === 0) throw new Error("INVALID_OR_EXPIRED_TOKEN");

  const customer = rows[0];
  const passwordHash = await bcrypt.hash(newPassword, 12);

  await db
    .update(customers)
    .set({ passwordHash, resetToken: null, resetTokenExpiry: null })
    .where(eq(customers.id, customer.id));

  return customer;
}

// ─── Resend Verification ─────────────────────────────────────────────────────

export async function resendVerificationToken(email: string) {
  const db = await getDb();
  if (!db) return null;

  const normalizedEmail = email.toLowerCase().trim();

  const rows = await db
    .select()
    .from(customers)
    .where(eq(customers.email, normalizedEmail))
    .limit(1);

  if (rows.length === 0) return null;

  const customer = rows[0];
  if (customer.emailVerified) return null;

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const tokenExpiry = Date.now() + VERIFICATION_DURATION_MS;

  await db
    .update(customers)
    .set({ verificationToken, tokenExpiry })
    .where(eq(customers.id, customer.id));

  return { customer, verificationToken };
}
