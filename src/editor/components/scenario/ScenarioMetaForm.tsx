import React from "react";
import { useEditor } from "../../context/useEditor";
import type { Scenario } from "../../../types";
import "./ScenarioMetaForm.css";

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const ScenarioMetaForm: React.FC = () => {
  const { state, dispatch } = useEditor();
  const meta = state.scenario!.meta;
  const handleChange = (field: keyof Scenario, value: string) => {
    const updated: Scenario = { ...meta, [field]: value };
    if (field === "title") {
      updated.id = toSlug(value);
    }
    dispatch({ type: "SET_META", payload: updated });
  };

  return (
    <div className="meta-form">
      <h2 className="meta-form__title">Dane scenariusza</h2>

      <div className="meta-form__field">
        <label className="meta-form__label">Tytuł *</label>
        <input
          className="meta-form__input"
          type="text"
          value={meta.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="np. Mroczna noc w zamku"
        />
      </div>

      <div className="meta-form__field">
        <label className="meta-form__label">Opis</label>
        <textarea
          className="meta-form__textarea"
          value={meta.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Krótki opis scenariusza widoczny na liście..."
          rows={4}
        />
      </div>

      <div className="meta-form__row">
        <div className="meta-form__field">
          <label className="meta-form__label">Liczba graczy</label>
          <input
            className="meta-form__input"
            type="text"
            value={meta.playerCount}
            onChange={(e) => handleChange("playerCount", e.target.value)}
            placeholder="np. 1-2 graczy"
          />
        </div>

        <div className="meta-form__field">
          <label className="meta-form__label">Czas trwania</label>
          <input
            className="meta-form__input"
            type="text"
            value={meta.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
            placeholder="np. 90 min"
          />
        </div>
      </div>

      <div className="meta-form__field">
        <label className="meta-form__label">ID scenariusza</label>
        <input
          className="meta-form__input meta-form__input--muted"
          type="text"
          value={meta.id}
          readOnly
          placeholder="generowane z tytułu"
        />
        <span className="meta-form__hint">
          Generowany automatycznie z tytułu. Używany w adresie URL gry.
        </span>
      </div>
    </div>
  );
};
