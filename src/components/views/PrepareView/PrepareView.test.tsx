import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PrepareView } from "./PrepareView";

vi.mock("../../text/RichText/RichText", () => ({
  RichText: ({ text, content }: { text?: string; content?: unknown[] }) => (
    <div data-testid="rich-text">
      {text || (content ? "block-content" : "")}
    </div>
  ),
}));

const makeStep = (text: string) => ({ stepNumber: 1, text });

const makeProps = (overrides = {}) => ({
  currentStep: 0,
  totalSteps: 3,
  setupSteps: [makeStep("Krok 1"), makeStep("Krok 2"), makeStep("Krok 3")],
  scenarioId: "test-scenario",
  startParagraphId: "77",
  onPrev: vi.fn(),
  onNext: vi.fn(),
  onStart: vi.fn(),
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
    const prevButtons = screen.getAllByText("← Poprzedni");
    expect(prevButtons[0].hasAttribute("disabled")).toBe(true);
  });

  it("disables Następny button on last step", () => {
    render(<PrepareView {...makeProps({ currentStep: 2, totalSteps: 3 })} />);
    const nextButtons = screen.getAllByText("Następny →");
    expect(nextButtons[0].hasAttribute("disabled")).toBe(true);
  });

  it("calls onNext when Następny button clicked", () => {
    const props = makeProps({ currentStep: 0 });
    render(<PrepareView {...props} />);
    fireEvent.click(screen.getAllByText("Następny →")[0]);
    expect(props.onNext).toHaveBeenCalled();
  });

  it("calls onPrev when Poprzedni button clicked on non-first step", () => {
    const props = makeProps({ currentStep: 1 });
    render(<PrepareView {...props} />);
    fireEvent.click(screen.getAllByText("← Poprzedni")[0]);
    expect(props.onPrev).toHaveBeenCalled();
  });

  it("does not show Start button on non-last step", () => {
    render(<PrepareView {...makeProps({ currentStep: 0 })} />);
    expect(screen.queryByText("Przejdź do paragrafu 77")).toBeNull();
  });

  it("shows Start button on last step", () => {
    render(<PrepareView {...makeProps({ currentStep: 2, totalSteps: 3 })} />);
    expect(screen.getByText("Przejdź do paragrafu 77")).toBeDefined();
  });

  it("calls onStart when Start button clicked", () => {
    const props = makeProps({ currentStep: 2, totalSteps: 3 });
    render(<PrepareView {...props} />);
    fireEvent.click(screen.getByText("Przejdź do paragrafu 77"));
    expect(props.onStart).toHaveBeenCalled();
  });

  it("uses startParagraphId in Start button text", () => {
    render(
      <PrepareView
        {...makeProps({ currentStep: 2, totalSteps: 3, startParagraphId: "42" })}
      />,
    );
    expect(screen.getByText("Przejdź do paragrafu 42")).toBeDefined();
  });

  it("renders step content via RichText", () => {
    render(<PrepareView {...makeProps()} />);
    expect(screen.getAllByTestId("rich-text").length).toBeGreaterThan(0);
  });

  it("shows step content for current step", () => {
    const steps = [
      makeStep("Przygotuj planszę"),
      makeStep("Rozłóż karty"),
      makeStep("Zacznij grę"),
    ];
    render(
      <PrepareView {...makeProps({ setupSteps: steps, currentStep: 0 })} />,
    );
    expect(screen.getByText("Przygotuj planszę")).toBeDefined();
  });
});
