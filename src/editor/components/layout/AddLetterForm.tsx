import React, { useState } from "react";
import { filterIds } from "../../utils/editorUtils";

interface AddLetterFormProps {
  availableLetters: string[];
  availableParasForAdd: string[];
  paragraphUsedBy: Record<string, string>;
  onAdd: (letterId: string, paragraphId: string) => void;
}

export const AddLetterForm: React.FC<AddLetterFormProps> = ({
  availableLetters,
  availableParasForAdd,
  paragraphUsedBy,
  onAdd,
}) => {
  const [selectedLetter, setSelectedLetter] = useState("");
  const [paraInput, setParaInput] = useState("");
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);
  const [highlighted, setHighlighted] = useState<number | null>(null);

  const effectiveLetter = selectedLetter || availableLetters[0] || "";

  const handleAdd = () => {
    setError("");
    if (!effectiveLetter) {
      setError("Brak dostępnych liter.");
      return;
    }
    const paraId = paraInput.trim();
    if (!paraId) {
      setError("Podaj numer paragrafu.");
      return;
    }
    if (
      paragraphUsedBy[paraId] &&
      paragraphUsedBy[paraId] !== effectiveLetter
    ) {
      setError(
        `Paragraf §${paraId} jest już przypisany do litery ${paragraphUsedBy[paraId]}.`,
      );
      return;
    }
    onAdd(effectiveLetter, paraId);
    setSelectedLetter("");
    setParaInput("");
    setError("");
    setFocused(false);
    setHighlighted(null);
  };

  const autocompleteOptions = filterIds(paraInput, availableParasForAdd);

  return (
    <div className="letters-editor__section">
      <div className="letters-editor__label">Dodaj literę</div>
      <p className="letters-editor__add-hint">
        Możesz wpisać istniejący lub nowy numer § — zostanie automatycznie
        utworzony.
      </p>
      <div className="letters-editor__add-row">
        <select
          className="letters-editor__select letters-editor__select--letter"
          value={effectiveLetter}
          onChange={(e) => setSelectedLetter(e.target.value)}
        >
          {availableLetters.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <div className="letters-editor__para-wrap">
          <span className="letters-editor__para-prefix">§</span>
          <input
            className="letters-editor__para-target"
            type="text"
            value={paraInput}
            onChange={(e) => {
              setParaInput(e.target.value);
              setHighlighted(null);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              setHighlighted(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlighted((i) =>
                  i === null ? 0 : (i + 1) % autocompleteOptions.length,
                );
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlighted((i) =>
                  i === null
                    ? autocompleteOptions.length - 1
                    : (i - 1 + autocompleteOptions.length) %
                      autocompleteOptions.length,
                );
              } else if (e.key === "Enter") {
                if (highlighted !== null && autocompleteOptions[highlighted]) {
                  setParaInput(autocompleteOptions[highlighted]);
                  setHighlighted(null);
                } else {
                  handleAdd();
                }
              } else if (e.key === "Escape") {
                setFocused(false);
                setHighlighted(null);
              }
            }}
            placeholder="numer…"
          />
          {focused && autocompleteOptions.length > 0 && (
            <ul className="letters-editor__para-dropdown" role="listbox">
              {autocompleteOptions.map((pid, index) => (
                <li
                  key={pid}
                  role="option"
                  className={`letters-editor__para-dropdown-item${highlighted === index ? " letters-editor__para-dropdown-item--highlighted" : ""}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setParaInput(pid);
                    setFocused(false);
                  }}
                >
                  §{pid}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className="editor-btn editor-btn--primary"
          onClick={handleAdd}
          disabled={!effectiveLetter || !paraInput.trim()}
        >
          Dodaj
        </button>
      </div>
      {error && <div className="letters-editor__error">{error}</div>}
    </div>
  );
};
