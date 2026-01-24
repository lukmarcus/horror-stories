/**
 * Horror Stories - Type Definitions
 */

export interface Paragraph {
  id: string;
  text: string;
  choices?: Choice[];
  image?: string;
  audio?: string;
}

export interface Choice {
  id: string;
  text: string;
  nextParagraphId: string;
  diceRoll?: DiceRequirement;
}

export interface DiceRequirement {
  dice: number;
  sides: number;
  minValue: number;
  successParagraphId: string;
  failureParagraphId: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  version: string;
  author?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  maxPlayers: number;
  estimatedDuration: number; // in minutes
  paragraphs: Paragraph[];
  startingParagraphId: string;
  image?: string;
}

export interface GameState {
  scenarioId: string;
  currentParagraphId: string;
  history: string[];
  isComplete: boolean;
}
