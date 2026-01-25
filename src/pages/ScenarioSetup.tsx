import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useGameSetup } from "../contexts/GameSetupContext";
import { Button } from "../components/common";
import "./ScenarioSetup.css";

interface SetupStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
}

export const ScenarioSetup: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setSetup } = useGameSetup();
  const [currentStep, setCurrentStep] = useState(0);
  const [playerCount, setPlayerCount] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "">(
    "",
  );
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock scenario data
  const scenario = {
    id,
    title: "Tajemna Biblioteka",
    description: "Zaginęła księga starożytnych zaklęć. Musisz ją znaleźć.",
    difficulty: "easy",
    duration: "45 min",
  };

  const steps: SetupStep[] = [
    {
      id: "intro",
      title: "Witaj!",
      description: scenario.title,
      content: (
        <div className="scenario-setup__step-content">
          <p>{scenario.description}</p>
          <p className="scenario-setup__step-meta">
            Czas gry: <strong>{scenario.duration}</strong>
          </p>
        </div>
      ),
    },
    {
      id: "players",
      title: "Gracze",
      description: "Ile osób gra?",
      content: (
        <div className="scenario-setup__step-content">
          <div className="scenario-setup__player-selector">
            <label htmlFor="player-count">Liczba graczy:</label>
            <div className="scenario-setup__player-buttons">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  className={`scenario-setup__player-btn ${
                    playerCount === num
                      ? "scenario-setup__player-btn--active"
                      : ""
                  }`}
                  onClick={() => setPlayerCount(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "difficulty",
      title: "Trudność",
      description: "Wybierz poziom trudności",
      content: (
        <div className="scenario-setup__step-content">
          <div className="scenario-setup__difficulty-selector">
            {["easy", "medium", "hard"].map((level) => (
              <button
                key={level}
                className={`scenario-setup__difficulty-btn scenario-setup__difficulty-btn--${level} ${
                  difficulty === level
                    ? "scenario-setup__difficulty-btn--active"
                    : ""
                }`}
                onClick={() =>
                  setDifficulty(level as "easy" | "medium" | "hard")
                }
              >
                {level === "easy"
                  ? "Łatwa"
                  : level === "medium"
                    ? "Średnia"
                    : "Trudna"}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "audio",
      title: "Dźwięk",
      description: "Włącz/wyłącz muzykę",
      content: (
        <div className="scenario-setup__step-content">
          <div className="scenario-setup__audio-toggle">
            <label className="scenario-setup__toggle">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              <span>
                {soundEnabled ? "Muzyka włączona" : "Muzyka wyłączona"}
              </span>
            </label>
          </div>
        </div>
      ),
    },
    {
      id: "ready",
      title: "Gotowy?",
      description: "Wszystko jest ustawione",
      content: (
        <div className="scenario-setup__step-content">
          <div className="scenario-setup__summary">
            <p>
              <strong>Gracze:</strong> {playerCount}
            </p>
            <p>
              <strong>Trudność:</strong>{" "}
              {difficulty === "easy"
                ? "Łatwa"
                : difficulty === "medium"
                  ? "Średnia"
                  : "Trudna"}
            </p>
            <p>
              <strong>Dźwięk:</strong> {soundEnabled ? "Włączony" : "Wyłączony"}
            </p>
          </div>
        </div>
      ),
    },
  ];

  const validateStep = (stepId: string): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepId === "players" && playerCount === 0) {
      newErrors.players = "Wybierz liczbę graczy";
    }
    if (stepId === "difficulty" && difficulty === "") {
      newErrors.difficulty = "Wybierz poziom trudności";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    const currentStepId = steps[currentStep].id;
    if (validateStep(currentStepId)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleStartGame = () => {
    setSetup({
      playerCount,
      difficulty: difficulty as "easy" | "medium" | "hard",
      soundEnabled,
    });
    navigate(`/game/${id}`);
  };

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const isFirst = currentStep === 0;

  return (
    <main className="scenario-setup">
      <section className="scenario-setup__back">
        <Link to="/scenarios" className="scenario-setup__back-link">
          ← Wróć do listy
        </Link>
      </section>

      <div className="scenario-setup__container">
        {/* Progress Bar */}
        <div className="scenario-setup__progress">
          <div className="scenario-setup__progress-bar">
            <div
              className="scenario-setup__progress-fill"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <span className="scenario-setup__progress-text">
            Krok {currentStep + 1} / {steps.length}
          </span>
        </div>

        {/* Step Content */}
        <section className="scenario-setup__step">
          <div className="scenario-setup__step-header">
            <h1 className="scenario-setup__step-title">{step.title}</h1>
            <p className="scenario-setup__step-subtitle">{step.description}</p>
          </div>

          <div className="scenario-setup__step-body">{step.content}</div>

          {errors[step.id] && (
            <div className="scenario-setup__error">⚠️ {errors[step.id]}</div>
          )}

          {/* Navigation */}
          <div className="scenario-setup__step-footer">
            <Button
              variant="outline"
              size="md"
              onClick={handlePrev}
              disabled={isFirst}
            >
              ← Wstecz
            </Button>

            {isLast ? (
              <Button variant="primary" size="md" onClick={handleStartGame}>
                🎮 Zacznij Grę
              </Button>
            ) : (
              <Button variant="primary" size="md" onClick={handleNext}>
                Dalej →
              </Button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};
