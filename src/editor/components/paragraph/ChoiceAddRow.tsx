import React, { useState } from "react";
import { filterIds } from "../../utils/editorUtils";
import { ChoiceTextInput } from "./ChoiceTextInput";

export interface ChoiceAddRowProps {
  /** Text input placeholder */
  placeholder?: string;
  /** Label shown in the prefix badge before the target input */
  prefixLabel: string;
  /** Whether to apply variant (green) styling to the prefix */
  prefixIsVariant?: boolean;
  /**
   * When provided, the prefix badge becomes a toggle button.
   * Called when the user clicks the badge to switch between § and W.
   */
  onPrefixToggle?: () => void;
  /** Autocomplete options for the target input */
  targetList: string[];
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
  prefixIsVariant = false,
  onPrefixToggle,
  targetList,
  requireTarget = false,
  addButtonTitle = "Dodaj wybór",
  onAdd,
}) => {
  const [text, setText] = useState("");
  const [target, setTarget] = useState("");
  const [focused, setFocused] = useState(false);

  const handleAdd = () => {
    const trimmedText = text.trim();
    if (!trimmedText) return;
    if (requireTarget && !target.trim()) return;
    onAdd(trimmedText, target.trim());
    setText("");
    setTarget("");
  };

  const options = filterIds(target, targetList);

  return (
    <div className="editor-paragraph-view__choice-add">
      <ChoiceTextInput
        value={text}
        onChange={setText}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder={placeholder}
      />
      <div className="editor-paragraph-view__choice-target-wrap">
        {onPrefixToggle ? (
          <button
            className={`editor-paragraph-view__choice-type-btn${prefixIsVariant ? " editor-paragraph-view__choice-type-btn--variant" : ""}`}
            onClick={onPrefixToggle}
            title={
              prefixIsVariant
                ? "Cel: wariant (kliknij → paragraf)"
                : "Cel: paragraf (kliknij → wariant)"
            }
          >
            {prefixLabel}
          </button>
        ) : (
          <span
            className={`editor-paragraph-view__choice-target-prefix${prefixIsVariant ? " editor-paragraph-view__choice-target-prefix--variant" : ""}`}
          >
            {prefixLabel}
          </span>
        )}
        <input
          className="editor-paragraph-view__choice-target"
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="?"
        />
        {focused && options.length > 0 && (
          <ul className="editor-paragraph-view__choice-dropdown">
            {options.map((id) => (
              <li
                key={id}
                className="editor-paragraph-view__choice-dropdown-item"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setTarget(id);
                }}
              >
                {prefixIsVariant ? `W:${id}` : `§${id}`}
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
