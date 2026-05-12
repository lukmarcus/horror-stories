import { createContext } from "react";
import type { Scenario, ContentBlock } from "../../types";

export interface EditorChoice {
  id: string;
  text: string;
  nextParagraphId: string;
}

export interface EditorParagraph {
  id: string;
  /** Legacy plain-text field — kept for backward compatibility with older saves */
  text?: string;
  /** Rich content pages. Each page is an array of ContentBlock. */
  pages?: ContentBlock[][];
  choices?: EditorChoice[];
}

export interface EditorScenario {
  meta: Scenario;
  paragraphs: EditorParagraph[];
}

export interface EditorState {
  scenario: EditorScenario | null;
  isDirty: boolean;
  activeParagraphId: string | null;
}

export type EditorAction =
  | { type: "SET_META"; payload: Scenario }
  | { type: "LOAD_SCENARIO"; payload: EditorScenario }
  | { type: "NEW_SCENARIO" }
  | { type: "MARK_SAVED" }
  | { type: "ADD_PARAGRAPH"; payload: string }
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
    };

export interface EditorContextValue {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export const EditorContext = createContext<EditorContextValue | null>(null);
