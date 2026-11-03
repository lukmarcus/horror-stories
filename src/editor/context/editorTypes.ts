import { createContext } from "react";
import type { Scenario, ContentBlock } from "../../types";

export interface EditorChoice {
  id: string;
  text: string;
  /** Target paragraph ID (empty string = back to menu) */
  nextParagraphId?: string;
}

export interface EditorParagraph {
  id: string;
  /** Additional IDs under which this paragraph is also accessible in the game */
  aliases?: string[];
  /** Legacy plain-text field — kept for backward compatibility with older saves */
  text?: string;
  /** Rich content pages (for "prosty" paragraphs) */
  pages?: ContentBlock[][];
  /** Choices for "prosty" paragraphs — vertical, point to nextParagraphId only */
  choices?: EditorChoice[];
  /** Horizontal choices layout (default: vertical) */
  areChoicesHorizontal?: boolean;
}

export interface EditorLetter {
  id: string;
  paragraphId: string;
}

export interface EditorPerson {
  id: string;
  paragraphId: string;
}

export interface EditorSetup {
  /** Pages of content blocks — each page shown as one step */
  pages: ContentBlock[][];
  /** Optional choices shown on the last page */
  choices?: EditorChoice[];
}

export interface EditorScenario {
  meta: Scenario;
  paragraphs: EditorParagraph[];
  /** Setup (preparation steps + optional navigation choices) */
  setup?: EditorSetup;
  /** User-uploaded images: id → base64 data URL */
  images?: Record<string, string>;
  /** Scenario letters mapping */
  letters?: EditorLetter[];
  /** Scenario persons mapping */
  persons?: EditorPerson[];
}

export interface EditorState {
  scenario: EditorScenario | null;
  isDirty: boolean;
  activeParagraphId: string | null;
}

export type EditorAction =
  | { type: "SET_META"; payload: Scenario }
  | { type: "LOAD_SCENARIO"; payload: EditorScenario | null }
  | { type: "NEW_SCENARIO" }
  | { type: "MARK_SAVED" }
  | { type: "ADD_PARAGRAPH"; payload: string }
  | { type: "ADD_PARAGRAPH_SILENT"; payload: string }
  | { type: "REMOVE_PARAGRAPH"; payload: string }
  | { type: "SET_ACTIVE_PARAGRAPH"; payload: string | null }
  | { type: "SET_PARAGRAPH_TEXT"; payload: { id: string; text: string } }
  | {
      type: "SET_PARAGRAPH_PAGES";
      payload: { id: string; pages: ContentBlock[][] };
    }
  | { type: "ADD_PAGE"; payload: { paragraphId: string } }
  | { type: "REMOVE_PAGE"; payload: { paragraphId: string; pageIndex: number } }
  | {
      type: "ADD_BLOCK";
      payload: { paragraphId: string; pageIndex: number; block: ContentBlock };
    }
  | {
      type: "UPDATE_BLOCK";
      payload: {
        paragraphId: string;
        pageIndex: number;
        blockIndex: number;
        block: ContentBlock;
      };
    }
  | {
      type: "REMOVE_BLOCK";
      payload: {
        paragraphId: string;
        pageIndex: number;
        blockIndex: number;
      };
    }
  | {
      type: "ADD_CHOICE";
      payload: { paragraphId: string; choice: EditorChoice };
    }
  | {
      type: "UPDATE_CHOICE";
      payload: { paragraphId: string; choice: EditorChoice };
    }
  | {
      type: "REMOVE_CHOICE";
      payload: { paragraphId: string; choiceId: string };
    }
  | {
      type: "SET_PARAGRAPH_HORIZONTAL";
      payload: { id: string; value: boolean };
    }
  | { type: "CONVERT_TEXT_TO_PAGES"; payload: string }
  | { type: "ADD_IMAGE"; payload: { id: string; data: string } }
  | { type: "REMOVE_IMAGE"; payload: string }
  | { type: "ADD_ALIAS"; payload: { paragraphId: string; alias: string } }
  | { type: "REMOVE_ALIAS"; payload: { paragraphId: string; alias: string } }
  | {
      type: "LOAD_LETTERS";
      payload: { letters: Array<{ id: string; paragraphId: string }> };
    }
  | {
      type: "ADD_LETTER";
      payload: { id: string; paragraphId: string };
    }
  | { type: "REMOVE_LETTER"; payload: string }
  | {
      type: "UPDATE_LETTER";
      payload: { id: string; paragraphId: string };
    }
  | {
      type: "LOAD_PERSONS";
      payload: { persons: Array<{ id: string; paragraphId: string }> };
    }
  | {
      type: "ADD_PERSON";
      payload: { id: string; paragraphId: string };
    }
  | { type: "REMOVE_PERSON"; payload: string }
  | { type: "ADD_SETUP_PAGE" }
  | { type: "REMOVE_SETUP_PAGE"; payload: number }
  | {
      type: "SET_SETUP_PAGES";
      payload: ContentBlock[][];
    }
  | {
      type: "SET_SETUP_CHOICES";
      payload: EditorChoice[];
    };

export interface EditorContextValue {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export const EditorContext = createContext<EditorContextValue | null>(null);
