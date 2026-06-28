import React from "react";
import type { Choice } from "../../../types";
import { RichText } from "../../text/RichText/RichText";
import { ConditionalChoice } from "../../text/ConditionalChoice/ConditionalChoice";
import { Button } from "../../ui";

interface ChoicesSectionProps {
  choices: Choice[];
  isHorizontal: boolean;
  hasPages: boolean;
  currentPage: number;
  maxPage: number;
  scenarioId?: string;
  images?: Record<string, string>;
  onChoice: (nextId: string | undefined, isVariant?: boolean) => void;
  onBack: () => void;
}

export const ChoicesSection: React.FC<ChoicesSectionProps> = ({
  choices,
  isHorizontal,
  hasPages,
  currentPage,
  maxPage,
  scenarioId,
  images,
  onChoice,
  onBack,
}) => {
  // Don't show vertical choices on non-final pages
  if (!isHorizontal && hasPages && currentPage !== maxPage) {
    return null;
  }

  if (choices.length === 0) {
    return null;
  }

  const fieldsetClass = isHorizontal
    ? "choices choices--horizontal"
    : "choices choices--vertical";
  const ariaLabel = isHorizontal ? "Dostępne warianty" : "Dostępne wybory";
  const legendText = isHorizontal
    ? "Wybierz wariant"
    : "Wybierz następny paragraf";

  return (
    <fieldset className={fieldsetClass} aria-label={ariaLabel}>
      <legend className="sr-only">{legendText}</legend>
      {choices.map((choice, idx) => {
        const choiceKey = choice.id || `choice-${idx}`;

        if (choice.isConditional) {
          return (
            <ConditionalChoice
              key={choiceKey}
              choice={choice}
              onYes={() =>
                choice.yesNextId && onChoice(choice.yesNextId, false)
              }
              onNo={() => choice.noNextId && onChoice(choice.noNextId, false)}
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
                images={images}
                noSpacing
              />
            ) : (
              choice.text
            )}
          </Button>
        );
      })}
    </fieldset>
  );
};
