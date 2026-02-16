/**
 * Game Logic Utilities
 * Core logic functions extracted from Game component
 */

import type { Paragraph } from "../types";

/**
 * Check if a paragraph is accessible and determine if warning is needed
 * @param paragraphId - ID of the paragraph to check
 * @param paragraph - The paragraph object
 * @returns Object with accessibility info
 */
export function checkParagraphAccessibility(
  paragraphId: string,
  paragraph: Paragraph | undefined,
): {
  exists: boolean;
  isAccessible: boolean;
  needsWarning: boolean;
  accessibleFrom?: string[];
  errorMessage?: string;
} {
  if (!paragraph) {
    return {
      exists: false,
      isAccessible: false,
      needsWarning: false,
      errorMessage: `Paragraf #${paragraphId} nie istnieje`,
    };
  }

  // Check if paragraph is directly accessible
  // Paragraph is NOT directly accessible if it has accessibleFrom constraints
  const needsWarning =
    !!paragraph.accessibleFrom && paragraph.accessibleFrom.length > 0;

  return {
    exists: true,
    isAccessible: !needsWarning,
    needsWarning,
    accessibleFrom: paragraph.accessibleFrom,
  };
}

/**
 * Get accessible sources for a non-direct paragraph
 * @param paragraph - The paragraph object
 * @returns Array of paragraph IDs that lead to this paragraph
 */
export function getAccessibleSources(paragraph: Paragraph): string[] {
  return paragraph.accessibleFrom || [];
}

/**
 * Validate paragraph ID format and existence
 * @param paragraphId - ID to validate
 * @param paragraphs - All available paragraphs
 * @returns Validation result
 */
export function validateParagraphId(
  paragraphId: string,
  paragraphs: Record<string, Paragraph>,
): {
  valid: boolean;
  errorMessage?: string;
} {
  const trimmed = paragraphId.trim();

  if (!trimmed) {
    return {
      valid: false,
      errorMessage: "Wpisz numer paragrafu",
    };
  }

  if (!paragraphs[trimmed]) {
    return {
      valid: false,
      errorMessage: `Paragraf #${trimmed} nie istnieje`,
    };
  }

  return { valid: true };
}
