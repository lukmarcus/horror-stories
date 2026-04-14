import React from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { SCENARIOS, PARAGRAPHS, SETUP_DATA, LETTERS_DATA } from "../scenarios";
import { Button } from "../components/ui";
import { ParagraphView } from "../components/views/ParagraphView/ParagraphView";
import { InputView } from "../components/views/InputView/InputView";
import { DiceView } from "../components/views/DiceView/DiceView";
import { AlphabetView } from "../components/views/AlphabetView/AlphabetView";
import { PrepareView } from "../components/views/PrepareView/PrepareView";
import { IndirectView } from "../components/views/IndirectView/IndirectView";
import { useGame } from "../hooks/useGame";
import { useDiceRoll } from "../hooks/useDiceRoll";
import { BackToMenu } from "../components/ui";
import { jumpToParagraph } from "../utils/gameActions";
import "../styles/pages/game.css";

export const Game: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const game = useGame();
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
  const letters = LETTERS_DATA[scenarioId]?.letters || [];
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
  const getDisplayParagraph = (): typeof currentParagraph | null => {
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

  const displayParagraph = getDisplayParagraph();

  const handleMainInputSubmit = (value: string): string | null => {
    const result = jumpToParagraph(value, paragraphs);

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
    const result = jumpToParagraph(value, paragraphs);

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

  const handleRollDice = useDiceRoll(game.dispatch);

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
              variant="secondary"
              size="sm"
              onClick={() => {
                game.resetSetupStep();
                game.toggleSetup();
              }}
              aria-label="Powrót do gry"
            >
              ← Menu scenariusza
            </Button>
          </div>

          {setupSteps.length > 0 ? (
            <PrepareView
              currentStep={game.state.currentSetupStep}
              totalSteps={setupSteps.length}
              setupSteps={setupSteps}
              scenarioId={scenarioId}
              startParagraphId={currentScenario?.startParagraphId ?? "1"}
              onPrev={() => game.prevSetupStep()}
              onNext={() => game.nextSetupStep()}
              onStart={() => {
                game.resetSetupStep();
                game.toggleSetup();
                game.setParagraph(currentScenario?.startParagraphId ?? "1");
              }}
            />
          ) : (
            <p className="game__scenario-empty">
              Brak kroków przygotowania dla tego scenariusza.
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

      {/* Alphabet View */}
      {game.state.showAlphabetView && (
        <>
          {currentScenario && (
            <h1 className="game__scenario-title">
              {currentScenario.title || "Scenariusz"}
            </h1>
          )}
          <AlphabetView
            onClose={() => game.toggleAlphabetView()}
            letters={letters}
            onGoToParagraph={(id) => {
              game.setParagraphFromAlphabet(id);
              game.clearVariants();
            }}
          />
        </>
      )}

      {/* Main Game View - Hidden when showing Setup, Dice or Warning */}
      {!game.state.showSetup &&
        !game.state.showDiceView &&
        !game.state.showAlphabetView &&
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
                        variant="secondary"
                        size="sm"
                        onClick={() => game.toggleSetup()}
                      >
                        ⚙️ Przygotowanie scenariusza
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => game.toggleDiceView()}
                      >
                        🎲 Rzut kością
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => game.toggleAlphabetView()}
                      >
                        🔤 Żetony alfabetu
                      </Button>
                      <Link to="/scenarios" className="game__option-link">
                        <Button variant="secondary" size="sm">
                          ← Lista scenariuszy
                        </Button>
                      </Link>
                      <BackToMenu />
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
                {currentParagraph ? (
                  <ParagraphView
                    paragraph={displayParagraph || currentParagraph}
                    currentParagraphId={game.state.currentParagraphId!}
                    lastDiceResult={game.state.lastDiceResult}
                    onChoice={handleChoice}
                    onJumpToParagraph={handleJumpFromDeadEnd}
                    onBack={handleBackToInput}
                    scenarioId={scenarioId}
                    hasVariants={Boolean(currentParagraph?.variants)}
                    variantPathLength={game.state.variantPath.length}
                    accessibleFrom={
                      (currentParagraph?.accessibleFrom || []) as string[]
                    }
                    onRefreshVariants={() => game.clearVariants()}
                    onNavigateToParagraph={handleChoice}
                    onShowDice={() => game.toggleDiceView()}
                    onBackToAlphabet={
                      game.state.fromAlphabet
                        ? () => game.toggleAlphabetView()
                        : undefined
                    }
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
