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

  describe("SET_PARAGRAPH_TEXT", () => {
    it("ustawia tekst paragrafu i isDirty", () => {
      const withScenario: EditorState = {
        scenario: {
          meta: EMPTY_META,
          paragraphs: [{ id: "1" }, { id: "100" }],
        },
        isDirty: false,
        activeParagraphId: null,
      };
      const state = dispatch(withScenario, {
        type: "SET_PARAGRAPH_TEXT",
        payload: { id: "1", text: "Treść paragrafu." },
      });
      const p = state.scenario!.paragraphs.find((p) => p.id === "1");
      expect(p?.text).toBe("Treść paragrafu.");
      expect(state.isDirty).toBe(true);
    });

    it("nie zmienia innych paragrafów", () => {
      const withScenario: EditorState = {
        scenario: {
          meta: EMPTY_META,
          paragraphs: [{ id: "1", text: "stary" }, { id: "2" }, { id: "100" }],
        },
        isDirty: false,
        activeParagraphId: null,
      };
      const state = dispatch(withScenario, {
        type: "SET_PARAGRAPH_TEXT",
        payload: { id: "2", text: "nowy" },
      });
      const p1 = state.scenario!.paragraphs.find((p) => p.id === "1");
      expect(p1?.text).toBe("stary");
    });

    it("pozwala ustawić tekst §100", () => {
      const withScenario: EditorState = {
        scenario: { meta: EMPTY_META, paragraphs: [{ id: "100" }] },
        isDirty: false,
        activeParagraphId: null,
      };
      const state = dispatch(withScenario, {
        type: "SET_PARAGRAPH_TEXT",
        payload: { id: "100", text: "Koniec gry." },
      });
      const p = state.scenario!.paragraphs.find((p) => p.id === "100");
      expect(p?.text).toBe("Koniec gry.");
    });

    it("nie zmienia stanu gdy brak scenariusza", () => {
      const state = dispatch(initialState, {
        type: "SET_PARAGRAPH_TEXT",
        payload: { id: "1", text: "tekst" },
      });
      expect(state).toBe(initialState);
    });
  });

  describe("ADD_CHOICE", () => {
    const withParagraph: EditorState = {
      scenario: {
        meta: EMPTY_META,
        paragraphs: [{ id: "1" }, { id: "2" }, { id: "100" }],
      },
      isDirty: false,
      activeParagraphId: null,
    };
    const choice = { id: "c1", text: "Idź do §2", nextParagraphId: "2" };

    it("dodaje wybór do paragrafu", () => {
      const state = dispatch(withParagraph, {
        type: "ADD_CHOICE",
        payload: { paragraphId: "1", choice },
      });
      expect(
        state.scenario!.paragraphs.find((p) => p.id === "1")?.choices,
      ).toHaveLength(1);
      expect(state.isDirty).toBe(true);
    });

    it("nie zmienia innych paragrafów", () => {
      const state = dispatch(withParagraph, {
        type: "ADD_CHOICE",
        payload: { paragraphId: "1", choice },
      });
      expect(
        state.scenario!.paragraphs.find((p) => p.id === "2")?.choices,
      ).toBeUndefined();
    });

    it("nie zmienia stanu gdy brak scenariusza", () => {
      const state = dispatch(initialState, {
        type: "ADD_CHOICE",
        payload: { paragraphId: "1", choice },
      });
      expect(state).toBe(initialState);
    });
  });

  describe("UPDATE_CHOICE", () => {
    const withChoice: EditorState = {
      scenario: {
        meta: EMPTY_META,
        paragraphs: [
          {
            id: "1",
            choices: [{ id: "c1", text: "Stary tekst", nextParagraphId: "2" }],
          },
          { id: "2" },
          { id: "100" },
        ],
      },
      isDirty: false,
      activeParagraphId: null,
    };

    it("aktualizuje tekst wyboru", () => {
      const state = dispatch(withChoice, {
        type: "UPDATE_CHOICE",
        payload: {
          paragraphId: "1",
          choice: { id: "c1", text: "Nowy tekst", nextParagraphId: "2" },
        },
      });
      const choices = state.scenario!.paragraphs.find(
        (p) => p.id === "1",
      )?.choices;
      expect(choices?.[0].text).toBe("Nowy tekst");
      expect(state.isDirty).toBe(true);
    });

    it("aktualizuje nextParagraphId wyboru", () => {
      const state = dispatch(withChoice, {
        type: "UPDATE_CHOICE",
        payload: {
          paragraphId: "1",
          choice: { id: "c1", text: "Stary tekst", nextParagraphId: "100" },
        },
      });
      const choices = state.scenario!.paragraphs.find(
        (p) => p.id === "1",
      )?.choices;
      expect(choices?.[0].nextParagraphId).toBe("100");
    });

    it("nie zmienia stanu gdy brak scenariusza", () => {
      const state = dispatch(initialState, {
        type: "UPDATE_CHOICE",
        payload: {
          paragraphId: "1",
          choice: { id: "c1", text: "", nextParagraphId: "" },
        },
      });
      expect(state).toBe(initialState);
    });
  });

  describe("REMOVE_CHOICE", () => {
    const withChoices: EditorState = {
      scenario: {
        meta: EMPTY_META,
        paragraphs: [
          {
            id: "1",
            choices: [
              { id: "c1", text: "Wybór 1", nextParagraphId: "2" },
              { id: "c2", text: "Wybór 2", nextParagraphId: "100" },
            ],
          },
          { id: "2" },
          { id: "100" },
        ],
      },
      isDirty: false,
      activeParagraphId: null,
    };

    it("usuwa wybór o podanym id", () => {
      const state = dispatch(withChoices, {
        type: "REMOVE_CHOICE",
        payload: { paragraphId: "1", choiceId: "c1" },
      });
      const choices = state.scenario!.paragraphs.find(
        (p) => p.id === "1",
      )?.choices;
      expect(choices).toHaveLength(1);
      expect(choices?.[0].id).toBe("c2");
      expect(state.isDirty).toBe(true);
    });

    it("nie zmienia innych paragrafów", () => {
      const state = dispatch(withChoices, {
        type: "REMOVE_CHOICE",
        payload: { paragraphId: "1", choiceId: "c1" },
      });
      expect(
        state.scenario!.paragraphs.find((p) => p.id === "2")?.choices,
      ).toBeUndefined();
    });

    it("nie zmienia stanu gdy brak scenariusza", () => {
      const state = dispatch(initialState, {
        type: "REMOVE_CHOICE",
        payload: { paragraphId: "1", choiceId: "c1" },
      });
      expect(state).toBe(initialState);
    });
  });

  const withPages: EditorState = {
    scenario: {
      meta: EMPTY_META,
      paragraphs: [
        {
          id: "1",
          pages: [
            [{ text: "Akapit 1" }, { text: "Akapit 2" }],
            [{ text: "Strona 2" }],
          ],
        },
        { id: "100" },
      ],
    },
    isDirty: false,
    activeParagraphId: null,
  };

  describe("ADD_PAGE", () => {
    it("dodaje pustą stronę na końcu", () => {
      const state = dispatch(withPages, {
        type: "ADD_PAGE",
        payload: { paragraphId: "1" },
      });
      const p = state.scenario!.paragraphs.find((p) => p.id === "1");
      expect(p?.pages).toHaveLength(3);
      expect(p?.pages?.[2]).toEqual([]);
      expect(state.isDirty).toBe(true);
    });

    it("inicjalizuje pages gdy paragraf nie miał pages", () => {
      const withEmpty: EditorState = {
        scenario: {
          meta: EMPTY_META,
          paragraphs: [{ id: "1" }, { id: "100" }],
        },
        isDirty: false,
        activeParagraphId: null,
      };
      const state = dispatch(withEmpty, {
        type: "ADD_PAGE",
        payload: { paragraphId: "1" },
      });
      const p = state.scenario!.paragraphs.find((p) => p.id === "1");
      expect(p?.pages).toHaveLength(2);
    });

    it("nie zmienia stanu gdy brak scenariusza", () => {
      const state = dispatch(initialState, {
        type: "ADD_PAGE",
        payload: { paragraphId: "1" },
      });
      expect(state).toBe(initialState);
    });
  });

  describe("REMOVE_PAGE", () => {
    it("usuwa stronę o podanym indeksie", () => {
      const state = dispatch(withPages, {
        type: "REMOVE_PAGE",
        payload: { paragraphId: "1", pageIndex: 0 },
      });
      const p = state.scenario!.paragraphs.find((p) => p.id === "1");
      expect(p?.pages).toHaveLength(1);
      expect(p?.pages?.[0]).toEqual([{ text: "Strona 2" }]);
      expect(state.isDirty).toBe(true);
    });

    it("nie usuwa ostatniej strony — pozostawia [[]]", () => {
      const withOne: EditorState = {
        scenario: {
          meta: EMPTY_META,
          paragraphs: [
            { id: "1", pages: [[{ text: "jedyna" }]] },
            { id: "100" },
          ],
        },
        isDirty: false,
        activeParagraphId: null,
      };
      const state = dispatch(withOne, {
        type: "REMOVE_PAGE",
        payload: { paragraphId: "1", pageIndex: 0 },
      });
      const p = state.scenario!.paragraphs.find((p) => p.id === "1");
      expect(p?.pages).toEqual([[]]);
    });
  });

  describe("ADD_BLOCK", () => {
    it("dodaje blok na koniec wskazanej strony", () => {
      const state = dispatch(withPages, {
        type: "ADD_BLOCK",
        payload: { paragraphId: "1", pageIndex: 0, block: { text: "Nowy" } },
      });
      const page = state.scenario!.paragraphs.find((p) => p.id === "1")
        ?.pages?.[0];
      expect(page).toHaveLength(3);
      expect(page?.[2]).toEqual({ text: "Nowy" });
      expect(state.isDirty).toBe(true);
    });

    it("nie zmienia innych stron", () => {
      const state = dispatch(withPages, {
        type: "ADD_BLOCK",
        payload: { paragraphId: "1", pageIndex: 0, block: { text: "X" } },
      });
      const page1 = state.scenario!.paragraphs.find((p) => p.id === "1")
        ?.pages?.[1];
      expect(page1).toHaveLength(1);
    });
  });

  describe("UPDATE_BLOCK", () => {
    it("aktualizuje blok o podanym indeksie", () => {
      const state = dispatch(withPages, {
        type: "UPDATE_BLOCK",
        payload: {
          paragraphId: "1",
          pageIndex: 0,
          blockIndex: 1,
          block: { text: "Zmieniony" },
        },
      });
      const page = state.scenario!.paragraphs.find((p) => p.id === "1")
        ?.pages?.[0];
      expect(page?.[1]).toEqual({ text: "Zmieniony" });
      expect(page?.[0]).toEqual({ text: "Akapit 1" });
      expect(state.isDirty).toBe(true);
    });
  });

  describe("REMOVE_BLOCK", () => {
    it("usuwa blok o podanym indeksie", () => {
      const state = dispatch(withPages, {
        type: "REMOVE_BLOCK",
        payload: { paragraphId: "1", pageIndex: 0, blockIndex: 0 },
      });
      const page = state.scenario!.paragraphs.find((p) => p.id === "1")
        ?.pages?.[0];
      expect(page).toHaveLength(1);
      expect(page?.[0]).toEqual({ text: "Akapit 2" });
      expect(state.isDirty).toBe(true);
    });

    it("nie zmienia innych stron", () => {
      const state = dispatch(withPages, {
        type: "REMOVE_BLOCK",
        payload: { paragraphId: "1", pageIndex: 0, blockIndex: 0 },
      });
      const page1 = state.scenario!.paragraphs.find((p) => p.id === "1")
        ?.pages?.[1];
      expect(page1).toHaveLength(1);
    });
  });
});
