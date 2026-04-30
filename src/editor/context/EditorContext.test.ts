import { describe, it, expect } from "vitest";
import { editorReducer } from "./editorReducer";
import type { EditorState, EditorAction } from "./editorTypes";

const EMPTY_META = {
  id: "",
  title: "",
  description: "",
  minPlayerCount: null,
  maxPlayerCount: null,
  duration: null,
};

const initialState: EditorState = {
  scenario: null,
  isDirty: false,
  activeParagraphId: null,
};

function dispatch(state: EditorState, action: EditorAction): EditorState {
  return editorReducer(state, action);
}

describe("editorReducer", () => {
  describe("NEW_SCENARIO", () => {
    it("tworzy nowy scenariusz z pustymi metadanymi", () => {
      const state = dispatch(initialState, { type: "NEW_SCENARIO" });
      expect(state.scenario).not.toBeNull();
      expect(state.scenario!.meta.title).toBe("");
    });

    it("zawsze dodaje §100 do nowego scenariusza", () => {
      const state = dispatch(initialState, { type: "NEW_SCENARIO" });
      expect(state.scenario!.paragraphs.some((p) => p.id === "100")).toBe(true);
    });

    it("resetuje isDirty i activeParagraphId", () => {
      const dirty: EditorState = {
        scenario: {
          meta: EMPTY_META,
          paragraphs: [{ id: "1" }, { id: "100" }],
        },
        isDirty: true,
        activeParagraphId: "1",
      };
      const state = dispatch(dirty, { type: "NEW_SCENARIO" });
      expect(state.isDirty).toBe(false);
      expect(state.activeParagraphId).toBeNull();
    });
  });

  describe("SET_META", () => {
    it("aktualizuje metadane i ustawia isDirty", () => {
      const withScenario: EditorState = {
        scenario: { meta: EMPTY_META, paragraphs: [{ id: "100" }] },
        isDirty: false,
        activeParagraphId: null,
      };
      const newMeta = { ...EMPTY_META, title: "Nowy tytuł" };
      const state = dispatch(withScenario, {
        type: "SET_META",
        payload: newMeta,
      });
      expect(state.scenario!.meta.title).toBe("Nowy tytuł");
      expect(state.isDirty).toBe(true);
    });

    it("tworzy scenariusz gdy nie istnieje, z §100", () => {
      const newMeta = { ...EMPTY_META, title: "Bez scenariusza" };
      const state = dispatch(initialState, {
        type: "SET_META",
        payload: newMeta,
      });
      expect(state.scenario).not.toBeNull();
      expect(state.scenario!.paragraphs.some((p) => p.id === "100")).toBe(true);
    });
  });

  describe("LOAD_SCENARIO", () => {
    it("wczytuje scenariusz z paragrafami", () => {
      const payload = {
        meta: { ...EMPTY_META, title: "Załadowany" },
        paragraphs: [{ id: "1" }, { id: "100" }],
      };
      const state = dispatch(initialState, { type: "LOAD_SCENARIO", payload });
      expect(state.scenario!.meta.title).toBe("Załadowany");
      expect(state.scenario!.paragraphs).toHaveLength(2);
    });

    it("dodaje §100 jeśli brakuje w danych", () => {
      const payload = {
        meta: EMPTY_META,
        paragraphs: [{ id: "1" }, { id: "2" }],
      };
      const state = dispatch(initialState, { type: "LOAD_SCENARIO", payload });
      expect(state.scenario!.paragraphs.some((p) => p.id === "100")).toBe(true);
    });

    it("nie duplikuje §100 jeśli już istnieje", () => {
      const payload = {
        meta: EMPTY_META,
        paragraphs: [{ id: "1" }, { id: "100" }],
      };
      const state = dispatch(initialState, { type: "LOAD_SCENARIO", payload });
      const deathCount = state.scenario!.paragraphs.filter(
        (p) => p.id === "100",
      ).length;
      expect(deathCount).toBe(1);
    });

    it("obsługuje brak tablicy paragrafów (undefined)", () => {
      const payload = {
        meta: EMPTY_META,
        paragraphs: undefined as unknown as [],
      };
      const state = dispatch(initialState, { type: "LOAD_SCENARIO", payload });
      expect(state.scenario!.paragraphs.some((p) => p.id === "100")).toBe(true);
    });

    it("resetuje isDirty i activeParagraphId", () => {
      const dirty: EditorState = {
        scenario: { meta: EMPTY_META, paragraphs: [{ id: "100" }] },
        isDirty: true,
        activeParagraphId: "5",
      };
      const state = dispatch(dirty, {
        type: "LOAD_SCENARIO",
        payload: { meta: EMPTY_META, paragraphs: [{ id: "100" }] },
      });
      expect(state.isDirty).toBe(false);
      expect(state.activeParagraphId).toBeNull();
    });
  });

  describe("MARK_SAVED", () => {
    it("czyści isDirty", () => {
      const dirty: EditorState = {
        scenario: { meta: EMPTY_META, paragraphs: [{ id: "100" }] },
        isDirty: true,
        activeParagraphId: null,
      };
      const state = dispatch(dirty, { type: "MARK_SAVED" });
      expect(state.isDirty).toBe(false);
    });
  });

  describe("ADD_PARAGRAPH", () => {
    it("dodaje paragraf i ustawia go jako aktywny", () => {
      const withScenario: EditorState = {
        scenario: { meta: EMPTY_META, paragraphs: [{ id: "100" }] },
        isDirty: false,
        activeParagraphId: null,
      };
      const state = dispatch(withScenario, {
        type: "ADD_PARAGRAPH",
        payload: "5",
      });
      expect(state.scenario!.paragraphs.some((p) => p.id === "5")).toBe(true);
      expect(state.activeParagraphId).toBe("5");
      expect(state.isDirty).toBe(true);
    });

    it("nie dodaje duplikatu", () => {
      const withScenario: EditorState = {
        scenario: {
          meta: EMPTY_META,
          paragraphs: [{ id: "1" }, { id: "100" }],
        },
        isDirty: false,
        activeParagraphId: null,
      };
      const state = dispatch(withScenario, {
        type: "ADD_PARAGRAPH",
        payload: "1",
      });
      const count = state.scenario!.paragraphs.filter(
        (p) => p.id === "1",
      ).length;
      expect(count).toBe(1);
    });

    it("nie zmienia stanu gdy brak scenariusza", () => {
      const state = dispatch(initialState, {
        type: "ADD_PARAGRAPH",
        payload: "3",
      });
      expect(state).toBe(initialState);
    });
  });

  describe("REMOVE_PARAGRAPH", () => {
    it("usuwa paragraf z listy", () => {
      const withScenario: EditorState = {
        scenario: {
          meta: EMPTY_META,
          paragraphs: [{ id: "1" }, { id: "2" }, { id: "100" }],
        },
        isDirty: false,
        activeParagraphId: null,
      };
      const state = dispatch(withScenario, {
        type: "REMOVE_PARAGRAPH",
        payload: "2",
      });
      expect(state.scenario!.paragraphs.some((p) => p.id === "2")).toBe(false);
      expect(state.isDirty).toBe(true);
    });

    it("nie pozwala usunąć §100", () => {
      const withScenario: EditorState = {
        scenario: {
          meta: EMPTY_META,
          paragraphs: [{ id: "1" }, { id: "100" }],
        },
        isDirty: false,
        activeParagraphId: null,
      };
      const state = dispatch(withScenario, {
        type: "REMOVE_PARAGRAPH",
        payload: "100",
      });
      expect(state).toBe(withScenario);
    });

    it("czyści activeParagraphId gdy usunięto aktywny paragraf", () => {
      const withActive: EditorState = {
        scenario: {
          meta: EMPTY_META,
          paragraphs: [{ id: "3" }, { id: "100" }],
        },
        isDirty: false,
        activeParagraphId: "3",
      };
      const state = dispatch(withActive, {
        type: "REMOVE_PARAGRAPH",
        payload: "3",
      });
      expect(state.activeParagraphId).toBeNull();
    });

    it("zachowuje activeParagraphId gdy usunięto inny paragraf", () => {
      const withActive: EditorState = {
        scenario: {
          meta: EMPTY_META,
          paragraphs: [{ id: "3" }, { id: "4" }, { id: "100" }],
        },
        isDirty: false,
        activeParagraphId: "3",
      };
      const state = dispatch(withActive, {
        type: "REMOVE_PARAGRAPH",
        payload: "4",
      });
      expect(state.activeParagraphId).toBe("3");
    });

    it("nie zmienia stanu gdy brak scenariusza", () => {
      const state = dispatch(initialState, {
        type: "REMOVE_PARAGRAPH",
        payload: "1",
      });
      expect(state).toBe(initialState);
    });
  });

  describe("SET_ACTIVE_PARAGRAPH", () => {
    it("ustawia aktywny paragraf", () => {
      const state = dispatch(initialState, {
        type: "SET_ACTIVE_PARAGRAPH",
        payload: "7",
      });
      expect(state.activeParagraphId).toBe("7");
    });

    it("resetuje aktywny paragraf do null", () => {
      const withActive: EditorState = {
        ...initialState,
        activeParagraphId: "7",
      };
      const state = dispatch(withActive, {
        type: "SET_ACTIVE_PARAGRAPH",
        payload: null,
      });
      expect(state.activeParagraphId).toBeNull();
    });
  });
});
