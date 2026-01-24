# Horror Stories - Aplikacja Towarzysząca

Interaktywna aplikacja webowa dla gry planszowej Horror Stories, stworzona w React 18 + TypeScript + Vite. Aplikacja umożliwia zarządzanie scenariuszami, śledzenie stanu gry i bogatą narracyjną doświadczenie.

## Informacje o projekcie

- **Nazwa**: Horror Stories
- **Wersja**: 0.0.0
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

- **Frontend**: React 18
- **Narzędzie budowania**: Vite
- **Język**: TypeScript (tryb strict)
- **Routing**: React Router v7
- **Style**: CSS z CSS Variables
- **Menadżer pakietów**: npm

## Struktura projektu

```
horror-stories/
├── src/
│   ├── components/      # Komponenty React
│   ├── pages/           # Strony (routing)
│   ├── types/           # Definicje TypeScript
│   ├── utils/           # Funkcje pomocnicze
│   ├── styles/          # Globalne style i zmienne CSS
│   ├── App.tsx          # Główny komponent
│   └── main.tsx         # Punkt wejścia
├── public/
│   └── scenarios/       # Pliki JSON scenariuszy
├── docs/                # Dokumentacja projektu
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
