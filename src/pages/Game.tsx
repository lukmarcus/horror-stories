import React from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { SCENARIOS, PARAGRAPHS, SETUP_DATA } from "../scenarios";
import { Button } from "../components/common";
import { ParagraphDisplay } from "../components/ParagraphDisplay";
import { ParagraphInput } from "../components/ParagraphInput";
import { RichText } from "../components/RichText";
import { useGame } from "../hooks/useGame";
import { useGameActions } from "../hooks/useGameActions";
import "../styles/pages/game.css";

export const Game: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const game = useGame();
  const gameActions = useGameActions();

  // Flag: true when state change was triggered by URL (back/forward), not by user action
  const isUrlDrivenChange = React.useRef(false);

  // Effect 1: URL → State (handles back/forward navigation)
  React.useEffect(() => {
    const parFromUrl = new URLSearchParams(location.search).get("par");
    const currentPar = game.state.currentParagraphId;
    if (parFromUrl !== currentPar) {
      isUrlDrivenChange.current = true;
      game.setParagraph(parFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Effect 2: State → URL (handles user clicking a choice)
  React.useEffect(() => {
    const currentPar = game.state.currentParagraphId;

    // If the state change came from the URL (Effect 1), don't push a new URL
    if (isUrlDrivenChange.current) {
      isUrlDrivenChange.current = false;
      return;
    }

    // Don't push URL if it already matches state (avoids duplicate history entries)
    const parFromUrl = new URLSearchParams(location.search).get("par");
    if (currentPar === parFromUrl) return;

    if (currentPar) {
      navigate(`?par=${currentPar}`, { replace: false });
    } else {
      navigate({ search: "" }, { replace: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.state.currentParagraphId]);

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

  // Effect: Auto-clear variants when navigating to a paragraph without variants
  // This handles both manual navigation (handleChoice) and browser back/forward
  React.useEffect(() => {
    if (
      game.state.variantPath.length > 0 &&
      currentParagraph &&
      !currentParagraph.variants
    ) {
      game.clearVariants();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.state.currentParagraphId]);

  // Helper: Get variant content - shows only the last variant in path, not accumulated
  const getAccumulatedParagraph = (): typeof currentParagraph | null => {
    if (!currentParagraph) return null;

    // If no variant selected, show main paragraph
    if (game.state.variantPath.length === 0 || !currentParagraph.variants) {
      return currentParagraph;
    }

    // Get the last variant in the path
    const lastVariantId =
      game.state.variantPath[game.state.variantPath.length - 1];
    const lastVariant = currentParagraph.variants?.[lastVariantId];

    if (!lastVariant) {
      return currentParagraph;
    }

    // Return only the last variant (not accumulated with main paragraph)
    return {
      ...currentParagraph,
      contentPages:
        lastVariant.contentPages ||
        (lastVariant.content
          ? [lastVariant.content]
          : currentParagraph.contentPages),
      content: lastVariant.content,
      choices: lastVariant.choices || currentParagraph.choices,
    };
  };

  const displayParagraph = getAccumulatedParagraph();

  const handleMainInputSubmit = (value: string): string | null => {
    const result = gameActions.jumpToParagraph(value, paragraphs);

    if (result.needsWarning && result.pendingId) {
      game.showWarning(result.pendingId);
      return null;
    }

    if (!result.valid) {
      return result.error || "Błąd";
    }

    game.setParagraph(value.trim());
    game.clearVariants();
    return null;
  };

  const handleConfirmAccessibility = () => {
    if (game.state.pendingParagraphId) {
      game.setParagraph(game.state.pendingParagraphId);
      game.clearVariants();
    }
    game.closeWarning();
  };

  const handleCancelAccessibility = () => {
    game.closeWarning();
  };

  const handleBackToInput = () => {
    game.reset();
  };

  const handleJumpFromDeadEnd = (value: string): string | null => {
    const result = gameActions.jumpToParagraph(value, paragraphs);

    if (result.needsWarning && result.pendingId) {
      game.showWarning(result.pendingId);
      return null;
    }

    if (!result.valid) {
      return result.error || "Błąd";
    }

    game.setParagraph(value.trim());
    game.clearVariants();
    game.clearDiceResult();
    return null;
  };

  const handleChoice = (
    nextId: string | undefined,
    isVariant: boolean = false,
  ) => {
    if (!nextId) return;

    if (isVariant) {
      game.addVariant(nextId);
    } else {
      game.setParagraph(nextId);
    }
    game.clearDiceResult();
  };

  return (
    <main className="game">
      {/* Accessibility Warning Screen */}
      {game.state.showAccessibilityWarning && game.state.pendingParagraphId && (
        <section
          className="game__accessibility-warning"
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
        <>
          {currentScenario && (
            <h1 className="game__scenario-title">
              {currentScenario.title || "Scenariusz"}
            </h1>
          )}
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
              ← Wróć do menu scenariusza
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
                <div className="game__setup-step-footer">
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
        </>
      )}

      {/* Dice View */}
      {game.state.showDiceView && (
        <>
          {currentScenario && (
            <h1 className="game__scenario-title">
              {currentScenario.title || "Scenariusz"}
            </h1>
          )}
          <div className="game__setup-header">
            <Button
              variant="outline"
              size="sm"
              onClick={() => game.toggleDiceView()}
              aria-label="Powrót do menu"
            >
              ← Wróć do menu
            </Button>
          </div>

          <div className="game__setup-step">
            <div className="game__setup-step-header">
              <div className="game__setup-step-number">Rzut kością</div>
            </div>
            <div className="game__setup-step-content">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "var(--spacing-lg)",
                  padding: "var(--spacing-md)",
                }}
              >
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "var(--font-size-lg)",
                  }}
                >
                  Ile razy chcesz rzucić kością?
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "var(--spacing-md)",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {[1, 2, 3].map((numDice) => (
                    <Button
                      key={numDice}
                      variant="primary"
                      size="lg"
                      disabled={game.state.isRollingDice}
                      onClick={async () => {
                        game.setRollingDice(true);
                        game.setDiceRolls([]);
                        game.clearDiceResult();

                        // Animate rolling
                        for (let frame = 0; frame < 10; frame++) {
                          await new Promise((resolve) =>
                            setTimeout(resolve, 80),
                          );
                          const tempRolls = Array(numDice)
                            .fill(0)
                            .map(() => Math.floor(Math.random() * 6) + 1);
                          game.setDiceRolls(tempRolls);
                        }

                        // Final result
                        const results = Array(numDice)
                          .fill(0)
                          .map(() => Math.floor(Math.random() * 6) + 1);
                        game.setDiceRolls(results);
                        const sum = results.reduce((a, b) => a + b, 0);
                        game.setDiceResult(sum);
                        game.setRollingDice(false);
                      }}
                      title={`Rzuć ${numDice}x`}
                    >
                      {numDice}x 🎲
                    </Button>
                  ))}
                </div>
                {(game.state.isRollingDice ||
                  game.state.lastDiceResult !== null) && (
                  <div
                    style={{
                      fontSize: "3rem",
                      fontWeight: "bold",
                      color: "var(--color-accent)",
                      marginTop: 0,
                      textAlign: "center",
                      minHeight: "4rem",
                    }}
                  >
                    Wynik:{" "}
                    {game.state.diceRolls.length > 0
                      ? game.state.diceRolls.length === 1
                        ? `${game.state.diceRolls[0]}${game.state.lastDiceResult !== null ? "" : ""}`
                        : `${game.state.diceRolls.join(" + ")}${game.state.lastDiceResult !== null ? ` = ${game.state.lastDiceResult}` : ""}`
                      : ""}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Game View - Hidden when showing Setup, Dice or Warning */}
      {!game.state.showSetup &&
        !game.state.showDiceView &&
        !game.state.showAccessibilityWarning && (
          <>
            {/* INPUT MODE - Show input panel */}
            {!game.state.currentParagraphId ? (
              <>
                {currentScenario && (
                  <h1 className="game__scenario-title">
                    {currentScenario.title || "Scenariusz"}
                  </h1>
                )}
                <ParagraphInput
                  onSubmit={handleMainInputSubmit}
                  instruction='Wprowadź poniżej numer wpisu, a następnie naciśnij "PRZEJDŹ".'
                  autoFocus
                  actions={
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => game.toggleSetup()}
                        className="game__option-btn"
                      >
                        ⚙️ Przygotuj Scenariusz
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => game.toggleDiceView()}
                        className="game__option-btn"
                      >
                        🎲 Rzut kością
                      </Button>
                      <Link to="/scenarios" className="game__option-link">
                        <Button variant="secondary" size="sm">
                          ← Lista scenariuszy
                        </Button>
                      </Link>
                    </>
                  }
                />
              </>
            ) : (
              /* PARAGRAPH MODE - Show paragraph */
              <section
                className="game__paragraph-section"
                aria-label="Treść paragrafu"
              >
                {currentScenario && (
                  <h1 className="game__scenario-title">
                    {currentScenario.title || "Scenariusz"}
                  </h1>
                )}
                <div className="game__setup-header">
                  {currentParagraph?.variants &&
                    game.state.variantPath.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => game.clearVariants()}
                        aria-label={`Odśwież paragraf ${currentParagraph.id} i dokonaj wyborów od nowa`}
                      >
                        ↻ Odśwież #{currentParagraph.id}
                      </Button>
                    )}
                  {currentParagraph?.accessibleFrom &&
                    currentParagraph.accessibleFrom.length > 0 && (
                      <>
                        {currentParagraph.accessibleFrom.length === 1 ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleChoice(currentParagraph.accessibleFrom![0])
                            }
                            aria-label={`Wróć do paragrafu ${
                              currentParagraph.accessibleFrom[0]
                            }`}
                          >
                            ← Wróć do #{currentParagraph.accessibleFrom[0]}
                          </Button>
                        ) : (
                          <>
                            {currentParagraph.accessibleFrom.map((paraId) => (
                              <Button
                                key={paraId}
                                variant="outline"
                                size="sm"
                                onClick={() => handleChoice(paraId)}
                                aria-label={`Wróć do paragrafu ${paraId}`}
                              >
                                ← Wróć do #{paraId}
                              </Button>
                            ))}
                          </>
                        )}
                      </>
                    )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBackToInput}
                    aria-label="Powrót do menu scenariusza"
                  >
                    ← Wróć do menu scenariusza
                  </Button>
                </div>
                {currentParagraph ? (
                  <ParagraphDisplay
                    paragraph={displayParagraph || currentParagraph}
                    lastDiceResult={game.state.lastDiceResult}
                    onChoice={handleChoice}
                    onJumpToParagraph={handleJumpFromDeadEnd}
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
          </>
        )}
    </main>
  );
};
