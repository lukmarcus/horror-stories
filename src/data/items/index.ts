import storyItemsData from './storyItems.json';
import locationsData from './locations.json';
import randomItemsData from './randomItems.json';
import symbolsData from './symbols.json';

// Types
export interface StoryItem {
  id: string;
  name: string;
  romanNumeral: string;
  description: string | null;
  paragraphId: number | null;
  image: string;
}

export interface Location {
  id: string;
  name: string;
  paragraphId: number;
  image: string;
}

export interface RandomItem {
  id: string;
  name: string;
  romanNumeral: string;
  description: string | null;
  image: string;
}

export interface Symbol {
  id: string;
  name: string;
  image: string;
}

// Exports
export const storyItems: StoryItem[] = storyItemsData.items;
export const locations: Location[] = locationsData.locations;
export const randomItems: RandomItem[] = randomItemsData.items;
export const symbols: Symbol[] = symbolsData.symbols;

// Helpers
export const getStoryItem = (id: string): StoryItem | undefined =>
  storyItems.find((item) => item.id === id);

export const getLocation = (paragraphId: number): Location | undefined =>
  locations.find((loc) => loc.paragraphId === paragraphId);

export const getSymbol = (id: string): Symbol | undefined =>
  symbols.find((sym) => sym.id === id);

export const getRandomItem = (id: string): RandomItem | undefined =>
  randomItems.find((item) => item.id === id);
