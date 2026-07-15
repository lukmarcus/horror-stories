import React, { useState } from "react";

interface PersonRowProps {
  personId: string;
  personName: string;
  paragraphId: string;
  onDelete: (personId: string) => void;
}

export const PersonRow: React.FC<PersonRowProps> = ({
  personId,
  personName,
  paragraphId,
  onDelete,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="item-editor__row" style={{ alignItems: "center" }}>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <span
          className="item-editor__item-badge"
          style={{ minWidth: "auto", fontSize: "0.95rem" }}
        >
          {personName}
        </span>
        <span style={{ color: "#666", fontSize: "0.85rem" }}>→</span>
        <span
          style={{ color: "#aaa", fontSize: "0.9rem", fontFamily: "monospace" }}
        >
          §{paragraphId}
        </span>
      </div>

      {confirmDelete ? (
        <span className="item-editor__confirm">
          <span className="item-editor__confirm-text">Usunąć?</span>
          <button
            className="editor-btn editor-btn--danger editor-btn--sm"
            onClick={() => onDelete(personId)}
          >
            Tak
          </button>
          <button
            className="editor-btn editor-btn--sm"
            onClick={() => setConfirmDelete(false)}
          >
            Nie
          </button>
        </span>
      ) : (
        <button
          className="item-editor__remove"
          onClick={() => setConfirmDelete(true)}
          title="Usuń postać"
        >
          ✕
        </button>
      )}
    </div>
  );
};
