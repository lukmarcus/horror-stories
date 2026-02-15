import { describe, it, expect } from "vitest";

describe("Paragraph Accessibility", () => {
  it("should identify direct paragraphs (no accessibleFrom)", () => {
    const paragraph: {
      id: string;
      text: string;
      accessibleFrom?: string[];
    } = {
      id: "1",
      text: "Test",
    };

    // Direct paragraphs don't have accessibleFrom
    expect(paragraph.accessibleFrom).toBeUndefined();
  });

  it("should identify non-direct paragraphs (has accessibleFrom)", () => {
    const paragraph: {
      id: string;
      accessibleFrom?: string[];
      text: string;
    } = {
      id: "4",
      accessibleFrom: ["1"],
      text: "Test",
    };

    expect(paragraph.accessibleFrom).toBeDefined();
    expect(paragraph.accessibleFrom).toContain("1");
  });

  it("should list all sources for non-direct paragraph", () => {
    const paragraph: {
      id: string;
      accessibleFrom?: string[];
      text: string;
    } = {
      id: "9",
      accessibleFrom: ["7"],
      text: "Test",
    };

    expect(paragraph.accessibleFrom).toEqual(["7"]);
  });

  it("should handle multiple sources", () => {
    const paragraph: {
      id: string;
      accessibleFrom?: string[];
      text: string;
    } = {
      id: "5",
      accessibleFrom: ["2", "4"],
      text: "Test",
    };

    expect(paragraph.accessibleFrom).toHaveLength(2);
    expect(paragraph.accessibleFrom).toContain("2");
    expect(paragraph.accessibleFrom).toContain("4");
  });

  it("should determine if paragraph needs warning", () => {
    const paragraph: {
      id: string;
      accessibleFrom?: string[];
      text: string;
    } = {
      id: "4",
      accessibleFrom: ["1"],
      text: "Test",
    };

    const needsWarning =
      !!paragraph.accessibleFrom && paragraph.accessibleFrom.length > 0;
    expect(needsWarning).toBe(true);
  });

  it("should not show warning for direct paragraphs", () => {
    const paragraph: {
      id: string;
      text: string;
      accessibleFrom?: string[];
    } = {
      id: "1",
      text: "Test",
    };

    const needsWarning =
      !!paragraph.accessibleFrom && paragraph.accessibleFrom.length > 0;
    expect(needsWarning).toBe(false);
  });

  it("should validate accessibility data is consistent", () => {
    const paragraphs: Array<{
      id: string;
      accessibleFrom?: string[];
    }> = [
      { id: "1" },
      { id: "2" },
      { id: "3" },
      { id: "4", accessibleFrom: ["1"] },
      { id: "5", accessibleFrom: ["2", "4"] },
    ];

    // All paragraphs with accessibleFrom should have it defined
    const invalidParagraphs = paragraphs.filter(
      (p) => "accessibleFrom" in p && !p.accessibleFrom,
    );
    expect(invalidParagraphs).toHaveLength(0);
  });
});
