# ROADMAP.md - Horror Stories

Projekt Horror Stories - Aplikacja towarzysząca grze planszowej.

**Ukończone wersje znajdują się w [CHANGELOG.md](CHANGELOG.md)**

---

## Milestone v0.2.11 - Edytor: import wbudowanych scenariuszy

### Zakres

- Możliwość skopiowania wbudowanego scenariusza do edytora jako baza do edycji
- Wbudowane scenariusze są read-only — edytuje się kopię
- Wszystkie pola scenariusza obsługiwane w edytorze (możliwe po v0.2.10)

### Status

- ⏳ Nie rozpoczęte

---

## Notatki na przyszłość

- Strona **Wykrywanie problemów** (paragrafy bez połączeń, niedostępne §, brakujące nextParagraphId) — do osobnego milestone'u po v0.2.10
- **Edytor: rzut kostką** — edycja `diceResult` (próg, tekst sukcesu/porażki, docelowe paragrafy); gdy pojawi się pierwszy scenariusz korzystający z tej funkcji
- **Osobne pliki JSON per zasób scenariusza** — zamiast `paragraphs.json` jeden plik per paragraf (`paragraphs/1.json`, `paragraphs/77.json`...); poprawa git diff i DX edytora; wymaga refaktoru loadingu w `index.ts` i ZIP handlera; sensowne przy scenariuszach 200+ paragrafów

---

## Milestone v0.3.0+ - Nowe scenariusze

### Zakres

- Party time (Scenariusz 1)
- Eksperyment (Scenariusz 2)
- Kolejny dzień w pracy (Scenariusz 3)
- Śmiertelna zabawa (Scenariusz 4)
- Świnki trzy i wilk (Scenariusz 5)
- Do samego końca (Scenariusz 6)
- (Nie) jesteśmy tu sami (Scenariusz 7)
- Spotkanie (Scenariusz 8)

_Numeracja wersji i kolejność do ustalenia._

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
