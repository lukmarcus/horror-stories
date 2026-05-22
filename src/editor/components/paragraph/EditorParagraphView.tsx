import React, { useState } from "react";
import { useEditor } from "../../context/useEditor";
import { ParagraphText } from "../../../components/text/ParagraphText/ParagraphText";
import { RichText } from "../../../components/text/RichText/RichText";
import type { EditorChoice, EditorVariant } from "../../context/editorTypes";
import { PagesEditor } from "./PagesEditor";
import { ChoiceTextInput } from "./ChoiceTextInput";
import "./EditorParagraphView.css";

interface EditorParagraphViewProps {
  paragraphId: string;
  onRemove: (id: string) => void;
  onNavigate: (id: string) => void;
}

// ── ChoiceRow ─────────────────────────────────────────────────────────────────

interface ChoiceRowProps {
  choice: EditorChoice;
  paragraphIds: string[];
  variantIds?: string[];
  focusedId: string | null;
  setFocusedId: (id: string | null) => void;
  onUpdate: (choice: EditorChoice) => void;
  onRemove: (id: string) => void;
}

const ChoiceRow: React.FC<ChoiceRowProps> = ({
  choice,
  paragraphIds,
  variantIds,
  focusedId,
  setFocusedId,
  onUpdate,
  onRemove,
}) => {
  const isVariantTarget = !!choice.nextVariantId;
  const targetValue = isVariantTarget
    ? (choice.nextVariantId ?? "")
    : (choice.nextParagraphId ?? "");

  const filteredOptions = (value: string) => {
    const v = value.trim();
    const list = isVariantTarget ? (variantIds ?? []) : paragraphIds;
    if (!v) return list;
    return list.filter((id) => id.includes(v));
  };

  const handleTargetChange = (val: string) => {
    if (isVariantTarget) {
      onUpdate({ ...choice, nextVariantId: val, nextParagraphId: undefined });
    } else {
      onUpdate({ ...choice, nextParagraphId: val, nextVariantId: undefined });
    }
  };

  const toggleTargetType = () => {
    if (isVariantTarget) {
      onUpdate({ ...choice, nextParagraphId: "", nextVariantId: undefined });
    } else {
      onUpdate({ ...choice, nextVariantId: "", nextParagraphId: undefined });
    }
  };

  const dropdownKey = `${choice.id}-target`;
  const options = filteredOptions(targetValue);

  return (
    <div className="editor-paragraph-view__choice-row">
      <ChoiceTextInput
        value={choice.text}
        onChange={(text) => onUpdate({ ...choice, text })}
        placeholder="Tekst wyboru"
      />
      <div className="editor-paragraph-view__choice-target-wrap">
        {variantIds ? (
          <button
            className={`editor-paragraph-view__choice-type-btn${isVariantTarget ? " editor-paragraph-view__choice-type-btn--variant" : ""}`}
            onClick={toggleTargetType}
            title={
              isVariantTarget
                ? "Cel: wariant (kliknij → paragraf)"
                : "Cel: paragraf (kliknij → wariant)"
            }
          >
            {isVariantTarget ? "W" : "§"}
          </button>
        ) : (
          <span className="editor-paragraph-view__choice-target-prefix">§</span>
        )}
        <input
          className="editor-paragraph-view__choice-target"
          type="text"
          value={targetValue}
          onChange={(e) => handleTargetChange(e.target.value)}
          onFocus={() => setFocusedId(dropdownKey)}
          onBlur={() => setFocusedId(null)}
          placeholder="?"
        />
        {focusedId === dropdownKey && options.length > 0 && (
          <ul className="editor-paragraph-view__choice-dropdown">
            {options.map((id) => (
              <li
                key={id}
                className="editor-paragraph-view__choice-dropdown-item"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleTargetChange(id);
                }}
              >
                {isVariantTarget ? `W:${id}` : `§${id}`}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        className="editor-paragraph-view__choice-remove"
        onClick={() => onRemove(choice.id)}
        title="Usuń wybór"
      >
        ✕
      </button>
    </div>
  );
};

// ── VariantEditor ─────────────────────────────────────────────────────────────

interface VariantEditorProps {
  paragraphId: string;
  variantId: string;
  variant: EditorVariant;
  variantIds: string[];
  paragraphIds: string[];
}

const VariantEditor: React.FC<VariantEditorProps> = ({
  paragraphId,
  variantId,
  variant,
  variantIds,
  paragraphIds,
}) => {
  const { dispatch } = useEditor();
  const [newChoiceText, setNewChoiceText] = useState("");
  const [newChoiceTarget, setNewChoiceTarget] = useState("");
  const [newChoiceIsVariant, setNewChoiceIsVariant] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const isHorizontal = !!variant.areChoicesHorizontal;

  const handleAddChoice = () => {
    const text = newChoiceText.trim();
    if (!text) return;
    const choice: EditorChoice = {
      id: crypto.randomUUID(),
      text,
      ...(newChoiceIsVariant
        ? { nextVariantId: newChoiceTarget.trim() }
        : { nextParagraphId: newChoiceTarget.trim() }),
    };
    dispatch({
      type: "ADD_VARIANT_CHOICE",
      payload: { paragraphId, variantId, choice },
    });
    setNewChoiceText("");
    setNewChoiceTarget("");
  };

  const filteredList = (val: string, list: string[]) => {
    const v = val.trim();
    return v ? list.filter((id) => id.includes(v)) : list;
  };

  return (
    <div className="editor-paragraph-view__variant">
      <div className="editor-paragraph-view__variant-header">
        <button
          className="editor-paragraph-view__variant-toggle"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Rozwiń" : "Zwiń"}
        >
          {collapsed ? "▶" : "▼"}
        </button>
        <span className="editor-paragraph-view__variant-name">
          W: <strong>{variantId}</strong>
        </span>
        <button
          className={`editor-paragraph-view__variant-layout-btn${isHorizontal ? " editor-paragraph-view__variant-layout-btn--active" : ""}`}
          onClick={() =>
            dispatch({
              type: "SET_VARIANT_HORIZONTAL",
              payload: { paragraphId, variantId, value: !isHorizontal },
            })
          }
          title={
            isHorizontal
              ? "Pionowe wybory (kliknij)"
              : "Poziome wybory (kliknij)"
          }
        >
          {isHorizontal ? "→ Poziome" : "↓ Pionowe"}
        </button>
        <button
          className="editor-paragraph-view__variant-remove"
          onClick={() => {
            if (window.confirm(`Usunąć wariant "${variantId}"?`)) {
              dispatch({
                type: "REMOVE_VARIANT",
                payload: { paragraphId, variantId },
              });
            }
          }}
          title={`Usuń wariant ${variantId}`}
        >
          ✕
        </button>
      </div>

      {!collapsed && (
        <div className="editor-paragraph-view__variant-body">
          <span className="editor-paragraph-view__label">Treść wariantu</span>
          <PagesEditor
            paragraphId={paragraphId}
            pages={variant.pages ?? [[]]}
            onPagesChange={(pages) =>
              dispatch({
                type: "SET_VARIANT_PAGES",
                payload: { paragraphId, variantId, pages },
              })
            }
          />

          <span className="editor-paragraph-view__label">
            Wybory wariantu {isHorizontal ? "(→ poziome)" : "(↓ pionowe)"}
          </span>

          {(variant.choices ?? []).map((choice) => (
            <ChoiceRow
              key={choice.id}
              choice={choice}
              paragraphIds={paragraphIds}
              variantIds={isHorizontal ? variantIds : undefined}
              focusedId={focusedId}
              setFocusedId={setFocusedId}
              onUpdate={(c) =>
                dispatch({
                  type: "UPDATE_VARIANT_CHOICE",
                  payload: { paragraphId, variantId, choice: c },
                })
              }
              onRemove={(id) =>
                dispatch({
                  type: "REMOVE_VARIANT_CHOICE",
                  payload: { paragraphId, variantId, choiceId: id },
                })
              }
            />
          ))}

          <div className="editor-paragraph-view__choice-add">
            <ChoiceTextInput
              value={newChoiceText}
              onChange={setNewChoiceText}
              onKeyDown={(e) => e.key === "Enter" && handleAddChoice()}
              placeholder="Tekst nowego wyboru"
            />
            <div className="editor-paragraph-view__choice-target-wrap">
              {isHorizontal ? (
                <button
                  className={`editor-paragraph-view__choice-type-btn${newChoiceIsVariant ? " editor-paragraph-view__choice-type-btn--variant" : ""}`}
                  onClick={() => setNewChoiceIsVariant((v) => !v)}
                  title={newChoiceIsVariant ? "Cel: wariant" : "Cel: paragraf"}
                >
                  {newChoiceIsVariant ? "W" : "§"}
                </button>
              ) : (
                <span className="editor-paragraph-view__choice-target-prefix">
                  §
                </span>
              )}
              <input
                className="editor-paragraph-view__choice-target"
                type="text"
                value={newChoiceTarget}
                onChange={(e) => setNewChoiceTarget(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddChoice()}
                onFocus={() => setFocusedId("__new-vc__")}
                onBlur={() => setFocusedId(null)}
                placeholder="?"
              />
              {focusedId === "__new-vc__" &&
                (() => {
                  const list = newChoiceIsVariant ? variantIds : paragraphIds;
                  const opts = filteredList(newChoiceTarget, list);
                  return opts.length > 0 ? (
                    <ul className="editor-paragraph-view__choice-dropdown">
                      {opts.map((id) => (
                        <li
                          key={id}
                          className="editor-paragraph-view__choice-dropdown-item"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setNewChoiceTarget(id);
                          }}
                        >
                          {newChoiceIsVariant ? `W:${id}` : `§${id}`}
                        </li>
                      ))}
                    </ul>
                  ) : null;
                })()}
            </div>
            <button
              className="editor-paragraph-view__choice-add-btn"
              onClick={handleAddChoice}
              disabled={!newChoiceText.trim()}
              title="Dodaj wybór"
            >
              + Dodaj
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── EditorParagraphView ───────────────────────────────────────────────────────

export const EditorParagraphView: React.FC<EditorParagraphViewProps> = ({
  paragraphId,
  onRemove,
  onNavigate,
}) => {
  const { state, dispatch } = useEditor();
  const paragraph = state.scenario?.paragraphs.find(
    (p) => p.id === paragraphId,
  );

  const [newChoiceText, setNewChoiceText] = useState("");
  const [newChoiceTarget, setNewChoiceTarget] = useState("");
  const [focusedTargetId, setFocusedTargetId] = useState<string | null>(null);
  const [newVariantId, setNewVariantId] = useState("");
  const [newSelectorText, setNewSelectorText] = useState("");
  const [newSelectorTarget, setNewSelectorTarget] = useState("");
  const [focusedSelectorId, setFocusedSelectorId] = useState<string | null>(
    null,
  );

  if (!paragraph) return null;

  const isDeath = paragraphId === "100";
  const isVariantMode = !!paragraph.variants;
  const text = paragraph.text ?? "";
  const pages = paragraph.pages ?? null;
  const hasPages = pages !== null;

  const availableIds = (state.scenario?.paragraphs ?? [])
    .map((p) => p.id)
    .filter((id) => id !== paragraphId)
    .sort((a, b) => {
      const na = parseInt(a, 10);
      const nb = parseInt(b, 10);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return a.localeCompare(b);
    });

  const variantIds = Object.keys(paragraph.variants ?? {});

  const incomingFrom = (state.scenario?.paragraphs ?? [])
    .filter(
      (p) =>
        p.id !== paragraphId &&
        (p.choices ?? []).some((c) => c.nextParagraphId === paragraphId),
    )
    .map((p) => p.id)
    .sort((a, b) => {
      const na = parseInt(a, 10);
      const nb = parseInt(b, 10);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return a.localeCompare(b);
    });

  // ── Mode toggle ──

  const handleSwitchToVariant = () => {
    dispatch({
      type: "LOAD_SCENARIO",
      payload: {
        ...state.scenario!,
        paragraphs: state.scenario!.paragraphs.map((p) =>
          p.id === paragraphId
            ? { ...p, variants: {}, variantSelectors: [], choices: undefined }
            : p,
        ),
      },
    });
  };

  const handleSwitchToSimple = () => {
    if (
      variantIds.length > 0 &&
      !window.confirm(
        "Przełączyć na tryb prosty? Wszystkie warianty zostaną usunięte.",
      )
    )
      return;
    dispatch({
      type: "LOAD_SCENARIO",
      payload: {
        ...state.scenario!,
        paragraphs: state.scenario!.paragraphs.map((p) =>
          p.id === paragraphId
            ? { ...p, variants: undefined, variantSelectors: undefined }
            : p,
        ),
      },
    });
  };

  // ── Simple mode choice handlers ──

  const handleAddChoice = () => {
    const t = newChoiceText.trim();
    const target = newChoiceTarget.trim();
    if (!t) return;
    if (target === paragraphId) return;
    const choice: EditorChoice = {
      id: crypto.randomUUID(),
      text: t,
      nextParagraphId: target,
    };
    dispatch({ type: "ADD_CHOICE", payload: { paragraphId, choice } });
    if (target && !availableIds.includes(target) && target !== paragraphId) {
      dispatch({ type: "ADD_PARAGRAPH_SILENT", payload: target });
    }
    setNewChoiceText("");
    setNewChoiceTarget("");
  };

  const handleUpdateChoice = (choice: EditorChoice) => {
    if ((choice.nextParagraphId ?? "").trim() === paragraphId) return;
    dispatch({ type: "UPDATE_CHOICE", payload: { paragraphId, choice } });
    const target = (choice.nextParagraphId ?? "").trim();
    if (target && !availableIds.includes(target) && target !== paragraphId) {
      dispatch({ type: "ADD_PARAGRAPH_SILENT", payload: target });
    }
  };

  // ── Variant selector handlers ──

  const handleAddSelector = () => {
    const t = newSelectorText.trim();
    const target = newSelectorTarget.trim();
    if (!t) return;
    const choice: EditorChoice = {
      id: crypto.randomUUID(),
      text: t,
      nextVariantId: target,
    };
    dispatch({
      type: "ADD_VARIANT_SELECTOR",
      payload: { paragraphId, choice },
    });
    setNewSelectorText("");
    setNewSelectorTarget("");
  };

  const filteredIds = (value: string) => {
    const v = value.trim();
    if (!v) return availableIds;
    return availableIds.filter((id) => id.includes(v));
  };

  const filteredVariantIds = (value: string) => {
    const v = value.trim();
    if (!v) return variantIds;
    return variantIds.filter((id) => id.includes(v));
  };

  return (
    <div className="editor-paragraph-view">
      {/* Header */}
      <div className="editor-paragraph-view__header">
        <div className="editor-paragraph-view__header-left">
          <h2 className="editor-paragraph-view__title">§{paragraphId}</h2>
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
          <button
            className="editor-paragraph-view__remove-btn"
            onClick={
              isDeath
                ? undefined
                : () => {
                    if (window.confirm(`Usunąć paragraf §${paragraphId}?`))
                      onRemove(paragraphId);
                  }
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
        </div>
      </div>

      <div className="editor-paragraph-view__columns">
        <div className="editor-paragraph-view__editor">
          {/* ── TRYB PROSTY ── */}
          {!isVariantMode && (
            <>
              {hasPages ? (
                <>
                  <span className="editor-paragraph-view__label">Treść</span>
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
                    onClick={() => {
                      const lines = text
                        .split("\n")
                        .filter((l) => l.trim() !== "");
                      const page = lines.map((line) => ({
                        type: "text" as const,
                        text: line,
                      }));
                      dispatch({
                        type: "LOAD_SCENARIO",
                        payload: {
                          ...state.scenario!,
                          paragraphs: state.scenario!.paragraphs.map((p) =>
                            p.id === paragraphId
                              ? {
                                  ...p,
                                  pages: [page.length > 0 ? page : []],
                                  text: undefined,
                                }
                              : p,
                          ),
                        },
                      });
                    }}
                  >
                    Przekonwertuj na bloki
                  </button>
                </>
              )}

              <div className="editor-paragraph-view__choices">
                <span className="editor-paragraph-view__label">Wybory</span>

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

                <div className="editor-paragraph-view__choice-add">
                  <ChoiceTextInput
                    value={newChoiceText}
                    onChange={setNewChoiceText}
                    onKeyDown={(e) => e.key === "Enter" && handleAddChoice()}
                    placeholder="Tekst nowego wyboru"
                  />
                  <div className="editor-paragraph-view__choice-target-wrap">
                    <span className="editor-paragraph-view__choice-target-prefix">
                      §
                    </span>
                    <input
                      className="editor-paragraph-view__choice-target"
                      type="text"
                      value={newChoiceTarget}
                      onChange={(e) => setNewChoiceTarget(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddChoice()}
                      onFocus={() => setFocusedTargetId("__new__")}
                      onBlur={() => setFocusedTargetId(null)}
                      placeholder="?"
                    />
                    {focusedTargetId === "__new__" &&
                      filteredIds(newChoiceTarget).length > 0 && (
                        <ul className="editor-paragraph-view__choice-dropdown">
                          {filteredIds(newChoiceTarget).map((id) => (
                            <li
                              key={id}
                              className="editor-paragraph-view__choice-dropdown-item"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setNewChoiceTarget(id);
                              }}
                            >
                              §{id}
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                  <button
                    className="editor-paragraph-view__choice-add-btn"
                    onClick={handleAddChoice}
                    disabled={!newChoiceText.trim()}
                    title="Dodaj wybór"
                  >
                    + Dodaj
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── TRYB WARIANTOWY ── */}
          {isVariantMode && (
            <>
              {/* Selektor wariantów */}
              <div className="editor-paragraph-view__choices">
                <span className="editor-paragraph-view__label">
                  Selektor wariantów (→ poziome przyciski)
                </span>

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
                        filteredVariantIds(choice.nextVariantId ?? "").length >
                          0 && (
                          <ul className="editor-paragraph-view__choice-dropdown">
                            {filteredVariantIds(choice.nextVariantId ?? "").map(
                              (id) => (
                                <li
                                  key={id}
                                  className="editor-paragraph-view__choice-dropdown-item"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    dispatch({
                                      type: "UPDATE_VARIANT_SELECTOR",
                                      payload: {
                                        paragraphId,
                                        choice: {
                                          ...choice,
                                          nextVariantId: id,
                                        },
                                      },
                                    });
                                  }}
                                >
                                  W:{id}
                                </li>
                              ),
                            )}
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

                <div className="editor-paragraph-view__choice-add">
                  <ChoiceTextInput
                    value={newSelectorText}
                    onChange={setNewSelectorText}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSelector()}
                    placeholder="Tekst nowego przycisku"
                  />
                  <div className="editor-paragraph-view__choice-target-wrap">
                    <span className="editor-paragraph-view__choice-target-prefix editor-paragraph-view__choice-target-prefix--variant">
                      W
                    </span>
                    <input
                      className="editor-paragraph-view__choice-target"
                      type="text"
                      value={newSelectorTarget}
                      onChange={(e) => setNewSelectorTarget(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAddSelector()
                      }
                      onFocus={() => setFocusedSelectorId("__new-sel__")}
                      onBlur={() => setFocusedSelectorId(null)}
                      placeholder="?"
                    />
                    {focusedSelectorId === "__new-sel__" &&
                      filteredVariantIds(newSelectorTarget).length > 0 && (
                        <ul className="editor-paragraph-view__choice-dropdown">
                          {filteredVariantIds(newSelectorTarget).map((id) => (
                            <li
                              key={id}
                              className="editor-paragraph-view__choice-dropdown-item"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setNewSelectorTarget(id);
                              }}
                            >
                              W:{id}
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                  <button
                    className="editor-paragraph-view__choice-add-btn"
                    onClick={handleAddSelector}
                    disabled={!newSelectorText.trim()}
                    title="Dodaj przycisk selektora"
                  >
                    + Dodaj
                  </button>
                </div>
              </div>

              {/* Lista wariantów */}
              <div className="editor-paragraph-view__variants-section">
                <div className="editor-paragraph-view__variants-header">
                  <span className="editor-paragraph-view__label">Warianty</span>
                  <div className="editor-paragraph-view__variant-add-row">
                    <input
                      className="editor-paragraph-view__variant-add-input"
                      type="text"
                      value={newVariantId}
                      onChange={(e) =>
                        setNewVariantId(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, ""),
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
                      placeholder="nazwa-wariantu"
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
                      + Wariant
                    </button>
                  </div>
                </div>

                {variantIds.length === 0 && (
                  <p className="editor-paragraph-view__variants-empty">
                    Brak wariantów — dodaj pierwszy powyżej.
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
              </div>
            </>
          )}
        </div>

        {/* Preview */}
        <div className="editor-paragraph-view__preview">
          <span className="editor-paragraph-view__label">Podgląd</span>
          <div className="editor-paragraph-view__preview-content">
            {!isVariantMode && (
              <>
                {hasPages ? (
                  pages.length === 0 ||
                  (pages.length === 1 && pages[0].length === 0) ? (
                    <p className="editor-paragraph-view__preview-empty">
                      Brak treści
                    </p>
                  ) : (
                    pages.map((page, i) => (
                      <div
                        key={i}
                        className="editor-paragraph-view__preview-page"
                      >
                        {pages.length > 1 && (
                          <span className="editor-paragraph-view__preview-page-label">
                            Strona {i + 1}
                          </span>
                        )}
                        <RichText content={page} />
                      </div>
                    ))
                  )
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
                  <ul className="editor-paragraph-view__preview-choices">
                    {(paragraph.choices ?? []).map((choice) => (
                      <li
                        key={choice.id}
                        className="editor-paragraph-view__preview-choice"
                      >
                        <RichText
                          content={[{ type: "text", text: choice.text }]}
                        />
                        {choice.nextParagraphId && (
                          <>
                            {" "}
                            →{" "}
                            <button
                              className="editor-paragraph-view__preview-choice-target"
                              onClick={() =>
                                onNavigate(choice.nextParagraphId!)
                              }
                              title={`Przejdź do §${choice.nextParagraphId}`}
                            >
                              §{choice.nextParagraphId}
                            </button>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
            {isVariantMode && (
              <div className="editor-paragraph-view__preview-variants">
                <p className="editor-paragraph-view__preview-mode-label">
                  Paragraf wariantowy · {variantIds.length} wariant
                  {variantIds.length === 1
                    ? ""
                    : variantIds.length < 5
                      ? "y"
                      : "ów"}
                </p>
                {(paragraph.variantSelectors ?? []).map((s) => (
                  <span
                    key={s.id}
                    className="editor-paragraph-view__preview-selector"
                  >
                    {s.text}
                    {s.nextVariantId ? ` → W:${s.nextVariantId}` : ""}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
