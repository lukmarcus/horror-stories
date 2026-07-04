# ROADMAP.md - Horror Stories

Projekt Horror Stories - Aplikacja towarzysząca grze planszowej.

**Ukończone wersje znajdują się w [CHANGELOG.md](CHANGELOG.md)**

---

## Notatki na przyszłość

- Strona **Wykrywanie problemów** (paragrafy bez połączeń, niedostępne §, brakujące nextParagraphId) — do osobnego milestone'u po v0.2.10
- **Edytor: rzut kostką** — edycja `diceResult` (próg, tekst sukcesu/porażki, docelowe paragrafy); gdy pojawi się pierwszy scenariusz korzystający z tej funkcji
- **Edytor: cover image support** — możliwość dodania grafiki tła dla scenariusza (cover.jpg) widocznej na liście scenariuszy; obecnie tylko wbudowane scenariusze mają cover, user scenarios nie mają tej opcji
- **Edytor: inteligentne dodawanie postaci** — postacie mają `paragraphId` (jak litery), więc przy wyborze postaci do scenariusza automatycznie dodawać paragrafy do spisu z imieniem w nawiasie (np. "§16 (Josh)"); wymaga zmiany UI z checkboxów na dropdowny (wybór konkretnej postaci do konkretnego paragrafu)
- **Osobne pliki JSON per zasób scenariusza** — zamiast `paragraphs.json` jeden plik per paragraf (`paragraphs/1.json`, `paragraphs/77.json`...); poprawa git diff i DX edytora; wymaga refaktoru loadingu w `index.ts` i ZIP handlera; sensowne przy scenariuszach 200+ paragrafów

---

## Milestone v0.3.1 - Party Time Scenario + Editor Improvements

### Zakres v0.3.1

**Główny cel: Import scenariusza "Party time" + ulepszenia edytora**

**Scenariusz Party time:**

- Import paragraphs.json, setup.json, letters.json
- Dodanie do `scenarios/index.ts`
- Testowanie mechanik i gameplay
- Bugfixy

**Edytor - nowe funkcje:**

- Cover image support dla user scenarios
- Inteligentne dodawanie postaci z auto-paragrafami

**📋 Pełny przewodnik:** [ADDING_SCENARIO.md](ADDING_SCENARIO.md)

### Status

- ⏳ Planowane (po v0.3.0)

---

## Milestone v0.4.0 - Eksperyment (Scenariusz 2)

### Zakres

**Scenariusz "Eksperyment"** — według procesu opisanego w [ADDING_SCENARIO.md](ADDING_SCENARIO.md)

### Status

- ⏳ Planowane (po v0.3.1)

---

## Milestone v0.5.0+ - Kolejne scenariusze

**Kolejność (wstępna):**

- v0.5.0: Kolejny dzień w pracy (Scenariusz 3)
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
