import type { EditorState, EditorAction, EditorChoice } from "./editorTypes";
import type { ContentBlock } from "../../types";
import { DEATH_PARAGRAPH, ensureDeath } from "./reducers/reducerUtils";
import { paragraphReducer } from "./reducers/paragraphReducer";
import { variantReducer } from "./reducers/variantReducer";
import { letterReducer } from "./reducers/letterReducer";
import { setupReducer } from "./reducers/setupReducer";
import { imageReducer } from "./reducers/imageReducer";

export { DEATH_PARAGRAPH } from "./reducers/reducerUtils";

export const initialState: EditorState = {
  scenario: null,
  isDirty: false,
  activeParagraphId: null,
};

export function editorReducer(
  state: EditorState,
  action: EditorAction,
): EditorState {
  // ── Scenario-level actions ────────────────────────────────────────────────
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
          images: {},
          letters: [],
        },
        isDirty: false,
        activeParagraphId: null,
      };
    case "SET_META":
      return {
        ...state,
        scenario: state.scenario
          ? { ...state.scenario, meta: action.payload }
          : {
              meta: action.payload,
              paragraphs: [DEATH_PARAGRAPH],
              images: {},
              letters: [],
            },
        isDirty: true,
      };
    case "LOAD_SCENARIO":
      if (!action.payload) {
        return { scenario: null, isDirty: false, activeParagraphId: null };
      }
      return {
        scenario: {
          ...action.payload,
          paragraphs: ensureDeath(
            Array.isArray(action.payload.paragraphs)
              ? action.payload.paragraphs
              : [],
          ),
          images:
            typeof action.payload.images === "object" &&
            !Array.isArray(action.payload.images)
              ? action.payload.images
              : {},
          letters: Array.isArray(action.payload.letters)
            ? action.payload.letters.map((l) => ({
                ...l,
                id: String(l.id).toUpperCase(),
              }))
            : [],
          setupSteps: Array.isArray(action.payload.setupSteps)
            ? action.payload.setupSteps.map((s) => {
                const raw = s as unknown as Record<string, unknown>;
                return {
                  stepNumber: s.stepNumber,
                  content: Array.isArray(raw.content)
                    ? (raw.content as ContentBlock[])
                    : Array.isArray(raw.pages)
                      ? (raw.pages as ContentBlock[][]).flat()
                      : [],
                  choices: Array.isArray(raw.choices)
                    ? (raw.choices as EditorChoice[])
                    : [],
                };
              })
            : [],
        },
        isDirty: false,
        activeParagraphId: null,
      };
    case "MARK_SAVED":
      return { ...state, isDirty: false };
  }

  // ── Domain reducers ───────────────────────────────────────────────────────
  return [
    paragraphReducer,
    variantReducer,
    letterReducer,
    setupReducer,
    imageReducer,
  ].reduce((s, reducer) => reducer(s, action), state);
}
