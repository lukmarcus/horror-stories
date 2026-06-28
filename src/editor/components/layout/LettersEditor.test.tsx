import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LettersEditor } from "./LettersEditor";
import { EditorContext } from "../../context/editorTypes";
import type { EditorState } from "../../context/editorTypes";

const EMPTY_META = {
  id: "test",
  title: "Test Scenario",
  description: "",
  minPlayerCount: 1,
  maxPlayerCount: 4,
  duration: 60,
  character: "jessica",
};

const makeState = (
  paragraphs: Array<{ id: string }> = [],
  letters: Array<{ id: string; paragraphId: string }> = [],
): EditorState => ({
  scenario: {
    meta: EMPTY_META,
    paragraphs,
    letters,
  },
  isDirty: false,
  activeParagraphId: null,
});

const makeContext = (state: EditorState) => {
  const dispatch = vi.fn();
  return {
    state,
    dispatch,
  };
};

describe("LettersEditor", () => {
  // ---------------------------------------------------------------
  // Basic rendering
  // ---------------------------------------------------------------
  it("renders without letters", () => {
    const ctx = makeContext(makeState([{ id: "1" }], []));
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );
    expect(screen.getByText("Żetony alfabetu")).toBeDefined();
    expect(screen.getByText("Dodaj literę")).toBeDefined();
  });

  it("renders null when context is missing", () => {
    const { container } = render(
      <EditorContext.Provider value={null}>
        <LettersEditor />
      </EditorContext.Provider>,
    );
    expect(container.firstChild).toBeNull();
  });

  it("shows assigned letters section when letters exist", () => {
    const ctx = makeContext(
      makeState(
        [{ id: "1" }, { id: "2" }],
        [
          { id: "A", paragraphId: "1" },
          { id: "B", paragraphId: "2" },
        ],
      ),
    );
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );
    expect(screen.getByText("Przypisane litery")).toBeDefined();
    expect(screen.getByText("A")).toBeDefined();
    expect(screen.getByText("B")).toBeDefined();
  });

  it("shows letters sorted alphabetically", () => {
    const ctx = makeContext(
      makeState(
        [{ id: "1" }, { id: "2" }, { id: "3" }],
        [
          { id: "C", paragraphId: "3" },
          { id: "A", paragraphId: "1" },
          { id: "B", paragraphId: "2" },
        ],
      ),
    );
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );
    const badges = screen.getAllByText(/^[A-Z]$/);
    expect(badges[0].textContent).toBe("A");
    expect(badges[1].textContent).toBe("B");
    expect(badges[2].textContent).toBe("C");
  });

  // ---------------------------------------------------------------
  // Adding letters
  // ---------------------------------------------------------------
  it("dispatches ADD_LETTER when adding new letter", () => {
    const ctx = makeContext(makeState([{ id: "10" }], []));
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const input = screen.getByPlaceholderText("numer…");
    const button = screen.getByRole("button", { name: "Dodaj" });

    fireEvent.change(input, { target: { value: "10" } });
    fireEvent.click(button);

    expect(ctx.dispatch).toHaveBeenCalledWith({
      type: "ADD_LETTER",
      payload: { id: "A", paragraphId: "10" },
    });
  });

  it("disables add button when paragraph input is empty", () => {
    const ctx = makeContext(makeState([{ id: "1" }], []));
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const button = screen.getByRole("button", { name: "Dodaj" });
    expect(button).toHaveProperty("disabled", true);
  });

  it("shows error when paragraph is already assigned to another letter", () => {
    const ctx = makeContext(
      makeState([{ id: "1" }], [{ id: "A", paragraphId: "1" }]),
    );
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const input = screen.getByPlaceholderText("numer…");
    const button = screen.getByRole("button", { name: "Dodaj" });

    fireEvent.change(input, { target: { value: "1" } });
    fireEvent.click(button);

    expect(
      screen.getByText("Paragraf §1 jest już przypisany do litery A."),
    ).toBeDefined();
    expect(ctx.dispatch).not.toHaveBeenCalled();
  });

  it("dispatches ADD_PARAGRAPH_SILENT when paragraph does not exist", () => {
    const ctx = makeContext(makeState([{ id: "1" }], []));
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const input = screen.getByPlaceholderText("numer…");
    const button = screen.getByRole("button", { name: "Dodaj" });

    fireEvent.change(input, { target: { value: "99" } });
    fireEvent.click(button);

    expect(ctx.dispatch).toHaveBeenCalledWith({
      type: "ADD_PARAGRAPH_SILENT",
      payload: "99",
    });
    expect(ctx.dispatch).toHaveBeenCalledWith({
      type: "ADD_LETTER",
      payload: { id: "A", paragraphId: "99" },
    });
  });

  it("clears input after successful add", () => {
    const ctx = makeContext(makeState([{ id: "5" }], []));
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const input = screen.getByPlaceholderText("numer…") as HTMLInputElement;
    const button = screen.getByRole("button", { name: "Dodaj" });

    fireEvent.change(input, { target: { value: "5" } });
    fireEvent.click(button);

    expect(input.value).toBe("");
  });

  it("allows selecting different letter from dropdown", () => {
    const ctx = makeContext(makeState([{ id: "1" }], []));
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("A");

    fireEvent.change(select, { target: { value: "B" } });
    expect(select.value).toBe("B");

    const input = screen.getByPlaceholderText("numer…");
    const button = screen.getByRole("button", { name: "Dodaj" });

    fireEvent.change(input, { target: { value: "1" } });
    fireEvent.click(button);

    expect(ctx.dispatch).toHaveBeenCalledWith({
      type: "ADD_LETTER",
      payload: { id: "B", paragraphId: "1" },
    });
  });

  it("disables add button when no letter or paragraph", () => {
    const ctx = makeContext(makeState([{ id: "1" }], []));
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const button = screen.getByRole("button", { name: "Dodaj" });
    expect(button).toHaveProperty("disabled", true);

    const input = screen.getByPlaceholderText("numer…");
    fireEvent.change(input, { target: { value: "1" } });

    expect(button).toHaveProperty("disabled", false);
  });

  // ---------------------------------------------------------------
  // Editing letters
  // ---------------------------------------------------------------
  it("allows editing paragraph assignment", () => {
    const ctx = makeContext(
      makeState([{ id: "1" }, { id: "2" }], [{ id: "A", paragraphId: "1" }]),
    );
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const inputs = screen.getAllByDisplayValue("1");
    const editInput = inputs[0] as HTMLInputElement;

    fireEvent.change(editInput, { target: { value: "2" } });
    fireEvent.blur(editInput);

    expect(ctx.dispatch).toHaveBeenCalledWith({
      type: "UPDATE_LETTER",
      payload: { id: "A", paragraphId: "2" },
    });
  });

  it("does not update when edit value is unchanged", () => {
    const ctx = makeContext(
      makeState([{ id: "1" }], [{ id: "A", paragraphId: "1" }]),
    );
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const inputs = screen.getAllByDisplayValue("1");
    const editInput = inputs[0];

    fireEvent.blur(editInput);

    expect(ctx.dispatch).not.toHaveBeenCalled();
  });

  it("shows error when editing to duplicate paragraph", () => {
    const ctx = makeContext(
      makeState(
        [{ id: "1" }, { id: "2" }],
        [
          { id: "A", paragraphId: "1" },
          { id: "B", paragraphId: "2" },
        ],
      ),
    );
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const inputs = screen.getAllByRole("textbox");
    const editInput = inputs.find(
      (el) => (el as HTMLInputElement).value === "1",
    ) as HTMLInputElement;

    fireEvent.change(editInput, { target: { value: "2" } });
    fireEvent.blur(editInput);

    expect(
      screen.getByText("Paragraf §2 jest już przypisany do litery B."),
    ).toBeDefined();
    expect(ctx.dispatch).not.toHaveBeenCalled();
  });

  it("creates new paragraph when editing to non-existent ID", () => {
    const ctx = makeContext(
      makeState([{ id: "1" }], [{ id: "A", paragraphId: "1" }]),
    );
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const inputs = screen.getAllByDisplayValue("1");
    const editInput = inputs[0];

    fireEvent.change(editInput, { target: { value: "99" } });
    fireEvent.blur(editInput);

    expect(ctx.dispatch).toHaveBeenCalledWith({
      type: "ADD_PARAGRAPH_SILENT",
      payload: "99",
    });
    expect(ctx.dispatch).toHaveBeenCalledWith({
      type: "UPDATE_LETTER",
      payload: { id: "A", paragraphId: "99" },
    });
  });

  it("clears edit state on Escape key", () => {
    const ctx = makeContext(
      makeState([{ id: "1" }], [{ id: "A", paragraphId: "1" }]),
    );
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const inputs = screen.getAllByDisplayValue("1");
    const editInput = inputs[0] as HTMLInputElement;

    fireEvent.change(editInput, { target: { value: "2" } });
    fireEvent.keyDown(editInput, { key: "Escape" });

    expect(editInput.value).toBe("1");
    expect(ctx.dispatch).not.toHaveBeenCalled();
  });

  it("commits edit on Enter key", () => {
    const ctx = makeContext(
      makeState([{ id: "1" }, { id: "2" }], [{ id: "A", paragraphId: "1" }]),
    );
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const inputs = screen.getAllByDisplayValue("1");
    const editInput = inputs[0];

    fireEvent.change(editInput, { target: { value: "2" } });
    fireEvent.keyDown(editInput, { key: "Enter" });

    expect(ctx.dispatch).toHaveBeenCalledWith({
      type: "UPDATE_LETTER",
      payload: { id: "A", paragraphId: "2" },
    });
  });

  // ---------------------------------------------------------------
  // Deleting letters
  // ---------------------------------------------------------------
  it("shows confirmation before deleting", () => {
    const ctx = makeContext(
      makeState([{ id: "1" }], [{ id: "A", paragraphId: "1" }]),
    );
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const deleteButton = screen.getByTitle("Usuń przypisanie");
    fireEvent.click(deleteButton);

    expect(screen.getByText("Usunąć?")).toBeDefined();
    expect(screen.getByRole("button", { name: "Tak" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Nie" })).toBeDefined();
  });

  it("dispatches REMOVE_LETTER when confirmed", () => {
    const ctx = makeContext(
      makeState([{ id: "1" }], [{ id: "A", paragraphId: "1" }]),
    );
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const deleteButton = screen.getByTitle("Usuń przypisanie");
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByRole("button", { name: "Tak" });
    fireEvent.click(confirmButton);

    expect(ctx.dispatch).toHaveBeenCalledWith({
      type: "REMOVE_LETTER",
      payload: "A",
    });
  });

  it("cancels deletion when clicking No", () => {
    const ctx = makeContext(
      makeState([{ id: "1" }], [{ id: "A", paragraphId: "1" }]),
    );
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const deleteButton = screen.getByTitle("Usuń przypisanie");
    fireEvent.click(deleteButton);

    const cancelButton = screen.getByRole("button", { name: "Nie" });
    fireEvent.click(cancelButton);

    expect(ctx.dispatch).not.toHaveBeenCalled();
    expect(screen.queryByText("Usunąć?")).toBeNull();
  });

  // ---------------------------------------------------------------
  // No available letters
  // ---------------------------------------------------------------
  it("shows message when all letters are used", () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      .split("")
      .map((id, i) => ({ id, paragraphId: String(i + 1) }));
    const paragraphs = letters.map((l) => ({ id: l.paragraphId }));
    const ctx = makeContext(makeState(paragraphs, letters));

    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    expect(
      screen.getByText("Wszystkie litery (A–Z) zostały już przypisane."),
    ).toBeDefined();
    expect(screen.queryByText("Dodaj literę")).toBeNull();
  });

  // ---------------------------------------------------------------
  // Autocomplete functionality
  // ---------------------------------------------------------------
  it("shows autocomplete dropdown when focused on add input", () => {
    const ctx = makeContext(
      makeState([{ id: "1" }, { id: "10" }, { id: "100" }], []),
    );
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const input = screen.getByPlaceholderText("numer…");
    fireEvent.focus(input);

    // Should show all available paragraphs
    expect(screen.getByText("§1")).toBeDefined();
    expect(screen.getByText("§10")).toBeDefined();
    expect(screen.getByText("§100")).toBeDefined();
  });

  it("filters autocomplete options based on input", () => {
    const ctx = makeContext(
      makeState([{ id: "1" }, { id: "10" }, { id: "100" }], []),
    );
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const input = screen.getByPlaceholderText("numer…");
    fireEvent.change(input, { target: { value: "1" } });
    fireEvent.focus(input);

    expect(screen.getByText("§1")).toBeDefined();
    expect(screen.getByText("§10")).toBeDefined();
    expect(screen.getByText("§100")).toBeDefined();
  });

  it("selects autocomplete option on click", () => {
    const ctx = makeContext(makeState([{ id: "1" }, { id: "10" }], []));
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const input = screen.getByPlaceholderText("numer…") as HTMLInputElement;
    fireEvent.focus(input);

    const option = screen.getByText("§10");
    fireEvent.mouseDown(option);

    expect(input.value).toBe("10");
  });

  it("navigates autocomplete with arrow keys", () => {
    const ctx = makeContext(
      makeState([{ id: "1" }, { id: "2" }, { id: "3" }], []),
    );
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const input = screen.getByPlaceholderText("numer…");
    fireEvent.focus(input);

    // Press ArrowDown to highlight first item
    fireEvent.keyDown(input, { key: "ArrowDown" });

    // Find dropdown options (not select options)
    const options = screen
      .getAllByRole("option")
      .filter((el) => el.textContent?.startsWith("§"));
    expect(options[0].className).toContain("highlighted");
  });

  it("selects highlighted option on Enter in autocomplete", () => {
    const ctx = makeContext(makeState([{ id: "1" }, { id: "2" }], []));
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const input = screen.getByPlaceholderText("numer…") as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowDown" }); // Highlight first
    fireEvent.keyDown(input, { key: "Enter" }); // Select

    expect(input.value).toBe("1");
  });

  it("closes autocomplete on Escape", () => {
    const ctx = makeContext(makeState([{ id: "1" }], []));
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const input = screen.getByPlaceholderText("numer…");
    fireEvent.focus(input);

    expect(screen.getByText("§1")).toBeDefined();

    fireEvent.keyDown(input, { key: "Escape" });

    expect(screen.queryByText("§1")).toBeNull();
  });

  // ---------------------------------------------------------------
  // Edge cases
  // ---------------------------------------------------------------
  it("trims whitespace from paragraph input", () => {
    const ctx = makeContext(makeState([{ id: "5" }], []));
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const input = screen.getByPlaceholderText("numer…");
    const button = screen.getByRole("button", { name: "Dodaj" });

    fireEvent.change(input, { target: { value: "  5  " } });
    fireEvent.click(button);

    expect(ctx.dispatch).toHaveBeenCalledWith({
      type: "ADD_LETTER",
      payload: { id: "A", paragraphId: "5" },
    });
  });

  it("uses first available letter as default", () => {
    const ctx = makeContext(
      makeState([{ id: "1" }, { id: "2" }], [{ id: "A", paragraphId: "1" }]),
    );
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("B"); // A is used, so B is first available
  });

  it("sorts paragraph IDs numerically and alphabetically", () => {
    const ctx = makeContext(
      makeState(
        [{ id: "100" }, { id: "2" }, { id: "10" }, { id: "a" }, { id: "b" }],
        [],
      ),
    );
    render(
      <EditorContext.Provider value={ctx}>
        <LettersEditor />
      </EditorContext.Provider>,
    );

    const input = screen.getByPlaceholderText("numer…");
    fireEvent.focus(input);

    // Filter to only get paragraph dropdown options (starting with §)
    const options = screen
      .getAllByRole("option")
      .filter((el) => el.textContent?.startsWith("§"));
    const texts = options.map((o) => o.textContent);

    // Should be sorted: 2, 10, 100, a, b
    expect(texts).toEqual(["§2", "§10", "§100", "§a", "§b"]);
  });
});
