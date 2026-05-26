# TECH_DEBT.md - Horror Stories

Plan zadań technicznych do realizacji w v0.2.7.

Kolejność według priorytetu (ocena 1–10: ryzyko × wartość × nakład).

---

## v0.2.7 — Nowe zadania

### ~~★ 8/10 — Testy `validateMeta`~~ ✅ 9e49a52

**Plik:** `src/editor/components/scenario/scenarioMetaValidation.ts`  
**Problem:** Funkcja `validateMeta` ma 7 oddzielnych warunków (tytuł, opis, zakres graczy, czas, min<max), ale nie ma żadnego testu. Logika jest odpowiedzialna za wyświetlanie błędów w formularzu metadanych.  
**Działanie:** Stworzyć `scenarioMetaValidation.test.ts` pokrywający wszystkie gałęzie — w tym warunek `maxPlayerCount < minPlayerCount`, wartości graniczne (0, PLAYER_MAX+1) i puste stringi.  
**Ryzyko:** zerowe. **Nakład:** ~45 min.

---

### ★ 7/10 — Wydzielenie `DropdownPicker`

**Plik:** `src/editor/components/paragraph/EditorInlineTools.tsx`  
**Problem:** `ColorPicker`, `ImagePicker`, `SnippetPicker` mają identyczną strukturę: `useState(open)` + `useClickOutside` + toggle-button + dropdown. Wzorzec powtórzy się przy dodaniu kolejnych pickerów.  
**Działanie:** Stworzyć generyczny `DropdownPicker<T>` z propsami `toggle`, `children` i wydzielić do `EditorDropdownPicker.tsx`. Skrócić plik `EditorInlineTools.tsx` o ~80 linii.  
**Ryzyko:** niskie. **Nakład:** ~1 h.

---

### ~~★ 6/10 — Dedykowana akcja `CONVERT_TEXT_TO_PAGES`~~ ✅

**Plik:** `src/editor/components/paragraph/EditorParagraphView.tsx` (linia ~218), `src/editor/context/editorReducer.ts`  
**Problem:** Przycisk "Przekonwertuj na bloki" wywołuje `LOAD_SCENARIO` z ręcznie skonstruowanym całym scenariuszem. Bypasuje abstrakcję reducera — zmiana struktury danych wymaga edycji komponentu.  
**Działanie:** Dodać akcję `{ type: "CONVERT_TEXT_TO_PAGES"; payload: string }` do reducera. Komponent przekazuje tylko `paragraphId`.  
**Ryzyko:** niskie. **Nakład:** ~30 min.

---

### ~~★ 5/10 — `<div onClick>` → `<button>` w sidebarze~~ ✅

**Plik:** `src/editor/components/layout/EditorLayout.tsx` (linia ~103)  
**Problem:** Każdy paragraf w pasku bocznym to `<div onClick>`. Elementy `div` nie są focusowalne klawiaturą, nie mają roli semantycznej — screen-readery ich nie wykrywają.  
**Działanie:** Zamienić `<div onClick>` na `<button>` lub `<li role="option">`. Dodać `aria-current="true"` dla aktywnego elementu.  
**Ryzyko:** zerowe (tylko HTML). **Nakład:** ~15 min.

---

### ~~★ 5/10 — Testy `filterIds` i `sortParagraphIds`~~ ✅ 9e49a52

**Plik:** `src/editor/utils/editorUtils.ts`  
**Problem:** `filterIds` i `sortParagraphIds` są używane w wielu miejscach, ale nie mają żadnych testów. Edge-case'y: pusty string, ID mieszane (numeryczne + alfanumeryczne), dopasowanie częściowe.  
**Działanie:** Stworzyć `editorUtils.test.ts`.  
**Ryzyko:** zerowe. **Nakład:** ~20 min.

---

### ~~★ 5/10 — Walidacja danych przy odczycie z `editorStorage`~~ ✅

**Plik:** `src/editor/utils/editorStorage.ts`  
**Problem:** `loadFromStorage()` zwraca `request.result as EditorScenario` bez walidacji. Uszkodzony lub niekompletny zapis w IndexedDB powoduje cichy błąd runtime zamiast czytelnego komunikatu.  
**Działanie:** Użyć `isValidEditorScenario` (analogicznie do `isValidScenarioMeta` w zipHandlerze) lub przynajmniej sprawdzić `typeof result === "object"` i obecność `meta`/`paragraphs`. Przy błędzie — `clearStorage()` i zwrócenie `null` z logiem.  
**Ryzyko:** niskie. **Nakład:** ~30 min.

