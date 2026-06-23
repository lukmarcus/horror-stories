import React, { useState } from "react";

interface VariantHeaderProps {
  variantId: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onRename: (oldId: string, newId: string) => void;
  onDelete: () => void;
}

export const VariantHeader: React.FC<VariantHeaderProps> = ({
  variantId,
  collapsed,
  onToggleCollapse,
  onRename,
  onDelete,
}) => {
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(variantId);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleRename = () => {
    const newName = renameValue.trim();
    if (!newName || newName === variantId) {
      setRenaming(false);
      return;
    }
    onRename(variantId, newName);
    setRenaming(false);
  };

  return (
    <div className="editor-paragraph-view__variant-header">
      <button
        className="editor-paragraph-view__variant-toggle"
        onClick={onToggleCollapse}
        title={collapsed ? "Rozwiń" : "Zwiń"}
      >
        {collapsed ? "▶" : "▼"}
      </button>
      {renaming ? (
        <>
          <input
            className="editor-paragraph-view__variant-rename-input"
            value={renameValue}
            autoFocus
            onChange={(e) =>
              setRenameValue(
                e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();
              if (e.key === "Escape") {
                setRenaming(false);
                setRenameValue(variantId);
              }
            }}
          />
          <button
            className="editor-paragraph-view__variant-rename-save"
            onClick={handleRename}
            title="Zapisz nazwę"
          >
            ✓
          </button>
          <button
            className="editor-paragraph-view__variant-rename-cancel"
            onClick={() => {
              setRenaming(false);
              setRenameValue(variantId);
            }}
            title="Anuluj"
          >
            ✕
          </button>
        </>
      ) : (
        <>
          <span className="editor-paragraph-view__variant-name">
            W: <strong>{variantId}</strong>
          </span>
          <button
            className="editor-paragraph-view__variant-rename-btn"
            onClick={() => setRenaming(true)}
            title="Zmień nazwę wariantu"
          >
            ✎
          </button>
          {confirmDelete ? (
            <span className="editor-paragraph-view__inline-confirm">
              <span>Usunąć?</span>
              <button
                className="editor-paragraph-view__inline-confirm-yes"
                onClick={() => {
                  setConfirmDelete(false);
                  onDelete();
                }}
              >
                Tak
              </button>
              <button
                className="editor-paragraph-view__inline-confirm-no"
                onClick={() => setConfirmDelete(false)}
              >
                Anuluj
              </button>
            </span>
          ) : (
            <button
              className="editor-paragraph-view__variant-remove"
              onClick={() => setConfirmDelete(true)}
              title={`Usuń wariant ${variantId}`}
            >
              ✕
            </button>
          )}
        </>
      )}
    </div>
  );
};
