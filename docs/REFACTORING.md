# REFACTORING.md - Horror Stories v0.1.1

Analiza techniczna kodu i propozycje refaktorów przygotowane przed wdrożeniem kolejnych scenariuszy.

---

## Propozycje refaktorów (ocena 0–10)

### 1. Usunięcie zduplikowanego `GameState` z `types/index.ts` — 9/10

`src/types/index.ts` eksportuje `GameState` z polami `{history, isComplete, scenarioId, currentParagraphId}`, który nigdzie nie jest używany. `src/hooks/useGame.ts` definiuje własny `GameState` z zupełnie inną strukturą (12 pól). Ta kolizja nazw aktywnie myli — ktoś czytając `types/index.ts` myśli, że rozumie stan gry, a czyta fikcję.

- **Nakład**: 5 minut
- **Ryzyko**: zero

---

### 2. Naprawa ścieżek obrazów w `RichText.tsx` — 8/10

Dwa warianty budowania URL w tym samym pliku:

- shorthand `block.image` → `../../../scenarios/...`
- `block.type === "image"` → `../../scenarios/...`

Jeden z nich prowadzi do złego miejsca w drzewie katalogów. Potencjalny bug produkcyjny ukryty za brakiem 404 w trybie dev.

- **Nakład**: 10 minut
- **Ryzyko**: niskie

---

### 3. Ekstrakcja hardcoded `"77"` do konfiguracji scenariusza — 8/10

Numer paragrafu startowego `"77"` jest zahardcodowany w dwóch miejscach:

- `Game.tsx` — `game.setParagraph("77")`
- `PrepareView.tsx` — label przycisku "Przejdź do paragrafu 77"

Każdy nowy scenariusz z innym numerem startowym wymaga edycji kodu komponentów. Powinno być polem w `setup.json` lub `Scenario`.

- **Nakład**: 30 minut
- **Ryzyko**: niskie (wymaga zmiany schematu danych)

---

### 4. Usunięcie martwego `scenarioLoader.ts` i błędnych walidacji — 8/10

- `loadScenario()` fetchuje z `/scenarios/${id}.json` (endpoint nie istnieje)
- `loadScenarios()` zwraca `[]`
- `validateParagraph` uznaje każdy realny paragraf za invalid (sprawdza `paragraph.text` jako required, ale dane używają `contentPages`/`content`)

Cały plik jest re-eksportowany z `utils/index.ts` — co sugeruje, że to jest architektura projektu. To dezinformacja.

- **Nakład**: 15 minut
- **Ryzyko**: zero (dead code)

---

### 5. Naprawa testów — importowanie kodu który testują — 8/10

~80% testów re-implementuje logikę inline zamiast importować prawdziwy kod. Żaden z poniższych plików nie ma `import` z `src/`:

- `edgeCases.test.ts`
- `paragraphAccessibility.test.ts`
- `variantParagraphs.test.ts`
- `ConditionalChoice.test.ts`
- `layoutFlags.test.ts`

Testy te przejdą nawet jeśli cały `src/` zostanie usunięty.

- **Nakład**: wysoki (1–2 dni)
- **Ryzyko**: niskie, wysoka wartość długoterminowa

---

### 6. Przeniesienie logiki `handleRollDice` z `Game.tsx` do hooka — 7/10

Animacja kości (pętla `setTimeout` × 10, `Math.random()`, aktualizacje stanu) siedzi bezpośrednio w page component. Powinna trafić do `useGame` jako akcja `ROLL_DICE` + efekt, albo do osobnego `useDiceRoll`.

- **Nakład**: 45 minut
- **Ryzyko**: średnie (logika animacji + testowanie)

---

### 7. Rename `getAccumulatedParagraph` → `getDisplayParagraph` — 7/10

Funkcja **nie** akumuluje — zwraca tylko ostatni wariant ze ścieżki. Komentarz w kodzie explicite mówi, że nazwa jest myląca. Każdy kto szuka logiki "akumulacji" traci czas.

- **Nakład**: 2 minuty
- **Ryzyko**: zero

