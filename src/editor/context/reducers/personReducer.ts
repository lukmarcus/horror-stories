import type { EditorState, EditorAction } from "../editorTypes";

export function personReducer(
  state: EditorState,
  action: EditorAction,
): EditorState {
  switch (action.type) {
    case "LOAD_PERSONS":
      if (!state.scenario) return state;
      return {
        ...state,
        scenario: {
          ...state.scenario,
          persons: Array.isArray(action.payload.persons)
            ? action.payload.persons
            : [],
        },
        isDirty: true,
      };
    case "ADD_PERSON":
      if (!state.scenario) return state;
      return {
        ...state,
        scenario: {
          ...state.scenario,
          persons: [
            ...(state.scenario.persons ?? []),
            { id: action.payload.id, paragraphId: action.payload.paragraphId },
          ],
        },
        isDirty: true,
      };
    case "REMOVE_PERSON":
      if (!state.scenario) return state;
      return {
        ...state,
        scenario: {
          ...state.scenario,
          persons: (state.scenario.persons ?? []).filter(
            (p) => p.id !== action.payload,
          ),
        },
        isDirty: true,
      };
    default:
      return state;
  }
}
