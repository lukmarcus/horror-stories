# Code Quality Guidelines - Horror Stories

Wytyczne dla utrzymania wysokiej jakości kodu w projekcie Horror Stories.

## 1. Organizacja Plików

### Structure

```
src/
├── components/        # Komponenty React
│   ├── common/       # Komponenty UI (Header, Footer, Button)
│   ├── ParagraphDisplay/
│   ├── DiceRoller/
│   └── ConditionalChoice/
├── pages/            # Strony/Routy (Home, Game, About, Instructions, etc.)
├── hooks/            # Custom React hooks (useGame, useGameActions)
├── utils/            # Logika biznesowa i helpery
├── types/            # TypeScript type definitions
├── scenarios/        # Dane scenariuszy
├── styles/           # CSS organizowany po warstwach
│   ├── global.css
│   ├── variables.css
│   └── pages/        # CSS specyficzne dla stron
└── assets/           # Statyczne zasoby (images, letters, symbols, persons)
```

### Zamykanie Importów

Preferuj barrel exports (`index.ts`) do zamykania importów:

```typescript
// ✅ DOBRY STYL - używa barrel export
import { useGame, useGameActions } from "../hooks";
import { parseParagraphText, checkParagraphAccessibility } from "../utils";

// ❌ ZŁY STYL - deep import
import { useGame } from "../hooks/useGame";
import { parseParagraphText } from "../utils/paragraphParser";
```

## 2. Export Consistency

### Strony i Komponenty

Wszystkie strony i komponenty powinny używać `export const`:

```typescript
// ✅ DOBRY STYL
export const Home: React.FC = () => {
  // ...
};

// ❌ ZŁY STYL - nie rób tego
export default Home;
```

### Moduły Publiczne

Dostarczaj barrel exports (`index.ts`) dla każdego publicznego modułu:

```typescript
// src/hooks/index.ts
export { useGame } from "./useGame";
export { useGameActions } from "./useGameActions";

// src/utils/index.ts
export { parseParagraphText } from "./paragraphParser";
export { checkParagraphAccessibility } from "./gameLogic";
```

## 3. TypeScript

### Type Safety

- Używaj `TypeScript` zamiast `any`
- Definiuj interfejsy dla komponentów i funkcji
- Eksportuj publiczne typy z modułów

```typescript
// ✅ DOBRY STYL
export interface ButtonProps {
  variant: "primary" | "secondary" | "outline" | "text";
  size: "sm" | "md" | "lg";
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ variant, size, onClick }) => {
  // ...
};
```

### Type Imports

Używaj `type` imports dla type-only imports:

```typescript
// ✅ DOBRY STYL
import type { Paragraph, Choice } from "../types";
import { parseParagraphText } from "../utils";

// ❌ ZŁY STYL - mieszanie typów i wartości
import { Paragraph, Choice, parseParagraphText } from "../types";
```

## 4. Komponenty React

### Nomenklatura

- Komponenty: `PascalCase` (np. `MyComponent.tsx`)
- Props interfaces: `ComponentNameProps` (np. `MyComponentProps`)
- Hooks: `useHookName` (np. `useGame`)

### Struktura Komponentu

```typescript
// 1. Importy
import React from "react";
import type { Props } from "./types";

// 2. Interface definicji (jeśli komponent ma props)
export interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

// 3. Komponent
export const MyComponent: React.FC<MyComponentProps> = ({ title, onClick }) => {
  // Logika komponentu
  return (
    <div>
      {title}
      <button onClick={onClick}>Click</button>
    </div>
  );
};
```

## 5. Testy

### Test Files

- Testy jednostkowe: `*.test.ts` lub `*.test.tsx`
- Testy end-to-end: `*.e2e.test.tsx`
- Testy powinny być w tym samym folderze co kod testowany

```
src/utils/
├── gameLogic.ts
├── gameLogic.test.ts
├── paragraphParser.ts
└── paragraphParser.test.ts
```

### Coverage

Każda publiczna funkcja/hook powinna mieć testy:

- Happy path (normalne działanie)
- Edge cases (przypadki graniczne)
- Error handling (obsługa błędów)

## 6. CSS i Styling

### Organizacja

