import {
  symbols,
  roomItems,
  persons,
  enemies,
  storyItems,
  statuses,
  letters,
  randomItems,
  getSymbol,
  getRoomItem,
  getPerson,
  getEnemy,
  getStoryItem,
  getStatus,
  getLetter,
  getRandomItem,
} from "../../../data/items";

// ── Color ─────────────────────────────────────────────

export const COLORS = ["yellow", "red", "purple", "green", "blue"] as const;
export type ColorName = (typeof COLORS)[number];

// ── Image picker item type ─────────────────────────────

export interface ImagePickerItem {
  id: string;
  imagePath: string;
  label: string;
  sublabel?: string;
}

// ── Picker item data ───────────────────────────────────

export const SYMBOL_PICKER_ITEMS: ImagePickerItem[] = symbols.map((s) => ({
  id: s.id,
  imagePath: getSymbol(s.id)!.imagePath,
  label: s.name,
}));

export const ROOM_PICKER_ITEMS: ImagePickerItem[] = roomItems.map((r) => ({
  id: String(r.id),
  imagePath: getRoomItem(r.id)!.imagePath,
  label: `Żeton planszy §${r.id}`,
  sublabel: r.name || undefined,
}));

export const PERSON_PICKER_ITEMS: ImagePickerItem[] = persons.map((p) => ({
  id: p.id,
  imagePath: getPerson(p.id)!.imagePath,
  label: p.id.charAt(0).toUpperCase() + p.id.slice(1),
}));

export const ENEMY_PICKER_ITEMS: ImagePickerItem[] = enemies.map((e) => ({
  id: e.id,
  imagePath: getEnemy(e.id)!.imagePath,
  label: e.id.charAt(0).toUpperCase() + e.id.slice(1),
}));

export const STORY_PICKER_ITEMS: ImagePickerItem[] = storyItems.map((s) => ({
  id: s.id,
  imagePath: getStoryItem(s.id)!.imagePath,
  label: `Przedmiot fabularny ${s.id.toUpperCase()}${s.paragraphId != null ? ` (§${s.paragraphId})` : ""}`,
  sublabel: s.description || undefined,
}));

export const STATUS_PICKER_ITEMS: ImagePickerItem[] = statuses.map((s) => ({
  id: s.id,
  imagePath: getStatus(s.id)!.imagePath,
  label: s.name ? `Żeton statusu: ${s.name}` : s.id,
  sublabel: s.description || undefined,
}));

export const LETTER_PICKER_ITEMS: ImagePickerItem[] = letters.map((l) => ({
  id: l.id,
  imagePath: getLetter(l.id)!.imagePath,
  label: `Litera ${l.id.toUpperCase()}`,
}));

export const RANDOM_PICKER_ITEMS: ImagePickerItem[] = randomItems.map((r) => ({
  id: r.id,
  imagePath: getRandomItem(r.id)!.imagePath,
  label: `Przedmiot losowy ${r.id.toUpperCase()}`,
  sublabel: r.description || undefined,
}));

export { SPAN_SNIPPETS } from "./snippets";
export type { SnippetItem } from "./snippets";
