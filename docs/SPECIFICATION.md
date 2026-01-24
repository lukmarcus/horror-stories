# Horror Stories - Aplikacja Towarzysząca

## 1. Ogólny opis aplikacji

- **Przeznaczenie:** Aplikacja towarzysząca grze planszowej Horror Stories
- **Format:** Webowa aplikacja responsywna (React + TypeScript + Vite)
- **Docelowe platformy:** PC, mobile (PWA), w przyszłości APK w Google Play
- **Dostępność:** WCAG compliant, obsługiwana szerokość od 320px
- **Struktura:** Niezależne scenariusze fabularne bez powiązań między sobą
- **Rozszerzalność:** Możliwość dodawania własnych scenariuszy (luźna myśl)

## 2. Architektura scenariuszy

### Struktura scenariusza

- Wiele niezależnych, różnych historii tekstowych
- Każdy scenariusz składa się z paragrafów numerowanych
- Paragrafy są jednostkami zawartości
- Paragrafy mogą zawierać: tekst, linki, symbole/ikony, multimedia, formatowanie (bold, italic, kolory)

### Typy dostępu do paragrafów

- **Typ A (bezpośredni):** Dostępne natychmiast poprzez input (nr paragrafu) – wynik akcji graczy
- **Typ B (pośredni):** Dostępne tylko poprzez linki w innych paragrafach

### Walidacja

- Brakujący paragraf → komunikat o błędzie
- Próba dostępu do paragrafu niedostępnego → potwierdzenie "Na pewno?" z listą źródeł
- Nieprawidłowy format input → komunikat błędu

## 3. Funkcjonalności paragrafów

### Zawartość paragrafu

- Tekst z formatowaniem (bold, italic, kolory)
- Linki do innych paragrafów (klikalny tekst)
- Symbole/ikony obiektów
- Multimedia (grafiki)
- Dźwięki/dialogi

### Warunki warunkowe (Conditional Choices)

- Paragrafy mogą zawierać wybory warunkowe zależne od posiadania przedmiotów
- UX: Najpierw pytanie "Czy posiadasz [przedmiot]?"
- Po wyborze opcji → wyświetlenie odpowiedniego wyboru poniżej/obok/zamiast poprzedniego
- Nie wyświetlać logiki ("Jeśli masz X, to..." - ukryć tę logikę)

### Powrót do menu paragrafów

- Button dostępny z każdego paragrafu

## 4. Rzut kostką (k6)

### Funkcjonalność

- Paragrafy mogą wymagać rzutu kostką k6
- Symulacja wizualna rzutu (np. biblioteka react-dice-roll lub podobna)
- Wyświetlenie wyniku i jego integracja z tekstem/logiką paragrafu

### Integracja

- Wynik może warunkować dostęp do paragrafów lub wyświetlane opcje

## 5. System audio

### Muzyka w tle

- Opcjonalna muzyka ambientalna w grze
- Przycisk on/off w menu

### Player dźwięków/dialogów

- Lokalizacja: górna część ekranu
- Funkcje: play/pause, przewijanie ±5 sekund
- Minimalistyczny design, nie przeszkadza w czytaniu

## 6. Setup scenariusza

### Kroki konfiguracji (przewijalne)

- Kilka kroków do wykonania przed grą
- Każdy krok: instrukcja tekstowa (np. "Wyłóż planszę", "Wyciągnij postacie")
- Na końcu: "Jesteś gotowy do gry"
- Możliwość nawigacji między krokami

### Dostęp

- Z menu wyboru scenariusza

## 7. Interfejs - Menu główne

### Ekran główny

- Button "Graj" → Lista scenariuszy
- Button "Instrukcja/FAQ"
- Button "O grze" → Info o grze planszowej + info o aplikacji
- Muzyka w tle

### Lista scenariuszy

- Grafiki/thumbnailki scenariuszy z efektami hover
- Podpisy tekstowe
- Po wyborze → Setup scenariusza + ekran gry

## 8. Interfejs - Ekran gry

### Elementy

- Wyświetlanie paragrafu (tekst z formatowaniem)
- **Input pole:** Wpisanie numeru paragrafu
- **Buttony:**
  - "Przygotuj scenariusz" (wyświetla kroki setupu)
  - "Uruchom scenariusz" (automatyczne działania?)
  - "Powrót do menu"

### Player audio

- Jeśli paragraf wymaga dźwięku

## 9. Interfejs - Ogólne

### Layout

- Ograniczona szerokość (nie pełna szerokość okna)
- Responsywny na 320px+
- WCAG AA/AAA compliance

### Stylizacja

