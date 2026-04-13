import React from "react";
import { Button } from "../../ui";
import "./AlphabetView.css";

interface AlphabetViewProps {
  onClose: () => void;
}

export const AlphabetView: React.FC<AlphabetViewProps> = ({ onClose }) => {
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
          <p className="alphabet-view__placeholder">
            Tu pojawi się zawartość żetonów alfabetu.
          </p>
        </div>
      </div>
    </>
  );
};
