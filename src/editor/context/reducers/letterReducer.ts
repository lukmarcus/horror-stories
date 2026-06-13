import type { EditorState, EditorAction } from "../editorTypes";

export function letterReducer(
  state: EditorState,
  action: EditorAction,
): EditorState {
  switch (action.type) {
    case "LOAD_LETTERS":
      if (!state.scenario) return state;
      return {
        ...state,
        scenario: {
          ...state.scenario,
          letters: Array.isArray(action.payload.letters)
            ? action.payload.letters.map((l) => ({
                ...l,
                id: String(l.id).toUpperCase(),
              }))
            : [],
        },
        isDirty: true,
      };
    case "ADD_LETTER":
      if (!state.scenario) return state;
      return {
        ...state,
        scenario: {
          ...state.scenario,
          letters: [
            ...(state.scenario.letters ?? []),
            { id: action.payload.id, paragraphId: action.payload.paragraphId },
          ],
        },
        isDirty: true,
      };
    case "REMOVE_LETTER":
      if (!state.scenario) return state;
      return {
        ...state,
        scenario: {
          ...state.scenario,
          letters: (state.scenario.letters ?? []).filter(
            (l) => l.id !== action.payload,
          ),
        },
        isDirty: true,
      };
    case "UPDATE_LETTER":
      if (!state.scenario) return state;
      return {
        ...state,
        scenario: {
          ...state.scenario,
          letters: (state.scenario.letters ?? []).map((l) =>
            l.id === action.payload.id
              ? { id: action.payload.id, paragraphId: action.payload.paragraphId }
              : l,
          ),
        },
        isDirty: true,
      };
    default:
      return state;
  }
}
