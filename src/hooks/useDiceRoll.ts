import type { Dispatch } from "react";
import type { GameAction } from "./useGame";
import { rollDice } from "../utils/diceRoll";

export function useDiceRoll(
  dispatch: Dispatch<GameAction>,
): (numDice: number) => Promise<void> {
  return async (numDice: number): Promise<void> => {
    dispatch({ type: "SET_ROLLING_DICE", payload: true });
    dispatch({ type: "SET_DICE_ROLLS", payload: [] });
    dispatch({ type: "CLEAR_DICE_RESULT" });

    for (let frame = 0; frame < 10; frame++) {
      await new Promise((resolve) => setTimeout(resolve, 80));
      dispatch({ type: "SET_DICE_ROLLS", payload: rollDice(numDice) });
    }

    const results = rollDice(numDice);
    dispatch({ type: "SET_DICE_ROLLS", payload: results });
    const sum = results.reduce((a, b) => a + b, 0);
    dispatch({ type: "SET_DICE_RESULT", payload: sum });
    dispatch({ type: "SET_ROLLING_DICE", payload: false });
  };
}
