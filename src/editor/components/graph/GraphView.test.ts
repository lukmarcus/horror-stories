import { describe, it, expect } from "vitest";
import { buildDefinition } from "./graphDefinition";
import type { EditorParagraph } from "../../context/editorTypes";

const p = (
  id: string,
  overrides: Partial<EditorParagraph> = {},
): EditorParagraph => ({ id, ...overrides });

describe("buildDefinition", () => {
  it("returns fallback for empty paragraph list", () => {
    expect(buildDefinition([])).toBe('graph LR\n  empty["Brak paragrafów"]');
  });

  it("includes node declaration and click handler for each paragraph", () => {
    const result = buildDefinition([p("1")]);
    expect(result).toContain('p1["§1"]');
    expect(result).toContain("click p1 __hsGraphNavigate");
  });

  it("starts with 'graph LR'", () => {
    expect(buildDefinition([p("1")])).toMatch(/^graph LR\n/);
  });

  it("marks active paragraph with ► symbol", () => {
    const result = buildDefinition([p("1"), p("2")], "2");
    expect(result).toContain('p2["§2 ►"]');
    expect(result).toContain('p1["§1"]');
  });

  it("renders simple choice as solid arrow", () => {
    const result = buildDefinition([
      p("1", { choices: [{ id: "c1", text: "Go", nextParagraphId: "2" }] }),
      p("2"),
    ]);
    expect(result).toContain("p1 --> p2");
  });

  it("renders variant choice as dashed arrow", () => {
    const result = buildDefinition([
      p("1", {
        variants: {
          A: {
            pages: [],
            choices: [{ id: "vc1", text: "Escape", nextParagraphId: "3" }],
          },
        },
      }),
      p("3"),
    ]);
    expect(result).toContain("p1 -.-> p3");
  });

  it("solid and dashed arrows are distinct", () => {
    const result = buildDefinition([
      p("1", {
        choices: [{ id: "c1", text: "Simple", nextParagraphId: "2" }],
        variants: {
          A: {
            pages: [],
            choices: [{ id: "vc1", text: "Variant", nextParagraphId: "3" }],
          },
        },
      }),
      p("2"),
      p("3"),
    ]);
    expect(result).toContain("p1 --> p2");
    expect(result).toContain("p1 -.-> p3");
  });

  it("renders unknown target paragraph as '§id ?' node without click", () => {
    const result = buildDefinition([
      p("1", { choices: [{ id: "c1", text: "Go", nextParagraphId: "99" }] }),
    ]);
    expect(result).toContain('p99["§99 ?"]');
    expect(result).not.toContain("click p99");
  });

  it("deduplicates arrows from the same source to the same target", () => {
    const result = buildDefinition([
      p("1", {
        choices: [
          { id: "c1", text: "A", nextParagraphId: "2" },
          { id: "c2", text: "B", nextParagraphId: "2" },
        ],
      }),
      p("2"),
    ]);
    const arrowCount = (result.match(/p1 --> p2/g) ?? []).length;
    expect(arrowCount).toBe(1);
  });

  it("deduplicates across simple and variant choices to the same target", () => {
    const result = buildDefinition([
      p("1", {
        choices: [{ id: "c1", text: "Simple", nextParagraphId: "2" }],
        variants: {
          A: {
            pages: [],
            choices: [{ id: "vc1", text: "Variant", nextParagraphId: "2" }],
          },
        },
      }),
      p("2"),
    ]);
    // Simple choice adds -->, variant choice would add -.-> but target already seen
    const solidCount = (result.match(/p1 --> p2/g) ?? []).length;
    const dashedCount = (result.match(/p1 -.-> p2/g) ?? []).length;
    expect(solidCount + dashedCount).toBe(1);
  });

  it("ignores choices without nextParagraphId", () => {
    const result = buildDefinition([
      p("1", {
        choices: [{ id: "c1", text: "Back", nextParagraphId: "" }],
      }),
    ]);
    expect(result).not.toContain("-->");
    expect(result).not.toContain("-.->");
  });

  it("renders §100 as active when activeId is '100'", () => {
    const result = buildDefinition([p("100")], "100");
    expect(result).toContain('p100["§100 ►"]');
  });

  it("multiple paragraphs all have nodes and click handlers", () => {
    const result = buildDefinition([p("1"), p("2"), p("3")]);
    ["1", "2", "3"].forEach((id) => {
      expect(result).toContain(`p${id}["§${id}"]`);
      expect(result).toContain(`click p${id} __hsGraphNavigate`);
    });
  });
});
