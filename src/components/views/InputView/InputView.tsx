import React from "react";
import { Button } from "../../ui";

interface InputViewProps {
  /** Called on submit. Return an error string to show inline, or null on success. */
  onSubmit: (value: string) => string | null;
  /** Instruction text shown above the input */
  instruction?: string;
  /** Optional buttons rendered below the input (e.g. Setup, Back to Menu) */
  actions?: React.ReactNode;
  autoFocus?: boolean;
  errorId?: string;
}

export const InputView: React.FC<InputViewProps> = ({
  onSubmit,
  instruction,
  actions,
  autoFocus = false,
  errorId = "paragraph-input-error",
}) => {
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const err = onSubmit(trimmed);
    if (err) {
      setError(err);
    } else {
      setError(null);
      setValue("");
    }
  };

  return (
    <div className="game__input-panel">
      {instruction && (
        <div className="game__input-header">
          <p className="game__input-instruction">{instruction}</p>
        </div>
      )}
      <div className="game__input-wrapper">
        <div className="game__input-group">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder="np. 1, 2, 3..."
            className="game__input"
            aria-label="Numer paragrafu do odwiedzenia"
            aria-describedby={error ? errorId : undefined}
            aria-invalid={!!error}
            autoFocus={autoFocus}
          />
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            className="game__input-btn"
            aria-label="Przejść do paragrafu"
          >
            PRZEJDŹ
          </Button>
        </div>
        {error && (
          <p id={errorId} className="game__error" role="alert">
            {error}
          </p>
        )}
      </div>
      {actions && <div className="game__options">{actions}</div>}
    </div>
  );
};
