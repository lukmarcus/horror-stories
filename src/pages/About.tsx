import React from "react";
import packageJson from "../../package.json";
import "../styles/pages/about.css";

export const About: React.FC = () => {
  return (
    <main className="about">
      <section className="about__hero">
        <h1 className="about__title">O Grze</h1>
        <p className="about__subtitle">
          Historia i inspiracja stojące za Horror Stories
        </p>
      </section>

      <section className="about__content">
        <div className="about__section">
          <h2 className="about__heading">Czym Jest Horror Stories?</h2>
          <p>
            Horror Stories to gra planszowa, która łączy element przygody
            tekstowej z mechaniką gry planszowej. Gracze pracują wspólnie, aby
            przetrwać serię scenariuszy pełnych nieoczekiwanych zwrotów akcji,
            tajemniczych wskazówek i potrzeby szybkiego podejmowania decyzji.
          </p>
          <p>
            Każdy scenariusz to samodzielna historia, która może być rozegrana
            niezależnie. Gra łączy elementy horroru, mystery i przygody w
            unikatowy gameplay'owy doświadczenie.
          </p>
        </div>

        <div className="about__section">
          <h2 className="about__heading">Ta Aplikacja</h2>
          <p>
            Horror Stories Companion App to cyfrowy pomocnik dla fizycznej gry.
            Jego rol to:
          </p>
          <ul className="about__list">
            <li>
              <strong>Prowadzenie historii</strong> — zapewnianie tekstu,
              obrazów i atmosfery dla każdego scenariusza
            </li>
            <li>
              <strong>Obsługa mechanik</strong> — zarządzanie rzutami kości,
              warunkową logiką i efektami
            </li>
            <li>
              <strong>Dostarczanie audio</strong> — odtwarzanie efektów
              dźwiękowych wzmacniających atmosferę
            </li>
            <li>
              <strong>Gromadzenie informacji</strong> — śledzi odkryte wskazówki
              i stan gry
            </li>
          </ul>
        </div>

        <div className="about__section">
          <h2 className="about__heading">Technologia</h2>
          <p>Aplikacja zbudowana jest z wykorzystaniem:</p>
          <div className="about__tech-grid">
            <div className="about__tech-item">
              <strong>React 18</strong>
              <p>Modern framework do budowy interfejsu</p>
            </div>
            <div className="about__tech-item">
              <strong>TypeScript</strong>
              <p>Bezpieczny kod z silnym typowaniem</p>
            </div>
            <div className="about__tech-item">
              <strong>Vite</strong>
              <p>Szybka budowa i development environment</p>
            </div>
            <div className="about__tech-item">
              <strong>CSS Modules</strong>
              <p>Stylizacja z izolacją komponentów</p>
            </div>
          </div>
        </div>

        <div className="about__section">
          <h2 className="about__heading">O Autorze</h2>
          <div className="about__author">
            <div className="about__author-name">Marek Szumny</div>
            <p>
              Pasjonat gier planszowych i programista. Stworzył tę aplikację,
              aby przyniosła radość wielu fanom Horror Stories.
            </p>
          </div>
        </div>

        <div className="about__section about__section--highlight">
          <h2 className="about__heading">Licencja i Open Source</h2>
          <p>
            Ta aplikacja jest dostępna na licencji <strong>MIT</strong>, co
            oznacza, że jest wolnym i otwartym oprogramowaniem. Możesz jej
            używać, modyfikować i rozpowszechniać zgodnie z warunkami MIT.
          </p>
          <p>
            Kod źródłowy jest dostępny na GitHub, a wszelkie contribution mile
            widziane!
          </p>
        </div>

        <div className="about__section">
          <h2 className="about__heading">Wersja Aplikacji</h2>
          <div className="about__info-grid">
            <div className="about__info-item">
              <span className="about__info-label">Wersja:</span>
              <span className="about__info-value">v{packageJson.version}</span>
            </div>
            <div className="about__info-item">
              <span className="about__info-label">Status:</span>
              <span className="about__info-value">Early Access</span>
            </div>
            <div className="about__info-item">
              <span className="about__info-label">Licencja:</span>
              <span className="about__info-value">MIT</span>
            </div>
            <div className="about__info-item">
              <span className="about__info-label">Autor:</span>
              <span className="about__info-value">Marek Szumny</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
