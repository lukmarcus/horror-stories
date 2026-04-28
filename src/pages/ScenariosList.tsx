import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SCENARIOS } from "../scenarios";
import { Button, BackToMenu } from "../components/ui";
import { importFromZip } from "../editor/utils/zipHandler";
import {
  loadUserScenarios,
  saveUserScenario,
  removeUserScenario,
} from "../utils/userScenarioStorage";
import type { Scenario } from "../types";
import "../styles/pages/scenarios-list.css";

const covers = import.meta.glob(
  "../scenarios/*/images/cover.{jpg,jpeg,png,webp}",
  { eager: true, import: "default" },
) as Record<string, string>;

function getCoverUrl(scenarioId: string): string | undefined {
  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    const url = covers[`../scenarios/${scenarioId}/images/cover.${ext}`];
    if (url) return url;
  }
  return undefined;
}

export const ScenariosList: React.FC = () => {
  const builtIn = Object.values(SCENARIOS);
  const [userScenarios, setUserScenarios] = useState<Scenario[]>(() =>
    loadUserScenarios(),
  );
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    try {
      const imported = await importFromZip(file);
      saveUserScenario(imported.meta);
      setUserScenarios(loadUserScenarios());
    } catch (err) {
      setImportError(
        err instanceof Error ? err.message : "Błąd wczytywania pliku.",
      );
    } finally {
      e.target.value = "";
    }
  };

  const userIds = new Set(userScenarios.map((s) => s.id));

  const handleRemove = (id: string) => {
    removeUserScenario(id);
    setUserScenarios(loadUserScenarios());
  };

  const scenarios = [...userScenarios, ...builtIn];

  return (
    <main className="page-layout">
      <div className="scenarios-list__top-bar">
        <BackToMenu />
        <button
          className="scenarios-list__import-btn"
          onClick={() => fileInputRef.current?.click()}
          title="Wczytaj scenariusz z pliku .horrorstory"
        >
          <span className="scenarios-list__import-icon">📂</span>
          <span className="scenarios-list__import-label">
            <span className="scenarios-list__import-line1">Wczytaj</span>
            <span className="scenarios-list__import-line2">.horrorstory</span>
          </span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".horrorstory"
          style={{ display: "none" }}
          onChange={handleImport}
        />
      </div>
      {importError && (
        <p className="scenarios-list__import-error">{importError}</p>
      )}
      <section className="page-header">
        <h1 className="page-header__title">Dostępne Scenariusze</h1>
        <p className="page-header__subtitle">
          Wybierz scenariusz i zacznij swoją przygodę
        </p>
      </section>

      {/* Scenarios Grid */}
      <section className="scenarios-list__grid">
        {scenarios.map((scenario) => (
          <article
            key={scenario.id}
            className={`scenarios-list__card${
              getCoverUrl(scenario.id) ? " scenarios-list__card--has-cover" : ""
            }`}
            style={(() => {
              const cover = getCoverUrl(scenario.id);
              return cover
                ? {
                    backgroundImage: `url(${cover})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                    backgroundRepeat: "no-repeat",
                  }
                : undefined;
            })()}
          >
            <div className="scenarios-list__card-header">
              <h2 className="scenarios-list__card-title">{scenario.title}</h2>
              {userIds.has(scenario.id) && (
                <button
                  className="scenarios-list__card-remove"
                  onClick={() => handleRemove(scenario.id)}
                  title="Usuń scenariusz z listy"
                  aria-label="Usuń scenariusz z listy"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9 3h6l1 1h4v2H4V4h4l1-1zm-4 5h14l-1.5 13H6.5L5 8zm4 2v9h1V10H9zm5 0v9h1V10h-1z" />
                  </svg>
                </button>
              )}
            </div>

            <p className="scenarios-list__card-description">
              {scenario.description}
            </p>

            <div className="scenarios-list__card-info">
              <div className="scenarios-list__info-item">
                <span className="scenarios-list__info-icon">⏱</span>
                <span className="scenarios-list__info-text">
                  {scenario.duration != null ? `${scenario.duration} min` : "—"}
                </span>
              </div>
              <div className="scenarios-list__info-item">
                <span className="scenarios-list__info-icon">👥</span>
                <span className="scenarios-list__info-text">
                  {scenario.minPlayerCount != null
                    ? scenario.minPlayerCount === scenario.maxPlayerCount
                      ? `${scenario.minPlayerCount} gracz`
                      : `${scenario.minPlayerCount}-${scenario.maxPlayerCount} graczy`
                    : "—"}
                </span>
              </div>
            </div>

            {/* Characters */}
            {scenario.characters && scenario.characters.length > 0 && (
              <div className="scenarios-list__metadata">
                <h3 className="scenarios-list__metadata-title">Postacie</h3>
                <p className="scenarios-list__metadata-content">
                  {scenario.characters.join(", ")}
                </p>
              </div>
            )}

            {/* Tokens */}
            {scenario.tokens && Object.keys(scenario.tokens).length > 0 && (
              <div className="scenarios-list__metadata">
                <h3 className="scenarios-list__metadata-title">Żetony</h3>
                <p className="scenarios-list__metadata-content">
                  {Object.entries(scenario.tokens)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ")}
                </p>
              </div>
            )}

            {/* Notes */}
            {scenario.notes && (
              <div className="scenarios-list__metadata">
                <h3 className="scenarios-list__metadata-title">Uwagi</h3>
                <p className="scenarios-list__metadata-content">
                  {scenario.notes}
                </p>
              </div>
            )}

            <Link
              to={`/game/${scenario.id}`}
              className="scenarios-list__card-link"
            >
              <Button variant="primary" size="md" style={{ width: "100%" }}>
                Zacznij Grę
              </Button>
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
};
