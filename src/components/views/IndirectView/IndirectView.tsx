import React from "react";
import { Button, SectionHeader } from "../../ui";
import { RichText } from "../../text/RichText/RichText";
import type { ContentBlock } from "../../../types";

interface IndirectViewProps {
  pendingParagraphId: string;
  sources: string[];
  onConfirm: () => void;
  onCancel: () => void;
}

export const IndirectView: React.FC<IndirectViewProps> = ({
  pendingParagraphId,
  sources,
  onConfirm,
  onCancel,
}) => {
  const sourcesList = sources.map((src) => `Paragraf ${src}`).join("<br />");

  const content: ContentBlock[] = [
    {
      type: "text",
      html: `Paragraf ${pendingParagraphId} nie jest dostępny bezpośrednio, a dostęp do niego wynika z opisu innego paragrafu:<br /><br />${sourcesList}`,
    },
    {
      type: "text",
      html: `Czy na pewno chcesz przeczytać paragraf ${pendingParagraphId}?`,
    },
  ];

  return (
    <>
      <nav className="game__content-nav">
        <Button variant="secondary" size="sm" onClick={onCancel}>
          ← Menu scenariusza
        </Button>
      </nav>

      <div className="game__scenario">
        <SectionHeader title="Niebezpośredni paragraf" />
        <RichText content={content} />

        <fieldset className="choices choices--horizontal">
          <legend className="sr-only">Wybierz akcję</legend>
          <Button variant="primary" size="lg" onClick={onConfirm}>
            Tak, przejdź do paragrafu #{pendingParagraphId}
          </Button>
          <Button variant="secondary" size="lg" onClick={onCancel}>
            Menu scenariusza
          </Button>
        </fieldset>
      </div>
    </>
  );
};
