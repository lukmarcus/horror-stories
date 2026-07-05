import React, { useContext, useMemo } from "react";
import { EditorContext } from "../../context/editorTypes";
import { PersonRow } from "./PersonRow";
import { AddPersonForm } from "./AddPersonForm";
import "./LettersEditor.css"; // Reuse same styles
import personsData from "../../../data/items/persons.json";

// Get all available person IDs from persons.json
const ALL_PERSONS = personsData.items.map((p) => ({
  id: p.id,
  name: p.id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" "),
}));

export const PersonsEditor: React.FC = () => {
  const editorCtx = useContext(EditorContext);

  const paragraphIds = useMemo(
    () =>
      (editorCtx?.state.scenario?.paragraphs ?? [])
        .map((p) => p.id)
        .sort((a, b) => {
          const na = parseInt(a, 10);
          const nb = parseInt(b, 10);
          if (!isNaN(na) && !isNaN(nb)) return na - nb;
          return a.localeCompare(b);
        }),
    [editorCtx?.state.scenario?.paragraphs],
  );

  const usedPersons = useMemo(
    () => new Set((editorCtx?.state.scenario?.persons ?? []).map((p) => p.id)),
    [editorCtx?.state.scenario?.persons],
  );

  // paragraphId → personId that's using it
  const paragraphUsedBy = useMemo(
    () =>
      Object.fromEntries(
        (editorCtx?.state.scenario?.persons ?? []).map((p) => [
          p.paragraphId,
          p.id,
        ]),
      ),
    [editorCtx?.state.scenario?.persons],
  );

  const availablePersons = useMemo(
    () => ALL_PERSONS.filter((p) => !usedPersons.has(p.id)),
    [usedPersons],
  );

  // Paragraphs available for new assignments (not used by any person yet)
  const availableParasForAdd = useMemo(
    () => paragraphIds.filter((id) => !paragraphUsedBy[id]),
    [paragraphIds, paragraphUsedBy],
  );

  if (!editorCtx) return null;

  const { state, dispatch } = editorCtx;
  const persons = [...(state.scenario?.persons ?? [])].sort((a, b) => {
    const aNum = parseInt(a.paragraphId, 10);
    const bNum = parseInt(b.paragraphId, 10);
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
    return a.paragraphId.localeCompare(b.paragraphId);
  });

  const handleUpdatePerson = (personId: string, newParagraphId: string) => {
    if (!paragraphIds.includes(newParagraphId)) {
      dispatch({ type: "ADD_PARAGRAPH_SILENT", payload: newParagraphId });
    }
    dispatch({
      type: "UPDATE_PERSON",
      payload: { id: personId, paragraphId: newParagraphId },
    });
  };

  const handleDeletePerson = (personId: string) => {
    dispatch({ type: "REMOVE_PERSON", payload: personId });
  };

  const handleAddPerson = (personId: string, paragraphId: string) => {
    if (!paragraphIds.includes(paragraphId)) {
      dispatch({ type: "ADD_PARAGRAPH_SILENT", payload: paragraphId });
    }
    dispatch({
      type: "ADD_PERSON",
      payload: { id: personId, paragraphId },
    });
  };

  const getPersonName = (id: string) =>
    ALL_PERSONS.find((p) => p.id === id)?.name ?? id;

  return (
    <div className="letters-editor">
      <h2 className="letters-editor__title">Postacie</h2>
      <p className="letters-editor__hint">
        Każda postać odpowiada paragrafowi, w którym jest spotykana. Postać i
        paragraf są automatycznie dodawane do spisu.
      </p>

      {persons.length > 0 && (
        <div className="letters-editor__section">
          <div className="letters-editor__label">Przypisane postacie</div>
          <div className="letters-editor__list">
            {persons.map((person) => (
              <PersonRow
                key={person.id}
                personId={person.id}
                personName={getPersonName(person.id)}
                paragraphId={person.paragraphId}
                paragraphIds={paragraphIds}
                paragraphUsedBy={paragraphUsedBy}
                onUpdate={handleUpdatePerson}
                onDelete={handleDeletePerson}
              />
            ))}
          </div>
        </div>
      )}

      {availablePersons.length > 0 ? (
        <AddPersonForm
          availablePersons={availablePersons}
          availableParasForAdd={availableParasForAdd}
          paragraphUsedBy={paragraphUsedBy}
          onAdd={handleAddPerson}
        />
      ) : (
        <div className="letters-editor__note">
          Wszystkie postacie ({ALL_PERSONS.length}) zostały już przypisane.
        </div>
      )}
    </div>
  );
};
