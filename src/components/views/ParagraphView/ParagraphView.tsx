import React from "react";
import type { Paragraph } from "../../../types";
import { ParagraphText } from "../../text/ParagraphText/ParagraphText";
import { RichText } from "../../text/RichText/RichText";
import { InputView } from "../InputView/InputView";
import { SectionHeader } from "../../ui/SectionHeader";
import { OptionButton } from "../../ui";
import { ParagraphNavigation } from "./ParagraphNavigation";
import { ChoicesSection } from "./ChoicesSection";
import { DiceResultDisplay } from "./DiceResultDisplay";
import "./ParagraphView.css";

interface ParagraphViewProps {
  paragraph: Paragraph;
  currentParagraphId: string;
  lastDiceResult: number | null;
  onChoice: (nextId: string | undefined, isVariant?: boolean) => void;
  onJumpToParagraph: (value: string) => string | null;
  onBack: () => void;
  scenarioId?: string;
  images?: Record<string, string>;
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
  images,
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
  const isDiceRollSuccess = !!(
    paragraph.hasDiceRoll &&
    paragraph.diceResult &&
    lastDiceResult !== null &&
    lastDiceResult > paragraph.diceResult.threshold
  );

  // Check if paragraph is dead end (no choices, no dice)
  const isDeadEnd =
    (!paragraph.choices || paragraph.choices.length === 0) &&
    !paragraph.hasDiceRoll;

  // Handle content pages - auto-detect if multiple pages exist
  const hasPages = !!(paragraph.pages && paragraph.pages.length > 1);
  const maxPage = paragraph.pages ? paragraph.pages.length - 1 : 0;
  const currentContent = paragraph.pages
    ? paragraph.pages[currentPage]
    : paragraph.content;

  // Show input only on last page of dead-end paragraphs
  const showDeadEndInput = isDeadEnd && currentPage === maxPage;

  // Separate variant choices (horizontal/within frame) from regular choices
  // Top-level paragraphs: horizontal when they have variants
  // Nested variants: horizontal when explicitly marked with areChoicesHorizontal
  const isHorizontal = !!paragraph.variants || !!paragraph.areChoicesHorizontal;
  const variantChoices = isHorizontal ? paragraph.choices || [] : [];
  const regularChoices = isHorizontal ? [] : paragraph.choices || [];

  return (
    <>
      <ParagraphNavigation
        currentParagraphId={currentParagraphId}
        hasVariants={hasVariants}
        variantPathLength={variantPathLength}
        accessibleFrom={accessibleFrom}
        onRefreshVariants={onRefreshVariants}
        onBackToAlphabet={onBackToAlphabet}
        onNavigateToParagraph={onNavigateToParagraph}
        onBack={onBack}
      />

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
          <RichText
            content={currentContent}
            scenarioId={scenarioId}
            images={images}
          />
        )}

        {paragraph.hasDiceRoll &&
          paragraph.diceResult &&
          lastDiceResult !== null && (
            <DiceResultDisplay
              diceResult={paragraph.diceResult}
              lastDiceResult={lastDiceResult}
              isDiceRollSuccess={isDiceRollSuccess}
              onChoice={onChoice}
            />
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

        <ChoicesSection
          choices={variantChoices}
          isHorizontal={true}
          hasPages={hasPages}
          currentPage={currentPage}
          maxPage={maxPage}
          scenarioId={scenarioId}
          images={images}
          onChoice={onChoice}
          onBack={onBack}
        />
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

      <ChoicesSection
        choices={regularChoices}
        isHorizontal={false}
        hasPages={hasPages}
        currentPage={currentPage}
        maxPage={maxPage}
        scenarioId={scenarioId}
        images={images}
        onChoice={onChoice}
        onBack={onBack}
      />
    </>
  );
};
