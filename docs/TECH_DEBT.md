# TECH_DEBT.md - Horror Stories

Plan zadań technicznych do realizacji w v0.2.7.

Kolejność według priorytetu (ocena 1–10: ryzyko × wartość × nakład).

---

## Priorytet 1 — Szybkie wygrane (niskie ryzyko, wysoka wartość)

### ~~★ 10/10 — Usunięcie nieużywanych klas CSS~~ ✅ f1f6948

**Plik:** `src/editor/components/paragraph/EditorParagraphView.css`  
**Problem:** 8 klas zdefiniowanych w CSS, nieobecnych w TSX (~55 linii do usunięcia):

| Klasa                    | Powód                                    |
| ------------------------ | ---------------------------------------- |
| `__choice-text`          | Zastąpiona przez `ChoiceTextInput`       |
| `__choice-type-select`   | `<select>` zastąpiony przyciskiem        |
| `__preview-choice-arrow` | Stary styl strzałki przed przyciskami    |
| `__preview-mode-label`   | Usunięty z JSX                           |
| `__preview-selector`     | Zastąpiony przez `Button`                |
| `__preview-variants`     | Wrapper nie używany w JSX                |
| `__variant-layout-row`   | Zastąpiony przez `__choices-heading-row` |
| `__variants-header`      | Stary nagłówek listy wariantów           |

**Ryzyko:** zerowe. **Nakład:** ~15 min.

---

### ~~★ 9/10 — Wspólna funkcja `filterIds`~~ ✅ 5ee1b1f

**Plik:** `src/editor/components/paragraph/EditorParagraphView.tsx`  
**Problem:** `v ? list.filter(id => id.includes(v)) : list` pojawia się 4 razy pod różnymi nazwami: `filteredOptions`, `filteredList`, `filteredIds`, `filteredVariantIds`.  
**Działanie:** Dodać `filterIds(value: string, list: string[]): string[]` do `src/editor/utils/editorUtils.ts` i zastąpić wszystkie cztery użycia.  
**Ryzyko:** zerowe. **Nakład:** ~20 min.

---

## Priorytet 2 — Testy czystych funkcji

### ~~★ 9/10 — Testy `textToPage` / `pageToText`~~ ✅ 9525ab3

**Plik:** `src/editor/components/paragraph/PagesEditor.tsx` (linie 72–130)  
**Problem:** Serializacja/deserializacja `ContentBlock ↔ tekst` to czyste funkcje bez testów. Każda zmiana może zepsuć zapis/odczyt blokowej treści bez żadnego sygnału.  
**Działanie:** Stworzyć `PagesEditor.test.ts` z przypadkami:

- round-trip: `pageToText(textToPage(s)) === s`
- bloki z formatowaniem (bold, color, size)
- puste strony, wielostronicowe

**Ryzyko:** zerowe. **Nakład:** ~45 min.

---

### ★ 8/10 — Testy `buildAccessibleFrom`

**Plik:** `src/editor/utils/zipHandler.ts` (linie 8–33)  
**Problem:** Funkcja buduje graf „skąd można dotrzeć do paragrafu" — używana przy każdym eksporcie ZIP. Brak testów.  
**Działanie:** Stworzyć `zipHandler.test.ts` z przypadkami:

- paragraf bez wejść → brak wpisu
- paragraf z jednym i wieloma wejściami
- wariantowe wybory (`nextParagraphId` z wnętrza wariantu)

**Ryzyko:** zerowe. **Nakład:** ~30 min.

---

### ★ 6/10 — Testy `buildDefinition` w `GraphView`

**Plik:** `src/editor/components/graph/GraphView.tsx`  
**Problem:** Czysta funkcja budująca definicję Mermaid — łatwa do przetestowania, ale nieprzetestowana.  
**Działanie:** Stworzyć `GraphView.test.ts` z przypadkami: pusty scenariusz, wybory → strzałki, warianty → strzałki, §100 z etykietą.  
**Ryzyko:** zerowe. **Nakład:** ~30 min.

