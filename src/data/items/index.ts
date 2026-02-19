import storyItemsData from "./storyItems.json";
import roomItemsData from "./roomItems.json";
import randomItemsData from "./randomItems.json";
import symbolsData from "./symbols.json";
import statusesData from "./statuses.json";
import personsData from "./persons.json";
import lettersData from "./letters.json";

// Types
export interface StoryItem {
  id: string; // Roman numeral
  paragraphId?: number | null;
  description?: string | null;
}

export interface RoomItem {
  id: number; // Paragraph number
}

export interface RandomItem {
  id: string; // Item name
  romanNumeral?: string;
  description?: string | null;
}

export interface Symbol {
  id: string;
  name: string;
}

export interface Status {
  id: string;
  description?: string | null;
}

export interface Person {
  id: string;
  paragraphId?: number | null;
}

export interface Letter {
  id: string;
}

// Exports
export const storyItems: StoryItem[] = storyItemsData.items;
export const roomItems: RoomItem[] = roomItemsData.items;
export const randomItems: RandomItem[] = randomItemsData.items;
export const symbols: Symbol[] = symbolsData.symbols;
export const statuses: Status[] = statusesData.items;
export const persons: Person[] = personsData.items;
export const letters: Letter[] = lettersData.items;

// Helpers
const getImagePath = (
  id: string | number,
  type:
    | "storyItems"
    | "roomItems"
    | "randomItems"
    | "symbols"
    | "statuses"
    | "persons"
    | "letters",
): string => `${import.meta.env.BASE_URL}assets/images/${type}/${id}.png`;

/**
 * Resolve image path: try .png first, fallback to .jpg
 */
export const resolveImagePath = (
  id: string | number,
  type:
    | "storyItems"
    | "roomItems"
    | "randomItems"
    | "symbols"
    | "statuses"
    | "persons"
    | "letters",
): string => {
  // For now, return .png as primary. Component should handle 404 and fallback to .jpg
  return `${import.meta.env.BASE_URL}assets/images/${type}/${id}.png`;
};

/**
 * Async helper to check image existence and return correct extension
 */
export const getResolvedImagePath = async (
  id: string | number,
  type:
    | "storyItems"
    | "roomItems"
    | "randomItems"
    | "symbols"
    | "statuses"
    | "persons"
    | "letters",
): Promise<string> => {
  const pngPath = `${import.meta.env.BASE_URL}assets/images/${type}/${id}.png`;
  const jpgPath = `${import.meta.env.BASE_URL}assets/images/${type}/${id}.jpg`;

  try {
    const response = await fetch(pngPath, { method: "HEAD" });
    if (response.ok) return pngPath;
  } catch {
    // PNG not found, try JPG
  }

  try {
    const response = await fetch(jpgPath, { method: "HEAD" });
    if (response.ok) return jpgPath;
  } catch {
    // JPG not found either, return PNG as fallback
  }

  return pngPath;
};

export const getStoryItem = (
  id: string,
): (StoryItem & { imagePath: string }) | undefined => {
  const item = storyItems.find((item) => item.id === id);
  return item
    ? { ...item, imagePath: getImagePath(id, "storyItems") }
    : undefined;
};

export const getRoomItem = (
  id: number,
): (RoomItem & { imagePath: string }) | undefined => {
  const roomItem = roomItems.find((item) => item.id === id);
  return roomItem
    ? { ...roomItem, imagePath: getImagePath(id, "roomItems") }
    : undefined;
};

export const getSymbol = (
  id: string,
): (Symbol & { imagePath: string }) | undefined => {
  const symbol = symbols.find((sym) => sym.id === id);
  return symbol
    ? { ...symbol, imagePath: getImagePath(id, "symbols") }
    : undefined;
};

export const getRandomItem = (
  id: string,
): (RandomItem & { imagePath: string }) | undefined => {
  const item = randomItems.find((item) => item.id === id);
  return item
    ? { ...item, imagePath: getImagePath(id, "randomItems") }
    : undefined;
};

export const getStatus = (
  id: string,
): (Status & { imagePath: string }) | undefined => {
  const status = statuses.find((s) => s.id === id);
  return status
    ? { ...status, imagePath: getImagePath(id, "statuses") }
    : undefined;
};

export const getPerson = (
  id: string,
): (Person & { imagePath: string }) | undefined => {
  const person = persons.find((p) => p.id === id);
  return person
    ? { ...person, imagePath: getImagePath(id, "persons") }
    : undefined;
};

export const getLetter = (
  id: string,
): (Letter & { imagePath: string }) | undefined => {
  const letter = letters.find((l) => l.id === id);
  return letter
    ? { ...letter, imagePath: getImagePath(id, "letters") }
    : undefined;
};
