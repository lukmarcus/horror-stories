# Horror Stories - Aplikacja Towarzysząca

Interaktywna aplikacja webowa dla gry planszowej Horror Stories, stworzona w React 19 + TypeScript + Vite. Aplikacja umożliwia zarządzanie scenariuszami, śledzenie stanu gry i bogatą narracyjną doświadczenie.

## Informacje o projekcie

- **Nazwa**: Horror Stories
- **Wersja**: 0.2.4
- **Autor**: Marek Szumny
- **Licencja**: MIT
- **Opis**: Aplikacja towarzysząca grze planszowej Horror Stories

## Funkcjonalności

- 🎮 Interaktywny wybór scenariuszy i rozgrywka
- 🎲 Mechanika rzutów kostką
- 🎭 Bogate paragrafy narracyjne z wyborem opcji
- 🎵 Wsparcie dla audio playera i dźwięków atmosferycznych
- ✏️ Edytor scenariuszy — tworzenie, eksport i wczytywanie plików `.horrorstory`
- 📱 Responsywny interfejs w ciemnym motywie
- ⚡ Szybki development dzięki Vite HMR
- 🔒 TypeScript w trybie strict

## Stack technologiczny

- **Frontend**: React 19
- **Narzędzie budowania**: Vite
- **Język**: TypeScript (tryb strict)
- **Routing**: React Router v7
- **Testowanie**: Vitest + jsdom
- **Style**: CSS z CSS Variables
- **Menadżer pakietów**: npm

## Architektura

### Separation of Concerns

Projekt jest zorganizowany wg. czytelnych warstw:

- **types/** - Centralne definicje typów (Scenario, Paragraph, Choice, DiceResult)
- **data/** - Dane aplikacji (SCENARIOS, PARAGRAPHS constants)
- **components/** - Komponenty React (Business + UI components)
- **pages/** - Strony/routy (Home, Game, ScenariosList, etc.)
- **utils/** - Logika biznesowa i helpery (gameLogic, paragraphParser, paragraphAccessibility)
- **styles/** - CSS organizowany po warstwach (global, variables, pages)

### Kluczowe cechy

- **Type Safety**: Wszystkie typy w TypeScript strict mode
- **Game Logic**: Oddzielona od komponentów (src/utils/gameLogic.ts)
  - **Data-driven**: Dane gry w src/scenarios/ i src/data/items/, nie w komponentach
- **Accessible**: Walidacja dostępności paragrafów z warningami użytkownika
- **Tested**: 380+ testów pokrywających logikę gry, komponenty i utility functions

## Struktura projektu

```
horror-stories/
├── src/
│   ├── components/
│   │   ├── views/               # Główne widoki gry (ParagraphView, InputView, PrepareView, DiceView, IndirectView)
│   │   ├── text/                # Komponenty do obsługi tekstu (RichText, ParagraphText)
│   │   ├── ui/                  # Komponenty UI (Button, Header, Footer, SectionHeader)
│   │   └── ErrorBoundary/       # Error boundary komponent
│   ├── editor/                  # Edytor scenariuszy (layout, context, formularze, eksport/import ZIP)
│   ├── data/                    # Dane przedmiotów i przeciwników (JSON)
│   ├── pages/                   # Strony/routy (Home, ScenariosList, Game, Instructions, About)
│   ├── hooks/                   # Custom hooks (useGame, useGameActions)
│   ├── types/                   # Definicje TypeScript (Scenario, Paragraph, Choice, ContentBlock, etc.)
│   ├── utils/                   # Funkcje pomocnicze (gameLogic, paragraphParser, validation, etc.)
│   ├── scenarios/               # Dane scenariuszy (JSON + setup/paragraphs)
│   ├── styles/
│   │   ├── variables.css        # CSS custom properties (kolory, spacing, font-size)
│   │   ├── global.css           # Globalne style i reset
│   │   └── pages/               # Style specyficzne dla stron
│   ├── assets/                  # Zasoby (litery, osoby, symbole, audio, obrazy)
│   ├── App.tsx                  # Router i główny layout
│   └── main.tsx                 # Punkt wejścia
├── public/
│   ├── assets/                  # Statyczne zasoby (audio, obrazy, logo)
│   └── scenarios/               # Opcjonalne pliki JSON scenariuszy
├── docs/                        # Dokumentacja projektu
│   ├── SPECIFICATION.md         # Specyfikacja funkcjonalności i formatu JSON
│   ├── ROADMAP.md               # Plan rozwoju i wersji
│   ├── CHANGELOG.md             # Historia zmian
│   ├── CODE_QUALITY.md          # Wytyczne kodowania
│   ├── TESTING_GUIDE.md         # Wytyczne testowania
│   └── SCENARIO_SCHEMA.md       # Szczegółowy opis struktury scenariuszy
└── package.json                 # Konfiguracja npm
```

## Jak uruchomić

### Wymagania

- Node.js 20.19+ lub 22.12+
- npm

### Instalacja

```bash
npm install
```

### Development

```bash
npm run dev
```

Aplikacja będzie dostępna na `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Dokumentacja

- [ROADMAP.md](docs/ROADMAP.md) - Plan rozwoju i wersji
- [CHANGELOG.md](docs/CHANGELOG.md) - Historia zmian
