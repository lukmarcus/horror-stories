import type { Paragraph } from '../types';
import { checkParagraphAccessibility } from '../utils/gameLogic';

interface UseGameActionsReturn {
  jumpToParagraph: (id: string, paragraphs: Record<string, Paragraph>) => {
    valid: boolean;
    error?: string;
    needsWarning?: boolean;
    pendingId?: string;
  };
}

export function useGameActions(): UseGameActionsReturn {
  return {
    jumpToParagraph: (id: string, paragraphs: Record<string, Paragraph>) => {
      const paragraphId = id.trim();

      if (!paragraphId) {
        return {
          valid: false,
          error: 'Wpisz numer paragrafu',
        };
      }

      if (!paragraphs[paragraphId]) {
        return {
          valid: false,
          error: `Paragraf #${paragraphId} nie istnieje`,
        };
      }

      const paragraph = paragraphs[paragraphId];
      const accessibility = checkParagraphAccessibility(paragraphId, paragraph);

      if (!accessibility.isAccessible && accessibility.needsWarning) {
        return {
          valid: false,
          error: undefined,
          needsWarning: true,
          pendingId: paragraphId,
        };
      }

      return {
        valid: true,
      };
    },
  };
}
