import React, { useContext } from "react";
import { EditorContext } from "../../context/editorTypes";
import { PagesEditor } from "../paragraph/PagesEditor";
import "./SetupEditor.css";

export const SetupEditor: React.FC = () => {
  const editorCtx = useContext(EditorContext);
  if (!editorCtx) return null;

  const { state, dispatch } = editorCtx;
  const steps = state.scenario?.setupSteps ?? [];

  return (
    <div className="setup-editor">
      <h2 className="setup-editor__title">Przygotowanie scenariusza</h2>
      <p className="setup-editor__hint">
        Kroki setupu są wyświetlane graczom przed rozpoczęciem gry. Każdy krok
        to jedna strona z treścią.
      </p>

      {steps.length === 0 && (
        <p className="setup-editor__empty">
          Brak kroków. Kliknij „Dodaj krok", aby zacząć.
        </p>
      )}

      {steps.map((step, index) => (
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
            pages={step.pages}
            onPagesChange={(pages) =>
              dispatch({
                type: "SET_SETUP_STEP_PAGES",
                payload: { stepIndex: index, pages },
              })
            }
          />
        </div>
      ))}

      <button
        className="editor-btn editor-btn--primary setup-editor__add-btn"
        onClick={() => dispatch({ type: "ADD_SETUP_STEP" })}
      >
        + Dodaj krok
      </button>
    </div>
  );
};
