import React, { useReducer, useEffect } from "react";
import { saveToStorage, loadFromStorage } from "../utils/editorStorage";
import { EditorContext } from "./editorTypes";
import type { EditorState, EditorAction, EditorScenario } from "./editorTypes";

export type { EditorScenario };

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
            id: "",
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

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  useEffect(() => {
    loadFromStorage().then((saved) => {
      if (saved) {
        dispatch({ type: "LOAD_SCENARIO", payload: saved });
      }
    });
  }, []);

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
