import React from "react";
import { getBuiltinScenariosMetadata } from "../../utils/builtinScenarios";
import "./BuiltinScenariosModal.css";

interface BuiltinScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (scenarioId: string) => void;
}

export const BuiltinScenariosModal: React.FC<BuiltinScenariosModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const scenarios = getBuiltinScenariosMetadata();

  if (!isOpen) return null;

  return (
    <>
      <div className="builtin-modal__overlay" onClick={onClose} />
      <div className="builtin-modal__dialog">
        <div className="builtin-modal__header">
          <h2 className="builtin-modal__title">
            Importuj wbudowany scenariusz
          </h2>
          <button
            className="builtin-modal__close"
            onClick={onClose}
            aria-label="Zamknij"
          >
            ✕
          </button>
        </div>

        <div className="builtin-modal__list">
          {scenarios.length === 0 ? (
            <p className="builtin-modal__empty">
              Brak dostępnych wbudowanych scenariuszy.
            </p>
          ) : (
            scenarios.map((scenario) => (
              <button
                key={scenario.id}
                className="builtin-modal__item"
                onClick={() => {
                  onSelect(scenario.id);
                  onClose();
                }}
              >
                <div className="builtin-modal__item-title">
                  {scenario.title}
                </div>
                {scenario.description && (
                  <div className="builtin-modal__item-description">
                    {scenario.description}
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        <div className="builtin-modal__footer">
          <button
            className="editor-btn editor-btn--secondary"
            onClick={onClose}
          >
            Anuluj
          </button>
        </div>
      </div>
    </>
  );
};
