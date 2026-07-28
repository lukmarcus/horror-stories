import itemsData from "./items.json";
import storyItemIdsData from "./storyItems.json";
import roomItemIdsData from "./roomItems.json";
import randomItemIdsData from "./randomItems.json";
import symbolsData from "./symbols.json";
import statusesData from "./statuses.json";
import personsData from "./persons.json";
import enemiesData from "./enemies.json";
import lettersData from "./letters.json";

// Central item type
interface CentralItem {
  name: string;
  paragraphId?: number;
  description?: string | null;
  categories: string[];
}

// Types (backward compatible)
export interface StoryItem {
  id: string; // Roman numeral
  paragraphId?: number | null;
  description?: string | null;
}

export interface RoomItem {
  id: number; // Paragraph number
  name?: string;
}

export interface RandomItem {
  id: string; // Roman numeral (i, ii, iii...)
  description?: string | null;
}

export interface Symbol {
  id: string;
  name: string;
}

export interface Status {
  id: string;
  name?: string | null;
  description?: string | null;
}

export interface Person {
  id: string;
  paragraphId?: number | null;
}

export interface Enemy {
  id: string;
  paragraphId?: number | null;
}

export interface Letter {
  id: string;
}

// Central items lookup
const items = itemsData as Record<string, CentralItem>;

// Build category arrays from IDs
export const storyItems: StoryItem[] = storyItemIdsData.items.map((id) => {
  const item = items[id];
  return {
    id,
    paragraphId: item.paragraphId ?? 0,
    description: item.description ?? item.name,
  };
});

export const roomItems: RoomItem[] = roomItemIdsData.items.map(
  (paragraphId) => {
    // Find item by paragraphId in items.json
    const entry = Object.entries(items).find(
      ([_, item]) => item.paragraphId === paragraphId,
    );
    if (!entry) {
      throw new Error(`No item found for paragraphId ${paragraphId}`);
    }
    const [, item] = entry;
    return {
      id: paragraphId as number,
      name: item.name,
    };
  },
);

export const randomItems: RandomItem[] = randomItemIdsData.items.map((id) => {
  const item = items[id];
  return {
    id,
    description: item.description,
  };
});

export const symbols: Symbol[] = symbolsData.symbols;
export const statuses: Status[] = statusesData.items;
export const persons: Person[] = personsData.items;
export const enemies: Enemy[] = enemiesData.items;
export const letters: Letter[] = lettersData.items;

// Image path helper - unified items/ folder with priority naming (paragraphId > roman > name)
const getItemImagePath = (
  id: string,
  category: "story" | "room" | "random",
): string => {
  let fileName: string;

  if (category === "room") {
    // Room items: id is already the paragraphId
    fileName = id;
  } else {
    // Story/random items: check if item has paragraphId, use it with priority
    const item = items[id];
    fileName = item?.paragraphId?.toString() ?? id;
  }

  return `${import.meta.env.BASE_URL}assets/images/items/${fileName}.jpg`;
};

// Legacy helper for non-item types
const getImagePath = (
  id: string | number,
  type: "symbols" | "statuses" | "persons" | "enemies" | "letters",
): string => {
  const extension = type === "symbols" || type === "letters" ? "png" : "jpg";
  return `${import.meta.env.BASE_URL}assets/images/${type}/${id}.${extension}`;
};

export const getRandomItem = (
  id: string,
): (RandomItem & { imagePath: string }) | undefined => {
  const item = randomItems.find((r) => r.id === id);
  if (!item) return undefined;

  // Map conflicting IDs: random "i" is stored as "i-random" in items.json
  const lookupId = id === "i" ? "i-random" : id;
  return { ...item, imagePath: getItemImagePath(lookupId, "random") };
};

export const getStoryItem = (
  id: string,
): (StoryItem & { imagePath: string }) | undefined => {
  const item = storyItems.find((item) => item.id === id);
  return item
    ? { ...item, imagePath: getItemImagePath(id, "story") }
    : undefined;
};

export const getRoomItem = (
  id: string | number,
): (RoomItem & { imagePath: string }) | undefined => {
  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  const roomItem = roomItems.find((item) => item.id === numId);
  return roomItem
    ? { ...roomItem, imagePath: getItemImagePath(String(numId), "room") }
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

export const getPerson = (
  id: string,
): (Person & { imagePath: string }) | undefined => {
  const person = persons.find((p) => p.id === id);
  return person
    ? { ...person, imagePath: getImagePath(id, "persons") }
    : undefined;
};

export const getEnemy = (
  id: string,
): (Enemy & { imagePath: string }) | undefined => {
  const enemy = enemies.find((e) => e.id === id);
  return enemy
    ? { ...enemy, imagePath: getImagePath(id, "enemies") }
    : undefined;
};

export const getLetter = (
  id: string,
): (Letter & { imagePath: string }) | undefined => {
  const normalized = id.toLowerCase();
  const letter = letters.find((l) => l.id === normalized);
  return letter
    ? { ...letter, imagePath: getImagePath(normalized, "letters") }
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
