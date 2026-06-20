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



### ★ 5/10 — `LettersEditor.tsx` — podział komponentu i redukcja stanu

**Plik:** `src/editor/components/layout/LettersEditor.tsx` (402 linie)
**Problem:** Jeden komponent obsługuje: listę liter, dodawanie, edycję inline, usuwanie z konfirmacją, autocomplete paragrafów. 8 różnych `useState` (confirmDeleteId, newLetter, newParaInput, addError, editingValues, editErrors, addFocused, addHighlighted).
**Działanie:** Wydzielić `LetterRow` (pojedynczy wiersz z edycją i usuwaniem) i `AddLetterForm` (formularz dodawania z autocomplete). Ewentualnie zastąpić multiple `useState` przez `useReducer`.
**Ryzyko:** niskie — dobrze odseparowana logika, mało zależności. **Nakład:** ~2 h.

---

### ★ 4/10 — `ParagraphView.tsx` — uproszczenie logiki wariantów

**Plik:** `src/components/text/ParagraphText/ParagraphView.tsx` (394 linie)
**Problem:** Duży komponent prezentacyjny obsługujący: paginację, wybory, warianty, selektory wariantów, wygląd (obrazki, tekst). Logika nie jest zbyt skomplikowana, ale plik jest długi.
**Działanie:** Wydzielić `VariantPages` (renderowanie stron wariantowych), `ParagraphChoices` (sekcja wyborów), `ParagraphImage` (obrazek paragrafu). Pozostawić główny komponent jako kompozycję.
**Ryzyko:** niskie — głównie prezentacyjny kod. **Nakład:** ~2 h.

---

### ★ 3/10 — `RichText.tsx` — cleanup parsera inline formatowania

**Plik:** `src/components/text/RichText/RichText.tsx` (351 linii)
**Problem:** Parser tekstu z inline formatowaniem (**bold**, _italic_, {{alias}}, [[dice]], [[conditional]], [[info]]) działa poprawnie, ale logika parsowania jest rozproszona w jednym długim komponencie.
**Działanie:** Wydzielić funkcje parsujące jako utility: `parseInlineFormatting()`, `parseSpecialTags()`. Można rozważyć cache dla często używanych wzorców.
**Ryzyko:** niskie — stabilny komponent, rzadko modyfikowany. **Nakład:** ~1.5 h.

---

### ★ 3/10 — `VariantEditor.tsx` i `EnemyView.tsx` — podobny wzorzec do `LettersEditor`

**Pliki:** `src/editor/components/paragraph/VariantEditor.tsx` (264 linie), `src/components/views/EnemyView/EnemyView.tsx` (262 linie)
**Problem:** Podobny wzorzec jak `LettersEditor` — wiele `useState`, mixed responsibilities. `VariantEditor` ma 5 stanów lokalnych, `EnemyView` obsługuje animacje + stany wroga.
**Działanie:** Po refaktorze `LettersEditor` zastosować podobny wzorzec (wydzielenie podkomponentów/useReducer). Można rozważyć jako follow-up do ★5/10.
**Ryzyko:** niskie. **Nakład:** ~1.5 h każdy.

---

## Rozwiązane w v0.2.12

### ✅ `scenarios/index.ts` — `as unknown as Paragraph[]` x4

**Status:** Rozwiązane — dodano typ pomocniczy `ImportedParagraphs` i używamy pojedynczego rzutowania zamiast podwójnego `as unknown as`.

---

### ✅ `Game.tsx` — eslint-disable bez uzasadnienia

**Status:** Rozwiązane — dodano komentarze wyjaśniające celowe użycie częściowych dependency arrays w trzech useEffect (synchronizacja URL ↔ state wymaga jednostronnych triggerów).

---
