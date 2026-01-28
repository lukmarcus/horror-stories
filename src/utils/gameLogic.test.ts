import { describe, it, expect } from "vitest";
import {
  checkParagraphAccessibility,
  getAccessibleSources,
  validateParagraphId,
} from "./gameLogic";
import type { Paragraph } from "../types";

describe("Game Logic - Accessibility", () => {
  const mockParagraph: Paragraph = {
    id: "1",
    text: "Test paragraph",
    isDirect: true,
  };

  const nonDirectParagraph: Paragraph = {
    id: "2",
    text: "Non-direct paragraph",
    isDirect: false,
    accessibleFrom: ["1", "3"],
  };

  describe("checkParagraphAccessibility", () => {
    it("should return not exists when paragraph is undefined", () => {
      const result = checkParagraphAccessibility("999", undefined);
      expect(result.exists).toBe(false);
      expect(result.isAccessible).toBe(false);
      expect(result.errorMessage).toContain("nie istnieje");
    });

    it("should return accessible for direct paragraphs", () => {
      const result = checkParagraphAccessibility("1", mockParagraph);
      expect(result.exists).toBe(true);
      expect(result.isAccessible).toBe(true);
      expect(result.needsWarning).toBe(false);
    });

    it("should return needs warning for non-direct paragraphs", () => {
      const result = checkParagraphAccessibility("2", nonDirectParagraph);
      expect(result.exists).toBe(true);
      expect(result.isAccessible).toBe(false);
      expect(result.needsWarning).toBe(true);
      expect(result.accessibleFrom).toEqual(["1", "3"]);
    });
  });

  describe("getAccessibleSources", () => {
    it("should return empty array for paragraphs without accessibleFrom", () => {
      const sources = getAccessibleSources(mockParagraph);
      expect(sources).toEqual([]);
    });

    it("should return all accessible sources", () => {
      const sources = getAccessibleSources(nonDirectParagraph);
      expect(sources).toEqual(["1", "3"]);
    });
  });

  describe("validateParagraphId", () => {
    const paragraphs: Record<string, Paragraph> = {
      "1": mockParagraph,
      "2": nonDirectParagraph,
    };

    it("should reject empty input", () => {
      const result = validateParagraphId("", paragraphs);
      expect(result.valid).toBe(false);
      expect(result.errorMessage).toContain("Wpisz");
    });

    it("should reject whitespace-only input", () => {
      const result = validateParagraphId("   ", paragraphs);
      expect(result.valid).toBe(false);
    });

    it("should reject non-existent paragraph", () => {
      const result = validateParagraphId("999", paragraphs);
      expect(result.valid).toBe(false);
      expect(result.errorMessage).toContain("nie istnieje");
    });

    it("should accept valid paragraph ID", () => {
      const result = validateParagraphId("1", paragraphs);
      expect(result.valid).toBe(true);
      expect(result.errorMessage).toBeUndefined();
    });

    it("should trim whitespace from input", () => {
      const result = validateParagraphId("  2  ", paragraphs);
      expect(result.valid).toBe(true);
    });
  });
});
