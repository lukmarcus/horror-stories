import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { IndirectView } from "./IndirectView";

vi.mock("../../text/RichText/RichText", () => ({
  RichText: ({ content }: { content?: unknown[] }) => (
    <div data-testid="rich-text">
      {content
        ? (content as Array<{ html?: string }>).map((b, i) => (
            <span key={i}>{b.html}</span>
          ))
        : null}
    </div>
  ),
}));

describe("IndirectView", () => {
  const makeProps = (overrides = {}) => ({
    pendingParagraphId: "42",
    sources: ["5", "10"],
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    ...overrides,
  });

  it("renders section header title", () => {
    render(<IndirectView {...makeProps()} />);
    expect(screen.getByText("Niebezpośredni paragraf")).toBeDefined();
  });

  it("renders confirm button with pending paragraph ID", () => {
    render(<IndirectView {...makeProps()} />);
    expect(screen.getByText("Tak, przejdź do paragrafu #42")).toBeDefined();
  });

  it("renders cancel button", () => {
    render(<IndirectView {...makeProps()} />);
    expect(screen.getAllByText("Menu scenariusza").length).toBeGreaterThan(0);
  });

  it("calls onConfirm when confirm button clicked", () => {
    const props = makeProps();
    render(<IndirectView {...props} />);
    fireEvent.click(screen.getByText("Tak, przejdź do paragrafu #42"));
    expect(props.onConfirm).toHaveBeenCalled();
  });

  it("calls onCancel when nav back button clicked", () => {
    const props = makeProps();
    render(<IndirectView {...props} />);
    fireEvent.click(screen.getByText("← Menu scenariusza"));
    expect(props.onCancel).toHaveBeenCalled();
  });

  it("renders RichText with content describing sources", () => {
    render(<IndirectView {...makeProps()} />);
    expect(screen.getAllByTestId("rich-text").length).toBeGreaterThan(0);
  });

  it("uses different sources correctly in content", () => {
    const { container } = render(
      <IndirectView
        {...makeProps({ sources: ["7"], pendingParagraphId: "99" })}
      />,
    );
    expect(container.textContent).toContain("Paragraf 7");
  });
});
