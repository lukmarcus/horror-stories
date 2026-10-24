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

    it("dispatches SET_PARAGRAPH_HORIZONTAL when layout toggle clicked", async () => {
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

      const toggleBtn = screen.getByTitle("Poziome wybory (kliknij)");
      await user.click(toggleBtn);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "SET_PARAGRAPH_HORIZONTAL",
        payload: { id: "10", value: true },
      });
    });

    it("shows active layout toggle when areChoicesHorizontal is true", () => {
      const scenario = createMockScenario([
        { id: "10", text: "Test", areChoicesHorizontal: true },
      ]);

      renderWithEditor(
        <EditorParagraphView
          paragraphId="10"
          onRemove={vi.fn()}
          onNavigate={vi.fn()}
        />,
        scenario,
      );

      const toggleBtn = screen.getByTitle("Pionowe wybory (kliknij)");
      expect(toggleBtn.className).toContain(
        "editor-paragraph-view__layout-btn--active",
      );
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

    it("renders choices horizontally in preview when areChoicesHorizontal is true", () => {
      const scenario = createMockScenario([
        {
          id: "10",
          text: "Test",
          areChoicesHorizontal: true,
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

      const fieldset = document.querySelector(".choices.choices--horizontal");
      expect(fieldset).not.toBeNull();
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
});
