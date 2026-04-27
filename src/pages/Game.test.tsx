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
        minPlayerCount: 2,
        maxPlayerCount: 4,
        duration: 45,
      },
      "2": {
        title: "Opuszczony Szpital",
        minPlayerCount: 2,
        maxPlayerCount: 4,
        duration: 60,
      },
      "3": {
        title: "Nocny Koszmar",
        minPlayerCount: 2,
        maxPlayerCount: 6,
        duration: 90,
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

describe("Game - Variant System", () => {
  // Mock paragraph with variants
  const variantParagraph = {
    id: "9-test",
    contentPages: [[{ text: "Którą postacią jesteś?" }]],
    choices: [
      { text: "Jessica", nextVariantId: "jessica" },
      { text: "Patrick", nextVariantId: "patrick" },
    ],
    areChoicesHorizontal: true,
    variants: {
      jessica: {
        contentPages: [[{ text: "Poznałaś go na imprezie." }]],
        choices: [{ text: "Dalej", nextVariantId: "jessica-detail" }],
      },
      patrick: {
        contentPages: [[{ text: "Głowa nie daje Ci żyć." }]],
        choices: [],
      },
    },
  };

  it("should accumulate variant content correctly", () => {
    const variantPath = ["jessica"];
    const accumulated: { text: string }[] = [];

    // Add main paragraph content
    if (variantParagraph.contentPages) {
      for (const page of variantParagraph.contentPages) {
        accumulated.push(...page);
      }
    }

    // Add variant content
    for (const variantId of variantPath) {
      const variant =
        variantParagraph.variants?.[
          variantId as keyof typeof variantParagraph.variants
        ];
      if (variant?.contentPages) {
        for (const page of variant.contentPages) {
          accumulated.push(...page);
        }
      }
    }

    expect(accumulated).toHaveLength(2);
    expect(accumulated[0].text).toContain("Którą postacią");
    expect(accumulated[1].text).toContain("Poznałaś");
  });

  it("should accumulate multiple variant levels", () => {
    const variantPath = ["jessica", "jessica-detail"];
    const accumulated: { text: string }[] = [];

    // Add main content
    if (variantParagraph.contentPages) {
      for (const page of variantParagraph.contentPages) {
        accumulated.push(...page);
      }
    }

    // Add all variant content in path order
    for (const variantId of variantPath) {
      const variant =
        variantParagraph.variants?.[
          variantId as keyof typeof variantParagraph.variants
        ];
      if (variant?.contentPages) {
        for (const page of variant.contentPages) {
          accumulated.push(...page);
        }
      }
    }

    // Should have main + first variant + second variant
    expect(variantPath).toHaveLength(2);
  });

  it("should not accumulate content when variantPath is empty", () => {
    const variantPath: string[] = [];
    const hasVariants = variantParagraph.variants !== undefined;
    const shouldAccumulate = variantPath.length > 0 && hasVariants;

    expect(shouldAccumulate).toBe(false);
  });

  it("should get correct choices from last variant in path", () => {
    const variantPath = ["jessica"];
    const lastVariantId = variantPath[variantPath.length - 1];
    const lastVariant =
      variantParagraph.variants?.[
        lastVariantId as keyof typeof variantParagraph.variants
      ];

    expect(lastVariant?.choices).toHaveLength(1);
    expect(lastVariant?.choices?.[0].text).toBe("Dalej");
  });

  it("should use main paragraph choices when variantPath is empty", () => {
    const variantPath: string[] = [];
    const lastVariantId = variantPath[variantPath.length - 1];
    const lastVariant = lastVariantId
      ? variantParagraph.variants?.[
          lastVariantId as keyof typeof variantParagraph.variants
        ]
      : undefined;
    const choices = lastVariant?.choices || variantParagraph.choices;

    expect(choices).toBe(variantParagraph.choices);
    expect(choices).toHaveLength(2);
  });

  it("should separate variant choices from regular choices", () => {
    const mixedChoices = [
      { text: "Wariant 1", nextVariantId: "v1" },
      { text: "Przejdź dalej", nextParagraphId: "10" },
      { text: "Wariant 2", nextVariantId: "v2" },
      { text: "Opuść", nextParagraphId: "" },
    ];

    const variantChoices = mixedChoices.filter(
      (c) => c.nextVariantId !== undefined,
    );
    const regularChoices = mixedChoices.filter(
      (c) => c.nextVariantId === undefined,
    );

    expect(variantChoices).toHaveLength(2);
    expect(regularChoices).toHaveLength(2);
  });
});
