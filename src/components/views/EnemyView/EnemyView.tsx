import React from "react";
import type { Enemy } from "../../../types";
import { OptionButton } from "../../ui";
import { EnemyTiles } from "./EnemyTiles";
import { DiceButtons } from "./DiceButtons";
import { DiceResult } from "./DiceResult";
import { ActionDisplay } from "./ActionDisplay";
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
  }, [lastDiceResult, selectedEnemy]);

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

        <EnemyTiles
          enemies={enemies}
          selectedEnemyId={selectedEnemyId}
          onSelect={setSelectedEnemyId}
        />

        {selectedEnemy && (
          <>
            <DiceButtons
              baseCount={selectedEnemy.playerVariants[0]?.diceCount ?? 1}
              diceModifiers={diceModifiers}
              isRolling={isRolling}
              onRoll={onRoll}
            />

            <DiceResult
              isRolling={isRolling}
              diceRolls={diceRolls}
              lastDiceResult={lastDiceResult}
            />

            {lastDiceResult !== null &&
              !isRolling &&
              currentActionIndex !== null &&
              (() => {
                const variant = selectedEnemy.playerVariants[0];
                if (!variant) return null;
                const action = variant.actions[currentActionIndex];
                if (!action) return null;

                return (
                  <ActionDisplay
                    action={action}
                    conditionConfirmed={conditionConfirmed}
                    actionDiceResult={actionDiceResult}
                    actionDiceRolling={actionDiceRolling}
                    onConditionTrue={() => {
                      setConditionConfirmed(true);
                      if (action.actionDiceCount) {
                        void rollActionDice(action.actionDiceCount);
                      }
                    }}
                    onConditionFalse={() => {
                      setCurrentActionIndex(currentActionIndex - 1);
                      setConditionConfirmed(false);
                      setActionDiceResult(null);
                    }}
                  />
                );
              })()}
          </>
        )}
      </div>
    </>
  );
};
