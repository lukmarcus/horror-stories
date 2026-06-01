# TECH_DEBT.md - Horror Stories

Plan zadań technicznych. Kolejność według priorytetu (ocena 1–10: ryzyko × wartość × nakład).

---

## v0.2.8 — ✅ Ukończone

- ✅ Refaktor `PagesEditor.tsx` — 500+ linii podzielono na `BlockToolbar`, `PageToolbar`, `BlockEditor`
- ✅ Inline potwierdzenia — wszystkie potwierdzenia destructywne (nowy scenariusz, usuń, przełącz wariant) bez systemowych okienek
- ✅ Popup-y błędów — globalne obsługiwanie błędów w interfejsie

---

## v0.2.9 — Nowe zadania

### ★ 8/10 — Refaktor `PagesEditor.tsx` (podział na podkomponenty)

**Plik:** `src/editor/components/paragraph/PagesEditor.tsx`
**Problem:** Plik ma ~500 linii i łączy zarządzanie stanem, serializację, renderowanie pasków narzędzi, obsługę klawiatury i logikę bloków w jednym komponencie. Utrudnia to testowanie i zrozumienie.
**Działanie:** Wydzielić co najmniej: `BlockToolbar`, `PageToolbar`, `BlockEditor`. Serializacja już wydzielona do `pageSerializer.ts`.
**Ryzyko:** średnie — wymaga starannego podziału propsów. **Nakład:** ~3 h.

---

### ★ 7/10 — Sanityzacja HTML (`DOMPurify`) dla importowanych scenariuszy

**Plik:** `src/components/text/RichText/RichText.tsx`, `src/editor/utils/zipHandler.ts`
**Problem:** `RichText` używa `dangerouslySetInnerHTML` na treści paragrafów. Scenariusze wbudowane są autorskie — ryzyko zerowe. Ale użytkownik może załadować **dowolny plik `.horrorstory`**, którego treść trafia do DOM bez sanityzacji. To realne ryzyko XSS przy importach zewnętrznych.
**Działanie:** Dodać `dompurify` + `@types/dompurify`. Wywołać `DOMPurify.sanitize(html)` przed każdym `dangerouslySetInnerHTML`. Alternatywnie: odrzucać nieznane tagi HTML już w `zipHandler` przy imporcie.
**Ryzyko:** niskie (tylko defensive — brak known exploitów w obecnym flow). **Nakład:** ~1 h.

---

### ★ 6/10 — `Game.tsx` — trzy `eslint-disable` dla `useEffect` deps

**Plik:** `src/pages/Game.tsx` (linie 38, 60, 102)
**Problem:** Trzy `// eslint-disable-next-line react-hooks/exhaustive-deps` omijają zamiast rozwiązywać problem z zależnościami hooków. Używany `useRef` (`isUrlDrivenChange`) do synchronizacji URL ↔ stanu — wzorzec działający, ale kruchy przy zmianach.
**Działanie:** Zbadać czy refaktoryzacja na `useReducer` + `useEffect` z prawidłowymi deps rozwiązuje problem bez `ref`. Ewentualnie dodać komentarz uzasadniający supresję.
**Ryzyko:** średnie — zmiana synchronizacji URL może wprowadzić regresjy. **Nakład:** ~2 h.

---

### ★ 5/10 — `RichText.tsx` — wydzielenie rendererów custom tagów

**Plik:** `src/components/text/RichText/RichText.tsx`
**Problem:** ~200-liniowa funkcja `parseHtml` obsługuje 10 typów tagów w jednym wielkim `if/else if`. Dodanie nowego tagu wymaga edycji tej samej funkcji. Brak testów dla poszczególnych ścieżek.
**Działanie:** Wydzielić mapę `TAG_RENDERERS: Record<string, (id, key, scenarioId) => ReactNode>`. Dodać testy dla każdego renderera.
**Ryzyko:** niskie. **Nakład:** ~1.5 h.

---

### ★ 4/10 — `EnemyView.tsx` — brakująca zależność w `useEffect`

**Plik:** `src/components/views/EnemyView/EnemyView.tsx` (linia ~59)
**Problem:** `useEffect` używa `selectedEnemy` w ciele, ale tablica deps zawiera tylko `[lastDiceResult]`. Technicznie bezpieczne (osobny efekt resetuje przy zmianie wroga), ale ESLint słusznie to flaguje i wzorzec jest kruchy.
**Działanie:** Dodać `selectedEnemyId` do deps pierwszego efektu (a nie `selectedEnemy`, bo to pochodna) i upewnić się że logika działa poprawnie.
**Ryzyko:** niskie. **Nakład:** ~20 min.

---

### ★ 3/10 — `ErrorBoundary` — brakujące ARIA

**Plik:** `src/components/ErrorBoundary/ErrorBoundary.tsx`
**Problem:** Komponent błędu nie ma `role="alert"` ani `aria-live="assertive"` — screen-readery nie ogłaszają błędu. Inline styles zamiast klasy CSS.
**Działanie:** Dodać `role="alert"` na kontenerze błędu, przenieść style do `ErrorBoundary.css`.
**Ryzyko:** zerowe. **Nakład:** ~15 min.

---

### ★ 3/10 — `ErrorBoundary` — brakujące ARIA

**Plik:** `src/components/ErrorBoundary/ErrorBoundary.tsx`
**Problem:** Komponent błędu nie ma `role="alert"` ani `aria-live="assertive"` — screen-readery nie ogłaszają błędu. Inline styles zamiast klasy CSS.
**Działanie:** Dodać `role="alert"` na kontenerze błędu, przenieść style do `ErrorBoundary.css`.
**Ryzyko:** zerowe. **Nakład:** ~15 min.

---
