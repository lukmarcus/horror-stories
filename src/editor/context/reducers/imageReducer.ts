import type { EditorState, EditorAction } from "../editorTypes";

export function imageReducer(
  state: EditorState,
  action: EditorAction,
): EditorState {
  switch (action.type) {
    case "ADD_IMAGE": {
      if (!state.scenario) return state;
      return {
        ...state,
        scenario: {
          ...state.scenario,
          images: {
            ...state.scenario.images,
            [action.payload.id]: action.payload.data,
          },
        },
        isDirty: true,
      };
    }
    case "REMOVE_IMAGE": {
      if (!state.scenario) return state;
      const images = { ...(state.scenario.images ?? {}) };
      delete images[action.payload];
      return {
        ...state,
        scenario: { ...state.scenario, images },
        isDirty: true,
      };
    }
    default:
      return state;
  }
}
