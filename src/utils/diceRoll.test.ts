import { describe, it, expect } from "vitest";
import { rollDice } from "./diceRoll";

describe("rollDice", () => {
  it("returns the requested number of dice", () => {
    expect(rollDice(3)).toHaveLength(3);
  });

  it("returns an empty array for 0 dice", () => {
    expect(rollDice(0)).toEqual([]);
  });

  it("returns values between 1 and 6", () => {
    const results = rollDice(200);
    results.forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(6);
    });
  });
});
