import { describe, it, expect } from "vitest";
import { parseParagraphText } from "./paragraphParser";
import type { ParsedSegment } from "./paragraphParser";

const tags = (segments: ParsedSegment[]) =>
  segments.filter((s) => s.type === "tag");
const texts = (segments: ParsedSegment[]) =>
  segments.filter((s) => s.type === "text");

describe("parseParagraphText", () => {
  describe("empty / no-tag input", () => {
    it("returns empty array for empty string", () => {
      expect(parseParagraphText("")).toEqual([]);
    });

    it("returns single text segment for plain text", () => {
      const result = parseParagraphText("Zwykły tekst bez tagów.");
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        type: "text",
        content: "Zwykły tekst bez tagów.",
      });
    });
  });

  describe("tag types", () => {
    it.each([
      ["item", "[item:XLIX]", "XLIX"],
      ["figure", "[figure:Patrick]", "Patrick"],
      ["board", "[board:14]", "14"],
      ["token", "[token:X]", "X"],
    ] as const)("parses %s tag", (tagType, raw, value) => {
      const result = parseParagraphText(raw);
      expect(tags(result)).toHaveLength(1);
      expect(tags(result)[0].tag).toMatchObject({
        type: tagType,
        value,
        fullTag: raw,
      });
    });
  });

  describe("mixed content", () => {
    it("splits text before and after a tag", () => {
      const result = parseParagraphText("Przed [item:XLIX] po.");
      expect(result).toHaveLength(3);
      expect(result[0]).toMatchObject({ type: "text", content: "Przed " });
      expect(result[1].tag?.type).toBe("item");
      expect(result[2]).toMatchObject({ type: "text", content: " po." });
    });

    it("handles tag at the start of string", () => {
      const result = parseParagraphText("[figure:Patrick] wchodzi.");
      expect(result[0].type).toBe("tag");
      expect(result[1]).toMatchObject({ type: "text", content: " wchodzi." });
    });

    it("handles tag at the end of string", () => {
      const result = parseParagraphText("Spójrz na [board:14]");
      expect(result[0]).toMatchObject({ type: "text", content: "Spójrz na " });
      expect(result[1].type).toBe("tag");
    });

    it("handles multiple tags in one string", () => {
      const result = parseParagraphText(
        "Znalazłeś [item:XLIX] na stole. [figure:Patrick] patrzy.",
      );
      expect(tags(result)).toHaveLength(2);
      expect(texts(result)).toHaveLength(3);
    });

    it("handles two adjacent tags (no text between them)", () => {
      const result = parseParagraphText("[item:A][token:B]");
      expect(tags(result)).toHaveLength(2);
      expect(texts(result)).toHaveLength(0);
    });
  });

  describe("tag structure", () => {
    it("exposes fullTag matching original text", () => {
      const result = parseParagraphText("[item:XLIX]");
      expect(result[0].tag?.fullTag).toBe("[item:XLIX]");
    });

    it("does not parse unknown tag types", () => {
      const result = parseParagraphText("[unknown:foo] tekst");
      expect(tags(result)).toHaveLength(0);
      expect(
        texts(result)
          .map((s) => s.content)
          .join(""),
      ).toBe("[unknown:foo] tekst");
    });
  });
});
