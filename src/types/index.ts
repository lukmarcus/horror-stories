/**
 * Horror Stories - Type Definitions
 * Central source of truth for all application types
 */

/**
 * Single choice option in a paragraph
 */
export interface Choice {
  id: string;
  text: string;
  nextParagraphId?: string;
  isConditional?: boolean;
  yesText?: string;
  noText?: string;
  yesNextId?: string;
  noNextId?: string;
}

/**
 * Dice roll result configuration for conditional branching
 */
export interface DiceResult {
  threshold: number;
  successText: string;
  successNextId: string;
  failText: string;
  failNextId: string;
}

/**
 * Content block for rich text paragraphs
 */
export interface ContentBlock {
  type: "text" | "image" | "symbol" | "token";
  html?: string;
  id?: string;
  size?: "xs" | "sm" | "lg" | "xl";
  style?: "bold" | "italic" | "underline";
  color?: "yellow" | "red" | "purple" | "green";
}

/**
 * Single paragraph/node in the story tree
 */
export interface Paragraph {
  id: string;
  text?: string;
  content?: ContentBlock[];
  contentPages?: ContentBlock[][];
  choices?: Choice[];
  image?: string;
  audio?: string;
  hasDiceRoll?: boolean;
  diceRollDescription?: string;
  diceResult?: DiceResult;
  isDirect?: boolean;
  accessibleFrom?: string[];
  items?: string[];
}

/**
 * Game scenario containing title, description, and game data
 */
export interface Scenario {
  id: string;
  title: string;
  description: string;
  playerCount: string;
  duration: string;
  characters?: string[];
  tokens?: Record<string, number>;
  notes?: string;
}

/**
 * Game state tracking during gameplay
 */
export interface GameState {
  scenarioId: string;
  currentParagraphId: string;
  history: string[];
  isComplete: boolean;
}
