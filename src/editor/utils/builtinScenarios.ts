import type {
  EditorScenario,
  EditorParagraph,
  EditorLetter,
  EditorSetup,
  EditorChoice,
  EditorVariant,
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
export async function copyBuiltinScenarioToEditor(
  scenarioId: string,
): Promise<EditorScenario | null> {
  const scenario = SCENARIOS[scenarioId] as Scenario | undefined;
  if (!scenario) return null;

  // Get raw paragraphs for this scenario (before runtime transformations)
  const rawData = RAW_PARAGRAPHS[scenarioId];
  if (!rawData) return null;

  const paragraphs: EditorParagraph[] = rawData.paragraphs.map((p) => {
    const paragraphId = Array.isArray(p.id) ? p.id[0] : p.id;
    const aliases = Array.isArray(p.id) ? p.id.slice(1) : [];

    // Remove runtime-added spacing: "none" from last block
    const cleanPages = (pgs: typeof p.pages) =>
      (pgs ?? [[]]).map((page, pageIdx, allPages) => {
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

    const pages = cleanPages(p.pages);

    // Handle variant paragraphs
    if (p.variants && Object.keys(p.variants).length > 0) {
      const variants: Record<string, EditorVariant> = {};
      for (const [vid, variant] of Object.entries(p.variants)) {
        variants[vid] = {
          pages: cleanPages(variant.pages),
          ...(variant.areChoicesHorizontal
            ? { areChoicesHorizontal: true }
            : {}),
          choices: (variant.choices ?? []) as EditorChoice[],
        };
      }

      return {
        id: paragraphId,
        ...(aliases.length > 0 ? { aliases } : {}),
        pages,
        variantSelectors: (p.choices ?? []) as EditorChoice[],
        variants,
      };
    }

    // Simple paragraph
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

  // Get persons from meta and convert to EditorPerson[] (without paragraphId)
  const persons: EditorScenario["persons"] = (scenario.persons ?? []).map(
    (name) => ({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      paragraphId: "", // Empty - author can assign later in PersonsEditor
    }),
  );

  // Load images for this scenario
  const images = await loadScenarioImages(scenarioId);

  return {
    meta: {
      ...scenario,
      id: `${scenario.id}-copy-${Date.now()}`,
      title: `Kopia: ${scenario.title}`,
    },
    paragraphs,
    setup,
    letters,
    persons,
    images,
  };
}

/**
 * Load all images for a scenario from the images/ folder.
 * Converts them to data URLs for use in the editor.
 */
async function loadScenarioImages(
  scenarioId: string,
): Promise<Record<string, string>> {
  if (scenarioId !== "droga-donikad") return {};

  // Use Vite's import.meta.glob to import all images at build time
  const imageModules = import.meta.glob(
    "../../scenarios/droga-donikad/images/*.{jpg,jpeg,png}",
    { eager: false, query: "?url", import: "default" },
  ) as Record<string, () => Promise<string>>;

  const images: Record<string, string> = {};

  for (const [path, importFn] of Object.entries(imageModules)) {
    try {
      // Get the URL from Vite
      const url = await importFn();

      // Fetch and convert to data URL
      const response = await fetch(url);
      if (!response.ok) continue;

      const blob = await response.blob();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Extract filename without extension as ID
      const filename =
        path
          .split("/")
          .pop()
          ?.replace(/\.[^.]+$/, "") ?? "";
      if (filename) {
        images[filename] = dataUrl;
      }
    } catch (error) {
      console.warn(`Failed to load image from ${path}:`, error);
    }
  }

  return images;
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
