import React from "react";
import { Link } from "react-router-dom";
import "../styles/pages/instructions.css";

export const Instructions: React.FC = () => {
  return (
    <main className="instructions">
      <div className="page-back">
        <Link to="/" className="page-back__link">
          ← Menu główne
        </Link>
      </div>
      <section className="instructions__hero">
        <h1 className="instructions__title">Instrukcja Obsługi</h1>
        <p className="instructions__subtitle">
          Dowiedz się, jak grać w aplikacji Horror Stories
        </p>
      </section>

      <section className="instructions__content">
        <div className="instructions__section">
          <h2 className="instructions__heading">Początek Gry</h2>
          <div className="instructions__step">
            <span className="instructions__step-number">1</span>
            <div className="instructions__step-content">
              <h3 className="instructions__step-title">Wybór Scenariusza</h3>
              <p>
                Przejdź do zakładki "Graj" i wybierz scenariusz, który Cię
                interesuje. Każdy scenariusz ma unikatową historię i wyzwania.
              </p>
            </div>
          </div>

          <div className="instructions__step">
            <span className="instructions__step-number">2</span>
            <div className="instructions__step-content">
              <h3 className="instructions__step-title">Przygotowanie</h3>
              <p>
                Przed grą przygotuj fizyczne komponenty gry (pionki, karty,
                itp.) zgodnie z instrukcjami scenariusza.
              </p>
            </div>
          </div>

          <div className="instructions__step">
            <span className="instructions__step-number">3</span>
            <div className="instructions__step-content">
              <h3 className="instructions__step-title">Rozgrywka</h3>
              <p>
                Czytaj paragrafy historii i podejmuj decyzje. Każdy wybór może
                wpłynąć na przebieg gry. Słuchaj instrukcji aplikacji.
              </p>
            </div>
          </div>
        </div>

        <div className="instructions__section">
          <h2 className="instructions__heading">Mechaniki Gry</h2>

          <div className="instructions__mechanic">
            <h3 className="instructions__mechanic-title">🎲 Rzuty Kością</h3>
            <p>
              Gdy aplikacja wymagać będzie rzutu kością, zobaczysz przycisk.
              Kliknij go, aby rzucić. Wynik wpływa na dalszy ciąg historii.
            </p>
          </div>

          <div className="instructions__mechanic">
            <h3 className="instructions__mechanic-title">
              🔀 Warunkowe Wybory
            </h3>
            <p>
              Niektóre opcje są dostępne tylko pod określonymi warunkami.
              Aplikacja automatycznie pokaże Ci możliwe decyzje.
            </p>
          </div>

          <div className="instructions__mechanic">
            <h3 className="instructions__mechanic-title">
              🎵 Efekty Dźwiękowe
            </h3>
            <p>
              Aplikacja odtwarza efekty dźwiękowe pogłębiające atmosferę. Możesz
              je wyłączyć w ustawieniach.
            </p>
          </div>

          <div className="instructions__mechanic">
            <h3 className="instructions__mechanic-title">📸 Obrazy</h3>
            <p>
              Sceny mogą być ilustrowane obrazami. Mogą one zawierać ważne
              wskazówki dla gry fizycznej.
            </p>
          </div>
        </div>

        <div className="instructions__section">
          <h2 className="instructions__heading">Porady i Wskazówki</h2>
          <ul className="instructions__tips">
            <li>
              Czytaj wszystkie paragrafy uważnie — mogą zawierać ważne detale.
            </li>
            <li>Zapoznaj się z celami scenariusza przed grą.</li>
            <li>
              Graj wraz ze znalezionymi podczas gry kartami — aplikacja je
              uzupełnia.
            </li>
            <li>
              Nie wahaj się eksperymentować — niektóre ścieżki prowadzą do
              ukrytych zakończeń.
            </li>
            <li>
              Jeśli utkniesz, sprawdź ponownie warunki dostępności wyborów.
            </li>
          </ul>
        </div>

        <div className="instructions__section">
          <h2 className="instructions__heading">Najczęstsze Pytania</h2>
          <div className="instructions__faq">
            <div className="instructions__faq-item">
              <h3>Czy mogę grać samodzielnie?</h3>
              <p>
                Tak! Aplikacja obsługuje samodzielną grę. Możesz też grać w
                grupie, podejmując decyzje wspólnie.
              </p>
            </div>

            <div className="instructions__faq-item">
              <h3>Czy mogę zapisać postęp?</h3>
              <p>
                Postęp jest automatycznie zapisywany. Możesz wznowić grę z tego
                miejsca, jeśli będziesz używać tej samej przeglądarki.
              </p>
            </div>

            <div className="instructions__faq-item">
              <h3>Ile czasu trwa jeden scenariusz?</h3>
              <p>
                Czas zależy od scenariusza i szybkości podejmowania decyzji.
                Zazwyczaj trwa od 30 minut do kilku godzin.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
