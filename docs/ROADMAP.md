# ROADMAP.md - Horror Stories

Projekt Horror Stories - Aplikacja towarzysząca grze planszowej.

**Ukończone wersje znajdują się w [CHANGELOG.md](CHANGELOG.md)**

---

## Milestone v0.0.9 - Code Quality & Schema Optimization

### Zakres

Refaktoryzacja struktury danych scenariuszy w celu uproszczenia i optymalizacji schematu JSON:

- **Domyślne pogrubienie dla kolorów** - Usunąć zwielokrotnianie `<strong>` wokół kolorowych tekstów, zastosować CSS global
- **accessibleFrom implikuje isDirect** - Pole isDirect staje się redundantne, usunąć je dla paragrafów które mają accessibleFrom
- **Uproszczenie struktury obrazów** - Zmiana z `{type: "image", id: "..."}` na `"image": "id"`
- **Uproszczenie struktury tekstu** - Zmiana z `{type: "text", html: "..."}` na `"text": "..."`
- **Wsparcie dla wielokrotnych ID** - Umożliwić tablicę ID-ów dla paragrafów o identycznej treści ale dostępnych z różnych źródeł (np. paragrafy "Rzeźba wydaje się ani drgnąć")
- **Wariantowe zawartość w jednym paragrafie** - Zamiast tworzyć oddzielne paragrafy dla różnych gałęzi (np. 26-jessica, 26-patrick), umożliwić warianty treści w ramach jednego ID z logiem renderowania zawartości na bazie wyborów
- **Opcjonalne odstępy między paragrafami** - Pomyśleć nad schematem pozwalającym na kontrolowanie spacingu/paddingu między zawartością paragrafów w UI
- **Stylizacja tekstu końcowego** - Znaleźć lepsze rozwiązanie na wyświetlanie fragmentów tekstu jak w paragrafie 151 (zwielokrotnianie HTML tagów dla stylizacji)
- **Refaktor ekranu direct: false** - Przeprojektować wizualnie ekran ostrzeżenia dostępności dla paragrafów z accessibleFrom (wymaga zmian UI/UX)

### Do zrobienia

- ⏳ Implementacja zmian w parserze paragrafów
- ⏳ Aktualizacja komponenty renderujących (ParagraphText, ParagraphDisplay)
- ⏳ Refaktoryzacja wszystkich 180+ paragrafów z nową strukturą
- ⏳ Testy jednostkowe dla parsera
- ⏳ Walidacja zmian na całym scenariuszu

### Status

- ⏳ Nie rozpoczęte (zaplanowano po ukończeniu v0.0.8)

---

## Milestone v0.0.10 - Organizacja przedmiotów i grafik

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
- Zapis/wczyt postępu gry
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
- **v0.0.9** - Aktualna rozbudowa

---

**Ostatnia aktualizacja:** 2026-02-04
