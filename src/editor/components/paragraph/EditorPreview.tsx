import React from "react";
import { ParagraphText } from "../../../components/text/ParagraphText/ParagraphText";
import { RichText } from "../../../components/text/RichText/RichText";
import { PagesPreview } from "./PagesPreview";
import { Button } from "../../../components/ui/Button";
import type { EditorParagraph } from "../../context/editorTypes";

interface EditorPreviewProps {
  paragraph: EditorParagraph;
  isVariantMode: boolean;
  scenarioImages?: Record<string, string>;
  onNavigate: (id: string) => void;
}

export const EditorPreview: React.FC<EditorPreviewProps> = ({
  paragraph,
  isVariantMode,
  scenarioImages,
  onNavigate,
}) => {
  const text = paragraph.text ?? "";
  const pages = paragraph.pages ?? null;
  const hasPages = pages !== null;

  return (
    <div className="editor-paragraph-view__preview">
      <h2 className="editor-paragraph-view__label">Podgląd</h2>
      <div className="editor-paragraph-view__preview-content">
        {isVariantMode ? (
          <>
            <PagesPreview
              pages={paragraph.pages ?? [[]]}
              emptyMessage="Brak treści wprowadzającej"
            />
            {(paragraph.variantSelectors ?? []).length > 0 && (
              <fieldset className="choices choices--horizontal">
                <legend className="sr-only">Wybierz wariant</legend>
                {(paragraph.variantSelectors ?? []).map((s) => (
                  <Button key={s.id} variant="primary" size="lg">
                    <RichText text={s.text} noSpacing />
                  </Button>
                ))}
              </fieldset>
            )}
          </>
        ) : (
          <>
            {hasPages ? (
              <PagesPreview pages={pages!} />
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
              <fieldset className="choices choices--vertical">
                <legend className="sr-only">Dostępne wybory</legend>
                {(paragraph.choices ?? []).map((choice) => (
                  <Button
                    key={choice.id}
                    variant="primary"
                    size="lg"
                    onClick={() =>
                      choice.nextParagraphId &&
                      onNavigate(choice.nextParagraphId)
                    }
                    disabled={!choice.nextParagraphId && !choice.nextVariantId}
                    title={
                      choice.nextParagraphId
                        ? `Przejdź do §${choice.nextParagraphId}`
                        : choice.nextVariantId
                          ? `Wariant: ${choice.nextVariantId}`
                          : undefined
                    }
                  >
                    <RichText
                      text={choice.text}
                      images={scenarioImages}
                      noSpacing
                    />
                  </Button>
                ))}
              </fieldset>
            )}
          </>
        )}
      </div>
    </div>
  );
};
