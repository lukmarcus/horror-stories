# TECH_DEBT.md - Horror Stories

Plan zadań technicznych. Kolejność według priorytetu (ocena 1–10: ryzyko × wartość × nakład).

---

## Backlog

### ★ 7/10 — `EditorParagraphView.tsx` — podział na podkomponenty

**Plik:** `src/editor/components/paragraph/EditorParagraphView.tsx` (674 linie)
**Problem:** Jeden komponent obsługuje: tryb prosty i wariantowy, aliasy, confirmacje destruktywne, sekcję liter, preview, edycję wyborów i wariantów. Trudny do testowania i rozbudowy.
**Działanie:** Wydzielić co najmniej: `ParagraphAliasesSection`, `ParagraphChoicesSection`, `ParagraphModeToggle`. Logika trybu wariantowego może trafić do osobnego `VariantParagraphView`.
**Ryzyko:** średnie — wymaga uważnego przepisania propsów. **Nakład:** ~3 h.

---

### ★ 4/10 — `ParagraphView.tsx` — uproszczenie logiki wariantów

**Plik:** `src/components/text/ParagraphText/ParagraphView.tsx` (394 linie)
**Problem:** Duży komponent prezentacyjny obsługujący: paginację, wybory, warianty, selektory wariantów, wygląd (obrazki, tekst). Logika nie jest zbyt skomplikowana, ale plik jest długi.
**Działanie:** Wydzielić `VariantPages` (renderowanie stron wariantowych), `ParagraphChoices` (sekcja wyborów), `ParagraphImage` (obrazek paragrafu). Pozostawić główny komponent jako kompozycję.
**Ryzyko:** niskie — głównie prezentacyjny kod. **Nakład:** ~2 h.

---

### ★ 3/10 — `VariantEditor.tsx` — podobny wzorzec do `LettersEditor`

**Plik:** `src/editor/components/paragraph/VariantEditor.tsx` (264 linie)
**Problem:** Podobny wzorzec jak `LettersEditor` — wiele `useState`, mixed responsibilities. `VariantEditor` ma 5 stanów lokalnych (rename, collapse, confirmDelete, focused, newChoiceIsVariant).
**Działanie:** Po refaktorze `LettersEditor` zastosować podobny wzorzec — wydzielić co najmniej: `VariantHeader` (rename/collapse/delete UI), `ChoicesEditor`, `VariantPreview`.
**Ryzyko:** niskie. **Nakład:** ~1.5 h.

---

## Rozwiązane w v0.2.12

### ✅ `scenarios/index.ts` — `as unknown as Paragraph[]` x4

**Status:** Rozwiązane — dodano typ pomocniczy `ImportedParagraphs` i używamy pojedynczego rzutowania zamiast podwójnego `as unknown as`.

---

### ✅ `Game.tsx` — eslint-disable bez uzasadnienia

**Status:** Rozwiązane — dodano komentarze wyjaśniające celowe użycie częściowych dependency arrays w trzech useEffect (synchronizacja URL ↔ state wymaga jednostronnych triggerów).

---

### ✅ `LettersEditor.tsx` — podział komponentu i redukcja stanu

**Status:** Rozwiązane — wydzielono `LetterRow` (148 linii) i `AddLetterForm` (141 linii), główny komponent zmniejszony z 402 do 110 linii. Testy: 30/30 ✅, pokrycie: 85%.

---

### ✅ `EnemyView.tsx` — refaktoryzacja na podkomponenty

**Status:** Rozwiązane — wydzielono `EnemyTiles` (34 linie), `DiceButtons` (36 linii), `DiceResult` (29 linii), `ActionDisplay` (80 linii), główny komponent zmniejszony z 262 do 168 linii (-36%). Testy: 17/17 ✅, brak regresji.

**Status:** Rozwiązane — wydzielono `LetterRow` (148 linii) i `AddLetterForm` (141 linii) jako osobne komponenty. Główny `LettersEditor` zredukowany z 402 do 110 linii. Wszystkie 8 stanów lokalnych przeniesione do podkomponentów. Testy (30): 100% przechodzi.

---

### ✅ `RichText.tsx` — cleanup parsera inline formatowania

**Status:** Rozwiązane — wydzielono `customTagRenderers.tsx` (190 linii) i `contentBlockRenderer.tsx` (126 linii) jako utility functions. Główny `RichText.tsx` zredukowany z 351 do 34 linii. Testy (55): 100% przechodzi.

---
