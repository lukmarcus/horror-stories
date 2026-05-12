import React from "react";
import type { Paragraph } from "../../../types";
import { ParagraphText } from "../../text/ParagraphText/ParagraphText";
import { RichText } from "../../text/RichText/RichText";
import { ConditionalChoice } from "../../text/ConditionalChoice/ConditionalChoice";
import { InputView } from "../InputView/InputView";
import { SectionHeader } from "../../ui/SectionHeader";
import { Button, OptionButton } from "../../ui";
import "./ParagraphView.css";

interface ParagraphViewProps {
  paragraph: Paragraph;
  currentParagraphId: string;
  lastDiceResult: number | null;
  onChoice: (nextId: string | undefined, isVariant?: boolean) => void;
  onJumpToParagraph: (value: string) => string | null;
  onBack: () => void;
  scenarioId?: string;
  hasVariants?: boolean;
  variantPathLength?: number;
  accessibleFrom?: string[];
  onRefreshVariants?: () => void;
  onNavigateToParagraph?: (paragraphId: string) => void;
  onShowDice?: () => void;
  onShowAlphabet?: () => void;
  onShowDeath?: () => void;
  onShowEnemy?: () => void;
  onBackToAlphabet?: () => void;
}

const PaginationControls: React.FC<{
  currentPage: number;
  maxPage: number;
  onPrev: () => void;
  onNext: () => void;
}> = ({ currentPage, maxPage, onPrev, onNext }) => (
  <>
    <OptionButton
      icon="◀️"
      line1="Poprzedni"
      onClick={onPrev}
      disabled={currentPage === 0}
    />
    <OptionButton
      icon="▶️"
      line1="Następny"
      iconPosition="right"
      onClick={onNext}
      disabled={currentPage === maxPage}
    />
  </>
);

