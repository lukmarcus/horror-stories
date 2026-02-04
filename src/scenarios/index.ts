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
 */
export const PARAGRAPHS: Record<string, Record<string, Paragraph>> = {
  "droga-donikad": Object.fromEntries(
    (droga.paragraphs as unknown as Paragraph[]).map((p) => [
      p.id.toString(),
      p,
    ]),
  ),
  "tajemna-biblioteka": Object.fromEntries(
    (biblioteka.paragraphs as unknown as Paragraph[]).map((p) => [
      p.id.toString(),
      p,
    ]),
  ),
  "opuszczony-szpital": Object.fromEntries(
    (szpital.paragraphs as unknown as Paragraph[]).map((p) => [
      p.id.toString(),
      p,
    ]),
  ),
  "nocny-koszmar": Object.fromEntries(
    (koszmar.paragraphs as unknown as Paragraph[]).map((p) => [
      p.id.toString(),
      p,
    ]),
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
