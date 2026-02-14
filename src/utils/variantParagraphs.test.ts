import { describe, it, expect } from "vitest";
import type { Paragraph } from "../types";

describe("Variant Paragraphs - Character Routes", () => {
  const hubParagraph: Paragraph = {
    id: "26",
    text: "Choose your character",
    areChoicesHorizontal: true,
    choices: [
      { id: "jessica", html: "Jessica (clever)", nextParagraphId: "26-jessica" },
      { id: "patrick", html: "Patrick (strong)", nextParagraphId: "26-patrick" },
    ],
  };

  const jessicaVariant: Paragraph = {
    id: "26-jessica",
    text: "Jessica takes control - using intelligence and wit",
    isDirect: false,
    accessibleFrom: ["26"],
  };

  const patrickVariant: Paragraph = {
    id: "26-patrick",
    text: "Patrick takes control - using brute force",
    isDirect: false,
    accessibleFrom: ["26"],
  };

  describe("Hub paragraph", () => {
    it("should present character choice", () => {
      expect(hubParagraph.choices).toHaveLength(2);
      expect(hubParagraph.areChoicesHorizontal).toBe(true);
    });

    it("should have both variant options", () => {
      const choices = hubParagraph.choices!;
      const jessicaOption = choices.find((c) => c.id === "jessica");
      const patrickOption = choices.find((c) => c.id === "patrick");

      expect(jessicaOption?.nextParagraphId).toBe("26-jessica");
      expect(patrickOption?.nextParagraphId).toBe("26-patrick");
    });
  });

  describe("Character variants", () => {
    it("should have separate paragraphs for each character", () => {
      expect(jessicaVariant.id).toBe("26-jessica");
      expect(patrickVariant.id).toBe("26-patrick");
    });

    it("should be non-direct (only accessible from hub)", () => {
      expect(jessicaVariant.isDirect).toBe(false);
      expect(jessicaVariant.accessibleFrom).toContain("26");

      expect(patrickVariant.isDirect).toBe(false);
      expect(patrickVariant.accessibleFrom).toContain("26");
    });

    it("should have distinct branching paths", () => {
      expect(jessicaVariant.text).toContain("intelligence");
      expect(patrickVariant.text).toContain("brute force");
    });
  });

  describe("Variant routing", () => {
    it("should load correct variant based on choice", () => {
      const jessicaChoice = hubParagraph.choices!.find((c) => c.id === "jessica")!;
      const patrickChoice = hubParagraph.choices!.find((c) => c.id === "patrick")!;

      const jessicaParagraph = jessicaChoice.nextParagraphId === "26-jessica" ? jessicaVariant : null;
      const patrickParagraph = patrickChoice.nextParagraphId === "26-patrick" ? patrickVariant : null;

      expect(jessicaParagraph).toBe(jessicaVariant);
      expect(patrickParagraph).toBe(patrickVariant);
    });
  });

  describe("Multiple variant locations", () => {
    it("should support variant paragraphs in different scenarios", () => {
      // Test that variants can be accessed from multiple sources
      const variant: Paragraph = {
        id: "9-jessica",
        text: "Jessica reacts",
        isDirect: false,
        accessibleFrom: ["1", "8"],
      };

      expect(variant.accessibleFrom).toHaveLength(2);
      expect(variant.accessibleFrom).toContain("1");
      expect(variant.accessibleFrom).toContain("8");
    });

    it("should handle remerging of variant paths", () => {
      // Both character variants should be able to lead to same paragraph
      const commonParagraph: Paragraph = {
        id: "27",
        text: "Both characters arrive here",
        isDirect: false,
        accessibleFrom: ["26-jessica", "26-patrick"],
      };

      expect(commonParagraph.accessibleFrom).toContain("26-jessica");
      expect(commonParagraph.accessibleFrom).toContain("26-patrick");
    });
  });
});
