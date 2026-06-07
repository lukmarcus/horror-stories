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
  const steps = state.scenario?.setupSteps ?? [];

  return (
    <div className="setup-editor">
      <h2 className="setup-editor__title">Przygotowanie scenariusza</h2>
      <p className="setup-editor__hint">
        Kroki setupu są wyświetlane graczom przed rozpoczęciem gry. Każdy krok
        to treść z opcjonalnymi wyborami.
      </p>

      {steps.length === 0 && (
        <p className="setup-editor__empty">
          Brak kroków. Kliknij „Dodaj krok", aby zacząć.
        </p>
      )}

      {steps.map((step, index) => {
        const choices = step.choices ?? [];

        const handleUpdateChoice = (updated: EditorChoice) => {
          dispatch({
            type: "SET_SETUP_STEP_CHOICES",
            payload: {
              stepIndex: index,
              choices: choices.map((c) => (c.id === updated.id ? updated : c)),
            },
          });
        };

        const handleRemoveChoice = (id: string) => {
          dispatch({
            type: "SET_SETUP_STEP_CHOICES",
            payload: {
              stepIndex: index,
              choices: choices.filter((c) => c.id !== id),
            },
          });
        };

        const handleAddChoice = (text: string, target: string) => {
          dispatch({
            type: "SET_SETUP_STEP_CHOICES",
            payload: {
              stepIndex: index,
              choices: [
                ...choices,
                {
                  id: crypto.randomUUID(),
                  text,
                  nextParagraphId: target || undefined,
                },
              ],
            },
          });
        };

        return (
          <div key={index} className="setup-editor__step">
            <div className="setup-editor__step-header">
              <span className="setup-editor__step-number">
                Krok {step.stepNumber}
              </span>
              <button
                className="setup-editor__remove"
                onClick={() =>
                  dispatch({ type: "REMOVE_SETUP_STEP", payload: index })
                }
                title="Usuń krok"
              >
                ✕
              </button>
            </div>
            <PagesEditor
              paragraphId={`__setup_${index}`}
              pages={[step.content]}
              singlePage
              onPagesChange={(pages) =>
                dispatch({
                  type: "SET_SETUP_STEP_CONTENT",
                  payload: { stepIndex: index, content: pages[0] ?? [] },
                })
              }
            />
            <div className="setup-editor__choices">
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
          </div>
        );
      })}

      <button
        className="editor-btn editor-btn--primary setup-editor__add-btn"
        onClick={() => dispatch({ type: "ADD_SETUP_STEP" })}
      >
        + Dodaj krok
      </button>
    </div>
  );
};
