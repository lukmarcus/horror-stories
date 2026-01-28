import React from "react";
import { useParams, Link } from "react-router-dom";
import { SCENARIOS, PARAGRAPHS } from "../data/scenarios";
import { Button } from "../components/common";
import { ParagraphDisplay } from "../components/ParagraphDisplay";
import { useGame } from "../hooks/useGame";
import { useGameActions } from "../hooks/useGameActions";
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
  const gameActions = useGameActions();

  // Use imported game data
  const scenarios = SCENARIOS;
  const paragraphs = PARAGRAPHS;

  const currentScenario = scenarios[id || "1"];
  const currentParagraph = game.state.currentParagraphId
    ? paragraphs[game.state.currentParagraphId]
    : null;

  const handleJumpToParagraph = () => {
    game.clearError();

    const result = gameActions.jumpToParagraph(game.state.inputValue, paragraphs);
    if (!result.valid) {
      game.setError(result.error || "Błąd");
      return;
    }

    if (result.needsWarning && result.pendingId) {
      game.showWarning(result.pendingId);
      return;
    }

    const nextId = game.state.inputValue.trim();
    game.setParagraph(nextId);
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
        <div
          className="game__dialog-overlay"
          role="presentation"
          aria-hidden={!game.state.showAccessibilityWarning}
        >
          <dialog
            className="game__dialog"
            open={game.state.showAccessibilityWarning}
            aria-labelledby="accessibility-dialog-title"
            aria-modal="true"
          >
            <h2 id="accessibility-dialog-title" className="game__dialog-title">
              Uwaga!
            </h2>
            <p className="game__dialog-text">
              Paragraf #{game.state.pendingParagraphId} jest dostępny tylko z:
            </p>
            <div
              className="game__dialog-sources"
              aria-label="Dostępne źródła paragrafu"
            >
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
          </dialog>
        </div>
      )}

      {/* Top Bar - Only in Paragraph Mode */}
      {game.state.currentParagraphId && (
        <nav className="game__top-bar" aria-label="Nawigacja gry">
          <div className="game__top-bar-content">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToInput}
              aria-label="Powrót do wyboru paragrafu"
            >
              ← Wróć
            </Button>
            <span
              className="game__scenario-info"
              aria-current="page"
            >
              Scenariusz #{id}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => game.toggleSetup()}
              aria-label={game.state.showSetup ? "Zamknij instrukcje" : "Pokaż instrukcje"}
            >
              {game.state.showSetup ? "Zamknij Setup" : "⚙️ Setup"}
            </Button>
          </div>
        </nav>
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
          <section className="game__input-panel" aria-label="Panel wpisywania paragrafu">
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
                  placeholder="np. 1, 2, 3..."
                  className="game__input"
                  aria-label="Numer paragrafu do odwiedzenia"
                  aria-describedby={game.state.error ? "input-error" : undefined}
                  aria-invalid={!!game.state.error}
                  autoFocus
                />
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleJumpToParagraph}
                  className="game__input-btn"
                  aria-label="Przejść do paragrafu"
                >
                  PRZEJDŹ
                </Button>
              </div>
              {game.state.error && (
                <p id="input-error" className="game__error" role="alert">
                  {game.state.error}
                </p>
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
          <section className="game__paragraph-section" aria-label="Treść paragrafu">
            {currentParagraph ? (
              <ParagraphDisplay
                paragraph={currentParagraph}
                lastDiceResult={game.state.lastDiceResult}
                onChoice={handleChoice}
                onBack={handleBackToInput}
              />
            ) : (
              <p className="game__error-text" role="alert">
                Paragraf nie znaleziony
              </p>
            )}
          </section>
        )}
      </div>
    </main>
  );
};

