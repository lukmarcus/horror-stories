import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EnemyView } from "./EnemyView";
import type { Enemy } from "../../../types";

const mockEnemy: Enemy = {
  id: "klaun",
  name: "Klaun",
  image: "klaun",
  actions: [
    {
      id: "nieuwaga",
      name: "Nieuwaga",
      condition: "",
      description: "Utrata jednej akcji.",
    },
    {
      id: "ruch",
      name: "Ruch",
      condition: "Warunek ruchu.",
      actionDiceCount: 1,
      description: "Porusz się o tyle pól.",
    },
    {
      id: "atak",
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
      id: "ucieczka",
      name: "Ucieczka",
      condition: "Warunek ucieczki.",
      description: "Klaun ucieka.",
    },
  ],
  playerVariants: [
    {
      minPlayers: 1,
      maxPlayers: 2,
      actionsPerTurn: 2,
      diceCount: 2,
      actionMapping: [
        { id: "nieuwaga", value: [1, 2] },
        { id: "ruch", value: [3, 4] },
        { id: "atak", value: [5, 6] },
        { id: "ucieczka", value: [7, 8] },
      ],
    },
  ],
};

const makeProps = (overrides = {}) => ({
  enemies: [mockEnemy],
  diceModifiers: undefined as number[] | undefined,
  minPlayerCount: undefined as number | null | undefined,
  maxPlayerCount: undefined as number | null | undefined,
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

  describe("valueMin support", () => {
    const enemyWithValueMin: Enemy = {
      id: "test",
      name: "Test",
      image: "test",
      actions: [
        {
          id: "low",
          name: "Low",
          condition: "",
          description: "Low value action",
        },
        {
          id: "high",
          name: "High",
          condition: "",
          description: "High value action (10+)",
        },
      ],
      playerVariants: [
        {
          minPlayers: 1,
          maxPlayers: 1,
          actionsPerTurn: 1,
          diceCount: 2,
          actionMapping: [
            { id: "low", value: [1, 2] },
            { id: "high", valueMin: 10 },
          ],
        },
      ],
    };

    it("selects action with valueMin when result >= valueMin", () => {
      renderWithResult([5, 5], 10, { enemies: [enemyWithValueMin] });
      expect(screen.getByText("High")).toBeDefined();
      expect(screen.getByText("High value action (10+)")).toBeDefined();
    });

    it("selects action with valueMin when result > valueMin", () => {
      renderWithResult([6, 6], 12, { enemies: [enemyWithValueMin] });
      expect(screen.getByText("High")).toBeDefined();
    });

    it("selects value-based action when result < valueMin", () => {
      renderWithResult([1, 1], 2, { enemies: [enemyWithValueMin] });
      expect(screen.getByText("Low")).toBeDefined();
    });
  });

  describe("multiple enemies", () => {
    const secondEnemy: Enemy = {
      id: "drugi",
      name: "Drugi",
      image: "drugi",
      actions: [
        {
          id: "akcja-drugiego",
          name: "Akcja Drugiego",
          condition: "",
          description: "Opis Drugiego.",
        },
      ],
      playerVariants: [
        {
          minPlayers: 1,
          maxPlayers: 2,
          actionsPerTurn: 1,
          diceCount: 1,
          actionMapping: [{ id: "akcja-drugiego", value: [1, 2, 3, 4, 5, 6] }],
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

  describe("player variant selector", () => {
    const enemyWithVariants: Enemy = {
      id: "multi",
      name: "Multi",
      image: "multi",
      actions: [
        {
          id: "akcja-a",
          name: "Akcja A",
          condition: "",
          description: "Opis A",
        },
        {
          id: "akcja-b",
          name: "Akcja B",
          condition: "",
          description: "Opis B",
        },
      ],
      playerVariants: [
        {
          minPlayers: 1,
          maxPlayers: 2,
          actionsPerTurn: 1,
          diceCount: 2,
          actionMapping: [
            { id: "akcja-a", value: [1, 2, 3] },
            { id: "akcja-b", value: [4, 5, 6] },
          ],
        },
        {
          minPlayers: 3,
          maxPlayers: 4,
          actionsPerTurn: 2,
          diceCount: 3,
          actionMapping: [
            { id: "akcja-a", value: [1, 2] },
            { id: "akcja-b", valueMin: 3 },
          ],
        },
      ],
    };

    it("does not show variant selector when only one variant exists", () => {
      render(<EnemyView {...makeProps()} />);
      expect(screen.queryByText("Liczba graczy:")).toBeNull();
    });

    it("shows variant selector when multiple variants exist", () => {
      render(<EnemyView {...makeProps({ enemies: [enemyWithVariants] })} />);
      expect(screen.getByText("Liczba graczy:")).toBeDefined();
      expect(screen.getByText("1-2")).toBeDefined();
      expect(screen.getByText("3-4")).toBeDefined();
    });

    it("selects first variant by default", () => {
      render(<EnemyView {...makeProps({ enemies: [enemyWithVariants] })} />);
      const firstBtn = screen.getByText("1-2");
      expect(firstBtn.className).toContain("enemy-view__variant-btn--selected");
    });

    it("switches variant on button click", () => {
      render(<EnemyView {...makeProps({ enemies: [enemyWithVariants] })} />);
      const secondBtn = screen.getByText("3-4");
      fireEvent.click(secondBtn);
      expect(secondBtn.className).toContain(
        "enemy-view__variant-btn--selected",
      );
    });

    it("uses correct dice count for selected variant", () => {
      render(<EnemyView {...makeProps({ enemies: [enemyWithVariants] })} />);
      expect(screen.getByText("2 × 🎲")).toBeDefined();
      fireEvent.click(screen.getByText("3-4"));
      expect(screen.getByText("3 × 🎲")).toBeDefined();
    });

    it("uses correct action mapping for selected variant", () => {
      // Variant 1 (1-2 players): value [1,2,3] → akcja-a, dice count 2
      renderWithResult([1, 1], 2, {
        enemies: [enemyWithVariants],
      });
      expect(screen.getByText("Akcja A")).toBeDefined();
      expect(screen.getByText("2 × 🎲")).toBeDefined();

      // Switch to variant 2 (3-4 players): dice count 3
      fireEvent.click(screen.getByText("3-4"));
      expect(screen.getByText("3 × 🎲")).toBeDefined();

      // After variant switch, roll result should be cleared and need new roll
      expect(screen.queryByText("Akcja A")).toBeNull();
    });
  });

  describe("player variant filtering by maxPlayerCount", () => {
    const enemyWithVariants: Enemy = {
      id: "multi",
      name: "Multi",
      image: "multi",
      actions: [
        {
          id: "akcja",
          name: "Akcja",
          condition: "",
          description: "Opis",
        },
      ],
      playerVariants: [
        {
          minPlayers: 1,
          maxPlayers: 2,
          actionsPerTurn: 1,
          diceCount: 2,
          actionMapping: [{ id: "akcja", value: [1, 2, 3, 4, 5, 6] }],
        },
        {
          minPlayers: 3,
          maxPlayers: 4,
          actionsPerTurn: 2,
          diceCount: 3,
          actionMapping: [{ id: "akcja", value: [1, 2, 3, 4, 5, 6] }],
        },
      ],
    };

    it("shows all variants when maxPlayerCount is undefined", () => {
      render(
        <EnemyView
          {...makeProps({
            enemies: [enemyWithVariants],
            maxPlayerCount: undefined,
          })}
        />,
      );
      expect(screen.getByText("1-2")).toBeDefined();
      expect(screen.getByText("3-4")).toBeDefined();
    });

    it("shows all variants when maxPlayerCount is null", () => {
      render(
        <EnemyView
          {...makeProps({ enemies: [enemyWithVariants], maxPlayerCount: null })}
        />,
      );
      expect(screen.getByText("1-2")).toBeDefined();
      expect(screen.getByText("3-4")).toBeDefined();
    });

    it("filters out variants above maxPlayerCount", () => {
      render(
        <EnemyView
          {...makeProps({
            enemies: [enemyWithVariants],
            minPlayerCount: 1,
            maxPlayerCount: 2,
          })}
        />,
      );
      // Variant 1-2 is selected (diceCount=2), 3-4 is filtered out
      expect(screen.getByText("2 × 🎲")).toBeDefined();
      expect(screen.queryByText("3-4")).toBeNull();
      // Selector not shown because only one variant matches
      expect(screen.queryByText("Liczba graczy:")).toBeNull();
    });

    it("does not show variant selector when only one variant matches", () => {
      render(
        <EnemyView
          {...makeProps({
            enemies: [enemyWithVariants],
            minPlayerCount: 1,
            maxPlayerCount: 2,
          })}
        />,
      );
      expect(screen.queryByText("Liczba graczy:")).toBeNull();
    });

    it("uses correct dice count from filtered variant", () => {
      render(
        <EnemyView
          {...makeProps({
            enemies: [enemyWithVariants],
            minPlayerCount: 1,
            maxPlayerCount: 2,
          })}
        />,
      );
      expect(screen.getByText("2 × 🎲")).toBeDefined();
    });

    it("shows variant selector when multiple variants match", () => {
      render(
        <EnemyView
          {...makeProps({
            enemies: [enemyWithVariants],
            minPlayerCount: 1,
            maxPlayerCount: 4,
          })}
        />,
      );
      expect(screen.getByText("Liczba graczy:")).toBeDefined();
      expect(screen.getByText("1-2")).toBeDefined();
      expect(screen.getByText("3-4")).toBeDefined();
    });
  });
});
