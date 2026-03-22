import { describe, it, expect } from "vitest";
import { createParagraphMap } from "./index";
import type { Paragraph } from "../types";

describe("createParagraphMap", () => {
  it("should create a map with paragraph id as key", () => {
    const paragraphs: Paragraph[] = [{ id: "1", text: "First" }];
    const map = createParagraphMap(paragraphs);
    expect(map["1"]).toBeDefined();
    expect(map["1"].text).toBe("First");
  });

  it("should expand array id into multiple entries", () => {
    const paragraphs: Paragraph[] = [
      {
        id: ["3", "15", "52"],
        text: "Shared paragraph",
      } as unknown as Paragraph,
    ];
    const map = createParagraphMap(paragraphs);
    expect(map["3"]).toBeDefined();
    expect(map["15"]).toBeDefined();
    expect(map["52"]).toBeDefined();
    expect(map["3"].text).toBe("Shared paragraph");
  });

  it("should add spacing:none to last content block when not set", () => {
    const paragraphs: Paragraph[] = [
      {
        id: "1",
        text: "test",
        content: [
          { type: "text", html: "Block 1" },
          { type: "text", html: "Block 2" },
        ],
      },
    ];
    const map = createParagraphMap(paragraphs);
    const lastBlock = map["1"].content![map["1"].content!.length - 1];
    expect(lastBlock.spacing).toBe("none");
  });

  it("should not overwrite existing spacing on last content block", () => {
    const paragraphs: Paragraph[] = [
      {
        id: "1",
        text: "test",
        content: [{ type: "text", html: "Block 1", spacing: "lg" }],
      },
    ];
    const map = createParagraphMap(paragraphs);
    const lastBlock = map["1"].content![0];
    expect(lastBlock.spacing).toBe("lg");
  });

  it("should add spacing:none to last block of last page in contentPages", () => {
    const paragraphs: Paragraph[] = [
      {
        id: "1",
        text: "test",
        contentPages: [
          [{ type: "text", html: "Page 1" }],
          [
            { type: "text", html: "Page 2 block 1" },
            { type: "text", html: "Page 2 block 2" },
          ],
        ],
      },
    ];
    const map = createParagraphMap(paragraphs);
    const lastPage = map["1"].contentPages![1];
    const lastBlock = lastPage[lastPage.length - 1];
    expect(lastBlock.spacing).toBe("none");
    // First page should remain untouched
    expect(map["1"].contentPages![0][0].spacing).toBeUndefined();
  });

  it("should not mutate original paragraphs array", () => {
    const original: Paragraph[] = [
      { id: "1", text: "test", content: [{ type: "text", html: "Block" }] },
    ];
    const originalSpacing = original[0].content![0].spacing;
    createParagraphMap(original);
    expect(original[0].content![0].spacing).toBe(originalSpacing);
  });
});
