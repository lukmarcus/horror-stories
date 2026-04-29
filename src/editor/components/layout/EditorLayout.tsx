import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEditor } from "../../context/useEditor";
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

  const paragraphs = [...(state.scenario?.paragraphs ?? [])].sort((a, b) => {
    const na = parseInt(a.id, 10);
    const nb = parseInt(b.id, 10);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return a.id.localeCompare(b.id);
  });

  const handleAddParagraph = () => {
    const id = newId.trim();
    if (!id) return;
    const existing = new Set(state.scenario?.paragraphs.map((p) => p.id) ?? []);
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
          <button className="editor-sidebar__item editor-sidebar__item--placeholder">
            Przygotowanie
          </button>
          <button className="editor-sidebar__item editor-sidebar__item--placeholder">
            Żetony alfabetu
          </button>

          {paragraphs.length > 0 && (
            <div className="editor-sidebar__section-divider" />
          )}
          {paragraphs.map((p) => (
            <div
              key={p.id}
              className={`editor-sidebar__paragraph ${
                activeSection === p.id
                  ? "editor-sidebar__paragraph--active"
                  : ""
              }`}
              onClick={() => onSectionChange(p.id)}
            >
              <span className="editor-sidebar__paragraph-label">
                §{p.id}
                {p.id === "100" && (
                  <span className="editor-sidebar__paragraph-tag">
                    &nbsp;(śmierć)
                  </span>
                )}
              </span>
            </div>
          ))}

          {state.scenario && (
            <div className="editor-sidebar__add-row">
              <span className="editor-sidebar__add-prefix">§</span>
              <input
                className="editor-sidebar__add-input"
                type="text"
                value={newId}
                onChange={(e) => {
                  setNewId(e.target.value);
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
