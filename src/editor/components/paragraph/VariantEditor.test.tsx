import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VariantEditor } from "./VariantEditor";
import type { EditorVariant, EditorChoice } from "../../context/editorTypes";
import { EditorContext } from "../../context/editorTypes";

// Mock subcomponents
vi.mock("./PagesEditor", () => ({
  PagesEditor: ({
    onPagesChange,
  }: {
    onPagesChange: (pages: unknown[][]) => void;
  }) => (
    <div data-testid="pages-editor">
      <button onClick={() => onPagesChange([[{ text: "new page" }]])}>
        Change Pages
      </button>
    </div>
  ),
}));

vi.mock("./PagesPreview", () => ({
  PagesPreview: ({ pages }: { pages: unknown[][] }) => (
    <div data-testid="pages-preview">{pages.length} pages</div>
  ),
}));

vi.mock("./ChoiceRow", () => ({
  ChoiceRow: ({
    choice,
    onUpdate,
    onRemove,
  }: {
    choice: EditorChoice;
    onUpdate: (c: EditorChoice) => void;
    onRemove: (id: string) => void;
  }) => (
    <div data-testid={`choice-row-${choice.id}`}>
      <span>{choice.text}</span>
      <button onClick={() => onUpdate({ ...choice, text: "updated" })}>
        Update
      </button>
      <button onClick={() => onRemove(choice.id)}>Remove</button>
    </div>
  ),
}));

vi.mock("./ChoiceAddRow", () => ({
  ChoiceAddRow: ({
    prefixLabel,
    onAdd,
    onPrefixToggle,
  }: {
    prefixLabel: string;
    onAdd: (text: string, target: string) => void;
    onPrefixToggle?: () => void;
  }) => (
    <div data-testid="choice-add-row">
      <span data-testid="prefix-label">{prefixLabel}</span>
      <button onClick={() => onAdd("New choice", "target-1")}>
        Add Choice
      </button>
      {onPrefixToggle && (
        <button onClick={onPrefixToggle}>Toggle Prefix</button>
      )}
    </div>
  ),
}));

vi.mock("../../../components/text/RichText/RichText", () => ({
  RichText: ({ content }: { content: unknown[] }) => (
    <div data-testid="rich-text">{JSON.stringify(content)}</div>
  ),
}));

vi.mock("../../../components/ui/Button", () => ({
  Button: ({
    children,
    title,
  }: {
    children: React.ReactNode;
    title?: string;
  }) => <button title={title}>{children}</button>,
}));

const mockDispatch = vi.fn();

const makeContext = () => ({
  state: {
    scenario: {
      meta: {
        id: "test-scenario",
        title: "Test",
        description: "",
        minPlayerCount: null,
        maxPlayerCount: null,
        duration: null,
      },
      paragraphs: [],
      letters: [],
      setup: { pages: [[]] },
    },
    isDirty: false,
    activeParagraphId: null,
  },
  dispatch: mockDispatch,
});

const baseVariant: EditorVariant = {
  pages: [[{ type: "text", text: "Variant content" }]],
  choices: [],
};

const makeProps = (
  overrides: Partial<Parameters<typeof VariantEditor>[0]> = {},
) => ({
  paragraphId: "para-1",
  variantId: "var-a",
  variant: baseVariant,
  variantIds: ["var-a", "var-b"],
  paragraphIds: ["1", "2", "3"],
  ...overrides,
});

