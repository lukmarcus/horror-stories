import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AlphabetView } from "./AlphabetView";
import type { LetterToken } from "../../../types";

vi.mock("../../../data/items", () => ({
  getLetter: (id: string) => ({
    id,
    imagePath: `/assets/images/letters/${id}.png`,
  }),
}));

const letters: LetterToken[] = [
  { id: "a", paragraphId: "30" },
  { id: "b", paragraphId: "83" },
];

const makeProps = (overrides = {}) => ({
  onClose: vi.fn(),
  onBackToMenu: vi.fn(),
  letters,
  onGoToParagraph: vi.fn(),
  ...overrides,
});

describe("AlphabetView", () => {
  it("renders header label", () => {
    render(<AlphabetView {...makeProps()} />);
    expect(screen.getByText("Żetony alfabetu")).toBeDefined();
  });

  it("renders a tile for each letter", () => {
    render(<AlphabetView {...makeProps()} />);
    expect(screen.getByAltText("A")).toBeDefined();
    expect(screen.getByAltText("B")).toBeDefined();
  });

  it("renders paragraph label on each tile", () => {
    render(<AlphabetView {...makeProps()} />);
    expect(screen.getByText("Paragraf 30")).toBeDefined();
    expect(screen.getByText("Paragraf 83")).toBeDefined();
  });

  it("calls onGoToParagraph and onClose when tile clicked", () => {
    const props = makeProps();
    render(<AlphabetView {...props} />);
    fireEvent.click(
      screen.getByRole("button", { name: /Żeton A — paragraf 30/i }),
    );
    expect(props.onGoToParagraph).toHaveBeenCalledWith("30");
    expect(props.onClose).toHaveBeenCalled();
  });

  it("calls onBackToMenu (not onClose) when back button clicked", () => {
    const props = makeProps();
    render(<AlphabetView {...props} />);
    fireEvent.click(screen.getByRole("button", { name: /Menu scenariusza/ }));
    expect(props.onBackToMenu).toHaveBeenCalled();
    expect(props.onClose).not.toHaveBeenCalled();
  });

  it("shows placeholder when no letters provided", () => {
    render(<AlphabetView {...makeProps({ letters: [] })} />);
    expect(
      screen.getByText("Ten scenariusz nie posiada żetonów alfabetu."),
    ).toBeDefined();
  });
});
