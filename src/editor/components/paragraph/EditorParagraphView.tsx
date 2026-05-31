import React, { useMemo, useState } from "react";
import { useEditor } from "../../context/useEditor";
import { ParagraphText } from "../../../components/text/ParagraphText/ParagraphText";
import { RichText } from "../../../components/text/RichText/RichText";
import { PagesPreview } from "./PagesPreview";
import { Button } from "../../../components/ui/Button";
import type { EditorChoice } from "../../context/editorTypes";
import { filterIds, sortParagraphIds } from "../../utils/editorUtils";
import { PagesEditor } from "./PagesEditor";
import { ChoiceTextInput } from "./ChoiceTextInput";
import { ChoiceRow } from "./ChoiceRow";
import { ChoiceAddRow } from "./ChoiceAddRow";
import { VariantEditor } from "./VariantEditor";
import "./EditorParagraphView.css";

interface EditorParagraphViewProps {
  paragraphId: string;
  onRemove: (id: string) => void;
  onNavigate: (id: string) => void;
}

// ── EditorParagraphView ───────────────────────────────────────────────────────

export const EditorParagraphView: React.FC<EditorParagraphViewProps> = ({
  paragraphId,
  onRemove,
  onNavigate,
}) => {
  const { state, dispatch } = useEditor();
  const scenarioParagraphs = state.scenario?.paragraphs;
  const scenarioImages = state.scenario?.images;
  const paragraph = scenarioParagraphs?.find((p) => p.id === paragraphId);

  const [focusedTargetId, setFocusedTargetId] = useState<string | null>(null);
  const [newVariantId, setNewVariantId] = useState("");
  const [focusedSelectorId, setFocusedSelectorId] = useState<string | null>(
    null,
  );
  const [confirmSwitchSimple, setConfirmSwitchSimple] = useState(false);
  const [confirmDeleteParagraph, setConfirmDeleteParagraph] = useState(false);

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

  if (!paragraph) return null;

  const isDeath = paragraphId === "100";
  const isVariantMode = !!paragraph.variants;
  const text = paragraph.text ?? "";
  const pages = paragraph.pages ?? null;
  const hasPages = pages !== null;

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

  return (
    <div className="editor-paragraph-view">
      {/* Header */}
      <div className="editor-paragraph-view__header">
        <div className="editor-paragraph-view__header-left">
          <h1 className="editor-paragraph-view__title">§{paragraphId}</h1>
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
          {/* ── TRYB PROSTY ── */}
          {!isVariantMode && (
            <>
              {hasPages ? (
                <>
                  <h2 className="editor-paragraph-view__label">Treść</h2>
                  <PagesEditor paragraphId={paragraphId} pages={pages} />
                </>
              ) : (
                <>
                  <label
                    className="editor-paragraph-view__label"
                    htmlFor={`paragraph-text-${paragraphId}`}
                  >
                    Treść{" "}
                    <span className="editor-paragraph-view__label-hint">
                      (stary format — tylko tekst)
                    </span>
                  </label>
                  <textarea
                    id={`paragraph-text-${paragraphId}`}
                    className="editor-paragraph-view__textarea"
                    value={text}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_PARAGRAPH_TEXT",
                        payload: { id: paragraphId, text: e.target.value },
                      })
                    }
                    placeholder="Wpisz treść paragrafu…"
                    rows={12}
                  />
                  <button
                    className="editor-paragraph-view__migrate-btn"
                    onClick={() =>
                      dispatch({
                        type: "CONVERT_TEXT_TO_PAGES",
                        payload: paragraphId,
                      })
                    }
                  >
                    Przekonwertuj na bloki
                  </button>
                </>
              )}

              <div className="editor-paragraph-view__choices">
                <h3 className="editor-paragraph-view__label">Wybory</h3>

                {(paragraph.choices ?? []).map((choice) => (
                  <ChoiceRow
                    key={choice.id}
                    choice={choice}
                    paragraphIds={availableIds}
                    focusedId={focusedTargetId}
                    setFocusedId={setFocusedTargetId}
                    onUpdate={handleUpdateChoice}
                    onRemove={(id) =>
                      dispatch({
                        type: "REMOVE_CHOICE",
                        payload: { paragraphId, choiceId: id },
                      })
                    }
                  />
                ))}

                <ChoiceAddRow
                  prefixLabel="§"
                  targetList={availableIds}
                  onAdd={(text, target) => {
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
                />
              </div>
            </>
          )}

          {/* ── TRYB WARIANTOWY ── */}
          {isVariantMode && (
            <>
              <h2 className="editor-paragraph-view__label">
                Treść wprowadzająca
              </h2>
              <PagesEditor
                paragraphId={paragraphId}
                pages={paragraph.pages ?? [[]]}
                singlePage
              />
              <h3 className="editor-paragraph-view__label">
                Selektor wariantów (→ poziome przyciski)
              </h3>
              {(paragraph.variantSelectors ?? []).map((choice) => (
                <div
                  key={choice.id}
                  className="editor-paragraph-view__choice-row"
                >
                  <ChoiceTextInput
                    value={choice.text}
                    onChange={(t) =>
                      dispatch({
                        type: "UPDATE_VARIANT_SELECTOR",
                        payload: {
                          paragraphId,
                          choice: { ...choice, text: t },
                        },
                      })
                    }
                    placeholder="Tekst przycisku"
                  />
                  <div className="editor-paragraph-view__choice-target-wrap">
                    <span className="editor-paragraph-view__choice-target-prefix editor-paragraph-view__choice-target-prefix--variant">
                      W
                    </span>
                    <input
                      className="editor-paragraph-view__choice-target"
                      type="text"
                      value={choice.nextVariantId ?? ""}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_VARIANT_SELECTOR",
                          payload: {
                            paragraphId,
                            choice: {
                              ...choice,
                              nextVariantId: e.target.value,
                            },
                          },
                        })
                      }
                      onFocus={() => setFocusedSelectorId(choice.id)}
                      onBlur={() => setFocusedSelectorId(null)}
                      placeholder="?"
                    />
                    {focusedSelectorId === choice.id &&
                      filterIds(choice.nextVariantId ?? "", variantIds).length >
                        0 && (
                        <ul className="editor-paragraph-view__choice-dropdown">
                          {filterIds(
                            choice.nextVariantId ?? "",
                            variantIds,
                          ).map((id) => (
                            <li
                              key={id}
                              className="editor-paragraph-view__choice-dropdown-item"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                dispatch({
                                  type: "UPDATE_VARIANT_SELECTOR",
                                  payload: {
                                    paragraphId,
                                    choice: { ...choice, nextVariantId: id },
                                  },
                                });
                              }}
                            >
                              W:{id}
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                  <button
                    className="editor-paragraph-view__choice-remove"
                    onClick={() =>
                      dispatch({
                        type: "REMOVE_VARIANT_SELECTOR",
                        payload: { paragraphId, choiceId: choice.id },
                      })
                    }
                    title="Usuń przycisk"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <ChoiceAddRow
                placeholder="Tekst nowego przycisku"
                prefixLabel="W"
                prefixIsVariant
                targetList={variantIds}
                requireTarget
                addButtonTitle="Dodaj przycisk selektora"
                onAdd={(text, target) => {
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
            </>
          )}
        </div>

        {/* Preview — oba tryby */}
        <div className="editor-paragraph-view__preview">
          <h2 className="editor-paragraph-view__label">Podgląd</h2>
          <div className="editor-paragraph-view__preview-content">
            {isVariantMode ? (
              <>
                <PagesPreview
                  pages={paragraph.pages ?? [[]]}
                  emptyMessage="Brak treści wprowadzającej"
                />
                {(paragraph.variantSelectors ?? []).length > 0 && (
                  <fieldset className="choices choices--horizontal">
                    <legend className="sr-only">Wybierz wariant</legend>
                    {(paragraph.variantSelectors ?? []).map((s) => (
                      <Button key={s.id} variant="primary" size="lg">
                        {s.text}
                      </Button>
                    ))}
                  </fieldset>
                )}
              </>
            ) : (
              <>
                {hasPages ? (
                  <PagesPreview pages={pages!} />
                ) : text ? (
                  text
                    .split("\n")
                    .map((line, i) => (
                      <ParagraphText
                        key={i}
                        text={line}
                        className="editor-paragraph-view__preview-paragraph"
                      />
                    ))
                ) : (
                  <p className="editor-paragraph-view__preview-empty">
                    Brak treści
                  </p>
                )}
                {(paragraph.choices ?? []).length > 0 && (
                  <fieldset className="choices choices--vertical">
                    <legend className="sr-only">Dostępne wybory</legend>
                    {(paragraph.choices ?? []).map((choice) => (
                      <Button
                        key={choice.id}
                        variant="primary"
                        size="lg"
                        onClick={() =>
                          choice.nextParagraphId &&
                          onNavigate(choice.nextParagraphId)
                        }
                        disabled={
                          !choice.nextParagraphId && !choice.nextVariantId
                        }
                        title={
                          choice.nextParagraphId
                            ? `Przejdź do §${choice.nextParagraphId}`
                            : choice.nextVariantId
                              ? `Wariant: ${choice.nextVariantId}`
                              : undefined
                        }
                      >
                        <RichText
                          content={[{ type: "text", text: choice.text }]}
                          images={scenarioImages}
                        />
                      </Button>
                    ))}
                  </fieldset>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Warianty — poza gridem, pełna szerokość */}
      {isVariantMode && (
        <div className="editor-paragraph-view__variants-section">
          <h2 className="editor-paragraph-view__label">Warianty</h2>

          {variantIds.length === 0 && (
            <p className="editor-paragraph-view__variants-empty">
              Brak wariantów — dodaj pierwszy poniżej.
            </p>
          )}

          {variantIds.map((vid) => (
            <VariantEditor
              key={vid}
              paragraphId={paragraphId}
              variantId={vid}
              variant={paragraph.variants![vid]}
              variantIds={variantIds}
              paragraphIds={availableIds}
            />
          ))}

          <div className="editor-paragraph-view__variant-add-footer">
            <h2 className="editor-paragraph-view__label">Nowy wariant</h2>
            <div className="editor-paragraph-view__variant-add-row">
              <input
                className="editor-paragraph-view__variant-add-input"
                type="text"
                value={newVariantId}
                onChange={(e) =>
                  setNewVariantId(
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newVariantId.trim()) {
                    dispatch({
                      type: "ADD_VARIANT",
                      payload: {
                        paragraphId,
                        variantId: newVariantId.trim(),
                      },
                    });
                    setNewVariantId("");
                  }
                }}
                placeholder="nazwa-nowego-wariantu"
              />
              <button
                className="editor-paragraph-view__variant-add-btn"
                onClick={() => {
                  if (!newVariantId.trim()) return;
                  dispatch({
                    type: "ADD_VARIANT",
                    payload: {
                      paragraphId,
                      variantId: newVariantId.trim(),
                    },
                  });
                  setNewVariantId("");
                }}
                disabled={!newVariantId.trim()}
              >
                + Dodaj wariant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
