import type { Request, Response } from "express";
import { sdk } from "./_core/sdk";
import { ENV } from "./_core/env";
import {
  claimSystemJobLease,
  getPendingWhitcombOrders,
  getSystemJobByTaskUid,
  releaseSystemJobLease,
} from "./db";
import { reconcileWhitcombOrder } from "./paymentOrchestration";

let LEASE_MS = 90_000;
let ENDPOINT_DEADLINE_MS = 45_000;

export function __setWhitcombScheduledTimingsForTests(input?: { leaseMs?: number; deadlineMs?: number }) {
  if (ENV.isProduction) throw new Error("Whitcomb scheduler timing overrides are unavailable in production");
  LEASE_MS = input?.leaseMs ?? 90_000;
  ENDPOINT_DEADLINE_MS = input?.deadlineMs ?? 45_000;
}

export async function reconcileWhitcombPaymentsHandler(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) {
      return res.status(403).json({ error: "cron-only" });
    }
    const job = await getSystemJobByTaskUid(user.taskUid);
    if (!job || job.name !== "whitcomb-payment-reconciliation") {
      return res.json({ ok: true, skipped: "orphan" });
    }
    const startedAt = Date.now();
    if (!await claimSystemJobLease(user.taskUid, startedAt, LEASE_MS)) {
      return res.json({ ok: true, skipped: "overlap" });
    }

    const pending = await getPendingWhitcombOrders(5, startedAt - 5 * 60 * 1000);
    const results = { checked: 0, paid: 0, open: 0, cancelled: 0, errors: 0 };
    let completed = false;
    try {
      const work = Promise.all(pending.map(async order => {
        try {
          const result = await reconcileWhitcombOrder(order.id);
          results.checked += 1;
          if (result.paid) results.paid += 1;
          else if (result.status === "cancelled") results.cancelled += 1;
          else results.open += 1;
        } catch {
          results.errors += 1;
          console.error(`[Whitcomb] Reconciliation failed for order ${order.id}.`);
        }
      }));
      const deadline = new Promise<"deadline">(resolve => {
        const timer = setTimeout(() => resolve("deadline"), ENDPOINT_DEADLINE_MS);
        timer.unref?.();
      });
      const outcome = await Promise.race([work.then(() => "complete" as const), deadline]);
      completed = outcome === "complete";
      if (!completed) {
        return res.status(202).json({ ok: true, partial: true, ...results });
      }
      return res.json({ ok: true, ...results });
    } finally {
      if (completed) await releaseSystemJobLease(user.taskUid);
    }
  } catch (error) {
    return res.status(500).json({
      error: "Scheduled payment reconciliation failed.",
    });
  }
}
