import React from "react";
import type { ContentBlock } from "../../../types";
import { RichText } from "../../../components/text/RichText/RichText";
import { useEditor } from "../../context/useEditor";

interface PagesPreviewProps {
  pages: ContentBlock[][];
  emptyMessage?: string;
}

export const PagesPreview: React.FC<PagesPreviewProps> = ({
  pages,
  emptyMessage = "Brak treści",
}) => {
  const { state } = useEditor();
  const images = state.scenario?.images ?? {};
  const scenarioId = state.scenario?.meta.id;
  const isEmpty =
    pages.length === 0 || (pages.length === 1 && pages[0].length === 0);

  if (isEmpty) {
    return (
      <p className="editor-paragraph-view__preview-empty">{emptyMessage}</p>
    );
  }

  return (
    <>
      {pages.map((page, i) => (
        <div key={i} className="editor-paragraph-view__preview-page">
          {pages.length > 1 && (
            <span className="editor-paragraph-view__preview-page-label">
              Strona {i + 1}
            </span>
          )}
          <RichText content={page} images={images} scenarioId={scenarioId} />
        </div>
      ))}
    </>
  );
};
