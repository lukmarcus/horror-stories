import { describe, it, expect } from "vitest";
import { buildAccessibleFrom } from "./zipHandler";
import type { EditorParagraph } from "../context/editorTypes";

describe("buildAccessibleFrom", () => {
  it("returns empty map for empty paragraph list", () => {
    expect(buildAccessibleFrom([])).toEqual({});
  });

  it("returns empty map when no paragraph has choices", () => {
    const paragraphs: EditorParagraph[] = [
      { id: "1" },
      { id: "2", choices: [] },
    ];
    expect(buildAccessibleFrom(paragraphs)).toEqual({});
  });

  it("ignores choices with no nextParagraphId", () => {
    const paragraphs: EditorParagraph[] = [
      {
        id: "1",
        choices: [{ id: "c1", text: "Back", nextParagraphId: "" }],
      },
    ];
    expect(buildAccessibleFrom(paragraphs)).toEqual({});
  });

  it("maps single choice target", () => {
    const paragraphs: EditorParagraph[] = [
      {
        id: "1",
        choices: [{ id: "c1", text: "Go", nextParagraphId: "2" }],
      },
    ];
    expect(buildAccessibleFrom(paragraphs)).toEqual({ "2": ["1"] });
  });

  it("maps multiple choices from the same paragraph", () => {
    const paragraphs: EditorParagraph[] = [
      {
        id: "1",
        choices: [
          { id: "c1", text: "Go A", nextParagraphId: "2" },
          { id: "c2", text: "Go B", nextParagraphId: "3" },
        ],
      },
    ];
    expect(buildAccessibleFrom(paragraphs)).toEqual({
      "2": ["1"],
      "3": ["1"],
    });
  });

  it("aggregates multiple paragraphs pointing to the same target", () => {
    const paragraphs: EditorParagraph[] = [
      {
        id: "1",
        choices: [{ id: "c1", text: "Go", nextParagraphId: "3" }],
      },
      {
        id: "2",
        choices: [{ id: "c2", text: "Go", nextParagraphId: "3" }],
      },
    ];
    const result = buildAccessibleFrom(paragraphs);
    expect(result["3"]).toHaveLength(2);
    expect(result["3"]).toContain("1");
    expect(result["3"]).toContain("2");
  });

  it("does not add duplicate source for the same paragraph → target pair", () => {
    const paragraphs: EditorParagraph[] = [
      {
        id: "1",
        choices: [
          { id: "c1", text: "Go", nextParagraphId: "2" },
          { id: "c2", text: "Also go", nextParagraphId: "2" },
        ],
      },
    ];
    const result = buildAccessibleFrom(paragraphs);
    expect(result["2"]).toEqual(["1"]);
  });

  it("maps variant choices to their target paragraphs", () => {
    const paragraphs: EditorParagraph[] = [
      {
        id: "1",
        variants: {
          A: {
            pages: [],
            choices: [{ id: "vc1", text: "From A", nextParagraphId: "5" }],
          },
        },
        variantSelectors: [{ id: "s1", text: "A", nextVariantId: "A" }],
      },
    ];
    expect(buildAccessibleFrom(paragraphs)).toEqual({ "5": ["1"] });
  });

  it("maps choices from multiple variants within one paragraph", () => {
    const paragraphs: EditorParagraph[] = [
      {
        id: "2",
        variants: {
          A: {
            pages: [],
            choices: [{ id: "vc1", text: "From A", nextParagraphId: "10" }],
          },
          B: {
            pages: [],
            choices: [{ id: "vc2", text: "From B", nextParagraphId: "20" }],
          },
        },
      },
    ];
    expect(buildAccessibleFrom(paragraphs)).toEqual({
      "10": ["2"],
      "20": ["2"],
    });
  });

  it("does not duplicate source from both simple and variant choices to the same target", () => {
    const paragraphs: EditorParagraph[] = [
      {
        id: "1",
        choices: [{ id: "c1", text: "Go", nextParagraphId: "9" }],
        variants: {
          A: {
            pages: [],
            choices: [{ id: "vc1", text: "Also go", nextParagraphId: "9" }],
          },
        },
      },
    ];
    const result = buildAccessibleFrom(paragraphs);
    expect(result["9"]).toEqual(["1"]);
  });

  it("ignores variantSelectors (they link to variant keys, not paragraphs)", () => {
    const paragraphs: EditorParagraph[] = [
      {
        id: "1",
        variantSelectors: [{ id: "s1", text: "Choice A", nextVariantId: "A" }],
        variants: { A: { pages: [], choices: [] } },
      },
    ];
    expect(buildAccessibleFrom(paragraphs)).toEqual({});
  });

  it("handles mixed simple and variant paragraphs", () => {
    const paragraphs: EditorParagraph[] = [
      {
        id: "1",
        choices: [{ id: "c1", text: "Go", nextParagraphId: "3" }],
      },
      {
        id: "2",
        variants: {
          X: {
            pages: [],
            choices: [{ id: "vc1", text: "Escape", nextParagraphId: "3" }],
          },
        },
      },
    ];
    const result = buildAccessibleFrom(paragraphs);
    expect(result["3"]).toHaveLength(2);
    expect(result["3"]).toContain("1");
    expect(result["3"]).toContain("2");
  });
});
