import type { EditorState, EditorAction } from "../editorTypes";

export function setupReducer(
  state: EditorState,
  action: EditorAction,
): EditorState {
  switch (action.type) {
    case "ADD_SETUP_PAGE": {
      if (!state.scenario) return state;
      const existing = state.scenario.setup;
      return {
        ...state,
        scenario: {
          ...state.scenario,
          setup: {
            pages: [...(existing?.pages ?? []), []],
            choices: existing?.choices,
          },
        },
        isDirty: true,
      };
    }
    case "REMOVE_SETUP_PAGE": {
      if (!state.scenario?.setup) return state;
      const pages = state.scenario.setup.pages.filter(
        (_, i) => i !== action.payload,
      );
      return {
        ...state,
        scenario: {
          ...state.scenario,
          setup: {
            ...state.scenario.setup,
            pages: pages.length > 0 ? pages : [[]],
          },
        },
        isDirty: true,
      };
    }
    case "SET_SETUP_PAGES": {
      if (!state.scenario) return state;
      return {
        ...state,
        scenario: {
          ...state.scenario,
          setup: {
            pages: action.payload,
            choices: state.scenario.setup?.choices,
          },
        },
        isDirty: true,
      };
    }
    case "SET_SETUP_CHOICES": {
      if (!state.scenario) return state;
      return {
        ...state,
        scenario: {
          ...state.scenario,
          setup: {
            pages: state.scenario.setup?.pages ?? [[]],
            choices: action.payload.length > 0 ? action.payload : undefined,
          },
        },
        isDirty: true,
      };
    }
    default:
      return state;
  }
}
