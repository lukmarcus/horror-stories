import React from "react";
import { Button } from "../../ui";
import type { LetterToken } from "../../../types";
import "./AlphabetView.css";

interface AlphabetViewProps {
  onClose: () => void;
  letters: LetterToken[];
  onGoToParagraph: (paragraphId: string) => void;
}

export const AlphabetView: React.FC<AlphabetViewProps> = ({
  onClose,
  letters,
  onGoToParagraph,
}) => {
  return (
    <>
      <div className="game__content-nav">
        <Button
          variant="secondary"
          size="sm"
          onClick={onClose}
          aria-label="Powrót do menu"
        >
          ← Wróć do menu scenariusza
        </Button>
      </div>

      <div className="game__scenario">
        <div className="game__scenario-header">
          <div className="game__scenario-label">Żetony alfabetu</div>
        </div>
        <div className="alphabet-view__container">
          {letters.length === 0 ? (
            <p className="alphabet-view__placeholder">
              Ten scenariusz nie posiada żetonów alfabetu.
            </p>
          ) : (
            <div className="alphabet-view__list">
              {letters.map((letter) => (
                <div key={letter.id} className="alphabet-view__item">
                  <span className="alphabet-view__letter">
                    {letter.id.toUpperCase()}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      onGoToParagraph(letter.paragraphId);
                      onClose();
                    }}
                  >
                    Paragraf {letter.paragraphId}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
