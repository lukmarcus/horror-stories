import type {
  EditorState,
  EditorAction,
  EditorSetupStep,
} from "../editorTypes";

export function setupReducer(
  state: EditorState,
  action: EditorAction,
): EditorState {
  switch (action.type) {
    case "ADD_SETUP_STEP": {
      if (!state.scenario) return state;
      const existing = state.scenario.setupSteps ?? [];
      const next: EditorSetupStep = {
        stepNumber: existing.length + 1,
        content: [],
        choices: [],
      };
      return {
        ...state,
        scenario: { ...state.scenario, setupSteps: [...existing, next] },
        isDirty: true,
      };
    }
    case "REMOVE_SETUP_STEP": {
      if (!state.scenario) return state;
      const filtered = (state.scenario.setupSteps ?? [])
        .filter((_, i) => i !== action.payload)
        .map((s, i) => ({ ...s, stepNumber: i + 1 }));
      return {
        ...state,
        scenario: { ...state.scenario, setupSteps: filtered },
        isDirty: true,
      };
    }
    case "SET_SETUP_STEP_CONTENT": {
      if (!state.scenario) return state;
      const steps = (state.scenario.setupSteps ?? []).map((s, i) =>
        i === action.payload.stepIndex
          ? { ...s, content: action.payload.content }
          : s,
      );
      return {
        ...state,
        scenario: { ...state.scenario, setupSteps: steps },
        isDirty: true,
      };
    }
    case "SET_SETUP_STEP_CHOICES": {
      if (!state.scenario) return state;
      const steps = (state.scenario.setupSteps ?? []).map((s, i) =>
        i === action.payload.stepIndex
          ? { ...s, choices: action.payload.choices }
          : s,
      );
      return {
        ...state,
        scenario: { ...state.scenario, setupSteps: steps },
        isDirty: true,
      };
    }
    case "SET_START_PARAGRAPH_ID": {
      if (!state.scenario) return state;
      return {
        ...state,
        scenario: {
          ...state.scenario,
          startParagraphId: action.payload || undefined,
        },
        isDirty: true,
      };
    }
    default:
      return state;
  }
}
