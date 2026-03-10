# Changelog

Wszystkie istotne zmiany w projekcie Horror Stories będą dokumentowane w tym pliku.

Format ten opiera się na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
a projekt przestrzega [Semantic Versioning](https://semver.org/lang/pl/).

---

## [0.1.0] - 2026-03-07

### Poprawiono

- GitHub Pages routing – HashRouter zamiast BrowserRouter dla niezawodnego działania Single Page Application na GitHub Pages
- Input field na wielostronowych paragrafach – `currentPage` teraz resetuje się przy zmianie paragrafu, zapobiegając braku pola input na paragrafach docelowych (bug #77→121)
- Wsparcie dla linków z query parametrami – `?par=12` zachowywane przy routingu
- Drobne poprawki w scenariuszu "Droga Donikąd" – usunięty duplikat ID paragrafu (97→87), błędna dostępność (123), klarowniejsza instrukcja mechaniki gry
- **UI: Zmiana nazw przycisków nawigacji:**
  - Menu "Graj" → "Scenariusze"
  - "Wróć do gry" → "Wróć do menu scenariusza" (w setup)
  - "Wróć" → "Wróć do menu scenariusza" (w paragrafach bez wyborów)
  - "Powrót do Menu" → "Lista scenariuszy" (w input field)
- **UI: Dodatkowe kontrolki setup'u na dole** – licznik kroku i przyciski Poprzedni/Następny dostępne na górze i dole ekranu
- **UI: Rzut kością w fullscreen widoku** – dedykowany modal z opcjami 1x/2x/3x kości, animacje rzucania (10 klatek), wyświetlanie rozbicia wyników (np. "2 + 3 = 5"), możliwość wielokrotnego rzucania
---

## [0.0.12] - 2026-03-04

### Dodano

- Warianty postaci i akcji w paragrafach - możliwość wyboru wariantu w obrębie jednego paragrafu, każdy wariant ma swoją zawartość
- Przyciski wracania z numerami paragrafów - szybka nawigacja do poprzednio odwiedzonych paragrafów (np. "← Wróć do #9")
- Przycisk odświeżania wariantów - reset wyborów wariantowych aby przejść ścieżkę od nowa (np. "↻ Odśwież #9")
- Pełna obsługa historii przeglądarki - przycisk back/forward przeglądarki wraca i idzie do poprzednich paragrafów
- Inline input w paragrafach bez wyborów - możliwość wpisania numeru paragrafu zamiast wracania do menu
- Automatyczne stronicowanie - paragrafy z wieloma stronami automatycznie dodają przyciski do przechodzenia między stronami

### Poprawiono

- Większa czcionka przycisków wyboru - lepszą czytelność opcji
- Wygląd ostrzeżeń dostępności paragrafów - wygląda teraz jak zwykły paragraf zamiast alertu
- Konsystentny tytuł scenariusza - widoczny na wszystkich ekranach gry
- Lepsze rozmieszczenie elementów - usunięcie nadmiarowych marginesów

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
