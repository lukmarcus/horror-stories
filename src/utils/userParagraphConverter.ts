import type {
  EditorParagraph,
  EditorVariant,
} from "../editor/context/editorTypes";
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
    ...(c.nextVariantId !== undefined
      ? { nextVariantId: c.nextVariantId }
      : {}),
  }));
}

function editorVariantToGameParagraph(
  variantId: string,
  variant: EditorVariant,
): Paragraph {
  const pages = variant.pages ?? [[]];
  const choices = editorChoicesToGameChoices(variant.choices);
  return {
    id: variantId,
    ...(pages.length === 1
      ? { content: pages[0] }
      : { contentPages: pages, isMultiPage: true }),
    ...(choices.length > 0 ? { choices } : {}),
    ...(variant.areChoicesHorizontal ? { areChoicesHorizontal: true } : {}),
  };
}

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
  const choices = editorChoicesToGameChoices(
    editorParagraph.variants
      ? editorParagraph.variantSelectors
      : editorParagraph.choices,
  );

  // Variant paragraph
  if (editorParagraph.variants) {
    const pages = editorParagraph.pages ?? [[]];
    const variants: Record<string, Paragraph> = {};
    for (const [vid, v] of Object.entries(editorParagraph.variants)) {
      variants[vid] = editorVariantToGameParagraph(vid, v);
    }
    return {
      id: editorParagraph.id,
      ...(pages.length === 1
        ? { content: pages[0] }
        : { contentPages: pages, isMultiPage: true }),
      ...(choices.length > 0 ? { choices } : {}),
      variants,
    };
  }

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
