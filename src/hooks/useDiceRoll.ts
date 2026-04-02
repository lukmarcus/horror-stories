import type { Dispatch } from "react";
import type { GameAction } from "./useGame";

export function useDiceRoll(
  dispatch: Dispatch<GameAction>,
): (numDice: number) => Promise<void> {
  return async (numDice: number): Promise<void> => {
    dispatch({ type: "SET_ROLLING_DICE", payload: true });
    dispatch({ type: "SET_DICE_ROLLS", payload: [] });
    dispatch({ type: "CLEAR_DICE_RESULT" });

    for (let frame = 0; frame < 10; frame++) {
      await new Promise((resolve) => setTimeout(resolve, 80));
      const tempRolls = Array(numDice)
        .fill(0)
        .map(() => Math.floor(Math.random() * 6) + 1);
      dispatch({ type: "SET_DICE_ROLLS", payload: tempRolls });
    }

    const results = Array(numDice)
      .fill(0)
      .map(() => Math.floor(Math.random() * 6) + 1);
    dispatch({ type: "SET_DICE_ROLLS", payload: results });
    const sum = results.reduce((a, b) => a + b, 0);
    dispatch({ type: "SET_DICE_RESULT", payload: sum });
    dispatch({ type: "SET_ROLLING_DICE", payload: false });
  };
}
