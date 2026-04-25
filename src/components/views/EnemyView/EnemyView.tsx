import React from "react";
import type { Enemy } from "../../../types";
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
  const [currentActionIndex, setCurrentActionIndex] = React.useState<
    number | null
  >(null);
  const [conditionConfirmed, setConditionConfirmed] = React.useState(false);

  const selectedEnemy = enemies.find((e) => e.id === selectedEnemyId);

  // Reset on new roll result
  React.useEffect(() => {
    if (lastDiceResult !== null && selectedEnemy) {
      const variant = selectedEnemy.playerVariants[0];
      if (variant) {
        const idx = variant.actions.findIndex((a) =>
          a.value.includes(lastDiceResult),
        );
        setCurrentActionIndex(idx >= 0 ? idx : null);
        setConditionConfirmed(false);
      }
    } else {
      setCurrentActionIndex(null);
      setConditionConfirmed(false);
    }
  }, [lastDiceResult]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset when rolling starts
  React.useEffect(() => {
    if (isRolling) {
      setCurrentActionIndex(null);
      setConditionConfirmed(false);
    }
  }, [isRolling]);

  // Reset when enemy changes
  React.useEffect(() => {
    setCurrentActionIndex(null);
    setConditionConfirmed(false);
  }, [selectedEnemyId]);

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
              currentActionIndex !== null &&
              (() => {
                const variant = selectedEnemy.playerVariants[0];
                if (!variant) return null;
                const action = variant.actions[currentActionIndex];
                if (!action) return null;

                if (action.condition && !conditionConfirmed) {
                  return (
                    <div className="enemy-view__action">
                      <div className="enemy-view__action-name">
                        {action.name}
                      </div>
                      <div className="enemy-view__action-condition">
                        <RichText text={action.condition} />
                      </div>
                      <div className="enemy-view__action-condition-buttons">
                        <button
                          className="enemy-view__condition-btn enemy-view__condition-btn--yes"
                          onClick={() => setConditionConfirmed(true)}
                        >
                          Prawda
                        </button>
                        <button
                          className="enemy-view__condition-btn enemy-view__condition-btn--no"
                          onClick={() => {
                            setCurrentActionIndex(currentActionIndex - 1);
                            setConditionConfirmed(false);
                          }}
                        >
                          Fałsz
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="enemy-view__action">
                    <div className="enemy-view__action-name">{action.name}</div>
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
