import React, { useState } from "react";
import { useEditor } from "../../context/useEditor";
import { ParagraphText } from "../../../components/text/ParagraphText/ParagraphText";
import { RichText } from "../../../components/text/RichText/RichText";
import type { EditorChoice } from "../../context/editorTypes";
import { PagesEditor } from "./PagesEditor";
import "./EditorParagraphView.css";

interface EditorParagraphViewProps {
  paragraphId: string;
  onRemove: (id: string) => void;
  onNavigate: (id: string) => void;
}

export const EditorParagraphView: React.FC<EditorParagraphViewProps> = ({
  paragraphId,
  onRemove,
  onNavigate,
}) => {
  const { state, dispatch } = useEditor();
  const paragraph = state.scenario?.paragraphs.find(
    (p) => p.id === paragraphId,
  );

  const [newChoiceText, setNewChoiceText] = useState("");
  const [newChoiceTarget, setNewChoiceTarget] = useState("");

  if (!paragraph) return null;

  const isDeath = paragraphId === "100";
  const text = paragraph.text ?? "";

  // Use pages if available, otherwise fall back to legacy text field
  const pages = paragraph.pages ?? null;
  const hasPages = pages !== null;

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

  const availableIds = (state.scenario?.paragraphs ?? [])
    .map((p) => p.id)
    .filter((id) => id !== paragraphId)
    .sort((a, b) => {
      const na = parseInt(a, 10);
      const nb = parseInt(b, 10);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return a.localeCompare(b);
    });

  const handleAddChoice = () => {
    const text = newChoiceText.trim();
    const target = newChoiceTarget.trim();
    if (!text) return;
    const choice: EditorChoice = {
      id: crypto.randomUUID(),
      text,
      nextParagraphId: target,
    };
    dispatch({ type: "ADD_CHOICE", payload: { paragraphId, choice } });
    setNewChoiceText("");
    setNewChoiceTarget("");
  };

  const handleUpdateChoice = (choice: EditorChoice) => {
    dispatch({ type: "UPDATE_CHOICE", payload: { paragraphId, choice } });
  };

  const handleRemoveChoice = (choiceId: string) => {
    dispatch({ type: "REMOVE_CHOICE", payload: { paragraphId, choiceId } });
  };

  const incomingFrom = (state.scenario?.paragraphs ?? [])
    .filter(
      (p) =>
        p.id !== paragraphId &&
        (p.choices ?? []).some((c) => c.nextParagraphId === paragraphId),
    )
    .map((p) => p.id)
    .sort((a, b) => {
      const na = parseInt(a, 10);
      const nb = parseInt(b, 10);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return a.localeCompare(b);
    });

  return (
    <div className="editor-paragraph-view">
      <div className="editor-paragraph-view__header">
        <div className="editor-paragraph-view__header-left">
          <h2 className="editor-paragraph-view__title">§{paragraphId}</h2>
          <div className="editor-paragraph-view__incoming">
            <span className="editor-paragraph-view__incoming-label">
              Prowadzi tutaj:
            </span>
            {incomingFrom.length > 0 ? (
              incomingFrom.map((id) => (
                <button
                  key={id}
                  className="editor-paragraph-view__incoming-tag"
                  onClick={() => onNavigate(id)}
                  title={`Przejdź do §${id}`}
                >
                  §{id}
                </button>
              ))
            ) : (
              <span className="editor-paragraph-view__incoming-empty">
                brak połączeń
              </span>
            )}
          </div>
        </div>
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
          {hasPages ? (
            <>
              <span className="editor-paragraph-view__label">Treść</span>
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
                onChange={handleTextChange}
                placeholder="Wpisz treść paragrafu…"
                rows={12}
              />
              <button
                className="editor-paragraph-view__migrate-btn"
                onClick={() => {
                  // Convert legacy text to pages format
                  const lines = text.split("\n").filter((l) => l.trim() !== "");
                  const page = lines.map((line) => ({
                    type: "text" as const,
                    text: line,
                  }));
                  dispatch({
                    type: "LOAD_SCENARIO",
                    payload: {
                      ...state.scenario!,
                      paragraphs: state.scenario!.paragraphs.map((p) =>
                        p.id === paragraphId
                          ? {
                              ...p,
                              pages: [page.length > 0 ? page : []],
                              text: undefined,
                            }
                          : p,
                      ),
                    },
                  });
                }}
              >
                Przekonwertuj na bloki
              </button>
            </>
          )}

          <div className="editor-paragraph-view__choices">
            <span className="editor-paragraph-view__label">Wybory</span>

            {(paragraph.choices ?? []).map((choice) => (
              <div
                key={choice.id}
                className="editor-paragraph-view__choice-row"
              >
                <input
                  className="editor-paragraph-view__choice-text"
                  type="text"
                  value={choice.text}
                  onChange={(e) =>
                    handleUpdateChoice({ ...choice, text: e.target.value })
                  }
                  placeholder="Tekst wyboru"
                />
                <span className="editor-paragraph-view__choice-arrow">→</span>
                <select
                  className="editor-paragraph-view__choice-target"
                  value={choice.nextParagraphId}
                  onChange={(e) =>
                    handleUpdateChoice({
                      ...choice,
                      nextParagraphId: e.target.value,
                    })
                  }
                >
                  <option value="">— brak —</option>
                  {availableIds.map((id) => (
                    <option key={id} value={id}>
                      §{id}
                    </option>
                  ))}
                </select>
                <button
                  className="editor-paragraph-view__choice-remove"
                  onClick={() => handleRemoveChoice(choice.id)}
                  title="Usuń wybór"
                >
                  ✕
                </button>
              </div>
            ))}

            <div className="editor-paragraph-view__choice-add">
              <input
                className="editor-paragraph-view__choice-text"
                type="text"
                value={newChoiceText}
                onChange={(e) => setNewChoiceText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddChoice()}
                placeholder="Tekst nowego wyboru"
              />
              <span className="editor-paragraph-view__choice-arrow">→</span>
              <select
                className="editor-paragraph-view__choice-target"
                value={newChoiceTarget}
                onChange={(e) => setNewChoiceTarget(e.target.value)}
              >
                <option value="">— brak —</option>
                {availableIds.map((id) => (
                  <option key={id} value={id}>
                    §{id}
                  </option>
                ))}
              </select>
              <button
                className="editor-paragraph-view__choice-add-btn"
                onClick={handleAddChoice}
                title="Dodaj wybór"
              >
                + Dodaj
              </button>
            </div>
          </div>
        </div>

        <div className="editor-paragraph-view__preview">
          <span className="editor-paragraph-view__label">Podgląd</span>
          <div className="editor-paragraph-view__preview-content">
            {hasPages ? (
              pages.length === 0 ||
              (pages.length === 1 && pages[0].length === 0) ? (
                <p className="editor-paragraph-view__preview-empty">
                  Brak treści
                </p>
              ) : (
                pages.map((page, i) => (
                  <div key={i} className="editor-paragraph-view__preview-page">
                    {pages.length > 1 && (
                      <span className="editor-paragraph-view__preview-page-label">
                        Strona {i + 1}
                      </span>
                    )}
                    <RichText content={page} />
                  </div>
                ))
              )
            ) : text ? (
              text
                .split("\n")
                .map((line, i) => (
                  <ParagraphText
                    key={i}
                    text={line}
                    className="editor-paragraph-view__preview-paragraph"
                  />
                ))
            ) : (
              <p className="editor-paragraph-view__preview-empty">
                Brak treści
              </p>
            )}
            {(paragraph.choices ?? []).length > 0 && (
              <ul className="editor-paragraph-view__preview-choices">
                {(paragraph.choices ?? []).map((choice) => (
                  <li
                    key={choice.id}
                    className="editor-paragraph-view__preview-choice"
                  >
                    {choice.text}
                    {choice.nextParagraphId && (
                      <>
                        {" "}
                        →{" "}
                        <button
                          className="editor-paragraph-view__preview-choice-target"
                          onClick={() => onNavigate(choice.nextParagraphId)}
                          title={`Przejdź do §${choice.nextParagraphId}`}
                        >
                          §{choice.nextParagraphId}
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
