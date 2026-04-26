import { createContext } from "react";
import type { Scenario } from "../../types";

export interface EditorScenario {
  meta: Scenario;
}

export interface EditorState {
  scenario: EditorScenario | null;
  isDirty: boolean;
}

export type EditorAction =
  | { type: "SET_META"; payload: Scenario }
  | { type: "LOAD_SCENARIO"; payload: EditorScenario }
  | { type: "NEW_SCENARIO" }
  | { type: "MARK_SAVED" };

export interface EditorContextValue {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export const EditorContext = createContext<EditorContextValue | null>(null);
