# ROADMAP.md - Horror Stories

Projekt Horror Stories - Aplikacja towarzysząca grze planszowej.

**Ukończone wersje znajdują się w [CHANGELOG.md](CHANGELOG.md)**

---

## Milestone v0.1.1 - Fundament (testy + zero-risk cleanup)

### Zakres

Naprawa testów jako pierwsza — zanim ruszy jakakolwiek struktura, muszą istnieć testy które faktycznie importują i weryfikują prawdziwy kod. Następnie szybkie usunięcie dead code i dezinformujących typów.

### Do zrobienia

- Naprawa testów — zastąpienie inline re-implementacji prawdziwymi importami z `src/`
- Usunięcie zduplikowanego `GameState` z `types/index.ts`
- Usunięcie martwego `scenarioLoader.ts` i błędnych walidacji
- Rename `getAccumulatedParagraph` → `getDisplayParagraph`
- Usunięcie dead `validateInput` z `useGameActions`

### Kryteria akceptacji — pokrycie testami

Baseline: **4.42%** (stan przed v0.1.1)

| Warstwa                                                       | Cel               |
| ------------------------------------------------------------- | ----------------- |
| `gameLogic.ts`, `paragraphParser.ts`, `createParagraphMap`    | ≥ 90%             |
| `useGame` reducer, `useGameActions`                           | ≥ 80%             |
| `RichText`, `ParagraphView`, `InputView`, `ConditionalChoice` | ≥ 60%             |
| `data/items/index.ts`                                         | ≥ 70%             |
| Strony statyczne (`About`, `Home`, `Instructions`)            | ~0% (brak logiki) |
| **Ogólny cel**                                                | **≥ 60%**         |

### Status

- ✅ Ukończone — pokrycie 4.42% → 62.14% (298 testów, 22 pliki)

---

## Milestone v0.1.2 - Strukturalne refaktory

### Zakres

Strukturalne zmiany możliwe dzięki safety netowi z v0.1.1. Ujednolicenie typów, ekstrakcja konfiguracji, usunięcie duplikacji.

### Do zrobienia

- Ekstrakcja hardcoded `"77"` (paragraf startowy) do konfiguracji scenariusza
- Centralizacja `ContentBlock` / `SetupStep` (trzy osobne definicje tej samej struktury)
- Konwersja `useGameActions` na zwykły moduł (brak logiki hookowej)
- Usunięcie duplikacji paginacji w `ParagraphView`
- Ujednolicenie `<Button>` vs raw `<button className="...">` w `ParagraphView`

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.1.3 - Architektura

### Zakres

Najbardziej ryzykowne zmiany, wymagające starannego testowania.

### Do zrobienia

- Naprawa ścieżek obrazów w `RichText.tsx` (dwa conflicting URL patterns)
- Przeniesienie logiki `handleRollDice` z `Game.tsx` do hooka / `useDiceRoll`

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.2.0 - Party time (Scenariusz 1)

### Zakres

- Pełna implementacja scenariusza "Party time"

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.3.0 - Eksperyment (Scenariusz 2)

### Zakres

- Pełna implementacja scenariusza "Eksperyment"

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.4.0 - Kolejny dzień w pracy (Scenariusz 3)

### Zakres

- Pełna implementacja scenariusza "Kolejny dzień w pracy"

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.5.0 - Śmiertelna zabawa (Scenariusz 4)

### Zakres

- Pełna implementacja scenariusza "Śmiertelna zabawa"

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.6.0 - Świnki trzy i wilk (Scenariusz 5)

### Zakres

- Pełna implementacja scenariusza "Świnki trzy i wilk"

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.7.0 - Do samego końca (Scenariusz 6)

### Zakres

- Pełna implementacja scenariusza "Do samego końca"

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.8.0 - (Nie) jesteśmy tu sami (Scenariusz 7)

### Zakres

- Pełna implementacja scenariusza "(Nie) jesteśmy tu sami"

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.9.0 - Spotkanie (Scenariusz 8)

### Zakres

- Pełna implementacja scenariusza "Spotkanie"

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.10.0 - Finał (Scenariusz 9)

### Zakres

- Pełna implementacja scenariusza "Finał"

### Status

- ⏳ Nie rozpoczęte

---

## Dodatkowe Features (do uwzględnienia w kolejnych wersjach)

### Audio System

- Odtwarzacz audio
- Muzyka w tle dla scenariuszy
- Dźwięki i dialogi

### Design System

- Spójny system kolorów, typografii i komponentów
- Pełna responsywność (mobile, tablet, desktop)

### System Zapisu

- Zapis/odczyt postępu gry
- Przechowywanie stanu postaci

### Lokalizacja

- Wsparcie dla wielu języków

---

## Milestone v1.0.0 - Wydanie produkcyjne

### Zakres

- Wszystkie 10 scenariuszy w pełni działające (Droga Donikąd + 9 kolejnych)
- System audio
- Design system w pełni wdrożony
- Pełna dokumentacja
- Optymizacja wydajności
- Stabilna aplikacja gotowa do produkcji

### Status

- ⏳ Nie rozpoczęte

---

## Strategia gałęzi

- **main** - Stabilne wydania (v0.1.0+)
- **v0.0.11+** - Bieżący development

## Legenda

- ✅ Ukończone
- 🔄 W trakcie
- ⏳ Zaplanowane/W backlogu
- ❌ Odłożone/Odrzucone

---

**Ostatnia aktualizacja:** 2026-03-04
