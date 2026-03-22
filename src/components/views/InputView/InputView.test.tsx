import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { InputView } from "./InputView";

describe("InputView", () => {
  it("should render input field and submit button", () => {
    render(<InputView onSubmit={vi.fn().mockReturnValue(null)} />);
    expect(screen.getByRole("textbox")).toBeDefined();
    expect(screen.getByText("PRZEJDŹ")).toBeDefined();
  });

  it("should render instruction text when provided", () => {
    render(<InputView onSubmit={vi.fn()} instruction="Wpisz numer paragrafu" />);
    expect(screen.getByText("Wpisz numer paragrafu")).toBeDefined();
  });

  it("should not render instruction when not provided", () => {
    render(<InputView onSubmit={vi.fn()} />);
    expect(screen.queryByClass?.("game__input-instruction")).toBeUndefined();
  });

  it("should call onSubmit with trimmed input value on button click", () => {
    const onSubmit = vi.fn().mockReturnValue(null);
    render(<InputView onSubmit={onSubmit} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "  42  " } });
    fireEvent.click(screen.getByText("PRZEJDŹ"));
    expect(onSubmit).toHaveBeenCalledWith("42");
  });

  it("should call onSubmit on Enter key press", () => {
    const onSubmit = vi.fn().mockReturnValue(null);
    render(<InputView onSubmit={onSubmit} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "5" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSubmit).toHaveBeenCalledWith("5");
  });

  it("should not call onSubmit when input is empty", () => {
    const onSubmit = vi.fn();
    render(<InputView onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText("PRZEJDŹ"));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should display error message when onSubmit returns a string", () => {
    const onSubmit = vi.fn().mockReturnValue("Paragraf nie istnieje");
    render(<InputView onSubmit={onSubmit} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "999" } });
    fireEvent.click(screen.getByText("PRZEJDŹ"));
    expect(screen.getByText("Paragraf nie istnieje")).toBeDefined();
  });

  it("should clear error when user types after an error", () => {
    const onSubmit = vi.fn().mockReturnValue("Błąd");
    render(<InputView onSubmit={onSubmit} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "999" } });
    fireEvent.click(screen.getByText("PRZEJDŹ"));
    expect(screen.getByText("Błąd")).toBeDefined();
    fireEvent.change(input, { target: { value: "1" } });
    expect(screen.queryByText("Błąd")).toBeNull();
  });

  it("should clear input after successful submit", () => {
    const onSubmit = vi.fn().mockReturnValue(null);
    render(<InputView onSubmit={onSubmit} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "42" } });
    fireEvent.click(screen.getByText("PRZEJDŹ"));
    expect(input.value).toBe("");
  });

  it("should render actions slot when provided", () => {
    render(
      <InputView
        onSubmit={vi.fn()}
        actions={<button>Powrót</button>}
      />
    );
    expect(screen.getByText("Powrót")).toBeDefined();
  });
});
