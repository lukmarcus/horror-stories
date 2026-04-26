import React from "react";
import type { Enemy, ActionOutcome } from "../../../types";
import { RichText } from "../../text/RichText/RichText";
import { OptionButton } from "../../ui";
import "./EnemyView.css";

interface EnemyViewProps {
  enemies: Enemy[];
  diceModifiers?: number[];
  onClose: () => void;
  isRolling: boolean;
  diceRolls: number[];
  lastDiceResult: number | null;
  onRoll: (numDice: number) => Promise<void>;
}

export const EnemyView: React.FC<EnemyViewProps> = ({
  enemies,
  diceModifiers,
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
  const [actionDiceResult, setActionDiceResult] = React.useState<
    number[] | null
  >(null);
  const [actionDiceRolling, setActionDiceRolling] = React.useState(false);

  const rollActionDice = async (count: number): Promise<void> => {
    setActionDiceRolling(true);
    setActionDiceResult(null);
    for (let frame = 0; frame < 10; frame++) {
      await new Promise((resolve) => setTimeout(resolve, 80));
      setActionDiceResult(
        Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1),
      );
    }
    const final = Array.from(
      { length: count },
      () => Math.floor(Math.random() * 6) + 1,
    );
    setActionDiceResult(final);
    setActionDiceRolling(false);
  };

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
        setActionDiceResult(null);
        setActionDiceRolling(false);
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
      setActionDiceResult(null);
      setActionDiceRolling(false);
    }
  }, [isRolling]);

  // Reset when enemy changes
  React.useEffect(() => {
    setCurrentActionIndex(null);
    setConditionConfirmed(false);
    setActionDiceResult(null);
    setActionDiceRolling(false);
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
            {/* Dice buttons — base + modifiers */}
            <div className="enemy-view__dice-buttons">
              {(() => {
                const base = selectedEnemy.playerVariants[0];
                if (!base) return null;
                const baseCount = base.diceCount;
                const counts = Array.from(
                  new Set([
                    baseCount,
                    ...(diceModifiers ?? []).map((m) => baseCount + m),
                  ]),
                )
                  .filter((n) => n > 0)
                  .sort((a, b) => a - b);
                return counts.map((n) => (
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
                          onClick={() => {
                            setConditionConfirmed(true);
                            if (action.actionDiceCount) {
                              void rollActionDice(action.actionDiceCount);
                            }
                          }}
                        >
                          Prawda
                        </button>
                        <button
                          className="enemy-view__condition-btn enemy-view__condition-btn--no"
                          onClick={() => {
                            setCurrentActionIndex(currentActionIndex - 1);
                            setConditionConfirmed(false);
                            setActionDiceResult(null);
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
                    {actionDiceResult !== null && (
                      <div className="enemy-view__action-dice-result">
                        {actionDiceResult.length > 1
                          ? `${actionDiceResult.join(" + ")} = ${actionDiceResult.reduce((a, b) => a + b, 0)}`
                          : `${actionDiceResult[0]}`}
                      </div>
                    )}
                    {!actionDiceRolling && (!action.actionDiceCount || actionDiceResult !== null) && (() => {
                      if (action.actionOutcomes && actionDiceResult !== null) {
                        const total = actionDiceResult.reduce((a, b) => a + b, 0);
                        const outcome: ActionOutcome | undefined = action.actionOutcomes.find((o) =>
                          o.values.includes(total),
                        );
                        return outcome ? (
                          <div className="enemy-view__action-description">
                            <RichText text={outcome.description} />
                          </div>
                        ) : null;
                      }
                      return action.description ? (
                        <div className="enemy-view__action-description">
                          <RichText text={action.description} />
                        </div>
                      ) : null;
                    })()}
                  </div>
                );
              })()}
          </>
        )}
      </div>
    </>
  );
};
