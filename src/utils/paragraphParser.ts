/**
 * Paragraph Parser - Rozpoznawanie i parsowanie tagów w tekście
 * Wspiera: [item:XLIX], [figure:Patrick], [board:14], [token:X]
 */

export type TagType = "item" | "figure" | "board" | "token";

export interface ParsedTag {
  type: TagType;
  value: string;
  fullTag: string;
}

export interface ParsedSegment {
  type: "text" | "tag";
  content: string;
  tag?: ParsedTag;
}

/**
 * Parsuje tekst i wyodrębnia tagi
 * @param text - Tekst do sparsowania
 * @returns Tablica segmentów (tekst i tagi)
 */
export function parseParagraphText(text: string): ParsedSegment[] {
  if (!text) return [];

  const segments: ParsedSegment[] = [];
  const tagRegex = /\[(item|figure|board|token):([^\]]+)\]/g;

  let lastIndex = 0;
  let match;

  while ((match = tagRegex.exec(text)) !== null) {
    // Dodaj tekst przed tagiem
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        content: text.substring(lastIndex, match.index),
      });
    }

    // Dodaj tag
    const tag: ParsedTag = {
      type: match[1] as TagType,
      value: match[2],
      fullTag: match[0],
    };

    segments.push({
      type: "tag",
      content: match[0],
      tag,
    });

    lastIndex = match.index + match[0].length;
  }

  // Dodaj pozostały tekst
  if (lastIndex < text.length) {
    segments.push({
      type: "text",
      content: text.substring(lastIndex),
    });
  }

  return segments.length > 0 ? segments : [{ type: "text", content: text }];
}
