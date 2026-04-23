/**
 * Horror Stories - Type Definitions
 * Central source of truth for all application types
 */

/**
 * Single choice option in a paragraph
 */
export interface Choice {
  id: string;
  text?: string;
  html?: string;
  nextParagraphId?: string;
  nextVariantId?: string; // For variant content navigation
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
  type?: "text" | "image" | "letter" | "item";
  text?: string; // New format: simplified {text: "html"}
  html?: string; // Old format: kept for backward compatibility
  id?: string;
  image?: string; // New format: direct image reference
  size?: "xs" | "sm" | "lg" | "xl";
  style?: "bold" | "italic" | "underline";
  color?: "yellow" | "red" | "purple" | "green";
  spacing?: "none"; // Optional spacing control - omit for default spacing
}

/**
 * Single paragraph/node in the story tree
 */
export interface Paragraph {
  id: string | string[]; // Can be single ID or array of IDs for paragraphs accessible from multiple sources
  text?: string;
  content?: ContentBlock[];
  contentPages?: ContentBlock[][];
  choices?: Choice[];
  variants?: Record<string, Paragraph>; // For variant content
  image?: string;
  audio?: string;
  hasDiceRoll?: boolean;
  diceRollDescription?: string;
  diceResult?: DiceResult;
  accessibleFrom?: string[]; // If empty/undefined, paragraph is directly accessible (isDirect=true)
  items?: string[];
  isMultiPage?: boolean;
  areChoicesHorizontal?: boolean;
}

/**
 * Single step in the scenario setup/preparation flow
 */
export interface SetupStep {
  stepNumber: number;
  content?: ContentBlock[];
  text?: string;
}

/**
 * Alphabet token linking a letter to its trigger paragraph
 */
export interface LetterToken {
  id: string;
  paragraphId: string;
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
  startParagraphId?: string;
  enemyId?: string;
}

/**
 * Single action in an enemy's action table
 */
export interface EnemyAction {
  value: number[];
  name: string;
  condition: string;
  description: string;
}

/**
 * Enemy stats for a specific player count
 */
export interface EnemyPlayerVariant {
  players: string;
  actionsPerTurn: number;
  diceCount: number;
  maxDiceCount?: number;
  actions: EnemyAction[];
}

/**
 * Enemy definition
 */
export interface Enemy {
  id: string;
  name: string;
  image: string;
  playerVariants: EnemyPlayerVariant[];
}
