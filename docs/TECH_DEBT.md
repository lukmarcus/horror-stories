# TECH_DEBT.md - Horror Stories

Plan zadań technicznych. Kolejność według priorytetu (ocena 1–10: ryzyko × wartość × nakład).

---

## Backlog

### ★ 8/10 — `SetupEditor.tsx` — naruszenie reguł hooków

**Plik:** `src/editor/components/layout/SetupEditor.tsx`
**Problem:** `useMemo` i `useState` wywoływane **po** warunkowym early return `if (!editorCtx) return null`, co narusza Rules of Hooks. W praktyce `EditorContext` zawsze jest dostępny gdy komponent jest renderowany, więc nie powoduje błędu — ale ESLint to flaguje i wzorzec jest kruchy.
**Działanie:** Przenieść early return za wszystkie wywołania hooków, lub wydzielić wewnętrzny komponent `SetupEditorInner` który dostaje `ctx` jako prop.
**Ryzyko:** niskie. **Nakład:** ~15 min.

---

### ★ 7/10 — Sanityzacja HTML (`DOMPurify`) dla importowanych scenariuszy

**Plik:** `src/components/text/RichText/RichText.tsx`, `src/editor/utils/zipHandler.ts`
**Problem:** `RichText` używa `dangerouslySetInnerHTML` na treści paragrafów. Scenariusze wbudowane są autorskie — ryzyko zerowe. Ale użytkownik może załadować **dowolny plik `.horrorstory`**, którego treść trafia do DOM bez sanityzacji. To realne ryzyko XSS przy importach zewnętrznych.
**Działanie:** Dodać `dompurify` + `@types/dompurify`. Wywołać `DOMPurify.sanitize(html)` przed każdym `dangerouslySetInnerHTML`. Alternatywnie: odrzucać nieznane tagi HTML już w `zipHandler` przy imporcie.
**Ryzyko:** niskie (tylko defensive — brak known exploitów w obecnym flow). **Nakład:** ~1 h.

---

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

### ★ 5/10 — `user*Storage.ts` — 5 identycznych plików z boilerplatem

**Pliki:** `src/utils/userScenarioStorage.ts`, `userParagraphStorage.ts`, `userImageStorage.ts`, `userLetterStorage.ts`, `userSetupStorage.ts`
**Problem:** Każdy plik implementuje to samo: `save/load/remove` z tym samym wzorcem `try/catch` i `localStorage`. Dodanie nowego typu danych wymaga kolejnego pliku z copy-paste.
**Działanie:** Wydzielić generyczną fabrykę `createUserStorage<T>(key: (id: string) => string)` zwracającą `{ save, load, remove }`. Każdy plik staje się 3-linijkowym eksportem.
**Ryzyko:** niskie — czysta zmiana wewnętrzna, interfejs publiczny bez zmian. **Nakład:** ~45 min.

---

### ★ 5/10 — `scenarios/index.ts` — `as unknown as Paragraph[]` x4

**Plik:** `src/scenarios/index.ts` (linie 90, 93, 96, 99)
**Problem:** Wszystkie 4 wbudowane scenariusze wymagają podwójnego rzutowania przy przekazaniu do `createParagraphMap`. JSON-y używają `contentPages` zamiast `pages`, `id` jako tablicy itp. — typy nie pasują do interfejsu `Paragraph` bez rzutowania.
**Działanie:** Albo dostosować JSON-y do aktualnego interfejsu (breaking change), albo stworzyć dedykowany typ `RawParagraph` dla JSON-ów scenariuszy i konwerter przy wczytywaniu.
**Ryzyko:** średnie — dotyka wszystkich wbudowanych scenariuszy. **Nakład:** ~2 h.

---

### ★ 4/10 — `editorReducer.ts` — 548 linii w jednej funkcji

**Plik:** `src/editor/context/editorReducer.ts`
**Problem:** Jeden plik obsługuje ~20 grup akcji (paragrafy, warianty, litery, setup, obrazki, meta). Rośnie z każdą wersją. Trudny do nawigacji i testowania poszczególnych sekcji.
**Działanie:** Podzielić na sub-reducery: `paragraphReducer`, `variantReducer`, `letterReducer`, `setupReducer` — złożone przez `combineReducers` lub ręcznie w głównym `editorReducer`.
**Ryzyko:** niskie — logika bez zmian, tylko reorganizacja. **Nakład:** ~2 h.

---

### ★ 4/10 — `EnemyView.tsx` — brakująca zależność w `useEffect`

**Plik:** `src/components/views/EnemyView/EnemyView.tsx` (linia ~59)
**Problem:** `useEffect` używa `selectedEnemy` w ciele, ale tablica deps zawiera tylko `[lastDiceResult]`. Technicznie bezpieczne (osobny efekt resetuje przy zmianie wroga), ale ESLint słusznie to flaguje i wzorzec jest kruchy.
**Działanie:** Dodać `selectedEnemyId` do deps pierwszego efektu (a nie `selectedEnemy`, bo to pochodna) i upewnić się że logika działa poprawnie.
**Ryzyko:** niskie. **Nakład:** ~20 min.

---

### ★ 3/10 — `ErrorBoundary` — brakujące ARIA i inline styles

**Plik:** `src/components/ErrorBoundary/ErrorBoundary.tsx`
**Problem:** Komponent błędu nie ma `role="alert"` ani `aria-live="assertive"` — screen-readery nie ogłaszają błędu. Inline styles zamiast klasy CSS.
**Działanie:** Dodać `role="alert"` na kontenerze błędu, przenieść style do `ErrorBoundary.css`.
**Ryzyko:** zerowe. **Nakład:** ~15 min.

---
