import React, { useState } from "react";
import { VariantEditor } from "./VariantEditor";
import type { EditorParagraph } from "../../context/editorTypes";

interface VariantsSectionProps {
  paragraphId: string;
  paragraph: EditorParagraph;
  variantIds: string[];
  availableIds: string[];
  onAddVariant: (variantId: string) => void;
}

export const VariantsSection: React.FC<VariantsSectionProps> = ({
  paragraphId,
  paragraph,
  variantIds,
  availableIds,
  onAddVariant,
}) => {
  const [newVariantId, setNewVariantId] = useState("");

  const handleAddVariant = () => {
    if (!newVariantId.trim()) return;
    onAddVariant(newVariantId.trim());
    setNewVariantId("");
  };

  return (
    <div className="editor-paragraph-view__variants-section">
      <h2 className="editor-paragraph-view__label">Warianty</h2>

      {variantIds.length === 0 && (
        <p className="editor-paragraph-view__variants-empty">
          Brak wariantów — dodaj pierwszy poniżej.
        </p>
      )}

      {variantIds.map((vid) => (
        <VariantEditor
          key={vid}
          paragraphId={paragraphId}
          variantId={vid}
          variant={paragraph.variants![vid]}
          variantIds={variantIds}
          paragraphIds={availableIds}
        />
      ))}

      <div className="editor-paragraph-view__variant-add-footer">
        <h2 className="editor-paragraph-view__label">Nowy wariant</h2>
        <div className="editor-paragraph-view__variant-add-row">
          <input
            className="editor-paragraph-view__variant-add-input"
            type="text"
            value={newVariantId}
            onChange={(e) =>
              setNewVariantId(
                e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && newVariantId.trim()) {
                handleAddVariant();
              }
            }}
            placeholder="nazwa-nowego-wariantu"
          />
          <button
            className="editor-paragraph-view__variant-add-btn"
            onClick={handleAddVariant}
            disabled={!newVariantId.trim()}
          >
            + Dodaj wariant
          </button>
        </div>
      </div>
    </div>
  );
};
