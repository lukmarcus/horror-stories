import { describe, it, expect } from "vitest";
import { checkParagraphAccessibility } from "./gameLogic";
import type { Paragraph } from "../types";

describe("Paragraph Accessibility", () => {
  const directParagraph: Paragraph = { id: "1", text: "Direct" };
  const restrictedParagraph: Paragraph = {
    id: "4",
    text: "Restricted",
    accessibleFrom: ["1"],
  };
  const multiSourceParagraph: Paragraph = {
    id: "5",
    text: "Multi",
    accessibleFrom: ["2", "4"],
  };

  it("should identify direct paragraphs (no accessibleFrom)", () => {
    const result = checkParagraphAccessibility("1", directParagraph);
    expect(result.exists).toBe(true);
    expect(result.isAccessible).toBe(true);
    expect(result.needsWarning).toBe(false);
  });

  it("should identify non-direct paragraphs (has accessibleFrom)", () => {
    const result = checkParagraphAccessibility("4", restrictedParagraph);
    expect(result.exists).toBe(true);
    expect(result.isAccessible).toBe(false);
    expect(result.needsWarning).toBe(true);
    expect(result.accessibleFrom).toContain("1");
  });

  it("should list all sources for non-direct paragraph", () => {
    const result = checkParagraphAccessibility("5", multiSourceParagraph);
    expect(result.accessibleFrom).toEqual(["2", "4"]);
  });

  it("should handle multiple sources", () => {
    const result = checkParagraphAccessibility("5", multiSourceParagraph);
    expect(result.accessibleFrom).toHaveLength(2);
    expect(result.accessibleFrom).toContain("2");
    expect(result.accessibleFrom).toContain("4");
  });

  it("should determine if paragraph needs warning", () => {
    const result = checkParagraphAccessibility("4", restrictedParagraph);
    expect(result.needsWarning).toBe(true);
  });

  it("should not show warning for direct paragraphs", () => {
    const result = checkParagraphAccessibility("1", directParagraph);
    expect(result.needsWarning).toBe(false);
  });

  it("should return exists:false for undefined paragraph", () => {
    const result = checkParagraphAccessibility("999", undefined);
    expect(result.exists).toBe(false);
    expect(result.isAccessible).toBe(false);
    expect(result.errorMessage).toBeDefined();
  });
});
