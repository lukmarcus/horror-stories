import { describe, it, expect } from "vitest";
import {
  getSymbol,
  getLetter,
  getRoomItem,
  getPerson,
  getEnemy,
  getStoryItem,
  getStatus,
} from "../../../data/items";

// Regex as used in RichText.tsx
const CUSTOM_TAG_REGEX =
  /<(symbol|letter|item|image|person|enemy|story|room|status)\s+id=["']([^"']+)["']\s*\/>/g;

describe("RichText data helpers", () => {
  describe("getSymbol", () => {
    it("returns symbol data for known id", () => {
      const result = getSymbol("zycie");
      expect(result).toBeDefined();
      expect(result?.id).toBe("zycie");
      expect(result?.imagePath).toContain("zycie");
    });

    it("returns undefined for unknown id", () => {
      expect(getSymbol("nieistniejacy-symbol")).toBeUndefined();
    });

    it("returns imagePath for all symbols in data", () => {
      const ids = [
        "amunicja-pistolet",
        "amunicja-strzelba",
        "czas",
        "drzwi-otwarte",
        "drzwi-wywazone",
        "drzwi-zamkniete",
        "gwiazda",
        "karta-akcji",
        "paragraf",
        "pd",
        "przeciwnik",
        "przedmiot-losowy",
        "rana-ciezka",
        "zycie",
      ];
      ids.forEach((id) => {
        const result = getSymbol(id);
        expect(result, `symbol ${id} should exist`).toBeDefined();
        expect(result?.imagePath).toContain(id);
      });
    });
  });

  describe("getRoomItem", () => {
    it("returns room item data for known numeric id", () => {
      const result = getRoomItem(110);
      expect(result).toBeDefined();
      expect(result?.id).toBe(110);
      expect(result?.imagePath).toContain("110");
    });

    it("accepts string id", () => {
      const result = getRoomItem("110");
      expect(result).toBeDefined();
      expect(result?.id).toBe(110);
    });

    it("returns undefined for unknown id", () => {
      expect(getRoomItem(9999)).toBeUndefined();
    });
  });

  describe("getLetter", () => {
    it("returns letter data for known id", () => {
      const result = getLetter("a");
      expect(result).toBeDefined();
      expect(result?.imagePath).toContain("a");
    });

    it("returns undefined for unknown letter", () => {
      expect(getLetter("z")).toBeUndefined();
    });
  });

  describe("getPerson", () => {
    it("returns person data for known id", () => {
      const result = getPerson("jessica");
      expect(result).toBeDefined();
      expect(result?.imagePath).toContain("jessica");
    });

    it("returns undefined for unknown person", () => {
      expect(getPerson("nieznana-osoba")).toBeUndefined();
    });
  });

  describe("getEnemy", () => {
    it("returns enemy data for known id", () => {
      const result = getEnemy("klaun");
      expect(result).toBeDefined();
      expect(result?.imagePath).toContain("klaun");
    });

    it("returns undefined for unknown enemy", () => {
      expect(getEnemy("nieznany-przeciwnik")).toBeUndefined();
    });
  });

  describe("getStoryItem", () => {
    it("returns story item for known id", () => {
      const result = getStoryItem("xiii");
      expect(result).toBeDefined();
      expect(result?.imagePath).toContain("xiii");
    });
  });

  describe("getStatus", () => {
    it("returns status for known id", () => {
      const result = getStatus("zielony");
      expect(result).toBeDefined();
      expect(result?.imagePath).toContain("zielony");
    });
  });
});

describe("RichText custom tag regex", () => {
  it("matches symbol tag with single quotes", () => {
    const re = new RegExp(CUSTOM_TAG_REGEX.source, "g");
    const match = re.exec("<symbol id='zycie'/>");
    expect(match).not.toBeNull();
    expect(match?.[1]).toBe("symbol");
    expect(match?.[2]).toBe("zycie");
  });

  it("matches symbol tag with double quotes", () => {
    const re = new RegExp(CUSTOM_TAG_REGEX.source, "g");
    const match = re.exec('<symbol id="zycie"/>');
    expect(match).not.toBeNull();
    expect(match?.[2]).toBe("zycie");
  });

  it("matches all supported tag types", () => {
    const tags: [string, string][] = [
      ["symbol", "zycie"],
      ["letter", "a"],
      ["item", "klucz"],
      ["image", "scenariusz"],
      ["person", "jessica"],
      ["enemy", "klaun"],
      ["story", "xiii"],
      ["room", "110"],
      ["status", "zielony"],
    ];
    tags.forEach(([tag, id]) => {
      const re = new RegExp(CUSTOM_TAG_REGEX.source, "g");
      const match = re.exec(`<${tag} id='${id}'/>`);
      expect(match, `tag <${tag}> should match`).not.toBeNull();
      expect(match?.[1]).toBe(tag);
      expect(match?.[2]).toBe(id);
    });
  });

  it("matches multiple tags in one string", () => {
    const re = new RegExp(CUSTOM_TAG_REGEX.source, "g");
    const html =
      "Dobierz <symbol id='karta-akcji'/> i idź do <symbol id='paragraf'/>.";
    const matches: RegExpExecArray[] = [];
    let m;
    while ((m = re.exec(html)) !== null) matches.push(m);
    expect(matches).toHaveLength(2);
    expect(matches[0][2]).toBe("karta-akcji");
    expect(matches[1][2]).toBe("paragraf");
  });

  it("does not match unknown tag types", () => {
    const re = new RegExp(CUSTOM_TAG_REGEX.source, "g");
    const match = re.exec("<unknown id='foo'/>");
    expect(match).toBeNull();
  });
});
