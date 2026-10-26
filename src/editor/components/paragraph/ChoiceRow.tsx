import React, { useState } from "react";
import type { EditorChoice } from "../../context/editorTypes";
import { filterIds, suggestNextLetterChild } from "../../utils/editorUtils";
import { ChoiceTextInput } from "./ChoiceTextInput";

export interface ChoiceRowProps {
  choice: EditorChoice;
  paragraphIds: string[];
  focusedId: string | null;
  setFocusedId: (id: string | null) => void;
  onUpdate: (choice: EditorChoice) => void;
  onRemove: (id: string) => void;
}

export const ChoiceRow: React.FC<ChoiceRowProps> = ({
  choice,
  paragraphIds,
  focusedId,
  setFocusedId,
  onUpdate,
  onRemove,
}) => {
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const targetValue = choice.nextParagraphId ?? "";

  const handleTargetChange = (val: string) => {
    onUpdate({ ...choice, nextParagraphId: val });
  };

  const dropdownKey = `${choice.id}-target`;
  const baseOptions = filterIds(targetValue, paragraphIds);
  const suggestion = suggestNextLetterChild(targetValue.trim(), paragraphIds);
  const options =
    suggestion && !baseOptions.includes(suggestion)
      ? [...baseOptions, suggestion]
      : baseOptions;

  return (
    <div className="editor-paragraph-view__choice-row">
      <ChoiceTextInput
        value={choice.text}
        onChange={(text) => onUpdate({ ...choice, text })}
        placeholder="Tekst wyboru"
      />
      <div className="editor-paragraph-view__choice-target-wrap">
        <span className="editor-paragraph-view__choice-target-prefix">§</span>
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
                className={`editor-paragraph-view__choice-dropdown-item${highlightedIndex === index ? " editor-paragraph-view__choice-dropdown-item--highlighted" : ""}${id === suggestion ? " editor-paragraph-view__choice-dropdown-item--suggestion" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleTargetChange(id);
                }}
              >
                {id === suggestion ? `+ §${id} (nowe dziecko)` : `§${id}`}
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
