import itemsData from "./items.json";
import storyItemIdsData from "./storyItems.json";
import roomItemIdsData from "./roomItems.json";
import randomItemIdsData from "./randomItems.json";
import symbolsData from "./symbols.json";
import statusesData from "./statuses.json";
import personsData from "./persons.json";
import enemiesData from "./enemies.json";
import lettersData from "./letters.json";
import cardsData from "./cards.json";

// Central item type
interface CentralItem {
  romanId?: string;
  name: string;
  description?: string | null;
  categories: string[];
}

// Types (backward compatible)
export interface StoryItem {
  id: string; // Key from items.json (paragraphId or roman numeral)
  romanId?: string;
  description?: string | null;
}

export interface RoomItem {
  id: number; // Paragraph number
  name?: string;
  romanId?: string;
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
  name?: string;
  paragraphId?: number | null;
}

export interface Enemy {
  id: string;
  name?: string;
  paragraphId?: number | null;
}

export interface Letter {
  id: string;
}

export interface Card {
  id: string;
  name: string;
  description: string;
}

// Central items lookup
const items = itemsData as Record<string, CentralItem>;

// Build category arrays from IDs
export const storyItems: StoryItem[] = storyItemIdsData.items.map((romanId) => {
  // Find item by romanId in items.json (or by key if no paragraphId)
  const entry = Object.entries(items).find(
    ([key, item]) => item.romanId === romanId || key === romanId,
  );
  if (!entry) {
    throw new Error(`No item found for romanId ${romanId}`);
  }
  const [key, item] = entry;
  return {
    id: key,
    romanId: item.romanId ?? key,
    description: item.description ?? item.name,
  };
});

export const roomItems: RoomItem[] = roomItemIdsData.items.map(
  (paragraphId) => {
    // Find item by key (key is paragraphId)
    const item = items[String(paragraphId)];
    if (!item) {
      throw new Error(`No item found for paragraphId ${paragraphId}`);
    }
    return {
      id: paragraphId as number,
      name: item.name,
      romanId: item.romanId,
    };
  },
);

export const randomItems: RandomItem[] = randomItemIdsData.items.map((id) => {
  // Map conflicting IDs: random "i" is stored as "i-random" in items.json
  const lookupId = id === "i" ? "i-random" : id;
  const item = items[lookupId];
  if (!item) {
    throw new Error(`No item found for randomItem ${id}`);
  }
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
export const cards: Card[] = Object.entries(cardsData).map(([id, card]) => ({
  id,
  name: card.name,
  description: card.description || "",
}));

// Image path helper - unified items/ folder
// Key in items.json IS the filename (paragraphId > roman > name)
const getItemImagePath = (key: string): string => {
  return `${import.meta.env.BASE_URL}assets/images/items/${key}.jpg`;
};

// Legacy helper for non-item types
const getImagePath = (
  id: string | number,
  type: "symbols" | "statuses" | "persons" | "enemies" | "letters" | "cards",
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
  return { ...item, imagePath: getItemImagePath(lookupId) };
};

export const getStoryItem = (
  romanId: string,
): (StoryItem & { imagePath: string }) | undefined => {
  const item = storyItems.find((item) => item.romanId === romanId);
  return item ? { ...item, imagePath: getItemImagePath(item.id) } : undefined;
};

export const getRoomItem = (
  id: string | number,
): (RoomItem & { imagePath: string }) | undefined => {
  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  const roomItem = roomItems.find((item) => item.id === numId);
  return roomItem
    ? { ...roomItem, imagePath: getItemImagePath(String(numId)) }
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

export const getCard = (
  id: string,
): (Card & { imagePath: string }) | undefined => {
  const card = cards.find((c) => c.id === id);
  return card ? { ...card, imagePath: getImagePath(id, "cards") } : undefined;
};
