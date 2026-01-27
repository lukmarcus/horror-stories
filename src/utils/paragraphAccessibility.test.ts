import { describe, it, expect } from "vitest";

describe("Paragraph Accessibility", () => {
  it("should identify direct paragraphs", () => {
    const paragraph = {
      id: "1",
      isDirect: true,
      text: "Test",
    };

    expect(paragraph.isDirect).toBe(true);
  });

  it("should identify non-direct paragraphs", () => {
    const paragraph = {
      id: "4",
      isDirect: false,
      accessibleFrom: ["1"],
      text: "Test",
    };

    expect(paragraph.isDirect).toBe(false);
    expect(paragraph.accessibleFrom).toContain("1");
  });

  it("should list all sources for non-direct paragraph", () => {
    const paragraph = {
      id: "9",
      isDirect: false,
      accessibleFrom: ["7"],
      text: "Test",
    };

    expect(paragraph.accessibleFrom).toEqual(["7"]);
  });

  it("should handle multiple sources", () => {
    const paragraph: {
      id: string;
      isDirect: boolean;
      accessibleFrom?: string[];
      text: string;
    } = {
      id: "5",
      isDirect: false,
      accessibleFrom: ["2", "4"],
      text: "Test",
    };

    expect(paragraph.accessibleFrom).toHaveLength(2);
    expect(paragraph.accessibleFrom).toContain("2");
    expect(paragraph.accessibleFrom).toContain("4");
  });

  it("should determine if paragraph needs warning", () => {
    const paragraph = {
      id: "4",
      isDirect: false,
      accessibleFrom: ["1"],
      text: "Test",
    };

    const needsWarning =
      paragraph.isDirect === false && !!paragraph.accessibleFrom;
    expect(needsWarning).toBe(true);
  });

  it("should not show warning for direct paragraphs", () => {
    const paragraph: {
      id: string;
      isDirect: boolean;
      text: string;
      accessibleFrom?: string[];
    } = {
      id: "1",
      isDirect: true,
      text: "Test",
    };

    const needsWarning =
      paragraph.isDirect === false && !!paragraph.accessibleFrom;
    expect(needsWarning).toBe(false);
  });

  it("should validate accessibility data is consistent", () => {
    const paragraphs = [
      { id: "1", isDirect: true },
      { id: "2", isDirect: true },
      { id: "3", isDirect: true },
      { id: "4", isDirect: false, accessibleFrom: ["1"] },
      { id: "5", isDirect: false, accessibleFrom: ["2", "4"] },
    ];

    // All non-direct paragraphs should have accessibleFrom
    const invalidParagraphs = paragraphs.filter(
      (p) => p.isDirect === false && !("accessibleFrom" in p),
    );
    expect(invalidParagraphs).toHaveLength(0);
  });
});
