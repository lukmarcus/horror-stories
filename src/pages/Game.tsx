import React from "react";
import { useParams, Link } from "react-router-dom";
import { SCENARIOS, PARAGRAPHS } from "../data/scenarios";
import { Button } from "../components/common";
import { ParagraphDisplay } from "../components/ParagraphDisplay";
import { useGame } from "../hooks/useGame";
import { checkParagraphAccessibility } from "../utils/gameLogic";
import "../styles/pages/game.css";

const SETUP_STEPS = [
  "Gracze siedzą wokół stołu",
  "Każdy gracz ma kartkę i długopis",
  "Położyć planszę główną w środku",
  "Mieszać karty odkryć",
  "Jesteś gotowy! Zacznij przygodę",
];

export const Game: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const game = useGame();

  // Use imported game data
  const scenarios = SCENARIOS;
  const paragraphs = PARAGRAPHS;

  const currentScenario = scenarios[id || "1"];
  const currentParagraph = game.state.currentParagraphId
    ? paragraphs[game.state.currentParagraphId]
    : null;

  const handleJumpToParagraph = () => {
    const paragraphId = game.state.inputValue.trim();
    game.clearError();

    if (!paragraphId) {
      game.setError("Wpisz numer paragrafu");
      return;
    }

    if (!paragraphs[paragraphId]) {
      game.setError(`Paragraf #${paragraphId} nie istnieje`);
      return;
    }

    const paragraph = paragraphs[paragraphId];
    const accessibility = checkParagraphAccessibility(paragraphId, paragraph);

    // Check if paragraph is directly accessible
    if (!accessibility.isAccessible && accessibility.needsWarning) {
      game.showWarning(paragraphId);
      return;
    }

    game.setParagraph(paragraphId);
    game.setInput("");
  };

  const handleConfirmAccessibility = () => {
    if (game.state.pendingParagraphId) {
      game.setParagraph(game.state.pendingParagraphId);
      game.setInput("");
    }
    game.closeWarning();
  };

  const handleCancelAccessibility = () => {
    game.closeWarning();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleJumpToParagraph();
    }
  };

  const handleBackToInput = () => {
    game.reset();
  };

  const handleChoice = (nextId: string) => {
    game.setParagraph(nextId);
    game.clearDiceResult();
  };

  return (
    <main className="game">
      {/* Accessibility Warning Dialog */}
      {game.state.showAccessibilityWarning && game.state.pendingParagraphId && (
        <div className="game__dialog-overlay">
          <div className="game__dialog">
            <h2 className="game__dialog-title">Uwaga!</h2>
            <p className="game__dialog-text">
              Paragraf #{game.state.pendingParagraphId} jest dostępny tylko z:
            </p>
            <div className="game__dialog-sources">
              {paragraphs[game.state.pendingParagraphId]?.accessibleFrom?.join(", ")}
            </div>
            <p className="game__dialog-question">
              Czy chcesz mimo to przejść do tego paragrafu?
            </p>
            <div className="game__dialog-buttons">
              <Button
                variant="primary"
                size="md"
                onClick={handleConfirmAccessibility}
              >
                Tak
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={handleCancelAccessibility}
              >
                Nie
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar - Only in Paragraph Mode */}
      {game.state.currentParagraphId && (
        <div className="game__top-bar">
          <div className="game__top-bar-content">
            <Button variant="outline" size="sm" onClick={handleBackToInput}>
              ← Wróć
            </Button>
            <span className="game__scenario-info">Scenariusz #{id}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => game.toggleSetup()}
            >
              {game.state.showSetup ? "Zamknij Setup" : "⚙️ Setup"}
            </Button>
          </div>
        </div>
      )}

      {/* Setup Section */}
      {game.state.showSetup && (
        <section className="game__setup-section">
          <div className="game__setup-container">
            <h2 className="game__setup-title">Ustawienie początkowe</h2>
            <ol className="game__setup-list">
              {SETUP_STEPS.map((step, idx) => (
                <li key={idx} className="game__setup-item">
                  {step}
                </li>
              ))}
            </ol>
            <Button
              variant="primary"
              size="md"
              onClick={() => game.toggleSetup()}
            >
              Gotów! Zacznij grać
            </Button>
          </div>
        </section>
      )}

      {/* Container */}
      <div className="game__container">
        {/* INPUT MODE - Show input panel */}
        {!game.state.currentParagraphId ? (
          <section className="game__input-panel">
            <div className="game__input-header">
              <h1 className="game__scenario-title">
                {currentScenario?.title || "Scenariusz"}
              </h1>
              <p className="game__input-instruction">
                Wprowadź poniżej numer wpisu, a następnie naciśnij "PRZEJDŹ".
              </p>
            </div>

            <div className="game__input-wrapper">
              <div className="game__input-group">
                <input
                  type="text"
                  value={game.state.inputValue}
                  onChange={(e) => game.setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder=""
                  className="game__input"
                  autoFocus
                />
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleJumpToParagraph}
                  className="game__input-btn"
                >
                  PRZEJDŹ
                </Button>
              </div>
              {game.state.error && (
                <p className="game__error">{game.state.error}</p>
              )}
            </div>

            {/* Options */}
            <div className="game__options">
              <Button
                variant="outline"
                size="sm"
                onClick={() => game.toggleSetup()}
                className="game__option-btn"
              >
                ⚙️ {game.state.showSetup ? "Zamknij Setup" : "Przygotuj Scenariusz"}
              </Button>
              <Link to="/scenarios" className="game__option-link">
                <Button variant="secondary" size="sm">
                  ← Powrót do Menu
                </Button>
              </Link>
            </div>
          </section>
        ) : (
          /* PARAGRAPH MODE - Show paragraph */
          <section className="game__paragraph-section">
            {currentParagraph ? (
              <ParagraphDisplay
                paragraph={currentParagraph}
                lastDiceResult={game.state.lastDiceResult}
                onChoice={handleChoice}
                onBack={handleBackToInput}
              />
            ) : (
              <p className="game__error-text">Paragraf nie znaleziony</p>
            )}
          </section>
        )}
      </div>
    </main>
  );
};

