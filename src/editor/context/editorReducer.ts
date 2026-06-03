import type { EditorState, EditorAction, EditorParagraph } from "./editorTypes";
import type { ContentBlock } from "../../types";

export const DEATH_PARAGRAPH = {
  id: "100",
  pages: [[]] as ContentBlock[][],
};

export const initialState: EditorState = {
  scenario: null,
  isDirty: false,
  activeParagraphId: null,
};

function ensureDeath(paragraphs: { id: string }[]): typeof paragraphs {
  return paragraphs.some((p) => p.id === "100")
    ? paragraphs
    : [...paragraphs, DEATH_PARAGRAPH];
}

function mapParagraph(
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

export function editorReducer(
  state: EditorState,
  action: EditorAction,
): EditorState {
  switch (action.type) {
    case "NEW_SCENARIO":
      return {
        scenario: {
          meta: {
            id: "",
            title: "",
            description: "",
            minPlayerCount: null,
            maxPlayerCount: null,
            duration: null,
          },
          paragraphs: [DEATH_PARAGRAPH],
          images: {},
          letters: [],
        },
        isDirty: false,
        activeParagraphId: null,
      };
    case "SET_META":
      return {
        ...state,
        scenario: state.scenario
          ? { ...state.scenario, meta: action.payload }
          : {
              meta: action.payload,
              paragraphs: [DEATH_PARAGRAPH],
              images: {},
              letters: [],
            },
        isDirty: true,
      };
    case "LOAD_SCENARIO":
      if (!action.payload) {
        return {
          scenario: null,
          isDirty: false,
          activeParagraphId: null,
        };
      }
      return {
        scenario: {
          ...action.payload,
          paragraphs: ensureDeath(
            Array.isArray(action.payload.paragraphs)
              ? action.payload.paragraphs
              : [],
          ),
          images:
            typeof action.payload.images === "object" &&
            !Array.isArray(action.payload.images)
              ? action.payload.images
              : {},
          letters: Array.isArray(action.payload.letters)
            ? action.payload.letters
            : [],
        },
        isDirty: false,
        activeParagraphId: null,
      };
    case "MARK_SAVED":
      return { ...state, isDirty: false };
    case "ADD_PARAGRAPH": {
      if (!state.scenario) return state;
      const id = action.payload;
      if (state.scenario.paragraphs.some((p) => p.id === id)) return state;
      const paragraphs = [
        ...state.scenario.paragraphs,
        { id, pages: [[]] as ContentBlock[][] },
      ];
      return {
        ...state,
        scenario: { ...state.scenario, paragraphs },
        isDirty: true,
        activeParagraphId: id,
      };
    }
    case "ADD_PARAGRAPH_SILENT": {
      if (!state.scenario) return state;
      const id = action.payload;
      if (state.scenario.paragraphs.some((p) => p.id === id)) return state;
      const paragraphs = [
        ...state.scenario.paragraphs,
        { id, pages: [[]] as ContentBlock[][] },
      ];
      return {
        ...state,
        scenario: { ...state.scenario, paragraphs },
        isDirty: true,
      };
    }
    case "REMOVE_PARAGRAPH": {
      if (!state.scenario || action.payload === "100") return state;
      const paragraphs = state.scenario.paragraphs.filter(
        (p) => p.id !== action.payload,
      );
      return {
        ...state,
        scenario: { ...state.scenario, paragraphs },
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
    case "CONVERT_TEXT_TO_PAGES": {
      return mapParagraph(state, action.payload, (p) => {
        const lines = (p.text ?? "").split("\n").filter((l) => l.trim() !== "");
        const page = lines.map((line) => ({
          type: "text" as const,
          text: line,
        }));
        return { ...p, pages: [page.length > 0 ? page : []], text: undefined };
      });
    }
    case "SET_PARAGRAPH_PAGES":
      return mapParagraph(state, action.payload.id, (p) => ({
        ...p,
        pages: action.payload.pages,
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
    // ── Variant selectors ────────────────────────────────────────────────────
    case "ADD_VARIANT_SELECTOR":
      return mapParagraph(state, action.payload.paragraphId, (p) => ({
        ...p,
        variantSelectors: [
          ...(p.variantSelectors ?? []),
          action.payload.choice,
        ],
      }));
    case "UPDATE_VARIANT_SELECTOR":
      return mapParagraph(state, action.payload.paragraphId, (p) => ({
        ...p,
        variantSelectors: (p.variantSelectors ?? []).map((c) =>
          c.id === action.payload.choice.id ? action.payload.choice : c,
        ),
      }));
    case "REMOVE_VARIANT_SELECTOR":
      return mapParagraph(state, action.payload.paragraphId, (p) => ({
        ...p,
        variantSelectors: (p.variantSelectors ?? []).filter(
          (c) => c.id !== action.payload.choiceId,
        ),
      }));
    // ── Variants ─────────────────────────────────────────────────────────────
    case "ADD_VARIANT":
      return mapParagraph(state, action.payload.paragraphId, (p) => {
        if ((p.variants ?? {})[action.payload.variantId]) return p;
        return {
          ...p,
          variants: {
            ...(p.variants ?? {}),
            [action.payload.variantId]: { pages: [[]] },
          },
        };
      });
    case "REMOVE_VARIANT":
      return mapParagraph(state, action.payload.paragraphId, (p) => {
        const variants = { ...(p.variants ?? {}) };
        delete variants[action.payload.variantId];
        return {
          ...p,
          variants: Object.keys(variants).length > 0 ? variants : undefined,
        };
      });
    case "SET_VARIANT_PAGES":
      return mapParagraph(state, action.payload.paragraphId, (p) => {
        if (!p.variants) return p;
        const variant = p.variants[action.payload.variantId];
        if (!variant) return p;
        return {
          ...p,
          variants: {
            ...p.variants,
            [action.payload.variantId]: {
              ...variant,
              pages: action.payload.pages,
            },
          },
        };
      });
    case "SET_VARIANT_HORIZONTAL":
      return mapParagraph(state, action.payload.paragraphId, (p) => {
        if (!p.variants) return p;
        const variant = p.variants[action.payload.variantId];
        if (!variant) return p;
        return {
          ...p,
          variants: {
            ...p.variants,
            [action.payload.variantId]: {
              ...variant,
              areChoicesHorizontal: action.payload.value || undefined,
            },
          },
        };
      });
    case "ADD_VARIANT_CHOICE":
      return mapParagraph(state, action.payload.paragraphId, (p) => {
        if (!p.variants) return p;
        const variant = p.variants[action.payload.variantId];
        if (!variant) return p;
        return {
          ...p,
          variants: {
            ...p.variants,
            [action.payload.variantId]: {
              ...variant,
              choices: [...(variant.choices ?? []), action.payload.choice],
            },
          },
        };
      });
    case "UPDATE_VARIANT_CHOICE":
      return mapParagraph(state, action.payload.paragraphId, (p) => {
        if (!p.variants) return p;
        const variant = p.variants[action.payload.variantId];
        if (!variant) return p;
        return {
          ...p,
          variants: {
            ...p.variants,
            [action.payload.variantId]: {
              ...variant,
              choices: (variant.choices ?? []).map((c) =>
                c.id === action.payload.choice.id ? action.payload.choice : c,
              ),
            },
          },
        };
      });
    case "REMOVE_VARIANT_CHOICE":
      return mapParagraph(state, action.payload.paragraphId, (p) => {
        if (!p.variants) return p;
        const variant = p.variants[action.payload.variantId];
        if (!variant) return p;
        return {
          ...p,
          variants: {
            ...p.variants,
            [action.payload.variantId]: {
              ...variant,
              choices: (variant.choices ?? []).filter(
                (c) => c.id !== action.payload.choiceId,
              ),
            },
          },
        };
      });
    case "ENABLE_VARIANT_MODE":
      return mapParagraph(state, action.payload, (p) => ({
        ...p,
        variants: {},
        variantSelectors: [],
        choices: undefined,
      }));
    case "DISABLE_VARIANT_MODE":
      return mapParagraph(state, action.payload, (p) => ({
        ...p,
        variants: undefined,
        variantSelectors: undefined,
      }));
    case "RENAME_VARIANT":
      return mapParagraph(state, action.payload.paragraphId, (p) => {
        if (!p.variants || !p.variants[action.payload.oldId]) return p;
        const entries = Object.entries(p.variants).map(([k, v]) => [
          k === action.payload.oldId ? action.payload.newId : k,
          v,
        ]);
        return { ...p, variants: Object.fromEntries(entries) };
      });
    case "ADD_IMAGE": {
      if (!state.scenario) return state;
      return {
        ...state,
        scenario: {
          ...state.scenario,
          images: {
            ...state.scenario.images,
            [action.payload.id]: action.payload.data,
          },
        },
        isDirty: true,
      };
    }
    case "REMOVE_IMAGE": {
      if (!state.scenario) return state;
      const images = { ...(state.scenario.images ?? {}) };
      delete images[action.payload];
      return {
        ...state,
        scenario: { ...state.scenario, images },
        isDirty: true,
      };
    }
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
    case "LOAD_LETTERS":
      if (!state.scenario) return state;
      return {
        ...state,
        scenario: {
          ...state.scenario,
          letters: Array.isArray(action.payload.letters)
            ? action.payload.letters
            : [],
        },
        isDirty: true,
      };
    case "ADD_LETTER":
      if (!state.scenario) return state;
      return {
        ...state,
        scenario: {
          ...state.scenario,
          letters: [
            ...(state.scenario.letters ?? []),
            { id: action.payload.id, paragraphId: action.payload.paragraphId },
          ],
        },
        isDirty: true,
      };
    case "REMOVE_LETTER":
      if (!state.scenario) return state;
      return {
        ...state,
        scenario: {
          ...state.scenario,
          letters: (state.scenario.letters ?? []).filter(
            (l) => l.id !== action.payload,
          ),
        },
        isDirty: true,
      };
    case "UPDATE_LETTER":
      if (!state.scenario) return state;
      return {
        ...state,
        scenario: {
          ...state.scenario,
          letters: (state.scenario.letters ?? []).map((l) =>
            l.id === action.payload.id
              ? {
                  id: action.payload.id,
                  paragraphId: action.payload.paragraphId,
                }
              : l,
          ),
        },
        isDirty: true,
      };
    default:
      return state;
  }
}
