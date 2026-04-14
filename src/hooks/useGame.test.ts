import { describe, it, expect } from "vitest";
import { gameReducer, initialState } from "./useGame";

describe("gameReducer", () => {
  describe("SET_PARAGRAPH", () => {
    it("should set currentParagraphId and reset variantPath and error", () => {
      const state = { ...initialState, variantPath: ["jessica"], error: "err" };
      const result = gameReducer(state, {
        type: "SET_PARAGRAPH",
        payload: "42",
      });
      expect(result.currentParagraphId).toBe("42");
      expect(result.variantPath).toEqual([]);
      expect(result.error).toBe("");
    });

    it("should accept null payload", () => {
      const state = { ...initialState, currentParagraphId: "1" };
      const result = gameReducer(state, {
        type: "SET_PARAGRAPH",
        payload: null,
      });
      expect(result.currentParagraphId).toBeNull();
    });
  });

  describe("ADD_VARIANT", () => {
    it("should append variant to path", () => {
      const state = { ...initialState, variantPath: ["jessica"] };
      const result = gameReducer(state, {
        type: "ADD_VARIANT",
        payload: "option-a",
      });
      expect(result.variantPath).toEqual(["jessica", "option-a"]);
    });

    it("should start from empty path", () => {
      const result = gameReducer(initialState, {
        type: "ADD_VARIANT",
        payload: "jessica",
      });
      expect(result.variantPath).toEqual(["jessica"]);
    });
  });

  describe("CLEAR_VARIANTS", () => {
    it("should reset variantPath to empty array", () => {
      const state = { ...initialState, variantPath: ["jessica", "patrick"] };
      const result = gameReducer(state, { type: "CLEAR_VARIANTS" });
      expect(result.variantPath).toEqual([]);
    });
  });

  describe("SET_INPUT / SET_ERROR / CLEAR_ERROR", () => {
    it("SET_INPUT should update inputValue", () => {
      const result = gameReducer(initialState, {
        type: "SET_INPUT",
        payload: "42",
      });
      expect(result.inputValue).toBe("42");
    });

    it("SET_ERROR should set error string", () => {
      const result = gameReducer(initialState, {
        type: "SET_ERROR",
        payload: "Nie istnieje",
      });
      expect(result.error).toBe("Nie istnieje");
    });

    it("CLEAR_ERROR should reset error to empty string", () => {
      const state = { ...initialState, error: "Błąd" };
      const result = gameReducer(state, { type: "CLEAR_ERROR" });
      expect(result.error).toBe("");
    });
  });

  describe("Setup steps", () => {
    it("TOGGLE_SETUP should flip showSetup", () => {
      expect(
        gameReducer(initialState, { type: "TOGGLE_SETUP" }).showSetup,
      ).toBe(true);
      const open = { ...initialState, showSetup: true };
      expect(gameReducer(open, { type: "TOGGLE_SETUP" }).showSetup).toBe(false);
    });

    it("NEXT_SETUP_STEP should increment currentSetupStep", () => {
      const result = gameReducer(initialState, { type: "NEXT_SETUP_STEP" });
      expect(result.currentSetupStep).toBe(1);
    });

    it("PREV_SETUP_STEP should decrement but not go below 0", () => {
      const atOne = { ...initialState, currentSetupStep: 1 };
      expect(
        gameReducer(atOne, { type: "PREV_SETUP_STEP" }).currentSetupStep,
      ).toBe(0);
      expect(
        gameReducer(initialState, { type: "PREV_SETUP_STEP" }).currentSetupStep,
      ).toBe(0);
    });

    it("RESET_SETUP_STEP should return to 0", () => {
      const state = { ...initialState, currentSetupStep: 5 };
      expect(
        gameReducer(state, { type: "RESET_SETUP_STEP" }).currentSetupStep,
      ).toBe(0);
    });
  });

  describe("Accessibility warning", () => {
    it("SHOW_WARNING should set showAccessibilityWarning and pendingParagraphId", () => {
      const result = gameReducer(initialState, {
        type: "SHOW_WARNING",
        payload: "15",
      });
      expect(result.showAccessibilityWarning).toBe(true);
      expect(result.pendingParagraphId).toBe("15");
    });

    it("CLOSE_WARNING should clear warning state", () => {
      const state = {
        ...initialState,
        showAccessibilityWarning: true,
        pendingParagraphId: "15",
      };
      const result = gameReducer(state, { type: "CLOSE_WARNING" });
      expect(result.showAccessibilityWarning).toBe(false);
      expect(result.pendingParagraphId).toBeNull();
    });
  });

  describe("Dice", () => {
    it("TOGGLE_DICE_VIEW should flip showDiceView", () => {
      expect(
        gameReducer(initialState, { type: "TOGGLE_DICE_VIEW" }).showDiceView,
      ).toBe(true);
    });

    it("SET_DICE_RESULT should set lastDiceResult", () => {
      const result = gameReducer(initialState, {
        type: "SET_DICE_RESULT",
        payload: 5,
      });
      expect(result.lastDiceResult).toBe(5);
    });

    it("SET_DICE_ROLLS should set diceRolls array", () => {
      const result = gameReducer(initialState, {
        type: "SET_DICE_ROLLS",
        payload: [3, 5],
      });
      expect(result.diceRolls).toEqual([3, 5]);
    });

    it("SET_ROLLING_DICE should set isRollingDice flag", () => {
      expect(
        gameReducer(initialState, { type: "SET_ROLLING_DICE", payload: true })
          .isRollingDice,
      ).toBe(true);
    });

    it("CLEAR_DICE_RESULT should reset lastDiceResult and diceRolls", () => {
      const state = { ...initialState, lastDiceResult: 4, diceRolls: [2, 4] };
      const result = gameReducer(state, { type: "CLEAR_DICE_RESULT" });
      expect(result.lastDiceResult).toBeNull();
      expect(result.diceRolls).toEqual([]);
    });
  });

  describe("RESET", () => {
    it("should return initialState", () => {
      const dirty = {
        ...initialState,
        currentParagraphId: "99",
        variantPath: ["jessica"],
        error: "err",
        showSetup: true,
        currentSetupStep: 3,
        lastDiceResult: 6,
      };
      const result = gameReducer(dirty, { type: "RESET" });
      expect(result.currentParagraphId).toBeNull();
      expect(result.variantPath).toEqual([]);
      expect(result.error).toBe("");
      expect(result.showSetup).toBe(false);
      expect(result.currentSetupStep).toBe(0);
      expect(result.lastDiceResult).toBeNull();
    });
  });

  describe("TOGGLE_ALPHABET_VIEW", () => {
    it("should flip showAlphabetView", () => {
      expect(
        gameReducer(initialState, { type: "TOGGLE_ALPHABET_VIEW" })
          .showAlphabetView,
      ).toBe(true);
      const open = { ...initialState, showAlphabetView: true };
      expect(
        gameReducer(open, { type: "TOGGLE_ALPHABET_VIEW" }).showAlphabetView,
      ).toBe(false);
    });
  });

  describe("SET_PARAGRAPH_FROM_ALPHABET", () => {
    it("should set currentParagraphId and mark fromAlphabet as true", () => {
      const result = gameReducer(initialState, {
        type: "SET_PARAGRAPH_FROM_ALPHABET",
        payload: "30",
      });
      expect(result.currentParagraphId).toBe("30");
      expect(result.fromAlphabet).toBe(true);
      expect(result.variantPath).toEqual([]);
      expect(result.error).toBe("");
    });

    it("SET_PARAGRAPH should clear fromAlphabet flag", () => {
      const state = {
        ...initialState,
        fromAlphabet: true,
        currentParagraphId: "30",
      };
      const result = gameReducer(state, {
        type: "SET_PARAGRAPH",
        payload: "5",
      });
      expect(result.fromAlphabet).toBe(false);
      expect(result.currentParagraphId).toBe("5");
    });

    it("fromAlphabet is false in initialState", () => {
      expect(initialState.fromAlphabet).toBe(false);
    });
  });

  describe("SET_PARAGRAPH clears variants (integration)", () => {
    it("should add variant to path", () => {
      let variantPath: string[] = [];
      const addVariant = (id: string) => {
        variantPath = [...variantPath, id];
      };

      addVariant("jessica");
      expect(variantPath).toEqual(["jessica"]);

      const s1 = gameReducer(initialState, {
        type: "ADD_VARIANT",
        payload: "jessica",
      });
      const s2 = gameReducer(s1, {
        type: "ADD_VARIANT",
        payload: "patrick-lezy",
      });
      expect(s2.variantPath).toEqual(["jessica", "patrick-lezy"]);

      const s3 = gameReducer(s2, { type: "SET_PARAGRAPH", payload: "40" });
      expect(s3.currentParagraphId).toBe("40");
      expect(s3.variantPath).toEqual([]);
    });
  });
});
