import React from "react";
import { useEditor } from "../../context/useEditor";
import { ENEMIES } from "../../../data/enemies";
import "./EnemyMetaEditor.css";

export const EnemyMetaEditor: React.FC = () => {
  const { state, dispatch } = useEditor();
  const meta = state.scenario!.meta;

  const setMeta = (patch: Partial<typeof meta>) =>
    dispatch({ type: "SET_META", payload: { ...meta, ...patch } });

  const modifiers = meta.enemyDiceModifiers ?? [];

  return (
    <div className="enemy-meta">
      <h2 className="enemy-meta__title">Wróg scenariusza</h2>

      <div className="enemy-meta__field">
        <label className="enemy-meta__label">ID wroga</label>
        <select
          className="enemy-meta__select"
          value={meta.enemyId ?? ""}
          onChange={(e) => setMeta({ enemyId: e.target.value || undefined })}
        >
          <option value="">— brak —</option>
          {Object.keys(ENEMIES).map((id) => (
            <option key={id} value={id}>
              {ENEMIES[id].name} ({id})
            </option>
          ))}
        </select>
      </div>

      <div className="enemy-meta__field">
        <label className="enemy-meta__label">Modyfikatory kości</label>
        <span className="enemy-meta__hint">
          Lista wartości dodawanych do rzutu kością gracza (np. [1] = +1 do
          każdego rzutu).
        </span>
        <div className="enemy-meta__modifiers">
          {modifiers.map((val: number, i: number) => (
            <div key={i} className="enemy-meta__modifier-row">
              <input
                className="enemy-meta__modifier-input"
                type="number"
                value={val}
                onChange={(e) => {
                  const next = [...modifiers];
                  next[i] = Number(e.target.value);
                  setMeta({ enemyDiceModifiers: next });
                }}
              />
              <button
                className="enemy-meta__modifier-remove"
                onClick={() =>
                  setMeta({
                    enemyDiceModifiers: modifiers.filter(
                      (_: number, j: number) => j !== i,
                    ),
                  })
                }
                aria-label={`Usuń modyfikator ${val}`}
              >
                ×
              </button>
            </div>
          ))}
          <button
            className="enemy-meta__modifier-add"
            onClick={() => setMeta({ enemyDiceModifiers: [...modifiers, 0] })}
          >
            + Dodaj modyfikator
          </button>
        </div>
      </div>
    </div>
  );
};
