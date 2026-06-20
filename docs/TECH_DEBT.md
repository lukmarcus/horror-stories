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

### ★ 6/10 — `Game.tsx` — trzy `eslint-disable` dla `useEffect` deps

**Plik:** `src/pages/Game.tsx` (linie 41, 63, 117)
**Problem:** Trzy `// eslint-disable-next-line react-hooks/exhaustive-deps` omijają zamiast rozwiązywać problem z zależnościami hooków. Używany `useRef` (`isUrlDrivenChange`) do synchronizacji URL ↔ stanu — wzorzec działający, ale kruchy przy zmianach.
**Działanie:** Zbadać czy refaktoryzacja na `useReducer` + `useEffect` z prawidłowymi deps rozwiązuje problem bez `ref`. Ewentualnie dodać komentarz uzasadniający supresję.
**Ryzyko:** średnie — zmiana synchronizacji URL może wprowadzić regresje. **Nakład:** ~2 h.

---

## Rozwiązane w v0.2.12

### ✅ `scenarios/index.ts` — `as unknown as Paragraph[]` x4

**Status:** Rozwiązane — dodano typ pomocniczy `ImportedParagraphs` i używamy pojedynczego rzutowania zamiast podwójnego `as unknown as`.

---
