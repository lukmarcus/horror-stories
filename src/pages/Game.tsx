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
  const [currentParagraphId, setCurrentParagraphId] = useState("1");
  const [history, setHistory] = useState<string[]>(["1"]);

  // Mock paragraphs - będą wczytywane z JSON'a
  const paragraphs: Record<string, Paragraph> = {
    "1": {
      id: "1",
      text: "Budzisz się w ciemnym pokoju. Słychać dziwne szmery dobiegające ze ścian. Twoje oczy powoli przyzwyczajają się do mroku. Widzisz trzy drwi — każde z nich mogłoby być wyjściem. Ale czujesz, że nie wszystko tutaj jest bezpieczne.",
      choices: [
        {
          id: "c1",
          text: "Podejdź do drzwi po lewej",
          nextParagraphId: "2",
        },
        {
          id: "c2",
          text: "Podejdź do drzwi pośrodku",
          nextParagraphId: "3",
        },
        {
          id: "c3",
          text: "Podejdź do drzwi po prawej",
          nextParagraphId: "4",
        },
      ],
    },
    "2": {
      id: "2",
      text: "Za drzwiami po lewej czeka schłodzona klatka schodowa. Luz powietrza zmraża Ci skórę. W oddali słychać [figure:tajemnicze kroki]... czy to ty? Czy [figure:ktoś inny] jest w tym budynku? Na ścianie widać [item:starą notatkę].",
      choices: [
        {
          id: "c4",
          text: "Wejdź na schody",
          nextParagraphId: "5",
        },
        {
          id: "c5",
          text: "Wróć i wybierz inne drzwi",
          nextParagraphId: "1",
        },
      ],
    },
    "3": {
      id: "3",
      text: "Środkowe drzwi otwierają się na jasną bibliotekę. Półki książek sięgają sufitu. Pamiętasz — przyszłeś tutaj szukać [item:zaginionej księgi]. Czy ona jest tutaj? Na biurku widać [token:klucz] i [board:mapę starą].",
      choices: [
        {
          id: "c6",
          text: "Przeszukaj półki",
          nextParagraphId: "6",
        },
        {
          id: "c7",
          text: "Sprawdź zbliżone się kroki",
          nextParagraphId: "7",
        },
      ],
    },
    "4": {
      id: "4",
      text: "Prawe drzwi prowadzą do oszołomującego widoku — znaleźliście się na dachu budynku. [figure:Miasto] rozciąga się poniżej, a [board:dach] jest całkowicie pusty. Chyba że [figure:coś się rusza] w cieniu...",
      choices: [
        {
          id: "c8",
          text: "Przejdź po dachu",
          nextParagraphId: "8",
        },
        {
          id: "c9",
          text: "Wróć do pokoju",
          nextParagraphId: "1",
        },
      ],
    },
    "5": {
      id: "5",
      text: "Koniec scenariusza: Nie przetrwałeś. Schody zawalają się pod Twoimi nogami.",
      choices: [
        {
          id: "c10",
          text: "Spróbuj jeszcze raz",
          nextParagraphId: "1",
        },
      ],
    },
    "6": {
      id: "6",
      text: "🎉 Znalazłeś [item:zaginioną księgę]! Twoja przygoda dobiegła końca — i to zwycięskiego! [figure:Księga] lśni w świetle, a jej karty zawierają [board:tajemne znaki].",
      choices: [
        {
          id: "c11",
          text: "Wróć do listy scenariuszy",
          nextParagraphId: "end",
        },
      ],
    },
    "7": {
      id: "7",
      text: "[figure:Ktoś] wchodzi do biblioteki. Pytanie brzmi — czy to [figure:sprzymierzeniec] czy [figure:wróg]? Jego [item:maska] zasłania twarz, a w dłoni trzyma [item:broń].",
      choices: [
        {
          id: "c12",
          text: "Schowaj się za półkami",
          nextParagraphId: "9",
        },
        {
          id: "c13",
          text: "Wstań i powitaj osobę",
          nextParagraphId: "10",
        },
      ],
    },
    "8": {
      id: "8",
      text: "Na dachu czeka [figure:helikopter]. Możesz stąd uciec! Ale czy to jest realne, czy tylko [token:złudzenie]?",
      choices: [
        {
          id: "c14",
          text: "Wskocz do helikoptera",
          nextParagraphId: "11",
        },
        {
          id: "c15",
          text: "Cofnij się",
          nextParagraphId: "1",
        },
      ],
    },
    "9": {
      id: "9",
      text: "Czekasz w napięciu. [figure:Osoba] przechodzi obok. Ufff! Udało się przejść niezauważony dzięki [item:drewnianym półkom].",
      choices: [
        {
          id: "c16",
          text: "Szukaj dalej",
          nextParagraphId: "6",
        },
      ],
    },
    "10": {
      id: "10",
      text: "[figure:Osoba] się uśmiecha. To była [figure:bibliotekarka]. Mówi: 'Szukasz [item:księgi]. Jest w [token:sejfie] za [board:obrazem].'",
      choices: [
        {
          id: "c17",
          text: "Idź do obrazu",
          nextParagraphId: "6",
        },
      ],
    },
    "11": {
      id: "11",
      text: "🎉 Uciekłeś! [figure:Helikopter] podnosi się w powietrze na [board:dachu]. Scenariusz ukończony!",
      choices: [
        {
          id: "c18",
          text: "Wróć do listy",
          nextParagraphId: "end",
        },
      ],
    },
  };

  const currentParagraph = paragraphs[currentParagraphId];

  const handleChoice = (nextId: string) => {
    if (nextId === "end") {
      // Koniec gry
      return;
    }
    setCurrentParagraphId(nextId);
    setHistory([...history, nextId]);
  };

  const handleGoBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCurrentParagraphId(newHistory[newHistory.length - 1]);
    }
  };

  const isGameEnd =
    currentParagraphId === "5" ||
    currentParagraphId === "6" ||
    currentParagraphId === "11";

  return (
    <main className="game">
      {/* Top Bar */}
      <div className="game__top-bar">
        <div className="game__top-bar-content">
          <span className="game__step-counter">
            Krok {history.length} / Scenariusz: {id}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="game__container">
        {/* Paragraph Section */}
        <section className="game__paragraph-section">
          <div className="game__paragraph-content">
            {currentParagraph?.image && (
              <div className="game__image-container">
                <img
                  src={currentParagraph.image}
                  alt="Paragraph illustration"
                  className="game__image"
                />
              </div>
            )}

            <div className="game__text-box">
              <ParagraphText
                text={currentParagraph?.text || ""}
                className="game__paragraph-text"
              />
            </div>
          </div>

          {/* Choices */}
          {currentParagraph?.choices && currentParagraph.choices.length > 0 && (
            <section className="game__choices">
              <h2 className="game__choices-title">Co robisz?</h2>
              <div className="game__choices-grid">
                {currentParagraph.choices.map((choice) => (
                  <Button
                    key={choice.id}
                    variant="primary"
                    size="md"
                    onClick={() => handleChoice(choice.nextParagraphId)}
                    className="game__choice-btn"
                    style={{ width: "100%" }}
                  >
                    {choice.text}
                  </Button>
                ))}
              </div>
            </section>
          )}

          {/* End Game Message */}
          {isGameEnd && (
            <section className="game__end-message">
              <Link to="/scenarios" style={{ width: "100%" }}>
                <Button variant="primary" size="lg" style={{ width: "100%" }}>
                  Powrót do listy scenariuszy
                </Button>
              </Link>
            </section>
          )}
        </section>

        {/* Sidebar */}
        <aside className="game__sidebar">
          <div className="game__panel">
            <h3 className="game__panel-title">Sterowanie</h3>

            <div className="game__control">
              {history.length > 1 && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleGoBack}
                  style={{ width: "100%" }}
                >
                  ← Cofnij
                </Button>
              )}
            </div>

            <Link to="/scenarios" style={{ width: "100%" }}>
              <Button variant="outline" size="md" style={{ width: "100%" }}>
                Opuść grę
              </Button>
            </Link>
          </div>

          <div className="game__panel game__panel--info">
            <h3 className="game__panel-title">Historia</h3>
            <div className="game__history">
              <p className="game__history-text">
                Odwiedziłeś {history.length} lokacji
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};
