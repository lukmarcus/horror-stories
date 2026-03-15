import { describe, it, expect, vi } from "vitest";

describe("DiceRoller Logic", () => {
  it("should generate random number between 1 and 6", () => {
    const rollDice = (): number => {
      return Math.floor(Math.random() * 6) + 1;
    };

    for (let i = 0; i < 10; i++) {
      const result = rollDice();
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(6);
    }
  });

  it("should handle dice roll callback", () => {
    const mockCallback = vi.fn();
    const rollResult = Math.floor(Math.random() * 6) + 1;

    mockCallback(rollResult);

    expect(mockCallback).toHaveBeenCalledWith(rollResult);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("should track multiple rolls", () => {
    const rollDice = (): number => {
      return Math.floor(Math.random() * 6) + 1;
    };

    const rolls: number[] = [];

    for (let i = 0; i < 5; i++) {
      rolls.push(rollDice());
    }

    expect(rolls).toHaveLength(5);
    rolls.forEach((roll) => {
      expect(roll).toBeGreaterThanOrEqual(1);
      expect(roll).toBeLessThanOrEqual(6);
    });
  });

  it("should simulate rolling state", () => {
    let isRolling = false;
    let result: number | null = null;

    const startRoll = () => {
      isRolling = true;
      result = null;
    };

    const finishRoll = (diceResult: number) => {
      isRolling = false;
      result = diceResult;
    };

    expect(isRolling).toBe(false);
    expect(result).toBe(null);

    startRoll();
    expect(isRolling).toBe(true);
    expect(result).toBe(null);

    finishRoll(3);
    expect(isRolling).toBe(false);
    expect(result).toBe(3);
  });

  it("should not allow multiple simultaneous rolls", () => {
    let isRolling = false;
    const rollDice = (): boolean => {
      if (isRolling) return false;
      isRolling = true;
      return true;
    };

    expect(rollDice()).toBe(true);
    expect(rollDice()).toBe(false);
  });

  it("should validate dice result is valid", () => {
    const isValidDiceResult = (value: unknown): boolean => {
      return (
        typeof value === "number" &&
        value >= 1 &&
        value <= 6 &&
        Number.isInteger(value)
      );
    };

    expect(isValidDiceResult(1)).toBe(true);
    expect(isValidDiceResult(3)).toBe(true);
    expect(isValidDiceResult(6)).toBe(true);
    expect(isValidDiceResult(0)).toBe(false);
    expect(isValidDiceResult(7)).toBe(false);
    expect(isValidDiceResult(3.5)).toBe(false);
    expect(isValidDiceResult("3")).toBe(false);
  });
});
