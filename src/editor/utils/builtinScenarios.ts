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
  // List of known images for droga-donikad
  const imageFiles: Record<string, string[]> = {
    "droga-donikad": [
      "czarny-worek.jpg",
      "jessica-ekwipunek-talia.jpg",
      "jessica-ekwipunek.jpg",
      "jessica-figurka.jpg",
      "jessica-plansza.jpg",
      "karta-gwiazda.jpg",
      "karta-negatywna.jpg",
      "karta-rozwoju.jpg",
      "karta1.jpg",
      "karta2.jpg",
      "karta3.jpg",
      "karty-akcji.jpg",
      "karty-odrzucone.jpg",
      "klaun-akcje.jpg",
      "klaun-planszetka.jpg",
      "opis-scenariusza.jpg",
      "paragrafy.jpg",
      "patrick-talia.jpg",
      "plansza-12.jpg",
      "plansza-14.jpg",
      "podnies-przedmioty.jpg",
      "rana-ciezka.jpg",
      "rip.jpg",
      "tor-czasu.jpg",
    ],
  };

  const files = imageFiles[scenarioId];
  if (!files) return {};

  const images: Record<string, string> = {};
  const basePath = `/src/scenarios/${scenarioId}/images`;

  for (const filename of files) {
    try {
      const response = await fetch(`${basePath}/${filename}`);
      if (!response.ok) continue;

      const blob = await response.blob();
      const reader = new FileReader();

      await new Promise<void>((resolve, reject) => {
        reader.onload = () => {
          const id = filename.replace(/\.[^.]+$/, "");
          images[id] = reader.result as string;
          resolve();
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.warn(`Failed to load image ${filename}:`, error);
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
