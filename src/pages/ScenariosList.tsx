import React from "react";
import { Link } from "react-router-dom";
import { SCENARIOS } from "../scenarios";
import { Button } from "../components/ui";
import "../styles/pages/scenarios-list.css";

export const ScenariosList: React.FC = () => {
  // Load scenarios from data
  const scenarios = Object.values(SCENARIOS);

  return (
    <main className="scenarios-list">
      <section className="scenarios-list__header">
        <h1 className="scenarios-list__title">Dostępne Scenariusze</h1>
        <p className="scenarios-list__subtitle">
          Wybierz scenariusz i zacznij swoją przygodę
        </p>
      </section>

      {/* Scenarios Grid */}
      <section className="scenarios-list__grid">
        {scenarios.map((scenario) => (
          <article
            key={scenario.id}
            className={`scenarios-list__card${
              scenario.coverImage ? " scenarios-list__card--has-cover" : ""
            }`}
            style={
              scenario.coverImage
                ? {
                    backgroundImage: `url(${import.meta.env.BASE_URL}${scenario.coverImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                    backgroundRepeat: "no-repeat",
                  }
                : undefined
            }
          >
            <div className="scenarios-list__card-header">
              <h2 className="scenarios-list__card-title">{scenario.title}</h2>
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
                  {scenario.playerCount}
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
