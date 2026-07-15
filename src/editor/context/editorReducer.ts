import type { EditorState, EditorAction, EditorChoice } from "./editorTypes";
import type { ContentBlock } from "../../types";
import { DEATH_PARAGRAPH, ensureDeath } from "./reducers/reducerUtils";
import { paragraphReducer } from "./reducers/paragraphReducer";
import { variantReducer } from "./reducers/variantReducer";
import { letterReducer } from "./reducers/letterReducer";
import { personReducer } from "./reducers/personReducer";
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
          persons: [],
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
              persons: [],
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
          persons: Array.isArray(action.payload.persons)
            ? action.payload.persons
            : [],
          setup: (() => {
            const raw = action.payload as unknown as Record<string, unknown>;
            // New format: setup.pages
            if (raw.setup && typeof raw.setup === "object") {
              const s = raw.setup as Record<string, unknown>;
              return {
                pages: Array.isArray(s.pages)
                  ? (s.pages as ContentBlock[][])
                  : [[]],
                choices: Array.isArray(s.choices)
                  ? (s.choices as EditorChoice[])
                  : undefined,
              };
            }
            // Back-compat: old setupSteps[] format
            if (
              Array.isArray(raw.setupSteps) &&
              (raw.setupSteps as unknown[]).length > 0
            ) {
              const steps = raw.setupSteps as Array<Record<string, unknown>>;
              return {
                pages: steps.map((s) =>
                  Array.isArray(s.content)
                    ? (s.content as ContentBlock[])
                    : Array.isArray(s.pages)
                      ? (s.pages as ContentBlock[][]).flat()
                      : [],
                ),
                choices: undefined,
              };
            }
            return undefined;
          })(),
        },
        isDirty: true,
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
    personReducer,
    setupReducer,
    imageReducer,
  ].reduce((s, reducer) => reducer(s, action), state);
}
