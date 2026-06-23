import React, { useState } from "react";
import { useEditor } from "../../context/useEditor";
import type { EditorChoice, EditorVariant } from "../../context/editorTypes";
import { PagesEditor } from "./PagesEditor";
import { ChoiceRow } from "./ChoiceRow";
import { ChoiceAddRow } from "./ChoiceAddRow";
import { VariantHeader } from "./VariantHeader";
import { VariantPreview } from "./VariantPreview";
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
  const { dispatch } = useEditor();
  const [newChoiceIsVariant, setNewChoiceIsVariant] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const isHorizontal = !!variant.areChoicesHorizontal;

  return (
    <div className="editor-paragraph-view__variant">
      <VariantHeader
        variantId={variantId}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onRename={(oldId, newId) =>
          dispatch({
            type: "RENAME_VARIANT",
            payload: { paragraphId, oldId, newId },
          })
        }
        onDelete={() =>
          dispatch({
            type: "REMOVE_VARIANT",
            payload: { paragraphId, variantId },
          })
        }
      />

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
              <ChoiceAddRow
                prefixLabel={newChoiceIsVariant ? "W" : "§"}
                prefixIsVariant={newChoiceIsVariant}
                onPrefixToggle={
                  isHorizontal
                    ? () => setNewChoiceIsVariant((v) => !v)
                    : undefined
                }
                targetList={newChoiceIsVariant ? variantIds : paragraphIds}
                onAdd={(text, target) => {
                  const choice: EditorChoice = {
                    id: crypto.randomUUID(),
                    text,
                    ...(newChoiceIsVariant
                      ? { nextVariantId: target }
                      : { nextParagraphId: target }),
                  };
                  dispatch({
                    type: "ADD_VARIANT_CHOICE",
                    payload: { paragraphId, variantId, choice },
                  });
                }}
              />
            </div>
            {/* Preview column */}
            <VariantPreview
              pages={variant.pages ?? [[]]}
              choices={variant.choices ?? []}
            />
          </div>
        </div>
      )}
    </div>
  );
};
