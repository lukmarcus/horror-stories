import type { Scenario, Paragraph } from "../types";

export function validateScenario(scenario: Scenario): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!scenario.id) errors.push("Scenario must have an ID");
  if (!scenario.title) errors.push("Scenario must have a title");
  if (!scenario.paragraphs || scenario.paragraphs.length === 0) {
    errors.push("Scenario must have at least one paragraph");
  }
  if (!scenario.startingParagraphId)
    errors.push("Scenario must specify a starting paragraph");

  // Validate that starting paragraph exists
  if (scenario.paragraphs) {
    const startParagraph = scenario.paragraphs.find(
      (p) => p.id === scenario.startingParagraphId,
    );
    if (!startParagraph) {
      errors.push(
        `Starting paragraph with ID "${scenario.startingParagraphId}" not found`,
      );
    }

    // Validate all paragraph references
    scenario.paragraphs.forEach((paragraph) => {
      if (paragraph.choices) {
        paragraph.choices.forEach((choice) => {
          const targetParagraph = scenario.paragraphs.find(
            (p) => p.id === choice.nextParagraphId,
          );
          if (!targetParagraph) {
            errors.push(
              `Paragraph "${paragraph.id}" choice "${choice.id}" references non-existent paragraph "${choice.nextParagraphId}"`,
            );
          }
        });
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateParagraph(paragraph: Paragraph): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!paragraph.id) errors.push("Paragraph must have an ID");
  if (!paragraph.text) errors.push("Paragraph must have text content");

  return {
    valid: errors.length === 0,
    errors,
  };
}
