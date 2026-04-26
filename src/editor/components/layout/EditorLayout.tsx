import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./EditorLayout.css";

interface EditorLayoutProps {
  children: React.ReactNode;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({ children }) => {
  const location = useLocation();

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
          <Link
            to="/editor"
            className={`editor-sidebar__link ${location.pathname === "/editor" ? "editor-sidebar__link--active" : ""}`}
          >
            Scenariusz
          </Link>
        </nav>
      </aside>
      <main className="editor-main">{children}</main>
    </div>
  );
};
