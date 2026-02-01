import React from "react";
import type { Paragraph } from "../../types";
import { ParagraphText } from "../ParagraphText/ParagraphText";
import { RichText } from "../RichText";
import { DiceRoller } from "../DiceRoller/DiceRoller";
import { ConditionalChoice } from "../ConditionalChoice/ConditionalChoice";
import "./ParagraphDisplay.css";

interface ParagraphDisplayProps {
  paragraph: Paragraph;
  lastDiceResult: number | null;
  onChoice: (nextId: string) => void;
  onBack: () => void;
}

export const ParagraphDisplay: React.FC<ParagraphDisplayProps> = ({
  paragraph,
  lastDiceResult,
  onChoice,
  onBack,
}) => {
  const [currentPage, setCurrentPage] = React.useState(0);
  
  // Check if dice roll was successful
  const isDiceRollSuccess =
    paragraph.hasDiceRoll &&
    paragraph.diceResult &&
    lastDiceResult !== null &&
    lastDiceResult > paragraph.diceResult.threshold;

  // Check if paragraph is dead end (no choices, no dice)
  const isDeadEnd = !paragraph.choices && !paragraph.hasDiceRoll;
  
  // Handle content pages
  const hasPages = paragraph.contentPages && paragraph.contentPages.length > 0;
  const maxPage = hasPages ? paragraph.contentPages!.length - 1 : 0;
  const currentContent = hasPages ? paragraph.contentPages![currentPage] : paragraph.content;

  return (
    <article
      className="paragraph-display"
      aria-label={`Paragraf ${paragraph.id}`}
    >
      {paragraph.image && (
        <img
          src={paragraph.image}
          alt={`Ilustracja do paragrafu ${paragraph.id}`}
          className="paragraph-image"
        />
      )}

      {paragraph.text && <ParagraphText text={paragraph.text} />}
      
      {currentContent && <RichText content={currentContent} />}
      
      {hasPages && (
        <div className="pagination" style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1rem" }}>
          <button onClick={() => setCurrentPage(Math.max(0, currentPage - 1))} disabled={currentPage === 0}>
            ← Poprzedni
          </button>
          <span>{currentPage + 1} / {maxPage + 1}</span>
          <button onClick={() => setCurrentPage(Math.min(maxPage, currentPage + 1))} disabled={currentPage === maxPage}>
            Następny →
          </button>
        </div>
      )}

      {isDeadEnd && (
        <div className="dead-end" role="status" aria-live="polite">
          <p>Koniec gry!</p>
          <button
            onClick={onBack}
            className="button button--secondary"
            aria-label="Powrót do wyboru paragrafu"
          >
            Powrót
          </button>
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

      {paragraph.choices && paragraph.choices.length > 0 && (
        <fieldset className="choices" aria-label="Dostępne wybory">
          <legend className="sr-only">Wybierz następny paragraf</legend>
          {paragraph.choices.map((choice) => {
            if (choice.isConditional) {
              return (
                <ConditionalChoice
                  key={choice.id}
                  choice={choice}
                  onYes={() => choice.yesNextId && onChoice(choice.yesNextId)}
                  onNo={() => choice.noNextId && onChoice(choice.noNextId)}
                />
              );
            }
            return (
              <button
                key={choice.id}
                onClick={() =>
                  choice.nextParagraphId && onChoice(choice.nextParagraphId)
                }
                className="button button--primary"
                aria-label={choice.text}
              >
                {choice.text}
              </button>
            );
          })}
        </fieldset>
      )}
    </article>
  );
};
