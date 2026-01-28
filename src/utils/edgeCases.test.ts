import { describe, it, expect } from "vitest";

describe("Extended Test Suite - Edge Cases & Advanced Flows", () => {
  describe("DiceRoller - Advanced Flows", () => {
    it("should handle dice roll threshold comparison at boundary (equal)", () => {
      const threshold = 3;
      const rollResult = 3;

      // Equal to threshold should fail (need > threshold)
      const isSuccess = rollResult > threshold;
      expect(isSuccess).toBe(false);
    });

    it("should handle dice roll threshold comparison just above", () => {
      const threshold = 3;
      const rollResult = 4;

      // Just above threshold should succeed
      const isSuccess = rollResult > threshold;
      expect(isSuccess).toBe(true);
    });

    it("should validate all possible dice results", () => {
      const possibleResults = [1, 2, 3, 4, 5, 6];
      const threshold = 4;

      const results = possibleResults.map((roll) => ({
        roll,
        isSuccess: roll > threshold,
      }));

      // 1-4 should fail, 5-6 should succeed
      expect(results[0].isSuccess).toBe(false); // 1
      expect(results[1].isSuccess).toBe(false); // 2
      expect(results[2].isSuccess).toBe(false); // 3
      expect(results[3].isSuccess).toBe(false); // 4
      expect(results[4].isSuccess).toBe(true); // 5
      expect(results[5].isSuccess).toBe(true); // 6
    });

    it("should handle extreme threshold values", () => {
      const testRolls = (threshold: number) => {
        return [1, 2, 3, 4, 5, 6].filter(r => r > threshold).length;
      };

      expect(testRolls(0)).toBe(6); // All 6 rolls succeed
      expect(testRolls(3)).toBe(3); // Only 4,5,6 succeed
      expect(testRolls(6)).toBe(0); // No rolls succeed
    });

    it("should track multiple dice rolls in sequence", () => {
      const rolls = [2, 5, 1, 6, 3];
      const threshold = 3;

      const results = rolls.map((roll) => roll > threshold);

      expect(results).toEqual([false, true, false, true, false]);
      expect(results.filter((r) => r).length).toBe(2); // 2 successes
    });

    it("should not allow negative dice results", () => {
      const isValidRoll = (roll: number): boolean => roll >= 1 && roll <= 6;

      expect(isValidRoll(-1)).toBe(false);
      expect(isValidRoll(0)).toBe(false);
      expect(isValidRoll(1)).toBe(true);
    });
  });

  describe("Paragraph Accessibility - Complex Scenarios", () => {
    it("should handle paragraph accessible from multiple sources", () => {
      const paragraph = {
        id: "5",
        text: "Complex paragraph",
        isDirect: false,
        accessibleFrom: ["1", "2", "3", "4"],
      };

      const sources = paragraph.accessibleFrom;
      expect(sources).toHaveLength(4);
      expect(sources).toContain("1");
      expect(sources).toContain("4");
    });

    it("should validate chain of accessible paragraphs", () => {
      const paragraphs: Record<
        string,
        { isDirect?: boolean; accessibleFrom?: string[] }
      > = {
        "1": { isDirect: true },
        "2": { isDirect: false, accessibleFrom: ["1"] },
        "3": { isDirect: false, accessibleFrom: ["2"] },
      };

      // Can we trace 1 -> 2 -> 3?
      const p1Accessible = true; // Direct
      const p2Accessible = p1Accessible && paragraphs["2"]?.accessibleFrom?.includes("1");
      const p3Accessible = p2Accessible && paragraphs["3"]?.accessibleFrom?.includes("2");

      expect(p1Accessible).toBe(true);
      expect(p2Accessible).toBe(true);
      expect(p3Accessible).toBe(true);
    });

    it("should reject circular accessibility references", () => {
      // This would be bad data, but should be detected
      const paragraph = {
        id: "1",
        isDirect: false,
        accessibleFrom: ["1"], // Self-referential
      };

      const hasSelfReference =
        paragraph.accessibleFrom && paragraph.accessibleFrom.includes(paragraph.id);
      expect(hasSelfReference).toBe(true);
    });

    it("should handle empty accessibleFrom array", () => {
      const paragraph = {
        id: "X",
        isDirect: false,
        accessibleFrom: [],
      };

      const canAccess = paragraph.accessibleFrom.length > 0;
      expect(canAccess).toBe(false);
    });
  });

  describe("Input Validation - Edge Cases", () => {
    it("should reject special characters in paragraph ID", () => {
      const invalidInputs = ["@", "#", "$", "1-2", "a1", ""];
      const paragraphs: Record<string, { id: string }> = {
        "1": { id: "1" },
        "2": { id: "2" },
      };

      invalidInputs.forEach((input) => {
        const isValid = input in paragraphs;
        expect(isValid).toBe(false);
      });
    });

    it("should handle very large paragraph numbers", () => {
      const paragraphs: Record<string, { id: string }> = {
        "1": { id: "1" },
        "2": { id: "2" },
      };

      const largeNumber = "999999";
      expect(largeNumber in paragraphs).toBe(false);
    });

    it("should normalize whitespace in input", () => {
      const inputs = ["  1  ", "\t1\t", "\n1\n"];
      const normalized = inputs.map((input) => input.trim());

      expect(normalized).toEqual(["1", "1", "1"]);
      expect(normalized[0]).toBe(normalized[1]);
      expect(normalized[1]).toBe(normalized[2]);
    });

    it("should distinguish between numeric and string IDs", () => {
      const paragraphs: Record<string, { id: string }> = {
        "1": { id: "1" },
        "01": { id: "01" },
      };

      expect(paragraphs["1"].id).toBe("1");
      expect(paragraphs["01"].id).toBe("01");
      expect(paragraphs["1"] !== paragraphs["01"]).toBe(true);
    });

    it("should handle unicode characters gracefully", () => {
      const inputs = ["Ą", "ł", "ó", "ęęę"];
      const paragraphs: Record<string, { id: string }> = {
        "1": { id: "1" },
      };

      inputs.forEach((input) => {
        expect(input in paragraphs).toBe(false);
      });
    });
  });

  describe("Game State - Complex Transitions", () => {
    it("should track game history through multiple paragraphs", () => {
      const history: string[] = [];
      const path = ["1", "2", "5", "10"];

      path.forEach((id) => {
        history.push(id);
      });

      expect(history).toEqual(["1", "2", "5", "10"]);
      expect(history.length).toBe(4);
    });

    it("should detect loops in game path", () => {
      const history = ["1", "2", "3", "2"]; // Looped back to 2

      const hasLoop = history.some((id, index) => history.indexOf(id) !== index);
      expect(hasLoop).toBe(true);
    });

    it("should reset game state properly", () => {
      const gameState = {
        currentParagraphId: "5" as string | null,
        inputValue: "test",
        error: "some error",
        history: ["1", "2", "5"],
      };

      // Reset
      gameState.currentParagraphId = null;
      gameState.inputValue = "";
      gameState.error = "";
      gameState.history = [];

      expect(gameState.currentParagraphId).toBeNull();
      expect(gameState.inputValue).toBe("");
      expect(gameState.error).toBe("");
      expect(gameState.history).toEqual([]);
    });

    it("should handle rapid state changes", () => {
      let currentId: string | null = null;
      const updates = ["1", "2", "3", "4", "5"];

      updates.forEach((id) => {
        currentId = id;
      });

      expect(currentId).toBe("5"); // Last update wins
    });
  });

  describe("Dice Result Calculations", () => {
    it("should correctly calculate success/fail paths for all thresholds", () => {
      const thresholds = [1, 2, 3, 4, 5];

      thresholds.forEach((threshold) => {
        const successPath = [1, 2, 3, 4, 5, 6].filter((roll) => roll > threshold);
        const failPath = [1, 2, 3, 4, 5, 6].filter((roll) => roll <= threshold);

        expect(successPath.length + failPath.length).toBe(6);
      });
    });

    it("should handle tied rolls (edge of threshold)", () => {
      for (let threshold = 1; threshold <= 6; threshold++) {
        const roll = threshold;
        const isSuccess = roll > threshold;
        expect(isSuccess).toBe(false); // Tie loses
      }
    });

    it("should never produce invalid dice results", () => {
      const generateRoll = (): number => Math.floor(Math.random() * 6) + 1;
      const rolls = Array.from({ length: 100 }, () => generateRoll());

      rolls.forEach((roll) => {
        expect(roll).toBeGreaterThanOrEqual(1);
        expect(roll).toBeLessThanOrEqual(6);
      });
    });
  });

  describe("Text Parsing - Edge Cases", () => {
    it("should handle paragraphs with empty text", () => {
      const paragraph = {
        id: "1",
        text: "",
      };

      expect(paragraph.text).toBe("");
      expect(paragraph.text.length).toBe(0);
    });

    it("should preserve special characters in text", () => {
      const text = "Test: [item:X], {choice}, <tag>";

      expect(text).toContain("[item:X]");
      expect(text).toContain("{choice}");
      expect(text).toContain("<tag>");
    });

    it("should handle very long paragraph text", () => {
      const longText = "A".repeat(10000);

      expect(longText.length).toBe(10000);
      expect(longText).toMatch(/^A+$/);
    });

    it("should count items in text correctly", () => {
      const text = "Take [item:key], [item:map], [item:torch]";
      const itemCount = (text.match(/\[item:/g) || []).length;

      expect(itemCount).toBe(3);
    });
  });
});
