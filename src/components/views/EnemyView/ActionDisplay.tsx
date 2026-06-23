import React from "react";
import type { EnemyAction, ActionOutcome } from "../../../types";
import { RichText } from "../../text/RichText/RichText";

interface ActionDisplayProps {
  action: EnemyAction;
  conditionConfirmed: boolean;
  actionDiceResult: number[] | null;
  actionDiceRolling: boolean;
  onConditionTrue: () => void;
  onConditionFalse: () => void;
}

export const ActionDisplay: React.FC<ActionDisplayProps> = ({
  action,
  conditionConfirmed,
  actionDiceResult,
  actionDiceRolling,
  onConditionTrue,
  onConditionFalse,
}) => {
  // Show condition prompt if condition exists and not yet confirmed
  if (action.condition && !conditionConfirmed) {
    return (
      <div className="enemy-view__action">
        <div className="enemy-view__action-name">{action.name}</div>
        <div className="enemy-view__action-condition">
          <RichText text={action.condition} />
        </div>
        <div className="enemy-view__action-condition-buttons">
          <button
            className="enemy-view__condition-btn enemy-view__condition-btn--yes"
            onClick={onConditionTrue}
          >
            Prawda
          </button>
          <button
            className="enemy-view__condition-btn enemy-view__condition-btn--no"
            onClick={onConditionFalse}
          >
            Fałsz
          </button>
        </div>
      </div>
    );
  }

  // Show action content (dice result + description/outcome)
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
      {!actionDiceRolling &&
        (!action.actionDiceCount || actionDiceResult !== null) &&
        (() => {
          if (action.actionOutcomes && actionDiceResult !== null) {
            const total = actionDiceResult.reduce((a, b) => a + b, 0);
            const outcome: ActionOutcome | undefined =
              action.actionOutcomes.find((o: ActionOutcome) =>
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
};
