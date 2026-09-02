import React from "react";
import { useEditor } from "../../context/useEditor";
import { ENEMIES } from "../../../data/enemies";
import "./EnemyMetaEditor.css";

export const EnemyMetaEditor: React.FC = () => {
  const { state, dispatch } = useEditor();
  const meta = state.scenario!.meta;

  const setMeta = (patch: Partial<typeof meta>) =>
    dispatch({ type: "SET_META", payload: { ...meta, ...patch } });

  const selectedIds = meta.enemies ?? [];

  const toggleEnemy = (id: string, checked: boolean) => {
    const next = checked
      ? [...selectedIds, id]
      : selectedIds.filter((e) => e !== id);
    setMeta({ enemies: next.length ? next : undefined });
  };

  return (
    <div className="enemy-meta">
      <h2 className="enemy-meta__title">Wróg scenariusza</h2>

      <div className="enemy-meta__field">
        <label className="enemy-meta__label">Przeciwnicy</label>
        <div className="enemy-meta__checklist">
          {Object.keys(ENEMIES).map((id) => (
            <label key={id} className="enemy-meta__check-row">
              <input
                type="checkbox"
                checked={selectedIds.includes(id)}
                onChange={(e) => toggleEnemy(id, e.target.checked)}
              />
              {ENEMIES[id].name} <span className="enemy-meta__id">({id})</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
