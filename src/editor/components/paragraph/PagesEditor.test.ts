import { describe, expect, it } from "vitest";
import { pageToText, textToPage } from "./pageSerializer";
import type { ContentBlock } from "../../../types";

// ── textToPage ────────────────────────────────────────────────────────────────

describe("textToPage", () => {
  it("returns [] for empty string", () => {
    expect(textToPage("")).toEqual([]);
  });

  it("parses plain text line", () => {
    expect(textToPage("Hello")).toEqual([{ text: "Hello" }]);
  });

  it("parses multiple lines", () => {
    expect(textToPage("Line 1\nLine 2")).toEqual([
      { text: "Line 1" },
      { text: "Line 2" },
    ]);
  });

  it("preserves empty line as empty text block", () => {
    const result = textToPage("Before\n\nAfter");
    expect(result).toEqual([
      { text: "Before" },
      { text: "" },
      { text: "After" },
    ]);
  });

  it("parses bold prefix", () => {
    expect(textToPage("[b]Hello")).toEqual([{ text: "Hello", style: "bold" }]);
  });

  it("parses italic prefix", () => {
    expect(textToPage("[i]Hello")).toEqual([
      { text: "Hello", style: "italic" },
    ]);
  });

  it("parses underline prefix", () => {
    expect(textToPage("[u]Hello")).toEqual([
      { text: "Hello", style: "underline" },
    ]);
  });

  it("parses multiple styles as array", () => {
    expect(textToPage("[b][i]Hello")).toEqual([
      { text: "Hello", style: ["bold", "italic"] },
    ]);
  });

  it("parses all three styles as array", () => {
    expect(textToPage("[b][i][u]Hello")).toEqual([
      { text: "Hello", style: ["bold", "italic", "underline"] },
    ]);
  });

  it("parses color prefix", () => {
    expect(textToPage("[c:red]Hello")).toEqual([
      { text: "Hello", color: "red" },
    ]);
  });

  it("ignores unknown color", () => {
    expect(textToPage("[c:rainbow]Hello")).toEqual([{ text: "Hello" }]);
  });

  it("parses size prefix", () => {
    expect(textToPage("[s:lg]Hello")).toEqual([{ text: "Hello", size: "lg" }]);
  });

  it("ignores unknown size", () => {
    expect(textToPage("[s:huge]Hello")).toEqual([{ text: "Hello" }]);
  });

  it("parses all prefixes combined", () => {
    expect(textToPage("[b][i][u][c:yellow][s:xl]Hi")).toEqual([
      {
        text: "Hi",
        style: ["bold", "italic", "underline"],
        color: "yellow",
        size: "xl",
      },
    ]);
  });

  it("parses image block without size", () => {
    expect(textToPage("[img: path/to/img.png]")).toEqual([
      { image: "path/to/img.png" },
    ]);
  });

  it("parses image block with size", () => {
    expect(textToPage("[img: path/to/img.png xl]")).toEqual([
      { image: "path/to/img.png", size: "xl" },
    ]);
  });

  it("parses all valid image sizes", () => {
    const sizes = ["xs", "sm", "lg", "xl"] as const;
    sizes.forEach((size) => {
      expect(textToPage(`[img: icon.png ${size}]`)).toEqual([
        { image: "icon.png", size },
      ]);
    });
  });

  it("treats unclosed [img: as plain text", () => {
    // no closing ] — regex doesn't match, treated as plain text
    expect(textToPage("[img: icon.png")).toEqual([{ text: "[img: icon.png" }]);
  });

  it("parses [img:nospace] — regex allows zero spaces after colon", () => {
    expect(textToPage("[img:nospace]")).toEqual([{ image: "nospace" }]);
  });

  it("parses prefix with empty text content", () => {
    expect(textToPage("[b]")).toEqual([{ text: "", style: "bold" }]);
  });

  it("parses image and text on separate lines", () => {
    expect(textToPage("[img: icon.png]\nCaption")).toEqual([
      { image: "icon.png" },
      { text: "Caption" },
    ]);
  });
});

// ── pageToText ────────────────────────────────────────────────────────────────

