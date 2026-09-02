import React from "react";

interface DiceButtonsProps {
  diceCount: number;
  isRolling: boolean;
  onRoll: (count: number) => void;
}

export const DiceButtons: React.FC<DiceButtonsProps> = ({
  diceCount,
  isRolling,
  onRoll,
}) => {
  return (
    <div className="enemy-view__dice-buttons">
      <button
        className="enemy-view__dice-btn"
        disabled={isRolling}
        onClick={() => onRoll(diceCount)}
      >
        {diceCount} × 🎲
      </button>
    </div>
  );
};
