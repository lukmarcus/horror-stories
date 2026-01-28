import type { Paragraph } from '../types';
import { checkParagraphAccessibility } from '../utils/gameLogic';

interface UseGameActionsReturn {
  jumpToParagraph: (id: string, paragraphs: Record<string, Paragraph>) => {
    valid: boolean;
    error?: string;
    needsWarning?: boolean;
    pendingId?: string;
  };
  validateInput: (input: string, paragraphs: Record<string, Paragraph>) => {
    valid: boolean;
    error?: string;
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

    validateInput: (input: string, paragraphs: Record<string, Paragraph>) => {
      const trimmed = input.trim();

      if (!trimmed) {
        return {
          valid: false,
          error: 'Wpisz numer paragrafu aby kontynuować',
        };
      }

      if (!paragraphs[trimmed]) {
        const availableIds = Object.keys(paragraphs).sort();
        return {
          valid: false,
          error: `Paragraf #${trimmed} nie istnieje. Dostępne: ${availableIds.slice(0, 3).join(', ')}${
            availableIds.length > 3 ? '...' : ''
          }`,
        };
      }

      return {
        valid: true,
      };
    },
  };
}
