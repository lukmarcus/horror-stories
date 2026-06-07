import type { EditorState, EditorAction } from "../editorTypes";
import { mapParagraph } from "./reducerUtils";

export function variantReducer(
  state: EditorState,
  action: EditorAction,
): EditorState {
  switch (action.type) {
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
    default:
      return state;
  }
}