- Grafika jako tło (background)
- Specjalne czcionki (horrorowe/atmosferyczne)
- Spójny visual consistency

### Stopka (na każdym ekranie)

- Numer wersji aplikacji
- Dodatkowa informacja (np. link do autora/licencji)
- Na stałe na dole

## 10. Przepływ użytkownika

1. **Start** → Menu główne (opcja: Graj, Instrukcja, O grze)
2. **Graj** → Lista scenariuszy (thumbnailki + opisy)
3. **Wybór scenariusza** → Setup (kroki)
4. **Zaakceptowanie setupu** → Ekran gry (paragraf + input)
5. **Input paragrafu** → Wyświetlenie paragrafu
6. **Z paragrafu** → Linki do innych paragrafów lub powrót do menu
7. **Koniec** → Powrót do menu głównego

## 11. Funkcjonalności dodatkowe - Instrukcja/FAQ

- **Sekcja:** Podstawowe informacje o grze, jak korzystać z aplikacji
- **Dostęp:** Z menu głównego

## 12. Rozszerzalność - Własne scenariusze (luźna myśl na później)

### Wczytywanie pliku JSON

- Możliwość uploadu własnego pliku JSON w wersji online
- Format: Struktura paragrafów (do ustalenia)
- Po wczytaniu: Scenariusz dostępny tylko w bieżącej sesji (nie zapisywany na serwerze)

### Edytor scenariuszy

- Przyszłościowa myśl (wymaga osobnego projektu)

### Status

- Nie priorytet na start

## 13. Biblioteka ikon/grafik

### Źródło

- Wszystkie ikony i grafiki pochodzą bezpośrednio z gry planszowej Horror Stories

### Zawartość

- Ikony obiektów (przedmioty, postacie, elementy gry)
- Grafiki scenariuszy (thumbnailki, tła, elementy UI)
- Tło aplikacji
- Efekty wizualne

### Przygotowanie

- Zasoby będą dostarczane jako część oficjalnego pakietu gry

### Integracja

- W kodzie będą referowane ścieżkami do plików graficznych

## 14. Technical Stack

### Frontend Framework

- **React 18** - nowoczesna biblioteka UI
- **TypeScript** - statyczne typowanie
- **Vite** - ultra-szybki bundler i dev server
- **React Router** - routing między ekranami (menu → gra → instrukcja)

### State Management

- **React Context API** - zarządzanie stanem (bieżący scenariusz, odtwarzany dźwięk, itp)
- **Local State (useState)** - stan lokalny komponentów

### Styling

- **CSS Modules** - enkapsulowane style komponentów
- Alternatywnie: Tailwind CSS dla szybszego developmentu

### Biblioteki dodatkowe

- **react-dice-roll** (lub podobna) - symulacja rzutu kostką
- **lucide-react** - ikony UI
- Inne: wg potrzeb

### Język

- **Polski** na starcie, architektura przygotowana do wielojęzyczności

## 15. Struktura katalogów projektu

