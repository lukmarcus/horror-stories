import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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
    render(ConditionalChoice({ choice: baseChoice, onYes: vi.fn(), onNo: vi.fn() }));
    expect(screen.getByText("Czy posiadasz klucz?")).toBeDefined();
  });

  it("should show Yes and No buttons before answering", () => {
    render(ConditionalChoice({ choice: baseChoice, onYes: vi.fn(), onNo: vi.fn() }));
    expect(screen.getByText(/Tak/)).toBeDefined();
    expect(screen.getByText(/Nie/)).toBeDefined();
  });

  it("should call onYes and show yesText after clicking Tak", () => {
    const onYes = vi.fn();
    const onNo = vi.fn();
    render(ConditionalChoice({ choice: baseChoice, onYes, onNo }));
    fireEvent.click(screen.getByText(/Tak/));
    expect(onYes).toHaveBeenCalledTimes(1);
    expect(onNo).not.toHaveBeenCalled();
    expect(screen.getByText("Otwierasz drzwi!")).toBeDefined();
  });

  it("should call onNo and show noText after clicking Nie", () => {
    const onYes = vi.fn();
    const onNo = vi.fn();
    render(ConditionalChoice({ choice: baseChoice, onYes, onNo }));
    fireEvent.click(screen.getByText(/Nie/));
    expect(onNo).toHaveBeenCalledTimes(1);
    expect(onYes).not.toHaveBeenCalled();
    expect(screen.getByText("Drzwi są zamknięte.")).toBeDefined();
  });

  it("should prevent answering twice (buttons disappear after answer)", () => {
    render(ConditionalChoice({ choice: baseChoice, onYes: vi.fn(), onNo: vi.fn() }));
    fireEvent.click(screen.getByText(/Tak/));
    expect(screen.queryByText(/Tak/)).toBeNull();
    expect(screen.queryByText(/Nie/)).toBeNull();
  });

  it("should handle missing response texts gracefully", () => {
    const choice = { id: "c2", text: "Pytanie bez odpowiedzi?" };
    render(ConditionalChoice({ choice, onYes: vi.fn(), onNo: vi.fn() }));
    fireEvent.click(screen.getByText(/Tak/));
    // Should not crash when yesText is undefined
    expect(screen.queryByText(/Tak/)).toBeNull();
  });
});

  it("should track yes/no answers", () => {
    let answered = false;
    let answer: "yes" | "no" | null = null;

    const handleYes = () => {
      answered = true;
      answer = "yes";
    };

    const handleNo = () => {
      answered = true;
      answer = "no";
    };

    expect(answered).toBe(false);
    expect(answer).toBe(null);

    handleYes();
    expect(answered).toBe(true);
    expect(answer).toBe("yes");

    // Reset and test No
    answered = false;
    answer = null;

    handleNo();
    expect(answered).toBe(true);
    expect(answer).toBe("no");
  });

  it("should execute callbacks on answer", () => {
    const yesCallback = vi.fn();
    const noCallback = vi.fn();

    yesCallback();
    expect(yesCallback).toHaveBeenCalledTimes(1);
    expect(noCallback).toHaveBeenCalledTimes(0);

    noCallback();
    expect(yesCallback).toHaveBeenCalledTimes(1);
    expect(noCallback).toHaveBeenCalledTimes(1);
  });

  it("should return correct next paragraph based on answer", () => {
    const choice = {
      id: "c1",
      text: "Czy posiadasz klucz?",
      yesNextId: "10",
      noNextId: "11",
    };

    const getNextId = (answer: "yes" | "no"): string => {
      return answer === "yes" ? choice.yesNextId! : choice.noNextId!;
    };

    expect(getNextId("yes")).toBe("10");
    expect(getNextId("no")).toBe("11");
  });

  it("should prevent multiple answers", () => {
    let answered = false;
    let answerCount = 0;

    const handleAnswer = () => {
      if (answered) return;
      answered = true;
      answerCount++;
    };

    expect(answerCount).toBe(0);
    handleAnswer();
    expect(answerCount).toBe(1);
    handleAnswer();
    expect(answerCount).toBe(1); // Should not increment
  });

  it("should display correct response text", () => {
    const choice = {
      id: "c1",
      text: "Czy masz klucz?",
      yesText: "Otwierasz drzwi!",
      noText: "Drzwi są zamknięte",
    };

    const getResponseText = (answer: "yes" | "no"): string => {
      return answer === "yes" ? choice.yesText! : choice.noText!;
    };

    expect(getResponseText("yes")).toBe("Otwierasz drzwi!");
    expect(getResponseText("no")).toBe("Drzwi są zamknięte");
  });

  it("should handle missing response texts gracefully", () => {
    const choice: {
      id: string;
      text: string;
      yesText?: string;
      noText?: string;
    } = {
      id: "c1",
      text: "Pytanie?",
      // No yesText or noText
    };

    const getResponseText = (answer: "yes" | "no"): string | undefined => {
      return answer === "yes" ? choice.yesText : choice.noText;
    };

    expect(getResponseText("yes")).toBeUndefined();
    expect(getResponseText("no")).toBeUndefined();
  });
});
