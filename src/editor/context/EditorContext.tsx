import React, { useReducer, useEffect } from "react";
import { saveToStorage, loadFromStorage } from "../utils/editorStorage";
import { EditorContext } from "./editorTypes";
import type { EditorState, EditorAction, EditorScenario } from "./editorTypes";

export type { EditorScenario };

const initialState: EditorState = {
  scenario: null,
  isDirty: false,
  activeParagraphId: null,
};

function nextParagraphId(paragraphs: { id: string }[]): string {
  const nums = paragraphs
    .map((p) => parseInt(p.id, 10))
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return String(max + 1);
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
          paragraphs: [],
        },
        isDirty: false,
        activeParagraphId: null,
      };
    case "SET_META":
      return {
        ...state,
        scenario: state.scenario
          ? { ...state.scenario, meta: action.payload }
          : { meta: action.payload, paragraphs: [] },
        isDirty: true,
      };
    case "LOAD_SCENARIO":
      return {
        scenario: {
          ...action.payload,
          paragraphs: action.payload.paragraphs ?? [],
        },
        isDirty: false,
        activeParagraphId: null,
      };
    case "MARK_SAVED":
      return { ...state, isDirty: false };
    case "ADD_PARAGRAPH": {
      if (!state.scenario) return state;
      const id = nextParagraphId(state.scenario.paragraphs);
      const paragraphs = [...state.scenario.paragraphs, { id }];
      return {
        ...state,
        scenario: { ...state.scenario, paragraphs },
        isDirty: true,
        activeParagraphId: id,
      };
    }
    case "REMOVE_PARAGRAPH": {
      if (!state.scenario) return state;
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
    case "MOVE_PARAGRAPH": {
      if (!state.scenario) return state;
      const { id, direction } = action.payload;
      const arr = [...state.scenario.paragraphs];
      const idx = arr.findIndex((p) => p.id === id);
      if (idx === -1) return state;
      const swap = direction === "up" ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= arr.length) return state;
      [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
      return {
        ...state,
        scenario: { ...state.scenario, paragraphs: arr },
        isDirty: true,
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
