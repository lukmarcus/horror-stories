import React, { useMemo, useState } from "react";
import { useEditor } from "../../context/useEditor";
import type { EditorChoice } from "../../context/editorTypes";
import { sortParagraphIds } from "../../utils/editorUtils";
import { EditorPreview } from "./EditorPreview";
import { SimpleModeEditor } from "./SimpleModeEditor";
import { ParagraphHeader } from "./ParagraphHeader";
import "./EditorParagraphView.css";

interface EditorParagraphViewProps {
  paragraphId: string;
  onRemove: (id: string) => void;
  onNavigate: (id: string) => void;
  onNavigateToLetters?: () => void;
}

// ── EditorParagraphView ───────────────────────────────────────────────────────

export const EditorParagraphView: React.FC<EditorParagraphViewProps> = ({
  paragraphId,
  onRemove,
  onNavigate,
  onNavigateToLetters,
}) => {
  const { state, dispatch } = useEditor();
  const scenarioParagraphs = state.scenario?.paragraphs;
  const scenarioImages = state.scenario?.images;
  const paragraph = scenarioParagraphs?.find((p) => p.id === paragraphId);

  const [focusedTargetId, setFocusedTargetId] = useState<string | null>(null);

  const availableIds = useMemo(
    () =>
      sortParagraphIds(
        (scenarioParagraphs ?? [])
          .map((p) => p.id)
          .filter((id) => id !== paragraphId),
      ),
    [scenarioParagraphs, paragraphId],
  );

  const incomingFrom = useMemo(
    () =>
      sortParagraphIds(
        (scenarioParagraphs ?? [])
          .filter(
            (p) =>
              p.id !== paragraphId &&
              (p.choices ?? []).some((c) => c.nextParagraphId === paragraphId),
          )
          .map((p) => p.id),
      ),
    [scenarioParagraphs, paragraphId],
  );

  const paragraphLetter = useMemo(
    () =>
      state.scenario?.letters?.find((l) => l.paragraphId === paragraphId)?.id ??
      null,
    [state.scenario?.letters, paragraphId],
  );

  const usedIds = useMemo(() => {
    const set = new Set<string>();
    for (const p of scenarioParagraphs ?? []) {
      set.add(p.id);
      for (const a of p.aliases ?? []) set.add(a);
    }
    return set;
  }, [scenarioParagraphs]);

  if (!paragraph) return null;

  const isDeath = paragraphId === "100";

  // ── Simple mode choice handlers ──

  const handleUpdateChoice = (choice: EditorChoice) => {
    if ((choice.nextParagraphId ?? "").trim() === paragraphId) return;
    dispatch({ type: "UPDATE_CHOICE", payload: { paragraphId, choice } });
    const target = (choice.nextParagraphId ?? "").trim();
    if (target && !availableIds.includes(target) && target !== paragraphId) {
      dispatch({ type: "ADD_PARAGRAPH_SILENT", payload: target });
    }
  };

  return (
    <div className="editor-paragraph-view">
      <ParagraphHeader
        paragraphId={paragraphId}
        paragraph={paragraph}
        isDeath={isDeath}
        incomingFrom={incomingFrom}
        paragraphLetter={paragraphLetter}
        onNavigate={onNavigate}
        onNavigateToLetters={onNavigateToLetters}
        onRemove={onRemove}
        onAddAlias={(alias) => {
          if (alias === paragraphId) return "To już jest główny ID";
          if ((paragraph.aliases ?? []).includes(alias)) return "Już istnieje";
          if (usedIds.has(alias)) return "Zajęty przez inny paragraf";
          dispatch({
            type: "ADD_ALIAS",
            payload: { paragraphId, alias },
          });
          return null;
        }}
        onRemoveAlias={(alias) =>
          dispatch({
            type: "REMOVE_ALIAS",
            payload: { paragraphId, alias },
          })
        }
      />

      <div className="editor-paragraph-view__columns">
        <div className="editor-paragraph-view__editor">
          <SimpleModeEditor
            paragraphId={paragraphId}
            paragraph={paragraph}
            availableIds={availableIds}
            focusedTargetId={focusedTargetId}
            setFocusedTargetId={setFocusedTargetId}
            onUpdateChoice={handleUpdateChoice}
            onRemoveChoice={(id) =>
              dispatch({
                type: "REMOVE_CHOICE",
                payload: { paragraphId, choiceId: id },
              })
            }
            onAddChoice={(text, target) => {
              if (target === paragraphId) return;
              const choice: EditorChoice = {
                id: crypto.randomUUID(),
                text,
                nextParagraphId: target,
              };
              dispatch({
                type: "ADD_CHOICE",
                payload: { paragraphId, choice },
              });
              if (
                target &&
                !availableIds.includes(target) &&
                target !== paragraphId
              ) {
                dispatch({
                  type: "ADD_PARAGRAPH_SILENT",
                  payload: target,
                });
              }
            }}
            onSetText={(text) =>
              dispatch({
                type: "SET_PARAGRAPH_TEXT",
                payload: { id: paragraphId, text },
              })
            }
            onConvertToPages={() =>
              dispatch({
                type: "CONVERT_TEXT_TO_PAGES",
                payload: paragraphId,
              })
            }
          />
        </div>

        <EditorPreview
          paragraph={paragraph}
          scenarioImages={scenarioImages}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
};
