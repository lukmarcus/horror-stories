import React, { useState } from "react";
import { useEditor } from "../../context/useEditor";
import { RichText } from "../../../components/text/RichText/RichText";
import { Button } from "../../../components/ui/Button";
import type { EditorChoice, EditorVariant } from "../../context/editorTypes";
import { filterIds } from "../../utils/editorUtils";
import { PagesEditor } from "./PagesEditor";
import { ChoiceTextInput } from "./ChoiceTextInput";
import { ChoiceRow } from "./ChoiceRow";
import "./VariantEditor.css";

export interface VariantEditorProps {
  paragraphId: string;
  variantId: string;
  variant: EditorVariant;
  variantIds: string[];
  paragraphIds: string[];
}

export const VariantEditor: React.FC<VariantEditorProps> = ({
  paragraphId,
  variantId,
  variant,
  variantIds,
  paragraphIds,
}) => {
  const { state, dispatch } = useEditor();
  const [newChoiceText, setNewChoiceText] = useState("");
  const [newChoiceTarget, setNewChoiceTarget] = useState("");
  const [newChoiceIsVariant, setNewChoiceIsVariant] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(variantId);

  const isHorizontal = !!variant.areChoicesHorizontal;

  const handleRename = () => {
    const newName = renameValue.trim();
    if (!newName || newName === variantId) {
      setRenaming(false);
      return;
    }
    const p = state.scenario!.paragraphs.find((p) => p.id === paragraphId)!;
    const newVariants: Record<string, EditorVariant> = Object.fromEntries(
      Object.entries(p.variants ?? {}).map(([k, v]) => [
        k === variantId ? newName : k,
        v,
      ]),
    );
    dispatch({
      type: "LOAD_SCENARIO",
      payload: {
        ...state.scenario!,
        paragraphs: state.scenario!.paragraphs.map((p) =>
          p.id === paragraphId ? { ...p, variants: newVariants } : p,
        ),
      },
    });
    setRenaming(false);
  };

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
          </>
        )}
      </div>

      {!collapsed && (
        <div className="editor-paragraph-view__variant-body">
          <div className="editor-paragraph-view__variant-columns">
            {/* Editor column */}
            <div className="editor-paragraph-view__variant-editor">
              <h3 className="editor-paragraph-view__label">Treść wariantu</h3>
              <PagesEditor
                paragraphId={paragraphId}
                pages={variant.pages ?? [[]]}
                singlePage
                onPagesChange={(pages) =>
                  dispatch({
                    type: "SET_VARIANT_PAGES",
                    payload: { paragraphId, variantId, pages },
                  })
                }
              />
              <div className="editor-paragraph-view__choices-heading-row">
                <h3 className="editor-paragraph-view__label">
                  Wybory wariantu
                </h3>
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
              </div>
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
                      title={
                        newChoiceIsVariant ? "Cel: wariant" : "Cel: paragraf"
                      }
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
                      const list = newChoiceIsVariant
                        ? variantIds
                        : paragraphIds;
                      const opts = filterIds(newChoiceTarget, list);
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
            {/* Preview column */}
            <div className="editor-paragraph-view__variant-preview">
              <h3 className="editor-paragraph-view__label">Podgląd</h3>
              <div className="editor-paragraph-view__preview-content">
                {(variant.pages ?? [[]]).length === 0 ||
                ((variant.pages ?? [[]]).length === 1 &&
                  (variant.pages ?? [[]])[0].length === 0) ? (
                  <p className="editor-paragraph-view__preview-empty">
                    Brak treści
                  </p>
                ) : (
                  (variant.pages ?? [[]]).map((page, i) => (
                    <div
                      key={i}
                      className="editor-paragraph-view__preview-page"
                    >
                      {(variant.pages ?? [[]]).length > 1 && (
                        <span className="editor-paragraph-view__preview-page-label">
                          Strona {i + 1}
                        </span>
                      )}
                      <RichText content={page} />
                    </div>
                  ))
                )}
                {(variant.choices ?? []).length > 0 && (
                  <fieldset className="choices choices--vertical">
                    <legend className="sr-only">Wybory wariantu</legend>
                    {(variant.choices ?? []).map((choice) => (
                      <Button
                        key={choice.id}
                        variant="primary"
                        size="lg"
                        disabled
                        title={
                          choice.nextParagraphId
                            ? `→ §${choice.nextParagraphId}`
                            : choice.nextVariantId
                              ? `→ W:${choice.nextVariantId}`
                              : undefined
                        }
                      >
                        <RichText
                          content={[{ type: "text", text: choice.text }]}
                        />
                      </Button>
                    ))}
                  </fieldset>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
