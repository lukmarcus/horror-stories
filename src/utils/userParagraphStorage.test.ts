import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  saveUserParagraphs,
  loadUserParagraphs,
  removeUserParagraphs,
} from "./userParagraphStorage";
import type { EditorParagraph } from "../editor/context/editorTypes";

const store = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => store.set(key, value),
  removeItem: (key: string) => store.delete(key),
  clear: () => store.clear(),
};
vi.stubGlobal("localStorage", localStorageMock);

const paragraphs: EditorParagraph[] = [
  { id: "1", text: "Akapit pierwszy" },
  { id: "100" },
];

beforeEach(() => {
  store.clear();
});

describe("loadUserParagraphs", () => {
  it("zwraca pustą tablicę gdy storage jest pusty", () => {
    expect(loadUserParagraphs("test-scenario")).toEqual([]);
  });

  it("zwraca pustą tablicę gdy JSON jest nieprawidłowy", () => {
    localStorage.setItem(
      "horror-stories:user-paragraphs:test-scenario",
      "not-json",
    );
    expect(loadUserParagraphs("test-scenario")).toEqual([]);
  });
});

describe("saveUserParagraphs", () => {
  it("zapisuje i odczytuje paragrafy", () => {
    saveUserParagraphs("test-scenario", paragraphs);
    expect(loadUserParagraphs("test-scenario")).toEqual(paragraphs);
  });

  it("używa osobnego klucza dla każdego scenariusza", () => {
    saveUserParagraphs("scenariusz-a", [{ id: "1" }]);
    saveUserParagraphs("scenariusz-b", [{ id: "2" }]);
    expect(loadUserParagraphs("scenariusz-a")).toEqual([{ id: "1" }]);
    expect(loadUserParagraphs("scenariusz-b")).toEqual([{ id: "2" }]);
  });

  it("nadpisuje poprzednie dane dla tego samego scenariusza", () => {
    saveUserParagraphs("test-scenario", [{ id: "1" }]);
    saveUserParagraphs("test-scenario", [{ id: "1" }, { id: "2" }]);
    expect(loadUserParagraphs("test-scenario")).toHaveLength(2);
  });
});

describe("removeUserParagraphs", () => {
  it("usuwa paragrafy scenariusza", () => {
    saveUserParagraphs("test-scenario", paragraphs);
    removeUserParagraphs("test-scenario");
    expect(loadUserParagraphs("test-scenario")).toEqual([]);
  });

  it("nie rzuca błędu gdy scenariusz nie istnieje", () => {
    expect(() => removeUserParagraphs("nie-istnieje")).not.toThrow();
  });

  it("nie usuwa danych innych scenariuszy", () => {
    saveUserParagraphs("scenariusz-a", [{ id: "1" }]);
    saveUserParagraphs("scenariusz-b", [{ id: "2" }]);
    removeUserParagraphs("scenariusz-a");
    expect(loadUserParagraphs("scenariusz-b")).toEqual([{ id: "2" }]);
  });
});
