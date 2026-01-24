import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "../components/common";
import "./ScenarioSetup.css";

export const ScenarioSetup: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [playerCount, setPlayerCount] = useState(2);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Mock scenario data
  const scenario = {
    id,
    title: "Tajemna Biblioteka",
    description: "Zaginęła księga starożytnych zaklęć. Musisz ją znaleźć.",
    difficulty: "easy",
    duration: "45 min",
    components: [
      "Pioneer zaklęć (20 sztuk)",
      "Token zniszczenia (15 sztuk)",
      "Plansza główna",
      "Karty odkryć (40 sztuk)",
    ],
    rules: [
      "Gracze wybierają wspólnie ścieżkę przygody",
      "Każdy rzut kością wpływa na dalszy ciąg historii",
      "Zbieraj przedmioty i wskazówki",
      "Unikaj przeszkód w drodze do wyjścia",
    ],
  };

  const handleStartGame = () => {
    // Tutaj byłby kod do inicjalizacji gry
    navigate(`/game/${id}`);
  };

  return (
    <main className="scenario-setup">
      <section className="scenario-setup__back">
        <Link to="/scenarios" className="scenario-setup__back-link">
          ← Wróć do listy
        </Link>
      </section>

      <div className="scenario-setup__container">
        {/* Left Column */}
        <section className="scenario-setup__info">
          <h1 className="scenario-setup__title">{scenario.title}</h1>
          <p className="scenario-setup__description">{scenario.description}</p>

          <div className="scenario-setup__meta">
            <div className="scenario-setup__meta-item">
              <span className="scenario-setup__meta-label">Trudność</span>
              <span className="scenario-setup__meta-value">
                {scenario.difficulty}
              </span>
            </div>
            <div className="scenario-setup__meta-item">
              <span className="scenario-setup__meta-label">Czas gry</span>
              <span className="scenario-setup__meta-value">
                {scenario.duration}
              </span>
            </div>
          </div>

          <section className="scenario-setup__section">
            <h2 className="scenario-setup__section-title">Komponenty Gry</h2>
            <ul className="scenario-setup__list">
              {scenario.components.map((component, idx) => (
                <li key={idx} className="scenario-setup__list-item">
                  {component}
                </li>
              ))}
            </ul>
          </section>

          <section className="scenario-setup__section">
            <h2 className="scenario-setup__section-title">Zasady Gry</h2>
            <ol className="scenario-setup__rules">
              {scenario.rules.map((rule, idx) => (
                <li key={idx} className="scenario-setup__rule-item">
                  {rule}
                </li>
              ))}
            </ol>
          </section>
        </section>

        {/* Right Column */}
        <section className="scenario-setup__controls">
          <div className="scenario-setup__panel">
            <h2 className="scenario-setup__panel-title">Ustawienia Gry</h2>

            {/* Player Count */}
            <div className="scenario-setup__setting">
              <label className="scenario-setup__label">Liczba Graczy</label>
              <div className="scenario-setup__player-controls">
                <button
                  className="scenario-setup__player-btn"
                  onClick={() => setPlayerCount((p) => Math.max(1, p - 1))}
                >
                  −
                </button>
                <span className="scenario-setup__player-count">
                  {playerCount}
                </span>
                <button
                  className="scenario-setup__player-btn"
                  onClick={() => setPlayerCount((p) => Math.min(6, p + 1))}
                >
                  +
                </button>
              </div>
            </div>

            {/* Sound Toggle */}
            <div className="scenario-setup__setting">
              <label className="scenario-setup__label">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="scenario-setup__checkbox"
                />
                Dźwięki atmosferyczne
              </label>
            </div>

            {/* Info Box */}
            <div className="scenario-setup__info-box">
              <p className="scenario-setup__info-text">
                ℹ️ Upewnij się, że masz dostęp do wszystkich komponentów gry
                przed rozpoczęciem.
              </p>
            </div>

            {/* Actions */}
            <div className="scenario-setup__actions">
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartGame}
                style={{ width: "100%" }}
              >
                Zacznij Grę
              </Button>
              <Link to="/scenarios">
                <Button variant="secondary" size="lg" style={{ width: "100%" }}>
                  Anuluj
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
