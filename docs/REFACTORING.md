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

### 6. Przeniesienie logiki `handleRollDice` z `Game.tsx` do hooka — 7/10

Animacja kości (pętla `setTimeout` × 10, `Math.random()`, aktualizacje stanu) siedzi bezpośrednio w page component. Powinna trafić do `useGame` jako akcja `ROLL_DICE` + efekt, albo do osobnego `useDiceRoll`.

- **Nakład**: 45 minut
- **Ryzyko**: średnie (logika animacji + testowanie)

---

## Plan wdrożenia

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
