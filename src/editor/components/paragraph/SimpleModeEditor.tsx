import React from "react";
import { PagesEditor } from "./PagesEditor";
import { ChoiceRow } from "./ChoiceRow";
import { ChoiceAddRow } from "./ChoiceAddRow";
import type { EditorParagraph, EditorChoice } from "../../context/editorTypes";

interface SimpleModeEditorProps {
  paragraphId: string;
  paragraph: EditorParagraph;
  availableIds: string[];
  focusedTargetId: string | null;
  setFocusedTargetId: (id: string | null) => void;
  onUpdateChoice: (choice: EditorChoice) => void;
  onRemoveChoice: (choiceId: string) => void;
  onAddChoice: (text: string, target: string) => void;
  onSetText: (text: string) => void;
  onConvertToPages: () => void;
  onToggleHorizontal: (value: boolean) => void;
}

export const SimpleModeEditor: React.FC<SimpleModeEditorProps> = ({
  paragraphId,
  paragraph,
  availableIds,
  focusedTargetId,
  setFocusedTargetId,
  onUpdateChoice,
  onRemoveChoice,
  onAddChoice,
  onSetText,
  onConvertToPages,
  onToggleHorizontal,
}) => {
  const text = paragraph.text ?? "";
  const pages = paragraph.pages ?? null;
  const hasPages = pages !== null;
  const isHorizontal = !!paragraph.areChoicesHorizontal;

  return (
    <>
      {hasPages ? (
        <>
          <h2 className="editor-paragraph-view__label">Treść</h2>
          <PagesEditor paragraphId={paragraphId} pages={pages} />
        </>
      ) : (
        <>
          <label
            className="editor-paragraph-view__label"
            htmlFor={`paragraph-text-${paragraphId}`}
          >
            Treść{" "}
            <span className="editor-paragraph-view__label-hint">
              (stary format — tylko tekst)
            </span>
          </label>
          <textarea
            id={`paragraph-text-${paragraphId}`}
            className="editor-paragraph-view__textarea"
            value={text}
            onChange={(e) => onSetText(e.target.value)}
            placeholder="Wpisz treść paragrafu…"
            rows={12}
          />
          <button
            className="editor-paragraph-view__migrate-btn"
            onClick={onConvertToPages}
          >
            Przekonwertuj na bloki
          </button>
        </>
      )}

      <div className="editor-paragraph-view__choices">
        <div className="editor-paragraph-view__choices-heading-row">
          <h3 className="editor-paragraph-view__label">Wybory</h3>
          <button
            className={`editor-paragraph-view__layout-btn${isHorizontal ? " editor-paragraph-view__layout-btn--active" : ""}`}
            onClick={() => onToggleHorizontal(!isHorizontal)}
            title={
              isHorizontal
                ? "Pionowe wybory (kliknij)"
                : "Poziome wybory (kliknij)"
            }
          >
            {isHorizontal ? "→ Poziome" : "↓ Pionowe"}
          </button>
        </div>

        {(paragraph.choices ?? []).map((choice) => (
          <ChoiceRow
            key={choice.id}
            choice={choice}
            paragraphIds={availableIds}
            focusedId={focusedTargetId}
            setFocusedId={setFocusedTargetId}
            onUpdate={onUpdateChoice}
            onRemove={onRemoveChoice}
          />
        ))}

        <ChoiceAddRow
          prefixLabel="§"
          targetList={availableIds}
          onAdd={onAddChoice}
        />
      </div>
    </>
  );
};
