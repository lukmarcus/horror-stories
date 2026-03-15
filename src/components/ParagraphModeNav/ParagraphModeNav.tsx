import React from "react";
import { Button } from "../common";

interface ParagraphModeNavProps {
  currentParagraphId?: string | string[];
  hasVariants: boolean;
  variantPathLength: number;
  accessibleFrom: string[];
  onRefreshVariants: () => void;
  onNavigateToParagraph: (paragraphId: string) => void;
  onBackToInput: () => void;
}

export const ParagraphModeNav: React.FC<ParagraphModeNavProps> = ({
  currentParagraphId,
  hasVariants,
  variantPathLength,
  accessibleFrom,
  onRefreshVariants,
  onNavigateToParagraph,
  onBackToInput,
}) => (
  <div className="game__content-nav">
    {hasVariants && variantPathLength > 0 && (
      <Button
        variant="outline"
        size="sm"
        onClick={onRefreshVariants}
        aria-label={`Odśwież paragraf ${currentParagraphId} i dokonaj wyborów od nowa`}
      >
        ↻ Odśwież #{currentParagraphId}
      </Button>
    )}
    {accessibleFrom && accessibleFrom.length > 0 && (
      <>
        {accessibleFrom.length === 1 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateToParagraph(accessibleFrom[0])}
            aria-label={`Wróć do paragrafu ${accessibleFrom[0]}`}
          >
            ← Wróć do #{accessibleFrom[0]}
          </Button>
        ) : (
          <>
            {accessibleFrom.map((paraId) => (
              <Button
                key={paraId}
                variant="outline"
                size="sm"
                onClick={() => onNavigateToParagraph(paraId)}
                aria-label={`Wróć do paragrafu ${paraId}`}
              >
                ← Wróć do #{paraId}
              </Button>
            ))}
          </>
        )}
      </>
    )}
    <Button
      variant="outline"
      size="sm"
      onClick={onBackToInput}
      aria-label="Powrót do menu scenariusza"
    >
      ← Wróć do menu scenariusza
    </Button>
  </div>
);
