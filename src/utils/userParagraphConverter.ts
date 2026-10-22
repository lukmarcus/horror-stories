import type { EditorParagraph } from "../editor/context/editorTypes";
import type { Paragraph, Choice } from "../types";

function editorChoicesToGameChoices(
  choices: EditorParagraph["choices"],
): Choice[] {
  return (choices ?? []).map((c) => ({
    id: c.id,
    text: c.text,
    ...(c.nextParagraphId !== undefined
      ? { nextParagraphId: c.nextParagraphId }
      : {}),
  }));
}

/**
 * Converts editor paragraph format to game paragraph format.
 *
 * - If `pages` is set: uses ContentBlock[][] directly.
 *   - 1 page  → content: pages[0]  (no isMultiPage)
 *   - 2+ pages → pages, isMultiPage: true
 * - Falls back to legacy `text` field: each non-empty line → ContentBlock in pages[0].
 */
export function editorParagraphToGameParagraph(
  editorParagraph: EditorParagraph,
): Paragraph {
  const choices = editorChoicesToGameChoices(editorParagraph.choices);

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
      pages,
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
    pages: contentPage.length > 0 ? [contentPage] : [[]],
    choices,
  };
}

/**
 * Converts an array of editor paragraphs to the game's paragraph map.
 * Also creates entries for each alias, pointing to the same paragraph object.
 */
export function buildUserParagraphMap(
  paragraphs: EditorParagraph[],
): Record<string, Paragraph> {
  const map: Record<string, Paragraph> = {};
  for (const p of paragraphs) {
    const gameParagraph = editorParagraphToGameParagraph(p);
    map[p.id] = gameParagraph;
    for (const alias of p.aliases ?? []) {
      map[alias] = gameParagraph;
    }
  }
  return map;
}
