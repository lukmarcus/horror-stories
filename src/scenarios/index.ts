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
 * Game paragraphs/nodes from JSON data
 */
export const PARAGRAPHS: Record<string, Paragraph> = {
  ...Object.fromEntries(
    droga.paragraphs.map((p: Paragraph) => [p.id.toString(), p]),
  ),
  ...Object.fromEntries(
    biblioteka.paragraphs.map((p: Paragraph) => [p.id.toString(), p]),
  ),
  ...Object.fromEntries(
    szpital.paragraphs.map((p: Paragraph) => [p.id.toString(), p]),
  ),
  ...Object.fromEntries(
    koszmar.paragraphs.map((p: Paragraph) => [p.id.toString(), p]),
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
