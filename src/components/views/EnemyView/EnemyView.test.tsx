import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EnemyView } from "./EnemyView";
import type { Enemy } from "../../../types";

const mockEnemy: Enemy = {
  id: "klaun",
  name: "Klaun",
  image: "klaun",
  playerVariants: [
    {
      players: "1-2",
      actionsPerTurn: 2,
      diceCount: 2,
      actions: [
        {
          value: [1, 2],
          name: "Nieuwaga",
          condition: "",
          description: "Utrata jednej akcji.",
        },
        {
          value: [3, 4],
          name: "Ruch",
          condition: "Warunek ruchu.",
          actionDiceCount: 1,
          description: "Porusz się o tyle pól.",
        },
        {
          value: [5, 6],
          name: "Atak",
          condition: "Warunek ataku.",
          actionDiceCount: 1,
          actionOutcomes: [
            { values: [1, 2], description: "Nic się nie dzieje." },
            { values: [3, 4, 5, 6], description: "Figurka traci życie." },
          ],
          description: "",
        },
        {
          value: [7, 8],
          name: "Ucieczka",
          condition: "Warunek ucieczki.",
          description: "Klaun ucieka.",
        },
      ],
    },
  ],
};

const makeProps = (overrides = {}) => ({
  enemies: [mockEnemy],
  diceModifiers: undefined as number[] | undefined,
  onClose: vi.fn(),
  isRolling: false,
  diceRolls: [] as number[],
  lastDiceResult: null as number | null,
  onRoll: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

/** Symuluje realny flow: render bez wyniku, potem pojawia się wynik rzutu */
const renderWithResult = (
  diceRolls: number[],
  lastDiceResult: number,
  extraOverrides = {},
) => {
  const props = makeProps(extraOverrides);
  const utils = render(<EnemyView {...props} />);
  utils.rerender(
    <EnemyView
      {...props}
      diceRolls={diceRolls}
      lastDiceResult={lastDiceResult}
    />,
  );
  return { ...utils, props };
};

describe("EnemyView", () => {
  describe("initial render", () => {
    it("renders 'Przeciwnik' header", () => {
      render(<EnemyView {...makeProps()} />);
      expect(screen.getByText("Przeciwnik")).toBeDefined();
    });

    it("renders enemy tile with name", () => {
      render(<EnemyView {...makeProps()} />);
      expect(screen.getByText("Klaun")).toBeDefined();
    });

    it("marks first enemy tile as selected", () => {
      render(<EnemyView {...makeProps()} />);
      const tile = screen.getByRole("button", { name: /Klaun/ });
      expect(tile.getAttribute("aria-pressed")).toBe("true");
    });

    it("calls onClose when back button clicked", () => {
      const props = makeProps();
      render(<EnemyView {...props} />);
      fireEvent.click(screen.getByRole("button", { name: /Menu/ }));
      expect(props.onClose).toHaveBeenCalled();
    });
  });

  describe("dice buttons", () => {
    it("renders only base dice button when no modifiers", () => {
      render(<EnemyView {...makeProps()} />);
      expect(screen.getByText("2 × 🎲")).toBeDefined();
      expect(screen.queryByText("1 × 🎲")).toBeNull();
      expect(screen.queryByText("3 × 🎲")).toBeNull();
    });

    it("renders base and modified buttons with positive modifier", () => {
      render(<EnemyView {...makeProps({ diceModifiers: [1] })} />);
      expect(screen.getByText("2 × 🎲")).toBeDefined();
      expect(screen.getByText("3 × 🎲")).toBeDefined();
    });

    it("renders base and modified buttons with negative modifier", () => {
      render(<EnemyView {...makeProps({ diceModifiers: [-1] })} />);
      expect(screen.getByText("1 × 🎲")).toBeDefined();
      expect(screen.getByText("2 × 🎲")).toBeDefined();
    });

    it("does not render button when modifier would produce 0 dice", () => {
      render(<EnemyView {...makeProps({ diceModifiers: [-2] })} />);
      expect(screen.queryByText("0 × 🎲")).toBeNull();
      expect(screen.getByText("2 × 🎲")).toBeDefined();
    });

    it("calls onRoll with correct count when dice button clicked", () => {
      const props = makeProps({ diceModifiers: [1] });
      render(<EnemyView {...props} />);
      fireEvent.click(screen.getByText("3 × 🎲"));
      expect(props.onRoll).toHaveBeenCalledWith(3);
    });

    it("disables dice buttons when isRolling is true", () => {
      render(<EnemyView {...makeProps({ isRolling: true })} />);
      const buttons = screen.getAllByRole("button");
      const diceButtons = buttons.filter((b) => b.textContent?.includes("🎲"));
      diceButtons.forEach((btn) => {
        expect(btn.hasAttribute("disabled")).toBe(true);
      });
    });
  });

  describe("action display — no condition", () => {
    it("shows action name and description immediately for action without condition", () => {
      renderWithResult([1], 1);
      expect(screen.getByText("Nieuwaga")).toBeDefined();
      expect(screen.getByText("Utrata jednej akcji.")).toBeDefined();
    });
  });

  describe("action display — with condition", () => {
    it("shows condition text and Prawda/Fałsz buttons", () => {
      renderWithResult([3, 4], 7);
      expect(screen.getByText("Ucieczka")).toBeDefined();
      expect(screen.getByText("Warunek ucieczki.")).toBeDefined();
      expect(screen.getByText("Prawda")).toBeDefined();
      expect(screen.getByText("Fałsz")).toBeDefined();
    });

    it("shows description after clicking Prawda (no actionDiceCount)", () => {
      renderWithResult([3, 4], 7);
      fireEvent.click(screen.getByText("Prawda"));
      expect(screen.getByText("Klaun ucieka.")).toBeDefined();
    });

    it("does not show description while condition is pending", () => {
      renderWithResult([3, 4], 7);
      expect(screen.queryByText("Klaun ucieka.")).toBeNull();
    });

    it("clicking Fałsz moves to previous action (index 2 = Atak)", () => {
      // Roll result 7 = "Ucieczka" (index 3), Fałsz → index 2 = "Atak"
      renderWithResult([3, 4], 7);
      fireEvent.click(screen.getByText("Fałsz"));
      expect(screen.getByText("Atak")).toBeDefined();
    });
  });

  describe("multiple enemies", () => {
    const secondEnemy: Enemy = {
      id: "drugi",
      name: "Drugi",
      image: "drugi",
      playerVariants: [
        {
          players: "1-2",
          actionsPerTurn: 1,
          diceCount: 1,
          actions: [
            {
              value: [1, 2, 3, 4, 5, 6],
              name: "Akcja Drugiego",
              condition: "",
              description: "Opis Drugiego.",
            },
          ],
        },
      ],
    };

    it("renders tiles for all enemies", () => {
      render(
        <EnemyView {...makeProps({ enemies: [mockEnemy, secondEnemy] })} />,
      );
      expect(screen.getByText("Klaun")).toBeDefined();
      expect(screen.getByText("Drugi")).toBeDefined();
    });

    it("switches selected enemy on tile click", () => {
      render(
        <EnemyView {...makeProps({ enemies: [mockEnemy, secondEnemy] })} />,
      );
      fireEvent.click(screen.getByRole("button", { name: /Drugi/ }));
      const tile = screen.getByRole("button", { name: /Drugi/ });
      expect(tile.getAttribute("aria-pressed")).toBe("true");
      const klaunTile = screen.getByRole("button", { name: /Klaun/ });
      expect(klaunTile.getAttribute("aria-pressed")).toBe("false");
    });
  });
});