describe("VariantEditor", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  // ---------------------------------------------------------------
  // Basic rendering
  // ---------------------------------------------------------------
  describe("Basic rendering", () => {
    it("renders variant name", () => {
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps()} />
        </EditorContext.Provider>,
      );
      expect(screen.getByText(/var-a/)).toBeDefined();
    });

    it("renders toggle button with collapse icon by default", () => {
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps()} />
        </EditorContext.Provider>,
      );
      const toggle = screen.getByTitle("Zwiń");
      expect(toggle.textContent).toBe("▼");
    });

    it("renders PagesEditor and PagesPreview", () => {
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps()} />
        </EditorContext.Provider>,
      );
      expect(screen.getByTestId("pages-editor")).toBeDefined();
      expect(screen.getByTestId("pages-preview")).toBeDefined();
    });
  });

  // ---------------------------------------------------------------
  // Collapse/Expand
  // ---------------------------------------------------------------
  describe("Collapse/Expand", () => {
    it("shows variant body by default (expanded)", () => {
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps()} />
        </EditorContext.Provider>,
      );
      expect(screen.getByTestId("pages-editor")).toBeDefined();
    });

    it("collapses variant body on toggle click", () => {
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps()} />
        </EditorContext.Provider>,
      );
      const toggle = screen.getByTitle("Zwiń");
      fireEvent.click(toggle);
      expect(screen.queryByTestId("pages-editor")).toBeNull();
    });

    it("expands variant body on second toggle click", () => {
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps()} />
        </EditorContext.Provider>,
      );
      const toggleBtn = screen.getByTitle("Zwiń");
      fireEvent.click(toggleBtn);
      expect(screen.queryByTestId("pages-editor")).toBeNull();

      const expandBtn = screen.getByTitle("Rozwiń");
      fireEvent.click(expandBtn);
      expect(screen.getByTestId("pages-editor")).toBeDefined();
    });
  });

  // ---------------------------------------------------------------
  // Rename flow
  // ---------------------------------------------------------------
  describe("Rename flow", () => {
    it("shows rename input when edit button clicked", () => {
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps()} />
        </EditorContext.Provider>,
      );
      const editBtn = screen.getByTitle("Zmień nazwę wariantu");
      fireEvent.click(editBtn);
      const input = screen.getByDisplayValue("var-a");
      expect(input).toBeDefined();
    });

    it("sanitizes input to lowercase a-z0-9- only", () => {
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps()} />
        </EditorContext.Provider>,
      );
      const editBtn = screen.getByTitle("Zmień nazwę wariantu");
      fireEvent.click(editBtn);
      const input = screen.getByDisplayValue("var-a") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "New-Variant_123!@#" } });
      expect(input.value).toBe("new-variant123");
    });

    it("dispatches RENAME_VARIANT on Enter key", () => {
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps()} />
        </EditorContext.Provider>,
      );
      const editBtn = screen.getByTitle("Zmień nazwę wariantu");
      fireEvent.click(editBtn);
      const input = screen.getByDisplayValue("var-a");
      fireEvent.change(input, { target: { value: "var-new" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "RENAME_VARIANT",
        payload: { paragraphId: "para-1", oldId: "var-a", newId: "var-new" },
      });
    });

    it("dispatches RENAME_VARIANT on save button click", () => {
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps()} />
        </EditorContext.Provider>,
      );
      const editBtn = screen.getByTitle("Zmień nazwę wariantu");
      fireEvent.click(editBtn);
      const input = screen.getByDisplayValue("var-a");
      fireEvent.change(input, { target: { value: "var-new" } });
      const saveBtn = screen.getByTitle("Zapisz nazwę");
      fireEvent.click(saveBtn);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "RENAME_VARIANT",
        payload: { paragraphId: "para-1", oldId: "var-a", newId: "var-new" },
      });
    });

    it("cancels rename on Escape key without dispatching", () => {
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps()} />
        </EditorContext.Provider>,
      );
      const editBtn = screen.getByTitle("Zmień nazwę wariantu");
      fireEvent.click(editBtn);
      const input = screen.getByDisplayValue("var-a");
      fireEvent.change(input, { target: { value: "var-new" } });
      fireEvent.keyDown(input, { key: "Escape" });

      expect(mockDispatch).not.toHaveBeenCalled();
      expect(screen.getByText(/var-a/)).toBeDefined();
    });

    it("cancels rename on cancel button click without dispatching", () => {
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps()} />
        </EditorContext.Provider>,
      );
      const editBtn = screen.getByTitle("Zmień nazwę wariantu");
      fireEvent.click(editBtn);
      const input = screen.getByDisplayValue("var-a");
      fireEvent.change(input, { target: { value: "var-new" } });
      const cancelBtn = screen.getByTitle("Anuluj");
      fireEvent.click(cancelBtn);

      expect(mockDispatch).not.toHaveBeenCalled();
      expect(screen.getByText(/var-a/)).toBeDefined();
    });

    it("does not dispatch when name is empty", () => {
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps()} />
        </EditorContext.Provider>,
      );
      const editBtn = screen.getByTitle("Zmień nazwę wariantu");
      fireEvent.click(editBtn);
      const input = screen.getByDisplayValue("var-a");
      fireEvent.change(input, { target: { value: "   " } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it("does not dispatch when name is unchanged", () => {
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps()} />
        </EditorContext.Provider>,
      );
      const editBtn = screen.getByTitle("Zmień nazwę wariantu");
      fireEvent.click(editBtn);
      const input = screen.getByDisplayValue("var-a");
      fireEvent.keyDown(input, { key: "Enter" });

      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------
  // Delete confirmation
  // ---------------------------------------------------------------
  describe("Delete confirmation", () => {
    it("shows confirmation prompt on delete button click", () => {
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps()} />
        </EditorContext.Provider>,
      );
      const deleteBtn = screen.getByTitle("Usuń wariant var-a");
      fireEvent.click(deleteBtn);
      expect(screen.getByText("Usunąć?")).toBeDefined();
    });

    it("dispatches REMOVE_VARIANT on Tak button click", () => {
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps()} />
        </EditorContext.Provider>,
      );
      const deleteBtn = screen.getByTitle("Usuń wariant var-a");
      fireEvent.click(deleteBtn);
      const confirmBtn = screen.getByText("Tak");
      fireEvent.click(confirmBtn);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "REMOVE_VARIANT",
        payload: { paragraphId: "para-1", variantId: "var-a" },
      });
    });

    it("cancels delete on Anuluj button click without dispatching", () => {
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps()} />
        </EditorContext.Provider>,
      );
      const deleteBtn = screen.getByTitle("Usuń wariant var-a");
      fireEvent.click(deleteBtn);
      const cancelBtn = screen.getByText("Anuluj");
      fireEvent.click(cancelBtn);

      expect(mockDispatch).not.toHaveBeenCalled();
      expect(screen.queryByText("Usunąć?")).toBeNull();
    });
  });

  // ---------------------------------------------------------------
  // Horizontal toggle
  // ---------------------------------------------------------------
  describe("Horizontal toggle", () => {
    it("shows vertical layout by default", () => {
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps()} />
        </EditorContext.Provider>,
      );
      expect(screen.getByText("↓ Pionowe")).toBeDefined();
    });

    it("dispatches SET_VARIANT_HORIZONTAL on toggle click", () => {
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps()} />
        </EditorContext.Provider>,
      );
      const toggleBtn = screen.getByText("↓ Pionowe");
      fireEvent.click(toggleBtn);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "SET_VARIANT_HORIZONTAL",
        payload: { paragraphId: "para-1", variantId: "var-a", value: true },
      });
    });

    it("shows horizontal layout when areChoicesHorizontal is true", () => {
      const horizontalVariant: EditorVariant = {
        ...baseVariant,
        areChoicesHorizontal: true,
      };
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps({ variant: horizontalVariant })} />
        </EditorContext.Provider>,
      );
      expect(screen.getByText("→ Poziome")).toBeDefined();
    });
  });

  // ---------------------------------------------------------------
  // Choices management
  // ---------------------------------------------------------------
  describe("Choices management", () => {
    it("renders ChoiceRow for each choice", () => {
      const variantWithChoices: EditorVariant = {
        ...baseVariant,
        choices: [
          { id: "choice-1", text: "Choice 1", nextParagraphId: "1" },
          { id: "choice-2", text: "Choice 2", nextParagraphId: "2" },
        ],
      };
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps({ variant: variantWithChoices })} />
        </EditorContext.Provider>,
      );
      expect(screen.getByTestId("choice-row-choice-1")).toBeDefined();
      expect(screen.getByTestId("choice-row-choice-2")).toBeDefined();
    });

    it("dispatches UPDATE_VARIANT_CHOICE when ChoiceRow updates", () => {
      const variantWithChoices: EditorVariant = {
        ...baseVariant,
        choices: [{ id: "choice-1", text: "Choice 1", nextParagraphId: "1" }],
      };
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps({ variant: variantWithChoices })} />
        </EditorContext.Provider>,
      );
      const updateBtn = screen.getByText("Update");
      fireEvent.click(updateBtn);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "UPDATE_VARIANT_CHOICE",
        payload: {
          paragraphId: "para-1",
          variantId: "var-a",
          choice: { id: "choice-1", text: "updated", nextParagraphId: "1" },
        },
      });
    });

    it("dispatches REMOVE_VARIANT_CHOICE when ChoiceRow removes", () => {
      const variantWithChoices: EditorVariant = {
        ...baseVariant,
        choices: [{ id: "choice-1", text: "Choice 1", nextParagraphId: "1" }],
      };
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps({ variant: variantWithChoices })} />
        </EditorContext.Provider>,
      );
      const removeBtn = screen.getByText("Remove");
      fireEvent.click(removeBtn);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "REMOVE_VARIANT_CHOICE",
        payload: {
          paragraphId: "para-1",
          variantId: "var-a",
          choiceId: "choice-1",
        },
      });
    });
  });

  // ---------------------------------------------------------------
  // Add choice
  // ---------------------------------------------------------------
  describe("Add choice", () => {
    it("dispatches ADD_VARIANT_CHOICE when ChoiceAddRow adds paragraph choice", () => {
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps()} />
        </EditorContext.Provider>,
      );
      const addBtn = screen.getByText("Add Choice");
      fireEvent.click(addBtn);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "ADD_VARIANT_CHOICE",
          payload: expect.objectContaining({
            paragraphId: "para-1",
            variantId: "var-a",
            choice: expect.objectContaining({
              text: "New choice",
              nextParagraphId: "target-1",
            }),
          }),
        }),
      );
    });

    it("shows prefix toggle button when horizontal", () => {
      const horizontalVariant: EditorVariant = {
        ...baseVariant,
        areChoicesHorizontal: true,
      };
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps({ variant: horizontalVariant })} />
        </EditorContext.Provider>,
      );
      expect(screen.getByText("Toggle Prefix")).toBeDefined();
    });

    it("toggles between paragraph and variant prefix", () => {
      const horizontalVariant: EditorVariant = {
        ...baseVariant,
        areChoicesHorizontal: true,
      };
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps({ variant: horizontalVariant })} />
        </EditorContext.Provider>,
      );
      expect(screen.getByTestId("prefix-label").textContent).toBe("§");
      const toggleBtn = screen.getByText("Toggle Prefix");
      fireEvent.click(toggleBtn);
      expect(screen.getByTestId("prefix-label").textContent).toBe("W");
    });

    it("adds variant choice when prefix toggled to variant", () => {
      const horizontalVariant: EditorVariant = {
        ...baseVariant,
        areChoicesHorizontal: true,
      };
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps({ variant: horizontalVariant })} />
        </EditorContext.Provider>,
      );
      const toggleBtn = screen.getByText("Toggle Prefix");
      fireEvent.click(toggleBtn);
      const addBtn = screen.getByText("Add Choice");
      fireEvent.click(addBtn);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "ADD_VARIANT_CHOICE",
          payload: expect.objectContaining({
            choice: expect.objectContaining({
              text: "New choice",
              nextVariantId: "target-1",
            }),
          }),
        }),
      );
    });
  });

  // ---------------------------------------------------------------
  // Pages management
  // ---------------------------------------------------------------
  describe("Pages management", () => {
    it("dispatches SET_VARIANT_PAGES when PagesEditor changes", () => {
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps()} />
        </EditorContext.Provider>,
      );
      const changeBtn = screen.getByText("Change Pages");
      fireEvent.click(changeBtn);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "SET_VARIANT_PAGES",
        payload: {
          paragraphId: "para-1",
          variantId: "var-a",
          pages: [[{ text: "new page" }]],
        },
      });
    });

    it("passes variant pages to PagesPreview", () => {
      const variantWithPages: EditorVariant = {
        ...baseVariant,
        pages: [[{ text: "page 1" }], [{ text: "page 2" }]],
      };
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps({ variant: variantWithPages })} />
        </EditorContext.Provider>,
      );
      expect(screen.getByText("2 pages")).toBeDefined();
    });
  });

  // ---------------------------------------------------------------
  // Preview
  // ---------------------------------------------------------------
  describe("Preview", () => {
    it("renders preview buttons for each choice", () => {
      const variantWithChoices: EditorVariant = {
        ...baseVariant,
        choices: [
          { id: "choice-1", text: "Choice 1", nextParagraphId: "1" },
          { id: "choice-2", text: "Choice 2", nextVariantId: "var-b" },
        ],
      };
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps({ variant: variantWithChoices })} />
        </EditorContext.Provider>,
      );
      const buttons = screen.getAllByTitle(/→/);
      expect(buttons.length).toBe(2);
      expect(buttons[0].getAttribute("title")).toBe("→ §1");
      expect(buttons[1].getAttribute("title")).toBe("→ W:var-b");
    });

    it("does not show preview choices section when no choices", () => {
      render(
        <EditorContext.Provider value={makeContext()}>
          <VariantEditor {...makeProps()} />
        </EditorContext.Provider>,
      );
      const fieldsets = document.querySelectorAll("fieldset.choices");
      expect(fieldsets.length).toBe(0);
    });
  });
});
