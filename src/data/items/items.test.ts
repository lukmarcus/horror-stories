import { describe, it, expect } from "vitest";
import {
  getStoryItem,
  getRoomItem,
  getSymbol,
  getPerson,
  getLetter,
  getStatus,
  storyItems,
  roomItems,
  symbols,
  persons,
  letters,
  statuses,
} from "./index";

describe("data/items getters", () => {
  describe("getStoryItem", () => {
    it("should return item with imagePath for existing id", () => {
      const firstItem = storyItems[0];
      const result = getStoryItem(firstItem.id);
      expect(result).toBeDefined();
      expect(result!.id).toBe(firstItem.id);
      expect(result!.imagePath).toContain(firstItem.id);
      expect(result!.imagePath).toContain("storyItems");
      expect(result!.imagePath).toContain(".jpg");
    });

    it("should return undefined for non-existent id", () => {
      expect(getStoryItem("__nonexistent__")).toBeUndefined();
    });
  });

  describe("getRoomItem", () => {
    it("should return item for existing numeric id", () => {
      const firstItem = roomItems[0];
      const result = getRoomItem(firstItem.id);
      expect(result).toBeDefined();
      expect(result!.imagePath).toContain("roomItems");
      expect(result!.imagePath).toContain(".jpg");
    });

    it("should accept string id and parse it", () => {
      const firstItem = roomItems[0];
      const result = getRoomItem(String(firstItem.id));
      expect(result).toBeDefined();
      expect(result!.id).toBe(firstItem.id);
    });

    it("should return undefined for non-existent id", () => {
      expect(getRoomItem(999999)).toBeUndefined();
    });
  });

  describe("getSymbol", () => {
    it("should return symbol with imagePath for existing id", () => {
      const firstSymbol = symbols[0];
      const result = getSymbol(firstSymbol.id);
      expect(result).toBeDefined();
      expect(result!.id).toBe(firstSymbol.id);
      expect(result!.name).toBe(firstSymbol.name);
      expect(result!.imagePath).toContain(".png");
    });

    it("should return undefined for non-existent id", () => {
      expect(getSymbol("__nonexistent__")).toBeUndefined();
    });
  });

  describe("getPerson", () => {
    it("should return person with imagePath for existing id", () => {
      const firstPerson = persons[0];
      const result = getPerson(firstPerson.id);
      expect(result).toBeDefined();
      expect(result!.id).toBe(firstPerson.id);
      expect(result!.imagePath).toContain("persons");
      expect(result!.imagePath).toContain(".jpg");
    });

    it("should return undefined for non-existent id", () => {
      expect(getPerson("__nonexistent__")).toBeUndefined();
    });
  });

  describe("getLetter", () => {
    it("should return letter with imagePath for existing id", () => {
      const firstLetter = letters[0];
      const result = getLetter(firstLetter.id);
      expect(result).toBeDefined();
      expect(result!.id).toBe(firstLetter.id);
      expect(result!.imagePath).toContain("letters");
      expect(result!.imagePath).toContain(".png");
    });

    it("should return undefined for non-existent id", () => {
      expect(getLetter("__nonexistent__")).toBeUndefined();
    });
  });

  describe("getStatus", () => {
    it("should return status with imagePath for existing id", () => {
      const firstStatus = statuses[0];
      const result = getStatus(firstStatus.id);
      expect(result).toBeDefined();
      expect(result!.id).toBe(firstStatus.id);
      expect(result!.imagePath).toContain("statuses");
      expect(result!.imagePath).toContain(".jpg");
    });

    it("should return undefined for non-existent id", () => {
      expect(getStatus("__nonexistent__")).toBeUndefined();
    });
  });
});
