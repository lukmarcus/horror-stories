import React, { useState } from "react";
import { PagesEditor } from "./PagesEditor";
import { ChoiceTextInput } from "./ChoiceTextInput";
import { ChoiceAddRow } from "./ChoiceAddRow";
import { filterIds } from "../../utils/editorUtils";
import type { EditorParagraph, EditorChoice } from "../../context/editorTypes";

interface VariantModeEditorProps {
  paragraphId: string;
  paragraph: EditorParagraph;
  variantIds: string[];
  onUpdateSelector: (choice: EditorChoice) => void;
  onRemoveSelector: (choiceId: string) => void;
  onAddSelector: (text: string, target: string) => void;
}

export const VariantModeEditor: React.FC<VariantModeEditorProps> = ({
  paragraphId,
  paragraph,
  variantIds,
  onUpdateSelector,
  onRemoveSelector,
  onAddSelector,
}) => {
  const [focusedSelectorId, setFocusedSelectorId] = useState<string | null>(
    null,
  );

  return (
    <>
      <h2 className="editor-paragraph-view__label">Treść wprowadzająca</h2>
      <PagesEditor
        paragraphId={paragraphId}
        pages={paragraph.pages ?? [[]]}
        singlePage
      />
      <h3 className="editor-paragraph-view__label">
        Selektor wariantów (→ poziome przyciski)
      </h3>
      {(paragraph.variantSelectors ?? []).map((choice) => (
        <div key={choice.id} className="editor-paragraph-view__choice-row">
          <ChoiceTextInput
            value={choice.text}
            onChange={(t) => onUpdateSelector({ ...choice, text: t })}
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
                onUpdateSelector({
                  ...choice,
                  nextVariantId: e.target.value,
                })
              }
              onFocus={() => setFocusedSelectorId(choice.id)}
              onBlur={() => setFocusedSelectorId(null)}
              placeholder="?"
            />
            {focusedSelectorId === choice.id &&
              filterIds(choice.nextVariantId ?? "", variantIds).length > 0 && (
                <ul className="editor-paragraph-view__choice-dropdown">
                  {filterIds(choice.nextVariantId ?? "", variantIds).map(
                    (id) => (
                      <li
                        key={id}
                        className="editor-paragraph-view__choice-dropdown-item"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          onUpdateSelector({ ...choice, nextVariantId: id });
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
            onClick={() => onRemoveSelector(choice.id)}
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
        onAdd={onAddSelector}
      />
    </>
  );
};
