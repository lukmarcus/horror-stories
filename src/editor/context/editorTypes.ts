import { createContext } from "react";
import type { Scenario } from "../../types";

export interface EditorParagraph {
  id: string;
  text?: string;
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
  | { type: "SET_PARAGRAPH_TEXT"; payload: { id: string; text: string } };

export interface EditorContextValue {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export const EditorContext = createContext<EditorContextValue | null>(null);
