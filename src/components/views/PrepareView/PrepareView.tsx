import React from "react";
import { Button, OptionButton, SectionHeader } from "../../ui";
import { RichText } from "../../text/RichText/RichText";
import type { SetupStep } from "../../../types";

interface PrepareViewProps {
  currentStep: number;
  totalSteps: number;
  setupSteps: SetupStep[];
  scenarioId: string;
  startParagraphId: string;
  onPrev: () => void;
  onNext: () => void;
  onStart: () => void;
}

export const PrepareView: React.FC<PrepareViewProps> = ({
  currentStep,
  totalSteps,
  setupSteps,
  scenarioId,
  startParagraphId,
  onPrev,
  onNext,
  onStart,
}) => {
  const currentSetupStep = setupSteps[currentStep];
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

        {currentSetupStep?.content && (
          <RichText
            content={currentSetupStep.content}
            scenarioId={scenarioId}
          />
        )}
        {currentSetupStep?.text && (
          <RichText text={currentSetupStep.text} scenarioId={scenarioId} />
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

      {isLastStep && (
        <Button
          variant="primary"
          size="md"
          onClick={onStart}
          style={{ width: "100%", marginTop: "var(--spacing-md)" }}
        >
          Przejdź do paragrafu {startParagraphId}
        </Button>
      )}
    </>
  );
};