describe("pageToText", () => {
  it("returns empty string for empty page", () => {
    expect(pageToText([])).toBe("");
  });

  it("serializes plain text block", () => {
    expect(pageToText([{ text: "Hello" }])).toBe("Hello");
  });

  it("serializes multiple blocks joined by newline", () => {
    expect(pageToText([{ text: "Line 1" }, { text: "Line 2" }])).toBe(
      "Line 1\nLine 2",
    );
  });

  it("serializes bold style", () => {
    expect(pageToText([{ text: "Hi", style: "bold" }])).toBe("[b]Hi");
  });

  it("serializes italic style", () => {
    expect(pageToText([{ text: "Hi", style: "italic" }])).toBe("[i]Hi");
  });

  it("serializes underline style", () => {
    expect(pageToText([{ text: "Hi", style: "underline" }])).toBe("[u]Hi");
  });

  it("serializes array of styles", () => {
    expect(pageToText([{ text: "Hi", style: ["bold", "italic"] }])).toBe(
      "[b][i]Hi",
    );
  });

  it("serializes array of all three styles", () => {
    expect(
      pageToText([{ text: "Hi", style: ["bold", "italic", "underline"] }]),
    ).toBe("[b][i][u]Hi");
  });

  it("serializes style + color + size combined", () => {
    expect(
      pageToText([
        {
          text: "Hi",
          style: ["bold", "italic"],
          color: "yellow",
          size: "xl",
        },
      ]),
    ).toBe("[b][i][c:yellow][s:xl]Hi");
  });

  it("serializes color", () => {
    expect(pageToText([{ text: "Hi", color: "green" }])).toBe("[c:green]Hi");
  });

  it("serializes size", () => {
    expect(pageToText([{ text: "Hi", size: "xs" }])).toBe("[s:xs]Hi");
  });

  it("serializes image without size", () => {
    expect(pageToText([{ image: "icon.png" }])).toBe("[img: icon.png]");
  });

  it("serializes image with size", () => {
    expect(pageToText([{ image: "icon.png", size: "sm" }])).toBe(
      "[img: icon.png sm]",
    );
  });
});

// ── Round-trip ────────────────────────────────────────────────────────────────

describe("textToPage → pageToText round-trip", () => {
  const cases = [
    "Hello",
    "[b]Bold",
    "[i]Italic",
    "[u]Underline",
    "[b][i]BoldItalic",
    "[b][i][u]All",
    "[c:red]Colored",
    "[s:lg]Large",
    "[b][c:yellow][s:xl]Complex",
    "[img: path/to/img.png]",
    "[img: path/to/img.png xl]",
    "Line 1\nLine 2\nLine 3",
    "[b]First\n[c:blue]Second\n[img: icon.png sm]",
  ];

  cases.forEach((input) => {
    it(`preserves: "${input.slice(0, 40)}"`, () => {
      expect(pageToText(textToPage(input))).toBe(input);
    });
  });

  it("normalizes prefix order (color before bold → bold before color)", () => {
    // textToPage is order-agnostic; pageToText always outputs b→i→u→c→s
    const page = textToPage("[c:red][b]Text");
    expect(page).toEqual([{ text: "Text", style: "bold", color: "red" }]);
    expect(pageToText(page)).toBe("[b][c:red]Text");
  });
});

describe("pageToText → textToPage round-trip", () => {
  const cases: ContentBlock[][] = [
    [{ text: "Hello" }],
    [{ text: "Hi", style: "bold" }],
    [{ text: "Hi", style: ["bold", "italic"] }],
    [{ text: "Hi", color: "purple" }],
    [{ text: "Hi", size: "sm" }],
    [
      {
        text: "Hi",
        style: ["bold", "underline"],
        color: "green",
        size: "lg",
      },
    ],
    [{ image: "img.png" }],
    [{ image: "img.png", size: "xl" }],
    [{ text: "Before" }, { image: "img.png" }, { text: "After" }],
  ];

  cases.forEach((blocks, i) => {
    it(`round-trips blocks[${i}]`, () => {
      expect(textToPage(pageToText(blocks))).toEqual(blocks);
    });
  });
});
