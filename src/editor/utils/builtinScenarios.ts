import type {
  EditorScenario,
  EditorParagraph,
  EditorLetter,
  EditorSetup,
  EditorChoice,
} from "../context/editorTypes";
import type { Scenario, Paragraph } from "../../types";
import { SCENARIOS, SETUP_DATA, LETTERS_DATA } from "../../scenarios";

// Import raw JSON data directly to avoid runtime transformations
import drogaParagraphs from "../../scenarios/droga-donikad/paragraphs.json";

// Map of raw paragraph data by scenario ID
const RAW_PARAGRAPHS: Record<string, { paragraphs: Paragraph[] }> = {
  "droga-donikad": drogaParagraphs as { paragraphs: Paragraph[] },
};

/**
 * List of available built-in scenarios for import into the editor.
 * Only scenarios with complete data (paragraphs + setup) are available.
 */
export const AVAILABLE_BUILTIN_SCENARIOS = ["droga-donikad"] as const;

/**
 * Copy a built-in scenario into the editor as a new editable scenario.
 * Creates a copy of all paragraphs, setup, letters, and images.
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

  // Get raw paragraphs for this scenario (before runtime transformations)
  const rawData = RAW_PARAGRAPHS[scenarioId];
  if (!rawData) return null;

  const paragraphs: EditorParagraph[] = rawData.paragraphs.map((p) => {
    const paragraphId = Array.isArray(p.id) ? p.id[0] : p.id;
    const aliases = Array.isArray(p.id) ? p.id.slice(1) : [];

    // Remove runtime-added spacing: "none" from last block
    const pages = (p.pages ?? [[]]).map((page, pageIdx, allPages) => {
      if (pageIdx === allPages.length - 1 && page.length > 0) {
        // Last page - remove spacing from last block if it was auto-added
        return page.map((block, blockIdx) => {
          if (blockIdx === page.length - 1 && block.spacing === "none") {
            const { spacing: _spacing, ...rest } = block;
            return rest;
          }
          return block;
        });
      }
      return page;
    });

    return {
      id: paragraphId,
      ...(aliases.length > 0 ? { aliases } : {}),
      pages,
      choices: (p.choices ?? []) as EditorChoice[],
    };
  });

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

  // Get images for this scenario
  // Note: Built-in scenarios don't export images to keep bundle size manageable
  const images = {};

  return {
    meta: {
      ...scenario,
      id: `${scenario.id}-copy-${Date.now()}`,
      title: `Kopia: ${scenario.title}`,
    },
    paragraphs,
    setup,
    letters,
    images,
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
