import { useState } from "react";
import { Link } from "react-router-dom";
import { useEditor } from "../../context/useEditor";
import { sortParagraphIds } from "../../utils/editorUtils";
import "./EditorLayout.css";

interface EditorLayoutProps {
  children: React.ReactNode;
  activeSection: "meta" | string;
  onSectionChange: (section: "meta" | string) => void;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({
  children,
  activeSection,
  onSectionChange,
}) => {
  const { state, dispatch } = useEditor();
  const [newId, setNewId] = useState("");
  const [addError, setAddError] = useState<string | null>(null);

  const allEntries = sortParagraphIds(
    (state.scenario?.paragraphs ?? []).flatMap((p) => [
      p.id,
      ...(p.aliases ?? []),
    ]),
  ).map((id) => {
    const primary = state.scenario!.paragraphs.find((p) => p.id === id);
    if (primary) return { id, primaryId: id, isAlias: false };
    const owner = state.scenario!.paragraphs.find((p) =>
      (p.aliases ?? []).includes(id),
    )!;
    return { id, primaryId: owner.id, isAlias: true };
  });

  const handleAddParagraph = () => {
    const id = newId.trim();
    if (!id) return;
    const existing = new Set<string>();
    for (const p of state.scenario?.paragraphs ?? []) {
      existing.add(p.id);
      for (const a of p.aliases ?? []) existing.add(a);
    }
    if (existing.has(id)) {
      setAddError(`§${id} już istnieje`);
      return;
    }
    dispatch({ type: "ADD_PARAGRAPH", payload: id });
    onSectionChange(id);
    setNewId("");
    setAddError(null);
  };

  const handleAddKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAddParagraph();
    else setAddError(null);
  };

  return (
    <div className="editor-layout">
      <aside className="editor-sidebar">
        <div className="editor-sidebar__header">
          <Link to="/" className="editor-sidebar__back">
            ← Wróć do gry
          </Link>
          <h2 className="editor-sidebar__title">Edytor scenariuszy</h2>
        </div>

        <nav className="editor-sidebar__nav">
          <button
            className={`editor-sidebar__item ${
              activeSection === "meta" ? "editor-sidebar__item--active" : ""
            }`}
            onClick={() => onSectionChange("meta")}
          >
            Dane scenariusza
          </button>
          {state.scenario && (
            <button
              className={`editor-sidebar__item ${
                activeSection === "graph" ? "editor-sidebar__item--active" : ""
              }`}
              onClick={() => onSectionChange("graph")}
            >
              Graf połączeń
            </button>
          )}
          {state.scenario && (
            <button
              className={`editor-sidebar__item ${
                activeSection === "images" ? "editor-sidebar__item--active" : ""
              }`}
              onClick={() => onSectionChange("images")}
            >
              Grafiki
            </button>
          )}
          <button className="editor-sidebar__item editor-sidebar__item--placeholder">
            Przygotowanie
          </button>
          <button className="editor-sidebar__item editor-sidebar__item--placeholder">
            Żetony alfabetu
          </button>

          {allEntries.length > 0 && (
            <div className="editor-sidebar__section-divider" />
          )}
          {allEntries.map(({ id, primaryId, isAlias }) => (
            <button
              key={isAlias ? `alias-${id}` : id}
              className={`editor-sidebar__paragraph ${
                activeSection === id ? "editor-sidebar__paragraph--active" : ""
              }`}
              onClick={() => onSectionChange(primaryId)}
              aria-current={activeSection === id ? "true" : undefined}
              title={isAlias ? `Alias §${id} → §${primaryId}` : undefined}
            >
              <span className="editor-sidebar__paragraph-label">
                §{id}
                {isAlias && (
                  <span className="editor-sidebar__paragraph-tag">
                    &nbsp;→ §{primaryId}
                  </span>
                )}
                {id === "100" && !isAlias && (
                  <span className="editor-sidebar__paragraph-tag">
                    &nbsp;(śmierć)
                  </span>
                )}
              </span>
            </button>
          ))}

          {state.scenario && (
            <div className="editor-sidebar__add-row">
              <span className="editor-sidebar__add-prefix">§</span>
              <input
                className="editor-sidebar__add-input"
                type="text"
                value={newId}
                onChange={(e) => {
                  setNewId(
                    e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""),
                  );
                  setAddError(null);
                }}
                onKeyDown={handleAddKeyDown}
                placeholder="nr"
                maxLength={10}
                aria-label="Numer nowego paragrafu"
              />
              <button
                className="editor-sidebar__add-btn"
                onClick={handleAddParagraph}
                title="Dodaj paragraf"
              >
                +
              </button>
              {addError && (
                <span className="editor-sidebar__add-error">{addError}</span>
              )}
            </div>
          )}
        </nav>
      </aside>
      <main className="editor-main">{children}</main>
    </div>
  );
};
