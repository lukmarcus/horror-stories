import React from "react";
import { Button, OptionButton, SectionHeader } from "../../ui";

interface DeathViewProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeathView: React.FC<DeathViewProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <>
      <nav className="game__content-nav">
        <OptionButton
          icon="◀️"
          line1="Menu"
          line2="scenariusza"
          onClick={onCancel}
        />
      </nav>

      <div className="game__scenario">
        <SectionHeader title="Śmierć" />

        <p className="paragraph-text">
          Paragraf <strong>100</strong> należy odczytać wyłącznie wtedy, gdy
          któraś z postaci lub przeciwnik utraci ostatni żeton życia.
        </p>
        <p className="paragraph-text">
          Czy na pewno chcesz przejść do paragrafu 100?
        </p>

        <fieldset className="choices choices--horizontal">
          <legend className="sr-only">Wybierz akcję</legend>
          <Button variant="primary" size="lg" onClick={onConfirm}>
            Tak, przejdź do paragrafu 100
          </Button>
          <Button variant="secondary" size="lg" onClick={onCancel}>
            Menu scenariusza
          </Button>
        </fieldset>
      </div>
    </>
  );
};
