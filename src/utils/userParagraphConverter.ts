import type { EditorParagraph } from "../editor/context/editorTypes";
import type { Paragraph } from "../types";

/**
 * Converts editor paragraph format to game paragraph format.
 *
 * - If `pages` is set: uses ContentBlock[][] directly.
 *   - 1 page  → content: pages[0]  (no isMultiPage)
 *   - 2+ pages → contentPages: pages, isMultiPage: true
 * - Falls back to legacy `text` field: each non-empty line → ContentBlock in contentPages[0].
 */
export function editorParagraphToGameParagraph(
  editorParagraph: EditorParagraph,
): Paragraph {
  const choices = (editorParagraph.choices ?? []).map((c) => ({
    id: c.id,
    text: c.text,
    nextParagraphId: c.nextParagraphId,
  }));

  // Pages-based format
  if (editorParagraph.pages) {
    const pages = editorParagraph.pages;
    if (pages.length === 1) {
      return {
        id: editorParagraph.id,
        content: pages[0],
        choices,
      };
    }
    return {
      id: editorParagraph.id,
      contentPages: pages,
      isMultiPage: true,
      choices,
    };
  }

  // Legacy text format
  const lines = (editorParagraph.text ?? "")
    .split("\n")
    .filter((line) => line.trim() !== "");

  const contentPage = lines.map((line, index) => ({
    text: line,
    ...(index === lines.length - 1 ? { spacing: "none" as const } : {}),
  }));

  return {
    id: editorParagraph.id,
    contentPages: contentPage.length > 0 ? [contentPage] : [[]],
    choices,
  };
}

/**
 * Converts an array of editor paragraphs to the game's paragraph map.
 */
export function buildUserParagraphMap(
  paragraphs: EditorParagraph[],
): Record<string, Paragraph> {
  const map: Record<string, Paragraph> = {};
  for (const p of paragraphs) {
    map[p.id] = editorParagraphToGameParagraph(p);
  }
  return map;
}
