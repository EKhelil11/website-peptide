import { afterEach, describe, expect, it, vi } from "vitest";
import { ENV } from "./_core/env";
import { __setNotificationFetchForTests, notifyOwner } from "./_core/notification";

const originalForgeApiUrl = ENV.forgeApiUrl;
const originalForgeApiKey = ENV.forgeApiKey;

afterEach(() => {
  ENV.forgeApiUrl = originalForgeApiUrl;
  ENV.forgeApiKey = originalForgeApiKey;
  __setNotificationFetchForTests();
});

describe("owner notification transport timeout", () => {
  it("passes the caller's abort signal to a hanging HTTP request and returns false after abort", async () => {
    ENV.forgeApiUrl = "https://forge.example/";
    ENV.forgeApiKey = "test-only-forge-key";
    const fetcher = vi.fn((_url: string | URL | Request, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
    }));
    __setNotificationFetchForTests(fetcher as typeof fetch);
    const controller = new AbortController();
    const pending = notifyOwner({ title: "Payment", content: "Controlled test" }, controller.signal);
    controller.abort();

    await expect(pending).resolves.toBe(false);
    expect(fetcher).toHaveBeenCalledWith(
      "https://forge.example/webdevtoken.v1.WebDevService/SendNotification",
      expect.objectContaining({ signal: controller.signal }),
    );
  });
});
