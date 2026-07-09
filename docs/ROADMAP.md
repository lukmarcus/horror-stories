# ROADMAP.md - Horror Stories

Projekt Horror Stories - Aplikacja towarzysząca grze planszowej.

**Ukończone wersje znajdują się w [CHANGELOG.md](CHANGELOG.md)**

---

## Notatki na przyszłość

- Strona **Wykrywanie problemów** (paragrafy bez połączeń, niedostępne §, brakujące nextParagraphId) — do osobnego milestone'u po v0.2.10
- **Edytor: rzut kostką** — edycja `diceResult` (próg, tekst sukcesu/porażki, docelowe paragrafy); gdy pojawi się pierwszy scenariusz korzystający z tej funkcji
- **Osobne pliki JSON per zasób scenariusza** — zamiast `paragraphs.json` jeden plik per paragraf (`paragraphs/1.json`, `paragraphs/77.json`...); poprawa git diff i DX edytora; wymaga refaktoru loadingu w `index.ts` i ZIP handlera; sensowne przy scenariuszach 200+ paragrafów

---

## Milestone v0.3.1 - PersonsEditor + Editor Improvements

### Zakres v0.3.1

**Główny cel: Naprawa PersonsEditor i poprawki edytora**

**Edytor - ukończone:**

1. ✅ **PersonsEditor (nowy komponent)**
   - Automatyczne wczytywanie wszystkich postaci z `persons.json`
   - Dropdown UI: wybór postaci z automatycznym przypisaniem `paragraphId`
   - W bocznym panelu tag "(PersonName)" dla paragrafów postaci
   - Dodanie do sidebar jako sekcja "Postacie"
   - Uproszczony model: `paragraphId` stały (z `persons.json`), nie edytowalny

2. ✅ **Metadata refactoring**
   - Ujednolicone nazewnictwo: `characters` → `persons`, `enemyIds` → `enemies`
   - Automatyczna konwersja przy imporcie wbudowanych scenariuszy

3. ✅ **UI fixes**
   - Wspólny `ItemEditor.css` dla PersonsEditor i LettersEditor
   - Poprawione renderowanie obrazków w wyborach (custom tags)
   - Poprawiony format tagów w sidebarze

4. ✅ **Scenario optimization**
   - Połączono duplikaty wariantów w §100 (droga-donikad)

**Cover image support:**

- ⏳ Przełożone na przyszłe wersje

### Status

- ✅ **Ukończone** - 2026-07-07 (PersonsEditor + poprawki edytora)
- ✅ Ukrycie przycisku przeciwnika gdy brak enemies

---

## Milestone v0.3.2 - Eksperyment (Scenariusz 2)

### Zakres

**Scenariusz "Eksperyment":**

- Import paragraphs.json, setup.json, letters.json, images
- Dodanie do `scenarios/index.json`
- Testowanie mechanik i gameplay
- Bugfixy

**📋 Pełny przewodnik:** [ADDING_SCENARIO.md](ADDING_SCENARIO.md)

### Status

- ⏳ Planowane (po v0.3.1)

---

## Milestone v0.4.0 - Kolejny dzień w pracy (Scenariusz 3)

### Zakres

**Scenariusz "Kolejny dzień w pracy"** — według procesu opisanego w [ADDING_SCENARIO.md](ADDING_SCENARIO.md)

### Status

- ⏳ Planowane (po v0.3.2)

---

## Milestone v0.5.0+ - Kolejne scenariusze

**Kolejność (wstępna):**

- v0.5.0: Party time
- v0.6.0: Śmiertelna zabawa (Scenariusz 4)
- v0.7.0: Świnki trzy i wilk (Scenariusz 5)
- v0.8.0: Do samego końca (Scenariusz 6)
- v0.9.0: (Nie) jesteśmy tu sami (Scenariusz 7)
- v0.10.0: Spotkanie (Scenariusz 8)
- v1.0.0: Production Ready + polish

**Features do rozważenia między wersjami:**

- Audio system (v0.8.x lub v0.9.x)
- Save system (v0.9.x lub before v1.0.0)

### Status

- ⏳ Planowane

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
