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

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
