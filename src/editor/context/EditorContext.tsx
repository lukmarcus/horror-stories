import React, { useReducer, useEffect } from "react";
import { saveToStorage, loadFromStorage } from "../utils/editorStorage";
import { EditorContext } from "./editorTypes";
import type { EditorScenario } from "./editorTypes";
import { editorReducer, initialState } from "./editorReducer";

export type { EditorScenario };

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
