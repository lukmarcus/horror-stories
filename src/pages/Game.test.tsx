import { describe, it, expect } from "vitest";

describe("Game - Paragraph Logic", () => {
  // Mock data matching Game.tsx
  const paragraphs = {
    "1": {
      id: "1",
      text: "Jesteś w hali głównej biblioteki.",
      choices: [
        { id: "1-1", text: "Przejdź do paragrafu 2", nextParagraphId: "2" },
        { id: "1-2", text: "Przejdź do paragrafu 3", nextParagraphId: "3" },
      ],
    },
    "2": {
      id: "2",
      text: "Znalazłeś stół z książkami.",
      choices: [
        { id: "2-1", text: "Przejdź do paragrafu 4", nextParagraphId: "4" },
      ],
    },
    "3": {
      id: "3",
      text: "Przeszukujesz regały.",
      choices: [],
    },
    "4": {
      id: "4",
      text: "Odkrywasz ukryty przejście.",
      choices: [
        { id: "4-1", text: "Przejdź do paragrafu 5", nextParagraphId: "5" },
      ],
    },
    "5": {
      id: "5",
      text: "To jest punkt końcowy.",
      choices: [],
    },
    "6": {
      id: "6",
      text: "Inny punkt końcowy.",
      choices: [],
    },
  };

  it("should validate paragraph number existence", () => {
    const isValidParagraph = (id: string): boolean => {
      return id in paragraphs;
    };

    expect(isValidParagraph("1")).toBe(true);
    expect(isValidParagraph("5")).toBe(true);
    expect(isValidParagraph("999")).toBe(false);
    expect(isValidParagraph("0")).toBe(false);
  });

  it("should retrieve paragraph by ID", () => {
    const getParagraph = (id: string) => {
      return paragraphs[id as keyof typeof paragraphs] || null;
    };

    const para1 = getParagraph("1");
    expect(para1?.text).toContain("hali głównej");
    expect(para1?.choices).toHaveLength(2);

    const para999 = getParagraph("999");
    expect(para999).toBeNull();
  });

  it("should identify dead-end paragraphs (no choices)", () => {
    const isDeadEnd = (id: string): boolean => {
      const para = paragraphs[id as keyof typeof paragraphs];
      return para ? !para.choices || para.choices.length === 0 : false;
    };

    expect(isDeadEnd("3")).toBe(true);
    expect(isDeadEnd("5")).toBe(true);
    expect(isDeadEnd("1")).toBe(false);
    expect(isDeadEnd("2")).toBe(false);
  });

  it("should count choices in a paragraph", () => {
    const getChoiceCount = (id: string): number => {
      const para = paragraphs[id as keyof typeof paragraphs];
      return para?.choices?.length ?? 0;
    };

    expect(getChoiceCount("1")).toBe(2);
    expect(getChoiceCount("2")).toBe(1);
    expect(getChoiceCount("3")).toBe(0);
    expect(getChoiceCount("4")).toBe(1);
    expect(getChoiceCount("5")).toBe(0);
  });

  it("should follow choice navigation", () => {
    const getNextParagraphId = (
      currentId: string,
      choiceIndex: number,
    ): string | null => {
      const para = paragraphs[currentId as keyof typeof paragraphs];
      const choice = para?.choices?.[choiceIndex];
      return choice?.nextParagraphId ?? null;
    };

    // From paragraph 1, first choice goes to 2
    expect(getNextParagraphId("1", 0)).toBe("2");
    // From paragraph 1, second choice goes to 3
    expect(getNextParagraphId("1", 1)).toBe("3");
    // From paragraph 4, first choice goes to 5
    expect(getNextParagraphId("4", 0)).toBe("5");
  });

  it("should parse numeric input from string", () => {
    const parseInput = (input: string): number | null => {
      const num = parseInt(input, 10);
      return isNaN(num) || num <= 0 ? null : num;
    };

    expect(parseInput("1")).toBe(1);
    expect(parseInput("5")).toBe(5);
    expect(parseInput("0")).toBeNull();
    expect(parseInput("-1")).toBeNull();
    expect(parseInput("abc")).toBeNull();
    expect(parseInput("")).toBeNull();
  });

  it("should validate paragraph chain integrity", () => {
    const getAllChoiceTargets = (): Set<string> => {
      const targets = new Set<string>();
      Object.values(paragraphs).forEach((para) => {
        para.choices?.forEach((choice) => {
          targets.add(choice.nextParagraphId);
        });
      });
      return targets;
    };

    const allTargets = getAllChoiceTargets();
    // All referenced paragraphs should exist
    allTargets.forEach((targetId) => {
      expect(targetId in paragraphs).toBe(true);
    });
  });

  it("should identify scenario metadata", () => {
    const scenarios = {
      "1": {
        title: "Tajemna Biblioteka",
        playerCount: "2-4 graczy",
        duration: "45 min",
      },
      "2": {
        title: "Opuszczony Szpital",
        playerCount: "2-4 graczy",
        duration: "60 min",
      },
      "3": {
        title: "Nocny Koszmar",
        playerCount: "2-6 graczy",
        duration: "90 min",
      },
    };

    const getScenarioTitle = (scenarioId: string): string | null => {
      return scenarios[scenarioId as keyof typeof scenarios]?.title ?? null;
    };

    expect(getScenarioTitle("1")).toBe("Tajemna Biblioteka");
    expect(getScenarioTitle("2")).toBe("Opuszczony Szpital");
    expect(getScenarioTitle("999")).toBeNull();
  });
});
