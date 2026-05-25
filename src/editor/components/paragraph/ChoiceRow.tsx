import React from "react";
import type { EditorChoice } from "../../context/editorTypes";
import { filterIds } from "../../utils/editorUtils";
import { ChoiceTextInput } from "./ChoiceTextInput";

export interface ChoiceRowProps {
  choice: EditorChoice;
  paragraphIds: string[];
  variantIds?: string[];
  focusedId: string | null;
  setFocusedId: (id: string | null) => void;
  onUpdate: (choice: EditorChoice) => void;
  onRemove: (id: string) => void;
}

export const ChoiceRow: React.FC<ChoiceRowProps> = ({
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
  const list = isVariantTarget ? (variantIds ?? []) : paragraphIds;
  const options = filterIds(targetValue, list);

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
