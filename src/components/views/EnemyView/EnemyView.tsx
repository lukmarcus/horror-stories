import React from "react";
import type { Enemy, EnemyAction } from "../../../types";
import { RichText } from "../../text/RichText/RichText";
import { OptionButton } from "../../ui";
import "./EnemyView.css";

interface EnemyViewProps {
  enemies: Enemy[];
  onClose: () => void;
  isRolling: boolean;
  diceRolls: number[];
  lastDiceResult: number | null;
  onRoll: (numDice: number) => Promise<void>;
}

export const EnemyView: React.FC<EnemyViewProps> = ({
  enemies,
  onClose,
  isRolling,
  diceRolls,
  lastDiceResult,
  onRoll,
}) => {
  const [selectedEnemyId, setSelectedEnemyId] = React.useState<string>(
    enemies[0]?.id ?? "",
  );

  const selectedEnemy = enemies.find((e) => e.id === selectedEnemyId);

  const getMatchingAction = (
    enemy: Enemy,
    total: number,
  ): EnemyAction | undefined => {
    // Use the first (base) variant's action table regardless of how many dice were rolled
    const variant = enemy.playerVariants[0];
    if (!variant) return undefined;
    return variant.actions.find((a) => a.value.includes(total));
  };

  return (
    <>
      <div className="game__content-nav">
        <OptionButton
          icon="◀️"
          line1="Menu"
          line2="scenariusza"
          onClick={onClose}
        />
      </div>

      <div className="game__scenario">
        <div className="game__scenario-header">
          <div className="game__scenario-label">Przeciwnik</div>
        </div>

        {/* Enemy tiles */}
        <div className="enemy-view__tiles">
          {enemies.map((enemy) => (
            <button
              key={enemy.id}
              className={`enemy-view__tile${selectedEnemyId === enemy.id ? " enemy-view__tile--selected" : ""}`}
              onClick={() => setSelectedEnemyId(enemy.id)}
              aria-pressed={selectedEnemyId === enemy.id}
            >
              <img
                src={`${import.meta.env.BASE_URL}assets/images/persons/${enemy.image}.jpg`}
                alt={enemy.name}
                className="enemy-view__tile-image"
              />
              <span className="enemy-view__tile-name">{enemy.name}</span>
            </button>
          ))}
        </div>

        {selectedEnemy && (
          <>
            {/* Dice buttons — base diceCount through maxDiceCount */}
            <div className="enemy-view__dice-buttons">
              {(() => {
                const base = selectedEnemy.playerVariants[0];
                if (!base) return null;
                const min = base.diceCount;
                const max = base.maxDiceCount ?? min;
                return Array.from(
                  { length: max - min + 1 },
                  (_, i) => min + i,
                ).map((n) => (
                  <button
                    key={n}
                    className="enemy-view__dice-btn"
                    disabled={isRolling}
                    onClick={() => onRoll(n)}
                  >
                    {n} × 🎲
                  </button>
                ));
              })()}
            </div>

            {/* Dice result */}
            {(isRolling || lastDiceResult !== null) && (
              <div className="enemy-view__result">
                <span className="enemy-view__result-value">
                  {diceRolls.length > 1
                    ? `${diceRolls.join(" + ")} = ${lastDiceResult ?? "..."}`
                    : diceRolls.length === 1
                      ? `${diceRolls[0]}`
                      : "..."}
                </span>
              </div>
            )}

            {/* Matched action */}
            {lastDiceResult !== null &&
              !isRolling &&
              (() => {
                const action = getMatchingAction(selectedEnemy, lastDiceResult);
                if (!action) return null;
                return (
                  <div className="enemy-view__action">
                    <div className="enemy-view__action-name">{action.name}</div>
                    {action.condition && (
                      <div className="enemy-view__action-condition">
                        <RichText text={action.condition} />
                      </div>
                    )}
                    {action.description && (
                      <div className="enemy-view__action-description">
                        <RichText text={action.description} />
                      </div>
                    )}
                  </div>
                );
              })()}
          </>
        )}
      </div>
    </>
  );
};
