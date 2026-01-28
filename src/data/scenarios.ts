/**
 * Game Data - Scenarios and Paragraphs
 * Central data repository for all game content
 */

import type { Scenario, Paragraph } from "../types";

/**
 * Available game scenarios
 */
export const SCENARIOS: Record<string, Scenario> = {
  "1": {
    id: "1",
    title: "Tajemna Biblioteka",
    description: "Zaginęła księga starożytnych zaklęć. Musisz ją znaleźć.",
    playerCount: "2-4 graczy",
    duration: "45 min",
  },
  "2": {
    id: "2",
    title: "Opuszczony Szpital",
    description: "Budynek pełen tajemnic czeka na odkrycie.",
    playerCount: "2-4 graczy",
    duration: "60 min",
  },
  "3": {
    id: "3",
    title: "Nocny Koszmar",
    description: "Czy potrafisz przetrwać noc w domu nawiedzonym?",
    playerCount: "2-6 graczy",
    duration: "90 min",
  },
};

/**
 * Game paragraphs/nodes - mock data for testing
 */
export const PARAGRAPHS: Record<string, Paragraph> = {
  "1": {
    id: "1",
    isDirect: true,
    text: "Budzisz się w ciemnym pokoju. Słychać dziwne szmery dobiegające ze ścian. Twoje oczy powoli przyzwyczajają się do mroku. Widzisz [item:drzwi] — każde z nich mogłoby być wyjściem. Ale czujesz, że nie wszystko tutaj jest bezpieczne.",
    choices: [
      { id: "c1", text: "Podejdź do drzwi po lewej", nextParagraphId: "2" },
      { id: "c2", text: "Podejdź do drzwi pośrodku", nextParagraphId: "3" },
      { id: "c3", text: "Podejdź do drzwi po prawej", nextParagraphId: "4" },
    ],
  },
  "2": {
    id: "2",
    isDirect: true,
    text: "Za drzwiami po lewej czeka schłodzona klatka schodowa. Luz powietrza zmraża Ci skórę. W oddali słychać [figure:tajemnicze kroki]... czy to ty? Czy [figure:ktoś inny] jest w tym budynku? Na ścianie widać [item:starą notatkę].",
    accessibleFrom: ["1"],
    choices: [
      { id: "c4", text: "Wejdź na schody", nextParagraphId: "5" },
      { id: "c5", text: "Wróć i wybierz inne drzwi", nextParagraphId: "1" },
    ],
  },
  "3": {
    id: "3",
    isDirect: true,
    text: "Środkowe drzwi otwierają się na jasną bibliotekę. Półki książek sięgają sufitu. Pamiętasz — przyszłeś tutaj szukać [item:zaginionej księgi]. Czy ona jest tutaj? Na biurku widać [token:klucz] i [board:mapę starą].",
    accessibleFrom: ["1"],
    choices: [
      { id: "c6", text: "Przeszukaj półki", nextParagraphId: "6" },
      { id: "c7", text: "Sprawdź zbliżone się kroki", nextParagraphId: "2" },
    ],
  },
  "4": {
    id: "4",
    isDirect: false,
    accessibleFrom: ["1"],
    text: "Prawe drzwi prowadzą do oszołomującego widoku — znaleźliście się na dachu budynku. [figure:Miasto] rozciąga się poniżej, a [board:dach] jest całkowicie pusty. Chyba że [figure:coś się rusza] w cieniu...",
    choices: [
      { id: "c8", text: "Przejdź po dachu", nextParagraphId: "5" },
      { id: "c9", text: "Wróć do pokoju", nextParagraphId: "1" },
    ],
  },
  "5": {
    id: "5",
    isDirect: false,
    accessibleFrom: ["2", "4"],
    text: "Koniec scenariusza: Nie przetrwałeś. Schody zawalają się pod Twoimi nogami.",
  },
  "6": {
    id: "6",
    isDirect: false,
    accessibleFrom: ["3", "8"],
    text: "🎉 Znalazłeś [item:zaginioną księgę]! Twoja przygoda dobiegła końca — i to zwycięskiego! [figure:Księga] lśni w świetle, a jej karty zawierają [board:tajemne znaki].",
  },
  "7": {
    id: "7",
    isDirect: true,
    text: "Stoisz przed [item:tajemniczą skrzynią]. Na jej wieczku widnieje [figure:dziwny symbol]... Aby ją otworzyć, musisz rzucić kostką i uzyskać wynik wyższy niż 3.",
    hasDiceRoll: true,
    diceRollDescription: "Rzuć kostką aby spróbować otworzyć skrzynię",
    diceResult: {
      threshold: 3,
      successText:
        "🎉 Udało Ci się! Skrzynia otworzyła się ze zaskakującym świstem powietrza.",
      successNextId: "8",
      failText:
        "❌ Nie tym razem! Skrzynia herself się zatrzasnęła, prawie przytłaczając Ci palce.",
      failNextId: "9",
    },
  },
  "8": {
    id: "8",
    isDirect: false,
    accessibleFrom: ["7"],
    text: "W środku skrzyni znajdujesz [item:stary zwój pergaminu] z notatkami o [figure:zakaźnym obrzędzie]... To może być [item:klucz] do zrozumienia tego budynku!",
    choices: [
      { id: "c11", text: "Zabierz zwój i wróć", nextParagraphId: "3" },
      { id: "c12", text: "Przeczytaj zwój dokładnie", nextParagraphId: "6" },
    ],
  },
  "9": {
    id: "9",
    isDirect: false,
    accessibleFrom: ["7"],
    text: "Mechanizm zabezpieczający w skrzyni został uruchomiony! Słychać hałas z wnętrza budynku... [figure:coś się rusza]. Powinieneś stąd wyjść! Szybko!",
    choices: [
      {
        id: "c15",
        text: "Czy posiadasz [item:pergamin] z instrukcjami?",
        isConditional: true,
        yesText:
          "✓ Pergamin! Szybko czytasz instrukcję... Znalazłeś ukryty przejście!",
        noText: "✗ Nie masz pergaminu. Panika! Biegniesz na oślep.",
        yesNextId: "10",
        noNextId: "11",
      },
    ],
  },
  "10": {
    id: "10",
    isDirect: false,
    accessibleFrom: ["9"],
    text: "Dzięki instrukcjom z pergaminu znajdujesz ukryte przejście w ścianie. Przechodzisz przez niego i trafiasz do starego tunelu... Ucieka! 🎉",
    choices: [
      { id: "c16", text: "Wróć do biblioteki", nextParagraphId: "3" },
    ],
  },
  "11": {
    id: "11",
    isDirect: false,
    accessibleFrom: ["9"],
    text: "Biegniesz na oślep przez korytarze. Przypadkowo trafiasz na schody prowadzące na dach. Widok jest oszołamiający, ale również bardzo niebezpieczny... ☠️",
    choices: [{ id: "c17", text: "Wróć na dół", nextParagraphId: "3" }],
  },
};
