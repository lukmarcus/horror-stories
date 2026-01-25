import { describe, it, expect } from "vitest";
import {
  parseParagraphText,
  extractTags,
  extractTagsByType,
  formatTag,
} from "./paragraphParser";

describe("paragraphParser", () => {
  it("should parse text with tags", () => {
    const text =
      "Znalazłeś [item:XLIX] na stole. [figure:Patrick] patrzy na Ciebie podejrzliwie.";
    const parsed = parseParagraphText(text);
    expect(parsed).toBeDefined();
    expect(parsed.length).toBeGreaterThan(0);
  });

  it("should extract all tags from text", () => {
    const text =
      "Znalazłeś [item:XLIX] na stole. [figure:Patrick] patrzy na Ciebie.";
    const tags = extractTags(text);
    expect(tags).toHaveLength(2);
    expect(tags[0].type).toBe("item");
    expect(tags[1].type).toBe("figure");
  });

  it("should filter tags by type", () => {
    const text = "Znalazłeś [item:XLIX] i [item:LXII] na [board:14].";
    const itemTags = extractTagsByType(text, "item");
    const boardTags = extractTagsByType(text, "board");
    expect(itemTags).toHaveLength(2);
    expect(boardTags).toHaveLength(1);
  });

  it("should format tags correctly", () => {
    const tag = { type: "item" as const, value: "XLIX", fullTag: "[item:XLIX]" };
    const formatted = formatTag(tag);
    expect(formatted).toBeDefined();
  });

  it("should handle text without tags", () => {
    const text = "Zwykły tekst bez żadnych tagów.";
    const parsed = parseParagraphText(text);
    expect(parsed).toBeDefined();
    const tags = extractTags(text);
    expect(tags).toHaveLength(0);
  });

  it("should handle multiple tags of same type", () => {
    const text =
      "[item:I] [item:II] [item:III] zostały znalezione na [board:14]";
    const itemTags = extractTagsByType(text, "item");
    expect(itemTags).toHaveLength(3);
  });
});
