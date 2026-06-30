// === LA ELITE PEPTIDES — Customer Auth tRPC Router ===
// Handles registration, login, logout, email verification, and password reset
// Completely separate from Manus OAuth (admin-only)

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "./_core/trpc";
import {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  verifyCustomerEmail,
  getCustomerFromSession,
  createPasswordResetToken,
  resetPassword,
  resendVerificationToken,
} from "./customerAuth";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "./email";

const CUSTOMER_SESSION_COOKIE = "lap_customer_session";

function getCustomerToken(req: any): string | null {
  const cookies = req.cookies as Record<string, string> | undefined;
  return cookies?.[CUSTOMER_SESSION_COOKIE] ?? null;
}

function setCustomerCookie(res: any, token: string, expiresAt: number) {
  res.cookie(CUSTOMER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(expiresAt),
    path: "/",
  });
}

function clearCustomerCookie(res: any) {
  res.clearCookie(CUSTOMER_SESSION_COOKIE, { path: "/" });
}

export const customerRouter = router({
  // ─── Register ──────────────────────────────────────────────────────────────
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        firstName: z.string().min(1).max(128),
        lastName: z.string().min(1).max(128),
        origin: z.string().url(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { email, verificationToken } = await registerCustomer({
          email: input.email,
          password: input.password,
          firstName: input.firstName,
          lastName: input.lastName,
        });

        await sendVerificationEmail({
          email,
          firstName: input.firstName,
          verificationToken,
          origin: input.origin,
        });

        return { success: true };
      } catch (err: any) {
        if (err.message === "EMAIL_EXISTS") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "An account with this email already exists.",
          });
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Registration failed." });
      }
    }),

  // ─── Verify Email ──────────────────────────────────────────────────────────
  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const customer = await verifyCustomerEmail(input.token);
        return { success: true, email: customer.email };
      } catch (err: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This verification link is invalid or has expired.",
        });
      }
    }),

  // ─── Resend Verification ───────────────────────────────────────────────────
  resendVerification: publicProcedure
    .input(z.object({ email: z.string().email(), origin: z.string().url() }))
    .mutation(async ({ input }) => {
      const result = await resendVerificationToken(input.email);
      if (result) {
        await sendVerificationEmail({
          email: result.customer.email,
          firstName: result.customer.firstName,
          verificationToken: result.verificationToken,
          origin: input.origin,
        });
      }
      // Always return success to avoid email enumeration
      return { success: true };
    }),

  // ─── Login ─────────────────────────────────────────────────────────────────
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string(), rememberMe: z.boolean().optional().default(false) }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { customer, token, expiresAt } = await loginCustomer(
          input.email,
          input.password,
          input.rememberMe
        );

        setCustomerCookie(ctx.res, token, expiresAt);

        return {
          success: true,
          customer: {
            id: customer.id,
            email: customer.email,
            firstName: customer.firstName,
            lastName: customer.lastName,
          },
        };
      } catch (err: any) {
        if (err.message === "EMAIL_NOT_VERIFIED") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Please verify your email before logging in.",
          });
        }
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password.",
        });
      }
    }),

  // ─── Me (current session) ─────────────────────────────────────────────────
  me: publicProcedure.query(async ({ ctx }) => {
    const token = getCustomerToken(ctx.req);
    if (!token) return null;
    const customer = await getCustomerFromSession(token);
    if (!customer) return null;
    return {
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
    };
  }),

  // ─── Logout ────────────────────────────────────────────────────────────────
  logout: publicProcedure.mutation(async ({ ctx }) => {
    const token = getCustomerToken(ctx.req);
    if (token) await logoutCustomer(token);
    clearCustomerCookie(ctx.res);
    return { success: true };
  }),

  // ─── Forgot Password ───────────────────────────────────────────────────────
  forgotPassword: publicProcedure
    .input(z.object({ email: z.string().email(), origin: z.string().url() }))
    .mutation(async ({ input }) => {
      const result = await createPasswordResetToken(input.email);
      if (result) {
        await sendPasswordResetEmail({
          email: result.customer.email,
          firstName: result.customer.firstName,
          resetToken: result.resetToken,
          origin: input.origin,
        });
      }
      // Always return success to avoid email enumeration
      return { success: true };
    }),

  // ─── Reset Password ────────────────────────────────────────────────────────
  resetPassword: publicProcedure
    .input(z.object({ token: z.string(), password: z.string().min(8) }))
    .mutation(async ({ input }) => {
      try {
        await resetPassword(input.token, input.password);
        return { success: true };
      } catch (err: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This reset link is invalid or has expired.",
        });
      }
    }),
});
