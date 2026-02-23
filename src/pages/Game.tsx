import React from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { SCENARIOS, PARAGRAPHS, SETUP_DATA } from "../scenarios";
import { Button } from "../components/common";
import { ParagraphDisplay } from "../components/ParagraphDisplay";
import { RichText } from "../components/RichText";
import { useGame } from "../hooks/useGame";
import { useGameActions } from "../hooks/useGameActions";
import "../styles/pages/game.css";

export const Game: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const game = useGame();
  const gameActions = useGameActions();

  // Initialize paragraph from URL on mount
  React.useEffect(() => {
    const parFromUrl = searchParams.get("par");
    if (parFromUrl && !game.state.currentParagraphId) {
      game.setParagraph(parFromUrl);
    }
  }, []); // Only run once on mount

  // Update URL when paragraph changes
  React.useEffect(() => {
    if (game.state.currentParagraphId) {
      setSearchParams({ par: game.state.currentParagraphId });
    }
  }, [game.state.currentParagraphId, setSearchParams]);

  // Use imported game data
  const scenarios = SCENARIOS;
  const allParagraphs = PARAGRAPHS;
  const scenarioId = id || "droga-donikad";
  const paragraphs = allParagraphs[scenarioId] || {};

  const currentScenario = scenarios[scenarioId];
  const setupSteps = SETUP_DATA[scenarioId]?.steps || [];
  const currentParagraph = game.state.currentParagraphId
    ? paragraphs[game.state.currentParagraphId]
    : null;

  const handleJumpToParagraph = () => {
    game.clearError();

    const result = gameActions.jumpToParagraph(
      game.state.inputValue,
      paragraphs,
    );

    if (result.needsWarning && result.pendingId) {
      game.showWarning(result.pendingId);
      return;
    }

    if (!result.valid) {
      game.setError(result.error || "Błąd");
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
      {/* Scenario Title - Visible on all screens */}
      {currentScenario && (
        <h1 className="game__scenario-title">
          {currentScenario.title || "Scenariusz"}
        </h1>
      )}

      {/* Accessibility Warning Screen */}
      {game.state.showAccessibilityWarning && game.state.pendingParagraphId && (
        <section
          className="game__container game__accessibility-warning"
          aria-label="Ostrzeżenie o dostępności paragrafu"
        >
          <div className="game__warning-content">
            <div className="game__warning-box">
              <p className="game__warning-text">
                Paragraf #{game.state.pendingParagraphId} jest dostępny tylko z:
              </p>
              <div className="game__warning-sources">
                {paragraphs[game.state.pendingParagraphId]?.accessibleFrom?.map(
                  (source) => (
                    <div key={source} className="game__warning-source">
                      Paragraf #{source}
                    </div>
                  ),
                )}
              </div>
              <p className="game__warning-question">
                Czy chcesz mimo to przejść do tego paragrafu?
              </p>
              <div className="game__warning-buttons">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleConfirmAccessibility}
                >
                  Tak, rozumiem
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleCancelAccessibility}
                >
                  Powrót
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Setup Section - Full Screen View */}
      {game.state.showSetup && (
        <section className="game__setup-fullscreen">
          <div className="game__setup-header">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                game.resetSetupStep();
                game.toggleSetup();
              }}
              aria-label="Powrót do gry"
            >
              ← Wróć do gry
            </Button>
          </div>

          {setupSteps.length > 0 ? (
            <>
              <div className="game__setup-step">
                <div className="game__setup-step-header">
                  <div className="game__setup-step-number">
                    Krok {game.state.currentSetupStep + 1} z {setupSteps.length}
                  </div>
                  <div className="game__setup-controls">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => game.prevSetupStep()}
                      disabled={game.state.currentSetupStep === 0}
                    >
                      ← Poprzedni
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => game.nextSetupStep()}
                      disabled={
                        game.state.currentSetupStep === setupSteps.length - 1
                      }
                    >
                      Następny →
                    </Button>
                  </div>
                </div>
                <div className="game__setup-step-content">
                  {setupSteps[game.state.currentSetupStep]?.content && (
                    <RichText
                      content={setupSteps[game.state.currentSetupStep].content}
                      scenarioId={scenarioId}
                    />
                  )}
                  {setupSteps[game.state.currentSetupStep]?.text && (
                    <RichText
                      text={setupSteps[game.state.currentSetupStep].text}
                      scenarioId={scenarioId}
                    />
                  )}
                </div>
              </div>

              {game.state.currentSetupStep === setupSteps.length - 1 && (
                <div
                  style={{
                    display: "flex",
                    gap: "var(--spacing-md)",
                    width: "100%",
                  }}
                >
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      game.resetSetupStep();
                      game.toggleSetup();
                    }}
                  >
                    ← Wróć do wyboru
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      game.resetSetupStep();
                      game.toggleSetup();
                      game.setParagraph("77");
                    }}
                    style={{ flex: 1 }}
                  >
                    Przejdź do paragrafu 77
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className="game__setup-empty">
              Brak kroki przygotowania dla tego scenariusza.
            </p>
          )}
        </section>
      )}

      {/* Main Game View - Hidden when showing Setup or Warning */}
      {!game.state.showSetup && !game.state.showAccessibilityWarning && (
        <>
          {/* Container */}
          <div className="game__container">
            {/* INPUT MODE - Show input panel */}
            {!game.state.currentParagraphId ? (
              <section
                className="game__input-panel"
                aria-label="Panel wpisywania paragrafu"
              >
                <div className="game__input-header">
                  <p className="game__input-instruction">
                    Wprowadź poniżej numer wpisu, a następnie naciśnij
                    "PRZEJDŹ".
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
                      aria-describedby={
                        game.state.error ? "input-error" : undefined
                      }
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
                    ⚙️ Przygotuj Scenariusz
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
              <section
                className="game__setup-fullscreen"
                aria-label="Treść paragrafu"
              >
                <div className="game__setup-header">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBackToInput}
                    aria-label="Powrót do wyboru paragrafu"
                  >
                    ← Wróć
                  </Button>
                </div>
                {currentParagraph ? (
                  <ParagraphDisplay
                    paragraph={currentParagraph}
                    lastDiceResult={game.state.lastDiceResult}
                    onChoice={handleChoice}
                    onBack={handleBackToInput}
                    scenarioId={scenarioId}
                  />
                ) : (
                  <p className="game__error-text" role="alert">
                    Paragraf nie znaleziony
                  </p>
                )}
              </section>
            )}
          </div>
        </>
      )}
    </main>
  );
};
