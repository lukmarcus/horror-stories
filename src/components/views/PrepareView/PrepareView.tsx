import React from "react";
import { Button, SectionHeader } from "../../ui";
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
              <Button
                variant="secondary"
                size="sm"
                onClick={onPrev}
                disabled={currentStep === 0}
              >
                ◀️ Poprzedni
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={onNext}
                disabled={isLastStep}
              >
                Następny ▶️
              </Button>
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
            <Button
              variant="secondary"
              size="sm"
              onClick={onPrev}
              disabled={currentStep === 0}
            >
              ◀️ Poprzedni
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={onNext}
              disabled={isLastStep}
            >
              Następny ▶️
            </Button>
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
