import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/common";
import "./ScenariosList.css";

interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  duration: string;
  minPlayers: number;
  maxPlayers: number;
}

export const ScenariosList: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "all" | "easy" | "medium" | "hard"
  >("all");

  // Mock scenarios - będą wczytywane z JSON'a
  const scenarios: Scenario[] = [
    {
      id: "1",
      title: "Tajemna Biblioteka",
      description:
        "Zaginęła księga starożytnych zaklęć. Musisz ją znaleźć, zanim będzie za późno.",
      difficulty: "easy",
      duration: "45 min",
      minPlayers: 1,
      maxPlayers: 4,
    },
    {
      id: "2",
      title: "Opuszczony Szpital",
      description:
        "Budynek pełen tajemnic czeka na odkrycie. Każdy pokój kryje nowe niebezpieczeństwo.",
      difficulty: "medium",
      duration: "60 min",
      minPlayers: 2,
      maxPlayers: 4,
    },
    {
      id: "3",
      title: "Nocny Koszmar",
      description:
        "Czy potrafisz przetrwać noc w domu nawiedzonym przez duchy? Musisz znaleźć sposób na ucieczkę.",
      difficulty: "hard",
      duration: "90 min",
      minPlayers: 2,
      maxPlayers: 6,
    },
  ];

  const filteredScenarios =
    selectedDifficulty === "all"
      ? scenarios
      : scenarios.filter((s) => s.difficulty === selectedDifficulty);

  const getDifficultyColor = (
    difficulty: "easy" | "medium" | "hard",
  ): string => {
    switch (difficulty) {
      case "easy":
        return "easy";
      case "medium":
        return "medium";
      case "hard":
        return "hard";
    }
  };

  return (
    <main className="scenarios-list">
      <section className="scenarios-list__header">
        <h1 className="scenarios-list__title">Dostępne Scenariusze</h1>
        <p className="scenarios-list__subtitle">
          Wybierz scenariusz i zacznij swoją przygodę
        </p>
      </section>

      {/* Filters */}
      <section className="scenarios-list__filters">
        <div className="scenarios-list__filter-group">
          <span className="scenarios-list__filter-label">
            Filtruj po trudności:
          </span>
          <div className="scenarios-list__filter-buttons">
            {(["all", "easy", "medium", "hard"] as const).map((level) => (
              <button
                key={level}
                className={`scenarios-list__filter-btn ${
                  selectedDifficulty === level
                    ? "scenarios-list__filter-btn--active"
                    : ""
                }`}
                onClick={() => setSelectedDifficulty(level)}
              >
                {level === "all"
                  ? "Wszystkie"
                  : level === "easy"
                    ? "Łatwe"
                    : level === "medium"
                      ? "Średnie"
                      : "Trudne"}
              </button>
            ))}
          </div>
        </div>
        <p className="scenarios-list__count">
          {filteredScenarios.length} scenariusz(y)
        </p>
      </section>

      {/* Scenarios Grid */}
      <section className="scenarios-list__grid">
        {filteredScenarios.length > 0 ? (
          filteredScenarios.map((scenario) => (
            <article
              key={scenario.id}
              className={`scenarios-list__card scenarios-list__card--${getDifficultyColor(scenario.difficulty)}`}
            >
              <div className="scenarios-list__card-header">
                <h2 className="scenarios-list__card-title">{scenario.title}</h2>
                <span
                  className={`scenarios-list__difficulty scenarios-list__difficulty--${getDifficultyColor(scenario.difficulty)}`}
                >
                  {scenario.difficulty === "easy"
                    ? "Łatwe"
                    : scenario.difficulty === "medium"
                      ? "Średnie"
                      : "Trudne"}
                </span>
              </div>

              <p className="scenarios-list__card-description">
                {scenario.description}
              </p>

              <div className="scenarios-list__card-info">
                <div className="scenarios-list__info-item">
                  <span className="scenarios-list__info-icon">⏱</span>
                  <span className="scenarios-list__info-text">
                    {scenario.duration}
                  </span>
                </div>
                <div className="scenarios-list__info-item">
                  <span className="scenarios-list__info-icon">👥</span>
                  <span className="scenarios-list__info-text">
                    {scenario.minPlayers}-{scenario.maxPlayers} graczy
                  </span>
                </div>
              </div>

              <Link
                to={`/scenarios/${scenario.id}/setup`}
                className="scenarios-list__card-link"
              >
                <Button variant="primary" size="md" style={{ width: "100%" }}>
                  Przygotuj Scenariusz
                </Button>
              </Link>
            </article>
          ))
        ) : (
          <div className="scenarios-list__empty">
            <p>Brak scenariuszy dla wybranego filtra.</p>
          </div>
        )}
      </section>
    </main>
  );
};
