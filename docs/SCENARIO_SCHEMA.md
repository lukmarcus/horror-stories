# Scenario JSON Schema - Horror Stories

Struktura i format plików JSON scenariuszy.

## Paragraph Interface

```typescript
export interface Paragraph {
  // Identyfikacja
  id: string; // Unikatowy ID (number-like string)

  // Zawartość
  text?: string; // Stary format (v0.0.9 i wcześniej)
  contentPages?: ContentBlock[][]; // Multi-page (v0.0.10+)
  content?: ContentBlock[]; // Alternatywa do contentPages

  // Nawigacja
  choices?: Choice[]; // Zwykłe choices
  nextParagraphId?: string; // Auto-navigate (jeśli brak choices)

  // Warianty (v0.0.12+)
  variants?: Record<string, Paragraph>; // Warianty zawartości

  // Dostępność
  direct?: boolean; // Czy dostępny bez linku? (default: true)
  accessibleFrom?: string[]; // Back buttons - skąd można dojść?

  // Layout flags
  isParagraph?: boolean;
  areChoicesHorizontal?: boolean; // Wariantowe choices (horizontal)
  isMultiPage?: boolean; // Legacy flag (auto-detect teraz)
}
```

## Content Blocks

```typescript
export interface ContentBlock {
  text?: string; // Tekst (może zawierać HTML/tags)
  type?: string; // text, image, symbol, person
  html?: string; // Legacy - zamiast `text`
  image?: string; // Image ID reference
  imageUrl?: string; // Direct image URL
  spacing?: "none"; // Brak marginesu dolnego
  size?: "small" | "normal" | "large";
  style?: "italic" | "normal";
}
```

## Choices

```typescript
export interface Choice {
  id?: string; // Unique ID (optional)
  text: string; // Button text
  nextParagraphId?: string; // Navigate to paragraph
  nextVariantId?: string; // Enter variant
  condition?: string; // Conditional logic (future)
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

### direct

Czy paragraf jest dostępny bezpośrednio czy tylko przez linki?

```json
{
  "id": "77",
  "text": "Paragraf niedostępny",
  "direct": false, // Nie można wpisać liczby w linii komendy
  "accessibleFrom": ["15", "20"] // Tylko z tych paragrafów
}
```

## Version History

| Version | Change                  | Example                   |
| ------- | ----------------------- | ------------------------- |
| v0.0.9  | Initial format          | `"text": "..."`           |
| v0.0.10 | Multi-page, Rich text   | `"contentPages": [[...]]` |
| v0.0.12 | Variants, Reset display | `"variants": {...}`       |

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
