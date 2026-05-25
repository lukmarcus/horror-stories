import { describe, it, expect } from "vitest";
import { filterIds, sortParagraphIds } from "./editorUtils";

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
