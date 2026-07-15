import React, { useContext, useMemo } from "react";
import { EditorContext } from "../../context/editorTypes";
import { LetterRow } from "./LetterRow";
import { AddLetterForm } from "./AddLetterForm";
import "./ItemEditor.css";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const LettersEditor: React.FC = () => {
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

  const usedLetters = useMemo(
    () => new Set((editorCtx?.state.scenario?.letters ?? []).map((l) => l.id)),
    [editorCtx?.state.scenario?.letters],
  );

  // paragraphId → letterId that's using it
  const paragraphUsedBy = useMemo(
    () =>
      Object.fromEntries(
        (editorCtx?.state.scenario?.letters ?? []).map((l) => [
          l.paragraphId,
          l.id,
        ]),
      ),
    [editorCtx?.state.scenario?.letters],
  );

  const availableLetters = useMemo(
    () => ALPHABET.filter((l) => !usedLetters.has(l)),
    [usedLetters],
  );

  // Paragraphs available for new assignments (not used by any letter yet)
  const availableParasForAdd = useMemo(
    () => paragraphIds.filter((id) => !paragraphUsedBy[id]),
    [paragraphIds, paragraphUsedBy],
  );

  if (!editorCtx) return null;

  const { state, dispatch } = editorCtx;
  const letters = [...(state.scenario?.letters ?? [])].sort((a, b) =>
    a.id.localeCompare(b.id),
  );

  const handleUpdateLetter = (letterId: string, newParagraphId: string) => {
    if (!paragraphIds.includes(newParagraphId)) {
      dispatch({ type: "ADD_PARAGRAPH_SILENT", payload: newParagraphId });
    }
    dispatch({
      type: "UPDATE_LETTER",
      payload: { id: letterId, paragraphId: newParagraphId },
    });
  };

  const handleDeleteLetter = (letterId: string) => {
    dispatch({ type: "REMOVE_LETTER", payload: letterId });
  };

  const handleAddLetter = (letterId: string, paragraphId: string) => {
    if (!paragraphIds.includes(paragraphId)) {
      dispatch({ type: "ADD_PARAGRAPH_SILENT", payload: paragraphId });
    }
    dispatch({
      type: "ADD_LETTER",
      payload: { id: letterId, paragraphId },
    });
  };

  return (
    <div className="item-editor">
      <h2 className="item-editor__title">Żetony alfabetu</h2>
      <p className="item-editor__hint">
        Każda litera odpowiada paragrafowi odkrywanemu przez gracza po
        znalezieniu żetonu.
      </p>

      {letters.length > 0 && (
        <div className="item-editor__section">
          <div className="item-editor__label">Przypisane litery</div>
          <div className="item-editor__list">
            {letters.map((letter) => (
              <LetterRow
                key={letter.id}
                letterId={letter.id}
                paragraphId={letter.paragraphId}
                paragraphIds={paragraphIds}
                paragraphUsedBy={paragraphUsedBy}
                onUpdate={handleUpdateLetter}
                onDelete={handleDeleteLetter}
              />
            ))}
          </div>
        </div>
      )}

      {availableLetters.length > 0 ? (
        <AddLetterForm
          availableLetters={availableLetters}
          availableParasForAdd={availableParasForAdd}
          paragraphUsedBy={paragraphUsedBy}
          onAdd={handleAddLetter}
        />
      ) : (
        <div className="item-editor__note">
          Wszystkie litery (A–Z) zostały już przypisane.
        </div>
      )}
    </div>
  );
};
