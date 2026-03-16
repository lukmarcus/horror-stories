import { describe, it, expect } from "vitest";
import { parseParagraphText } from "./paragraphParser";

describe("paragraphParser", () => {
  it("should parse text with tags", () => {
    const text =
      "Znalazłeś [item:XLIX] na stole. [figure:Patrick] patrzy na Ciebie podejrzliwie.";
    const parsed = parseParagraphText(text);
    expect(parsed).toBeDefined();
    expect(parsed.length).toBeGreaterThan(0);
  });

  it("should handle text without tags", () => {
    const text = "Zwykły tekst bez żadnych tagów.";
    const parsed = parseParagraphText(text);
    expect(parsed).toBeDefined();
  });
});
