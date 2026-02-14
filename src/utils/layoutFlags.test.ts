import { describe, it, expect } from "vitest";
import type { Paragraph } from "../types";

describe("Layout Flags", () => {
  describe("isMultiPage flag", () => {
    it("should indicate paragraph has multiple pages", () => {
      const paragraph: Paragraph = {
        id: "30",
        text: "Setup page 1",
        isMultiPage: true,
        contentPages: [
          [{ type: "text", html: "Page 1 content" }],
          [{ type: "text", html: "Page 2 content" }],
          [{ type: "text", html: "Page 3 content" }],
        ],
      };

      expect(paragraph.isMultiPage).toBe(true);
      expect(paragraph.contentPages).toHaveLength(3);
    });

    it("should handle single page paragraphs without flag", () => {
      const paragraph: Paragraph = {
        id: "26",
        text: "Single page content",
        isMultiPage: false,
      };

      expect(paragraph.isMultiPage).toBe(false);
    });

    it("should default to false when not specified", () => {
      const paragraph: Paragraph = {
        id: "1",
        text: "Default paragraph",
      };

      expect(paragraph.isMultiPage).toBeUndefined();
    });
  });

  describe("areChoicesHorizontal flag", () => {
    it("should indicate horizontal button layout", () => {
      const paragraph: Paragraph = {
        id: "26",
        text: "Choose your character",
        areChoicesHorizontal: true,
        choices: [
          { id: "jessica", html: "Jessica", nextParagraphId: "26-jessica" },
          { id: "patrick", html: "Patrick", nextParagraphId: "26-patrick" },
        ],
      };

      expect(paragraph.areChoicesHorizontal).toBe(true);
      expect(paragraph.choices).toHaveLength(2);
    });

    it("should indicate vertical button layout", () => {
      const paragraph: Paragraph = {
        id: "9",
        text: "Choose action",
        areChoicesHorizontal: false,
        choices: [
          { id: "opt1", text: "Option 1", nextParagraphId: "10" },
          { id: "opt2", text: "Option 2", nextParagraphId: "11" },
          { id: "opt3", text: "Option 3", nextParagraphId: "12" },
        ],
      };

      expect(paragraph.areChoicesHorizontal).toBe(false);
      expect(paragraph.choices).toHaveLength(3);
    });
  });

  describe("Combined flags", () => {
    it("should support both flags on same paragraph", () => {
      const paragraph: Paragraph = {
        id: "30",
        text: "Multi-page with horizontal choices",
        isMultiPage: true,
        areChoicesHorizontal: true,
        contentPages: [
          [{ type: "text", html: "Page 1" }],
          [{ type: "text", html: "Page 2" }],
        ],
        choices: [
          { id: "continue", text: "Continue", nextParagraphId: "31" },
          { id: "back", text: "Back", nextParagraphId: "1" },
        ],
      };

      expect(paragraph.isMultiPage).toBe(true);
      expect(paragraph.areChoicesHorizontal).toBe(true);
    });
  });
});
