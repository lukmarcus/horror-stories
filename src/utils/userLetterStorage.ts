import type { LetterToken } from "../types";

const storageKey = (scenarioId: string) =>
  `horror-stories:user-letters:${scenarioId}`;

export function saveUserLetters(
  scenarioId: string,
  letters: LetterToken[],
): void {
  try {
    if (letters.length === 0) {
      localStorage.removeItem(storageKey(scenarioId));
    } else {
      localStorage.setItem(storageKey(scenarioId), JSON.stringify(letters));
    }
  } catch {
    // ignore storage errors
  }
}

export function loadUserLetters(scenarioId: string): LetterToken[] {
  try {
    const raw = localStorage.getItem(storageKey(scenarioId));
    if (!raw) return [];
    return JSON.parse(raw) as LetterToken[];
  } catch {
    return [];
  }
}

export function removeUserLetters(scenarioId: string): void {
  try {
    localStorage.removeItem(storageKey(scenarioId));
  } catch {
    // ignore storage errors
  }
}
