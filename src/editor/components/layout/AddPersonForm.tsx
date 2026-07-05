import React, { useState } from "react";

interface AddPersonFormProps {
  availablePersons: Array<{ id: string; name: string; paragraphId: string }>;
  onAdd: (personId: string, paragraphId: string) => void;
}

export const AddPersonForm: React.FC<AddPersonFormProps> = ({
  availablePersons,
  onAdd,
}) => {
  const [selectedPerson, setSelectedPerson] = useState("");

  const effectivePerson =
    availablePersons.find((p) => p.id === selectedPerson) ||
    availablePersons[0];

  const handleAdd = () => {
    if (!effectivePerson) return;
    onAdd(effectivePerson.id, effectivePerson.paragraphId);
    setSelectedPerson("");
  };

  return (
    <div className="item-editor__section">
      <div className="item-editor__label">Dodaj postać</div>
      <p className="item-editor__add-hint">
        Numer paragrafu jest stały dla każdej postaci (wpisany na figurce).
      </p>
      <div className="item-editor__add-row">
        <select
          className="item-editor__select item-editor__select--item"
          value={selectedPerson}
          onChange={(e) => setSelectedPerson(e.target.value)}
          style={{ flex: 1 }}
        >
          <option value="">Wybierz postać...</option>
          {availablePersons.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (§{p.paragraphId})
            </option>
          ))}
        </select>

        <button
          className="editor-btn editor-btn--primary"
          onClick={handleAdd}
          disabled={!effectivePerson}
        >
          Dodaj
        </button>
      </div>
    </div>
  );
};
