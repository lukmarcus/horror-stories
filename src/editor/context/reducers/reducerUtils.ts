import type { EditorState, EditorParagraph } from "../editorTypes";
import type { ContentBlock } from "../../../types";

export const DEATH_PARAGRAPH = {
  id: "100",
  pages: [[]] as ContentBlock[][],
};

export function ensureDeath(paragraphs: { id: string }[]): typeof paragraphs {
  return paragraphs.some((p) => p.id === "100")
    ? paragraphs
    : [...paragraphs, DEATH_PARAGRAPH];
}

export function mapParagraph(
  state: EditorState,
  id: string,
  update: (p: EditorParagraph) => EditorParagraph,
): EditorState {
  if (!state.scenario) return state;
  return {
    ...state,
    scenario: {
      ...state.scenario,
      paragraphs: state.scenario.paragraphs.map((p) =>
        p.id === id ? update(p) : p,
      ),
    },
    isDirty: true,
  };
}
