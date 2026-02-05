# ROADMAP.md - Horror Stories

Projekt Horror Stories - Aplikacja towarzysząca grze planszowej.

**Ukończone wersje znajdują się w [CHANGELOG.md](CHANGELOG.md)**

---

## Milestone v0.0.8 - Kompletny scenariusz

### Zakres

- Tworzenie jednego kompletnego, porządnego scenariusza
- Pełne kroki przygotowania z grafiką
- Wszystkie paragrafy scenariusza
- Testowanie kompletnego przepływu gry
- Wsparcie dla tagów osób (person tag) z grafikami
- Bogata zawartość HTML w wyborach (choices)
- Flagi kontrolujące layout (isMultiPage, areChoicesHorizontal)

### Wykonane

- ✅ System tagów osób (`<person id='jessica'/>`) - ładowanie JPG z assets/persons/
- ✅ Parser RichText ze wsparciem dla: symbol, token, letter, item, person, image
- ✅ Renderowanie wyborów z polem `html` dla bogatej zawartości
- ✅ Flaga `isMultiPage` - kontrola wyświetlania numeracji stron
- ✅ Flaga `areChoicesHorizontal` - kontrola layoutu przycisków
- ✅ Paragraf 1 (wejście z 37, link do 105)
- ✅ Paragraf 2 (isDirect: false, dostępny tylko z 26-patrick)
- ✅ Paragraf 3 (rzeźba nie drgnęła - kara, wejście z 111)
- ✅ Paragraf 14 (obraz "Czyściec", dead-end)
- ✅ Paragraf 15 (rzeźba nie drgnęła - kara, wejście z 111)
- ✅ Paragraf 26 (hub) z wyborem postaci (Jessica/Patrick)
- ✅ Paragraf 26-jessica (akcja informacyjna)
- ✅ Paragraf 26-patrick (3 wybory)
- ✅ Paragraf 29 (wyłożenie planszy 3, odkrycie dziury)
- ✅ Paragraf 37 (mechanika interakcji z przedmiotami)
- ✅ Paragraf 40 (Patrick się budzi, przygotowanie planszy)
- ✅ Paragraf 50 (martwych drzwi, dead-end)
- ✅ Paragraf 53 (mechanika przeszukiwania)
- ✅ Paragraf 61 (podnoszenie przedmiotów - ręka)
- ✅ Paragraf 65 (pytanie warunkowe: czy Patrick leży?)
- ✅ Paragraf 65-61 (wariantowa ścieżka - usuwanie itemów)
- ✅ Paragraf 70 (odkrywanie biurka, wyłożenie planszy)
- ✅ Paragraf 77 (odkrywanie nowej planszy, spotkanie NPC)
- ✅ Paragraf 105 (odkrycie Patrick leżącego, setup gry)
- ✅ Paragraf 121 (spotkanie z nieznajomym NPC)
- ✅ Paragraf 123 (interakcja ze rzeźbą, warunki)
- ✅ System isDirect: false z accessibleFrom - ograniczone dostępy do paragrafów
- ✅ Ekran ostrzeżenia dostępności (pełny widok dla isDirect: false)
- ✅ Oddzielna struktura danych dla scenariuszy (paragrafy organizowane po scenarioId)
- ✅ Grafiki gry (jessica.jpg, patrick.jpg, symbole, litery, grafiki scenariusza)

### Do zrobienia

### Do zrobienia

- ⏳ Wszystkie paragrafy scenariusza (ostatecznie ~160-180 paragrafów)
- ⏳ Pełne gałęzie narracyjne dla obu postaci
- ⏳ Wszystkie warunki i warianty ścieżek
- ⏳ Testowanie gry

### Status

- 🔄 W trakcie (21/~180 paragrafów) - główna ścieżka i podstawowe mechaniki

---

## Milestone v0.0.9 - System śledzenia przedmiotów

### Zakres

- System śledzenia przedmiotów z paragrafów (item pickups)
- Panel wyświetlający zebrane przedmioty
- Licznik przedmiotów w grze

### Do zrobienia

- ⏳ System śledzenia przedmiotów
- ⏳ Komponent panelu przedmiotów
- ⏳ Testy logiki przedmiotów

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.1.0 - MVP Release

### Zakres

- Kompletny scenariusz (Droga Donikąd)
- System śledzenia przedmiotów
- Wszystkie assety graficzne
- Baza wszystkich elementów z gry
- Optymizacja wydajności
- Dokumentacja dla użytkownika

### Do zrobienia

- ✅ **Kompletny scenariusz** - z v0.0.8
- ✅ **System śledzenia przedmiotów** - z v0.0.9
- ✅ **Wszystkie assety** - ikony, tła, grafiki
- ✅ **Baza elementów** - pełna lista obiektów

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
- **v0.0.8** - Aktualna rozbudowa

---

**Ostatnia aktualizacja:** 2026-02-04
