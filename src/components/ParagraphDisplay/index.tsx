import React from "react";
import type { Paragraph } from "../../types";
import { ParagraphText } from "../ParagraphText/ParagraphText";
import { RichText } from "../RichText";
import { DiceRoller } from "../DiceRoller/DiceRoller";
import { ConditionalChoice } from "../ConditionalChoice/ConditionalChoice";
import { ParagraphInput } from "../ParagraphInput";
import "./ParagraphDisplay.css";

interface ParagraphDisplayProps {
  paragraph: Paragraph;
  lastDiceResult: number | null;
  onChoice: (nextId: string | undefined, isVariant?: boolean) => void;
  onJumpToParagraph: (value: string) => string | null;
  onBack: () => void;
  scenarioId?: string;
}

export const ParagraphDisplay: React.FC<ParagraphDisplayProps> = ({
  paragraph,
  lastDiceResult,
  onChoice,
  onJumpToParagraph,
  onBack,
  scenarioId,
}) => {
  const [currentPage, setCurrentPage] = React.useState(0);

  // Check if dice roll was successful
  const isDiceRollSuccess =
    paragraph.hasDiceRoll &&
    paragraph.diceResult &&
    lastDiceResult !== null &&
    lastDiceResult > paragraph.diceResult.threshold;

  // Check if paragraph is dead end (no choices, no dice)
  const isDeadEnd =
    (!paragraph.choices || paragraph.choices.length === 0) &&
    !paragraph.hasDiceRoll;

  // Separate variant choices (horizontal/within frame) from regular choices
  const variantChoices =
    paragraph.choices?.filter((choice) => choice.nextVariantId !== undefined) ||
    [];
  const regularChoices =
    paragraph.choices?.filter((choice) => choice.nextVariantId === undefined) ||
    [];

  // Handle content pages - auto-detect if multiple pages exist
  const hasPages = paragraph.contentPages && paragraph.contentPages.length > 1;
  const maxPage = paragraph.contentPages
    ? paragraph.contentPages.length - 1
    : 0;
  const currentContent = paragraph.contentPages
    ? paragraph.contentPages[currentPage]
    : paragraph.content;

  const paragraphIdStr = Array.isArray(paragraph.id)
    ? paragraph.id.join(", ")
    : paragraph.id;

  return (
    <>
      <article
        className="paragraph-display game__setup-step"
        aria-label={`Paragraf ${paragraphIdStr}`}
      >
        {paragraph.image && (
          <img
            src={paragraph.image}
            alt={`Ilustracja do paragrafu ${paragraphIdStr}`}
            className="paragraph-image"
          />
        )}

        {hasPages && (
          <div className="game__setup-step-header">
            <div className="game__setup-step-number">
              Część {currentPage + 1} z {maxPage + 1}
            </div>
            <div className="game__setup-controls">
              <button
                className="button button--secondary button--sm"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                ← Poprzedni
              </button>
              <button
                className="button button--secondary button--sm"
                onClick={() =>
                  setCurrentPage(Math.min(maxPage, currentPage + 1))
                }
                disabled={currentPage === maxPage}
              >
                Następny →
              </button>
            </div>
          </div>
        )}

        {paragraph.text && <ParagraphText text={paragraph.text} />}

        {currentContent && (
          <div
            className="game__setup-step-content"
            style={{ flexDirection: "column", alignItems: "flex-start" }}
          >
            <RichText content={currentContent} scenarioId={scenarioId} />
          </div>
        )}

        {paragraph.hasDiceRoll &&
          paragraph.diceResult &&
          lastDiceResult !== null && (
            <div className="dice-result" role="status" aria-live="assertive">
              <p>
                {isDiceRollSuccess
                  ? paragraph.diceResult.successText
                  : paragraph.diceResult.failText}
              </p>
              <button
                onClick={() =>
                  onChoice(
                    isDiceRollSuccess
                      ? paragraph.diceResult!.successNextId
                      : paragraph.diceResult!.failNextId,
                    false,
                  )
                }
                className="button button--primary"
                aria-label="Przejść do następnego paragrafu"
              >
                PRZEJDŹ
              </button>
            </div>
          )}

        {paragraph.hasDiceRoll && lastDiceResult === null && (
          <div
            className="dice-roller-wrapper"
            role="status"
            aria-label="Kostka do gry"
          >
            <DiceRoller />
          </div>
        )}

        {hasPages && (
          <div className="game__setup-step-footer">
            <div className="game__setup-step-number">
              Część {currentPage + 1} z {maxPage + 1}
            </div>
            <div className="game__setup-controls">
              <button
                className="button button--secondary button--sm"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                ← Poprzedni
              </button>
              <button
                className="button button--secondary button--sm"
                onClick={() =>
                  setCurrentPage(Math.min(maxPage, currentPage + 1))
                }
                disabled={currentPage === maxPage}
              >
                Następny →
              </button>
            </div>
          </div>
        )}

        {variantChoices.length > 0 && paragraph.areChoicesHorizontal && (
          <fieldset
            className="choices choices--horizontal"
            aria-label="Dostępne warianty"
          >
            <legend className="sr-only">Wybierz wariant</legend>
            {variantChoices.map((choice, idx) => {
              const choiceKey = choice.id || `choice-${idx}`;
              return (
                <button
                  key={choiceKey}
                  onClick={() => {
                    if (choice.nextVariantId) {
                      onChoice(choice.nextVariantId, true);
                    }
                  }}
                  className="button button--primary button--lg"
                  aria-label={choice.text || ""}
                >
                  {choice.text && choice.text.includes("<") ? (
                    <RichText
                      text={choice.text}
                      scenarioId={scenarioId}
                      noSpacing
                    />
                  ) : (
                    choice.text
                  )}
                </button>
              );
            })}
          </fieldset>
        )}
      </article>

      {isDeadEnd && currentPage === maxPage && (
        <div className="dead-end" role="status" aria-live="polite">
          <ParagraphInput
            onSubmit={onJumpToParagraph}
            instruction='Wprowadź poniżej numer wpisu, a następnie naciśnij "PRZEJDŹ".'
            autoFocus
            errorId="dead-end-error"
            actions={
              <button
                onClick={onBack}
                className="button button--secondary button--sm"
              >
                ← Powrót do gry
              </button>
            }
          />
        </div>
      )}

      {regularChoices.length > 0 && (
        <fieldset
          className="choices choices--vertical"
          aria-label="Dostępne wybory"
        >
          <legend className="sr-only">Wybierz następny paragraf</legend>
          {regularChoices.map((choice, idx) => {
            const choiceKey = choice.id || `choice-${idx}`;
            if (choice.isConditional) {
              return (
                <ConditionalChoice
                  key={choiceKey}
                  choice={choice}
                  onYes={() =>
                    choice.yesNextId && onChoice(choice.yesNextId, false)
                  }
                  onNo={() =>
                    choice.noNextId && onChoice(choice.noNextId, false)
                  }
                />
              );
            }
            return (
              <button
                key={choiceKey}
                onClick={() => {
                  if (choice.nextParagraphId === "") {
                    onBack();
                  } else if (choice.nextParagraphId) {
                    onChoice(choice.nextParagraphId, false);
                  }
                }}
                className="button button--primary button--lg"
                aria-label={choice.text || ""}
              >
                {choice.text && choice.text.includes("<") ? (
                  <RichText
                    text={choice.text}
                    scenarioId={scenarioId}
                    noSpacing
                  />
                ) : (
                  choice.text
                )}
              </button>
            );
          })}
        </fieldset>
      )}
    </>
  );
};
