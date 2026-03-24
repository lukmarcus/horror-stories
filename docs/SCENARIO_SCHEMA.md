# Scenario JSON Schema - Horror Stories

Struktura i format plików JSON scenariuszy.

## Paragraph Interface

```typescript
export interface Paragraph {
  // Identyfikacja
  id: string | string[]; // Unikatowy ID — string lub tablica stringów

  // Zawartość
  text?: string; // Stary format tekstu
  content?: ContentBlock[]; // Jedna strona treści
  contentPages?: ContentBlock[][]; // Wielostronicowa treść

  // Nawigacja
  choices?: Choice[];

  // Warianty (v0.0.12+)
  variants?: Record<string, Paragraph>;

  // Media
  image?: string; // URL obrazu paragrafu
  audio?: string;

  // Rzut kością
  hasDiceRoll?: boolean;
  diceRollDescription?: string;
  diceResult?: DiceResult;

  // Dostępność
  // Jeśli accessibleFrom jest puste/undefined — paragraf jest bezpośredni (isDirect=true)
  accessibleFrom?: string[];

  // Layout flags
  areChoicesHorizontal?: boolean; // Wariantowe choices wyświetlane poziomo
  isMultiPage?: boolean; // Legacy flag
  items?: string[];
}
```

## Content Blocks

```typescript
export interface ContentBlock {
  // Nowy format
  text?: string;           // Tekst (może zawierać HTML/tagi)
  image?: string;          // ID obrazu (bez rozszerzenia)

  // Stary format (kompatybilność wsteczna)
  type?: "text" | "image" | "letter" | "item";
  html?: string;           // Zamiast `text` (stary format)
  id?: string;             // ID elementu (stary format image/letter)

  // Opcje formatowania
  size?: "xs" | "sm" | "lg" | "xl";
  style?: "bold" | "italic" | "underline";
  color?: "yellow" | "red" | "purple" | "green";
  spacing?: "none";        // Usuwa dolny margines bloku
}
```

## Choices

```typescript
export interface Choice {
  id: string;              // Wymagane unikatowe ID
  text?: string;           // Tekst przycisku
  nextParagraphId?: string; // Przejdź do paragrafu
  nextVariantId?: string;  // Wejdź w wariant

  // Wybory warunkowe
  isConditional?: boolean;
  yesText?: string;        // Tekst po kliknięciu Tak
  noText?: string;         // Tekst po kliknięciu Nie
  yesNextId?: string;
  noNextId?: string;
}

export interface DiceResult {
  threshold: number;       // Wynik > threshold = sukces
  successText: string;
  successNextId: string;
  failText: string;
  failNextId: string;
}
```

## Examples

### Simple Paragraph

```json
{
  "id": "1",
  "text": "Jesteś w hali głównej biblioteki. Co robisz?",
  "choices": [
    {
      "text": "Przeszukaj regały",
      "nextParagraphId": "2"
    },
    {
      "text": "Podejdź do biurka",
      "nextParagraphId": "3"
    }
  ]
}
```

### Multi-Page Paragraph

```json
{
  "id": "10",
  "contentPages": [
    [{ "text": "Pierwsza strona" }],
    [{ "text": "Druga strona" }],
    [{ "text": "Trzecia strona" }]
  ],
  "choices": [
    {
      "text": "Kontynuuj",
      "nextParagraphId": "11"
    }
  ]
}
```

### Paragraph with Back Buttons

```json
{
  "id": "26",
  "text": "Jesteś w kuchni. Co dalej?",
  "accessibleFrom": ["9", "15", "20"],
  "choices": [
    {
      "text": "Otwórz drzwi",
      "nextParagraphId": "30"
    }
  ]
}
```

### Variant Paragraph (v0.0.12+)

```json
{
  "id": "9",
  "contentPages": [[{ "text": "Którą postacią jesteś?" }]],
  "choices": [
    {
      "text": "Jessica",
      "nextVariantId": "jessica"
    },
    {
      "text": "Patrick",
      "nextVariantId": "patrick"
    }
  ],
  "areChoicesHorizontal": true,
  "variants": {
    "jessica": {
      "contentPages": [[{ "text": "Poznałaś Patrick'a na imprezie." }]],
      "choices": [
        {
          "text": "Idę do kuchni",
          "nextParagraphId": "26"
        }
      ]
    },
    "patrick": {
      "contentPages": [[{ "text": "Głowa ta nie daje Ci żyć." }]],
      "choices": [
        {
          "text": "Idę do kuchni",
          "nextParagraphId": "26"
        }
      ]
    }
  }
}
```

### Paragraph with Images & Rich Text

```json
{
  "id": "50",
  "contentPages": [
    [
      { "text": "Jesteś w pokoju ze złowrogą atmosferą." },
      { "image": "dark-room", "spacing": "none" },
      { "text": "Czujesz <strong>zimno</strong>. Co robisz?" }
    ]
  ],
  "choices": [
    {
      "text": "Rozłóż <em>ogień</em>",
      "nextParagraphId": "51"
    }
  ]
}
```

