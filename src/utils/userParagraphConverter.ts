import type { EditorParagraph } from "../editor/context/editorTypes";
import type { Paragraph } from "../types";

/**
 * Converts editor paragraph format to game paragraph format.
 * Each non-empty line of `text` becomes a separate ContentBlock in contentPages[0].
 */
export function editorParagraphToGameParagraph(
  editorParagraph: EditorParagraph,
): Paragraph {
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
    choices: [],
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
