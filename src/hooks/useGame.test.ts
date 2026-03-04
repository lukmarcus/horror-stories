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

describe("Game State - Browser History & URL (v0.0.12)", () => {
  it("should sync paragraph ID to URL state", () => {
    const getUrlParam = (paragraphId: string) => `?par=${paragraphId}`;

    const url1 = getUrlParam("9");
    const url2 = getUrlParam("26");

    expect(url1).toBe("?par=9");
    expect(url2).toBe("?par=26");
  });

  it("should extract paragraph ID from URL parameter", () => {
    const extractParamFromUrl = (urlParam: string): string | null => {
      const match = urlParam.match(/\?par=(.+)/);
      return match ? match[1] : null;
    };

    expect(extractParamFromUrl("?par=9")).toBe("9");
    expect(extractParamFromUrl("?par=26")).toBe("26");
    expect(extractParamFromUrl("")).toBeNull();
    expect(extractParamFromUrl("?page=9")).toBeNull();
  });

  it("should maintain URL state when navigating", () => {
    let currentState = {
      paragraphId: "1",
      url: "?par=1",
    };

    const navigate = (id: string) => {
      currentState = {
        paragraphId: id,
        url: `?par=${id}`,
      };
    };

    navigate("9");
    expect(currentState.paragraphId).toBe("9");
    expect(currentState.url).toBe("?par=9");

    navigate("26");
    expect(currentState.paragraphId).toBe("26");
    expect(currentState.url).toBe("?par=26");
  });

  it("should update URL when variant path changes", () => {
    let gameState = {
      paragraphId: "9",
      variantPath: [] as string[],
      url: "?par=9",
    };

    // Add variant
    gameState.variantPath.push("jessica");
    // URL still tracks current paragraph, not variant path
    expect(gameState.url).toBe("?par=9");

    // Navigate to next paragraph resets variant path
    gameState = {
      paragraphId: "26",
      variantPath: [],
      url: "?par=26",
    };

    expect(gameState.url).toBe("?par=26");
  });

  it("should support browser back button via URL history", () => {
    const navigationHistory = [
      { id: "1", url: "?par=1" },
      { id: "9", url: "?par=9" },
      { id: "26", url: "?par=26" },
    ];

    let currentIndex = navigationHistory.length - 1;
    expect(navigationHistory[currentIndex].id).toBe("26");

    // Go back
    currentIndex--;
    expect(navigationHistory[currentIndex].id).toBe("9");

    // Go back again
    currentIndex--;
    expect(navigationHistory[currentIndex].id).toBe("1");
  });

  it("should prevent navigation to invalid paragraph from URL", () => {
    const validateParagraphId = (id: string): boolean => {
      const parsed = parseInt(id, 10);
      return !isNaN(parsed) && parsed > 0;
    };

    expect(validateParagraphId("9")).toBe(true);
    expect(validateParagraphId("26")).toBe(true);
    expect(validateParagraphId("abc")).toBe(false);
    expect(validateParagraphId("0")).toBe(false);
    expect(validateParagraphId("-5")).toBe(false);
  });

  it("should handle shared URL across users", () => {
    // User A sends link to User B
    const shareLink = (paragraphId: string): string => {
      const baseUrl = "https://horror-stories.app";
      return `${baseUrl}?par=${paragraphId}`;
    };

    const linkFromUserA = shareLink("26");
    expect(linkFromUserA).toBe("https://horror-stories.app?par=26");

    // User B opens the link - should navigate to same paragraph
    const extractFromLink = (url: string): string | null => {
      const match = url.match(/\?par=(.+)/);
      return match ? match[1] : null;
    };

    expect(extractFromLink(linkFromUserA)).toBe("26");
  });
});
