import React, { useState } from "react";
import { filterIds } from "../../utils/editorUtils";

interface PersonRowProps {
  personId: string;
  personName: string;
  paragraphId: string;
  paragraphIds: string[];
  paragraphUsedBy: Record<string, string>;
  onUpdate: (personId: string, newParagraphId: string) => void;
  onDelete: (personId: string) => void;
}

export const PersonRow: React.FC<PersonRowProps> = ({
  personId,
  personName,
  paragraphId,
  paragraphIds,
  paragraphUsedBy,
  onUpdate,
  onDelete,
}) => {
  const [editingValue, setEditingValue] = useState<string | undefined>(
    undefined,
  );
  const [editError, setEditError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const editVal = editingValue ?? paragraphId;
  const availableParasForEdit = paragraphIds.filter(
    (id) => !paragraphUsedBy[id] || id === paragraphId,
  );
  const editOptions = filterIds(editingValue ?? "", availableParasForEdit);

  const clearEditState = () => {
    setEditingValue(undefined);
    setEditError(null);
  };

  const handleEditCommit = () => {
    if (editingValue === undefined) return;
    const paraId = editingValue.trim();
    if (!paraId || paraId === paragraphId) {
      clearEditState();
      return;
    }
    if (paragraphUsedBy[paraId] && paragraphUsedBy[paraId] !== personId) {
      const otherPerson = paragraphUsedBy[paraId];
      setEditError(
        `Paragraf §${paraId} jest już przypisany do postaci ${otherPerson}.`,
      );
      return;
    }
    onUpdate(personId, paraId);
    clearEditState();
  };

  return (
    <div className="letters-editor__row">
      <span className="letters-editor__letter-badge">{personName}</span>

      <div className="letters-editor__edit-para">
        <div
          className={`letters-editor__para-wrap${editError ? " letters-editor__para-wrap--error" : ""}`}
        >
          <span className="letters-editor__para-prefix">§</span>
          <input
            className="letters-editor__para-target"
            type="text"
            value={editVal}
            onChange={(e) => {
              setEditingValue(e.target.value);
              setHighlighted(null);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              setHighlighted(null);
              handleEditCommit();
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlighted((i) =>
                  i === null ? 0 : (i + 1) % editOptions.length,
                );
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlighted((i) =>
                  i === null
                    ? editOptions.length - 1
                    : (i - 1 + editOptions.length) % editOptions.length,
                );
              } else if (e.key === "Enter") {
                if (highlighted !== null && editOptions[highlighted]) {
                  setEditingValue(editOptions[highlighted]);
                  setHighlighted(null);
                } else {
                  handleEditCommit();
                }
              } else if (e.key === "Escape") {
                clearEditState();
              }
            }}
          />
          {focused && editOptions.length > 0 && (
            <ul className="letters-editor__para-dropdown" role="listbox">
              {editOptions.map((pid, index) => (
                <li
                  key={pid}
                  role="option"
                  className={`letters-editor__para-dropdown-item${highlighted === index ? " letters-editor__para-dropdown-item--highlighted" : ""}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setEditingValue(pid);
                    setFocused(false);
                  }}
                >
                  §{pid}
                </li>
              ))}
            </ul>
          )}
        </div>
        {editError && (
          <div className="letters-editor__row-error">{editError}</div>
        )}
      </div>

      {confirmDelete ? (
        <span className="letters-editor__confirm">
          <span className="letters-editor__confirm-text">Usunąć?</span>
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
          className="letters-editor__remove"
          onClick={() => setConfirmDelete(true)}
          title="Usuń przypisanie"
        >
          ✕
        </button>
      )}
    </div>
  );
};
