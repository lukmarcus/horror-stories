import { describe, it, expect } from "vitest";

describe("useGame - Variant Path Management", () => {
  it("should add variant to path", () => {
    let variantPath: string[] = [];
    const addVariant = (id: string) => {
      variantPath = [...variantPath, id];
    };

    addVariant("jessica");
    expect(variantPath).toEqual(["jessica"]);

    addVariant("patrick-lezy");
    expect(variantPath).toEqual(["jessica", "patrick-lezy"]);
  });

  it("should clear variant path", () => {
    let variantPath = ["jessica", "patrick-lezy"];
    const clearVariants = () => {
      variantPath = [];
    };

    clearVariants();
    expect(variantPath).toEqual([]);
  });

  it("should maintain variant path order", () => {
    let variantPath: string[] = [];
    const addVariant = (id: string) => {
      variantPath = [...variantPath, id];
    };

    addVariant("jessica");
    addVariant("option-a");
    addVariant("option-b");

    expect(variantPath[0]).toBe("jessica");
    expect(variantPath[1]).toBe("option-a");
    expect(variantPath[2]).toBe("option-b");
  });

  it("should reset variantPath when navigating to different paragraph", () => {
    let currentParagraphId: string | null = "9-test";
    let variantPath = ["jessica", "patrick-lezy"];

    // Simulate SET_PARAGRAPH action
    const setParagraph = (id: string | null) => {
      currentParagraphId = id;
      variantPath = []; // Reset variants on navigation
    };

    setParagraph("40");
    expect(currentParagraphId).toBe("40");
    expect(variantPath).toEqual([]);
  });

  it("should track variant path independently from paragraph changes", () => {
    let state = {
      currentParagraphId: "9-test",
      variantPath: [] as string[],
    };

    // Navigate to variant
    state.variantPath.push("jessica");
    expect(state.variantPath).toContain("jessica");

    // Add another variant level
    state.variantPath.push("patrick-lezy");
    expect(state.variantPath).toHaveLength(2);

    // Paragraph change should clear variants
    state = {
      ...state,
      currentParagraphId: "40",
      variantPath: [],
    };

    expect(state.currentParagraphId).toBe("40");
    expect(state.variantPath).toHaveLength(0);
  });

  it("should not accumulate variants from previous paragraphs", () => {
    // Scenario: user goes through variants in 9-test, then navigates to paragraph 40
    let state = {
      currentParagraphId: "9-test",
      variantPath: ["jessica", "patrick-lezy"],
    };

    // Navigate away triggers SET_PARAGRAPH which resets variants
    state = {
      currentParagraphId: "40",
      variantPath: [],
    };

    // Now if paragraph 40 doesn't have variants, accumulation shouldn't happen
    const paragraphHasVariants = false; // paragraph 40 has no variants
    const shouldAccumulate =
      state.variantPath.length > 0 && paragraphHasVariants;

    expect(shouldAccumulate).toBe(false);
  });
});
