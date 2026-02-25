# ROADMAP.md - Horror Stories

Projekt Horror Stories - Aplikacja towarzysząca grze planszowej.

**Ukończone wersje znajdują się w [CHANGELOG.md](CHANGELOG.md)**

---

## Milestone v0.0.12 - UI/UX Visual Improvements

### Zakres

- **Powiększenie tekstu opcji wyboru** - Większa czcionka dla lepszej czytelności wyboru
- **Stylizacja tekstu końcowego** - Dedykowany wyświetlanie ostatnich paragrafów scenariusza
- **Refaktor ekranu direct: false** - Ulepszone UI dla ostrzeżenia dostępności (paragraf 77 itp)
- **Wariantowe zawartość** - Zaawansowana obsługa wariantów (warianty postaci w jednym paragrafie)
- **Browser history / back button** - Przycisk wstecz przeglądarki powraca do poprzedniego paragrafu
- **Powrót z paragrafów niedostępnych** - Button "Wróć" dla paragrafów bez dostępu (`direct: false`)
- **Input zamiast powrotu** - Dla paragrafów bez choices pokazać input zamiast "powrotu do gry"

### Do zrobienia

- ✅ Larger choice text - powiększyć czcionkę w przyciskach wyboru dla lepszej czytelności
- ✅ Accessibility warning UI redesign - lepsze UI dla ekranu dostępności (direct: false)
- ✅ Screen title unification - tytuł scenariusza widoczny na wszystkich ekranach
- ✅ End-game text styling - tekst końcowy (paragraf 151) podzielony na 2 strony
- ✅ Auto-detect multipage paragraphs - paragrafy z wieloma stronami włączają stronicowanie automatycznie
- ✅ Browser history support - URL state (`?par=X`) dla pełnej obsługi historii przeglądarki
- ⏳ Variant content with merge logic - hierarchiczna struktura wariantów postaci

### Status

- 🔄 W trakcie

---

## Milestone v0.1.0 - MVP Release - Visual Design & Features

### Zakres

- **Przycisk rzucania kostką na ekranie input** - Możliwość rzucenia kostką w każdym momencie setupu scenariusza
- Kompletny design wizualny aplikacji
- Responsywny layout na wszystkich urządzeniach
- Koherentna paleta barw i typografia
- Polishing UI/UX
- Optymalizacja wydajności
- Dokumentacja dla użytkownika

### Do zrobienia

- ⏳ Dice roller button on input screen - nowy przycisk do rzucania kostką k6 na stronie inputu scenariusza
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
- Zapis/odczyt postępu gry
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
- **v0.0.11+** - Bieżący development

## Legenda

- ✅ Ukończone
- 🔄 W trakcie
- ⏳ Zaplanowane/W backlogu
- ❌ Odłożone/Odrzucone

---

**Ostatnia aktualizacja:** 2026-02-21
