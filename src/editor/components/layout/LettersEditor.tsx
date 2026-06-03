import React, { useContext, useMemo, useState } from "react";
import { EditorContext } from "../../context/editorTypes";
import "./LettersEditor.css";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const LettersEditor: React.FC = () => {
  const editorCtx = useContext(EditorContext);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [newLetter, setNewLetter] = useState("");
  const [newParaInput, setNewParaInput] = useState("");
  const [addError, setAddError] = useState("");
  // per-row editing: letterId → current input value
  const [editingValues, setEditingValues] = useState<Record<string, string>>(
    {},
  );
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

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

  const effectiveLetter = newLetter || availableLetters[0] || "";

  const handleAdd = () => {
    setAddError("");
    if (!effectiveLetter) {
      setAddError("Brak dostępnych liter.");
      return;
    }
    const paraId = newParaInput.trim();
    if (!paraId) {
      setAddError("Podaj numer paragrafu.");
      return;
    }
    if (
      paragraphUsedBy[paraId] &&
      paragraphUsedBy[paraId] !== effectiveLetter
    ) {
      setAddError(
        `Paragraf \u00a7${paraId} jest już przypisany do litery ${paragraphUsedBy[paraId]}.`,
      );
      return;
    }
    if (!paragraphIds.includes(paraId)) {
      dispatch({ type: "ADD_PARAGRAPH_SILENT", payload: paraId });
    }
    dispatch({
      type: "ADD_LETTER",
      payload: { id: effectiveLetter, paragraphId: paraId },
    });
    setNewLetter("");
    setNewParaInput("");
    setAddError("");
  };

  const clearEditRow = (letterId: string) => {
    setEditingValues((prev) => {
      const next = { ...prev };
      delete next[letterId];
      return next;
    });
    setEditErrors((prev) => {
      const next = { ...prev };
      delete next[letterId];
      return next;
    });
  };

  const handleEditCommit = (letterId: string, currentParagraphId: string) => {
    const raw = editingValues[letterId];
    if (raw === undefined) return;
    const paraId = raw.trim();
    if (!paraId || paraId === currentParagraphId) {
      clearEditRow(letterId);
      return;
    }
    if (paragraphUsedBy[paraId] && paragraphUsedBy[paraId] !== letterId) {
      setEditErrors((prev) => ({
        ...prev,
        [letterId]: `Paragraf \u00a7${paraId} jest już przypisany do litery ${paragraphUsedBy[paraId]}.`,
      }));
      return;
    }
    if (!paragraphIds.includes(paraId)) {
      dispatch({ type: "ADD_PARAGRAPH_SILENT", payload: paraId });
    }
    dispatch({
      type: "UPDATE_LETTER",
      payload: { id: letterId, paragraphId: paraId },
    });
    clearEditRow(letterId);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: "REMOVE_LETTER", payload: id });
    setConfirmDeleteId(null);
  };

  return (
    <div className="letters-editor">
      <h2 className="letters-editor__title">Żetony alfabetu</h2>
      <p className="letters-editor__hint">
        Każda litera odpowiada paragrafowi odkrywanemu przez gracza po
        znalezieniu żetonu.
      </p>

      {letters.length > 0 && (
        <div className="letters-editor__section">
          <div className="letters-editor__label">Przypisane litery</div>
          <div className="letters-editor__list">
            {letters.map((letter) => {
              const editVal = editingValues[letter.id] ?? letter.paragraphId;
              const editErr = editErrors[letter.id];
              const availableParasForEdit = paragraphIds.filter(
                (id) => !paragraphUsedBy[id] || id === letter.paragraphId,
              );
              return (
                <div key={letter.id} className="letters-editor__row">
                  <span className="letters-editor__letter-badge">
                    {letter.id}
                  </span>

                  <div className="letters-editor__edit-para">
                    <input
                      className={`letters-editor__para-input${
                        editErr ? " letters-editor__para-input--error" : ""
                      }`}
                      type="text"
                      list={`para-list-${letter.id}`}
                      value={editVal}
                      onChange={(e) =>
                        setEditingValues((prev) => ({
                          ...prev,
                          [letter.id]: e.target.value,
                        }))
                      }
                      onBlur={() =>
                        handleEditCommit(letter.id, letter.paragraphId)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          handleEditCommit(letter.id, letter.paragraphId);
                        if (e.key === "Escape") clearEditRow(letter.id);
                      }}
                    />
                    <datalist id={`para-list-${letter.id}`}>
                      {availableParasForEdit.map((pid) => (
                        <option key={pid} value={pid} />
                      ))}
                    </datalist>
                    {editErr && (
                      <div className="letters-editor__row-error">{editErr}</div>
                    )}
                  </div>

                  {confirmDeleteId === letter.id ? (
                    <span className="letters-editor__confirm">
                      <span className="letters-editor__confirm-text">
                        Usunąć?
                      </span>
                      <button
                        className="editor-btn editor-btn--danger editor-btn--sm"
                        onClick={() => handleDelete(letter.id)}
                      >
                        Tak
                      </button>
                      <button
                        className="editor-btn editor-btn--sm"
                        onClick={() => setConfirmDeleteId(null)}
                      >
                        Nie
                      </button>
                    </span>
                  ) : (
                    <button
                      className="letters-editor__remove"
                      onClick={() => setConfirmDeleteId(letter.id)}
                      title="Usuń przypisanie"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {availableLetters.length > 0 ? (
        <div className="letters-editor__section">
          <div className="letters-editor__label">Dodaj literę</div>
          <div className="letters-editor__add-row">
            <select
              className="letters-editor__select letters-editor__select--letter"
              value={effectiveLetter}
              onChange={(e) => setNewLetter(e.target.value)}
            >
              {availableLetters.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            <input
              className="letters-editor__para-input"
              type="text"
              list="para-list-new"
              value={newParaInput}
              onChange={(e) => setNewParaInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
              }}
              placeholder="numer §…"
            />
            <datalist id="para-list-new">
              {availableParasForAdd.map((pid) => (
                <option key={pid} value={pid} />
              ))}
            </datalist>

            <button
              className="editor-btn editor-btn--primary"
              onClick={handleAdd}
              disabled={!effectiveLetter || !newParaInput.trim()}
            >
              Dodaj
            </button>
          </div>
          {addError && <div className="letters-editor__error">{addError}</div>}
          <p className="letters-editor__add-hint">
            Możesz wpisać istniejący lub nowy numer § — zostanie automatycznie
            utworzony.
          </p>
        </div>
      ) : (
        <div className="letters-editor__note">
          Wszystkie litery (A–Z) zostały już przypisane.
        </div>
      )}
    </div>
  );
};
