import { describe, it, expect } from "vitest";
import {
  editorParagraphToGameParagraph,
  buildUserParagraphMap,
} from "./userParagraphConverter";

describe("editorParagraphToGameParagraph", () => {
  it("konwertuje pojedynczy akapit na pages[0]", () => {
    const result = editorParagraphToGameParagraph({ id: "1", text: "Witaj." });
    expect(result.pages).toEqual([[{ text: "Witaj.", spacing: "none" }]]);
  });

  it("każda linia to osobny blok", () => {
    const result = editorParagraphToGameParagraph({
      id: "1",
      text: "Pierwsza linia\nDruga linia\nTrzecia linia",
    });
    expect(result.pages![0]).toHaveLength(3);
    expect(result.pages![0][0]).toEqual({ text: "Pierwsza linia" });
    expect(result.pages![0][1]).toEqual({ text: "Druga linia" });
    expect(result.pages![0][2]).toEqual({
      text: "Trzecia linia",
      spacing: "none",
    });
  });

  it("pomija puste linie", () => {
    const result = editorParagraphToGameParagraph({
      id: "1",
      text: "Akapit 1\n\nAkapit 2",
    });
    expect(result.pages![0]).toHaveLength(2);
  });

  it("pomija linie składające się tylko z białych znaków", () => {
    const result = editorParagraphToGameParagraph({
      id: "1",
      text: "Treść\n   \nDalej",
    });
    expect(result.pages![0]).toHaveLength(2);
  });

  it("ostatni blok ma spacing: none", () => {
    const result = editorParagraphToGameParagraph({
      id: "1",
      text: "Linia 1\nLinia 2",
    });
    const page = result.pages![0];
    expect(page[page.length - 1].spacing).toBe("none");
    expect(page[0].spacing).toBeUndefined();
  });

  it("zwraca pusty pages gdy brak tekstu", () => {
    const result = editorParagraphToGameParagraph({ id: "5" });
    expect(result.pages).toEqual([[]]);
  });

  it("zwraca pusty pages gdy tekst jest pustym stringiem", () => {
    const result = editorParagraphToGameParagraph({ id: "5", text: "" });
    expect(result.pages).toEqual([[]]);
  });

  it("zachowuje id paragrafu", () => {
    const result = editorParagraphToGameParagraph({ id: "42", text: "Tekst" });
    expect(result.id).toBe("42");
  });

  it("zwraca pustą tablicę choices", () => {
    const result = editorParagraphToGameParagraph({ id: "1", text: "Tekst" });
    expect(result.choices).toEqual([]);
  });
});

describe("buildUserParagraphMap", () => {
  it("buduje mapę id → paragraf", () => {
    const map = buildUserParagraphMap([
      { id: "1", text: "Jeden" },
      { id: "2", text: "Dwa" },
    ]);
    expect(Object.keys(map)).toEqual(["1", "2"]);
    expect(map["1"].id).toBe("1");
    expect(map["2"].id).toBe("2");
  });

  it("zwraca pustą mapę dla pustej tablicy", () => {
    const map = buildUserParagraphMap([]);
    expect(map).toEqual({});
  });

  it("każdy paragraf przechodzi przez konwersję formatu", () => {
    const map = buildUserParagraphMap([{ id: "7", text: "Akapit" }]);
    expect(map["7"].pages).toBeDefined();
  });
});
