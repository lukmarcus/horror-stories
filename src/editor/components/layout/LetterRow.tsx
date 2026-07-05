import React, { useState } from "react";
import { filterIds } from "../../utils/editorUtils";

interface LetterRowProps {
  letterId: string;
  paragraphId: string;
  paragraphIds: string[];
  paragraphUsedBy: Record<string, string>;
  onUpdate: (letterId: string, newParagraphId: string) => void;
  onDelete: (letterId: string) => void;
}

export const LetterRow: React.FC<LetterRowProps> = ({
  letterId,
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
    if (paragraphUsedBy[paraId] && paragraphUsedBy[paraId] !== letterId) {
      setEditError(
        `Paragraf §${paraId} jest już przypisany do litery ${paragraphUsedBy[paraId]}.`,
      );
      return;
    }
    onUpdate(letterId, paraId);
    clearEditState();
  };

  return (
    <div className="item-editor__row">
      <span className="item-editor__item-badge">{letterId}</span>

      <div className="item-editor__edit-para">
        <div
          className={`item-editor__para-wrap${editError ? " item-editor__para-wrap--error" : ""}`}
        >
          <span className="item-editor__para-prefix">§</span>
          <input
            className="item-editor__para-target"
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
            <ul className="item-editor__para-dropdown" role="listbox">
              {editOptions.map((pid, index) => (
                <li
                  key={pid}
                  role="option"
                  className={`item-editor__para-dropdown-item${highlighted === index ? " item-editor__para-dropdown-item--highlighted" : ""}`}
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
        {editError && <div className="item-editor__row-error">{editError}</div>}
      </div>

      {confirmDelete ? (
        <span className="item-editor__confirm">
          <span className="item-editor__confirm-text">Usunąć?</span>
          <button
            className="editor-btn editor-btn--danger editor-btn--sm"
            onClick={() => onDelete(letterId)}
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
          title="Usuń przypisanie"
        >
          ✕
        </button>
      )}
    </div>
  );
};
