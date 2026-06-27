# TECH_DEBT.md - Horror Stories

Plan zadań technicznych. Kolejność według priorytetu (ocena 1–10: ryzyko × wartość × nakład).

---

## Backlog

---

### ✅ `EditorParagraphView.tsx` — podział na podkomponenty

**Status:** Rozwiązane — wydzielono 5 podkomponentów: `EditorPreview` (105 linii), `VariantsSection` (81 linii), `SimpleModeEditor` (95 linii), `VariantModeEditor` (117 linii), `ParagraphHeader` (207 linii). Główny `EditorParagraphView` zredukowany z 674 do 249 linii (-63%). Wszystkie 4 stany lokalne związane z UI przeniesione do `ParagraphHeader` (aliases, confirmations). Testy (51): 100% przechodzi.

---

### ✅ `ParagraphView.tsx` — refaktoryzacja na podkomponenty

**Status:** Rozwiązane — wydzielono `ParagraphNavigation` (66 linii), `ChoicesSection` (97 linii) i `DiceResultDisplay` (36 linii) jako osobne komponenty. Główny `ParagraphView` zredukowany z 394 do 280 linii (-29%). Testy (29): 100% przechodzi.

---

### ✅ `VariantEditor.tsx` — refaktoryzacja na podkomponenty

**Status:** Rozwiązane — wydzielono `VariantHeader` (122 linie) i `VariantPreview` (47 linii) jako osobne komponenty. Główny `VariantEditor` zredukowany z 264 do 147 linii (-44%). Stan lokalny przeniesiony do podkomponentów (VariantHeader zarządza rename, collapse, confirmDelete). Testy (31): 100% przechodzi.

---

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
