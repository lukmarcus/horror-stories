import { describe, it, expect } from "vitest";
import { jumpToParagraph } from "./gameActions";
import type { Paragraph } from "../types";

const paragraphs: Record<string, Paragraph> = {
  "1": { id: "1", text: "Direct paragraph" },
  "4": { id: "4", text: "Restricted", accessibleFrom: ["1"] },
  "10": { id: "10", text: "Another direct" },
};

describe("jumpToParagraph", () => {
  it("should return valid:true for a direct paragraph", () => {
    const result = jumpToParagraph("1", paragraphs);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("should return error for empty input", () => {
    const result = jumpToParagraph("  ", paragraphs);
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("should return error for non-existent paragraph", () => {
    const result = jumpToParagraph("999", paragraphs);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("999");
  });

  it("should return needsWarning for restricted paragraph", () => {
    const result = jumpToParagraph("4", paragraphs);
    expect(result.valid).toBe(false);
    expect(result.needsWarning).toBe(true);
    expect(result.pendingId).toBe("4");
  });

  it("should trim whitespace from input", () => {
    const result = jumpToParagraph("  1  ", paragraphs);
    expect(result.valid).toBe(true);
  });
});
