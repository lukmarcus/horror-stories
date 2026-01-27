import React, { useState } from "react";
import { Button } from "../common";
import "./ConditionalChoice.css";

interface ConditionalChoiceProps {
  choice: {
    id: string;
    text: string;
    yesText?: string;
    noText?: string;
    yesNextId?: string;
    noNextId?: string;
  };
  onYes: () => void;
  onNo: () => void;
}

export const ConditionalChoice: React.FC<ConditionalChoiceProps> = ({
  choice,
  onYes,
  onNo,
}) => {
  const [answered, setAnswered] = useState(false);
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);

  const handleYes = () => {
    setAnswer("yes");
    setAnswered(true);
    onYes();
  };

  const handleNo = () => {
    setAnswer("no");
    setAnswered(true);
    onNo();
  };

  return (
    <div className="conditional-choice">
      <div className="conditional-choice__question">
        <p>{choice.text}</p>
      </div>

      {!answered ? (
        <div className="conditional-choice__buttons">
          <Button
            variant="primary"
            size="md"
            onClick={handleYes}
            className="conditional-choice__btn conditional-choice__btn--yes"
          >
            ✓ Tak
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={handleNo}
            className="conditional-choice__btn conditional-choice__btn--no"
          >
            ✗ Nie
          </Button>
        </div>
      ) : (
        <div
          className={`conditional-choice__result conditional-choice__result--${answer}`}
        >
          <p>{answer === "yes" ? choice.yesText : choice.noText}</p>
        </div>
      )}
    </div>
  );
};
