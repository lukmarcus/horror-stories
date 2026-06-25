import React, { useState } from "react";
import type { EditorParagraph } from "../../context/editorTypes";
import "./EditorParagraphView.css";

interface ParagraphHeaderProps {
  paragraphId: string;
  paragraph: EditorParagraph;
  isVariantMode: boolean;
  isDeath: boolean;
  incomingFrom: string[];
  paragraphLetter: string | null;
  variantIds: string[]; // List of variant IDs
  onNavigate: (id: string) => void;
  onNavigateToLetters?: () => void;
  onRemove: (id: string) => void;
  onAddAlias: (alias: string) => string | null; // Returns error message or null on success
  onRemoveAlias: (alias: string) => void;
  onSwitchToSimple: () => void;
  onSwitchToVariant: () => void;
}

export const ParagraphHeader: React.FC<ParagraphHeaderProps> = ({
  paragraphId,
  paragraph,
  isVariantMode,
  isDeath,
  incomingFrom,
  paragraphLetter,
  variantIds,
  onNavigate,
  onNavigateToLetters,
  onRemove,
  onAddAlias,
  onRemoveAlias,
  onSwitchToSimple,
  onSwitchToVariant,
}) => {
  const [newAlias, setNewAlias] = useState("");
  const [aliasError, setAliasError] = useState("");
  const [confirmSwitchSimple, setConfirmSwitchSimple] = useState(false);
  const [confirmDeleteParagraph, setConfirmDeleteParagraph] = useState(false);

  const handleAddAlias = () => {
    const trimmed = newAlias.trim();
    if (!trimmed) return;

    if (!/^[a-z0-9-]+$/.test(trimmed)) {
      setAliasError("Tylko małe litery, cyfry i myślniki");
      return;
    }

    const error = onAddAlias(trimmed);
    if (error) {
      setAliasError(error);
      return;
    }

    setNewAlias("");
    setAliasError("");
  };

  return (
    <div className="editor-paragraph-view__header">
      <div className="editor-paragraph-view__header-left">
        <div className="editor-paragraph-view__title-row">
          <h1 className="editor-paragraph-view__title">§{paragraphId}</h1>
          <div className="editor-paragraph-view__aliases">
            {(paragraph.aliases ?? []).map((alias) => (
              <span key={alias} className="editor-paragraph-view__alias-badge">
                §{alias}
                <button
                  className="editor-paragraph-view__alias-remove"
                  onClick={() => onRemoveAlias(alias)}
                  title={`Usuń alias §${alias}`}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              className="editor-paragraph-view__alias-input"
              type="text"
              placeholder="+ alias"
              value={newAlias}
              onChange={(e) => {
                setNewAlias(e.target.value);
                setAliasError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddAlias();
              }}
            />
            {aliasError && (
              <span className="editor-paragraph-view__alias-error">
                {aliasError}
              </span>
            )}
          </div>
        </div>
        <div className="editor-paragraph-view__incoming">
          <span className="editor-paragraph-view__incoming-label">
            Prowadzi tutaj:
          </span>
          {incomingFrom.length > 0 ? (
            incomingFrom.map((id) => (
              <button
                key={id}
                className="editor-paragraph-view__incoming-tag"
                onClick={() => onNavigate(id)}
                title={`Przejdź do §${id}`}
              >
                §{id}
              </button>
            ))
          ) : (
            <span className="editor-paragraph-view__incoming-empty">
              brak połączeń
            </span>
          )}
        </div>
        {paragraphLetter && (
          <div className="editor-paragraph-view__incoming">
            <span className="editor-paragraph-view__incoming-label">
              Dostępna przez literę:
            </span>
            <button
              className="editor-paragraph-view__incoming-tag editor-paragraph-view__incoming-tag--letter"
              onClick={onNavigateToLetters ? onNavigateToLetters : undefined}
              disabled={!onNavigateToLetters}
              title="Przejdź do żetonów alfabetu"
            >
              {paragraphLetter}
            </button>
          </div>
        )}
      </div>
      <div className="editor-paragraph-view__header-right">
        <div className="editor-paragraph-view__mode-toggle">
          <button
            className={`editor-paragraph-view__mode-btn${!isVariantMode ? " editor-paragraph-view__mode-btn--active" : ""}`}
            onClick={
              isVariantMode
                ? () => {
                    if (variantIds.length > 0) {
                      setConfirmSwitchSimple(true);
                    } else {
                      onSwitchToSimple();
                    }
                  }
                : undefined
            }
            disabled={!isVariantMode}
          >
            Prosty
          </button>
          <button
            className={`editor-paragraph-view__mode-btn${isVariantMode ? " editor-paragraph-view__mode-btn--active" : ""}`}
            onClick={!isVariantMode ? onSwitchToVariant : undefined}
            disabled={isVariantMode}
          >
            Wariantowy
          </button>
        </div>
        {confirmSwitchSimple && (
          <span className="editor-paragraph-view__inline-confirm">
            <span>Usunąć wszystkie warianty?</span>
            <button
              className="editor-paragraph-view__inline-confirm-yes"
              onClick={() => {
                setConfirmSwitchSimple(false);
                onSwitchToSimple();
              }}
            >
              Tak
            </button>
            <button
              className="editor-paragraph-view__inline-confirm-no"
              onClick={() => setConfirmSwitchSimple(false)}
            >
              Anuluj
            </button>
          </span>
        )}
        {confirmDeleteParagraph ? (
          <span className="editor-paragraph-view__inline-confirm">
            <span>Usunąć §{paragraphId}?</span>
            <button
              className="editor-paragraph-view__inline-confirm-yes"
              onClick={() => {
                setConfirmDeleteParagraph(false);
                onRemove(paragraphId);
              }}
            >
              Tak
            </button>
            <button
              className="editor-paragraph-view__inline-confirm-no"
              onClick={() => setConfirmDeleteParagraph(false)}
            >
              Anuluj
            </button>
          </span>
        ) : (
          <button
            className="editor-paragraph-view__remove-btn"
            onClick={
              isDeath ? undefined : () => setConfirmDeleteParagraph(true)
            }
            disabled={isDeath}
            title={
              isDeath
                ? "Nie można usunąć paragrafu §100"
                : `Usuń §${paragraphId}`
            }
          >
            {isDeath ? "Nie można usunąć" : "Usuń paragraf"}
          </button>
        )}
      </div>
    </div>
  );
};
