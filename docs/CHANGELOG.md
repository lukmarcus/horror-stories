# Changelog

Wszystkie istotne zmiany w projekcie Horror Stories będą dokumentowane w tym pliku.

Format ten opiera się na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
a projekt przestrzega [Semantic Versioning](https://semver.org/lang/pl/).

---

## [0.0.12] - Zaplanowana

### Dodano

- Back buttons z `accessibleFrom` - przyciski "Wróć do #X" w nagłówku gry dla paragrafów dostępnych z innych paragrafów
- Wariantowe zawartość z resetem - hierarchiczna struktura wariantów postaci, każdy wariant resetuje ekran do czystej zawartości wariantu (bez głównego tekstu)
- Separacja wyborów wariantowych - wariantowe wybory (z `nextVariantId`) wyświetlają się wewnątrz ramy paragrafu, zwykłe wybory poniżej
- Przycisk "Odśwież" - reset wariantów w nagłówku gry z wyświetlaniem ID paragrafu (np. "↻ Odśwież #9-test")
- Testy wariantów - comprehensive test suite dla systemu wariantów i zarządzania `variantPath`

### Poprawiono

- Rozmiar tekstu przycisków wyboru - przyciski choices teraz takie samo jak rozmiar tekstu paragrafu (1.125rem)
- Wygląd ostrzeżenia dostępności - ekran ostrzeżeń (paragraf niedostępny) teraz wygląda jak zwykły paragraf zamiast alert box
- Tytuł scenariusza na wszystkich ekranach - nagłówek H1 widoczny spójnie na każdym ekranie gry (setup, input, paragraph, warning)
- Ujednolicona szerokość ostrzeżenia dostępności - ostrzeżenie ma ustaloną szerokość zamiast pełnej szerokości ekranu
- Spacing od paska nawigacji - spójny odstęp na wszystkich ekranach (setup, input, paragraph, warning)
- Tekst końcowy scenariusza - ostatni paragraf (151) podzielony na 2 strony dla dramatyzmu
- Auto-detekcja stronicowania - paragrafy z wieloma `contentPages` automatycznie włączają przycisków stronicowania (bez potrzeby `isMultiPage`)
- Browser history support - URL parametr `?par=X` do nawigacji i sharowania linków do paragrafów, back button działa prawidłowo
- React keys w RichText - naprawiono kolizje kluczy (keye collisions) gdzie identyczne teksty w różnych blokach powodowały problemy z re-renderowaniem
- Spacing końcowy bloków tekstowych - ostatni blok tekstu/obrazka nie ma marginesu dolnego (`:last-child`)
- Margines wariantowych i zwykłych wyborów - usunięto nadmiarowy margin-top z choices
- CSS wariantowych wyborów - border-top separator dla wariantowych wyborów wewnątrz paragrafu, margin-top dla zwykłych wyborów poniżej

---

## [0.0.11] - 2026-02-21

### Dodano

- Grafiki przedmiotów w paragrafach - przedmioty scenariusza wyświetlają się jako obrazki wprost w tekście opisu paragrafów
- Favicon aplikacji - ikonka w zakładce przeglądarki
- Uzupełniony brakujący paragraf 51 w scenariuszu Droga Donikąd

### Poprawiono

- Renderowanie grafik - wszystkie symbole, karty, osoby i przedmioty wyświetlają się prawidłowo
- Ścieżkami grafik dla GitHub Pages - gra działa poprawnie wszędzie, gdzie jest hostowana
- Brakujące grafiki scenariusza - dodane wszystkie potrzebne obrazki do pełnej rozgrywki

---

## [0.0.10] - 2026-02-16

### Dodano

- Kontrola spacingu między zawartością - bardziej przejrzysta wizualizacja paragrafów
- Wsparcie dla wielokrotnych ID paragrafów - umożliwia ponowne użycie identycznej zawartości

### Zmieniono

- Ulepszone renderowanie tekstu (kursywa, kolory, rozmiary)
- Optymalizacja struktury danych scenariuszy

### Poprawiono

- Marginesy przed przyciskami wyboru
- Renderowanie tekstu kursywnego
- Duplikaty tekstu w wyborach

---

## [0.0.9] - 2026-02-14

### Poprawiono

- Routing aplikacji na GitHub Pages - wszystkie linki nawigacyjne działają prawidłowo

---

## [0.0.8] - 2026-02-12

### Dodano

- Aplikacja dostępna na GitHub Pages
- Kompletny scenariusz "Droga Donikąd" - pełna rozgrywka z 67 paragrafami
- Wybór postaci - graj jako Jessica lub Patrick z różnymi ścieżkami przejścia
- Warunkowe paragrafy - różne teksty i opcje w zależności od historii gry
- Paragrafy z przyciskami
- Możliwość śmierci postaci - niektóre wybory mogą prowadzić do śmierć bohatera
- Bogatsze opisy paragrafów - tekst z formatowaniem, kolorami i stylami
- Stronicowanie długich tekstów - paragrafy mogą mieć wiele stron do przeczytania
- Grafiki scenariusza - ilustracje planszy, kart, przedmiotów i postaci
- Grafiki postaci i antagonisty (Jessica, Patrick, Klaun)
- Symbole gry - od drzwi po amunicję
- Ulepszone ostrzeżenie o dostępie - dedykowany widok zamiast dialogu

### Zmieniono

- Przeorganizowana struktura dostępu do paragrafów - stabilniejsza rozgrywka
- Ulepszona obsługa opcji warunkowych - bardziej intuicyjne przechodzenie między scenami

---

## [0.0.7] - 2026-02-01

### Dodano

- Instrukcje ustawienia gry z wizardem krok-po-kroku
- 18 kroków setupu dla scenariusza "Droga Donikąd" - wyjaśnienie wszystkich reguł gry
- Wsparcie dla wyświetlania grafik scenariusza (zdjęcia planszy, kart, figurek)
- Lepsze formatowanie tekstu setupu - kolory, rozmiary czcionek dla lepszej czytelności

### Zmieniono

- Przeorganizowana struktura danych - wszystkie scenariusze w jednym miejscu
- Ulepszona obsługa setup steps - bardziej czytelne i intuicyjne

---

## [0.0.6] - 2026-01-28

### Dodano

- Lepsze komunikaty błędów - wyszczególnienie dostępnych numerów paragrafów
- Wsparcie dla screen readers i asystentów dostępu

### Zmieniono

- Bardziej stabilna aplikacja - obsługiwanie błędów bez crash'u
- Lepsze etykiety dla przycisków i pól wejściowych

### Poprawiono

- Obsługa granicznych przypadków logiki kostki i warunków paragrafów

---

## [0.0.5] - 2026-01-27

### Dodano

- ConditionalChoice component - pytania yes/no w paragrafach
- Warunkowa logika wyboru - różne paragrafy dla odpowiedzi TAK/NIE
- Wyświetlanie wyniku warunkowego wyboru
- Paragrafy testowe (#9, #10, #11) z warunkową logiką

---

## [0.0.4] - 2026-01-27

### Dodano

- DiceRoller component - kostka k6 z animacją obrotu
- Wyświetlanie wyniku rzutu na ekranie
- Przycisk "Dalej" do przejścia po zobaczeniu wyniku
- Paragrafy testowe (#7, #8, #9) z rzutem kostką
- Warunkowe paragrafy na podstawie wyniku kostki (sukces/porażka)

---

## [0.0.3] - 2026-01-25

### Dodano

- Input screen do wyboru numeru paragrafu z instrukcjami scenariusza
- Paragraph screen do czytania tekstu paragrafu z opcjami wyboru
- Przycisk powrotu do wprowadzania numeru paragrafu
- Obsługa paragrafów bez opcji (dead-end) z przyciskiem powrotu do scenariusza

### Zmieniono

- Lista scenariuszy teraz pokazuje tylko grę, bez etapu wstępnej konfiguracji
- Symplifikacja parametrów scenariusza do liczby graczy i czasu trwania

---

## [0.0.2] - 2026-01-25

### Dodano

- Paragraph Parser utility - obsługa tagów `[item:]`, `[figure:]`, `[board:]`, `[token:]`
- ParagraphText component - renderowanie tekstu z kolorowymi tagami
- Unit tests dla parsera i komponentu (Vitest)
- Sample scenariusz z tagami w grze

---

## [0.0.1] - 2026-01-24

### Dodano

- Komponenty UI: Button (5 wariantów), Header (z logo i nawigacją), Footer
- Page layouts: Home, Instructions, About, ScenariosList, ScenarioSetup, Game
- Horror theme z ciemną paletą kolorów (czerwień + czerń + szarość)
- Responsive design (mobile, tablet, desktop)
- WCAG accessibility support
- CSS Variables dla łatwej personalizacji
- Logo aplikacji

### Zmieniono

- Header teraz zawiera nawigację z aktywnym stanem
- Footer wyświetla wersję z package.json

---

## [0.0.0] - 2026-01-24

### Dodano

- Inicjalizacja projektu Vite + React 18 + TypeScript
- Setup React Router z 6 stronami
- Komponenty bazowe (Header, Footer, Button)
- Podstawowe style i zmienne CSS
- Wsparcie dla języka polskiego
- Nawigacja w aplikacji
- Sample scenariusz w JSON

---

**Ostatnia aktualizacja:** 2026-02-01
