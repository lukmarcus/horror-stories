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

  return segments.length > 0
    ? segments
    : [{ type: "text", content: text }];
}

/**
 * Uzyskuje wszystkie tagi z tekstu
 * @param text - Tekst do sparsowania
 * @returns Tablica znalezionych tagów
 */
export function extractTags(text: string): ParsedTag[] {
  const segments = parseParagraphText(text);
  return segments
    .filter((seg) => seg.type === "tag" && seg.tag)
    .map((seg) => seg.tag!);
}

/**
 * Uzyskuje tagi określonego typu
 * @param text - Tekst do sparsowania
 * @param tagType - Typ tagu do filtrowania
 * @returns Tablica tagów danego typu
 */
export function extractTagsByType(
  text: string,
  tagType: TagType
): ParsedTag[] {
  return extractTags(text).filter((tag) => tag.type === tagType);
}

/**
 * Formatuje tag do wyświetlenia
 * @param tag - Tag do sformatowania
 * @returns Sformatowany tekst
 */
export function formatTag(tag: ParsedTag): string {
  switch (tag.type) {
    case "item":
      return `Przedmiot: ${tag.value}`;
    case "figure":
      return `Postać: ${tag.value}`;
    case "board":
      return `Pole: ${tag.value}`;
    case "token":
      return `Żeton: ${tag.value}`;
    default:
      return tag.value;
  }
}

/**
 * Uzyskuje CSS class dla tagu
 * @param tag - Tag
 * @returns CSS class
 */
export function getTagClass(tag: ParsedTag): string {
  return `tag tag--${tag.type}`;
}
