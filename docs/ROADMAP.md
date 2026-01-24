# ROADMAP.md - Horror Stories

## Wersja: v0.0.0 - Current Development Branch

Projekt Horror Stories - Aplikacja towarzysząca grze planszowej.

---

## Milestone v0.0.0 - Inicjalizacja projektu

### Zakres
- Setup Vite + React 18 + TypeScript
- Konfiguracja struktury katalogów
- Podstawowe tooling (ESLint, Prettier)
- Inicjalizacja Git repozytorium

### Do przygotowania
- ❌ Brak - czysto kod

### Status
- ⏳ Nie rozpoczęte

---

## Milestone v0.0.1 - UI Komponenty

### Zakres
- Komponenty: Button, Header, Footer
- Globalne style i zmienne CSS
- Layout base (kontener, responsywność)
- WCAG compliance

### Do przygotowania
- ❌ Brak - czysto kod

### Status
- ⏳ Nie rozpoczęte

---

## Milestone v0.0.2 - Routing & Strony

### Zakres
- Setup React Router
- Strony: Home (menu), Game, Instructions, About, ScenariosList
- Nawigacja między stronami

### Do przygotowania
- ❌ Brak - czysto kod

### Status
- ⏳ Nie rozpoczęte

---

## Milestone v0.0.3 - Paragraph Parser

### Zakres
- System parsowania tagów (`[item:]`, `[figure:]`, `[board:]`, `[token:]`, itp.)
- Formatowanie tekstu (bold, italic, kolory)
- Renderowanie tekstu z formatowaniem

### Do przygotowania
- ✅ **Scenariusz testowy** - kilka paragrafów z różnymi tagami

### Status
- ⏳ Nie rozpoczęte

---

## Milestone v0.0.4 - Scenario Setup

### Zakres
- Komponent setupu scenariusza
- Kroki konfiguracji (przewijalne)
- Logika przepływu: Setup → Game

### Do przygotowania
- ✅ **Kroki setupu** - szczegółowe instrukcje dla demo scenariusza
- ✅ **Metadane scenariusza** - tytuł, opis, autor, liczba paragrafów

### Status
- ⏳ Nie rozpoczęte

---

## Milestone v0.0.5 - Dice Roller

### Zakres
- Komponent kostki k6
- Animacja rzutu
- Integracja z paragrafami

### Do przygotowania
- ✅ **Paragraf z rzutem kostką** - testowy scenariusz

### Status
- ⏳ Nie rozpoczęte

---

## Milestone v0.0.6 - Warunkowe opcje

### Zakres
- System conditional choices (zależne od posiadanych przedmiotów)
- State management dla ekwipunku/stanu gry
- Logika wyświetlania opcji warunkowych

### Do przygotowania
- ✅ **Baza przedmiotów/figurek** - definicja dostępnych elementów
- ✅ **Scenariusz testowy z warunkami** - paragrafy zależne od stanu

### Status
- ⏳ Nie rozpoczęte

---

## Milestone v0.0.7 - Walidacja & Error Handling

### Zakres
- Walidacja paragrafów (numery, linki, pola obowiązkowe)
- Error boundaries (React)
- Komunikaty błędów dla użytkownika
- Graceful degradation dla brakujących assetów

### Do przygotowania
- ✅ **Testy scenariuszy** - sprawdzenie wszystkich paragrafów

### Status
- ⏳ Nie rozpoczęte

---

## Milestone v0.1.0 - MVP Release

### Zakres
- Kompletny scenariusz (przynajmniej jeden pełny)
- Wszystkie assety (ikony, tła, grafiki)
- Baza wszystkich elementów z gry
- Optimizacja wydajności
- Dokumentacja dla użytkownika

### Do przygotowania
- ✅ **Kompletny scenariusz** - pełny scenariusz z wszystkimi funkcjami
- ✅ **Wszystkie assety** - ikony, tła, grafiki z gry
- ✅ **Baza elementów** - pełna lista obiektów (przedmioty, żetony, figurki)

### Status
- ⏳ Nie rozpoczęte

---

## Przyszłe rozszerzenia (post-v0.1.0)

### v0.2.0 - Audio & Music
- Audio player
- Muzyka w tle
- Dźwięki i dialogi

### v0.3.0+ - Editor & Advanced Features
- Edytor scenariuszy (osobna aplikacja)
- Wczytywanie własnych JSON scenariuszy
- Save/load postępu gry
- Multilingual support

---

## Branch strategy

- **main** - Stable releases (v0.1.0+)
- **v0.0.0** - Development (current)
- Feature branches: `feature/xxx` → `v0.0.0`

---

**Ostatnia aktualizacja:** 2026-01-23
