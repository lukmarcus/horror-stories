import React from "react";

interface DiceButtonsProps {
  baseCount: number;
  diceModifiers?: number[];
  isRolling: boolean;
  onRoll: (count: number) => void;
}

export const DiceButtons: React.FC<DiceButtonsProps> = ({
  baseCount,
  diceModifiers,
  isRolling,
  onRoll,
}) => {
  const counts = Array.from(
    new Set([baseCount, ...(diceModifiers ?? []).map((m) => baseCount + m)]),
  )
    .filter((n) => n > 0)
    .sort((a, b) => a - b);

  return (
    <div className="enemy-view__dice-buttons">
      {counts.map((n) => (
        <button
          key={n}
          className="enemy-view__dice-btn"
          disabled={isRolling}
          onClick={() => onRoll(n)}
        >
          {n} × 🎲
        </button>
      ))}
    </div>
  );
};
