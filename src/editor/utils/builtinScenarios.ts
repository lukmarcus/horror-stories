import type {
  EditorScenario,
  EditorParagraph,
  EditorLetter,
  EditorSetup,
  EditorChoice,
} from "../context/editorTypes";
import type { Scenario } from "../../types";
import {
  SCENARIOS,
  PARAGRAPHS,
  SETUP_DATA,
  LETTERS_DATA,
} from "../../scenarios";

/**
 * List of available built-in scenarios for import into the editor.
 * Only scenarios with complete data (paragraphs + setup) are available.
 */
export const AVAILABLE_BUILTIN_SCENARIOS = ["droga-donikad"] as const;

/**
 * Copy a built-in scenario into the editor as a new editable scenario.
 * Creates a copy of all paragraphs, setup, and letters.
 * The copy is independent and can be edited/exported without affecting the original.
 *
 * @param scenarioId - ID of the scenario to copy
 * @returns EditorScenario ready for editing, or null if not found
 */
export function copyBuiltinScenarioToEditor(
  scenarioId: string,
): EditorScenario | null {
  const scenario = SCENARIOS[scenarioId] as Scenario | undefined;
  if (!scenario) return null;

  // Get paragraphs for this scenario
  const scenarioParagraphs = PARAGRAPHS[scenarioId];
  if (!scenarioParagraphs) return null;

  const paragraphs: EditorParagraph[] = Object.entries(scenarioParagraphs).map(
    ([id, p]) => {
      return {
        id,
        pages: p.contentPages ?? [],
        choices: (p.choices ?? []) as EditorChoice[],
        variants: {},
      };
    },
  );

  // Get setup for this scenario
  const setupData = SETUP_DATA[scenarioId];
  const setup: EditorSetup | undefined = setupData
    ? {
        pages: setupData.pages ?? [],
        choices: (setupData.choices ?? []) as EditorChoice[],
      }
    : undefined;

  // Get letters for this scenario
  const letters: EditorLetter[] = (LETTERS_DATA[scenarioId]?.letters ?? []).map(
    (letter) => ({
      id: letter.id,
      paragraphId: letter.paragraphId,
    }),
  );

  return {
    meta: {
      ...scenario,
      id: `${scenario.id}-copy-${Date.now()}`,
      title: `Kopia: ${scenario.title}`,
    },
    paragraphs,
    setup,
    letters,
  };
}

/**
 * Get metadata for all available built-in scenarios.
 * Used to populate import dialog.
 */
export function getBuiltinScenariosMetadata(): {
  id: string;
  title: string;
  description: string;
}[] {
  return AVAILABLE_BUILTIN_SCENARIOS.map((id) => {
    const scenario = SCENARIOS[id];
    return {
      id,
      title: scenario.title,
      description: scenario.description,
    };
  }).filter((s) => Boolean(SCENARIOS[s.id]));
}
