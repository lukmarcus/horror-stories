import React from "react";
import type { Enemy } from "../../../types";

interface EnemyTilesProps {
  enemies: Enemy[];
  selectedEnemyId: string;
  onSelect: (enemyId: string) => void;
}

export const EnemyTiles: React.FC<EnemyTilesProps> = ({
  enemies,
  selectedEnemyId,
  onSelect,
}) => {
  return (
    <div className="enemy-view__tiles">
      {enemies.map((enemy) => (
        <button
          key={enemy.id}
          className={`enemy-view__tile${selectedEnemyId === enemy.id ? " enemy-view__tile--selected" : ""}`}
          onClick={() => onSelect(enemy.id)}
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
  );
};
