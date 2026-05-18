# ROADMAP.md - Horror Stories

Projekt Horror Stories - Aplikacja towarzysząca grze planszowej.

**Ukończone wersje znajdują się w [CHANGELOG.md](CHANGELOG.md)**

---

## Milestone v0.2.6 - Edytor: warianty paragrafu

### Zakres

- Edycja `variants` — zagnieżdżone pod-paragrafy z własnymi stronami i wyborami
- Obsługa `nextVariantId` w wyborach (np. wybór postaci prowadzi do wariantu treści)
- Obsługa `areChoicesHorizontal` (poziomy układ przycisków wyborów)
- Picker grafik inline w polu tekstowym wyborów (choices używają tych samych tagów co treść)
- Wstawianie numeru paragrafu ze stylowaniem kolorem (`<span class='color-green'>105</span>`) — przycisk „§" w toolbarze, kolor wybieralny; konwencja: zielony = nawigacja, czerwony = ostrzeżenie, niebieski = nagroda, fioletowy = kierunek
- Auto-tworzenie paragrafu: gdy dodajesz choice z `nextParagraphId` który nie istnieje → nowy pusty paragraf pojawia się od razu na liście

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.2.7 - Edytor: zaawansowane paragrafy

### Zakres

- Paragrafy z wieloma ID (jeden paragraf dostępny pod kilkoma numerami)
- Upload własnych grafik scenariuszowych (pakowane do ZIP w `images/`)

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.2.8 - Edytor: setup i tokeny alfabetu

### Zakres

- Edycja kroków setupu (`setup.json`)
- Edycja tokenów alfabetu (`letters.json`)

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.2.9 - Edytor: import wbudowanych scenariuszy

### Zakres

- Możliwość skopiowania wbudowanego scenariusza do edytora jako baza do edycji
- Wbudowane scenariusze są read-only — edytuje się kopię
- Po v0.2.8 wszystkie elementy droga-donikad są edytowalne

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.2.10 - Edytor: rzut kostką

### Zakres

- Edycja `diceResult` (próg, tekst sukcesu/porażki, docelowe paragrafy)
- Implementowana gdy pojawi się pierwszy scenariusz korzystający z tej funkcji

### Status

- ⏳ Nie rozpoczęte

---

## Notatki na przyszłość

- Paragrafy podpięte pod żetony alfabetu powinny mieć etykietę `(litera A)` itp. — do v0.2.8
- Strona **Wykrywanie problemów** (paragrafy bez połączeń, niedostępne §, brakujące nextParagraphId) — do osobnego milestone'u po v0.2.9

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
