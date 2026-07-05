import React, { useContext, useMemo, useEffect } from "react";
import { EditorContext } from "../../context/editorTypes";
import { PersonRow } from "./PersonRow";
import { AddPersonForm } from "./AddPersonForm";
import "./ItemEditor.css";
import personsData from "../../../data/items/persons.json";

// Get all available person IDs from persons.json with their fixed paragraphId
const ALL_PERSONS = personsData.items
  .filter((p) => p.paragraphId !== undefined)
  .map((p) => ({
    id: p.id,
    name: p.id
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    paragraphId: String(p.paragraphId),
  }));

export const PersonsEditor: React.FC = () => {
  const editorCtx = useContext(EditorContext);

  const usedPersons = useMemo(
    () => new Set((editorCtx?.state.scenario?.persons ?? []).map((p) => p.id)),
    [editorCtx?.state.scenario?.persons],
  );

  const availablePersons = useMemo(
    () => ALL_PERSONS.filter((p) => !usedPersons.has(p.id)),
    [usedPersons],
  );

  // Auto-fix persons with missing paragraphId (from old saves)
  useEffect(() => {
    if (!editorCtx?.state.scenario?.persons) return;

    const needsFix = editorCtx.state.scenario.persons.some(
      (p) => !p.paragraphId,
    );
    if (!needsFix) return;

    const fixed = editorCtx.state.scenario.persons.map((p) => {
      if (p.paragraphId) return p;
      const personData = ALL_PERSONS.find((ap) => ap.id === p.id);
      return personData ? { id: p.id, paragraphId: personData.paragraphId } : p;
    });

    editorCtx.dispatch({ type: "LOAD_PERSONS", payload: { persons: fixed } });
  }, [editorCtx]);

  if (!editorCtx) return null;

  const { state, dispatch } = editorCtx;

  const persons = [...(state.scenario?.persons ?? [])].sort((a, b) => {
    const aNum = parseInt(a.paragraphId, 10);
    const bNum = parseInt(b.paragraphId, 10);
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
    return a.paragraphId.localeCompare(b.paragraphId);
  });

  const handleDeletePerson = (personId: string) => {
    dispatch({ type: "REMOVE_PERSON", payload: personId });
  };

  const handleAddPerson = (personId: string, paragraphId: string) => {
    dispatch({
      type: "ADD_PERSON",
      payload: { id: personId, paragraphId },
    });
  };

  const getPersonName = (id: string) =>
    ALL_PERSONS.find((p) => p.id === id)?.name ?? id;

  const getPersonParagraphId = (id: string, fallbackId: string) => {
    if (fallbackId) return fallbackId;
    return ALL_PERSONS.find((p) => p.id === id)?.paragraphId ?? "";
  };

  return (
    <div className="item-editor">
      <h2 className="item-editor__title">Postacie</h2>
      <p className="item-editor__hint">
        Wybierz, które postacie występują w tym scenariuszu. Każda postać ma
        stały numer paragrafu (wpisany na figurce).
      </p>

      {persons.length > 0 && (
        <div className="item-editor__section">
          <div className="item-editor__label">Przypisane postacie</div>
          <div className="item-editor__list">
            {persons.map((person) => (
              <PersonRow
                key={person.id}
                personId={person.id}
                personName={getPersonName(person.id)}
                paragraphId={getPersonParagraphId(
                  person.id,
                  person.paragraphId,
                )}
                onDelete={handleDeletePerson}
              />
            ))}
          </div>
        </div>
      )}

      {availablePersons.length > 0 ? (
        <AddPersonForm
          availablePersons={availablePersons}
          onAdd={handleAddPerson}
        />
      ) : (
        <div className="item-editor__note">
          Wszystkie postacie ({ALL_PERSONS.length}) zostały już przypisane.
        </div>
      )}
    </div>
  );
};
