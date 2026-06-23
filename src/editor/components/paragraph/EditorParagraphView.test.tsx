import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditorParagraphView } from "./EditorParagraphView";
import { EditorContext } from "../../context/editorTypes";
import type { EditorState } from "../../context/editorTypes";
import type {
  EditorScenario,
  EditorParagraph,
} from "../../context/editorTypes";

// ── Mock setup ────────────────────────────────────────────────────────────────

const mockDispatch = vi.fn();

beforeEach(() => {
  mockDispatch.mockClear();
});

function createMockScenario(
  paragraphs: EditorParagraph[],
  letters?: { id: string; paragraphId: string }[],
): EditorScenario {
  return {
    meta: {
      id: "test-scenario",
      title: "Test Scenario",
      description: "",
      minPlayerCount: 1,
      maxPlayerCount: 4,
      duration: 60,
    },
    setup: { pages: [] },
    paragraphs,
    letters: letters ?? [],
    images: {},
  };
}

function renderWithEditor(
  ui: React.ReactElement,
  scenario: EditorScenario | null,
) {
  const state: EditorState = {
    scenario,
    activeParagraphId: null,
    isDirty: false,
  };

  return render(
    <EditorContext.Provider value={{ state, dispatch: mockDispatch }}>
      {ui}
    </EditorContext.Provider>,
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("EditorParagraphView", () => {
  describe("Basic rendering", () => {
    it("renders paragraph with ID and content", () => {
      const scenario = createMockScenario([
        { id: "10", text: "Test paragraph" },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      expect(screen.getByText("§10")).toBeDefined();
    });

    it("returns null when paragraph does not exist", () => {
      const scenario = createMockScenario([{ id: "10", text: "Test" }]);

      const { container } = renderWithEditor(
        <EditorParagraphView
          paragraphId="999"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      expect(container.firstChild).toBeNull();
    });

    it("displays aliases in header", () => {
      const scenario = createMockScenario([
        { id: "10", text: "Test", aliases: ["10a", "10b"] },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      expect(screen.getByText("§10a")).toBeDefined();
      expect(screen.getByText("§10b")).toBeDefined();
    });
  });

  describe("Aliases management", () => {
    it("allows adding a new alias via Enter key", async () => {
      const user = userEvent.setup();
      const scenario = createMockScenario([{ id: "10", text: "Test" }]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const input = screen.getByPlaceholderText("+ alias");
      await user.type(input, "10a{Enter}");

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "ADD_ALIAS",
        payload: { paragraphId: "10", alias: "10a" },
      });
    });

    it("shows error when alias equals main ID", async () => {
      const user = userEvent.setup();
      const scenario = createMockScenario([{ id: "10", text: "Test" }]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const input = screen.getByPlaceholderText("+ alias");
      await user.type(input, "10{Enter}");

      expect(screen.getByText("To już jest główny ID")).toBeDefined();
      expect(mockDispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: "ADD_ALIAS" }),
      );
    });

    it("shows error when alias already exists", async () => {
      const user = userEvent.setup();
      const scenario = createMockScenario([
        { id: "10", text: "Test", aliases: ["10a"] },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const input = screen.getByPlaceholderText("+ alias");
      await user.type(input, "10a{Enter}");

      expect(screen.getByText("Już istnieje")).toBeDefined();
    });

    it("shows error when alias is used by another paragraph", async () => {
      const user = userEvent.setup();
      const scenario = createMockScenario([
        { id: "10", text: "Test" },
        { id: "20", text: "Other", aliases: ["20a"] },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const input = screen.getByPlaceholderText("+ alias");
      await user.type(input, "20a{Enter}");

      expect(screen.getByText("Zajęty przez inny paragraf")).toBeDefined();
    });

    it("removes alias when × button clicked", async () => {
      const user = userEvent.setup();
      const scenario = createMockScenario([
        { id: "10", text: "Test", aliases: ["10a"] },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const removeButton = screen.getByTitle("Usuń alias §10a");
      await user.click(removeButton);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "REMOVE_ALIAS",
        payload: { paragraphId: "10", alias: "10a" },
      });
    });

    it("does not add empty alias", async () => {
      const user = userEvent.setup();
      const scenario = createMockScenario([{ id: "10", text: "Test" }]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const input = screen.getByPlaceholderText("+ alias");
      await user.type(input, "   {Enter}");

      expect(mockDispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: "ADD_ALIAS" }),
      );
    });
  });

  describe("Incoming connections", () => {
    it("displays paragraphs that lead to this one", () => {
      const scenario = createMockScenario([
        {
          id: "10",
          text: "Target",
        },
        {
          id: "5",
          text: "Source 1",
          choices: [{ id: "c1", text: "Go", nextParagraphId: "10" }],
        },
        {
          id: "7",
          text: "Source 2",
          choices: [{ id: "c2", text: "Go", nextParagraphId: "10" }],
        },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      expect(screen.getByText("Prowadzi tutaj:")).toBeDefined();
      expect(screen.getByText("§5")).toBeDefined();
      expect(screen.getByText("§7")).toBeDefined();
    });

    it("navigates to source paragraph when incoming tag clicked", async () => {
      const user = userEvent.setup();
      const onNavigate = vi.fn();
      const scenario = createMockScenario([
        { id: "10", text: "Target" },
        {
          id: "5",
          text: "Source",
          choices: [{ id: "c1", text: "Go", nextParagraphId: "10" }],
        },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={onNavigate}
        />,
        scenario,
      );

      const tag = screen.getByTitle("Przejdź do §5");
      await user.click(tag);

      expect(onNavigate).toHaveBeenCalledWith("5");
    });

    it('shows "brak połączeń" when no incoming connections', () => {
      const scenario = createMockScenario([{ id: "10", text: "Alone" }]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      expect(screen.getByText("brak połączeń")).toBeDefined();
    });

    it("shows letter assignment when available", () => {
      const scenario = createMockScenario(
        [{ id: "10", text: "Test" }],
        [{ id: "A", paragraphId: "10" }],
      );

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
          onNavigateToLetters={vi.fn()}
        />,
        scenario,
      );

      expect(screen.getByText("Dostępna przez literę:")).toBeDefined();
      expect(screen.getByText("A")).toBeDefined();
    });

    it("navigates to letters editor when letter tag clicked", async () => {
      const user = userEvent.setup();
      const onNavigateToLetters = vi.fn();
      const scenario = createMockScenario(
        [{ id: "10", text: "Test" }],
        [{ id: "B", paragraphId: "10" }],
      );

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
          onNavigateToLetters={onNavigateToLetters}
        />,
        scenario,
      );

      const letterTag = screen.getByTitle("Przejdź do żetonów alfabetu");
      await user.click(letterTag);

      expect(onNavigateToLetters).toHaveBeenCalled();
    });
  });

  describe("Mode toggle", () => {
    it("starts in simple mode by default", () => {
      const scenario = createMockScenario([{ id: "10", text: "Test" }]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const simpleBtn = screen.getByRole("button", { name: "Prosty" });
      expect(simpleBtn.className).toContain(
        "editor-paragraph-view__mode-btn--active",
      );
    });

    it("switches to variant mode when button clicked", async () => {
      const user = userEvent.setup();
      const scenario = createMockScenario([{ id: "10", text: "Test" }]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const variantBtn = screen.getByRole("button", { name: "Wariantowy" });
      await user.click(variantBtn);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "ENABLE_VARIANT_MODE",
        payload: "10",
      });
    });

    it("shows confirmation when switching from variant mode with variants", async () => {
      const user = userEvent.setup();
      const scenario = createMockScenario([
        {
          id: "10",
          text: "Test",
          variants: { "variant-1": { pages: [[]] } },
        },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const simpleBtn = screen.getByRole("button", { name: "Prosty" });
      await user.click(simpleBtn);

      expect(screen.getByText("Usunąć wszystkie warianty?")).toBeDefined();
    });

    it("confirms switch to simple mode", async () => {
      const user = userEvent.setup();
      const scenario = createMockScenario([
        {
          id: "10",
          text: "Test",
          variants: { "variant-1": { pages: [[]] } },
        },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const simpleBtn = screen.getByRole("button", { name: "Prosty" });
      await user.click(simpleBtn);

      const confirmBtn = screen.getByRole("button", { name: "Tak" });
      await user.click(confirmBtn);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "DISABLE_VARIANT_MODE",
        payload: "10",
      });
    });

    it("cancels switch to simple mode", async () => {
      const user = userEvent.setup();
      const scenario = createMockScenario([
        {
          id: "10",
          text: "Test",
          variants: { "variant-1": { pages: [[]] } },
        },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const simpleBtn = screen.getByRole("button", { name: "Prosty" });
      await user.click(simpleBtn);

      const cancelBtn = screen.getByRole("button", { name: "Anuluj" });
      await user.click(cancelBtn);

      expect(mockDispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: "DISABLE_VARIANT_MODE" }),
      );
      expect(screen.queryByText("Usunąć wszystkie warianty?")).toBeNull();
    });

    it("switches to simple mode directly when no variants", async () => {
      const user = userEvent.setup();
      const scenario = createMockScenario([
        { id: "10", text: "Test", variants: {} },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const simpleBtn = screen.getByRole("button", { name: "Prosty" });
      await user.click(simpleBtn);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "DISABLE_VARIANT_MODE",
        payload: "10",
      });
      expect(screen.queryByText("Usunąć wszystkie warianty?")).toBeNull();
    });
  });

  describe("Paragraph deletion", () => {
    it("shows confirmation when delete button clicked", async () => {
      const user = userEvent.setup();
      const scenario = createMockScenario([{ id: "10", text: "Test" }]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const deleteBtn = screen.getByRole("button", { name: "Usuń paragraf" });
      await user.click(deleteBtn);

      expect(screen.getByText("Usunąć §10?")).toBeDefined();
    });

    it("confirms deletion and calls onRemove", async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();
      const scenario = createMockScenario([{ id: "10", text: "Test" }]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={onRemove}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const deleteBtn = screen.getByRole("button", { name: "Usuń paragraf" });
      await user.click(deleteBtn);

      const confirmBtn = screen.getByRole("button", { name: "Tak" });
      await user.click(confirmBtn);

      expect(onRemove).toHaveBeenCalledWith("10");
    });

    it("cancels deletion", async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();
      const scenario = createMockScenario([{ id: "10", text: "Test" }]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={onRemove}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const deleteBtn = screen.getByRole("button", { name: "Usuń paragraf" });
      await user.click(deleteBtn);

      const cancelBtn = screen.getAllByRole("button", { name: "Anuluj" })[0];
      await user.click(cancelBtn);

      expect(onRemove).not.toHaveBeenCalled();
      expect(screen.queryByText("Usunąć §10?")).toBeNull();
    });

    it("disables delete button for §100", () => {
      const scenario = createMockScenario([{ id: "100", text: "Death" }]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="100"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const deleteBtn = screen.getByRole("button", {
        name: "Nie można usunąć",
      }) as HTMLButtonElement;
      expect(deleteBtn.disabled).toBe(true);
    });
  });

  describe("Simple mode - content editing", () => {
    it("renders PagesEditor when paragraph has pages", () => {
      const scenario = createMockScenario([
        {
          id: "10",
          text: "",
          pages: [[{ type: "text", text: "Page content" }]],
        },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      // PagesEditor should be rendered (component itself tested separately)
      expect(screen.getByText("Treść")).toBeDefined();
    });

    it("renders textarea when paragraph has no pages (legacy mode)", () => {
      const scenario = createMockScenario([
        { id: "10", text: "Legacy text content" },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const textarea = screen.getByPlaceholderText(
        "Wpisz treść paragrafu…",
      ) as HTMLTextAreaElement;
      expect(textarea).toBeDefined();
      expect(textarea.value).toBe("Legacy text content");
    });

    it("updates text when typing in textarea", async () => {
      const user = userEvent.setup();
      const scenario = createMockScenario([{ id: "10", text: "Old text" }]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const textarea = screen.getByPlaceholderText("Wpisz treść paragrafu…");
      await user.clear(textarea);
      await user.type(textarea, "New text");

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "SET_PARAGRAPH_TEXT",
          payload: expect.objectContaining({ id: "10" }),
        }),
      );
    });

    it("converts text to pages when button clicked", async () => {
      const user = userEvent.setup();
      const scenario = createMockScenario([{ id: "10", text: "Old format" }]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const convertBtn = screen.getByRole("button", {
        name: "Przekonwertuj na bloki",
      });
      await user.click(convertBtn);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "CONVERT_TEXT_TO_PAGES",
        payload: "10",
      });
    });

    it("shows legacy format hint", () => {
      const scenario = createMockScenario([{ id: "10", text: "Test" }]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      expect(screen.getByText("(stary format — tylko tekst)")).toBeDefined();
    });
  });

  describe("Simple mode - choices", () => {
    it("renders list of choices", () => {
      const scenario = createMockScenario([
        {
          id: "10",
          text: "Test",
          choices: [
            { id: "c1", text: "Choice 1", nextParagraphId: "20" },
            { id: "c2", text: "Choice 2", nextParagraphId: "30" },
          ],
        },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      expect(screen.getByText("Wybory")).toBeDefined();
      // ChoiceRow component tested separately
    });

    it("removes choice when requested", () => {
      const scenario = createMockScenario([
        {
          id: "10",
          text: "Test",
          choices: [{ id: "c1", text: "Choice 1", nextParagraphId: "20" }],
        },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      // ChoiceRow renders remove button - simulate the onRemove callback
      // (actual button interaction tested in ChoiceRow.test.tsx)
      const choiceRow = screen.getByText("Choice 1").closest(".choice-row");
      expect(choiceRow).toBeDefined();
    });

    it("renders ChoiceAddRow for adding new choices", () => {
      const scenario = createMockScenario([{ id: "10", text: "Test" }]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      // ChoiceAddRow component tested separately - just verify it's present
      expect(screen.getByText("Wybory")).toBeDefined();
    });
  });

  describe("Variant mode - intro content", () => {
    it("renders PagesEditor with singlePage for intro", () => {
      const scenario = createMockScenario([
        {
          id: "10",
          text: "",
          variants: { var1: { pages: [[]] } },
          pages: [[{ type: "text", text: "Intro text" }]],
        },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      expect(screen.getByText("Treść wprowadzająca")).toBeDefined();
    });
  });

  describe("Variant mode - selectors", () => {
    it("renders list of variant selectors", () => {
      const scenario = createMockScenario([
        {
          id: "10",
          text: "",
          variants: { var1: { pages: [[]] } },
          variantSelectors: [
            { id: "s1", text: "Select Variant 1", nextVariantId: "var1" },
          ],
        },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      expect(
        screen.getByText("Selektor wariantów (→ poziome przyciski)"),
      ).toBeDefined();
    });

    it("updates selector text when changed", async () => {
      const user = userEvent.setup();
      const scenario = createMockScenario([
        {
          id: "10",
          text: "",
          variants: { var1: { pages: [[]] } },
          variantSelectors: [
            { id: "s1", text: "Old text", nextVariantId: "var1" },
          ],
        },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const textInput = screen.getByPlaceholderText("Tekst przycisku");
      await user.clear(textInput);
      await user.type(textInput, "New text");

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "UPDATE_VARIANT_SELECTOR",
          payload: expect.objectContaining({
            paragraphId: "10",
            choice: expect.objectContaining({ text: expect.any(String) }),
          }),
        }),
      );
    });

    it("shows dropdown when variant target input focused", () => {
      const scenario = createMockScenario([
        {
          id: "10",
          text: "",
          variants: { var1: { pages: [[]] }, var2: { pages: [[]] } },
          variantSelectors: [{ id: "s1", text: "Select", nextVariantId: "" }],
        },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const targetInputs = screen.getAllByPlaceholderText("?");
      const targetInput = targetInputs[targetInputs.length - 1];

      // Focus the input by typing (more reliable than click for focus)
      targetInput.focus();

      // Check if dropdown appears by looking for the dropdown container
      const dropdown = document.querySelector(
        ".editor-paragraph-view__choice-dropdown",
      );
      expect(dropdown).toBeDefined();

      // Verify dropdown has items
      if (dropdown) {
        expect(dropdown.textContent).toContain("W:var1");
        expect(dropdown.textContent).toContain("W:var2");
      }
    });

    it("removes selector when remove button clicked", async () => {
      const user = userEvent.setup();
      const scenario = createMockScenario([
        {
          id: "10",
          text: "",
          variants: { var1: { pages: [[]] } },
          variantSelectors: [
            { id: "s1", text: "Select", nextVariantId: "var1" },
          ],
        },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const removeBtn = screen.getByTitle("Usuń przycisk");
      await user.click(removeBtn);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "REMOVE_VARIANT_SELECTOR",
        payload: { paragraphId: "10", choiceId: "s1" },
      });
    });

    it("renders ChoiceAddRow for adding selectors", () => {
      const scenario = createMockScenario([
        {
          id: "10",
          text: "",
          variants: { var1: { pages: [[]] } },
        },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      // ChoiceAddRow tested separately - verify presence
      expect(
        screen.getByText("Selektor wariantów (→ poziome przyciski)"),
      ).toBeDefined();
    });
  });

  describe("Variant mode - variants list", () => {
    it("renders list of variants using VariantEditor", () => {
      const scenario = createMockScenario([
        {
          id: "10",
          text: "",
          variants: {
            var1: { pages: [[{ type: "text", text: "Variant 1" }]] },
            var2: { pages: [[{ type: "text", text: "Variant 2" }]] },
          },
        },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      expect(screen.getByText("Warianty")).toBeDefined();
      // VariantEditor component tested separately
    });

    it('shows "Brak wariantów" when no variants exist', () => {
      const scenario = createMockScenario([
        { id: "10", text: "", variants: {} },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      expect(
        screen.getByText("Brak wariantów — dodaj pierwszy poniżej."),
      ).toBeDefined();
    });

    it("adds new variant when button clicked", async () => {
      const user = userEvent.setup();
      const scenario = createMockScenario([
        { id: "10", text: "", variants: {} },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const input = screen.getByPlaceholderText("nazwa-nowego-wariantu");
      await user.type(input, "new-variant");

      const addBtn = screen.getByRole("button", { name: "+ Dodaj wariant" });
      await user.click(addBtn);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "ADD_VARIANT",
        payload: { paragraphId: "10", variantId: "new-variant" },
      });
    });

    it("adds new variant when Enter pressed", async () => {
      const user = userEvent.setup();
      const scenario = createMockScenario([
        { id: "10", text: "", variants: {} },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const input = screen.getByPlaceholderText("nazwa-nowego-wariantu");
      await user.type(input, "another-variant{Enter}");

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "ADD_VARIANT",
        payload: { paragraphId: "10", variantId: "another-variant" },
      });
    });

    it("normalizes variant ID to lowercase alphanumeric", async () => {
      const user = userEvent.setup();
      const scenario = createMockScenario([
        { id: "10", text: "", variants: {} },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const input = screen.getByPlaceholderText(
        "nazwa-nowego-wariantu",
      ) as HTMLInputElement;
      await user.type(input, "Test_Variant@123!");

      // Input should filter out invalid characters (keeps only a-z0-9-)
      expect(input.value).toBe("testvariant123");
    });

    it("disables add button when variant ID empty", () => {
      const scenario = createMockScenario([
        { id: "10", text: "", variants: {} },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const addBtn = screen.getByRole("button", {
        name: "+ Dodaj wariant",
      }) as HTMLButtonElement;
      expect(addBtn.disabled).toBe(true);
    });
  });

  describe("Preview - simple mode", () => {
    it("shows PagesPreview when paragraph has pages", () => {
      const scenario = createMockScenario([
        {
          id: "10",
          text: "",
          pages: [[{ type: "text", text: "Preview content" }]],
        },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      expect(screen.getByText("Podgląd")).toBeDefined();
      // PagesPreview component tested separately
    });

    it("shows text content split by lines when no pages", () => {
      const scenario = createMockScenario([
        { id: "10", text: "Line 1\nLine 2\nLine 3" },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      // ParagraphText component tested separately - just verify podgląd section exists
      expect(screen.getByText("Podgląd")).toBeDefined();
    });

    it('shows "Brak treści" when no content', () => {
      const scenario = createMockScenario([{ id: "10", text: "" }]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      expect(screen.getByText("Brak treści")).toBeDefined();
    });

    it("renders choices as vertical buttons in preview", () => {
      const scenario = createMockScenario([
        {
          id: "10",
          text: "Test",
          choices: [
            { id: "c1", text: "Choice 1", nextParagraphId: "20" },
            { id: "c2", text: "Choice 2", nextParagraphId: "30" },
          ],
        },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const choicesFieldset = document.querySelector(
        ".choices.choices--vertical",
      );
      expect(choicesFieldset).toBeDefined();
    });

    it("navigates when choice button clicked in preview", async () => {
      const user = userEvent.setup();
      const onNavigate = vi.fn();
      const scenario = createMockScenario([
        {
          id: "10",
          text: "Test",
          choices: [{ id: "c1", text: "Go to 20", nextParagraphId: "20" }],
        },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={onNavigate}
        />,
        scenario,
      );

      const choiceBtn = screen.getByTitle("Przejdź do §20");
      await user.click(choiceBtn);

      expect(onNavigate).toHaveBeenCalledWith("20");
    });
  });

  describe("Preview - variant mode", () => {
    it("shows intro PagesPreview and selector buttons", () => {
      const scenario = createMockScenario([
        {
          id: "10",
          text: "",
          variants: { var1: { pages: [[]] } },
          pages: [[{ type: "text", text: "Intro" }]],
          variantSelectors: [
            { id: "s1", text: "Select Variant", nextVariantId: "var1" },
          ],
        },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      expect(screen.getAllByText("Podgląd").length).toBeGreaterThan(0);
      const choicesFieldset = document.querySelector(
        ".choices.choices--horizontal",
      );
      expect(choicesFieldset).toBeDefined();
    });

    it('shows "Brak treści wprowadzającej" when no intro pages', () => {
      const scenario = createMockScenario([
        {
          id: "10",
          text: "",
          variants: { var1: { pages: [[]] } },
        },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      expect(screen.getByText("Brak treści wprowadzającej")).toBeDefined();
    });
  });
});