---

### 8. Usunięcie duplikacji paginacji w `ParagraphView.tsx` — 7/10

Przyciski Poprzednia/Następna strona są renderowane dwa razy:

1. w slotcie `controls` `SectionHeader`
2. w `game__scenario-footer`

Ten sam JSX w dwóch miejscach — jedna zmiana wymaga dwóch edycji.

- **Nakład**: 20 minut
- **Ryzyko**: niskie (wymaga testów CSS)

---

### 9. Centralizacja typu `ContentBlock` / `SetupStep` — 7/10

Ta sama struktura (`{html?, image?, text?, ...}`) jest definiowana w trzech miejscach:

- `types/index.ts` — `ContentBlock`
- `scenarios/index.ts` — `SetupStep`
- `PrepareView.tsx` — anonimowy interfejs lokalny

`SetupStep` i `PrepareView` powinny reużywać `ContentBlock`.

- **Nakład**: 20 minut
- **Ryzyko**: niskie

---

### 10. Konwersja `useGameActions` na zwykły moduł — 6/10

Plik nazywa się "hook" i używa `useXxx` konwencji, ale nie ma w sobie żadnej logiki hookowej (`useState`/`useEffect`/`useContext`). To zwykła fabryka zwracająca dwie czyste funkcje.

- **Nakład**: 10 minut
- **Ryzyko**: niskie (tylko zmiana nazwy importu)

---

### 11. Ujednolicenie `<Button>` vs raw `<button className="button ...">` w `ParagraphView` — 5/10

Komponent `Button` istnieje właśnie po to, żeby nie pisać `className="button button--primary button--lg"`. W `ParagraphView` oba podejścia są mieszane w tym samym pliku.

- **Nakład**: 15 minut
- **Ryzyko**: zero

---

### 12. Usunięcie `validateInput` z `useGameActions` — 5/10

Funkcja jest eksportowana, ale `Game.tsx` jej nigdy nie wywołuje. Walidacja inputu odbywa się bezpośrednio w `InputView`. Dead code w publicznym API hooka.

- **Nakład**: 5 minut
- **Ryzyko**: zero

---

## Priorytetyzacja

| Priorytet         | Refaktor                                      | Ocena |
| ----------------- | --------------------------------------------- | ----- |
| 🔥 Teraz (v0.1.1) | #1 `GameState` duplikat                       | 9/10  |
| 🔥 Teraz (v0.1.1) | #4 martwy `scenarioLoader` i walidacje        | 8/10  |
| 🔥 Teraz (v0.1.1) | #7 rename `getAccumulatedParagraph`           | 7/10  |
| 🔥 Teraz (v0.1.1) | #12 dead `validateInput`                      | 5/10  |
| 📅 v0.1.1         | #2 image URL bug w `RichText`                 | 8/10  |
| 📅 v0.1.1         | #3 hardcoded `"77"` → konfiguracja            | 8/10  |
| 📅 v0.1.1         | #8 duplikacja paginacji w `ParagraphView`     | 7/10  |
| 📅 v0.1.1         | #9 centralizacja `ContentBlock` / `SetupStep` | 7/10  |
| 📅 v0.1.1         | #10 `useGameActions` → zwykły moduł           | 6/10  |
| 🗓️ v0.2.0+        | #5 naprawa testów                             | 8/10  |
| 🗓️ v0.2.0+        | #6 `handleRollDice` do hooka                  | 7/10  |
| 🗓️ v0.2.0+        | #11 ujednolicenie `<Button>`                  | 5/10  |

---

## Kontekst techniczny

- **Stack**: React 19 + TypeScript 5.9 + Vite 7, brak backendu
- **Stan gry**: `useReducer` w `useGame.ts`, 20 typów akcji, brak globalnego state (brak Redux/Zustand/Context)
- **Dane**: statyczne JSON pre-processowane przy starcie modułu przez `createParagraphMap()`
- **URL sync**: dwukierunkowy (dwa efekty + `useRef` flag zapobiegający pętlom)
