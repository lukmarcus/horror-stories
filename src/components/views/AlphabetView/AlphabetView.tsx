import React from "react";
import { Button } from "../../ui";
import { getLetter } from "../../../data/items";
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
            <div className="alphabet-view__tiles">
              {letters.map((letter) => {
                const letterData = getLetter(letter.id);
                return (
                  <Button
                    key={letter.id}
                    variant="secondary"
                    onClick={() => {
                      onGoToParagraph(letter.paragraphId);
                      onClose();
                    }}
                    aria-label={`Żeton ${letter.id.toUpperCase()} — paragraf ${letter.paragraphId}`}
                  >
                    {letterData ? (
                      <img
                        src={letterData.imagePath}
                        alt={letter.id.toUpperCase()}
                        className="alphabet-view__letter-img"
                      />
                    ) : (
                      <span className="alphabet-view__letter-fallback">
                        {letter.id.toUpperCase()}
                      </span>
                    )}
                    <span className="alphabet-view__paragraph-label">
                      Paragraf {letter.paragraphId}
                    </span>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
