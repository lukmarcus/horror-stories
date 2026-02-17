# ROADMAP.md - Horror Stories

Projekt Horror Stories - Aplikacja towarzysząca grze planszowej.

**Ukończone wersje znajdują się w [CHANGELOG.md](CHANGELOG.md)**

---

## Milestone v0.0.11 - Organizacja przedmiotów i grafik

### Zakres

- Kompletne spisanie wszystkich przedmiotów scenariusza
- Posortowanie i kategoryzowanie przedmiotów
- Dodanie grafik dla wszystkich przedmiotów
- Integracja grafik przedmiotów w paragrafach
- Podjęcie ostatecznej decyzji dotyczącej numeracji i nazewnictwa przedmiotów

### Do zrobienia

- ⏳ Spisanie wszystkich przedmiotów z paragrafów
- ⏳ Kategoryzacja przedmiotów
- ⏳ Tworzenie/pozyskanie grafik przedmiotów
- ⏳ Integracja grafik w systemie renderowania
- ⏳ Standaryzacja numeracji i nazewnictwa

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.0.12 - UI/UX Visual Improvements

### Zakres

- **Stylizacja tekstu końcowego** - Dedykowany wyświetlanie ostatnich paragrafów scenariusza
- **Refaktor ekranu direct: false** - Ulepszone UI dla ostrzeżenia dostępności (paragraf 77 itp)
- **Wariantowe zawartość** - Zaawansowana obsługa wariantów (warianty postaci w jednym paragrafie)
- **Browser history / back button** - Przycisk wstecz przeglądarki powraca do poprzedniego paragrafu
- **Powrót z paragrafów niedostępnych** - Button "Wróć" dla paragrafów bez dostępu (`direct: false`)
- **Input zamiast powrotu** - Dla paragrafów bez choices pokazać input zamiast "powrotu do gry"

### Do zrobienia

- ⏳ End-game text styling - przeprojektować wyświetlanie tekstu końcowego (paragraf 151)
- ⏳ Accessibility warning UI redesign - lepsze UI dla ekranu dostępności (direct: false)
- ⏳ Variant content with merge logic - hierarchiczna struktura wariantów postaci
- ⏳ Horizontal choices visual grouping - ramka/background dla choices poziomych
- ⏳ Choice history tracking - wyświetlenie ostatnio dokonanego wyboru
- ⏳ Browser history support - Wdrożyć URL state (`?para=X`) dla pełnej obsługi historii przeglądarki
- ⏳ Back button for inaccessible paragraphs - Button "Wróć" dla paragrafów z `direct: false`
- ⏳ Input field for dead-end paragraphs - Zastąpić "powrót do gry" inputem dla paragrafów bez choices

### Status

- ⏳ Zaplanowana

---

## Milestone v0.1.0 - MVP Release - Visual Design

### Zakres

- Kompletny design wizualny aplikacji
- Responsywny layout na wszystkich urządzeniach
- Koherentna paleta barw i typografia
- Polishing UI/UX
- Optymalizacja wydajności
- Dokumentacja dla użytkownika

### Do zrobienia

- ⏳ Design system - kolory, typografia, komponenty
- ⏳ Responsywność - mobile, tablet, desktop
- ⏳ Animacje i przejścia
- ⏳ Accessibility - WCAG compliance
- ⏳ Optymizacja wydajności
- ⏳ Testing i bug fixing

### Status

- ⏳ Nie rozpoczęte

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
- **v0.0.10+** - Bieżący development

## Legenda

- ✅ Ukończone
- 🔄 W trakcie
- ⏳ Zaplanowane/W backlogu
- ❌ Odłożone/Odrzucone

---

**Ostatnia aktualizacja:** 2026-02-16
