import { describe, it, expect } from "vitest";
import {
  filterIds,
  sortParagraphIds,
  groupParagraphEntries,
  suggestNextLetterChild,
} from "./editorUtils";

describe("filterIds", () => {
  const LIST = ["1", "2", "10", "abc", "100"];

  it("zwraca pełną listę gdy value jest pustym stringiem", () => {
    expect(filterIds("", LIST)).toEqual(LIST);
  });

  it("zwraca pełną listę gdy value składa się tylko z białych znaków", () => {
    expect(filterIds("  ", LIST)).toEqual(LIST);
  });

  it("filtruje elementy zawierające value", () => {
    expect(filterIds("1", LIST)).toEqual(["1", "10", "100"]);
  });

  it("zwraca pustą tablicę gdy brak dopasowań", () => {
    expect(filterIds("xyz", LIST)).toEqual([]);
  });

  it("dopasowuje podstring", () => {
    expect(filterIds("00", LIST)).toEqual(["100"]);
  });

  it("zwraca pustą tablicę dla pustej listy", () => {
    expect(filterIds("1", [])).toEqual([]);
  });

  it("ignoruje białe znaki wokół value", () => {
    expect(filterIds(" 2 ", LIST)).toEqual(["2"]);
  });

  it("nie mutuje oryginalnej listy", () => {
    const original = ["3", "1", "2"];
    filterIds("1", original);
    expect(original).toEqual(["3", "1", "2"]);
  });
});

describe("groupParagraphEntries", () => {
  const entry = (id: string, isAlias = false) => ({ id, isAlias });

  it("oznacza litery po numerze jako dzieci paragrafu-rodzica", () => {
    const result = groupParagraphEntries([
      entry("100"),
      entry("100a"),
      entry("100b"),
    ]);
    expect(result.map((r) => r.isChild)).toEqual([false, true, true]);
    expect(result[1].parentId).toBe("100");
    expect(result[2].parentId).toBe("100");
  });

  it("nie łączy liter z paragrafem o innym numerze", () => {
    const result = groupParagraphEntries([entry("9"), entry("26a")]);
    expect(result.map((r) => r.isChild)).toEqual([false, false]);
  });

  it("resetuje bazę po napotkaniu kolejnego czystego numeru", () => {
    const result = groupParagraphEntries([
      entry("9"),
      entry("9a"),
      entry("10"),
      entry("10a"),
    ]);
    expect(result.map((r) => r.isChild)).toEqual([false, true, false, true]);
    expect(result[3].parentId).toBe("10");
  });

  it("traktuje aliasy jako samodzielne wpisy niezależnie od wzorca ID", () => {
    const result = groupParagraphEntries([entry("100"), entry("100a", true)]);
    expect(result[1].isChild).toBe(false);
  });

  it("zwraca pustą tablicę dla pustej listy", () => {
    expect(groupParagraphEntries([])).toEqual([]);
  });
});

describe("sortParagraphIds", () => {
  it("zwraca pustą tablicę dla pustego wejścia", () => {
    expect(sortParagraphIds([])).toEqual([]);
  });

  it("sortuje numerycznie gdy wszystkie ID są liczbami", () => {
    expect(sortParagraphIds(["10", "2", "1", "100"])).toEqual([
      "1",
      "2",
      "10",
      "100",
    ]);
  });

  it("sortuje alfabetycznie gdy wszystkie ID są nienumeryczne", () => {
    expect(sortParagraphIds(["c", "a", "b"])).toEqual(["a", "b", "c"]);
  });

  it("miesza numeryczne i nienumeryczne — numeryczne traktuje jako liczby", () => {
    const result = sortParagraphIds(["b", "2", "a", "1"]);
    // numeryczne sortowane względem siebie: 1 < 2
    expect(result.indexOf("1")).toBeLessThan(result.indexOf("2"));
  });

  it("nie mutuje oryginalnej tablicy", () => {
    const original = ["3", "1", "2"];
    sortParagraphIds(original);
    expect(original).toEqual(["3", "1", "2"]);
  });

  it("poprawnie sortuje ID z jedną cyfrą vs wielocyfrowe", () => {
    expect(sortParagraphIds(["9", "10", "2"])).toEqual(["2", "9", "10"]);
  });
});

describe("suggestNextLetterChild", () => {
  it("sugeruje 'a' gdy paragraf nie ma jeszcze dzieci", () => {
    expect(suggestNextLetterChild("100", ["100"])).toBe("100a");
  });

  it("sugeruje kolejną wolną literę", () => {
    expect(suggestNextLetterChild("100", ["100", "100a", "100b"])).toBe("100c");
  });

  it("zwraca null gdy baseId nie jest czystym numerem", () => {
    expect(suggestNextLetterChild("100a", ["100", "100a"])).toBeNull();
  });

  it("zwraca null gdy baseId nie istnieje na liście", () => {
    expect(suggestNextLetterChild("999", ["100"])).toBeNull();
  });

  it("zwraca null gdy wszystkie litery a-z są zajęte", () => {
    const taken = [
      "100",
      ...Array.from("abcdefghijklmnopqrstuvwxyz", (l) => `100${l}`),
    ];
    expect(suggestNextLetterChild("100", taken)).toBeNull();
  });
});
