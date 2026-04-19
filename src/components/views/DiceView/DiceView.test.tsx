import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DiceView } from "./DiceView";

const makeProps = (overrides = {}) => ({
  onClose: vi.fn(),
  isRolling: false,
  diceRolls: [],
  lastDiceResult: null,
  onRoll: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

describe("DiceView", () => {
  it("renders dice roll header", () => {
    render(<DiceView {...makeProps()} />);
    expect(screen.getByText("Rzut kością")).toBeDefined();
  });

  it("renders three dice count buttons (1x, 2x, 3x)", () => {
    render(<DiceView {...makeProps()} />);
    expect(screen.getByText("1x 🎲")).toBeDefined();
    expect(screen.getByText("2x 🎲")).toBeDefined();
    expect(screen.getByText("3x 🎲")).toBeDefined();
  });

  it("calls onRoll with correct count when 1x button clicked", () => {
    const props = makeProps();
    render(<DiceView {...props} />);
    fireEvent.click(screen.getByText("1x 🎲"));
    expect(props.onRoll).toHaveBeenCalledWith(1);
  });

  it("calls onRoll with correct count when 3x button clicked", () => {
    const props = makeProps();
    render(<DiceView {...props} />);
    fireEvent.click(screen.getByText("3x 🎲"));
    expect(props.onRoll).toHaveBeenCalledWith(3);
  });

  it("disables dice buttons when isRolling is true", () => {
    render(<DiceView {...makeProps({ isRolling: true })} />);
    const buttons = screen.getAllByRole("button");
    const diceButtons = buttons.filter((b) => b.textContent?.includes("🎲"));
    diceButtons.forEach((btn) => {
      expect(btn.hasAttribute("disabled")).toBe(true);
    });
  });

  it("calls onClose when back button clicked", () => {
    const props = makeProps();
    render(<DiceView {...props} />);
    fireEvent.click(screen.getByText("◀️ Menu scenariusza"));
    expect(props.onClose).toHaveBeenCalled();
  });

  it("does not show result section when not rolling and no result", () => {
    const { container } = render(<DiceView {...makeProps()} />);
    expect(container.querySelector(".dice-view__result")).toBeNull();
  });

  it("shows result section when isRolling is true", () => {
    const { container } = render(
      <DiceView {...makeProps({ isRolling: true, diceRolls: [] })} />,
    );
    expect(container.querySelector(".dice-view__result")).not.toBeNull();
  });

  it("shows single dice result when one die rolled", () => {
    render(<DiceView {...makeProps({ diceRolls: [5], lastDiceResult: 5 })} />);
    expect(screen.getByText("5")).toBeDefined();
  });

  it("shows sum for multiple dice rolls", () => {
    render(
      <DiceView {...makeProps({ diceRolls: [3, 5], lastDiceResult: 8 })} />,
    );
    expect(screen.getByText("3 + 5 = 8")).toBeDefined();
  });

  it("shows instruction text", () => {
    render(<DiceView {...makeProps()} />);
    expect(screen.getByText("Ile razy chcesz rzucić kością?")).toBeDefined();
  });
});
