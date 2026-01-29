/**
 * Game Data - Scenarios and Paragraphs
 * Central data repository for all game content
 */

import type { Scenario, Paragraph } from "../types";
import scenariosIndex from "./scenarios/index.json";
import droga from "./scenarios/droga-donikad/paragraphs.json";
import biblioteka from "./scenarios/tajemna-biblioteka/paragraphs.json";
import szpital from "./scenarios/opuszczony-szpital/paragraphs.json";
import koszmar from "./scenarios/nocny-koszmar/paragraphs.json";

/**
 * Available game scenarios - loaded from index.json
 */
export const SCENARIOS: Record<string, Scenario> = Object.fromEntries(
  scenariosIndex.scenarios.map((scenario) => [scenario.id, scenario as Scenario]),
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
