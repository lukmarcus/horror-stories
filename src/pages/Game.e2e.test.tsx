import { describe, it, expect } from "vitest";
import type { Paragraph } from "../types";

describe("End-to-End Scenario - Droga Donikąd", () => {
  // Mock paragraph structure for testing
  const scenarioParagraphs: Record<string, Paragraph> = {
    "1": {
      id: "1",
      text: "Start of scenario",
      isDirect: true,
      choices: [
        { id: "next", text: "Enter the building", nextParagraphId: "105" },
      ],
    },
    "9": {
      id: "9",
      text: "Who are you?",
      isDirect: false,
      accessibleFrom: ["26"],
      choices: [
        { id: "jessica", text: "Jessica", nextParagraphId: "9-jessica" },
        { id: "patrick", text: "Patrick", nextParagraphId: "9-patrick" },
      ],
    },
    "9-jessica": {
      id: "9-jessica",
      text: "Jessica awakens",
      isDirect: false,
      accessibleFrom: ["9"],
      choices: [{ id: "next", text: "Continue", nextParagraphId: "26" }],
    },
    "9-patrick": {
      id: "9-patrick",
      text: "Patrick awakens",
      isDirect: false,
      accessibleFrom: ["9"],
      choices: [{ id: "next", text: "Continue", nextParagraphId: "26" }],
    },
    "26": {
      id: "26",
      text: "Choose your character",
      isDirect: false,
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
      isDirect: false,
      accessibleFrom: ["26"],
      choices: [{ id: "next", text: "Move forward", nextParagraphId: "50" }],
    },
    "26-patrick": {
      id: "26-patrick",
      text: "Patrick's perspective",
      isDirect: false,
      accessibleFrom: ["26"],
      choices: [{ id: "next", text: "Move forward", nextParagraphId: "50" }],
    },
    "50": {
      id: "50",
      text: "Dead doors - dead end",
      isDirect: false,
      accessibleFrom: ["26-jessica", "26-patrick"],
      choices: [{ id: "back", text: "Go back", nextParagraphId: "26" }],
    },
  };

  describe("Scenario entry points", () => {
    it("should have valid starting paragraph", () => {
      const startParagraph = scenarioParagraphs["1"];
      expect(startParagraph.isDirect).toBe(true);
      expect(startParagraph.choices).toHaveLength(1);
      expect(startParagraph.choices![0].nextParagraphId).toBe("105");
    });

    it("should have first choice point accessible", () => {
      const firstChoice = scenarioParagraphs["9"];
      expect(firstChoice.isDirect).toBe(false);
      expect(firstChoice.choices).toHaveLength(2);
    });
  });

  describe("Jessica's path", () => {
    it("should navigate: 1 → 105 → ... → 26 → (Jessica) → 50", () => {
      // Start
      expect(scenarioParagraphs["1"].choices![0].nextParagraphId).toBe("105");

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
      expect(jessicaVariant.isDirect).toBe(false);
      expect(jessicaVariant.accessibleFrom).toEqual(["9"]);
    });
  });

  describe("Patrick's path", () => {
    it("should navigate: 1 → 105 → ... → 26 → (Patrick) → 50", () => {
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
      expect(patrickVariant.isDirect).toBe(false);
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

      // Note: 105 is not in mock data (simplified scenario)
      const missingParagraphs = [...allReferences].filter(
        (id) => !scenarioParagraphs[id] && id !== "105",
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

        if (p && p.isDirect !== false) {
          // Only follow choices for direct paragraphs
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
        if (p.isDirect !== false) {
          expect(reachable).toContain(p.id);
        } else {
          // Non-direct paragraphs should have accessibleFrom
          expect(p.accessibleFrom).toBeDefined();
          if (p.accessibleFrom) {
            p.accessibleFrom.forEach((sourceId) => {
              expect(scenarioParagraphs[sourceId]).toBeDefined();
            });
          }
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
});
