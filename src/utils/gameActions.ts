import type { Paragraph } from "../types";
import { checkParagraphAccessibility } from "./gameLogic";

export interface JumpResult {
  valid: boolean;
  error?: string;
  needsWarning?: boolean;
  pendingId?: string;
}

export function jumpToParagraph(
  id: string,
  paragraphs: Record<string, Paragraph>,
): JumpResult {
  const paragraphId = id.trim();

  if (!paragraphId) {
    return {
      valid: false,
      error: "Wpisz numer paragrafu",
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
}
