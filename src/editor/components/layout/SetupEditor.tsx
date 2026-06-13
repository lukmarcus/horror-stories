import React, { useContext, useMemo, useState } from "react";
import { EditorContext } from "../../context/editorTypes";
import type { EditorChoice } from "../../context/editorTypes";
import { PagesEditor } from "../paragraph/PagesEditor";
import { ChoiceRow } from "../paragraph/ChoiceRow";
import { ChoiceAddRow } from "../paragraph/ChoiceAddRow";
import { sortParagraphIds } from "../../utils/editorUtils";
import "./SetupEditor.css";

export const SetupEditor: React.FC = () => {
  const editorCtx = useContext(EditorContext);

  const paragraphIds = useMemo(
    () =>
      sortParagraphIds(
        (editorCtx?.state.scenario?.paragraphs ?? []).map((p) => p.id),
      ),
    [editorCtx?.state.scenario?.paragraphs],
  );

  const [focusedChoiceId, setFocusedChoiceId] = useState<string | null>(null);

  if (!editorCtx) return null;

  const { state, dispatch } = editorCtx;
  const setup = state.scenario?.setup;
  const pages = setup?.pages ?? [[]];
  const choices = setup?.choices ?? [];

  const handleUpdateChoice = (updated: EditorChoice) => {
    dispatch({
      type: "SET_SETUP_CHOICES",
      payload: choices.map((c) => (c.id === updated.id ? updated : c)),
    });
  };

  const handleRemoveChoice = (id: string) => {
    dispatch({
      type: "SET_SETUP_CHOICES",
      payload: choices.filter((c) => c.id !== id),
    });
  };

  const handleAddChoice = (text: string, target: string) => {
    dispatch({
      type: "SET_SETUP_CHOICES",
      payload: [
        ...choices,
        {
          id: crypto.randomUUID(),
          text,
          nextParagraphId: target || undefined,
        },
      ],
    });
  };

  return (
    <div className="setup-editor">
      <h2 className="setup-editor__title">Przygotowanie scenariusza</h2>
      <p className="setup-editor__hint">
        Strony setupu są wyświetlane graczom przed rozpoczęciem gry. Wybory
        pojawią się na ostatniej stronie.
      </p>

      {!setup && (
        <p className="setup-editor__empty">
          Brak treści setupu. Kliknij „Dodaj stronę", aby zacząć.
        </p>
      )}

      {setup && (
        <>
          <PagesEditor
            paragraphId="__setup__"
            pages={pages}
            onPagesChange={(newPages) =>
              dispatch({ type: "SET_SETUP_PAGES", payload: newPages })
            }
          />

          <div className="setup-editor__choices">
            <h3 className="setup-editor__choices-title">
              Wybory (ostatnia strona)
            </h3>
            {choices.map((choice) => (
              <ChoiceRow
                key={choice.id}
                choice={choice}
                paragraphIds={paragraphIds}
                focusedId={focusedChoiceId}
                setFocusedId={setFocusedChoiceId}
                onUpdate={handleUpdateChoice}
                onRemove={handleRemoveChoice}
              />
            ))}
            <ChoiceAddRow
              prefixLabel="§"
              targetList={paragraphIds}
              onAdd={handleAddChoice}
            />
          </div>
        </>
      )}

      <button
        className="editor-btn editor-btn--primary setup-editor__add-btn"
        onClick={() => dispatch({ type: "ADD_SETUP_PAGE" })}
      >
        + Dodaj stronę
      </button>
    </div>
  );
};
