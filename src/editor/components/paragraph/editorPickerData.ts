import {
  symbols,
  roomItems,
  persons,
  enemies,
  storyItems,
  statuses,
  letters,
  randomItems,
  cards,
  getSymbol,
  getRoomItem,
  getPerson,
  getEnemy,
  getStoryItem,
  getStatus,
  getLetter,
  getRandomItem,
  getCard,
} from "../../../data/items";

// ── Color ─────────────────────────────────────────────

export const COLORS = ["yellow", "red", "purple", "green", "blue"] as const;
export type ColorName = (typeof COLORS)[number];

export const COLOR_ICONS: Record<ColorName, string> = {
  green: "§",
  red: "❗",
  blue: "🎁",
  purple: "🧭",
  yellow: "⏰",
};

export const COLOR_LABELS: Record<ColorName, string> = {
  green: "Paragraf",
  red: "Ważne",
  blue: "Nagroda",
  purple: "Kierunki (N/E/W/S)",
  yellow: "Tor czasu",
};
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
  label: p.name ?? p.id,
}));

export const ENEMY_PICKER_ITEMS: ImagePickerItem[] = enemies.map((e) => ({
  id: e.id,
  imagePath: getEnemy(e.id)!.imagePath,
  label: e.name ?? e.id,
}));

export const STORY_PICKER_ITEMS: ImagePickerItem[] = storyItems.map((s) => ({
  id: s.romanId || s.id,
  imagePath: getStoryItem(s.romanId || s.id)!.imagePath,
  label: `Przedmiot fabularny ${(s.romanId || s.id).toUpperCase()}${!isNaN(Number(s.id)) ? ` (§${s.id})` : ""}`,
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

export const CARD_PICKER_ITEMS: ImagePickerItem[] = cards.map((c) => ({
  id: c.id,
  imagePath: getCard(c.id)!.imagePath,
  label: `Karta ${c.name}`,
  sublabel: c.description || undefined,
}));

export { SPAN_SNIPPETS } from "./snippets";
export type { SnippetItem } from "./snippets";
