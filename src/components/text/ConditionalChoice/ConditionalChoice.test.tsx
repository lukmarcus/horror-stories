import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { ConditionalChoice } from "./ConditionalChoice";

const baseChoice = {
  id: "c1",
  text: "Czy posiadasz klucz?",
  yesText: "Otwierasz drzwi!",
  noText: "Drzwi są zamknięte.",
  yesNextId: "10",
  noNextId: "11",
};

describe("ConditionalChoice", () => {
  it("should render question text", () => {
    render(
      <ConditionalChoice choice={baseChoice} onYes={vi.fn()} onNo={vi.fn()} />,
    );
    expect(screen.getByText("Czy posiadasz klucz?")).toBeDefined();
  });

  it("should show Yes and No buttons before answering", () => {
    render(
      <ConditionalChoice choice={baseChoice} onYes={vi.fn()} onNo={vi.fn()} />,
    );
    expect(screen.getByText(/Tak/)).toBeDefined();
    expect(screen.getByText(/Nie/)).toBeDefined();
  });

  it("should call onYes and show yesText after clicking Tak", () => {
    const onYes = vi.fn();
    const onNo = vi.fn();
    render(<ConditionalChoice choice={baseChoice} onYes={onYes} onNo={onNo} />);
    fireEvent.click(screen.getByText(/Tak/));
    expect(onYes).toHaveBeenCalledTimes(1);
    expect(onNo).not.toHaveBeenCalled();
    expect(screen.getByText("Otwierasz drzwi!")).toBeDefined();
  });

  it("should call onNo and show noText after clicking Nie", () => {
    const onYes = vi.fn();
    const onNo = vi.fn();
    render(<ConditionalChoice choice={baseChoice} onYes={onYes} onNo={onNo} />);
    fireEvent.click(screen.getByText(/Nie/));
    expect(onNo).toHaveBeenCalledTimes(1);
    expect(onYes).not.toHaveBeenCalled();
    expect(screen.getByText("Drzwi są zamknięte.")).toBeDefined();
  });

  it("should prevent answering twice (buttons disappear after answer)", () => {
    render(
      <ConditionalChoice choice={baseChoice} onYes={vi.fn()} onNo={vi.fn()} />,
    );
    fireEvent.click(screen.getByText(/Tak/));
    expect(screen.queryByText(/Tak/)).toBeNull();
    expect(screen.queryByText(/Nie/)).toBeNull();
  });

  it("should handle missing response texts gracefully", () => {
    const choice = { id: "c2", text: "Pytanie bez odpowiedzi?" };
    render(
      <ConditionalChoice choice={choice} onYes={vi.fn()} onNo={vi.fn()} />,
    );
    fireEvent.click(screen.getByText(/Tak/));
    expect(screen.queryByText(/Tak/)).toBeNull();
  });
});
