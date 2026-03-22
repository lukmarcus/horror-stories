import { useReducer } from "react";

export interface GameState {
  currentParagraphId: string | null;
  variantPath: string[]; // Path of variant choices (for cumulative content)
  inputValue: string;
  showSetup: boolean;
  currentSetupStep: number;
  error: string;
  lastDiceResult: number | null;
  diceRolls: number[]; // Individual dice results for display
  isRollingDice: boolean;
  pendingParagraphId: string | null;
  showAccessibilityWarning: boolean;
  showDiceView: boolean;
}

type GameAction =
  | { type: "SET_PARAGRAPH"; payload: string | null }
  | { type: "ADD_VARIANT"; payload: string } // Append variant to path
  | { type: "CLEAR_VARIANTS" } // Reset variant path
  | { type: "SET_INPUT"; payload: string }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "TOGGLE_SETUP" }
  | { type: "NEXT_SETUP_STEP" }
  | { type: "PREV_SETUP_STEP" }
  | { type: "RESET_SETUP_STEP" }
  | { type: "SHOW_WARNING"; payload: string }
  | { type: "CLOSE_WARNING" }
  | { type: "TOGGLE_DICE_VIEW" }
  | { type: "SET_DICE_RESULT"; payload: number }
  | { type: "SET_DICE_ROLLS"; payload: number[] }
  | { type: "SET_ROLLING_DICE"; payload: boolean }
  | { type: "CLEAR_DICE_RESULT" }
  | { type: "RESET" };

export const initialState: GameState = {
  currentParagraphId: null,
  variantPath: [],
  inputValue: "",
  showSetup: false,
  currentSetupStep: 0,
  diceRolls: [],
  isRollingDice: false,
  error: "",
  lastDiceResult: null,
  pendingParagraphId: null,
  showDiceView: false,
  showAccessibilityWarning: false,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_PARAGRAPH":
      return {
        ...state,
        currentParagraphId: action.payload,
        variantPath: [],
        error: "",
      };
    case "ADD_VARIANT":
      return { ...state, variantPath: [...state.variantPath, action.payload] };
    case "CLEAR_VARIANTS":
      return { ...state, variantPath: [] };
    case "SET_INPUT":
      return { ...state, inputValue: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: "" };
    case "TOGGLE_SETUP":
      return { ...state, showSetup: !state.showSetup };
    case "NEXT_SETUP_STEP":
      return { ...state, currentSetupStep: state.currentSetupStep + 1 };
    case "PREV_SETUP_STEP":
      return {
        ...state,
        currentSetupStep: Math.max(0, state.currentSetupStep - 1),
      };
    case "RESET_SETUP_STEP":
      return { ...state, currentSetupStep: 0 };
    case "SHOW_WARNING":
      return {
        ...state,
        showAccessibilityWarning: true,
        pendingParagraphId: action.payload,
      };
    case "CLOSE_WARNING":
      return {
        ...state,
        showAccessibilityWarning: false,
        pendingParagraphId: null,
      };
    case "TOGGLE_DICE_VIEW":
      return { ...state, showDiceView: !state.showDiceView };
    case "SET_DICE_RESULT":
      return { ...state, lastDiceResult: action.payload };
    case "SET_DICE_ROLLS":
      return { ...state, diceRolls: action.payload };
    case "SET_ROLLING_DICE":
      return { ...state, isRollingDice: action.payload };
    case "CLEAR_DICE_RESULT":
      return { ...state, lastDiceResult: null, diceRolls: [] };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

interface UseGameReturn {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  setParagraph: (id: string | null) => void;
  addVariant: (id: string) => void;
  clearVariants: () => void;
  setInput: (value: string) => void;
  setError: (error: string) => void;
  clearError: () => void;
  toggleSetup: () => void;
  nextSetupStep: () => void;
  prevSetupStep: () => void;
  resetSetupStep: () => void;
  toggleDiceView: () => void;
  showWarning: (id: string) => void;
  closeWarning: () => void;
  setDiceResult: (result: number) => void;
  setDiceRolls: (rolls: number[]) => void;
  setRollingDice: (isRolling: boolean) => void;
  clearDiceResult: () => void;
  reset: () => void;
}

export function useGame(): UseGameReturn {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return {
    state,
    dispatch,
    // Convenience methods
    setParagraph: (id: string | null) =>
      dispatch({ type: "SET_PARAGRAPH", payload: id }),
    addVariant: (id: string) => dispatch({ type: "ADD_VARIANT", payload: id }),
    clearVariants: () => dispatch({ type: "CLEAR_VARIANTS" }),
    setInput: (value: string) =>
      dispatch({ type: "SET_INPUT", payload: value }),
    setError: (error: string) =>
      dispatch({ type: "SET_ERROR", payload: error }),
    clearError: () => dispatch({ type: "CLEAR_ERROR" }),
    toggleSetup: () => dispatch({ type: "TOGGLE_SETUP" }),
    nextSetupStep: () => dispatch({ type: "NEXT_SETUP_STEP" }),
    prevSetupStep: () => dispatch({ type: "PREV_SETUP_STEP" }),
    resetSetupStep: () => dispatch({ type: "RESET_SETUP_STEP" }),
    toggleDiceView: () => dispatch({ type: "TOGGLE_DICE_VIEW" }),
    showWarning: (id: string) =>
      dispatch({ type: "SHOW_WARNING", payload: id }),
    closeWarning: () => dispatch({ type: "CLOSE_WARNING" }),
    setDiceResult: (result: number) =>
      dispatch({ type: "SET_DICE_RESULT", payload: result }),
    setDiceRolls: (rolls: number[]) =>
      dispatch({ type: "SET_DICE_ROLLS", payload: rolls }),
    setRollingDice: (isRolling: boolean) =>
      dispatch({ type: "SET_ROLLING_DICE", payload: isRolling }),
    clearDiceResult: () => dispatch({ type: "CLEAR_DICE_RESULT" }),
    reset: () => dispatch({ type: "RESET" }),
  };
}
