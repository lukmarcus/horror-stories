import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PrepareView } from "./PrepareView";
import type { ContentBlock, Choice } from "../../../types";

vi.mock("../../text/RichText/RichText", () => ({
  RichText: ({ content }: { content?: unknown[] }) => (
    <div data-testid="rich-text">{content ? "block-content" : ""}</div>
  ),
}));

const makePage = (text: string): ContentBlock[] => [{ type: "text", text }];

const defaultChoices: Choice[] = [
  { id: "c1", text: "Przejdź do paragrafu 77", nextParagraphId: "77" },
];

const makeProps = (overrides = {}) => ({
  currentStep: 0,
  totalSteps: 3,
  pages: [makePage("Strona 1"), makePage("Strona 2"), makePage("Strona 3")],
  choices: defaultChoices,
  scenarioId: "test-scenario",
  onPrev: vi.fn(),
  onNext: vi.fn(),
  onStart: vi.fn(),
  onChoice: vi.fn(),
  ...overrides,
});

describe("PrepareView", () => {
  it("renders preparation header", () => {
    render(<PrepareView {...makeProps()} />);
    expect(screen.getByText("Przygotowanie scenariusza")).toBeDefined();
  });

  it("shows current step and total steps subtitle", () => {
    render(<PrepareView {...makeProps()} />);
    expect(screen.getAllByText("Krok 1 z 3").length).toBeGreaterThan(0);
  });

  it("disables Poprzedni button on first step", () => {
    render(<PrepareView {...makeProps({ currentStep: 0 })} />);
    const prevButtons = screen.getAllByRole("button", { name: /Poprzedni/ });
    expect(prevButtons[0].hasAttribute("disabled")).toBe(true);
  });

  it("disables Następny button on last step", () => {
    render(<PrepareView {...makeProps({ currentStep: 2, totalSteps: 3 })} />);
    const nextButtons = screen.getAllByRole("button", { name: /Następny/ });
    expect(nextButtons[0].hasAttribute("disabled")).toBe(true);
  });

  it("calls onNext when Następny button clicked", () => {
    const props = makeProps({ currentStep: 0 });
    render(<PrepareView {...props} />);
    fireEvent.click(screen.getAllByRole("button", { name: /Następny/ })[0]);
    expect(props.onNext).toHaveBeenCalled();
  });

  it("calls onPrev when Poprzedni button clicked on non-first step", () => {
    const props = makeProps({ currentStep: 1 });
    render(<PrepareView {...props} />);
    fireEvent.click(screen.getAllByRole("button", { name: /Poprzedni/ })[0]);
    expect(props.onPrev).toHaveBeenCalled();
  });

  it("does not show choices on non-last step", () => {
    render(<PrepareView {...makeProps({ currentStep: 0 })} />);
    expect(screen.queryByText("Przejdź do paragrafu 77")).toBeNull();
  });

  it("shows choices on last step", () => {
    render(<PrepareView {...makeProps({ currentStep: 2, totalSteps: 3 })} />);
    expect(screen.getByText("Przejdź do paragrafu 77")).toBeDefined();
  });

  it("calls onChoice when choice button clicked", () => {
    const props = makeProps({ currentStep: 2, totalSteps: 3 });
    render(<PrepareView {...props} />);
    fireEvent.click(screen.getByText("Przejdź do paragrafu 77"));
    expect(props.onChoice).toHaveBeenCalledWith("77");
  });

  it("shows Zacznij grę button when last step and no choices", () => {
    render(
      <PrepareView
        {...makeProps({ currentStep: 2, totalSteps: 3, choices: [] })}
      />,
    );
    expect(screen.getByText("Zacznij grę")).toBeDefined();
  });

  it("calls onStart when Zacznij grę clicked", () => {
    const props = makeProps({ currentStep: 2, totalSteps: 3, choices: [] });
    render(<PrepareView {...props} />);
    fireEvent.click(screen.getByText("Zacznij grę"));
    expect(props.onStart).toHaveBeenCalled();
  });

  it("renders page content via RichText", () => {
    render(<PrepareView {...makeProps()} />);
    expect(screen.getAllByTestId("rich-text").length).toBeGreaterThan(0);
  });

  it("shows content for current step page", () => {
    const pages = [
      makePage("Przygotuj planszę"),
      makePage("Rozłóż karty"),
      makePage("Zacznij grę"),
    ];
    render(
      <PrepareView {...makeProps({ pages, currentStep: 0, choices: [] })} />,
    );
    expect(screen.getAllByTestId("rich-text").length).toBeGreaterThan(0);
  });
});
