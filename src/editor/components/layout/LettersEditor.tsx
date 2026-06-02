import React, { useContext, useMemo, useState } from "react";
import { EditorContext } from "../../context/editorTypes";
import { Button } from "../../../components/ui/Button";
import "./LettersEditor.css";

export const LettersEditor: React.FC = () => {
  const editorCtx = useContext(EditorContext);
  if (!editorCtx) return <div>Błąd kontekstu edytora</div>;

  const { state, dispatch } = editorCtx;
  const letters = state.scenario?.letters ?? [];
  const paragraphs = state.scenario?.paragraphs ?? [];
  const paragraphIds = useMemo(
    () =>
      paragraphs
        .map((p) => p.id)
        .sort((a, b) => {
          const na = parseInt(a, 10);
          const nb = parseInt(b, 10);
          if (!isNaN(na) && !isNaN(nb)) return na - nb;
          return a.localeCompare(b);
        }),
    [paragraphs],
  );

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [newLetterId, setNewLetterId] = useState("");
  const [newLetterParagraphId, setNewLetterParagraphId] = useState(
    paragraphIds[0] ?? "",
  );
  const [addError, setAddError] = useState("");

  const handleAddLetter = () => {
    setAddError("");
    const id = newLetterId.toLowerCase().trim();

    if (!id) {
      setAddError("Identyfikator litery nie może być pusty");
      return;
    }

    if (!/^[a-z]+$/.test(id)) {
      setAddError("Tylko małe litery (a-z)");
      return;
    }

    if (letters.some((l) => l.id === id)) {
      setAddError(`Litera „${id}" już istnieje`);
      return;
    }

    if (!newLetterParagraphId) {
      setAddError("Wybierz paragraf");
      return;
    }

    dispatch({
      type: "ADD_LETTER",
      payload: { id, paragraphId: newLetterParagraphId },
    });

    setNewLetterId("");
    setNewLetterParagraphId(paragraphIds[0] ?? "");
  };

  const handleUpdateLetter = (id: string, paragraphId: string) => {
    dispatch({
      type: "UPDATE_LETTER",
      payload: { id, paragraphId },
    });
  };

  const handleDeleteLetter = (id: string) => {
    dispatch({
      type: "REMOVE_LETTER",
      payload: id,
    });
    setConfirmDeleteId(null);
  };

  return (
    <div className="letters-editor">
      <h2 className="letters-editor__title">Żetony alfabetu</h2>

      {letters.length > 0 && (
        <div className="letters-editor__list">
          {letters.map((letter) => (
            <div key={letter.id} className="letters-editor__row">
              <span className="letters-editor__letter-id">{letter.id}</span>

              <select
                className="letters-editor__select"
                value={letter.paragraphId}
                onChange={(e) => handleUpdateLetter(letter.id, e.target.value)}
              >
                {paragraphIds.map((pid) => (
                  <option key={pid} value={pid}>
                    § {pid}
                  </option>
                ))}
              </select>

              {confirmDeleteId === letter.id ? (
                <>
                  <button
                    className="letters-editor__confirm-btn letters-editor__confirm-btn--yes"
                    onClick={() => handleDeleteLetter(letter.id)}
                  >
                    Tak
                  </button>
                  <button
                    className="letters-editor__confirm-btn letters-editor__confirm-btn--no"
                    onClick={() => setConfirmDeleteId(null)}
                  >
                    Nie
                  </button>
                </>
              ) : (
                <button
                  className="letters-editor__remove-btn"
                  onClick={() => setConfirmDeleteId(letter.id)}
                  title="Usuń tę literę"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="letters-editor__add-section">
        <h3 className="letters-editor__add-title">Dodaj nową literę</h3>
        <div className="letters-editor__add-row">
          <input
            className="letters-editor__input"
            type="text"
            placeholder="a, b, c…"
            value={newLetterId}
            onChange={(e) => setNewLetterId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddLetter();
            }}
          />

          <select
            className="letters-editor__select"
            value={newLetterParagraphId}
            onChange={(e) => setNewLetterParagraphId(e.target.value)}
          >
            {paragraphIds.map((pid) => (
              <option key={pid} value={pid}>
                § {pid}
              </option>
            ))}
          </select>

          <Button
            onClick={handleAddLetter}
            disabled={!newLetterId || !newLetterParagraphId}
          >
            + Dodaj
          </Button>
        </div>
        {addError && <div className="letters-editor__error">{addError}</div>}
      </div>
    </div>
  );
};
