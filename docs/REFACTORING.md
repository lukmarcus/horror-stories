# REFACTORING.md - Horror Stories

Pendujące refaktory techniczne. Ukończone trafiają do CHANGELOG.md.

---

## Otwarte refaktory

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

### 6. Przeniesienie logiki `handleRollDice` z `Game.tsx` do hooka — 7/10

Animacja kości (pętla `setTimeout` × 10, `Math.random()`, aktualizacje stanu) siedzi bezpośrednio w page component. Powinna trafić do `useGame` jako akcja `ROLL_DICE` + efekt, albo do osobnego `useDiceRoll`.

- **Nakład**: 45 minut
- **Ryzyko**: średnie (logika animacji + testowanie)

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

## Plan wdrożenia

### v0.1.2 — Strukturalne refaktory (z safety netem po v0.1.1)

| Kolejność | Refaktor                                       | Ocena |
| --------- | ---------------------------------------------- | ----- |
| 1         | #3 hardcoded `"77"` → konfiguracja scenariusza | 8/10  |
| 2         | #9 centralizacja `ContentBlock` / `SetupStep`  | 7/10  |
| 3         | #10 `useGameActions` → zwykły moduł            | 6/10  |
| 4         | #8 duplikacja paginacji w `ParagraphView`      | 7/10  |
| 5         | #11 ujednolicenie `<Button>`                   | 5/10  |

### v0.1.3 — Architektura (najbardziej ryzykowne zmiany)

| Kolejność | Refaktor                                     | Ocena |
| --------- | -------------------------------------------- | ----- |
| 1         | #2 naprawa image URL w `RichText`            | 8/10  |
| 2         | #6 `handleRollDice` do hooka / `useDiceRoll` | 7/10  |

---

## Kontekst techniczny

- **Stack**: React 19 + TypeScript 5.9 + Vite 7, brak backendu
- **Stan gry**: `useReducer` w `useGame.ts`, 20 typów akcji, brak globalnego state (brak Redux/Zustand/Context)
- **Dane**: statyczne JSON pre-processowane przy starcie modułu przez `createParagraphMap()`
- **URL sync**: dwukierunkowy (dwa efekty + `useRef` flag zapobiegający pętlom)
