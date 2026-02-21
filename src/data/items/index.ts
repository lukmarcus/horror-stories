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
): string => {
  // Determine extension based on type
  const extension = type === "symbols" || type === "letters" ? "png" : "jpg";
  return `${import.meta.env.BASE_URL}assets/images/${type}/${id}.${extension}`;
};

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
  const extension = type === "symbols" || type === "letters" ? "png" : "jpg";
  return `${import.meta.env.BASE_URL}assets/images/${type}/${id}.${extension}`;
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
  const extension = type === "symbols" || type === "letters" ? "png" : "jpg";
  const path = `${import.meta.env.BASE_URL}assets/images/${type}/${id}.${extension}`;

  try {
    const response = await fetch(path, { method: "HEAD" });
    if (response.ok) return path;
  } catch {
    // Path not found
  }

  return path;
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
  id: string | number,
): (RoomItem & { imagePath: string }) | undefined => {
  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  const roomItem = roomItems.find((item) => item.id === numId);
  return roomItem
    ? { ...roomItem, imagePath: getImagePath(numId, "roomItems") }
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
