# ROADMAP.md - Horror Stories

Projekt Horror Stories - Aplikacja towarzysząca grze planszowej.

**Ukończone wersje znajdują się w [CHANGELOG.md](CHANGELOG.md)**

---

## Milestone v0.0.10 - Code Quality & Codebase Cleanup

### Zakres

Sprzątanie bazy kodowej i przygotowanie do refactoringu schematu, podzielone na dwie fazy:

#### Faza 1: Porządki w Kodzie (Quick Wins)

- **Usunąć placeholder componenty** - `src/components/Paragraph/index.tsx` i `src/components/AudioPlayer/index.tsx` (nigdy nieuużywane)
- **Standaryzować exporty** - Zmienić `export default` w `Instructions.tsx` i `About.tsx` na `export const` (konsystencja z innymi stronami)
- **Barrel exports dla modułów** - Dodać `src/hooks/index.ts` i `src/utils/index.ts` (ograniczyć deep imports)
- **Zaktualizować About.tsx** - Dynamicznie wczytywać wersję z `package.json` zamiast hardkodowanego v0.0.1
- **Dokumentacja CODE_QUALITY** - Stwierdzić `docs/CODE_QUALITY.md` z wytycznymi dla maintainability

#### Faza 2: Refactoring Schematu JSON (Schema Optimization)

- **Domyślne pogrubienie dla kolorów** - Usunąć zwielokrotnianie `<strong>` wokół kolorowych tekstów, zastosować CSS global
- **accessibleFrom implikuje isDirect** - Pole isDirect staje się redundantne, usunąć je dla paragrafów które mają accessibleFrom
- **Uproszczenie struktury obrazów** - Zmiana z `{type: "image", id: "..."}` na `"image": "id"`
- **Uproszczenie struktury tekstu** - Zmiana z `{type: "text", html: "..."}` na `"text": "..."`
- **Wsparcie dla wielokrotnych ID** - Umożliwić tablicę ID-ów dla paragrafów o identycznej treści ale dostępnych z różnych źródeł
- **Wariantowe zawartość w jednym paragrafie** - Zamiast oddzielne paragrafy (26-jessica, 26-patrick), umożliwić warianty w jednym ID
- **Opcjonalne odstępy między paragrafami** - Schemat kontrolowania spacingu/paddingu między zawartością paragrafów w UI
- **Stylizacja tekstu końcowego** - Lepsze rozwiązanie na wyświetlanie fragmentów tekstu (paragraf 151)
- **Refaktor ekranu direct: false** - Przeprojektować wizualnie ekran ostrzeżenia dostępności dla paragrafów z accessibleFrom

### Do zrobienia

#### Faza 1

- ✅ Usunąć placeholder componenty (`Paragraph`, `AudioPlayer`)
- ✅ Standaryzować exporty strony (Instructions, About → export const)
- ✅ Dodać barrel exports: `src/hooks/index.ts`, `src/utils/index.ts`
- ✅ Zaktualizować import w `src/components/common/index.ts` (Button)
- ✅ Zmienić About.tsx: hardkod v0.0.1 → dynamicznie z package.json
- ✅ Stworzyć `docs/CODE_QUALITY.md` z wytycznymi

#### Faza 2

- ⏳ Analiza struktury paragrafów i ustalenie nowego schematu
- ⏳ Implementacja zmian w parserze paragrafów
- ⏳ Aktualizacja komponentów renderujących (ParagraphText, ParagraphDisplay)
- ⏳ Refaktoryzacja paragrafów JSON z nową strukturą
- ⏳ Testy jednostkowe dla parsera
- ⏳ Walidacja zmian na całym scenariuszu

### Status

- 🔄 W trakcie (Faza 1 ✅ ukończona, Faza 2 w przygotowaniu)

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
