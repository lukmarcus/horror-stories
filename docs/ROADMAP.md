# ROADMAP.md - Horror Stories

Projekt Horror Stories - Aplikacja towarzysząca grze planszowej.

**Ukończone wersje znajdują się w [CHANGELOG.md](CHANGELOG.md)**

---

## Milestone v0.1.0 - Bug Fixes & Deployment

### Zakres

- Naprawienie bugów z v0.0.12
- Kompatybilność z GitHub Pages (HashRouter)
- Wsparcie URL-ów z query parametrami

### Do zrobienia

- ✅ Napraw 404 błędy na GitHub Pages - HashRouter zamiast BrowserRouter
- ✅ Bug: Input pole na wielostronowych paragrafach - Reset currentPage przy zmianie paragrafu
- ✅ Zmiana nazw przycisków nawigacji - "Graj"→"Scenariusze", "Wróć do gry"→"Wróć do menu scenariusza", "Powrót do Menu"→"Lista scenariuszy"
- ✅ **UI Setup scenariusza:**
  - ✅ Dodatkowe przełączniki kroków na dole (Poprzedni/Następny + licznik kroku)
- ✅ **UI Input field:**
  - ✅ Dodać 3. button - Rzut kością (fullscreen z opcjami 1x/2x/3x, animacje, rozbicie wyników)
- ⏳ **UI Scenariuszy:**
  - ⏳ Zmniejszyć kafelki scenariuszy (responsywny grid)
  - ⏳ Dodać grafikę na tło kafelków (background-image)
- ✅ **UI Headers (nagłówki sekcji):**
  - ✅ Dodać "Paragraf #XX" nagłówek do wyświetlania paragrafów
  - ✅ Dodać "Przygotowanie scenariusza" nagłówek do sekcji setup
  - ✅ Ujednolicić styling między nagłówkami setup i paragrafów
- ✅ **Refactor: CSS i komponenty:**
  - ✅ Stworzony SectionHeader komponent dla deduplicacji
  - ✅ Zmienione nazwy klas CSS na bardziej generyczne (section zamiast setup)
  - ✅ Usunięte nieużywane CSS klasy (~700 bajtów)
  - ✅ Wydzielony DiceView komponent z Game.tsx (~70 linii)
- ⏳ **Refactor: Kolejne komponenty do wydzielenia:**
  - ⏳ SetupStepContainer - dla kroku setup'u
  - ⏳ AccessibilityWarning - dla ostrzeżenia dostępności
  - ⏳ ParagraphModeNav - dla nawigacji paragrafu
- ⏳ **UI Setup scenariusza:**
  - ⏳ Zmienić wygląd button "Przygotuj scenariusz"
- ⏳ Design system - kolory, typografia, komponenty
- ⏳ Responsywność - mobile, tablet, desktop

### Status

- 🟡 W trakcie (Bug fixes ✅, UI improvements pending)

---

## Milestone v0.1.1+ - Pozostałe scenariusze

### Zakres

- Pełne implementacje dla pozostałych 3 scenariuszy:
  - Tajemna Biblioteka
  - Opuszczony Szpital
  - Nocny Koszmar

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.2.0 - Dźwięk i muzyka

### Zakres

- Odtwarzacz audio
- Muzyka w tle dla scenariuszy
- Dźwięki i dialogi

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.3.0+ - Zaawansowane funkcje

### Zakres

- Edytor scenariuszy
- Wczytywanie własnych scenariuszy JSON
- Zapis/odczyt postępu gry
- Wsparcie dla wielu języków

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v1.0.0 - Wydanie produkcyjne

### Zakres

- Wszystkie 4 scenariusze w pełni działające
- System audio i muzyki
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
