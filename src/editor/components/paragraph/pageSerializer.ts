import type { ContentBlock } from "../../../types";
import { COLORS, type ColorName } from "./editorPickerData";

export const SIZES = ["xs", "sm", "lg", "xl"] as const;
export type SizeName = (typeof SIZES)[number];

export interface BlockOpts {
  styles: ReadonlySet<"b" | "i" | "u">;
  color: ColorName | null;
  size: SizeName | null;
}

export const EMPTY_BLOCK_OPTS: BlockOpts = {
  styles: new Set(),
  color: null,
  size: null,
};

const BLOCK_PREFIX_RE = /^(\[(?:b|i|u|c:[a-z]+|s:[a-z]+)\])*/;

export function parseBlockPrefixes(
  line: string,
): BlockOpts & { content: string } {
  const prefixStr = line.match(BLOCK_PREFIX_RE)?.[0] ?? "";
  const content = line.slice(prefixStr.length);
  const styles = new Set<"b" | "i" | "u">();
  if (prefixStr.includes("[b]")) styles.add("b");
  if (prefixStr.includes("[i]")) styles.add("i");
  if (prefixStr.includes("[u]")) styles.add("u");
  const colorM = prefixStr.match(/\[c:([a-z]+)\]/);
  const color =
    colorM && (COLORS as readonly string[]).includes(colorM[1])
      ? (colorM[1] as ColorName)
      : null;
  const sizeM = prefixStr.match(/\[s:([a-z]+)\]/);
  const size =
    sizeM && (SIZES as readonly string[]).includes(sizeM[1])
      ? (sizeM[1] as SizeName)
      : null;
  return { styles, color, size, content };
}

export function buildLine(
  content: string,
  styles: ReadonlySet<"b" | "i" | "u">,
  color: ColorName | null,
  size: SizeName | null,
): string {
  let prefix = "";
  if (styles.has("b")) prefix += "[b]";
  if (styles.has("i")) prefix += "[i]";
  if (styles.has("u")) prefix += "[u]";
  if (color) prefix += `[c:${color}]`;
  if (size) prefix += `[s:${size}]`;
  return prefix + content;
}

export function getCurrentLineRange(
  text: string,
  pos: number,
): { start: number; end: number; line: string } {
  const start = text.lastIndexOf("\n", pos - 1) + 1;
  const rawEnd = text.indexOf("\n", pos);
  const end = rawEnd === -1 ? text.length : rawEnd;
  return { start, end, line: text.slice(start, end) };
}

export function pageToText(page: ContentBlock[]): string {
  return page
    .map((b) => {
      if (b.type === "image")
        return `[img: ${b.image ?? ""}${b.size ? ` ${b.size}` : ""}]`;
      let prefix = "";
      const styles = Array.isArray(b.style)
        ? b.style
        : b.style
          ? [b.style]
          : [];
      if (styles.includes("bold")) prefix += "[b]";
      if (styles.includes("italic")) prefix += "[i]";
      if (styles.includes("underline")) prefix += "[u]";
      if (b.color) prefix += `[c:${b.color}]`;
      if (b.size) prefix += `[s:${b.size}]`;
      return prefix + (b.text ?? "");
    })
    .join("\n");
}

export function textToPage(text: string): ContentBlock[] {
  if (!text) return [];
  return text.split("\n").map((line) => {
    const imgM = line.match(/^\[img:\s*(.*?)(?:\s+(xs|sm|lg|xl))?\]$/);
    if (imgM) {
      const block: ContentBlock = { type: "image", image: imgM[1].trim() };
      if (imgM[2]) block.size = imgM[2] as ContentBlock["size"];
      return block;
    }
    const { styles: style, color, size, content } = parseBlockPrefixes(line);
    const block: ContentBlock = { type: "text", text: content };
    const styleArr: ("bold" | "italic" | "underline")[] = [];
    if (style.has("b")) styleArr.push("bold");
    if (style.has("i")) styleArr.push("italic");
    if (style.has("u")) styleArr.push("underline");
    if (styleArr.length === 1) block.style = styleArr[0];
    else if (styleArr.length > 1) block.style = styleArr;
    if (color) block.color = color;
    if (size) block.size = size;
    return block;
  });
}
