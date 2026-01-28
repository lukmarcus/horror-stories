import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SCENARIOS, PARAGRAPHS } from "../data/scenarios";
import { Button } from "../components/common";
import { ParagraphText } from "../components/ParagraphText/ParagraphText";
import { DiceRoller } from "../components/DiceRoller/DiceRoller";
import { ConditionalChoice } from "../components/ConditionalChoice/ConditionalChoice";
import "../styles/pages/game.css";

export const Game: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentParagraphId, setCurrentParagraphId] = useState<string | null>(
    null,
  );
  const [inputValue, setInputValue] = useState("");
  const [showSetup, setShowSetup] = useState(false);
  const [error, setError] = useState("");
  const [lastDiceResult, setLastDiceResult] = useState<number | null>(null);
  const [pendingParagraphId, setPendingParagraphId] = useState<string | null>(
    null,
  );
  const [showAccessibilityWarning, setShowAccessibilityWarning] =
    useState(false);

  // Use imported game data
  const scenarios = SCENARIOS;
  const paragraphs = PARAGRAPHS;

  const currentScenario = scenarios[id || "1"];

  const currentParagraph = paragraphs[currentParagraphId || ""];

  const handleJumpToParagraph = () => {
    const paragraphId = inputValue.trim();
    setError("");

    if (!paragraphId) {
      setError("Wpisz numer paragrafu");
      return;
    }

    if (!paragraphs[paragraphId]) {
      setError(`Paragraf #${paragraphId} nie istnieje`);
      return;
    }

    const paragraph = paragraphs[paragraphId];

    // Check if paragraph is directly accessible
    if (paragraph.isDirect === false && paragraph.accessibleFrom) {
      setPendingParagraphId(paragraphId);
      setShowAccessibilityWarning(true);
      return;
    }

    setCurrentParagraphId(paragraphId);
    setInputValue("");
  };

  const handleConfirmAccessibility = () => {
    if (pendingParagraphId) {
      setCurrentParagraphId(pendingParagraphId);
      setInputValue("");
      setPendingParagraphId(null);
    }
    setShowAccessibilityWarning(false);
  };

  const handleCancelAccessibility = () => {
    setPendingParagraphId(null);
    setShowAccessibilityWarning(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleJumpToParagraph();
    }
  };

  const handleBackToInput = () => {
    setCurrentParagraphId(null);
    setInputValue("");
    setError("");
  };

  const setupSteps = [
    "Gracze siedzą wokół stołu",
    "Każdy gracz ma kartkę i długopis",
    "Położyć planszę główną w środku",
    "Mieszać karty odkryć",
    "Jesteś gotowy! Zacznij przygodę",
  ];

  return (
    <main className="game">
      {/* Accessibility Warning Dialog */}
      {showAccessibilityWarning && pendingParagraphId && (
        <div className="game__dialog-overlay">
          <div className="game__dialog">
            <h2 className="game__dialog-title">Uwaga!</h2>
            <p className="game__dialog-text">
              Paragraf #{pendingParagraphId} jest dostępny tylko z:
            </p>
            <div className="game__dialog-sources">
              {paragraphs[pendingParagraphId]?.accessibleFrom?.join(", ")}
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
      {currentParagraphId && (
        <div className="game__top-bar">
          <div className="game__top-bar-content">
            <Button variant="outline" size="sm" onClick={handleBackToInput}>
              ← Wróć
            </Button>
            <span className="game__scenario-info">Scenariusz #{id}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSetup(!showSetup)}
            >
              {showSetup ? "Zamknij Setup" : "⚙️ Setup"}
            </Button>
          </div>
        </div>
      )}

      {/* Setup Section */}
      {showSetup && (
        <section className="game__setup-section">
          <div className="game__setup-container">
            <h2 className="game__setup-title">Ustawienie początkowe</h2>
            <ol className="game__setup-list">
              {setupSteps.map((step, idx) => (
                <li key={idx} className="game__setup-item">
                  {step}
                </li>
              ))}
            </ol>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowSetup(false)}
            >
              Gotów! Zacznij grać
            </Button>
          </div>
        </section>
      )}

      {/* Container */}
      <div className="game__container">
        {/* INPUT MODE - Show input panel */}
        {!currentParagraphId ? (
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
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
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
              {error && <p className="game__error">{error}</p>}
            </div>

            {/* Options */}
            <div className="game__options">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSetup(!showSetup)}
                className="game__option-btn"
              >
                ⚙️ {showSetup ? "Zamknij Setup" : "Przygotuj Scenariusz"}
              </Button>
              <Link to="/scenarios" className="game__option-link">
                <Button variant="secondary" size="sm">
                  ← Powrót do Menu
                </Button>
              </Link>
            </div>
          </section>
        ) : (
          /* PARAGRAPH MODE - Show paragraph text and choices */
          <section className="game__paragraph-section">
            <div className="game__text-box">
              {currentParagraph ? (
                <ParagraphText
                  text={currentParagraph.text}
                  className="game__paragraph-text"
                />
              ) : (
                <p className="game__error-text">Paragraf nie znaleziony</p>
              )}
            </div>

            {/* Dice Roller */}
            {currentParagraph?.hasDiceRoll && (
              <div className="game__dice-section">
                <p className="game__dice-instruction">
                  {currentParagraph.diceRollDescription}
                </p>
                <DiceRoller
                  onRoll={(result) => {
                    setLastDiceResult(result);
                  }}
                  showNextButton={lastDiceResult !== null}
                  onNext={() => {
                    // Handle conditional paragraph based on dice result
                    if (
                      currentParagraph.diceResult &&
                      currentParagraphId === "7" &&
                      lastDiceResult !== null
                    ) {
                      const { threshold, successNextId, failNextId } =
                        currentParagraph.diceResult;
                      const nextId =
                        lastDiceResult > threshold ? successNextId : failNextId;
                      setCurrentParagraphId(nextId);
                      setLastDiceResult(null);
                    }
                  }}
                />
              </div>
            )}

            {/* Dice Result Message */}
            {lastDiceResult !== null && currentParagraph?.diceResult && (
              <div
                className={`game__dice-result-message ${
                  lastDiceResult > currentParagraph.diceResult.threshold
                    ? "game__dice-result-message--success"
                    : "game__dice-result-message--fail"
                }`}
              >
                {lastDiceResult > currentParagraph.diceResult.threshold
                  ? currentParagraph.diceResult.successText
                  : currentParagraph.diceResult.failText}
              </div>
            )}

            {/* Choices */}
            {currentParagraph?.choices &&
              currentParagraph.choices.length > 0 && (
                <div className="game__choices">
                  {currentParagraph.choices.map((choice) =>
                    choice.isConditional ? (
                      <ConditionalChoice
                        key={choice.id}
                        choice={choice}
                        onYes={() =>
                          choice.yesNextId &&
                          setCurrentParagraphId(choice.yesNextId)
                        }
                        onNo={() =>
                          choice.noNextId &&
                          setCurrentParagraphId(choice.noNextId)
                        }
                      />
                    ) : (
                      <Button
                        key={choice.id}
                        variant="primary"
                        size="md"
                        onClick={() => {
                          if (choice.nextParagraphId) {
                            setCurrentParagraphId(choice.nextParagraphId);
                          }
                        }}
                        className="game__choice-btn"
                      >
                        {choice.text}
                      </Button>
                    ),
                  )}
                </div>
              )}

            {/* Dead End - No choices */}
            {(!currentParagraph?.choices ||
              currentParagraph.choices.length === 0) && (
              <div className="game__dead-end">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleBackToInput}
                  className="game__dead-end-btn"
                >
                  Wróć do scenariusza
                </Button>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
};
