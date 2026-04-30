import type { EditorState, EditorAction } from "./editorTypes";

export const DEATH_PARAGRAPH = { id: "100" };

export const initialState: EditorState = {
  scenario: null,
  isDirty: false,
  activeParagraphId: null,
};

function ensureDeath(paragraphs: { id: string }[]): typeof paragraphs {
  return paragraphs.some((p) => p.id === "100")
    ? paragraphs
    : [...paragraphs, DEATH_PARAGRAPH];
}

export function editorReducer(
  state: EditorState,
  action: EditorAction,
): EditorState {
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
