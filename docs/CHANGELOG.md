# Changelog

Wszystkie istotne zmiany w projekcie Horror Stories będą dokumentowane w tym pliku.

Format ten opiera się na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
a projekt przestrzega [Semantic Versioning](https://semver.org/lang/pl/).

---

## [0.0.6] - 2026-01-27

### Dodane

- Paragraph accessibility system - sprawdzanie czy paragraf jest dostępny bezpośrednio
- isDirect/accessibleFrom properties dla każdego paragrafu
- Warning dialog gdy użytkownik wpisze niedostępny paragraf
- Informacja które paragrafy prowadzą do danego paragrafu
- Unit tests dla accessibility logic

---

## [0.0.5] - 2026-01-27

### Dodane

- ConditionalChoice component - pytania yes/no w paragrafach
- Warunkowa logika wyboru - różne paragrafy dla odpowiedzi TAK/NIE
- Wyświetlanie wyniku warunkowego wyboru
- Paragrafy testowe (#9, #10, #11) z warunkową logiką

---

## [0.0.4] - 2026-01-27

### Dodane

- DiceRoller component - kostka k6 z animacją obrotu
- Wyświetlanie wyniku rzutu na ekranie
- Przycisk "Dalej" do przejścia po zobaczeniu wyniku
- Paragrafy testowe (#7, #8, #9) z rzutem kostką
- Warunkowe paragrafy na podstawie wyniku kostki (sukces/porażka)

---

## [0.0.3] - 2026-01-25

### Dodane

- Input screen do wyboru numeru paragrafu z instrukcjami scenariusza
- Paragraph screen do czytania tekstu paragrafu z opcjami wyboru
- Przycisk powrotu do wprowadzania numeru paragrafu
- Obsługa paragrafów bez opcji (dead-end) z przyciskiem powrotu do scenariusza

### Zmieniono

- Lista scenariuszy teraz pokazuje tylko grę, bez etapu wstępnej konfiguracji
- Simplifikacja parametrów scenariusza do liczby graczy i czasu trwania

---

## [0.0.2] - 2026-01-25

### Dodane

- Paragraph Parser utility - obsługa tagów `[item:]`, `[figure:]`, `[board:]`, `[token:]`
- ParagraphText component - renderowanie tekstu z kolorowymi tagami
- Unit tests dla parsera i komponentu (Vitest)
- Sample scenariusz z tagami w grze

---

## [0.0.1] - 2026-01-24

### Dodane

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

### Dodane

- Inicjalizacja projektu Vite + React 18 + TypeScript
- Setup React Router z 6 stronami
- Komponenty bazowe (Header, Footer, Button)
- Podstawowe style i zmienne CSS
- Wsparcie dla języka polskiego
- Navigacja w aplikacji
- Sample scenariusz w JSON

---

**Ostatnia aktualizacja:** 2026-01-25
