# Testing Guide - Horror Stories

Wytyczne dla testów i code coverage.

## Test Structure

```
src/
├── utils/
│   ├── gameLogic.ts
│   ├── gameLogic.test.ts          # Unit tests
│   ├── paragraphParser.ts
│   └── paragraphParser.test.ts
├── hooks/
│   ├── useGame.ts
│   ├── useGame.test.ts            # Hook tests
│   └── ...
├── components/
│   ├── RichText/
│   │   ├── index.tsx
│   │   ├── RichText.test.ts       # Component unit tests
│   │   └── RichText.css
│   └── ...
└── pages/
    ├── Game.tsx
    ├── Game.test.tsx              # Component tests
    ├── Game.e2e.test.tsx          # End-to-end tests
    └── ...
```

## Test Types

### Unit Tests

Testują pojedyncze funkcje/komponenty w izolacji.

```typescript
// gameLogic.test.ts
describe("GameLogic - Accessibility", () => {
  it("should validate paragraph accessibility", () => {
    const paragraph: Paragraph = {
      id: "5",
      text: "Test paragraph",
      choices: [],
      direct: false, // Not directly accessible
      accessibleFrom: ["3", "4"],
    };

    const isAccessible =
      paragraph.direct || (paragraph.accessibleFrom?.length ?? 0) > 0;
    expect(isAccessible).toBe(true);
  });

  it("should reject unreachable paragraph", () => {
    const paragraph: Paragraph = {
      id: "99",
      text: "Unreachable",
      direct: false, // Not directly accessible
      // no accessibleFrom - unreachable!
    };

    const isAccessible =
      paragraph.direct || (paragraph.accessibleFrom?.length ?? 0) > 0;
    expect(isAccessible).toBe(false);
  });
});
```

### Component Tests

Testują renderowanie i interakcje.

```typescript
// Button.test.tsx
describe("Button Component", () => {
  it("should render button with text", () => {
    const { getByRole } = render(
      <Button variant="primary" size="md">
        Click me
      </Button>
    );

    const button = getByRole("button");
    expect(button).toHaveTextContent("Click me");
  });

  it("should call onClick handler", () => {
    const onClick = vi.fn();
    const { getByRole } = render(
      <Button onClick={onClick}>Click</Button>
    );

    fireEvent.click(getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("should be disabled when prop is true", () => {
    const { getByRole } = render(
      <Button disabled>Disabled</Button>
    );

    const button = getByRole("button");
    expect(button).toBeDisabled();
  });
});
```

### Integration Tests

Testują interakcje między komponentami.

```typescript
// Game.test.tsx
describe("Game - Paragraph Logic", () => {
  it("should navigate to next paragraph on choice click", () => {
    const paragraphs: Record<string, Paragraph> = {
      "1": {
        id: "1",
        text: "Start",
        choices: [{ text: "Go to 2", nextParagraphId: "2" }],
      },
      "2": {
        id: "2",
        text: "End",
        choices: [],
      },
    };

    const { currentParagraphId, setParagraph } = useGame();
    expect(currentParagraphId).toBe("1");

    // Simulate choice click
    setParagraph("2");
    expect(currentParagraphId).toBe("2");
  });
});
```

### End-to-End Tests

Testują cały scenariusz od początku do końca.

```typescript
// Game.e2e.test.tsx
describe("End-to-End Scenario - Droga Donikąd", () => {
  it("should complete Jessica path", () => {
    // Scenario entry
    expect(paragraphs["1"].choices[0].nextParagraphId).toBe("9");

    // Character choice
    expect(paragraphs["9"].choices[0].text).toBe("Jessica");
    expect(paragraphs["9"].choices[0].nextParagraphId).toBe("9-jessica");

    // Path to end
    let current = "9-jessica";
    while (paragraphs[current].choices.length > 0) {
      current = paragraphs[current].choices[0].nextParagraphId!;
    }

    expect(current).toBe("50"); // Dead end
  });
});
```

## Coverage Guidelines

Każda publiczna funkcja/hook powinna mieć testy dla:

1. **Happy Path** - normalne działanie
2. **Edge Cases** - graniczne sytuacje
3. **Error Handling** - obsługa błędów

### Coverage Checklist

