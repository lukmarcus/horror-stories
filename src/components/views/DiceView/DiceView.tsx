import React from "react";
import { Button } from "../../ui";
import "./DiceView.css";

interface DiceViewProps {
  onClose: () => void;
  isRolling: boolean;
  diceRolls: number[];
  lastDiceResult: number | null;
  onRoll: (numDice: number) => Promise<void>;
}

export const DiceView: React.FC<DiceViewProps> = ({
  onClose,
  isRolling,
  diceRolls,
  lastDiceResult,
  onRoll,
}) => {
  return (
    <>
      <div className="game__content-nav">
        <Button
          variant="secondary"
          size="sm"
          onClick={onClose}
          aria-label="Powrót do menu"
        >
          ◀️ Menu scenariusza
        </Button>
      </div>

      <div className="game__scenario">
        <div className="game__scenario-header">
          <div className="game__scenario-label">Rzut kością</div>
        </div>
        <div className="dice-view__container">
          <p className="dice-view__instruction">
            Ile razy chcesz rzucić kością?
          </p>
          <div className="dice-view__buttons">
            {[1, 2, 3].map((numDice) => (
              <Button
                key={numDice}
                variant="primary"
                size="lg"
                disabled={isRolling}
                onClick={() => onRoll(numDice)}
                title={`Rzuć ${numDice}x`}
              >
                {numDice}x 🎲
              </Button>
            ))}
          </div>
          {(isRolling || lastDiceResult !== null) && (
            <div className="dice-view__result">
              <span className="dice-view__result-label">Wynik:</span>
              <span className="dice-view__result-value">
                {diceRolls.length > 0
                  ? diceRolls.length === 1
                    ? `${diceRolls[0]}${lastDiceResult !== null ? "" : ""}`
                    : `${diceRolls.join(" + ")}${lastDiceResult !== null ? ` = ${lastDiceResult}` : ""}`
                  : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
