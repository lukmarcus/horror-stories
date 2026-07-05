import React, { useState } from "react";
import { filterIds } from "../../utils/editorUtils";

interface AddPersonFormProps {
  availablePersons: Array<{ id: string; name: string }>;
  availableParasForAdd: string[];
  paragraphUsedBy: Record<string, string>;
  onAdd: (personId: string, paragraphId: string) => void;
}

export const AddPersonForm: React.FC<AddPersonFormProps> = ({
  availablePersons,
  availableParasForAdd,
  paragraphUsedBy,
  onAdd,
}) => {
  const [selectedPerson, setSelectedPerson] = useState("");
  const [paraInput, setParaInput] = useState("");
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);
  const [highlighted, setHighlighted] = useState<number | null>(null);

  const effectivePerson =
    selectedPerson || availablePersons[0]?.id || "";

  const handleAdd = () => {
    setError("");
    if (!effectivePerson) {
      setError("Brak dostępnych postaci.");
      return;
    }
    const paraId = paraInput.trim();
    if (!paraId) {
      setError("Podaj numer paragrafu.");
      return;
    }
    if (
      paragraphUsedBy[paraId] &&
      paragraphUsedBy[paraId] !== effectivePerson
    ) {
      const otherPerson = paragraphUsedBy[paraId];
      setError(
        `Paragraf §${paraId} jest już przypisany do postaci ${otherPerson}.`,
      );
      return;
    }
    onAdd(effectivePerson, paraId);
    setSelectedPerson("");
    setParaInput("");
    setError("");
    setFocused(false);
    setHighlighted(null);
  };

  const autocompleteOptions = filterIds(paraInput, availableParasForAdd);

  return (
    <div className="letters-editor__section">
      <div className="letters-editor__label">Dodaj postać</div>
      <p className="letters-editor__add-hint">
        Możesz wpisać istniejący lub nowy numer § — zostanie automatycznie
        utworzony.
      </p>
      <div className="letters-editor__add-row">
        <select
          className="letters-editor__select letters-editor__select--letter"
          value={effectivePerson}
          onChange={(e) => setSelectedPerson(e.target.value)}
        >
          {availablePersons.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
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
          className="letters-editor__add-btn"
          onClick={handleAdd}
          title="Dodaj postać"
        >
          +
        </button>
      </div>
      {error && <div className="letters-editor__error">{error}</div>}
    </div>
  );
};
