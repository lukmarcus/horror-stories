import React from "react";
import { RichText } from "../../../components/text/RichText/RichText";
import { Button } from "../../../components/ui/Button";
import { PagesPreview } from "./PagesPreview";
import type { EditorChoice } from "../../context/editorTypes";
import type { ContentBlock } from "../../../types";

interface VariantPreviewProps {
  pages: ContentBlock[][];
  choices: EditorChoice[];
}

export const VariantPreview: React.FC<VariantPreviewProps> = ({
  pages,
  choices,
}) => {
  return (
    <div className="editor-paragraph-view__variant-preview">
      <h3 className="editor-paragraph-view__label">Podgląd</h3>
      <div className="editor-paragraph-view__preview-content">
        <PagesPreview pages={pages} />
        {choices.length > 0 && (
          <fieldset className="choices choices--vertical">
            <legend className="sr-only">Wybory wariantu</legend>
            {choices.map((choice) => (
              <Button
                key={choice.id}
                variant="primary"
                size="lg"
                disabled
                title={
                  choice.nextParagraphId
                    ? `→ §${choice.nextParagraphId}`
                    : choice.nextVariantId
                      ? `→ W:${choice.nextVariantId}`
                      : undefined
                }
              >
                <RichText text={choice.text} noSpacing />
              </Button>
            ))}
          </fieldset>
        )}
      </div>
    </div>
  );
};
