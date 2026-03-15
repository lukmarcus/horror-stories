import React from "react";
import { Button } from "../common";

interface IndirectViewProps {
  pendingParagraphId: string;
  sources: string[];
  onConfirm: () => void;
  onCancel: () => void;
}

export const IndirectView: React.FC<
  IndirectViewProps
> = ({ pendingParagraphId, sources, onConfirm, onCancel }) => {
  return (
    <div className="game__indirect-paragraph">
      <div className="game__indirect-paragraph-header">
        Ostrzeżenie o dostępności
      </div>

      <p className="game__warning-text">
        Paragraf #{pendingParagraphId} jest dostępny tylko z:
      </p>
      <div className="game__warning-sources">
        {sources.map((source) => (
          <div key={source} className="game__warning-source">
            Paragraf #{source}
          </div>
        ))}
      </div>

      <p className="game__warning-question">
        Czy chcesz mimo to przejść do tego paragrafu?
      </p>
      <fieldset className="choices choices--horizontal">
        <legend className="sr-only">Wybierz akcję</legend>
        <Button variant="primary" size="lg" onClick={onConfirm}>
          Tak, rozumiem
        </Button>
        <Button variant="secondary" size="lg" onClick={onCancel}>
          Powrót
        </Button>
      </fieldset>
    </div>
  );
};
