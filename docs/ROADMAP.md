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
- ✅ Paragraf 9 (pytanie: która postać)
- ✅ Paragraf 9-jessica (Jessica przejmuje, pytanie czy Patrick leży)
- ✅ Paragraf 9-patrick-lezy (opcje: ocucić lub opuść)
- ✅ Paragraf 9-patrick-stoi (opcje: porozmawiać, wymiana, opuść)
- ✅ Paragraf 9-patrick (Patrick przejmuje, głowa boleje)
- ✅ Paragraf 12 (drewniane drzwi, 3 opcje - interakcja/siła/opuść)
- ✅ Paragraf 14 (obraz "Czyściec", dead-end)
- ✅ Paragraf 15 (rzeźba nie drgnęła - kara, wejście z 111)
- ✅ Paragraf 26 (hub) z wyborem postaci (Jessica/Patrick)
- ✅ Paragraf 26-jessica (akcja informacyjna)
- ✅ Paragraf 26-patrick (3 wybory)
- ✅ Paragraf 29 (wyłożenie planszy 3, odkrycie dziury)
- ✅ Paragraf 30 (wprowadzenie klauna - 4-częściowy tutorial mechanik antagonisty)
- ✅ Paragraf 34 (warunkie: symbol LIII, otmowanie przedmiotów, dead-end)
- ✅ Paragraf 35 (setup planszy 16, wyjaśnienie mechaniki losowych przedmiotów)
- ✅ Paragraf 36 (rzeźba odsłania przejście, zastępcze drzwi otwarte)
- ✅ Paragraf 37 (mechanika interakcji z przedmiotami)
- ✅ Paragraf 38 (obraz czterech osób w ogniu, note o przeglądaniu paragrafów)
- ✅ Paragraf 39 (warunkowe otwarcie drzwi na podstawie gwiazdek)
- ✅ Paragraf 40 (Patrick się budzi, przygotowanie planszy)
- ✅ Paragraf 48 (zielony klucz - dead-end)
- ✅ Paragraf 49 (setup planszy 13, wyjaśnienie mechaniki losowych przedmiotów)
- ✅ Paragraf 50 (martwych drzwi, dead-end)
- ✅ Paragraf 52 (rzeźba się nie porusza - kara, wejście z 111)
- ✅ Paragraf 53 (mechanika przeszukiwania)
- ✅ Paragraf 54 (wkładasz głowę w dziurę, dead-end)
- ✅ Paragraf 55 (Patrick o barku, dead-end)
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
- ✅ Grafiki gry (jessica.jpg, patrick.jpg, klaun.jpg, symbole, litery, grafiki scenariusza)
- ✅ Grafiki paragrafów: klaun-planszetka.jpg, klaun-akcje.jpg, rip.jpg, karty-negatywne.jpg
- ✅ Symbole antagonisty: przeciwnik.png, zycie.png

### Do zrobienia

### Do zrobienia

- ⏳ Wszystkie paragrafy scenariusza (ostatecznie ~160-180 paragrafów)
- ⏳ Pełne gałęzie narracyjne dla obu postaci
- ⏳ Wszystkie warunki i warianty ścieżek
- ⏳ Testowanie gry

### Status

- 🔄 W trakcie (38/~180 paragrafów) - hub postaci, główna ścieżka, mechaniki antagonisty

---

## Milestone v0.0.9 - Organizacja przedmiotów i grafik

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
- **v0.0.8** - Aktualna rozbudowa

---

**Ostatnia aktualizacja:** 2026-02-04
