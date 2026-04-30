import type { EditorParagraph } from "../editor/context/editorTypes";

const storageKey = (scenarioId: string) =>
  `horror-stories:user-paragraphs:${scenarioId}`;

export function saveUserParagraphs(
  scenarioId: string,
  paragraphs: EditorParagraph[],
): void {
  try {
    localStorage.setItem(storageKey(scenarioId), JSON.stringify(paragraphs));
  } catch {
    // ignore storage errors
  }
}

export function loadUserParagraphs(scenarioId: string): EditorParagraph[] {
  try {
    const raw = localStorage.getItem(storageKey(scenarioId));
    if (!raw) return [];
    return JSON.parse(raw) as EditorParagraph[];
  } catch {
    return [];
  }
}

export function removeUserParagraphs(scenarioId: string): void {
  try {
    localStorage.removeItem(storageKey(scenarioId));
  } catch {
    // ignore storage errors
  }
}
