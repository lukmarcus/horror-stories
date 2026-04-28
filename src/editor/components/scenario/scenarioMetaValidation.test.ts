import { describe, it, expect } from "vitest";
import {
  toSlug,
  validateMeta,
  TITLE_MAX,
  DESC_MAX,
  PLAYER_MIN,
  PLAYER_MAX,
  DURATION_MAX,
} from "./scenarioMetaValidation";
import type { Scenario } from "../../../types";

const baseMeta: Scenario = {
  id: "test",
  title: "Test",
  description: "",
  minPlayerCount: null,
  maxPlayerCount: null,
  duration: null,
};

// --- toSlug ---

describe("toSlug", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(toSlug("Hello World")).toBe("hello-world");
  });

  it("strips Polish diacritics", () => {
    expect(toSlug("Zółta żaba")).toBe("zolta-zaba");
  });

  it("handles ł separately", () => {
    expect(toSlug("łódź")).toBe("lodz");
  });

  it("collapses multiple non-alphanumeric chars into one hyphen", () => {
    expect(toSlug("a  --  b")).toBe("a-b");
  });

  it("trims leading and trailing hyphens", () => {
    expect(toSlug("  !tytuł!  ")).toBe("tytul");
  });

  it("returns empty string for empty input", () => {
    expect(toSlug("")).toBe("");
  });

  it("returns empty string for whitespace-only input", () => {
    expect(toSlug("   ")).toBe("");
  });
});

// --- validateMeta ---

describe("validateMeta", () => {
  it("returns no errors for valid minimal meta", () => {
    expect(validateMeta(baseMeta)).toEqual({});
  });

  it("requires title", () => {
    const errors = validateMeta({ ...baseMeta, title: "" });
    expect(errors.title).toBeDefined();
  });

  it("requires non-whitespace title", () => {
    const errors = validateMeta({ ...baseMeta, title: "   " });
    expect(errors.title).toBeDefined();
  });

  it("rejects title over TITLE_MAX chars", () => {
    const errors = validateMeta({
      ...baseMeta,
      title: "a".repeat(TITLE_MAX + 1),
    });
    expect(errors.title).toBeDefined();
  });

  it("accepts title exactly at TITLE_MAX", () => {
    const errors = validateMeta({ ...baseMeta, title: "a".repeat(TITLE_MAX) });
    expect(errors.title).toBeUndefined();
  });

  it("ignores description when empty", () => {
    expect(
      validateMeta({ ...baseMeta, description: "" }).description,
    ).toBeUndefined();
  });

  it("rejects description over DESC_MAX chars", () => {
    const errors = validateMeta({
      ...baseMeta,
      description: "a".repeat(DESC_MAX + 1),
    });
    expect(errors.description).toBeDefined();
  });

  it("accepts description exactly at DESC_MAX", () => {
    const errors = validateMeta({
      ...baseMeta,
      description: "a".repeat(DESC_MAX),
    });
    expect(errors.description).toBeUndefined();
  });

  it("ignores null player counts", () => {
    const errors = validateMeta({
      ...baseMeta,
      minPlayerCount: null,
      maxPlayerCount: null,
    });
    expect(errors.minPlayerCount).toBeUndefined();
    expect(errors.maxPlayerCount).toBeUndefined();
  });

  it("rejects minPlayerCount below PLAYER_MIN", () => {
    const errors = validateMeta({
      ...baseMeta,
      minPlayerCount: PLAYER_MIN - 1,
    });
    expect(errors.minPlayerCount).toBeDefined();
  });

  it("rejects maxPlayerCount above PLAYER_MAX", () => {
    const errors = validateMeta({
      ...baseMeta,
      maxPlayerCount: PLAYER_MAX + 1,
    });
    expect(errors.maxPlayerCount).toBeDefined();
  });

  it("rejects maxPlayerCount lower than minPlayerCount", () => {
    const errors = validateMeta({
      ...baseMeta,
      minPlayerCount: 3,
      maxPlayerCount: 2,
    });
    expect(errors.maxPlayerCount).toBeDefined();
  });

  it("accepts minPlayerCount equal to maxPlayerCount", () => {
    const errors = validateMeta({
      ...baseMeta,
      minPlayerCount: 2,
      maxPlayerCount: 2,
    });
    expect(errors.maxPlayerCount).toBeUndefined();
  });

  it("ignores null duration", () => {
    expect(
      validateMeta({ ...baseMeta, duration: null }).duration,
    ).toBeUndefined();
  });

  it("rejects duration of 0", () => {
    const errors = validateMeta({ ...baseMeta, duration: 0 });
    expect(errors.duration).toBeDefined();
  });

  it("rejects duration above DURATION_MAX", () => {
    const errors = validateMeta({ ...baseMeta, duration: DURATION_MAX + 1 });
    expect(errors.duration).toBeDefined();
  });

  it("accepts duration exactly at DURATION_MAX", () => {
    const errors = validateMeta({ ...baseMeta, duration: DURATION_MAX });
    expect(errors.duration).toBeUndefined();
  });
});