### Nested Variants

```json
{
  "id": "9",
  "contentPages": [[{ "text": "Wybierz postać" }]],
  "choices": [
    {
      "text": "Jessica",
      "nextVariantId": "jessica"
    }
  ],
  "variants": {
    "jessica": {
      "contentPages": [[{ "text": "Jessica view" }]],
      "choices": [
        {
          "text": "Detale",
          "nextVariantId": "jessica-detail"
        }
      ],
      "variants": {
        "jessica-detail": {
          "contentPages": [[{ "text": "Jessica detailed view" }]],
          "choices": [
            {
              "text": "Wróć do wyboru",
              "nextParagraphId": "26"
            }
          ]
        }
      }
    }
  }
}
```

## HTML Tags Support

Obsługiwane tagi w polu `text`:

```html
<!-- Formatowanie tekstu -->
<em>italic text</em>
<strong>bold text</strong>

<!-- Komponenty custom -->
<letter id="j">Custom letter</letter>
<symbol id="star">Custom symbol</symbol>
<item id="key">Custom item</item>
<image id="room">Custom image</image>

<!-- Kolory -->
<span class="color-red">Red text</span>
<span class="color-blue">Blue text</span>
<span class="color-gold">Gold text</span>
```

## Spacing Control

```json
{
  "id": "15",
  "contentPages": [
    [
      {
        "text": "Ostatni akapit przed przyciskami"
      },
      {
        "text": "Podpowiedź:",
        "spacing": "none"  // Usuwa dopełnienie dolne
      },
      {
        "text": "To jest ważne!",
        "spacing": "none"
      }
    ]
  ],
  "choices": [... ]
}
```

## Layout Flags

### areChoicesHorizontal

Dla wariantów - wyświetla choices w linii zamiast stosu:

```json
{
  "id": "9",
  "choices": [
    { "text": "Jessica", "nextVariantId": "jessica" },
    { "text": "Patrick", "nextVariantId": "patrick" }
  ],
  "areChoicesHorizontal": true // Side-by-side instead of stacked
}
```

### accessibleFrom

Czy paragraf jest dostępny bezpośrednio czy tylko przez linki? Jeśli `accessibleFrom` jest pustą tablicą lub `undefined` — paragraf jest bezpośredni (można wpisać numer). Jeśli zawiera ID — pojawia się ostrzeżenie "Niebezpośredni paragraf".

```json
{
  "id": "77",
  "content": [{ "text": "Paragraf niedostępny bezpośrednio" }],
  "accessibleFrom": ["15", "20"]
}
```

## Version History

| Version | Change                            | Example                             |
| ------- | --------------------------------- | ----------------------------------- |
| v0.0.9  | Initial format                    | `"text": "..."`                     |
| v0.0.10 | Multi-page, Rich text             | `"contentPages": [[...]]`           |
| v0.0.12 | Variants, Reset display           | `"variants": {...}`                 |
| v0.1.0  | DiceResult, content (single-page) | `"hasDiceRoll": true`               |
| v0.1.1  | id jako tablica, isConditional    | `"id": ["5", "6"]`, `"isConditional": true` |

## Best Practices

1. **Unique IDs** - Każdy paragraf ma unikatowe ID
2. **Proper linking** - Wszystkie nextParagraphId istnieją
3. **Back navigation** - accessibleFrom dla niedostępnych paragrafów
4. **Variant structure** - Zagniezdzony warianty z variant content
5. **Content organization** - Logiczne podziały na stron

## Migration Guide

### v0.0.10→v0.0.12 (Text Format)

```json
// Stare (v0.0.10)
{
  "id": "9-jessica",
  "text": "Jessica story"
}

// Nowe (v0.0.12) - warianty wewnątrz paragrafu
{
  "id": "9",
  "variants": {
    "jessica": {
      "text": "Jessica story"
    }
  }
}
```

## JSON Schema Validation

Schemat TypeScript jest dostępny w `src/types/index.ts`:

```typescript
import type { Paragraph } from "../types";

const myParagraph: Paragraph = {
  id: "5",
  text: "Valid paragraph",
  choices: [],
};
```

## Tools

```bash
# Validate JSON syntax
npm run build

# Check for broken links
npm run validate:paragraphs  # (future)

# Format JSON files
npm run format:json  # (future)
```

## Common Errors

```json
// ❌ Missing ID
{
  "text": "Missing ID"
}

// ✅ Include ID
{
  "id": "5",
  "text": "Has ID"
}

// ❌ Broken link
{
  "id": "5",
  "choices": [
    { "text": "Go", "nextParagraphId": "999" }  // 999 doesn't exist!
  ]
}

// ❌ Missing accessibleFrom for non-direct
{
  "id": "77",
  "direct": false,
  "text": "Unreachable!"  // No accessibleFrom paths!
}

// ✅ Proper non-direct
{
  "id": "77",
  "direct": false,
  "accessibleFrom": ["15", "20"],
  "text": "Reachable from 15 or 20"
}
```