```
horror-stories/
├── public/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── backgrounds/
│   │   │   ├── scenarios/
│   │   │   └── icons/
│   │   └── audio/
│   │       ├── sounds/
│   │       └── music/
│   └── scenarios/
│       └── [scenariusze JSON]
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Button.tsx
│   │   │   └── ...
│   │   ├── AudioPlayer/
│   │   ├── DiceRoller/
│   │   ├── Paragraph/
│   │   └── Scenarios/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── ScenariosList.tsx
│   │   ├── ScenarioSetup.tsx
│   │   ├── Game.tsx
│   │   ├── Instructions.tsx
│   │   └── About.tsx
│   ├── context/
│   │   └── [Context API contexts]
│   ├── hooks/
│   │   └── [Custom React hooks]
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── scenarioLoader.ts
│   │   ├── validation.ts
│   │   └── ...
│   ├── styles/
│   │   ├── global.css
│   │   └── variables.css
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 16. Obsługa błędów & Edge Cases

### Multimedia

- Brakująca grafika → wyświetlić placeholder z ikoną
- Brakujący dźwięk → ukryć player, log w konsoli
- Timeout multimediów → pokazać komunikat o błędzie, kontynuować grę

### Paragrafy

- Brakujący paragraf → "Paragraf nie istnieje"
- Brakujące pole w strukturze paragrafu → graceful fallback
- Nieznany format linku → zignorować link

### Walidacja

- Pusty input → komunikat o błędzie
- Input non-numeryczny → komunikat o błędzie
- Ujemne numery paragrafów → komunikat o błędzie

### Error Boundaries

- Komponenty React z error handling dla kluczowych części
- Fallback UI zamiast białego ekranu

## 17. Persystencja & Local Storage

### Na starcie (MVP)

- Brak zapisywania postępu gry
- Brak save/load

### Potencjalne rozszerzenia (przyszłość)

- localStorage: ustawienia użytkownika (głośność, ciemny motyw)
- Postęp scenariusza (ostatnio odwiedzony paragraf)

## 18. PWA & Deployment

### Hosting

- **GitHub Pages** na starcie
- Aplikacja dostępna pod adresem: https://lukmarcus.github.io/horror-stories/

### PWA Features

- Możliwość instalacji na urządzeniu (add to home screen)
- Offline support (przechowywanie scenariuszy lokalnie)
- Service Worker - do implementacji gdy będzie potrzebny

### Build & Deployment

- Vite build dla produkcji
- Wdrażanie poprzez GitHub Actions (CI/CD)
- Kompresja assetów

## 19. Model danych - Format scenariusza

### Struktura paragrafu

Każdy paragraf zawiera:

- **ID:** Unikalny numer/identyfikator (np. 1, 2, 3, 9, 29, 40, 99)
- **Zawartość:** Tekst z możliwością formatowania i symboli
- **Typ dostępu:** Bezpośredni (A) lub pośredni (B)
- **Opcjonalnie:** Warunki warunkowe, linki do innych paragrafów

### Formatowanie tekstu w paragrafach

- **Bold:** `[bold]tekst[/bold]`
- **Italic/Kursywa:** `[italic]tekst[/italic]` (dla dialogów)
- **Kolory:** `[color:violet]tekst[/color]` lub podobna notacja
- **Symbole inline:** `[icon:żeton]`, `[icon:potwór]`, `[icon:postać]`

### Konwencja naming i języka

- **Kod źródłowy:** Nazwy zmiennych, funkcji, klas - **ANGIELSKI**
- **Dane w plikach JSON:** Klucze - **ANGIELSKI**
- **Teksty wyświetlane użytkownikowi:** Wszystko - **POLSKI**
- **Referencje elementów:** ID/numery globalne (Roman numerals, Arabic, letters) - bez zmian

**Przykład:**

```json
{
  "id": "item_1",
  "name": "Pizza",
  "nameDisplay": "Pizza",
  "type": "story_item",
  "romanNumeral": "XLIX",
  "actionParagraph": 21
}
```

### Referencje w paragrafach - Notacja elementów

#### Numery paragrafów

- **Format:** `[page:1]` - numer paragrafu z zakodowanym kolorem
- **Przykład:** "Przejdź do (paragrafu `[page:40]`)"
- **Zawiera:** Numer + kolor (definiowany w bazie)

#### Strony planszy (Board pages)

- **Format:** `[board_page:A]` - litera strony z zakodowanym kolorem
- **Przykład:** "Na stronie `[board_page:N]` planszy..."
- **Zawiera:** Litera (A-Z) + kolor (definiowany w bazie)

#### Przedmioty fabularne

- **Format:** `[item:XLIX]` - numeracja rzymska
- **Przykład:** Pizza `[item:XLIX]` z akcją na paragraf 21
- **Zawiera:** Numer, symbol, możliwa akcja

#### Przedmioty losowe

- **Format:** `[random]`
- **Przykład:** Otrzymujesz `[random]` z losowego ekwipunku
- **Zawiera:** Symbol, opis akcji

#### Żetony planszy

- **Format:** `[board:14]`
- **Przykład:** Plansze 14 `[board:14]` - zawiera symbol planszy
- **Zawiera:** Numeracja arabska, symbol

#### Żetony alfabetu

- **Format:** `[letter:A]` lub `[letter:N]`
- **Przykład:** Na pozycji `[letter:N]` (północ planszy)
- **Zawiera:** Litera (A-Z)

#### Żetony statusu postaci

- **Format:** `[status:nazwa]` (do ustalenia konkretnych statusów)
- **Przykład:** `[status:omdlały]`, `[status:ranny]`
- **Zawiera:** Numeracja?, symbol, opis

#### Figurki postaci

- **Format:** `[figure:Patrick]`
- **Przykład:** Figurka `[figure:Patrick]` leży/stoi
- **Zawiera:** Imię/nazwa, symbol

#### Żetony ogólne

- **Format:** `[token:drzwi_otwarte]`, `[token:drzwi_zamknięte]`, `[token:potwór]`, etc.
- **Przykład:** `[token:drzwi_otwarte]`, `[token:życie]`, `[token:doświadczenie]`
- **Zawiera:** Symbol, kategoria specjalna

#### Karty akcji

- **Format:** `[action_card:nazwa]`
- **Przykład:** `[action_card:Atak]` (5 punktów)
- **Zawiera:** Nazwa, wartość punktów, opis akcji

#### Karty postaci (do ustalenia)

- **Format:** `[character_card:nazwa]`
- **Zawiera:** Imię, statystyki, efekty

#### Karty rozwoju (do ustalenia)

- **Format:** `[development_card:nazwa]`
- **Zawiera:** Typ, efekt

### Opcje warunkowe w paragrafach

- Pytanie: "Czy posiadasz [przedmiot]?" lub "Czy figurka stoi/leży?"
- Każda opcja warunkowa zawiera:
  - Warunek (np. "gdy figurka leży")
  - Tekst opcji
  - Link do paragrafu docelowego (np. "przejdź do paragrafu 40")

### Linki między paragrafami

- Format: `(przejdź do paragrafu X)` lub `(paragrafu X)`
- Linki mogą być warunkowe
- Legalność paragrafu walidowana przy wyborze

### Przykładowe paragrafy

#### Paragraf 1 (bez linków)

```
Odrzuć żeton planszy 37 [token:drzwi_zamknięte] i zastąp go żetonem otwartych drzwi [token:drzwi_otwarte].
Odrzuć również przedmiot [item:XLIX] z ekwipunku.
Spróbuj przejść dalej (przez nowo otwarte drzwi).
```

#### Paragraf 9 (z opcjami warunkowymi i linkami)

```
Poznałaś go na imprezie. Wracaliście jednym autem. Wybierz jedną z opcji spośród:
- (Tę opcję można wybrać wyłącznie, gdy figurka [figure:Patrick] leży) Spróbuj go ocucić (przejdź do paragrafu 40)
- (Tę opcję można wybrać wyłącznie, gdy figurka [figure:Patrick] stoi) Spróbuj z nim porozmawiać (przejdź do paragrafu 99)
- Opuść paragraf
```

#### Paragraf 29 (złożony z formatowaniem)

```
Wyłóż planszę [board:3], a na [letter:N] połóż [token:drzwi_otwarte]
(tak, aby leżało jednocześnie również na [letter:S] planszy [board:14]).
Na [letter:N] planszy [board:14] wyłóż [item:LXIX].
[italic]Jak to możliwe, że wcześniej nie dostrzegliście drzwi oraz wielkiej dziury w ścianie?[/italic]
```

### Struktura JSON (przykład - do finalizacji)

```json
{
  "id": 1,
  "text": "Odrzuć żeton planszy...",
  "type": "direct",
  "linkedFrom": [],
  "actions": []
}
```

## 20. Baza obiektów gry

### Struktura obiektu

Każdy obiekt w grze posiada:

- **ID:** Unikatowy identyfikator (liczba, litera, liczba rzymska)
- **Nazwa:** Tekstowa nazwa obiektu
- **Kategoria:** Rodzaj żetonu (np. broń, przedmiot, potwór, lokacja, itp.)
- **Grafika:** Referencja do ikony/grafiki
- **Metadane:** Dodatkowe informacje (opcjonalnie)

### Przechowywanie

- Format: JSON (assets/objects.json lub plik konfiguracyjny)
- Dostępne w edytorze scenariuszy dla ułatwienia tworzenia

### Zastosowanie

- Ikony w paragrafach
- Warunkowe opcje ("Czy posiadasz [obiekt]?")
- Referencje w scenariuszach

## 21. Edytor scenariuszy (przyszłościowy projekt)

### Koncepcja

- Aplikacja pomocnicza do tworzenia/edycji scenariuszy
- Można rozważyć jako osobny projekt/repozytorium
- Umożliwia tworzenie scenariuszy bez kodu

### Funkcjonalności

- **Interfejs WYSIWYG:** Dodawanie paragrafów, linków, opcji warunkowych
- **Baza obiektów:** Wstawianie gotowych elementów z bazy (ikony, kategorie)
- **Preview:** Podgląd scenariusza w czasie rzeczywistym (jak będzie wyglądać w grze)
- **Export:** Eksport scenariusza do JSON
- **Import:** Import scenariuszy dla edycji

### Przepływ

1. Autor tworzy scenariusz w edytorze
2. Testuje/podgląda scenariusz
3. Eksportuje do JSON
4. Przesyła do zatwierdzenia/integracji z główną grą

### Status

- Nie priorytet na MVP
- Mogłoby być osobną aplikacją (horror-stories-editor)
- Zależne od finalnej struktury JSON scenariuszy
