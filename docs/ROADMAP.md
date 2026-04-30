# ROADMAP.md - Horror Stories

Projekt Horror Stories - Aplikacja towarzysząca grze planszowej.

**Ukończone wersje znajdują się w [CHANGELOG.md](CHANGELOG.md)**

---

---

## Milestone v0.2.2 - Edytor: treść paragrafu

### Zakres

- Edycja treści paragrafu (pole tekstowe)
- Podgląd renderowanego paragrafu (reużycie istniejącego `RichText`)
- Usuwanie paragrafu z widoku paragrafu (nie z sidebaru)

### Status

- ⏳ Nie rozpoczęte

### Notatki na przyszłość

- Paragrafy podpięte pod żetony alfabetu powinny mieć etykietę `(litera A)` itp. — do v0.2.8
- Strona **Wykrywanie problemów** (paragrafy bez połączeń, niedostępne §, brakujące nextParagraphId) — do osobnego milestone'u po v0.2.7

---

## Milestone v0.2.3 - Edytor: wybory między paragrafami

### Zakres

- Dodawanie / usuwanie wyborów (`Choice`) do paragrafu
- Wskazanie `nextParagraphId` z listy dostępnych paragrafów
- Podgląd grafu połączeń (opcjonalnie)

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.2.4 - Edytor: bloki treści i strony

### Zakres

- Edycja paragrafów opartych na `ContentBlock[]` (tekst, obrazy)
- Obsługa wielostronicowych paragrafów (`contentPages`)

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.2.5 - Edytor: picker elementów globalnych

### Zakres

- Wstawianie elementów inline: symbole, litery, przedmioty fabularne, osoby, statusy
- Picker z miniaturkami grafik z `public/assets/images/`

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.2.6 - Edytor: import wbudowanych scenariuszy

### Zakres

- Możliwość skopiowania wbudowanego scenariusza do edytora jako baza do edycji
- Wbudowane scenariusze są read-only — edytuje się kopię

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.2.7 - Edytor: rzut kostką i warianty postaci

### Zakres

- Edycja `diceResult` (próg, tekst sukcesu/porażki, docelowe paragrafy)
- Edycja `variants` (wybór postaci, rozbieżna treść)

### Status

- ⏳ Nie rozpoczęte

---

## Milestone v0.2.8 - Edytor: grafiki, tokeny alfabetu, setup

### Zakres

- Upload własnych grafik scenariuszowych (pakowane do ZIP w `images/`)
- Edycja tokenów alfabetu (`letters.json`)
- Edycja kroków setupu (`setup.json`)

### Status

- ⏳ Nie rozpoczęte

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
