import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/common";
import "../styles/pages/scenarios-list.css";

interface Scenario {
  id: string;
  title: string;
  description: string;
  duration: string;
  minPlayers: number;
  maxPlayers: number;
}

export const ScenariosList: React.FC = () => {
  // Mock scenarios
  const scenarios: Scenario[] = [
    {
      id: "1",
      title: "Tajemna Biblioteka",
      description:
        "Zaginęła księga starożytnych zaklęć. Musisz ją znaleźć, zanim będzie za późno.",
      duration: "45 min",
      minPlayers: 2,
      maxPlayers: 4,
    },
    {
      id: "2",
      title: "Opuszczony Szpital",
      description:
        "Budynek pełen tajemnic czeka na odkrycie. Każdy pokój kryje nowe niebezpieczeństwo.",
      duration: "60 min",
      minPlayers: 2,
      maxPlayers: 4,
    },
    {
      id: "3",
      title: "Nocny Koszmar",
      description:
        "Czy potrafisz przetrwać noc w domu nawiedzonym przez duchy? Musisz znaleźć sposób na ucieczkę.",
      duration: "90 min",
      minPlayers: 2,
      maxPlayers: 6,
    },
  ];

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
          <article key={scenario.id} className="scenarios-list__card">
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
                  {scenario.minPlayers}-{scenario.maxPlayers} graczy
                </span>
              </div>
            </div>

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