---

---

## Priorytet 1 — Szybkie wygrane (niskie ryzyko, wysoka wartość)

### ~~★ 8/10 — Helper `updateParagraph` w reducerze~~ ✅ 125405a

**Plik:** `src/editor/context/editorReducer.ts`  
**Problem:** Wzorzec `paragraphs.map(p => p.id === X ? { ...p, ... } : p)` powtarza się w 20+ case'ach reducera. Każda literówka w warunku to cichy bug.  
**Działanie:** Wyciągnąć pomocniczą funkcję `mapParagraph(paragraphs, id, updateFn)` i zastąpić wszystkie powtórzenia.  
**Ryzyko:** niskie — czysta refaktoryzacja bez zmiany zachowania. **Nakład:** ~1.5 h.

---

### ~~★ 7/10 — Wyciągnięcie `sortParagraphIds`~~ ✅ 49083b7

**Pliki:** `src/editor/components/paragraph/EditorParagraphView.tsx`, `src/editor/components/layout/EditorLayout.tsx`  
**Problem:** Identyczna logika numerycznego sortowania ID (`parseInt` + fallback `localeCompare`) skopiowana w 3 miejscach.  
**Działanie:** Dodać `sortParagraphIds(ids: string[]): string[]` do `src/editor/utils/editorUtils.ts`.  
**Ryzyko:** zerowe. **Nakład:** ~20 min.

---

### ~~★ 7/10 — Wyciągnięcie `<PagePreview>`~~ ✅ 49083b7

**Pliki:** `src/editor/components/paragraph/VariantEditor.tsx`, `src/editor/components/paragraph/EditorParagraphView.tsx`  
**Problem:** Identyczny blok `pages.map(page => page.map(block => <RichText>))` w obu komponentach.  
**Działanie:** Stworzyć `src/editor/components/paragraph/PagePreview.tsx` z propsem `pages: ContentBlock[][]`.  
**Ryzyko:** zerowe. **Nakład:** ~30 min.

---

### ~~★ 5/10 — `useMemo` dla pochodnych wartości w `EditorParagraphView`~~ ✅ 49083b7

**Plik:** `src/editor/components/paragraph/EditorParagraphView.tsx`  
**Problem:** `availableIds`, `incomingFrom`, `variantIds` przeliczane na każdy render przez filtrowanie całej tablicy paragrafów.  
**Działanie:** Opakować trzy obliczenia w `useMemo` z właściwymi zależnościami.  
**Ryzyko:** zerowe. **Nakład:** ~10 min.

---

## Priorytet 2 — Testy brakujących przypadków

### ~~★ 8/10 — Testy nested akcji reducera~~ ✅ 8170afb

**Plik:** `src/editor/context/EditorContext.test.ts`  
**Problem:** Istniejące 53 testy pokrywają głównie `ADD/REMOVE_PARAGRAPH`, `SET_META`, proste choices. Brakuje testów dla:

- `ADD/UPDATE/REMOVE_VARIANT_CHOICE`
- `SET_VARIANT_PAGES`, `SET_VARIANT_HORIZONTAL`
- `ADD/UPDATE/REMOVE_VARIANT_SELECTOR`
- `ADD/REMOVE_VARIANT`
- `SET_PARAGRAPH_PAGES`, `ADD/REMOVE_PAGE`, `ADD/UPDATE/REMOVE_BLOCK`

**Ryzyko:** zerowe. **Nakład:** ~2 h.

---

## Priorytet 3 — Większe zmiany architektoniczne

### ~~★ 6/10 — Walidacja typów przy deserializacji ZIP~~ ✅ (v0.2.7)

**Plik:** `src/editor/utils/zipHandler.ts`  
**Problem:** Dane wczytane z pliku ZIP są castowane przez `as any` bez walidacji kształtu. Zmieniony format pliku = cichy runtime error zamiast czytelnego komunikatu.  
**Działanie:** Stworzyć type-guard `isValidEditorScenario(data: unknown): data is EditorScenario` i wywołać przy imporcie.  
**Ryzyko:** średnie — wymaga dobrego pokrycia wszystkich pól. **Nakład:** ~2 h.

---
