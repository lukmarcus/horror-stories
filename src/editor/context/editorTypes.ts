import { createContext } from "react";
import type { Scenario, ContentBlock } from "../../types";

export interface EditorChoice {
  id: string;
  text: string;
  /** Target paragraph ID (empty string = back to menu) */
  nextParagraphId?: string;
  /** Target variant key within the same paragraph's variants record */
  nextVariantId?: string;
}

export interface EditorVariant {
  /** Rich content pages */
  pages: ContentBlock[][];
  /** Whether choices are shown as horizontal row (can be true even with only nextParagraphId targets) */
  areChoicesHorizontal?: boolean;
  /** Choices shown at the end of this variant */
  choices?: EditorChoice[];
}

export interface EditorParagraph {
  id: string;
  /** Additional IDs under which this paragraph is also accessible in the game */
  aliases?: string[];
  /** Legacy plain-text field — kept for backward compatibility with older saves */
  text?: string;
  /** Rich content pages (for "prosty" paragraphs) */
  pages?: ContentBlock[][];
  /** Choices for "prosty" paragraphs — vertical, point to nextParagraphId only */
  choices?: EditorChoice[];
  /** Variant record — presence means this is a "wariantowy" paragraph.
   *  Top-level choices (selector row) are stored separately as variantSelectors. */
  variants?: Record<string, EditorVariant>;
  /** Horizontal selector choices for "wariantowy" paragraphs — always nextVariantId */
  variantSelectors?: EditorChoice[];
}

export interface EditorLetter {
  id: string;
  paragraphId: string;
}

export interface EditorSetup {
  /** Pages of content blocks — each page shown as one step */
  pages: ContentBlock[][];
  /** Optional choices shown on the last page */
  choices?: EditorChoice[];
}

export interface EditorScenario {
  meta: Scenario;
  paragraphs: EditorParagraph[];
  /** Setup (preparation steps + optional navigation choices) */
  setup?: EditorSetup;
  /** User-uploaded images: id → base64 data URL */
  images?: Record<string, string>;
  /** Scenario letters mapping */
  letters?: EditorLetter[];
}

export interface EditorState {
  scenario: EditorScenario | null;
  isDirty: boolean;
  activeParagraphId: string | null;
}

export type EditorAction =
  | { type: "SET_META"; payload: Scenario }
  | { type: "LOAD_SCENARIO"; payload: EditorScenario | null }
  | { type: "NEW_SCENARIO" }
  | { type: "MARK_SAVED" }
  | { type: "ADD_PARAGRAPH"; payload: string }
  | { type: "ADD_PARAGRAPH_SILENT"; payload: string }
  | { type: "REMOVE_PARAGRAPH"; payload: string }
  | { type: "SET_ACTIVE_PARAGRAPH"; payload: string | null }
  | { type: "SET_PARAGRAPH_TEXT"; payload: { id: string; text: string } }
  | {
      type: "SET_PARAGRAPH_PAGES";
      payload: { id: string; pages: ContentBlock[][] };
    }
  | { type: "ADD_PAGE"; payload: { paragraphId: string } }
  | { type: "REMOVE_PAGE"; payload: { paragraphId: string; pageIndex: number } }
  | {
      type: "ADD_BLOCK";
      payload: { paragraphId: string; pageIndex: number; block: ContentBlock };
    }
  | {
      type: "UPDATE_BLOCK";
      payload: {
        paragraphId: string;
        pageIndex: number;
        blockIndex: number;
        block: ContentBlock;
      };
    }
  | {
      type: "REMOVE_BLOCK";
      payload: {
        paragraphId: string;
        pageIndex: number;
        blockIndex: number;
      };
    }
  | {
      type: "ADD_CHOICE";
      payload: { paragraphId: string; choice: EditorChoice };
    }
  | {
      type: "UPDATE_CHOICE";
      payload: { paragraphId: string; choice: EditorChoice };
    }
  | {
      type: "REMOVE_CHOICE";
      payload: { paragraphId: string; choiceId: string };
    }
  // ── Variant selector (horizontal row choices on "wariantowy" paragraph) ──
  | {
      type: "ADD_VARIANT_SELECTOR";
      payload: { paragraphId: string; choice: EditorChoice };
    }
  | {
      type: "UPDATE_VARIANT_SELECTOR";
      payload: { paragraphId: string; choice: EditorChoice };
    }
  | {
      type: "REMOVE_VARIANT_SELECTOR";
      payload: { paragraphId: string; choiceId: string };
    }
  // ── Variants ──
  | {
      type: "ADD_VARIANT";
      payload: { paragraphId: string; variantId: string };
    }
  | {
      type: "REMOVE_VARIANT";
      payload: { paragraphId: string; variantId: string };
    }
  | {
      type: "SET_VARIANT_PAGES";
      payload: {
        paragraphId: string;
        variantId: string;
        pages: ContentBlock[][];
      };
    }
  | {
      type: "SET_VARIANT_HORIZONTAL";
      payload: { paragraphId: string; variantId: string; value: boolean };
    }
  | {
      type: "ADD_VARIANT_CHOICE";
      payload: { paragraphId: string; variantId: string; choice: EditorChoice };
    }
  | {
      type: "UPDATE_VARIANT_CHOICE";
      payload: { paragraphId: string; variantId: string; choice: EditorChoice };
    }
  | {
      type: "REMOVE_VARIANT_CHOICE";
      payload: { paragraphId: string; variantId: string; choiceId: string };
    }
  | { type: "ENABLE_VARIANT_MODE"; payload: string }
  | { type: "DISABLE_VARIANT_MODE"; payload: string }
  | {
      type: "RENAME_VARIANT";
      payload: { paragraphId: string; oldId: string; newId: string };
    }
  | { type: "CONVERT_TEXT_TO_PAGES"; payload: string }
  | { type: "ADD_IMAGE"; payload: { id: string; data: string } }
  | { type: "REMOVE_IMAGE"; payload: string }
  | { type: "ADD_ALIAS"; payload: { paragraphId: string; alias: string } }
  | { type: "REMOVE_ALIAS"; payload: { paragraphId: string; alias: string } }
  | {
      type: "LOAD_LETTERS";
      payload: { letters: Array<{ id: string; paragraphId: string }> };
    }
  | {
      type: "ADD_LETTER";
      payload: { id: string; paragraphId: string };
    }
  | { type: "REMOVE_LETTER"; payload: string }
  | {
      type: "UPDATE_LETTER";
      payload: { id: string; paragraphId: string };
    }
  | { type: "ADD_SETUP_PAGE" }
  | { type: "REMOVE_SETUP_PAGE"; payload: number }
  | {
      type: "SET_SETUP_PAGES";
      payload: ContentBlock[][];
    }
  | {
      type: "SET_SETUP_CHOICES";
      payload: EditorChoice[];
    };

export interface EditorContextValue {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export const EditorContext = createContext<EditorContextValue | null>(null);
