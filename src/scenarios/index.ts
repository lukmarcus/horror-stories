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
 * Automatically adds spacing: "none" to the last content block in each paragraph
 */
const createParagraphMap = (
  paragraphs: Paragraph[],
): Record<string, Paragraph> => {
  const map: Record<string, Paragraph> = {};
  for (const p of paragraphs) {
    // Clone the paragraph and add spacing: "none" to the last content block
    const paragraph = { ...p };

    // Handle contentPages (2D array: array of pages, each page is array of blocks)
    if (
      paragraph.contentPages &&
      Array.isArray(paragraph.contentPages) &&
      paragraph.contentPages.length > 0
    ) {
      const lastPageIndex = paragraph.contentPages.length - 1;
      const lastPage = paragraph.contentPages[lastPageIndex];

      if (
        Array.isArray(lastPage) &&
        lastPage.length > 0
      ) {
        const lastBlockIndex = lastPage.length - 1;
        const lastBlock = lastPage[lastBlockIndex];

        if (lastBlock && !lastBlock.spacing) {
          // Clone contentPages with the updated last block
          paragraph.contentPages = [
            ...paragraph.contentPages.slice(0, lastPageIndex),
            [
              ...lastPage.slice(0, lastBlockIndex),
              { ...lastBlock, spacing: "none" as const },
            ],
          ];
        }
      }
    }
    // Handle single-page content array
    else if (
      paragraph.content &&
      Array.isArray(paragraph.content) &&
      paragraph.content.length > 0
    ) {
      const lastIndex = paragraph.content.length - 1;
      const lastBlock = paragraph.content[lastIndex];

      if (lastBlock && !lastBlock.spacing) {
        paragraph.content = [
          ...paragraph.content.slice(0, lastIndex),
          { ...lastBlock, spacing: "none" as const },
        ];
      }
    }

    const ids = Array.isArray(paragraph.id)
      ? paragraph.id
      : [paragraph.id];
    for (const id of ids) {
      map[id.toString()] = paragraph;
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
