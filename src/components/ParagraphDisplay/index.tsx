import React from 'react';
import type { Paragraph } from '../../types';
import { ParagraphText } from '../ParagraphText/ParagraphText';
import { DiceRoller } from '../DiceRoller/DiceRoller';
import { ConditionalChoice } from '../ConditionalChoice/ConditionalChoice';
import './ParagraphDisplay.css';

interface ParagraphDisplayProps {
  paragraph: Paragraph;
  lastDiceResult: number | null;
  onChoice: (nextId: string) => void;
  onBack: () => void;
}

export const ParagraphDisplay: React.FC<ParagraphDisplayProps> = ({
  paragraph,
  lastDiceResult,
  onChoice,
  onBack,
}) => {
  // Check if dice roll was successful
  const isDiceRollSuccess =
    paragraph.hasDiceRoll &&
    paragraph.diceResult &&
    lastDiceResult !== null &&
    lastDiceResult > paragraph.diceResult.threshold;

  // Check if paragraph is dead end (no choices, no dice)
  const isDeadEnd = !paragraph.choices && !paragraph.hasDiceRoll;

  return (
    <section className="paragraph-display">
      {paragraph.image && (
        <img src={paragraph.image} alt="Paragraph illustration" className="paragraph-image" />
      )}

      <ParagraphText text={paragraph.text} />

      {isDeadEnd && (
        <div className="dead-end">
          <p>Koniec gry!</p>
          <button onClick={onBack} className="button button--secondary">
            Powrót
          </button>
        </div>
      )}

      {paragraph.hasDiceRoll && paragraph.diceResult && lastDiceResult !== null && (
        <div className="dice-result">
          <p>{isDiceRollSuccess ? paragraph.diceResult.successText : paragraph.diceResult.failText}</p>
          <button
            onClick={() =>
              onChoice(
                isDiceRollSuccess ? paragraph.diceResult!.successNextId : paragraph.diceResult!.failNextId,
              )
            }
            className="button button--primary"
          >
            PRZEJDŹ
          </button>
        </div>
      )}

      {paragraph.hasDiceRoll && lastDiceResult === null && (
        <div className="dice-roller-wrapper">
          <DiceRoller />
        </div>
      )}

      {paragraph.choices && paragraph.choices.length > 0 && (
        <div className="choices">
          {paragraph.choices.map((choice) => {
            if (choice.isConditional) {
              return (
                <ConditionalChoice
                  key={choice.id}
                  choice={choice}
                  onYes={() => choice.yesNextId && onChoice(choice.yesNextId)}
                  onNo={() => choice.noNextId && onChoice(choice.noNextId)}
                />
              );
            }
            return (
              <button
                key={choice.id}
                onClick={() => choice.nextParagraphId && onChoice(choice.nextParagraphId)}
                className="button button--primary"
              >
                {choice.text}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};
