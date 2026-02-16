import type { Scenario, Paragraph } from "../types";

export function validateScenario(scenario: Scenario): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!scenario.id) errors.push("Scenario must have an ID");
  if (!scenario.title) errors.push("Scenario must have a title");
  if (!scenario.description) errors.push("Scenario must have a description");
  if (!scenario.playerCount) errors.push("Scenario must specify player count");
  if (!scenario.duration) errors.push("Scenario must have estimated duration");

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

  const hasId = Array.isArray(paragraph.id)
    ? paragraph.id.length > 0
    : !!paragraph.id;
  if (!hasId) errors.push("Paragraph must have an ID");
  if (!paragraph.text) errors.push("Paragraph must have text content");

  return {
    valid: errors.length === 0,
    errors,
  };
}