export const ParagraphView: React.FC<ParagraphViewProps> = ({
  paragraph,
  currentParagraphId,
  lastDiceResult,
  onChoice,
  onJumpToParagraph,
  onBack,
  scenarioId,
  hasVariants = false,
  variantPathLength = 0,
  accessibleFrom = [],
  onRefreshVariants,
  onNavigateToParagraph,
  onShowDice,
  onShowAlphabet,
  onShowDeath,
  onShowEnemy,
  onBackToAlphabet,
}) => {
  const [currentPage, setCurrentPage] = React.useState(0);

  const paragraphIdStr = Array.isArray(paragraph.id)
    ? paragraph.id.join(", ")
    : paragraph.id;

  // Reset page when paragraph changes
  React.useEffect(() => {
    setCurrentPage(0);
  }, [currentParagraphId]);

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

  // Handle content pages - auto-detect if multiple pages exist
  const hasPages = paragraph.contentPages && paragraph.contentPages.length > 1;
  const maxPage = paragraph.contentPages
    ? paragraph.contentPages.length - 1
    : 0;
  const currentContent = paragraph.contentPages
    ? paragraph.contentPages[currentPage]
    : paragraph.content;

  // Show input only on last page of dead-end paragraphs
  const showDeadEndInput = isDeadEnd && currentPage === maxPage;

  // Separate variant choices (horizontal/within frame) from regular choices
  const variantChoices = paragraph.areChoicesHorizontal
    ? paragraph.choices || []
    : [];
  const regularChoices = paragraph.areChoicesHorizontal
    ? []
    : paragraph.choices || [];

  return (
    <>
      <nav className="game__content-nav">
        {hasVariants && variantPathLength > 0 && onRefreshVariants && (
          <OptionButton
            icon="🔄"
            line1="Odśwież"
            line2={`#${currentParagraphId}`}
            onClick={onRefreshVariants}
          />
        )}

        {onBackToAlphabet && (
          <OptionButton
            icon="◀️"
            line1="Żetony"
            line2="alfabetu"
            onClick={onBackToAlphabet}
          />
        )}

        {accessibleFrom &&
          accessibleFrom.length > 0 &&
          onNavigateToParagraph && (
            <>
              {accessibleFrom.map((paragraphId) => (
                <OptionButton
                  key={`back-to-${paragraphId}`}
                  icon="◀️"
                  line1={`§${paragraphId}`}
                  onClick={() => onNavigateToParagraph(paragraphId)}
                />
              ))}
            </>
          )}

        <OptionButton
          icon="◀️"
          line1="Menu"
          line2="scenariusza"
          onClick={onBack}
        />
      </nav>

      <div
        className="paragraph-display game__scenario"
        style={{ width: "100%" }}
        aria-label={`Paragraf ${currentParagraphId}`}
      >
        {paragraph.image && (
          <img
            src={paragraph.image}
            alt={`Ilustracja do paragrafu ${paragraphIdStr}`}
            className="paragraph-image"
          />
        )}

        {hasPages ? (
          <SectionHeader
            title={`Paragraf ${currentParagraphId}`}
            subtitle={`Część ${currentPage + 1} z ${maxPage + 1}`}
            controls={
              <PaginationControls
                currentPage={currentPage}
                maxPage={maxPage}
                onPrev={() => setCurrentPage(Math.max(0, currentPage - 1))}
                onNext={() =>
                  setCurrentPage(Math.min(maxPage, currentPage + 1))
                }
              />
            }
          />
        ) : (
          <SectionHeader title={`Paragraf ${currentParagraphId}`} />
        )}

        {paragraph.text && <ParagraphText text={paragraph.text} />}

        {currentContent && (
          <RichText content={currentContent} scenarioId={scenarioId} />
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
              <Button
                variant="primary"
                onClick={() =>
                  onChoice(
                    isDiceRollSuccess
                      ? paragraph.diceResult!.successNextId
                      : paragraph.diceResult!.failNextId,
                    false,
                  )
                }
                aria-label="Przejść do następnego paragrafu"
              >
                PRZEJDŹ
              </Button>
            </div>
          )}

        {hasPages && (
          <div className="game__scenario-footer">
            <div className="game__scenario-label">
              Strona {currentPage + 1} z {maxPage + 1}
            </div>
            <div className="game__scenario-controls">
              <PaginationControls
                currentPage={currentPage}
                maxPage={maxPage}
                onPrev={() => setCurrentPage(Math.max(0, currentPage - 1))}
                onNext={() =>
                  setCurrentPage(Math.min(maxPage, currentPage + 1))
                }
              />
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
                <Button
                  key={choiceKey}
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    if (choice.nextVariantId) {
                      onChoice(choice.nextVariantId, true);
                    } else if (choice.nextParagraphId === "") {
                      onBack();
                    } else if (choice.nextParagraphId) {
                      onChoice(choice.nextParagraphId, false);
                    }
                  }}
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
                </Button>
              );
            })}
          </fieldset>
        )}
      </div>

      {showDeadEndInput && (
        <div role="status" aria-live="polite">
          <InputView
            onSubmit={onJumpToParagraph}
            instruction='Wprowadź poniżej numer paragrafu, a następnie naciśnij "PRZEJDŹ".'
            autoFocus={false}
            errorId="dead-end-error"
            actions={
              <>
                {onShowDice && (
                  <OptionButton
                    icon="🎲"
                    line1="Rzut"
                    line2="kością"
                    onClick={onShowDice}
                  />
                )}
                {onShowAlphabet && (
                  <OptionButton
                    icon="🆎"
                    line1="Żetony"
                    line2="alfabetu"
                    onClick={onShowAlphabet}
                  />
                )}
                {onShowDeath && (
                  <OptionButton
                    icon="💀"
                    line1="Śmierć"
                    line2="(§100)"
                    onClick={onShowDeath}
                  />
                )}{" "}
                {onShowEnemy && (
                  <OptionButton
                    icon="👽"
                    line1="Przeciwnik"
                    line2=""
                    onClick={onShowEnemy}
                  />
                )}{" "}
                <OptionButton
                  icon="◀️"
                  line1="Menu"
                  line2="scenariusza"
                  onClick={onBack}
                />
              </>
            }
          />
        </div>
      )}

      {regularChoices.length > 0 && (!hasPages || currentPage === maxPage) && (
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
              <Button
                key={choiceKey}
                variant="primary"
                size="lg"
                onClick={() => {
                  if (choice.nextVariantId) {
                    onChoice(choice.nextVariantId, true);
                  } else if (choice.nextParagraphId === "") {
                    onBack();
                  } else if (choice.nextParagraphId) {
                    onChoice(choice.nextParagraphId, false);
                  }
                }}
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
              </Button>
            );
          })}
        </fieldset>
      )}
    </>
  );
};
