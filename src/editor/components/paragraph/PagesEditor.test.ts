import { describe, expect, it } from "vitest";
import { pageToText, textToPage } from "./PagesEditor";
import type { ContentBlock } from "../../../types";

// ── textToPage ────────────────────────────────────────────────────────────────

describe("textToPage", () => {
  it("returns [] for empty string", () => {
    expect(textToPage("")).toEqual([]);
  });

  it("parses plain text line", () => {
    expect(textToPage("Hello")).toEqual([{ type: "text", text: "Hello" }]);
  });

  it("parses multiple lines", () => {
    expect(textToPage("Line 1\nLine 2")).toEqual([
      { type: "text", text: "Line 1" },
      { type: "text", text: "Line 2" },
    ]);
  });

  it("preserves empty line as empty text block", () => {
    const result = textToPage("Before\n\nAfter");
    expect(result).toEqual([
      { type: "text", text: "Before" },
      { type: "text", text: "" },
      { type: "text", text: "After" },
    ]);
  });

  it("parses bold prefix", () => {
    expect(textToPage("[b]Hello")).toEqual([
      { type: "text", text: "Hello", style: "bold" },
    ]);
  });

  it("parses italic prefix", () => {
    expect(textToPage("[i]Hello")).toEqual([
      { type: "text", text: "Hello", style: "italic" },
    ]);
  });

  it("parses underline prefix", () => {
    expect(textToPage("[u]Hello")).toEqual([
      { type: "text", text: "Hello", style: "underline" },
    ]);
  });

  it("parses multiple styles as array", () => {
    expect(textToPage("[b][i]Hello")).toEqual([
      { type: "text", text: "Hello", style: ["bold", "italic"] },
    ]);
  });

  it("parses all three styles as array", () => {
    expect(textToPage("[b][i][u]Hello")).toEqual([
      { type: "text", text: "Hello", style: ["bold", "italic", "underline"] },
    ]);
  });

  it("parses color prefix", () => {
    expect(textToPage("[c:red]Hello")).toEqual([
      { type: "text", text: "Hello", color: "red" },
    ]);
  });

  it("ignores unknown color", () => {
    expect(textToPage("[c:rainbow]Hello")).toEqual([
      { type: "text", text: "Hello" },
    ]);
  });

  it("parses size prefix", () => {
    expect(textToPage("[s:lg]Hello")).toEqual([
      { type: "text", text: "Hello", size: "lg" },
    ]);
  });

  it("ignores unknown size", () => {
    expect(textToPage("[s:huge]Hello")).toEqual([
      { type: "text", text: "Hello" },
    ]);
  });

  it("parses all prefixes combined", () => {
    expect(textToPage("[b][i][u][c:yellow][s:xl]Hi")).toEqual([
      {
        type: "text",
        text: "Hi",
        style: ["bold", "italic", "underline"],
        color: "yellow",
        size: "xl",
      },
    ]);
  });

  it("parses image block without size", () => {
    expect(textToPage("[img: path/to/img.png]")).toEqual([
      { type: "image", image: "path/to/img.png" },
    ]);
  });

  it("parses image block with size", () => {
    expect(textToPage("[img: path/to/img.png xl]")).toEqual([
      { type: "image", image: "path/to/img.png", size: "xl" },
    ]);
  });

  it("parses all valid image sizes", () => {
    const sizes = ["xs", "sm", "lg", "xl"] as const;
    sizes.forEach((size) => {
      expect(textToPage(`[img: icon.png ${size}]`)).toEqual([
        { type: "image", image: "icon.png", size },
      ]);
    });
  });

  it("treats unclosed [img: as plain text", () => {
    // no closing ] — regex doesn't match, treated as plain text
    expect(textToPage("[img: icon.png")).toEqual([
      { type: "text", text: "[img: icon.png" },
    ]);
  });

  it("parses [img:nospace] — regex allows zero spaces after colon", () => {
    expect(textToPage("[img:nospace]")).toEqual([
      { type: "image", image: "nospace" },
    ]);
  });

  it("parses prefix with empty text content", () => {
    expect(textToPage("[b]")).toEqual([
      { type: "text", text: "", style: "bold" },
    ]);
  });

  it("parses image and text on separate lines", () => {
    expect(textToPage("[img: icon.png]\nCaption")).toEqual([
      { type: "image", image: "icon.png" },
      { type: "text", text: "Caption" },
    ]);
  });
});

