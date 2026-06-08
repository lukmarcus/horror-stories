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

### ★ 4/10 — `startParagraphId` vs `SetupStep.choices` — konflikt modelu nawigacji

**Pliki:** `src/types/index.ts`, `src/pages/Game.tsx` (linia 270, 276), `src/components/views/PrepareView/PrepareView.tsx`
**Problem:** `Scenario.startParagraphId` definiuje paragraf startowy (fallback: `"1"`). Po v0.2.9 `SetupStep.choices` może nawigować do dowolnego paragrafu — de facto zastępując `startParagraphId`. Istnieją dwa równoległe mechanizmy wejścia do gry. `PrepareView` wyświetla przycisk "Przejdź do paragrafu {startParagraphId}" — co jest mylące gdy krok setupu ma własne choices.
**Działanie:** Ustalić priorytet: setup choice > startParagraphId > `"1"`. Ewentualnie `startParagraphId` staje się "domyślnym" (gdy brak choices w setupie), a `PrepareView` chowa przycisk startu gdy ostatni krok ma choices.
**Ryzyko:** średnie — zmiana flow gry. **Nakład:** ~2 h.

---

### ★ 5/10 — `scenarios/index.ts` — `as unknown as Paragraph[]` x4

**Plik:** `src/scenarios/index.ts` (linie 90, 93, 96, 99)
**Problem:** Wszystkie 4 wbudowane scenariusze wymagają podwójnego rzutowania przy przekazaniu do `createParagraphMap`. JSON-y używają `contentPages` zamiast `pages`, `id` jako tablicy itp. — typy nie pasują do interfejsu `Paragraph` bez rzutowania.
**Działanie:** Albo dostosować JSON-y do aktualnego interfejsu (breaking change), albo stworzyć dedykowany typ `RawParagraph` dla JSON-ów scenariuszy i konwerter przy wczytywaniu.
**Ryzyko:** średnie — dotyka wszystkich wbudowanych scenariuszy. **Nakład:** ~2 h.

---
