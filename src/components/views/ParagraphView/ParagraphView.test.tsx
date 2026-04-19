import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ParagraphView } from "./ParagraphView";
import type { Paragraph } from "../../../types";

vi.mock("../../text/RichText/RichText", () => ({
  RichText: ({ text, content }: { text?: string; content?: unknown[] }) => (
    <div data-testid="rich-text">{text || (content ? "rich-content" : "")}</div>
  ),
}));

const makeCallbacks = () => ({
  onChoice: vi.fn(),
  onJumpToParagraph: vi.fn().mockReturnValue(null),
  onBack: vi.fn(),
});

const baseParagraph: Paragraph = {
  id: "1",
  content: [{ text: "Test paragraph content", spacing: "none" }],
};

describe("ParagraphView", () => {
  // ---------------------------------------------------------------
  // Basic rendering
  // ---------------------------------------------------------------
  it("renders paragraph title", () => {
    render(
      <ParagraphView
        paragraph={baseParagraph}
        currentParagraphId="1"
        lastDiceResult={null}
        {...makeCallbacks()}
      />,
    );
    expect(screen.getByText("Paragraf 1")).toBeDefined();
  });

  it("shows the navigated-to ID even when paragraph has multiple IDs", () => {
    const para: Paragraph = { ...baseParagraph, id: ["1", "2"] };
    render(
      <ParagraphView
        paragraph={para}
        currentParagraphId="2"
        lastDiceResult={null}
        {...makeCallbacks()}
      />,
    );
    expect(screen.getByText("Paragraf 2")).toBeDefined();
  });

  it("always shows back-to-menu button", () => {
    render(
      <ParagraphView
        paragraph={baseParagraph}
        currentParagraphId="1"
        lastDiceResult={null}
        {...makeCallbacks()}
      />,
    );
    expect(
      screen.getAllByRole("button", { name: /Menu scenariusza/ }).length,
    ).toBeGreaterThan(0);
  });

  it("calls onBack when back-to-menu button clicked", () => {
    const callbacks = makeCallbacks();
    render(
      <ParagraphView
        paragraph={baseParagraph}
        currentParagraphId="1"
        lastDiceResult={null}
        {...callbacks}
      />,
    );
    fireEvent.click(
      screen.getAllByRole("button", { name: /Menu scenariusza/ })[0],
    );
    expect(callbacks.onBack).toHaveBeenCalled();
  });

  it("renders paragraph.text using ParagraphText", () => {
    const para: Paragraph = {
      ...baseParagraph,
      text: "Classic text paragraph",
    };
    render(
      <ParagraphView
        paragraph={para}
        currentParagraphId="1"
        lastDiceResult={null}
        {...makeCallbacks()}
      />,
    );
    expect(screen.getByText("Classic text paragraph")).toBeDefined();
  });

  it("renders paragraph image when present", () => {
    const para: Paragraph = {
      ...baseParagraph,
      image: "http://example.com/img.jpg",
    };
    const { container } = render(
      <ParagraphView
        paragraph={para}
        currentParagraphId="1"
        lastDiceResult={null}
        {...makeCallbacks()}
      />,
    );
    expect(container.querySelector("img.paragraph-image")).not.toBeNull();
  });

  // ---------------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------------
  it("does not show page controls for single-page paragraph", () => {
    render(
      <ParagraphView
        paragraph={baseParagraph}
        currentParagraphId="1"
        lastDiceResult={null}
        {...makeCallbacks()}
      />,
    );
    expect(screen.queryByText("▶️ Następny")).toBeNull();
  });

  it("shows page controls for multi-page paragraph", () => {
    const para: Paragraph = {
      ...baseParagraph,
      contentPages: [
        [{ text: "Page 1", spacing: "none" }],
        [{ text: "Page 2", spacing: "none" }],
      ],
    };
    render(
      <ParagraphView
        paragraph={para}
        currentParagraphId="1"
        lastDiceResult={null}
        {...makeCallbacks()}
      />,
    );
    expect(
      screen.getAllByRole("button", { name: /Następny/ }).length,
    ).toBeGreaterThan(0);
  });

  it("starts on first page and shows subtitle", () => {
    const para: Paragraph = {
      ...baseParagraph,
      contentPages: [
        [{ text: "Page 1", spacing: "none" }],
        [{ text: "Page 2", spacing: "none" }],
      ],
    };
    render(
      <ParagraphView
        paragraph={para}
        currentParagraphId="1"
        lastDiceResult={null}
        {...makeCallbacks()}
      />,
    );
    expect(screen.getByText("Część 1 z 2")).toBeDefined();
  });

  it("navigates to next page on Następny click", () => {
    const para: Paragraph = {
      ...baseParagraph,
      contentPages: [
        [{ text: "Page 1", spacing: "none" }],
        [{ text: "Page 2", spacing: "none" }],
      ],
    };
    render(
      <ParagraphView
        paragraph={para}
        currentParagraphId="1"
        lastDiceResult={null}
        {...makeCallbacks()}
      />,
    );
    fireEvent.click(screen.getAllByRole("button", { name: /Następny/ })[0]);
    expect(screen.getByText("Część 2 z 2")).toBeDefined();
  });

  it("Poprzedni button is disabled on first page", () => {
    const para: Paragraph = {
      ...baseParagraph,
      contentPages: [
        [{ text: "Page 1", spacing: "none" }],
        [{ text: "Page 2", spacing: "none" }],
      ],
    };
    render(
      <ParagraphView
        paragraph={para}
        currentParagraphId="1"
        lastDiceResult={null}
        {...makeCallbacks()}
      />,
    );
    const prevButtons = screen.getAllByRole("button", { name: /Poprzedni/ });
    expect(prevButtons[0].hasAttribute("disabled")).toBe(true);
  });

  // ---------------------------------------------------------------
  // Dead-end (no choices, no dice)
  // ---------------------------------------------------------------
  it("shows InputView for dead-end paragraph", () => {
    render(
      <ParagraphView
        paragraph={baseParagraph}
        currentParagraphId="1"
        lastDiceResult={null}
        {...makeCallbacks()}
      />,
    );
    expect(screen.getByPlaceholderText("np. 1, 2, 3...")).toBeDefined();
  });

  it("does not show InputView when paragraph has choices", () => {
    const para: Paragraph = {
      ...baseParagraph,
      choices: [{ id: "c1", text: "Go there", nextParagraphId: "5" }],
    };
    render(
      <ParagraphView
        paragraph={para}
        currentParagraphId="1"
        lastDiceResult={null}
        {...makeCallbacks()}
      />,
    );
    expect(screen.queryByPlaceholderText("np. 1, 2, 3...")).toBeNull();
  });

  it("does not show InputView when paragraph has dice roll", () => {
    const para: Paragraph = {
      ...baseParagraph,
      hasDiceRoll: true,
      diceResult: {
        threshold: 3,
        successText: "Win",
        failText: "Fail",
        successNextId: "10",
        failNextId: "20",
      },
      choices: [],
    };
    render(
      <ParagraphView
        paragraph={para}
        currentParagraphId="1"
        lastDiceResult={null}
        {...makeCallbacks()}
      />,
    );
    expect(screen.queryByPlaceholderText("np. 1, 2, 3...")).toBeNull();
  });

  // ---------------------------------------------------------------
  // Choices
  // ---------------------------------------------------------------
  it("renders regular choice buttons", () => {
    const para: Paragraph = {
      ...baseParagraph,
      choices: [{ id: "c1", text: "Idź do paragrafu 5", nextParagraphId: "5" }],
    };
    render(
      <ParagraphView
        paragraph={para}
        currentParagraphId="1"
        lastDiceResult={null}
        {...makeCallbacks()}
      />,
    );
    expect(screen.getByText("Idź do paragrafu 5")).toBeDefined();
  });

  it("calls onChoice when regular choice clicked", () => {
    const callbacks = makeCallbacks();
    const para: Paragraph = {
      ...baseParagraph,
      choices: [{ id: "c1", text: "Do paragrafu 5", nextParagraphId: "5" }],
    };
    render(
      <ParagraphView
        paragraph={para}
        currentParagraphId="1"
        lastDiceResult={null}
        {...callbacks}
      />,
    );
    fireEvent.click(screen.getByText("Do paragrafu 5"));
    expect(callbacks.onChoice).toHaveBeenCalledWith("5", false);
  });

  it("calls onBack when regular choice has empty nextParagraphId", () => {
    const callbacks = makeCallbacks();
    const para: Paragraph = {
      ...baseParagraph,
      choices: [{ id: "c1", text: "Powrót", nextParagraphId: "" }],
    };
    render(
      <ParagraphView
        paragraph={para}
        currentParagraphId="1"
        lastDiceResult={null}
        {...callbacks}
      />,
    );
    fireEvent.click(screen.getByText("Powrót"));
    expect(callbacks.onBack).toHaveBeenCalled();
  });

  it("renders ConditionalChoice for conditional choices", () => {
    const para: Paragraph = {
      ...baseParagraph,
      choices: [
        {
          id: "cc1",
          text: "Czy masz klucz?",
          isConditional: true,
          yesNextId: "5",
          noNextId: "6",
        },
      ],
    };
    render(
      <ParagraphView
        paragraph={para}
        currentParagraphId="1"
        lastDiceResult={null}
        {...makeCallbacks()}
      />,
    );
    expect(screen.getByText("Czy masz klucz?")).toBeDefined();
    expect(screen.getByText("✓ Tak")).toBeDefined();
    expect(screen.getByText("✗ Nie")).toBeDefined();
  });

  it("renders variant choices and calls onChoice with isVariant=true", () => {
    const callbacks = makeCallbacks();
    const para: Paragraph = {
      ...baseParagraph,
      areChoicesHorizontal: true,
      choices: [{ id: "v1", text: "Wariant A", nextVariantId: "variant-1" }],
    };
    render(
      <ParagraphView
        paragraph={para}
        currentParagraphId="1"
        lastDiceResult={null}
        {...callbacks}
      />,
    );
    fireEvent.click(screen.getByText("Wariant A"));
    expect(callbacks.onChoice).toHaveBeenCalledWith("variant-1", true);
  });

  // ---------------------------------------------------------------
  // Dice roll
  // ---------------------------------------------------------------
  it("shows dice result section when all conditions met", () => {
    const para: Paragraph = {
      ...baseParagraph,
      hasDiceRoll: true,
      diceResult: {
        threshold: 4,
        successText: "Udało się!",
        failText: "Niepowodzenie",
        successNextId: "10",
        failNextId: "20",
      },
      choices: [],
    };
    render(
      <ParagraphView
        paragraph={para}
        currentParagraphId="1"
        lastDiceResult={5}
        {...makeCallbacks()}
      />,
    );
    expect(screen.getByText("Udało się!")).toBeDefined();
  });

  it("shows fail text when dice result is below threshold", () => {
    const para: Paragraph = {
      ...baseParagraph,
      hasDiceRoll: true,
      diceResult: {
        threshold: 4,
        successText: "Udało się!",
        failText: "Niepowodzenie",
        successNextId: "10",
        failNextId: "20",
      },
      choices: [],
    };
    render(
      <ParagraphView
        paragraph={para}
        currentParagraphId="1"
        lastDiceResult={3}
        {...makeCallbacks()}
      />,
    );
    expect(screen.getByText("Niepowodzenie")).toBeDefined();
  });

  it("does not show dice result when lastDiceResult is null", () => {
    const para: Paragraph = {
      ...baseParagraph,
      hasDiceRoll: true,
      diceResult: {
        threshold: 4,
        successText: "Udało się!",
        failText: "Niepowodzenie",
        successNextId: "10",
        failNextId: "20",
      },
      choices: [],
    };
    render(
      <ParagraphView
        paragraph={para}
        currentParagraphId="1"
        lastDiceResult={null}
        {...makeCallbacks()}
      />,
    );
    expect(screen.queryByText("Udało się!")).toBeNull();
    expect(screen.queryByText("Niepowodzenie")).toBeNull();
  });

  it("calls onChoice with successNextId when PRZEJDŹ clicked on success", () => {
    const callbacks = makeCallbacks();
    const para: Paragraph = {
      ...baseParagraph,
      hasDiceRoll: true,
      diceResult: {
        threshold: 4,
        successText: "Udało się!",
        failText: "Niepowodzenie",
        successNextId: "10",
        failNextId: "20",
      },
      choices: [],
    };
    render(
      <ParagraphView
        paragraph={para}
        currentParagraphId="1"
        lastDiceResult={5}
        {...callbacks}
      />,
    );
    fireEvent.click(screen.getByText("PRZEJDŹ"));
    expect(callbacks.onChoice).toHaveBeenCalledWith("10", false);
  });

  it("calls onChoice with failNextId when PRZEJDŹ clicked on fail", () => {
    const callbacks = makeCallbacks();
    const para: Paragraph = {
      ...baseParagraph,
      hasDiceRoll: true,
      diceResult: {
        threshold: 4,
        successText: "Udało się!",
        failText: "Niepowodzenie",
        successNextId: "10",
        failNextId: "20",
      },
      choices: [],
    };
    render(
      <ParagraphView
        paragraph={para}
        currentParagraphId="1"
        lastDiceResult={2}
        {...callbacks}
      />,
    );
    fireEvent.click(screen.getByText("PRZEJDŹ"));
    expect(callbacks.onChoice).toHaveBeenCalledWith("20", false);
  });

  // ---------------------------------------------------------------
  // Navigation buttons
  // ---------------------------------------------------------------
  it("shows accessibleFrom back-to buttons", () => {
    const callbacks = { ...makeCallbacks(), onNavigateToParagraph: vi.fn() };
    render(
      <ParagraphView
        paragraph={baseParagraph}
        currentParagraphId="1"
        lastDiceResult={null}
        {...callbacks}
        accessibleFrom={["3", "7"]}
      />,
    );
    expect(screen.getByRole("button", { name: /§3/ })).toBeDefined();
    expect(screen.getByRole("button", { name: /§7/ })).toBeDefined();
  });

  it("calls onNavigateToParagraph when accessibleFrom button clicked", () => {
    const callbacks = { ...makeCallbacks(), onNavigateToParagraph: vi.fn() };
    render(
      <ParagraphView
        paragraph={baseParagraph}
        currentParagraphId="1"
        lastDiceResult={null}
        {...callbacks}
        accessibleFrom={["3"]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /§3/ }));
    expect(callbacks.onNavigateToParagraph).toHaveBeenCalledWith("3");
  });

  it("shows refresh button when hasVariants and variantPathLength > 0", () => {
    const callbacks = { ...makeCallbacks(), onRefreshVariants: vi.fn() };
    render(
      <ParagraphView
        paragraph={baseParagraph}
        currentParagraphId="1"
        lastDiceResult={null}
        {...callbacks}
        hasVariants
        variantPathLength={1}
      />,
    );
    expect(screen.getByText(/Odśwież/)).toBeDefined();
  });

  it("calls onRefreshVariants when refresh button clicked", () => {
    const callbacks = { ...makeCallbacks(), onRefreshVariants: vi.fn() };
    render(
      <ParagraphView
        paragraph={baseParagraph}
        currentParagraphId="1"
        lastDiceResult={null}
        {...callbacks}
        hasVariants
        variantPathLength={1}
      />,
    );
    fireEvent.click(screen.getByText(/Odśwież/));
    expect(callbacks.onRefreshVariants).toHaveBeenCalled();
  });

  it("does not show refresh button when variantPathLength is 0", () => {
    const callbacks = { ...makeCallbacks(), onRefreshVariants: vi.fn() };
    render(
      <ParagraphView
        paragraph={baseParagraph}
        currentParagraphId="1"
        lastDiceResult={null}
        {...callbacks}
        hasVariants
        variantPathLength={0}
      />,
    );
    expect(screen.queryByText(/Odśwież/)).toBeNull();
  });
});
