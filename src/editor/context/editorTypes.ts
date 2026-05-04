import { createContext } from "react";
import type { Scenario } from "../../types";

export interface EditorChoice {
  id: string;
  text: string;
  nextParagraphId: string;
}

export interface EditorParagraph {
  id: string;
  text?: string;
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