- Globalne style: `src/styles/global.css`
- CSS Variables: `src/styles/variables.css`
- Style specyficzne dla stron: `src/styles/pages/`
- CSS Modules: `src/components/ComponentName/ComponentName.module.css`

### Nomenklatura

Używaj BEM (Block Element Modifier):

```css
/* Block */
.button {
}

/* Element */
.button__text {
}

/* Modifier */
.button--primary {
}
.button--disabled {
}

/* State */
.button.is-loading {
}
.button.is-active {
}
```

### CSS Variables

```css
/* Definiuj w variables.css */
:root {
  --color-primary: #ff6b6b;
  --color-text: #ffffff;
  --spacing-sm: 0.5rem;
  --border-radius-md: 4px;
}

/* Używaj wszędzie */
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
}
```

## 7. Dead Code

### Usuwanie

Regularnie skanuj i usuwaj martwy kod:

- Placeholder komponenty (bez implementacji)
- Nieużywane zmienne i funkcje
- Zakomentowany kod stary

```typescript
// ❌ USUNĄĆ
// const oldFunction = () => {
//   // stara implementacja
// };

// ❌ USUNĄĆ - placeholder
export const Paragraph: React.FC = () => {
  return <div>Placeholder</div>;
};
```

## 8. Commitowanie

### Commit Messages

Używaj konwencji:

- `feat: ` - nowa funkcjonalność
- `fix: ` - naprawa buga
- `refactor: ` - refaktoryzacja bez zmian funkcjonalności
- `test: ` - dodawanie/modyfikacja testów
- `docs: ` - dokumentacja
- `chore: ` - zmiana build toolów, konfiguracji, etc.

```bash
# ✅ DOBRY STYL
git commit -m "refactor: Simplify paragraph parser logic"
git commit -m "feat: Add support for multi-page paragraphs"
git commit -m "fix: Correct routing in GitHub Pages"

# ❌ ZŁY STYL
git commit -m "fixes"
git commit -m "updated stuff"
```

## 9. Performance

### React Optimization

- Unikaj renderowania bez potrzeby (memoization, useMemo)
- Rozdzielaj komponenty na mniejsze części
- Lazy-loaduj komponenty jeśli to możliwe

```typescript
// ✅ DOBRY STYL - memoization
const ParagraphDisplay = React.memo(({ paragraph }: Props) => {
  return <div>{paragraph.text}</div>;
});

// ✅ DOBRY STYL - useMemo na expensive computations
const processedParagraph = useMemo(
  () => parseParagraphText(paragraph),
  [paragraph]
);
```

## 10. Accessibility (a11y)

### Wytyczne

- Wszystkie przyciski powinny mieć labels
- Elementy interaktywne powinny być dostępne z klawiatury
- Kolory nie powinny być jedynym żródłem informacji
- Alt text dla wszystkich obrazów

```typescript
// ✅ DOBRY STYL
<button aria-label="Close dialog" onClick={onClose}>
  ✕
</button>

<img src="paragraph.jpg" alt="Scene from the story" />

// ❌ ZŁY STYL
<button onClick={onClose}>✕</button>
<img src="paragraph.jpg" />
```

## 11. Error Handling

### Try-Catch

```typescript
// ✅ DOBRY STYL
try {
  const scenario = await loadScenario(id);
} catch (error) {
  console.error("Failed to load scenario:", error);
  // Obsłuż błąd gracefully
}

// ❌ ZŁY STYL - brak error handling
const scenario = await loadScenario(id);
```

### Error Boundaries

Używaj Error Boundary dla niespodziewanych błędów:

```typescript
export class ErrorBoundary extends Component<Props, State> {
  // Obsługa błędów React
}
```

## 12. Dokumentacja

### Komentarze

- Dodawaj komentarze do skomplikowanej logiki
- Nie komentuj oczywistego kodu
- Utrzymuj komentarze aktualne

```typescript
// ✅ DOBRY STYL - wyjaśnia WHY, nie WHAT
// Paragraf może być dostępny tylko z określonych źródeł
// dzięki systemie accessibleFrom, więc sprawdzamy zarówno
// połączenia direct jak i indirect
const isReachable = isDirect || hasValidAccessibleFrom;

// ❌ ZŁY STYL - nie wyjaśnia nic nowego
const isReachable = true; // isReachable is true
```

