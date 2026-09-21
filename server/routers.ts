import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { orderRouter } from "./orderRouter";
import { customerRouter } from "./customerRouter";
import { acceptTerms } from "./db";
import { getIntegrationStatus } from "./integrationStatus";

export const appRouter = router({
  system: systemRouter,
  integrations: router({
    status: publicProcedure.query(() => {
      const status = getIntegrationStatus();
      return {
        email: { configured: status.email.configured, message: status.email.message },
        shipstation: { configured: status.shipstation.configured, message: status.shipstation.message },
        whitcomb: { configured: status.whitcomb.configured, message: status.whitcomb.message },
      };
    }),
  }),
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    acceptTerms: protectedProcedure
      .input(z.object({ termsVersion: z.string().default("v1.0") }))
      .mutation(async ({ ctx, input }) => {
        await acceptTerms(ctx.user.id, input.termsVersion);
        return { success: true };
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  orders: orderRouter,
  customer: customerRouter,
});

export type AppRouter = typeof appRouter;
