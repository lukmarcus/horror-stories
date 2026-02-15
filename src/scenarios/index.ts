/**
 * Game Data - Scenarios and Paragraphs
 * Central data repository for all game content
 */

import type { Scenario, Paragraph } from "../types";
import scenariosIndex from "./index.json";
import droga from "./droga-donikad/paragraphs.json";
import drogaSetup from "./droga-donikad/setup.json";
import biblioteka from "./tajemna-biblioteka/paragraphs.json";
import szpital from "./opuszczony-szpital/paragraphs.json";
import koszmar from "./nocny-koszmar/paragraphs.json";

/**
 * Available game scenarios - loaded from index.json
 */
export const SCENARIOS: Record<string, Scenario> = Object.fromEntries(
  scenariosIndex.scenarios.map((scenario) => [
    scenario.id,
    scenario as Scenario,
  ]),
);

/**
 * Game paragraphs/nodes from JSON data - organized by scenario
 * Supports single IDs and array of IDs - creates entries for each ID
 */
const createParagraphMap = (
  paragraphs: Paragraph[],
): Record<string, Paragraph> => {
  const map: Record<string, Paragraph> = {};
  for (const p of paragraphs) {
    const ids = Array.isArray(p.id) ? p.id : [p.id];
    for (const id of ids) {
      map[id.toString()] = p;
    }
  }
  return map;
};

export const PARAGRAPHS: Record<string, Record<string, Paragraph>> = {
  "droga-donikad": createParagraphMap(
    droga.paragraphs as unknown as Paragraph[],
  ),
  "tajemna-biblioteka": createParagraphMap(
    biblioteka.paragraphs as unknown as Paragraph[],
  ),
  "opuszczony-szpital": createParagraphMap(
    szpital.paragraphs as unknown as Paragraph[],
  ),
  "nocny-koszmar": createParagraphMap(
    koszmar.paragraphs as unknown as Paragraph[],
  ),
};

/**
 * Setup steps for each scenario
 */
type SetupStep = {
  stepNumber: number;
  content?: Array<{
    type: "text" | "image" | "symbol" | "token";
    html?: string;
    id?: string;
    size?: "xs" | "sm" | "lg" | "xl";
    style?: "bold" | "italic" | "underline";
    color?: "yellow" | "red" | "purple" | "green";
  }>;
  text?: string;
};

export const SETUP_DATA: Record<string, { steps: SetupStep[] }> = {
  "droga-donikad": drogaSetup as { steps: SetupStep[] },
};
