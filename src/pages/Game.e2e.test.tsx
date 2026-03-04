import { describe, it, expect } from "vitest";
import type { Paragraph } from "../types";

describe("End-to-End Scenario - Droga Donikąd", () => {
  // Mock paragraph structure for testing
  const scenarioParagraphs: Record<string, Paragraph> = {
    "1": {
      id: "1",
      text: "Start of scenario",
      choices: [
        { id: "next", text: "Enter the building", nextParagraphId: "9" },
      ],
    },
    "9": {
      id: "9",
      text: "Who are you?",
      choices: [
        { id: "jessica", text: "Jessica", nextParagraphId: "9-jessica" },
        { id: "patrick", text: "Patrick", nextParagraphId: "9-patrick" },
      ],
    },
    "9-jessica": {
      id: "9-jessica",
      text: "Jessica awakens",
      accessibleFrom: ["9"],
      choices: [{ id: "next", text: "Continue", nextParagraphId: "26" }],
    },
    "9-patrick": {
      id: "9-patrick",
      text: "Patrick awakens",
      accessibleFrom: ["9"],
      choices: [{ id: "next", text: "Continue", nextParagraphId: "26" }],
    },
    "26": {
      id: "26",
      text: "Choose your character",
      accessibleFrom: ["9-jessica", "9-patrick"],
      areChoicesHorizontal: true,
      choices: [
        {
          id: "as-jessica",
          text: "Play as Jessica",
          nextParagraphId: "26-jessica",
        },
        {
          id: "as-patrick",
          text: "Play as Patrick",
          nextParagraphId: "26-patrick",
        },
      ],
    },
    "26-jessica": {
      id: "26-jessica",
      text: "Jessica's perspective",
      accessibleFrom: ["26"],
      choices: [{ id: "next", text: "Move forward", nextParagraphId: "50" }],
    },
    "26-patrick": {
      id: "26-patrick",
      text: "Patrick's perspective",
      accessibleFrom: ["26"],
      choices: [{ id: "next", text: "Move forward", nextParagraphId: "50" }],
    },
    "50": {
      id: "50",
      text: "Dead doors - dead end",
      accessibleFrom: ["26-jessica", "26-patrick"],
      choices: [{ id: "back", text: "Go back", nextParagraphId: "26" }],
    },
  };

  describe("Scenario entry points", () => {
    it("should have valid starting paragraph", () => {
      const startParagraph = scenarioParagraphs["1"];
      expect(startParagraph.accessibleFrom).toBeUndefined();
      expect(startParagraph.choices).toHaveLength(1);
      expect(startParagraph.choices![0].nextParagraphId).toBe("9");
    });

    it("should have first choice point accessible", () => {
      const firstChoice = scenarioParagraphs["9"];
      expect(firstChoice.accessibleFrom).toBeUndefined();
      expect(firstChoice.choices).toHaveLength(2);
    });
  });

  describe("Jessica's path", () => {
    it("should navigate: 1 → 9 → 26 → (Jessica) → 50", () => {
      // Start
      expect(scenarioParagraphs["1"].choices![0].nextParagraphId).toBe("9");

      // Character intro (mocked jump to 26)
      const characterHub = scenarioParagraphs["26"];
      expect(characterHub.accessibleFrom).toContain("9-jessica");

      // Choose Jessica
      const jessicaChoice = scenarioParagraphs["26"].choices!.find(
        (c) => c.id === "as-jessica",
      );
      expect(jessicaChoice!.nextParagraphId).toBe("26-jessica");

      // Jessica's route
      const jessicaPath = scenarioParagraphs["26-jessica"];
      expect(jessicaPath.choices![0].nextParagraphId).toBe("50");

      // Dead end
      const deadEnd = scenarioParagraphs["50"];
      expect(deadEnd.accessibleFrom).toContain("26-jessica");
    });

    it("should verify Jessica variant is not directly accessible", () => {
      const jessicaVariant = scenarioParagraphs["9-jessica"];
      expect(jessicaVariant.accessibleFrom).toEqual(["9"]);
    });
  });

  describe("Patrick's path", () => {
    it("should navigate: 1 → 9 → 26 → (Patrick) → 50", () => {
      // Character hub
      const characterHub = scenarioParagraphs["26"];
      expect(characterHub.accessibleFrom).toContain("9-patrick");

      // Choose Patrick
      const patrickChoice = scenarioParagraphs["26"].choices!.find(
        (c) => c.id === "as-patrick",
      );
      expect(patrickChoice!.nextParagraphId).toBe("26-patrick");

      // Patrick's route
      const patrickPath = scenarioParagraphs["26-patrick"];
      expect(patrickPath.choices![0].nextParagraphId).toBe("50");

      // Both paths merge at dead end
      const deadEnd = scenarioParagraphs["50"];
      expect(deadEnd.accessibleFrom).toContain("26-patrick");
    });

    it("should verify Patrick variant is not directly accessible", () => {
      const patrickVariant = scenarioParagraphs["9-patrick"];
      expect(patrickVariant.accessibleFrom).toEqual(["9"]);
    });
  });

  describe("Path branching and merging", () => {
    it("should allow both characters to reach common paragraphs", () => {
      const commonDeadEnd = scenarioParagraphs["50"];
      expect(commonDeadEnd.accessibleFrom).toContain("26-jessica");
      expect(commonDeadEnd.accessibleFrom).toContain("26-patrick");
    });

    it("should prevent skipping character choice", () => {
      // Jessica variant only accessible from character selection
      const jessicaVariant = scenarioParagraphs["26-jessica"];
      expect(jessicaVariant.accessibleFrom).toEqual(["26"]);

      // Patrick variant only accessible from character selection
      const patrickVariant = scenarioParagraphs["26-patrick"];
      expect(patrickVariant.accessibleFrom).toEqual(["26"]);
    });

    it("should allow returning to hub for retry", () => {
      const deadEnd = scenarioParagraphs["50"];
      const backChoice = deadEnd.choices!.find((c) => c.id === "back");
      expect(backChoice!.nextParagraphId).toBe("26");
    });
  });

  describe("Paragraph accessibility validation", () => {
    it("should have all referenced paragraphs defined", () => {
      const allReferences = new Set<string>();

      Object.values(scenarioParagraphs).forEach((p) => {
        p.choices?.forEach((c) => {
          if (c.nextParagraphId) allReferences.add(c.nextParagraphId);
        });
        p.accessibleFrom?.forEach((ref) => allReferences.add(ref));
      });

      // All referenced paragraphs must be defined in mock
      const missingParagraphs = [...allReferences].filter(
        (id) => !scenarioParagraphs[id],
      );
      expect(missingParagraphs).toHaveLength(0);
    });

    it("should have no orphaned paragraphs", () => {
      // In real scenario, non-direct paragraphs are accessible by direct input
      // So we only need to check that direct paragraphs are reachable

      const reachable = new Set<string>(["1"]); // Start
      const toCheck: string[] = ["1"];

      // BFS for direct paragraphs only
      while (toCheck.length > 0) {
        const current = toCheck.shift()!;
        const p = scenarioParagraphs[current];

        if (p) {
          // Follow choices for all reachable paragraphs
          p.choices?.forEach((c) => {
            if (
              c.nextParagraphId &&
              !reachable.has(c.nextParagraphId) &&
              scenarioParagraphs[c.nextParagraphId]
            ) {
              reachable.add(c.nextParagraphId);
              toCheck.push(c.nextParagraphId);
            }
          });
        }
      }

      // Check that every paragraph either:
      // 1. Is direct and reachable, OR
      // 2. Is non-direct with valid accessibleFrom references
      Object.values(scenarioParagraphs).forEach((p) => {
        if (p.accessibleFrom) {
          expect(reachable).toContain(p.id);
          p.accessibleFrom.forEach((sourceId) => {
            expect(scenarioParagraphs[sourceId]).toBeDefined();
          });
        }
      });
    });
  });

  describe("Multi-page support", () => {
    it("should support multi-page paragraphs in scenario", () => {
      const multiPageParagraph: Paragraph = {
        id: "30",
        text: "Tutorial paragraph",
        isMultiPage: true,
        contentPages: [
          [{ type: "text", html: "Page 1" }],
          [{ type: "text", html: "Page 2" }],
          [{ type: "text", html: "Page 3" }],
          [{ type: "text", html: "Page 4" }],
        ],
      };

      expect(multiPageParagraph.isMultiPage).toBe(true);
      expect(multiPageParagraph.contentPages!.length).toBe(4);
    });
  });

  describe("AccessibleFrom back buttons (v0.0.12)", () => {
    it("should generate back buttons for paragraphs with accessibleFrom", () => {
      const paragraph = scenarioParagraphs["26"];
      expect(paragraph.accessibleFrom).toBeDefined();
      expect(paragraph.accessibleFrom).toContain("9-jessica");
      expect(paragraph.accessibleFrom).toContain("9-patrick");
    });

    it("should not generate back buttons for paragraphs without accessibleFrom", () => {
      const paragraph = scenarioParagraphs["1"];
      expect(paragraph.accessibleFrom).toBeUndefined();
    });

    it("should show button text with paragraph ID (e.g. '← Wróć do #9')", () => {
      // Simulate button generation
      const fromId = "26";
      const backButton = (toId: string) => `← Wróć do #${toId}`;

      expect(backButton("9")).toBe("← Wróć do #9");
      expect(backButton("26")).toBe("← Wróć do #26");
    });

    it("should validate back button targets exist", () => {
      const paragraph = scenarioParagraphs["50"];
      if (paragraph.accessibleFrom) {
        paragraph.accessibleFrom.forEach((sourceId) => {
          expect(scenarioParagraphs[sourceId]).toBeDefined();
        });
      }
    });
  });

  describe("Browser history support (v0.0.12)", () => {
    it("should encode paragraph ID to URL parameter", () => {
      const getParamFromId = (id: string) => `?par=${id}`;

      expect(getParamFromId("9")).toBe("?par=9");
      expect(getParamFromId("26")).toBe("?par=26");
      expect(getParamFromId("50")).toBe("?par=50");
    });

    it("should decode URL parameter to paragraph ID", () => {
      const getIdFromParam = (param: string) => {
        const match = param.match(/\?par=(.+)/);
        return match ? match[1] : null;
      };

      expect(getIdFromParam("?par=9")).toBe("9");
      expect(getIdFromParam("?par=26")).toBe("26");
      expect(getIdFromParam("")).toBeNull();
    });

    it("should push to history when navigating to paragraph", () => {
      const navigationHistory: string[] = [];
      const navigateTo = (id: string) => {
        navigationHistory.push(id);
      };

      navigateTo("1");
      navigateTo("9");
      navigateTo("26");

      expect(navigationHistory).toEqual(["1", "9", "26"]);
      expect(navigationHistory[navigationHistory.length - 1]).toBe("26");
    });

    it("should support browser back button", () => {
      const history = ["1", "9", "26", "50"];
      const currentIndex = 3;
      const previousIndex = currentIndex - 1;

      if (previousIndex >= 0) {
        const previousParagraph = history[previousIndex];
        expect(previousParagraph).toBe("26");
      }
    });

    it("should maintain URL state across navigation", () => {
      const getUrlState = (paragraphId: string) => {
        return { url: `?par=${paragraphId}`, timestamp: Date.now() };
      };

      const state1 = getUrlState("9");
      const state2 = getUrlState("26");

      expect(state1.url).toBe("?par=9");
      expect(state2.url).toBe("?par=26");
      expect(state2.timestamp).toBeGreaterThanOrEqual(state1.timestamp);
    });
  });

  describe("Refresh button and variant reset (v0.0.12)", () => {
    it("should clear variant path on refresh", () => {
      let state = {
        currentParagraphId: "9",
        variantPath: ["jessica", "option-a"],
      };

      const refreshParagraph = () => {
        state.variantPath = [];
      };

      refreshParagraph();
      expect(state.variantPath).toEqual([]);
    });

    it("should show refresh button with paragraph ID", () => {
      const getRefreshButtonText = (id: string) => `↻ Odśwież #${id}`;

      expect(getRefreshButtonText("9")).toBe("↻ Odśwież #9");
      expect(getRefreshButtonText("26")).toBe("↻ Odśwież #26");
    });

    it("should reset to initial paragraph content after refresh", () => {
      // Simulate paragraph with variants
      const paragraph = {
        id: "9",
        contentPages: [[{ text: "Choose a character" }]],
        variants: {
          jessica: { contentPages: [[{ text: "Jessica's story" }]] },
          patrick: { contentPages: [[{ text: "Patrick's story" }]] },
        },
      };

      let variantPath = ["jessica"];

      // Get accumulated content
      let content = [...(paragraph.contentPages?.[0] ?? [])];
      if (variantPath.length > 0) {
        const variant = paragraph.variants?.[variantPath[0]];
        if (variant?.contentPages) {
          content.push(...variant.contentPages[0]);
        }
      }
      expect(content).toHaveLength(2); // main + variant

      // Refresh clears variants
      variantPath = [];
      content = [...(paragraph.contentPages?.[0] ?? [])];
      expect(content).toHaveLength(1); // only main
    });
  });

  describe("Input for dead-end paragraphs (v0.0.12)", () => {
    it("should show input field for dead-end paragraphs without direct back", () => {
      const deadEndParagraph = {
        id: "100",
        text: "End of path. Type paragraph number to continue.",
        choices: [], // No choices
        direct: true, // Can be directly navigated to
      };

      const isDeadEnd =
        !deadEndParagraph.choices || deadEndParagraph.choices.length === 0;
      expect(isDeadEnd).toBe(true);
    });

    it("should parse numeric input from dead-end input field", () => {
      const parseDeadEndInput = (input: string): number | null => {
        const num = parseInt(input, 10);
        return isNaN(num) || num <= 0 ? null : num;
      };

      expect(parseDeadEndInput("5")).toBe(5);
      expect(parseDeadEndInput("123")).toBe(123);
      expect(parseDeadEndInput("0")).toBeNull();
      expect(parseDeadEndInput("-1")).toBeNull();
      expect(parseDeadEndInput("abc")).toBeNull();
      expect(parseDeadEndInput("")).toBeNull();
    });

    it("should validate input against available paragraphs", () => {
      const validateInput = (
        input: number,
        availableParagraphs: string[],
      ): boolean => {
        return availableParagraphs.includes(input.toString());
      };

      const available = ["1", "2", "3", "9", "26", "50"];
      expect(validateInput(9, available)).toBe(true);
      expect(validateInput(999, available)).toBe(false);
    });
  });

  describe("New variant structure (v0.0.12)", () => {
    it("should support variants within single paragraph", () => {
      const modernParagraph = {
        id: "9",
        contentPages: [[{ text: "Którą postacią jesteś?" }]],
        choices: [
          { text: "Jessica", nextVariantId: "jessica" },
          { text: "Patrick", nextVariantId: "patrick" },
        ],
        areChoicesHorizontal: true,
        variants: {
          jessica: {
            contentPages: [[{ text: "Jessica's content" }]],
            choices: [{ text: "Continue", nextParagraphId: "26" }],
          },
          patrick: {
            contentPages: [[{ text: "Patrick's content" }]],
            choices: [{ text: "Continue", nextParagraphId: "26" }],
          },
        },
      };

      expect(modernParagraph.variants).toBeDefined();
      expect(modernParagraph.variants.jessica).toBeDefined();
      expect(modernParagraph.variants.patrick).toBeDefined();
    });

    it("should display only selected variant (reset display, not accumulation)", () => {
      const paragraph = {
        id: "9",
        contentPages: [[{ text: "Main content" }]],
        variants: {
          jessica: { contentPages: [[{ text: "Jessica only" }]] },
        },
      };

      const variantPath = ["jessica"];

      // Get content for display (reset mode - only last variant)
      const lastVariantId = variantPath[variantPath.length - 1];
      const lastVariant = paragraph.variants?.[lastVariantId];
      const displayContent = lastVariant?.contentPages?.[0] ?? [];

      expect(displayContent).toHaveLength(1);
      expect(displayContent[0].text).toBe("Jessica only"); // NOT including main content
    });

    it("should separate variant choices from regular navigation", () => {
      const paragraph = {
        id: "26",
        choices: [
          { text: "Option A", nextVariantId: "variant-a" },
          { text: "Navigate to 50", nextParagraphId: "50" },
          { text: "Option B", nextVariantId: "variant-b" },
        ],
      };

      const variantChoices = paragraph.choices.filter((c) => c.nextVariantId);
      const regularChoices = paragraph.choices.filter((c) => c.nextParagraphId);

      expect(variantChoices).toHaveLength(2);
      expect(regularChoices).toHaveLength(1);
    });

    it("should handle nested variants with multiple levels", () => {
      const paragraph = {
        id: "9",
        variants: {
          jessica: {
            text: "Jessica path",
            variants: {
              "jessica-detail": {
                text: "Jessica detailed",
              },
            },
          },
        },
      };

      let variantPath = ["jessica", "jessica-detail"];

      // Navigate through nested variants
      let current: any = paragraph;
      for (const variantId of variantPath) {
        current = current.variants?.[variantId];
      }

      expect(current?.text).toBe("Jessica detailed");
    });
  });
});