### JSDoc dla publicznych funkcji

```typescript
/**
 * Ładuje scenariusz z serwera
 * @param scenarioId - ID scenariusza do załadowania
 * @returns Promise z danymi scenariusza
 * @throws Error jeśli scenariusz nie istnieje
 */
export async function loadScenario(scenarioId: string): Promise<Scenario> {
  // ...
}
```

## 13. Przyczyny Refactoringu

### Kiedy refaktorować

- Kod jest trudny do zrozumienia
- Powtarzania się (DRY - Don't Repeat Yourself)
- Potrzeba nowej funkcjonalności
- Po naprawie bugu (jeśli ujawnił słabości)
- Performance issues

### Kiedy NIE refaktorować

- Gdy robi to kod pracujący prawidłowo bez problemu
- Bez testów (dodaj testy najpierw!)
- Na ostatni moment przed deadline

## 14. Scenario JSON Schema (v0.0.10+)

### Struktura Paragrafu

```typescript
interface Paragraph {
  id: string | string[]; // String lub array dla wielokrotnych ID-ów
  text: string; // Główny tekst paragrafu
  contentPages?: ContentBlock[][]; // Dla wielostronicowych paragrafów
  content?: ContentBlock[]; // Zawartość paragrafów (tekst, obrazy, etc)
  choices?: Choice[]; // Dostępne wybory dla gracza
  accessibleFrom?: number[]; // ID-y paragrafów z których można tu dojść
}

interface ContentBlock {
  text?: string; // Tekst (może zawierać tagi HTML: <em>, <strong>, itd)
  size?: "small" | "normal" | "large";
  style?: "italic" | "normal";
  image?: string; // ID obrazu
  spacing?: "none"; // Brak marginesu pod tym blokiem
}

interface Choice {
  next: number; // ID paragrafu docelowego
  text: string; // Tekst przycisku (może zawierać HTML)
  condition?: string; // Warunek (np. diceThreshold)
}
```

### Multi-ID Paragraphs

Gdy ten sam tekst powinien być dostępny z wielu źródeł, używaj array ID:

```json
{
  "id": [9, "9-jessica", "9-patrick"],
  "text": "Historia dla obu postaci...",
  "choices": [{ "next": 26, "text": "Idę do kuchni" }]
}
```

**Zastosowanie:** Konsolidacja duplikatów paragrafów dla Jessica/Patrick.

### Spacing Control

Pole `spacing: "none"` wyłącza margines dolny bloku (ważne przed przyciskami):

```json
{
  "id": 5,
  "content": [
    {
      "text": "Ostatni akapit przed przyciskami"
    },
    {
      "text": "Podpowiedź:",
      "spacing": "none"
    }
  ],
  "choices": [...]
}
```

**Automatyka:** Ostatni blok w paragrafie automatycznie otrzymuje `spacing: "none"` przy ładowaniu (patrz `createParagraphMap()`).

### Text Field Standardization

**Stary format (przed v0.0.10):**

```json
{
  "type": "text",
  "html": "Tekst z <strong>HTML</strong>"
}
```

**Nowy format (v0.0.10+):**

```json
{
  "text": "Tekst z <strong>HTML</strong>"
}
```

**Obsługiwane tagi HTML:**

- `<em>` - kursywa
- `<strong>` - pogrubienie
- `<letter id="...">` - literka (symbol)
- `<item id="...">` - przedmiot
- `<image id="...">` - obrazek
- `<span class="color-X">` - kolory (CSS klasy)

### Choice Formatting

Choices mogą zawierać HTML w polu `text`:

```json
{
  "next": 26,
  "text": "Idę do <strong>kuchni</strong>"
}
```

Komponent automatycznie renderuje HTML jeśli `text` zawiera `<`.

---

## 15. Continuous Integration

### Testy przed commitem

```bash
# Sprawdź TypeScript
npm run build

# Uruchom testy
npm run test

# Sprawdź linting
npm run lint
```

---

**Ostatnia aktualizacja:** 2026-02-16
