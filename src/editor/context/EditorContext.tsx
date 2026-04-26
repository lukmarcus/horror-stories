import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { Scenario } from "../../types";
import { saveToStorage, loadFromStorage } from "../utils/editorStorage";

export interface EditorScenario {
  meta: Scenario;
}

interface EditorState {
  scenario: EditorScenario | null;
  isDirty: boolean;
}

type EditorAction =
  | { type: "SET_META"; payload: Scenario }
  | { type: "LOAD_SCENARIO"; payload: EditorScenario }
  | { type: "NEW_SCENARIO" }
  | { type: "MARK_SAVED" };

const initialState: EditorState = {
  scenario: null,
  isDirty: false,
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "NEW_SCENARIO":
      return {
        scenario: {
          meta: {
            id: crypto.randomUUID(),
            title: "",
            description: "",
            playerCount: "",
            duration: "",
          },
        },
        isDirty: false,
      };
    case "SET_META":
      return {
        ...state,
        scenario: state.scenario
          ? { ...state.scenario, meta: action.payload }
          : { meta: action.payload },
        isDirty: true,
      };
    case "LOAD_SCENARIO":
      return {
        scenario: action.payload,
        isDirty: false,
      };
    case "MARK_SAVED":
      return { ...state, isDirty: false };
    default:
      return state;
  }
}

interface EditorContextValue {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  // Wczytaj zapisany stan przy starcie
  useEffect(() => {
    loadFromStorage().then((saved) => {
      if (saved) {
        dispatch({ type: "LOAD_SCENARIO", payload: saved });
      }
    });
  }, []);

  // Auto-save przy każdej zmianie
  useEffect(() => {
    if (state.scenario && state.isDirty) {
      saveToStorage(state.scenario);
    }
  }, [state.scenario, state.isDirty]);

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = (): EditorContextValue => {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
};
