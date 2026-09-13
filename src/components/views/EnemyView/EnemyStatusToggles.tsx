import React from "react";

interface StatusOption {
  id: string;
  name?: string | null;
  diceModifier?: number;
}

interface EnemyStatusTogglesProps {
  statuses: StatusOption[];
  activeStatusIds: Set<string>;
  onToggle: (id: string) => void;
}

export const EnemyStatusToggles: React.FC<EnemyStatusTogglesProps> = ({
  statuses,
  activeStatusIds,
  onToggle,
}) => {
  if (statuses.length === 0) return null;

  return (
    <div className="enemy-view__status-toggles">
      <div className="enemy-view__status-label">Statusy przeciwnika:</div>
      <div className="enemy-view__status-buttons">
        {statuses.map((status) => {
          const active = activeStatusIds.has(status.id);
          const modifier = status.diceModifier ?? 0;
          const modifierLabel = modifier > 0 ? `+${modifier}` : `${modifier}`;
          const label = `${status.name ?? status.id} (${modifierLabel})`;
          return (
            <button
              key={status.id}
              type="button"
              className={`enemy-view__status-btn enemy-view__status-btn--${status.id}${active ? " enemy-view__status-btn--active" : ""}`}
              aria-pressed={active}
              aria-label={label}
              title={label}
              onClick={() => onToggle(status.id)}
            >
              <img
                src={`${import.meta.env.BASE_URL}assets/images/statuses/${status.id}.jpg`}
                alt=""
                className="enemy-view__status-image"
              />
              <span className="enemy-view__status-modifier">
                {modifierLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
