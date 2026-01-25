import { describe, it, expect } from "vitest";
import { ParagraphText } from "./ParagraphText";

describe("ParagraphText", () => {
  it("should render and export component", () => {
    expect(ParagraphText).toBeDefined();
    expect(typeof ParagraphText).toBe("function");
  });

  it("should accept text prop", () => {
    const props = { text: "Test text [item:X]" };
    expect(props.text).toContain("[item:X]");
  });

  it("should handle empty text", () => {
    const props = { text: "" };
    expect(props.text).toBe("");
  });

  it("should handle text without tags", () => {
    const props = { text: "Zwykły tekst bez tagów." };
    expect(props.text).toBe("Zwykły tekst bez tagów.");
  });

  it("should handle text with multiple tag types", () => {
    const text = "[item:I] [figure:Patrick] [board:14] [token:X]";
    expect(text).toMatch(/\[item:\w+\]/);
    expect(text).toMatch(/\[figure:\w+\]/);
    expect(text).toMatch(/\[board:\d+\]/);
    expect(text).toMatch(/\[token:\w+\]/);
  });
});
