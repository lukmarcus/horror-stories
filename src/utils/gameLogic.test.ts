import { describe, it, expect } from "vitest";
import {
  checkParagraphAccessibility,
} from "./gameLogic";
import type { Paragraph } from "../types";

describe("Game Logic - Accessibility", () => {
  const mockParagraph: Paragraph = {
    id: "1",
    text: "Test paragraph",
  };

  const nonDirectParagraph: Paragraph = {
    id: "2",
    text: "Non-direct paragraph",
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
});
