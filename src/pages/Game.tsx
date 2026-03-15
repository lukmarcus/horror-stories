import React from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { SCENARIOS, PARAGRAPHS, SETUP_DATA } from "../scenarios";
import { Button } from "../components/common";
import { ParagraphView } from "../components/ParagraphView/ParagraphView";
import { InputView } from "../components/InputView/InputView";
import { DiceView } from "../components/DiceView/DiceView";
import { PrepareView } from "../components/PrepareView/PrepareView";
import { IndirectView } from "../components/IndirectView/IndirectView";
import { ParagraphNavigation } from "../components/ParagraphNavigation/ParagraphNavigation";
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

  const handleRollDice = async (numDice: number): Promise<void> => {
    game.setRollingDice(true);
    game.setDiceRolls([]);
    game.clearDiceResult();

    // Animate rolling
    for (let frame = 0; frame < 10; frame++) {
      await new Promise((resolve) => setTimeout(resolve, 80));
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
  };

  return (
    <main className="game">
      {/* Indirect Paragraph Warning Screen */}
      {game.state.showAccessibilityWarning && game.state.pendingParagraphId && (
        <>
          {currentScenario && (
            <h1 className="game__scenario-title">
              {currentScenario.title || "Scenariusz"}
            </h1>
          )}
          <IndirectView
            pendingParagraphId={game.state.pendingParagraphId}
            sources={
              paragraphs[game.state.pendingParagraphId]?.accessibleFrom || []
            }
            onConfirm={handleConfirmAccessibility}
            onCancel={handleCancelAccessibility}
          />
        </>
      )}

      {/* Setup Section - Full Screen View */}
      {game.state.showSetup && (
        <>
          {currentScenario && (
            <h1 className="game__scenario-title">
              {currentScenario.title || "Scenariusz"}
            </h1>
          )}
          <div className="game__content-nav">
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
            <PrepareView
              currentStep={game.state.currentSetupStep}
              totalSteps={setupSteps.length}
              setupSteps={setupSteps}
              scenarioId={scenarioId}
              onPrev={() => game.prevSetupStep()}
              onNext={() => game.nextSetupStep()}
              onStart={() => {
                game.resetSetupStep();
                game.toggleSetup();
                game.setParagraph("77");
              }}
            />
          ) : (
            <p className="game__section-empty">
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
          <DiceView
            onClose={() => game.toggleDiceView()}
            isRolling={game.state.isRollingDice}
            diceRolls={game.state.diceRolls}
            lastDiceResult={game.state.lastDiceResult}
            onRoll={handleRollDice}
          />
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
                <InputView
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
              <>
                {currentScenario && (
                  <h1 className="game__scenario-title">
                    {currentScenario.title || "Scenariusz"}
                  </h1>
                )}
                <ParagraphNavigation
                  currentParagraphId={currentParagraph?.id}
                  hasVariants={Boolean(currentParagraph?.variants)}
                  variantPathLength={game.state.variantPath.length}
                  accessibleFrom={
                    (currentParagraph?.accessibleFrom || []) as string[]
                  }
                  onRefreshVariants={() => game.clearVariants()}
                  onNavigateToParagraph={handleChoice}
                  onBackToInput={handleBackToInput}
                />
                {currentParagraph ? (
                <ParagraphView
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
              </>
            )}
          </>
        )}
    </main>
  );
};
