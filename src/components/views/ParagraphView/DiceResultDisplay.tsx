import React from "react";
import type { DiceResult } from "../../../types";
import { Button } from "../../ui";

interface DiceResultDisplayProps {
  diceResult: DiceResult;
  lastDiceResult: number;
  isDiceRollSuccess: boolean;
  onChoice: (nextId: string | undefined, isVariant?: boolean) => void;
}

export const DiceResultDisplay: React.FC<DiceResultDisplayProps> = ({
  diceResult,
  isDiceRollSuccess,
  onChoice,
}) => {
  return (
    <div className="dice-result" role="status" aria-live="assertive">
      <p>{isDiceRollSuccess ? diceResult.successText : diceResult.failText}</p>
      <Button
        variant="primary"
        onClick={() =>
          onChoice(
            isDiceRollSuccess
              ? diceResult.successNextId
              : diceResult.failNextId,
            false,
          )
        }
        aria-label="Przejść do następnego paragrafu"
      >
        PRZEJDŹ
      </Button>
    </div>
  );
};
