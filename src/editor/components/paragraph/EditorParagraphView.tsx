import React, { useMemo, useState } from "react";
import { useEditor } from "../../context/useEditor";
import type { EditorChoice } from "../../context/editorTypes";
import { sortParagraphIds } from "../../utils/editorUtils";
import { EditorPreview } from "./EditorPreview";
import { VariantsSection } from "./VariantsSection";
import { SimpleModeEditor } from "./SimpleModeEditor";
import { VariantModeEditor } from "./VariantModeEditor";
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

  const variantIds = useMemo(
    () => Object.keys(paragraph?.variants ?? {}),
    [paragraph?.variants],
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
  const isVariantMode = !!paragraph.variants;

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
        isVariantMode={isVariantMode}
        isDeath={isDeath}
        incomingFrom={incomingFrom}
        paragraphLetter={paragraphLetter}
        variantIds={variantIds}
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
        onSwitchToSimple={() =>
          dispatch({
            type: "DISABLE_VARIANT_MODE",
            payload: paragraphId,
          })
        }
        onSwitchToVariant={() =>
          dispatch({
            type: "ENABLE_VARIANT_MODE",
            payload: paragraphId,
          })
        }
      />

      <div className="editor-paragraph-view__columns">
        <div className="editor-paragraph-view__editor">
          {!isVariantMode && (
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
          )}

          {isVariantMode && (
            <VariantModeEditor
              paragraphId={paragraphId}
              paragraph={paragraph}
              variantIds={variantIds}
              onUpdateSelector={(choice) =>
                dispatch({
                  type: "UPDATE_VARIANT_SELECTOR",
                  payload: { paragraphId, choice },
                })
              }
              onRemoveSelector={(choiceId) =>
                dispatch({
                  type: "REMOVE_VARIANT_SELECTOR",
                  payload: { paragraphId, choiceId },
                })
              }
              onAddSelector={(text, target) => {
                const choice: EditorChoice = {
                  id: crypto.randomUUID(),
                  text,
                  nextVariantId: target,
                };
                dispatch({
                  type: "ADD_VARIANT_SELECTOR",
                  payload: { paragraphId, choice },
                });
              }}
            />
          )}
        </div>

        {/* Preview — oba tryby */}
        <EditorPreview
          paragraph={paragraph}
          isVariantMode={isVariantMode}
          scenarioImages={scenarioImages}
          onNavigate={onNavigate}
        />
      </div>

      {/* Warianty — poza gridem, pełna szerokość */}
      {isVariantMode && (
        <VariantsSection
          paragraphId={paragraphId}
          paragraph={paragraph}
          variantIds={variantIds}
          availableIds={availableIds}
          onAddVariant={(variantId) =>
            dispatch({
              type: "ADD_VARIANT",
              payload: { paragraphId, variantId },
            })
          }
        />
      )}
    </div>
  );
};
