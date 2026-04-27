import React, { useState } from "react";
import { useEditor } from "../../context/useEditor";
import type { Scenario } from "../../../types";
import {
  TITLE_MAX,
  DESC_MAX,
  PLAYER_MIN,
  PLAYER_MAX,
  DURATION_MAX,
  toSlug,
  validateMeta,
} from "./scenarioMetaValidation";
import "./ScenarioMetaForm.css";

export const ScenarioMetaForm: React.FC = () => {
  const { state, dispatch } = useEditor();
  const meta = state.scenario!.meta;
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = validateMeta(meta);

  const handleChange = (field: keyof Scenario, value: string) => {
    const updated: Scenario = { ...meta, [field]: value };
    if (field === "title") updated.id = toSlug(value);
    dispatch({ type: "SET_META", payload: updated });
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleDurationChange = (value: string) => {
    const num = value === "" ? null : Number(value);
    dispatch({ type: "SET_META", payload: { ...meta, duration: num } });
  };

  const handlePlayerChange = (
    field: "minPlayerCount" | "maxPlayerCount",
    value: string,
  ) => {
    dispatch({
      type: "SET_META",
      payload: { ...meta, [field]: value === "" ? null : Number(value) },
    });
  };

  const fieldError = (field: string) =>
    touched[field] && errors[field] ? (
      <span className="meta-form__error">{errors[field]}</span>
    ) : null;

  return (
    <div className="meta-form">
      <h2 className="meta-form__title">Dane scenariusza</h2>

      <div className="meta-form__field">
        <div className="meta-form__label-row">
          <label className="meta-form__label">Tytuł</label>
          <span
            className={`meta-form__counter ${meta.title.length > TITLE_MAX ? "meta-form__counter--over" : ""}`}
          >
            {meta.title.length}/{TITLE_MAX}
          </span>
        </div>
        <span className="meta-form__hint">Wymagane.</span>
        <input
          className={`meta-form__input ${touched.title && errors.title ? "meta-form__input--error" : ""}`}
          type="text"
          value={meta.title}
          onChange={(e) => handleChange("title", e.target.value)}
          onBlur={() => handleBlur("title")}
          placeholder="np. Mroczna noc w zamku"
          maxLength={TITLE_MAX + 10}
        />
        {fieldError("title")}
      </div>

      <div className="meta-form__field">
        <div className="meta-form__label-row">
          <label className="meta-form__label">Opis</label>
          <span
            className={`meta-form__counter ${meta.description && meta.description.length > DESC_MAX ? "meta-form__counter--over" : ""}`}
          >
            {meta.description?.length ?? 0}/{DESC_MAX}
          </span>
        </div>
        <span className="meta-form__hint">
          Opcjonalny. Widoczny na liście scenariuszy.
        </span>
        <textarea
          className={`meta-form__textarea ${touched.description && errors.description ? "meta-form__input--error" : ""}`}
          value={meta.description}
          onChange={(e) => handleChange("description", e.target.value)}
          onBlur={() => handleBlur("description")}
          placeholder="Krótki opis scenariusza widoczny na liście..."
          rows={4}
        />
        {fieldError("description")}
      </div>

      <div className="meta-form__row">
        <div className="meta-form__field">
          <label className="meta-form__label">Liczba graczy</label>
          <span className="meta-form__hint">
            Opcjonalne. Wartości od 1 do 9.
          </span>
          <div className="meta-form__input-with-suffix">
            <input
              className={`meta-form__input ${touched.minPlayerCount && errors.minPlayerCount ? "meta-form__input--error" : ""}`}
              type="number"
              min={PLAYER_MIN}
              max={PLAYER_MAX}
              value={meta.minPlayerCount ?? ""}
              onChange={(e) =>
                handlePlayerChange("minPlayerCount", e.target.value)
              }
              onBlur={() => handleBlur("minPlayerCount")}
              placeholder="od"
            />
            <span className="meta-form__suffix">–</span>
            <input
              className={`meta-form__input ${touched.maxPlayerCount && errors.maxPlayerCount ? "meta-form__input--error" : ""}`}
              type="number"
              min={PLAYER_MIN}
              max={PLAYER_MAX}
              value={meta.maxPlayerCount ?? ""}
              onChange={(e) =>
                handlePlayerChange("maxPlayerCount", e.target.value)
              }
              onBlur={() => handleBlur("maxPlayerCount")}
              placeholder="do"
            />
            <span className="meta-form__suffix">graczy</span>
          </div>
          {fieldError("minPlayerCount")}
          {fieldError("maxPlayerCount")}
        </div>

        <div className="meta-form__field">
          <label className="meta-form__label">Czas trwania</label>
          <span className="meta-form__hint">
            Opcjonalne. Wartości od 1 do 999.
          </span>
          <div className="meta-form__input-with-suffix">
            <input
              className={`meta-form__input ${touched.duration && errors.duration ? "meta-form__input--error" : ""}`}
              type="number"
              min={1}
              max={DURATION_MAX}
              value={meta.duration ?? ""}
              onChange={(e) => handleDurationChange(e.target.value)}
              onBlur={() => handleBlur("duration")}
              placeholder="np. 90"
            />
            <span className="meta-form__suffix">min</span>
          </div>
          {fieldError("duration")}
        </div>
      </div>

      <div className="meta-form__field">
        <label className="meta-form__label">ID scenariusza</label>
        <span className="meta-form__hint">
          Generowany automatycznie z tytułu. Używany w adresie URL gry.
        </span>
        <input
          className="meta-form__input meta-form__input--muted"
          type="text"
          value={meta.id}
          readOnly
          placeholder="generowane z tytułu"
        />
      </div>
    </div>
  );
};
