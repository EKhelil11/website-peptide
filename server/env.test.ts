import { describe, expect, it } from "vitest";
import { parseBooleanEnv } from "./_core/env";

describe("live integration approval flag parsing", () => {
  it.each(["true", "True", "TRUE", " true "]) (
    "treats explicit true value %j as enabled",
    value => {
      expect(parseBooleanEnv(value)).toBe(true);
    },
  );

  it.each([undefined, "", "false", "False", "1", "yes"]) (
    "keeps non-true value %j disabled",
    value => {
      expect(parseBooleanEnv(value)).toBe(false);
    },
  );
});
