import storyItemsData from "./storyItems.json";
import locationsData from "./locations.json";
import randomItemsData from "./randomItems.json";
import symbolsData from "./symbols.json";

// Types
export interface StoryItem {
  id: string;
  name: string;
  romanNumeral: string;
  description: string | null;
  paragraphId: number | null;
}

export interface Location {
  id: string;
  name: string;
  paragraphId: number;
}

export interface RandomItem {
  id: string;
  name: string;
  romanNumeral: string;
  description: string | null;
}

export interface Symbol {
  id: string;
  name: string;
}

// Exports
export const storyItems: StoryItem[] = storyItemsData.items;
export const locations: Location[] = locationsData.locations;
export const randomItems: RandomItem[] = randomItemsData.items;
export const symbols: Symbol[] = symbolsData.symbols;

// Helpers
const getImagePath = (
  id: string,
  type: "items" | "locations" | "randomItems" | "symbols",
): string => `/assets/images/${type}/${id}.png`;

/**
 * Resolve image path: try .png first, fallback to .jpg
 */
export const resolveImagePath = (
  id: string,
  type: "items" | "locations" | "randomItems" | "symbols",
): string => {
  // For now, return .png as primary. Component should handle 404 and fallback to .jpg
  return `/assets/images/${type}/${id}.png`;
};

/**
 * Async helper to check image existence and return correct extension
 */
export const getResolvedImagePath = async (
  id: string,
  type: "items" | "locations" | "randomItems" | "symbols",
): Promise<string> => {
  const pngPath = `/assets/images/${type}/${id}.png`;
  const jpgPath = `/assets/images/${type}/${id}.jpg`;

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
  return item ? { ...item, imagePath: getImagePath(id, "items") } : undefined;
};

export const getLocation = (
  paragraphId: number,
): (Location & { imagePath: string }) | undefined => {
  const location = locations.find((loc) => loc.paragraphId === paragraphId);
  return location
    ? { ...location, imagePath: getImagePath(location.id, "locations") }
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
