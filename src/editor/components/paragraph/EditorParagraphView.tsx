import React, { useMemo, useState } from "react";
import { useEditor } from "../../context/useEditor";
import type { EditorChoice } from "../../context/editorTypes";
import { sortParagraphIds } from "../../utils/editorUtils";
import { EditorPreview } from "./EditorPreview";
import { VariantsSection } from "./VariantsSection";
import { SimpleModeEditor } from "./SimpleModeEditor";
import { VariantModeEditor } from "./VariantModeEditor";
import "./EditorParagraphView.css";

interface EditorParagraphViewProps {
  paragraphId: string;
  onRemove: (id: string) => void;
  onNavigate: (id: string) => void;
  onNavigateToLetters?: () => void;
}

// ── EditorParagraphView ───────────────────────────────────────────────────────

export const EditorParagraphView: React.FC<EditorParagraphViewProps> = ({
  paragraphId,
  onRemove,
  onNavigate,
  onNavigateToLetters,
}) => {
  const { state, dispatch } = useEditor();
  const scenarioParagraphs = state.scenario?.paragraphs;
  const scenarioImages = state.scenario?.images;
  const paragraph = scenarioParagraphs?.find((p) => p.id === paragraphId);

  const [focusedTargetId, setFocusedTargetId] = useState<string | null>(null);
  const [confirmSwitchSimple, setConfirmSwitchSimple] = useState(false);
  const [confirmDeleteParagraph, setConfirmDeleteParagraph] = useState(false);
  const [newAlias, setNewAlias] = useState("");
  const [aliasError, setAliasError] = useState("");

  const availableIds = useMemo(
    () =>
      sortParagraphIds(
        (scenarioParagraphs ?? [])
          .map((p) => p.id)
          .filter((id) => id !== paragraphId),
      ),
    [scenarioParagraphs, paragraphId],
  );

  const variantIds = useMemo(
    () => Object.keys(paragraph?.variants ?? {}),
    [paragraph?.variants],
  );

  const incomingFrom = useMemo(
    () =>
      sortParagraphIds(
        (scenarioParagraphs ?? [])
          .filter(
            (p) =>
              p.id !== paragraphId &&
              (p.choices ?? []).some((c) => c.nextParagraphId === paragraphId),
          )
          .map((p) => p.id),
      ),
    [scenarioParagraphs, paragraphId],
  );

  const paragraphLetter = useMemo(
    () =>
      state.scenario?.letters?.find((l) => l.paragraphId === paragraphId)?.id,
    [state.scenario?.letters, paragraphId],
  );

  const usedIds = useMemo(() => {
    const set = new Set<string>();
    for (const p of scenarioParagraphs ?? []) {
      set.add(p.id);
      for (const a of p.aliases ?? []) set.add(a);
    }
    return set;
  }, [scenarioParagraphs]);

  if (!paragraph) return null;

  const isDeath = paragraphId === "100";
  const isVariantMode = !!paragraph.variants;

  // ── Mode toggle ──

  const handleSwitchToVariant = () => {
    dispatch({ type: "ENABLE_VARIANT_MODE", payload: paragraphId });
  };

  const handleSwitchToSimple = () => {
    if (variantIds.length > 0) {
      setConfirmSwitchSimple(true);
      return;
    }
    dispatch({ type: "DISABLE_VARIANT_MODE", payload: paragraphId });
  };

  // ── Simple mode choice handlers ──

  const handleUpdateChoice = (choice: EditorChoice) => {
    if ((choice.nextParagraphId ?? "").trim() === paragraphId) return;
    dispatch({ type: "UPDATE_CHOICE", payload: { paragraphId, choice } });
    const target = (choice.nextParagraphId ?? "").trim();
    if (target && !availableIds.includes(target) && target !== paragraphId) {
      dispatch({ type: "ADD_PARAGRAPH_SILENT", payload: target });
    }
  };

  // ── Variant selector handlers ──

  const handleAddAlias = () => {
    const val = newAlias.trim();
    if (!val) return;
    if (val === paragraphId) {
      setAliasError("To już jest główny ID");
      return;
    }
    if ((paragraph.aliases ?? []).includes(val)) {
      setAliasError("Już istnieje");
      return;
    }
    if (usedIds.has(val)) {
      setAliasError("Zajęty przez inny paragraf");
      return;
    }
    dispatch({ type: "ADD_ALIAS", payload: { paragraphId, alias: val } });
    setNewAlias("");
    setAliasError("");
  };

  return (
    <div className="editor-paragraph-view">
      {/* Header */}
      <div className="editor-paragraph-view__header">
        <div className="editor-paragraph-view__header-left">
          <div className="editor-paragraph-view__title-row">
            <h1 className="editor-paragraph-view__title">§{paragraphId}</h1>
            <div className="editor-paragraph-view__aliases">
              {(paragraph.aliases ?? []).map((alias) => (
                <span
                  key={alias}
                  className="editor-paragraph-view__alias-badge"
                >
                  §{alias}
                  <button
                    className="editor-paragraph-view__alias-remove"
                    onClick={() =>
                      dispatch({
                        type: "REMOVE_ALIAS",
                        payload: { paragraphId, alias },
                      })
                    }
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
                onClick={onNavigateToLetters}
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
              onClick={isVariantMode ? handleSwitchToSimple : undefined}
              disabled={!isVariantMode}
            >
              Prosty
            </button>
            <button
              className={`editor-paragraph-view__mode-btn${isVariantMode ? " editor-paragraph-view__mode-btn--active" : ""}`}
              onClick={!isVariantMode ? handleSwitchToVariant : undefined}
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
                  dispatch({
                    type: "DISABLE_VARIANT_MODE",
                    payload: paragraphId,
                  });
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

      <div className="editor-paragraph-view__columns">
        <div className="editor-paragraph-view__editor">
          {!isVariantMode && (
            <SimpleModeEditor
              paragraphId={paragraphId}
              paragraph={paragraph}
              availableIds={availableIds}
              focusedTargetId={focusedTargetId}
              setFocusedTargetId={setFocusedTargetId}
              onUpdateChoice={handleUpdateChoice}
              onRemoveChoice={(id) =>
                dispatch({
                  type: "REMOVE_CHOICE",
                  payload: { paragraphId, choiceId: id },
                })
              }
              onAddChoice={(text, target) => {
                if (target === paragraphId) return;
                const choice: EditorChoice = {
                  id: crypto.randomUUID(),
                  text,
                  nextParagraphId: target,
                };
                dispatch({
                  type: "ADD_CHOICE",
                  payload: { paragraphId, choice },
                });
                if (
                  target &&
                  !availableIds.includes(target) &&
                  target !== paragraphId
                ) {
                  dispatch({
                    type: "ADD_PARAGRAPH_SILENT",
                    payload: target,
                  });
                }
              }}
              onSetText={(text) =>
                dispatch({
                  type: "SET_PARAGRAPH_TEXT",
                  payload: { id: paragraphId, text },
                })
              }
              onConvertToPages={() =>
                dispatch({
                  type: "CONVERT_TEXT_TO_PAGES",
                  payload: paragraphId,
                })
              }
            />
          )}

          {isVariantMode && (
            <VariantModeEditor
              paragraphId={paragraphId}
              paragraph={paragraph}
              variantIds={variantIds}
              onUpdateSelector={(choice) =>
                dispatch({
                  type: "UPDATE_VARIANT_SELECTOR",
                  payload: { paragraphId, choice },
                })
              }
              onRemoveSelector={(choiceId) =>
                dispatch({
                  type: "REMOVE_VARIANT_SELECTOR",
                  payload: { paragraphId, choiceId },
                })
              }
              onAddSelector={(text, target) => {
                const choice: EditorChoice = {
                  id: crypto.randomUUID(),
                  text,
                  nextVariantId: target,
                };
                dispatch({
                  type: "ADD_VARIANT_SELECTOR",
                  payload: { paragraphId, choice },
                });
              }}
            />
          )}
        </div>

        {/* Preview — oba tryby */}
        <EditorPreview
          paragraph={paragraph}
          isVariantMode={isVariantMode}
          scenarioImages={scenarioImages}
          onNavigate={onNavigate}
        />
      </div>

      {/* Warianty — poza gridem, pełna szerokość */}
      {isVariantMode && (
        <VariantsSection
          paragraphId={paragraphId}
          paragraph={paragraph}
          variantIds={variantIds}
          availableIds={availableIds}
          onAddVariant={(variantId) =>
            dispatch({
              type: "ADD_VARIANT",
              payload: { paragraphId, variantId },
            })
          }
        />
      )}
    </div>
  );
};