- ✅ Logika gry (navigacja, walidacja)
- ✅ System wariantów (akumulacja, reset, separacja)
- ✅ State management (variantPath, paragraph changes)
- ✅ Dostępność paragrafów (direct/indirect)
- ✅ Browser history (URL state)
- ✅ Input validation
- ✅ Multi-page support
- ✅ Rich text parsing
- ✅ żetony stanów (`<status>` tag)
- ✅ Walidacja metadanych edytora (`toSlug`, `validateMeta`)
- ✅ localStorage CRUD dla scenariuszy użytkownika

### Current Coverage (v0.2.0)

| Category            | Tests   | Coverage | Status |
| ------------------- | ------- | -------- | ------ |
| Game Logic          | 3       | 100%     | ✅     |
| Variant System      | 18      | 100%     | ✅     |
| Hooks (State)       | 26      | ~80%     | ✅     |
| Utils (Parsing)     | 40      | ~100%    | ✅     |
| Components          | 96      | ~95%     | ✅     |
| Data / Items        | 13      | 100%     | ✅     |
| Pages               | 53      | mixed    | ✅     |
| E2E                 | 54      | —        | ✅     |
| Editor (Validation) | 24      | 100%     | ✅     |
| Editor (Storage)    | 8       | 100%     | ✅     |
| **Total**           | **335** | **~63%** | **✅** |

## Running Tests

```bash
# Run all tests
npm run test

# Run tests once (CI mode)
npm run test -- --run

# Run specific file
npm run test -- src/utils/gameLogic.test.ts

# Watch mode (default)
npm run test

# Coverage report
npm run test -- --coverage

# Debug tests
npm run test -- --inspect-brk
```

## Best Practices

### 1. Arrange-Act-Assert (AAA)

```typescript
it("should calculate score correctly", () => {
  // Arrange - setup
  const choices = ["jessica", "left-door"];

  // Act - do something
  const score = calculateScore(choices);

  // Assert - verify
  expect(score).toBe(150);
});
```

### 2. Descriptive Test Names

```typescript
// ✅ DOBRY STYL - co się testuje i jaki powinien być rezultat?
it("should return -1 when searching for non-existent item");
it("should add item to cart and increase count");
it("should clear variant path when navigating to new paragraph");

// ❌ ZŁY STYL - nie jasne co się testuje
it("should work");
it("test search function");
it("variant test");
```

### 3. DRY in Tests

```typescript
// ✅ DOBRY STYL
const createParagraph = (id: string, text: string = "Test"): Paragraph => ({
  id,
  text,
  choices: [],
  direct: true,
});

describe("Paragraph Tests", () => {
  it("should find paragraph", () => {
    const p = createParagraph("5");
    expect(p.id).toBe("5");
  });
});

// ❌ ZŁY STYL - powtarzanie
it("should find paragraph", () => {
  const p = { id: "5", text: "Test", choices: [], direct: true };
  // ...
});
```

### 4. Test Isolation

```typescript
// ✅ DOBRY STYL - każdy test niezależny
describe("Game State", () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  it("should start at paragraph 1", () => {
    expect(game.currentParagraph).toBe("1");
  });

  it("should navigate on choice", () => {
    game.choice(0);
    expect(game.currentParagraph).toBe("2");
    // Poprzedni test nie wpływa na ten!
  });
});
```

### 5. Mock External Dependencies

```typescript
// ✅ DOBRY STYL
const mockFetch = vi.fn();
global.fetch = mockFetch;

it("should load scenario", async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ id: "1", title: "Scenario" }),
  });

  const scenario = await loadScenario("1");
  expect(scenario.title).toBe("Scenario");
});
```

## Performance Tests

```typescript
// ✅ Testuj performance-critical funkcje
it("should parse large paragraph in < 100ms", () => {
  const largeText = "word ".repeat(10000);

  const start = performance.now();
  const result = parseRichText(largeText);
  const duration = performance.now() - start;

  expect(duration).toBeLessThan(100);
  expect(result).toBeDefined();
});
```

## Debugging Tests

```bash
# Run single test
npm run test -- --grep "should navigate"

# Debug in Node Inspector
npm run test -- --inspect-brk

# Verbose output
npm run test -- --reporter=verbose
```

## Continuous Integration

Testy automat uruchamiają się na:

- Push do `develop` i `main`
- Pull requests
- Scheduled (nightly builds)

**Status must:** All tests passing
