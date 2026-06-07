import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DeathView } from "./DeathView";

describe("DeathView", () => {
  const makeProps = (overrides = {}) => ({
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    ...overrides,
  });

  it("renders section header", () => {
    render(<DeathView {...makeProps()} />);
    expect(screen.getByText("Śmierć")).toBeDefined();
  });

  it("renders confirm button", () => {
    render(<DeathView {...makeProps()} />);
    expect(screen.getByText("Tak, przejdź do paragrafu 100")).toBeDefined();
  });

  it("renders cancel / menu button", () => {
    render(<DeathView {...makeProps()} />);
    const menuButtons = screen.getAllByText("Menu scenariusza");
    expect(menuButtons.length).toBeGreaterThan(0);
  });

  it("calls onConfirm when confirm button clicked", () => {
    const onConfirm = vi.fn();
    render(<DeathView {...makeProps({ onConfirm })} />);
    fireEvent.click(screen.getByText("Tak, przejdź do paragrafu 100"));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("calls onCancel when cancel button clicked", () => {
    const onCancel = vi.fn();
    render(<DeathView {...makeProps({ onCancel })} />);
    fireEvent.click(screen.getByText("Menu scenariusza"));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("calls onCancel when nav OptionButton clicked", () => {
    const onCancel = vi.fn();
    render(<DeathView {...makeProps({ onCancel })} />);
    fireEvent.click(screen.getByText("Menu"));
    expect(onCancel).toHaveBeenCalled();
  });
});
