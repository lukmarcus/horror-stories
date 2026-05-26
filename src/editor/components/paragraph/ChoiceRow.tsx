import React, { useState } from "react";
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
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
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
          aria-autocomplete="list"
          aria-controls={
            focusedId === dropdownKey && options.length > 0
              ? `${dropdownKey}-listbox`
              : undefined
          }
          aria-activedescendant={
            focusedId === dropdownKey && highlightedIndex !== null
              ? `${dropdownKey}-option-${highlightedIndex}`
              : undefined
          }
          onChange={(e) => handleTargetChange(e.target.value)}
          onFocus={() => setFocusedId(dropdownKey)}
          onBlur={() => {
            setFocusedId(null);
            setHighlightedIndex(null);
          }}
          onKeyDown={(e) => {
            if (focusedId !== dropdownKey || options.length === 0) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlightedIndex((i) =>
                i === null ? 0 : (i + 1) % options.length,
              );
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlightedIndex((i) =>
                i === null
                  ? options.length - 1
                  : (i - 1 + options.length) % options.length,
              );
            } else if (e.key === "Enter" && highlightedIndex !== null) {
              e.preventDefault();
              handleTargetChange(options[highlightedIndex]);
              setHighlightedIndex(null);
            } else if (e.key === "Escape") {
              e.preventDefault();
              setFocusedId(null);
              setHighlightedIndex(null);
            }
          }}
          placeholder="?"
        />
        {focusedId === dropdownKey && options.length > 0 && (
          <ul
            id={`${dropdownKey}-listbox`}
            role="listbox"
            className="editor-paragraph-view__choice-dropdown"
          >
            {options.map((id, index) => (
              <li
                key={id}
                id={`${dropdownKey}-option-${index}`}
                role="option"
                aria-selected={highlightedIndex === index}
                className={`editor-paragraph-view__choice-dropdown-item${highlightedIndex === index ? " editor-paragraph-view__choice-dropdown-item--highlighted" : ""}`}
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