// ── pageToText ────────────────────────────────────────────────────────────────

describe("pageToText", () => {
  it("returns empty string for empty page", () => {
    expect(pageToText([])).toBe("");
  });

  it("serializes plain text block", () => {
    expect(pageToText([{ type: "text", text: "Hello" }])).toBe("Hello");
  });

  it("serializes multiple blocks joined by newline", () => {
    expect(
      pageToText([
        { type: "text", text: "Line 1" },
        { type: "text", text: "Line 2" },
      ]),
    ).toBe("Line 1\nLine 2");
  });

  it("serializes bold style", () => {
    expect(pageToText([{ type: "text", text: "Hi", style: "bold" }])).toBe(
      "[b]Hi",
    );
  });

  it("serializes italic style", () => {
    expect(pageToText([{ type: "text", text: "Hi", style: "italic" }])).toBe(
      "[i]Hi",
    );
  });

  it("serializes underline style", () => {
    expect(pageToText([{ type: "text", text: "Hi", style: "underline" }])).toBe(
      "[u]Hi",
    );
  });

  it("serializes array of styles", () => {
    expect(
      pageToText([{ type: "text", text: "Hi", style: ["bold", "italic"] }]),
    ).toBe("[b][i]Hi");
  });

  it("serializes array of all three styles", () => {
    expect(
      pageToText([
        { type: "text", text: "Hi", style: ["bold", "italic", "underline"] },
      ]),
    ).toBe("[b][i][u]Hi");
  });

  it("serializes style + color + size combined", () => {
    expect(
      pageToText([
        {
          type: "text",
          text: "Hi",
          style: ["bold", "italic"],
          color: "yellow",
          size: "xl",
        },
      ]),
    ).toBe("[b][i][c:yellow][s:xl]Hi");
  });

  it("serializes color", () => {
    expect(pageToText([{ type: "text", text: "Hi", color: "green" }])).toBe(
      "[c:green]Hi",
    );
  });

  it("serializes size", () => {
    expect(pageToText([{ type: "text", text: "Hi", size: "xs" }])).toBe(
      "[s:xs]Hi",
    );
  });

  it("serializes image without size", () => {
    expect(pageToText([{ type: "image", image: "icon.png" }])).toBe(
      "[img: icon.png]",
    );
  });

  it("serializes image with size", () => {
    expect(pageToText([{ type: "image", image: "icon.png", size: "sm" }])).toBe(
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
    expect(page).toEqual([
      { type: "text", text: "Text", style: "bold", color: "red" },
    ]);
    expect(pageToText(page)).toBe("[b][c:red]Text");
  });
});

describe("pageToText → textToPage round-trip", () => {
  const cases: ContentBlock[][] = [
    [{ type: "text", text: "Hello" }],
    [{ type: "text", text: "Hi", style: "bold" }],
    [{ type: "text", text: "Hi", style: ["bold", "italic"] }],
    [{ type: "text", text: "Hi", color: "purple" }],
    [{ type: "text", text: "Hi", size: "sm" }],
    [
      {
        type: "text",
        text: "Hi",
        style: ["bold", "underline"],
        color: "green",
        size: "lg",
      },
    ],
    [{ type: "image", image: "img.png" }],
    [{ type: "image", image: "img.png", size: "xl" }],
    [
      { type: "text", text: "Before" },
      { type: "image", image: "img.png" },
      { type: "text", text: "After" },
    ],
  ];

  cases.forEach((blocks, i) => {
    it(`round-trips blocks[${i}]`, () => {
      expect(textToPage(pageToText(blocks))).toEqual(blocks);
    });
  });
});
