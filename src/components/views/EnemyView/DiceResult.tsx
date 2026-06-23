import React from "react";

interface DiceResultProps {
  isRolling: boolean;
  diceRolls: number[];
  lastDiceResult: number | null;
}

export const DiceResult: React.FC<DiceResultProps> = ({
  isRolling,
  diceRolls,
  lastDiceResult,
}) => {
  if (!isRolling && lastDiceResult === null) {
    return null;
  }

  return (
    <div className="enemy-view__result">
      <span className="enemy-view__result-value">
        {diceRolls.length > 1
          ? `${diceRolls.join(" + ")} = ${lastDiceResult ?? "..."}`
          : diceRolls.length === 1
            ? `${diceRolls[0]}`
            : "..."}
      </span>
    </div>
  );
};
