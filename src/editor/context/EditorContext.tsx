import React, { useReducer, useEffect } from "react";
import { saveToStorage, loadFromStorage } from "../utils/editorStorage";
import { EditorContext } from "./editorTypes";
import type { EditorState, EditorAction, EditorScenario } from "./editorTypes";

export type { EditorScenario };

const DEATH_PARAGRAPH = { id: "100" };

const initialState: EditorState = {
  scenario: null,
  isDirty: false,
  activeParagraphId: null,
};

function ensureDeath(paragraphs: { id: string }[]): typeof paragraphs {
  return paragraphs.some((p) => p.id === "100")
    ? paragraphs
    : [...paragraphs, DEATH_PARAGRAPH];
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "NEW_SCENARIO":
      return {
        scenario: {
          meta: {
            id: "",
            title: "",
            description: "",
            minPlayerCount: null,
            maxPlayerCount: null,
            duration: null,
          },
          paragraphs: [DEATH_PARAGRAPH],
        },
        isDirty: false,
        activeParagraphId: null,
      };
    case "SET_META":
      return {
        ...state,
        scenario: state.scenario
          ? { ...state.scenario, meta: action.payload }
          : { meta: action.payload, paragraphs: [DEATH_PARAGRAPH] },
        isDirty: true,
      };
    case "LOAD_SCENARIO":
      return {
        scenario: {
          ...action.payload,
          paragraphs: ensureDeath(action.payload.paragraphs ?? []),
        },
        isDirty: false,
        activeParagraphId: null,
      };
    case "MARK_SAVED":
      return { ...state, isDirty: false };
    case "ADD_PARAGRAPH": {
      if (!state.scenario) return state;
      const id = action.payload;
      if (state.scenario.paragraphs.some((p) => p.id === id)) return state;
      const paragraphs = [...state.scenario.paragraphs, { id }];
      return {
        ...state,
        scenario: { ...state.scenario, paragraphs },
        isDirty: true,
        activeParagraphId: id,
      };
    }
    case "REMOVE_PARAGRAPH": {
      if (!state.scenario || action.payload === "100") return state;
      const paragraphs = state.scenario.paragraphs.filter(
        (p) => p.id !== action.payload,
      );
      return {
        ...state,
        scenario: { ...state.scenario, paragraphs },
        isDirty: true,
        activeParagraphId:
          state.activeParagraphId === action.payload
            ? null
            : state.activeParagraphId,
      };
    }
    case "SET_ACTIVE_PARAGRAPH":
      return { ...state, activeParagraphId: action.payload };
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
