import React from "react";
import { OptionButton } from "../../ui";

interface ParagraphNavigationProps {
  currentParagraphId: string;
  hasVariants: boolean;
  variantPathLength: number;
  accessibleFrom: string[];
  onRefreshVariants?: () => void;
  onBackToAlphabet?: () => void;
  onNavigateToParagraph?: (paragraphId: string) => void;
  onBack: () => void;
}

export const ParagraphNavigation: React.FC<ParagraphNavigationProps> = ({
  currentParagraphId,
  hasVariants,
  variantPathLength,
  accessibleFrom,
  onRefreshVariants,
  onBackToAlphabet,
  onNavigateToParagraph,
  onBack,
}) => {
  return (
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

      {accessibleFrom.length > 0 && onNavigateToParagraph && (
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
  );
};
