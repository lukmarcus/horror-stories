import React from "react";
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

  const paragraphs = [...(state.scenario?.paragraphs ?? [])].sort((a, b) => {
    const na = parseInt(a.id, 10);
    const nb = parseInt(b.id, 10);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return a.id.localeCompare(b.id);
  });

  const handleAddParagraph = () => {
    const existing = new Set(state.scenario?.paragraphs.map((p) => p.id) ?? []);
    const raw = window.prompt("Numer nowego paragrafu:");
    if (raw === null) return;
    const id = raw.trim();
    if (!id) return;
    if (existing.has(id)) {
      window.alert(`Paragraf §${id} już istnieje.`);
      return;
    }
    dispatch({ type: "ADD_PARAGRAPH", payload: id });
    onSectionChange(id);
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Usunąć paragraf §${id}?`)) return;
    dispatch({ type: "REMOVE_PARAGRAPH", payload: id });
    if (activeSection === id) onSectionChange("meta");
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
              {p.id !== "100" && (
                <button
                  className="editor-sidebar__paragraph-btn editor-sidebar__paragraph-btn--remove"
                  onClick={(e) => handleRemove(p.id, e)}
                  title="Usuń paragraf"
                  aria-label="Usuń paragraf"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {state.scenario && (
            <button
              className="editor-sidebar__add-paragraph"
              onClick={handleAddParagraph}
            >
              + Dodaj §
            </button>
          )}
        </nav>
      </aside>
      <main className="editor-main">{children}</main>
    </div>
  );
};
