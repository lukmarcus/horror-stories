import React from "react";
import { useEditor } from "../../context/useEditor";
import { ParagraphText } from "../../../components/text/ParagraphText/ParagraphText";
import "./EditorParagraphView.css";

interface EditorParagraphViewProps {
  paragraphId: string;
  onRemove: (id: string) => void;
}

export const EditorParagraphView: React.FC<EditorParagraphViewProps> = ({
  paragraphId,
  onRemove,
}) => {
  const { state, dispatch } = useEditor();
  const paragraph = state.scenario?.paragraphs.find(
    (p) => p.id === paragraphId,
  );

  if (!paragraph) return null;

  const isDeath = paragraphId === "100";
  const text = paragraph.text ?? "";

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({
      type: "SET_PARAGRAPH_TEXT",
      payload: { id: paragraphId, text: e.target.value },
    });
  };

  const handleRemove = () => {
    if (window.confirm(`Usunąć paragraf §${paragraphId}?`)) {
      onRemove(paragraphId);
    }
  };

  return (
    <div className="editor-paragraph-view">
      <div className="editor-paragraph-view__header">
        <h2 className="editor-paragraph-view__title">§{paragraphId}</h2>
        <button
          className="editor-paragraph-view__remove-btn"
          onClick={isDeath ? undefined : handleRemove}
          disabled={isDeath}
          title={
            isDeath ? "Nie można usunąć paragrafu §100" : `Usuń §${paragraphId}`
          }
        >
          {isDeath ? "Nie można usunąć" : "Usuń paragraf"}
        </button>
      </div>

      <div className="editor-paragraph-view__columns">
        <div className="editor-paragraph-view__editor">
          <label
            className="editor-paragraph-view__label"
            htmlFor={`paragraph-text-${paragraphId}`}
          >
            Treść
          </label>
          <textarea
            id={`paragraph-text-${paragraphId}`}
            className="editor-paragraph-view__textarea"
            value={text}
            onChange={handleTextChange}
            placeholder="Wpisz treść paragrafu…"
            rows={20}
          />
        </div>

        <div className="editor-paragraph-view__preview">
          <span className="editor-paragraph-view__label">Podgląd</span>
          <div className="editor-paragraph-view__preview-content">
            {text ? (
              <ParagraphText text={text} />
            ) : (
              <p className="editor-paragraph-view__preview-empty">
                Brak treści
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
