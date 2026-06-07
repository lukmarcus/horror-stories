import type { EditorState, EditorAction } from "../editorTypes";
import type { ContentBlock } from "../../../types";
import { mapParagraph } from "./reducerUtils";

export function paragraphReducer(
  state: EditorState,
  action: EditorAction,
): EditorState {
  switch (action.type) {
    case "ADD_PARAGRAPH": {
      if (!state.scenario) return state;
      const id = action.payload;
      if (state.scenario.paragraphs.some((p) => p.id === id)) return state;
      return {
        ...state,
        scenario: {
          ...state.scenario,
          paragraphs: [
            ...state.scenario.paragraphs,
            { id, pages: [[]] as ContentBlock[][] },
          ],
        },
        isDirty: true,
        activeParagraphId: id,
      };
    }
    case "ADD_PARAGRAPH_SILENT": {
      if (!state.scenario) return state;
      const id = action.payload;
      if (state.scenario.paragraphs.some((p) => p.id === id)) return state;
      return {
        ...state,
        scenario: {
          ...state.scenario,
          paragraphs: [
            ...state.scenario.paragraphs,
            { id, pages: [[]] as ContentBlock[][] },
          ],
        },
        isDirty: true,
      };
    }
    case "REMOVE_PARAGRAPH": {
      if (!state.scenario || action.payload === "100") return state;
      return {
        ...state,
        scenario: {
          ...state.scenario,
          paragraphs: state.scenario.paragraphs.filter(
            (p) => p.id !== action.payload,
          ),
        },
        isDirty: true,
        activeParagraphId:
          state.activeParagraphId === action.payload
            ? null
            : state.activeParagraphId,
      };
    }
    case "SET_ACTIVE_PARAGRAPH":
      return { ...state, activeParagraphId: action.payload };
    case "SET_PARAGRAPH_TEXT":
      return mapParagraph(state, action.payload.id, (p) => ({
        ...p,
        text: action.payload.text,
      }));
    case "CONVERT_TEXT_TO_PAGES":
      return mapParagraph(state, action.payload, (p) => {
        const lines = (p.text ?? "").split("\n").filter((l) => l.trim() !== "");
        const page = lines.map((line) => ({
          type: "text" as const,
          text: line,
        }));
        return { ...p, pages: [page.length > 0 ? page : []], text: undefined };
      });
    case "SET_PARAGRAPH_PAGES":
      return mapParagraph(state, action.payload.id, (p) => ({
        ...p,
        pages: action.payload.pages,
      }));
    case "ADD_PAGE":
      return mapParagraph(state, action.payload.paragraphId, (p) => ({
        ...p,
        pages: [...(p.pages ?? [[]]), []],
      }));
    case "REMOVE_PAGE":
      return mapParagraph(state, action.payload.paragraphId, (p) => {
        const pages = (p.pages ?? [[]]).filter(
          (_, i) => i !== action.payload.pageIndex,
        );
        return { ...p, pages: pages.length > 0 ? pages : [[]] };
      });
    case "ADD_BLOCK":
      return mapParagraph(state, action.payload.paragraphId, (p) => ({
        ...p,
        pages: (p.pages ?? [[]]).map((page, i) =>
          i === action.payload.pageIndex
            ? [...page, action.payload.block]
            : page,
        ),
      }));
    case "UPDATE_BLOCK":
      return mapParagraph(state, action.payload.paragraphId, (p) => ({
        ...p,
        pages: (p.pages ?? [[]]).map((page, i) =>
          i === action.payload.pageIndex
            ? page.map((b, j) =>
                j === action.payload.blockIndex ? action.payload.block : b,
              )
            : page,
        ),
      }));
    case "REMOVE_BLOCK":
      return mapParagraph(state, action.payload.paragraphId, (p) => ({
        ...p,
        pages: (p.pages ?? [[]]).map((page, i) =>
          i === action.payload.pageIndex
            ? page.filter((_, j) => j !== action.payload.blockIndex)
            : page,
        ),
      }));
    case "ADD_CHOICE":
      return mapParagraph(state, action.payload.paragraphId, (p) => ({
        ...p,
        choices: [...(p.choices ?? []), action.payload.choice],
      }));
    case "UPDATE_CHOICE":
      return mapParagraph(state, action.payload.paragraphId, (p) => ({
        ...p,
        choices: (p.choices ?? []).map((c) =>
          c.id === action.payload.choice.id ? action.payload.choice : c,
        ),
      }));
    case "REMOVE_CHOICE":
      return mapParagraph(state, action.payload.paragraphId, (p) => ({
        ...p,
        choices: (p.choices ?? []).filter(
          (c) => c.id !== action.payload.choiceId,
        ),
      }));
    case "ADD_ALIAS":
      return mapParagraph(state, action.payload.paragraphId, (p) => ({
        ...p,
        aliases: [...(p.aliases ?? []), action.payload.alias],
      }));
    case "REMOVE_ALIAS":
      return mapParagraph(state, action.payload.paragraphId, (p) => ({
        ...p,
        aliases: (p.aliases ?? []).filter((a) => a !== action.payload.alias),
      }));
    default:
      return state;
  }
}
