import React, { useState } from "react";
import "./DiceRoller.css";

export interface DiceRollerProps {
  onRoll?: (result: number) => void;
  disabled?: boolean;
  showNextButton?: boolean;
  onNext?: () => void;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({
  onRoll,
  disabled = false,
  showNextButton = false,
  onNext,
}) => {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const rollDice = () => {
    if (isRolling || disabled) return;

    setIsRolling(true);
    setResult(null);

    // Simulate rolling animation (1200ms)
    setTimeout(() => {
      const newResult = Math.floor(Math.random() * 6) + 1;
      setResult(newResult);
      setIsRolling(false);

      if (onRoll) {
        onRoll(newResult);
      }
    }, 1200);
  };

  return (
    <div className="dice-roller">
      <button
        className={`dice-roller__button ${isRolling ? "dice-roller__button--rolling" : ""}`}
        onClick={rollDice}
        disabled={isRolling || disabled || result !== null}
        aria-label="Rzuć kostką"
      >
        {isRolling ? "🎲" : "🎲"}
      </button>

      {result !== null && (
        <div className="dice-roller__result">
          Wynik: <strong>{result}</strong>
        </div>
      )}

      {result !== null && showNextButton && onNext && (
        <button className="dice-roller__next-button" onClick={onNext}>
          Dalej →
        </button>
      )}

      {!result && !isRolling && (
        <div className="dice-roller__instruction">Kliknij aby rzucić</div>
      )}
    </div>
  );
};
