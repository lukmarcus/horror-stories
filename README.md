# Horror Stories - Aplikacja Towarzysząca

Interaktywna aplikacja webowa dla gry planszowej Horror Stories, stworzona w React 18 + TypeScript + Vite. Aplikacja umożliwia zarządzanie scenariuszami, śledzenie stanu gry i bogatą narracyjną doświadczenie.

## Informacje o projekcie

- **Nazwa**: Horror Stories
- **Wersja**: 0.0.7
- **Autor**: Marek Szumny
- **Licencja**: MIT
- **Opis**: Aplikacja towarzysząca grze planszowej Horror Stories

## Funkcjonalności

- 🎮 Interaktywny wybór scenariuszy i rozgrywka
- 🎲 Mechanika rzutów kostką
- 🎭 Bogate paragrafy narracyjne z wyborem opcji
- 🎵 Wsparcie dla audio playera i dźwięków atmosferycznych
- 📱 Responsywny interfejs w ciemnym motywie
- ⚡ Szybki development dzięki Vite HMR
- 🔒 TypeScript w trybie strict

## Stack technologiczny

- **Frontend**: React 18+
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
- **Data-driven**: Dane gry w src/data/scenarios.ts, nie w komponentach
- **Accessible**: Walidacja dostępności paragrafów z warningami użytkownika
- **Tested**: 48+ testów pokrywających logikę gry, komponenty i utility functions

## Struktura projektu

```
horror-stories/
├── src/
│   ├── components/      # Komponenty React (Button, Header, Footer, DiceRoller, ConditionalChoice, etc.)
│   ├── pages/           # Strony (Home, ScenariosList, Game, Instructions, About)
│   ├── types/           # Definicje TypeScript (Scenario, Paragraph, Choice, DiceResult, etc.)
│   ├── data/            # Dane gry (SCENARIOS, PARAGRAPHS)
│   ├── utils/           # Funkcje pomocnicze (paragraphParser, gameLogic, paragraphAccessibility, validation)
│   ├── styles/          # Globalne style i zmienne CSS
│   │   ├── variables.css    # CSS custom properties
│   │   ├── global.css       # Globalne style i reset
│   │   └── pages/           # Style specyficzne dla stron
│   ├── App.tsx          # Główny komponent
│   └── main.tsx         # Punkt wejścia
├── public/
│   └── scenarios/       # Pliki JSON scenariuszy (przyszłe)
├── docs/                # Dokumentacja projektu
│   ├── SPECIFICATION.md # Specyfikacja funkcjonalności
│   ├── ROADMAP.md       # Plan rozwoju
│   ├── CHANGELOG.md     # Historia zmian
│   └── REFACTORING.md   # Plan refaktoringu
└── package.json         # Konfiguracja npm
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

- [SPECIFICATION.md](docs/SPECIFICATION.md) - Szczegółowa specyfikacja funkcjonalności
- [ROADMAP.md](docs/ROADMAP.md) - Plan rozwoju i wersji
- [CHANGELOG.md](docs/CHANGELOG.md) - Historia zmian
