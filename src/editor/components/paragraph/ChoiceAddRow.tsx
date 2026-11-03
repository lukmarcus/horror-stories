import React, { useState } from "react";
import { filterIds, suggestNextLetterChild } from "../../utils/editorUtils";
import { ChoiceTextInput } from "./ChoiceTextInput";

export interface ChoiceAddRowProps {
  /** Text input placeholder */
  placeholder?: string;
  /** Label shown in the prefix badge before the target input */
  prefixLabel: string;
  /** Autocomplete options for the target input */
  targetList: string[];
  /** ID of the paragraph currently being edited — letter suggestion is always a child of this one */
  currentParagraphId?: string;
  /** When true, disables + Dodaj if the target field is empty */
  requireTarget?: boolean;
  /** Button title for the + Dodaj button */
  addButtonTitle?: string;
  /** Called with trimmed (text, target) when user confirms the new choice */
  onAdd: (text: string, target: string) => void;
}

export const ChoiceAddRow: React.FC<ChoiceAddRowProps> = ({
  placeholder = "Tekst nowego wyboru",
  prefixLabel,
  targetList,
  currentParagraphId,
  requireTarget = false,
  addButtonTitle = "Dodaj wybór",
  onAdd,
}) => {
  const [text, setText] = useState("");
  const [target, setTarget] = useState("");
  const [focused, setFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const handleAdd = () => {
    const trimmedText = text.trim();
    if (!trimmedText) return;
    if (requireTarget && !target.trim()) return;
    onAdd(trimmedText, target.trim());
    setText("");
    setTarget("");
  };

  const baseOptions = filterIds(target, targetList);
  const suggestion = currentParagraphId
    ? suggestNextLetterChild(currentParagraphId, targetList)
    : null;
  const options =
    suggestion && !baseOptions.includes(suggestion)
      ? [suggestion, ...baseOptions]
      : baseOptions;

  return (
    <div className="editor-paragraph-view__choice-add">
      <ChoiceTextInput
        value={text}
        onChange={setText}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder={placeholder}
      />
      <div className="editor-paragraph-view__choice-target-wrap">
        <span className="editor-paragraph-view__choice-target-prefix">
          {prefixLabel}
        </span>
        <input
          className="editor-paragraph-view__choice-target"
          type="text"
          value={target}
          aria-autocomplete="list"
          aria-controls={
            focused && options.length > 0 ? "choice-add-listbox" : undefined
          }
          aria-activedescendant={
            focused && highlightedIndex !== null
              ? `choice-add-option-${highlightedIndex}`
              : undefined
          }
          onChange={(e) => setTarget(e.target.value)}
          onKeyDown={(e) => {
            if (focused && options.length > 0) {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlightedIndex((i) =>
                  i === null ? 0 : (i + 1) % options.length,
                );
                return;
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlightedIndex((i) =>
                  i === null
                    ? options.length - 1
                    : (i - 1 + options.length) % options.length,
                );
                return;
              } else if (e.key === "Enter" && highlightedIndex !== null) {
                e.preventDefault();
                setTarget(options[highlightedIndex]);
                setHighlightedIndex(null);
                return;
              } else if (e.key === "Escape") {
                e.preventDefault();
                setFocused(false);
                setHighlightedIndex(null);
                return;
              }
            }
            if (e.key === "Enter") handleAdd();
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            setHighlightedIndex(null);
          }}
          placeholder="?"
        />
        {focused && options.length > 0 && (
          <ul
            id="choice-add-listbox"
            role="listbox"
            className="editor-paragraph-view__choice-dropdown"
          >
            {options.map((id, index) => (
              <li
                key={id}
                id={`choice-add-option-${index}`}
                role="option"
                aria-selected={highlightedIndex === index}
                className={`editor-paragraph-view__choice-dropdown-item${highlightedIndex === index ? " editor-paragraph-view__choice-dropdown-item--highlighted" : ""}${id === suggestion ? " editor-paragraph-view__choice-dropdown-item--suggestion" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setTarget(id);
                }}
              >
                {id === suggestion ? `+ §${id} (nowe dziecko)` : `§${id}`}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        className="editor-paragraph-view__choice-add-btn"
        onClick={handleAdd}
        disabled={!text.trim() || (requireTarget && !target.trim())}
        title={addButtonTitle}
      >
        + Dodaj
      </button>
    </div>
  );
};