---

## Priorytet 3 — Strukturalne wydzielenie komponentów

### ★ 9/10 — Wyciągnięcie `VariantEditor` do osobnego pliku

**Plik:** `src/editor/components/paragraph/EditorParagraphView.tsx` (~300 linii sub-komponentu w pliku 1116-liniowym)  
**Działanie:** Przenieść do `VariantEditor.tsx` + `VariantEditor.css` (klasy `__variant-*`).  
**Ryzyko:** niskie — czyste przeniesienie bez zmiany logiki. **Nakład:** ~1 h.

---

### ★ 8/10 — Wyciągnięcie `ChoiceRow` do osobnego pliku

**Plik:** `src/editor/components/paragraph/EditorParagraphView.tsx` (~110 linii sub-komponentu)  
**Problem:** `ChoiceRow` jest używany przez oba tryby (prosty i wariantowy) ale zdefiniowany w pliku głównego komponentu. Dla spójności z wydzieleniem `VariantEditor` powinien żyć osobno.  
**Działanie:** Przenieść do `ChoiceRow.tsx`. CSS pozostaje w `EditorParagraphView.css` (klasy `__choice-row`, `__choice-target-wrap` są też używane przez `ChoiceAddRow`).  
**Ryzyko:** niskie. **Nakład:** ~30 min.

---

### ★ 7/10 — Wyciągnięcie `<ChoiceAddRow>` jako wspólny komponent

**Plik:** `src/editor/components/paragraph/EditorParagraphView.tsx` (3× duplikat)  
**Problem:** Wzorzec „pole tekstowe + target input + dropdown + przycisk + Dodaj" skopiowany trzykrotnie (nowy wybór prosty, nowy selektor wariantu, nowy wybór w `VariantEditor`). Różni się tylko typem akcji i prefiksem (`§` vs `W`).  
**Działanie:** Stworzyć `ChoiceAddRow.tsx` z propsami `onAdd`, `targetPrefix`, `targetList`, `placeholder`.  
**Ryzyko:** niskie, wymaga starannego przekazania callbacków. **Nakład:** ~1 h.

---

### ★ 7/10 — Hook `useClickOutside`

**Plik:** `src/editor/components/paragraph/EditorInlineTools.tsx`  
**Problem:** `ColorPicker`, `ImagePicker`, `SnippetPicker` — każdy ma identyczny `useEffect` z `mousedown` listenarem do zamykania.  
**Działanie:** Stworzyć `src/hooks/useClickOutside.ts` i zastąpić trzy kopie.  
**Ryzyko:** zerowe, hook jest prostym extract. **Nakład:** ~20 min.

---

## Priorytet 4 — Większe zmiany architektoniczne

### ★ 5/10 — `ENABLE_VARIANT_MODE` / `DISABLE_VARIANT_MODE` w reducerze

**Plik:** `src/editor/context/editorReducer.ts`  
**Problem:** Przełączanie trybów w `EditorParagraphView` odbywa się przez dispatch `LOAD_SCENARIO` z ręcznie zrekonstruowanym scenariuszem — omija reducer i łamie zasadę single source of truth.  
**Działanie:** Dodać dwie nowe akcje, przenieść logikę konwersji do reducera, zaktualizować testy.  
**Ryzyko:** średnie — wymaga uważnej migracji logiki i aktualizacji ~602-liniowego zestawu testów. **Nakład:** ~2 h.

---

### ★ 4/10 — Deduplikacja `insertAtCursor` / `wrap` / `insertSnippet`

**Pliki:** `src/editor/components/paragraph/PagesEditor.tsx`, `ChoiceTextInput.tsx`  
**Problem:** Te same funkcje wstawiające tekst skopiowane w obu plikach — różnią się tylko typem elementu (`textarea` vs `input`).  
**Działanie:** Stworzyć `src/editor/utils/textInsert.ts` z funkcjami generycznymi.  
**Ryzyko:** niskie, ale szeroki zakres zmian. **Nakład:** ~1.5 h.

---
