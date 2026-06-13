import React from "react";
import { Button, OptionButton, SectionHeader } from "../../ui";
import { RichText } from "../../text/RichText/RichText";
import type { ContentBlock, Choice } from "../../../types";

interface PrepareViewProps {
  currentStep: number;
  totalSteps: number;
  pages: ContentBlock[][];
  choices: Choice[];
  scenarioId: string;
  onPrev: () => void;
  onNext: () => void;
  onStart: () => void;
  onChoice?: (nextParagraphId: string) => void;
}

export const PrepareView: React.FC<PrepareViewProps> = ({
  currentStep,
  totalSteps,
  pages,
  choices,
  scenarioId,
  onPrev,
  onNext,
  onStart,
  onChoice,
}) => {
  const currentPage = pages[currentStep] ?? [];
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <>
      <div className="game__scenario">
        <SectionHeader
          title="Przygotowanie scenariusza"
          subtitle={`Krok ${currentStep + 1} z ${totalSteps}`}
          controls={
            <>
              <OptionButton
                icon="◀️"
                line1="Poprzedni"
                onClick={onPrev}
                disabled={currentStep === 0}
              />
              <OptionButton
                icon="▶️"
                line1="Następny"
                iconPosition="right"
                onClick={onNext}
                disabled={isLastStep}
              />
            </>
          }
        />

        {currentPage.length > 0 && (
          <RichText content={currentPage} scenarioId={scenarioId} />
        )}

        {isLastStep && choices.length > 0 && onChoice && (
          <fieldset className="choices" aria-label="Dostępne opcje">
            <legend className="sr-only">Wybierz opcję</legend>
            {choices.map((choice, idx) => (
              <Button
                key={choice.id || `setup-choice-${idx}`}
                variant="primary"
                size="lg"
                onClick={() => {
                  if (choice.nextParagraphId) onChoice(choice.nextParagraphId);
                }}
              >
                {choice.text}
              </Button>
            ))}
          </fieldset>
        )}

        <div className="game__scenario-footer">
          <div className="game__scenario-label">
            Krok {currentStep + 1} z {totalSteps}
          </div>
          <div className="game__scenario-controls">
            <OptionButton
              icon="◀️"
              line1="Poprzedni"
              onClick={onPrev}
              disabled={currentStep === 0}
            />
            <OptionButton
              icon="▶️"
              line1="Następny"
              iconPosition="right"
              onClick={onNext}
              disabled={isLastStep}
            />
          </div>
        </div>
      </div>

      {isLastStep && choices.length === 0 && (
        <Button
          variant="primary"
          size="md"
          onClick={onStart}
          style={{ width: "100%", marginTop: "var(--spacing-md)" }}
        >
          Zacznij grę
        </Button>
      )}
    </>
  );
};
