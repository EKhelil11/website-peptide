import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { orderRouter } from "./orderRouter";
import { acceptTerms } from "./db";

export const appRouter = router({
  system: systemRouter,
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
});

export type AppRouter = typeof appRouter;
