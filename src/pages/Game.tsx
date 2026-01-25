import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../components/common";
import { ParagraphText } from "../components/ParagraphText/ParagraphText";
import "./Game.css";

interface Choice {
  id: string;
  text: string;
  nextParagraphId: string;
}

interface Paragraph {
  id: string;
  text: string;
  choices?: Choice[];
  image?: string;
  audio?: string;
}

export const Game: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentParagraphId, setCurrentParagraphId] = useState<string | null>(
    null,
  );
  const [inputValue, setInputValue] = useState("");
  const [showSetup, setShowSetup] = useState(false);
  const [error, setError] = useState("");

  // Scenario data
  const scenarios: Record<
    string,
    {
      title: string;
      description: string;
      playerCount: string;
      duration: string;
    }
  > = {
    "1": {
      title: "Tajemna Biblioteka",
      description: "Zaginęła księga starożytnych zaklęć. Musisz ją znaleźć.",
      playerCount: "2-4 graczy",
      duration: "45 min",
    },
    "2": {
      title: "Opuszczony Szpital",
      description: "Budynek pełen tajemnic czeka na odkrycie.",
      playerCount: "2-4 graczy",
      duration: "60 min",
    },
    "3": {
      title: "Nocny Koszmar",
      description: "Czy potrafisz przetrwać noc w domu nawiedzonym?",
      playerCount: "2-6 graczy",
      duration: "90 min",
    },
  };

  const currentScenario = scenarios[id || "1"];

  // Mock paragraphs
  const paragraphs: Record<string, Paragraph> = {
    "1": {
      id: "1",
      text: "Budzisz się w ciemnym pokoju. Słychać dziwne szmery dobiegające ze ścian. Twoje oczy powoli przyzwyczajają się do mroku. Widzisz [item:drzwi] — każde z nich mogłoby być wyjściem. Ale czujesz, że nie wszystko tutaj jest bezpieczne.",
      choices: [
        { id: "c1", text: "Podejdź do drzwi po lewej", nextParagraphId: "2" },
        { id: "c2", text: "Podejdź do drzwi pośrodku", nextParagraphId: "3" },
        { id: "c3", text: "Podejdź do drzwi po prawej", nextParagraphId: "4" },
      ],
    },
    "2": {
      id: "2",
      text: "Za drzwiami po lewej czeka schłodzona klatka schodowa. Luz powietrza zmraża Ci skórę. W oddali słychać [figure:tajemnicze kroki]... czy to ty? Czy [figure:ktoś inny] jest w tym budynku? Na ścianie widać [item:starą notatkę].",
      choices: [
        { id: "c4", text: "Wejdź na schody", nextParagraphId: "5" },
        { id: "c5", text: "Wróć i wybierz inne drzwi", nextParagraphId: "1" },
      ],
    },
    "3": {
      id: "3",
      text: "Środkowe drzwi otwierają się na jasną bibliotekę. Półki książek sięgają sufitu. Pamiętasz — przyszłeś tutaj szukać [item:zaginionej księgi]. Czy ona jest tutaj? Na biurku widać [token:klucz] i [board:mapę starą].",
      choices: [
        { id: "c6", text: "Przeszukaj półki", nextParagraphId: "6" },
        { id: "c7", text: "Sprawdź zbliżone się kroki", nextParagraphId: "2" },
      ],
    },
    "4": {
      id: "4",
      text: "Prawe drzwi prowadzą do oszołomującego widoku — znaleźliście się na dachu budynku. [figure:Miasto] rozciąga się poniżej, a [board:dach] jest całkowicie pusty. Chyba że [figure:coś się rusza] w cieniu...",
      choices: [
        { id: "c8", text: "Przejdź po dachu", nextParagraphId: "5" },
        { id: "c9", text: "Wróć do pokoju", nextParagraphId: "1" },
      ],
    },
    "5": {
      id: "5",
      text: "Koniec scenariusza: Nie przetrwałeś. Schody zawalają się pod Twoimi nogami.",
    },
    "6": {
      id: "6",
      text: "🎉 Znalazłeś [item:zaginioną księgę]! Twoja przygoda dobiegła końca — i to zwycięskiego! [figure:Księga] lśni w świetle, a jej karty zawierają [board:tajemne znaki].",
    },
  };

  const currentParagraph = paragraphs[currentParagraphId || ""];

  const handleJumpToParagraph = () => {
    const paragraphId = inputValue.trim();
    setError("");

    if (!paragraphId) {
      setError("Wpisz numer paragrafu");
      return;
    }

    if (!paragraphs[paragraphId]) {
      setError(`Paragraf #${paragraphId} nie istnieje`);
      return;
    }

    setCurrentParagraphId(paragraphId);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleJumpToParagraph();
    }
  };

  const handleBackToInput = () => {
    setCurrentParagraphId(null);
    setInputValue("");
    setError("");
  };

  const setupSteps = [
    "Gracze siedzą wokół stołu",
    "Każdy gracz ma kartkę i długopis",
    "Położyć planszę główną w środku",
    "Mieszać karty odkryć",
    "Jesteś gotowy! Zacznij przygodę",
  ];

  return (
    <main className="game">
      {/* Top Bar - Only in Paragraph Mode */}
      {currentParagraphId && (
        <div className="game__top-bar">
          <div className="game__top-bar-content">
            <Button variant="outline" size="sm" onClick={handleBackToInput}>
              ← Wróć
            </Button>
            <span className="game__scenario-info">Scenariusz #{id}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSetup(!showSetup)}
            >
              {showSetup ? "Zamknij Setup" : "⚙️ Setup"}
            </Button>
          </div>
        </div>
      )}

      {/* Setup Section */}
      {showSetup && (
        <section className="game__setup-section">
          <div className="game__setup-container">
            <h2 className="game__setup-title">Ustawienie początkowe</h2>
            <ol className="game__setup-list">
              {setupSteps.map((step, idx) => (
                <li key={idx} className="game__setup-item">
                  {step}
                </li>
              ))}
            </ol>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowSetup(false)}
            >
              Gotów! Zacznij grać
            </Button>
          </div>
        </section>
      )}

      {/* Container */}
      <div className="game__container">
        {/* INPUT MODE - Show input panel */}
        {!currentParagraphId ? (
          <section className="game__input-panel">
            <div className="game__input-header">
              <h1 className="game__scenario-title">
                {currentScenario?.title || "Scenariusz"}
              </h1>
              <p className="game__input-instruction">
                Wprowadź poniżej numer wpisu, a następnie naciśnij "PRZEJDŹ".
              </p>
            </div>

            <div className="game__input-wrapper">
              <div className="game__input-group">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder=""
                  className="game__input"
                  autoFocus
                />
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleJumpToParagraph}
                  className="game__input-btn"
                >
                  PRZEJDŹ
                </Button>
              </div>
              {error && <p className="game__error">{error}</p>}
            </div>

            {/* Options */}
            <div className="game__options">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSetup(!showSetup)}
                className="game__option-btn"
              >
                ⚙️ {showSetup ? "Zamknij Setup" : "Przygotuj Scenariusz"}
              </Button>
              <Link to="/scenarios" className="game__option-link">
                <Button variant="secondary" size="sm">
                  ← Powrót do Menu
                </Button>
              </Link>
            </div>
          </section>
        ) : (
          /* PARAGRAPH MODE - Show paragraph text and choices */
          <section className="game__paragraph-section">
            <div className="game__text-box">
              {currentParagraph ? (
                <ParagraphText
                  text={currentParagraph.text}
                  className="game__paragraph-text"
                />
              ) : (
                <p className="game__error-text">Paragraf nie znaleziony</p>
              )}
            </div>

            {/* Choices */}
            {currentParagraph?.choices &&
              currentParagraph.choices.length > 0 && (
                <div className="game__choices">
                  {currentParagraph.choices.map((choice) => (
                    <Button
                      key={choice.id}
                      variant="primary"
                      size="md"
                      onClick={() =>
                        setCurrentParagraphId(choice.nextParagraphId)
                      }
                      className="game__choice-btn"
                    >
                      {choice.text}
                    </Button>
                  ))}
                </div>
              )}

            {/* Dead End - No choices */}
            {(!currentParagraph?.choices ||
              currentParagraph.choices.length === 0) && (
              <div className="game__dead-end">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleBackToInput}
                  className="game__dead-end-btn"
                >
                  Wróć do scenariusza
                </Button>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
};
