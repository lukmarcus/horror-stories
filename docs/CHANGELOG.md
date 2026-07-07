# Changelog

Wszystkie istotne zmiany w projekcie Horror Stories będą dokumentowane w tym pliku.

Format ten opiera się na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
a projekt przestrzega [Semantic Versioning](https://semver.org/lang/pl/).

---

## [0.3.1] - 2026-07-07

### Dodano

- Edytor: zarządzanie postaciami — nowa sekcja „Postacie" w bocznym menu pozwala wybrać które postacie występują w scenariuszu; każda postać ma przypisany stały paragraf (jak fizyczna figurka w grze)
- Edytor: znaczniki postaci w spisie paragrafów — paragrafy przypisane do postaci wyświetlają teraz nazwę postaci w nawiasie, np. §9 (Patrick)

### Zmieniono

- Edytor: import wbudowanych scenariuszy — postacie są teraz automatycznie wczytywane z prawidłowymi przypisaniami do paragrafów
- Scenariusz „Droga donikąd" §100 — uproszczono wybory wariantów śmierci (usunięto duplikaty)

### Naprawiono

- Edytor: obrazki postaci w podglądzie — wybory zawierające obrazki (np. tagi `<person>`) są teraz wyświetlane poprawnie zamiast jako surowy kod HTML
- Edytor: format znaczników w spisie paragrafów — uproszczono wyświetlanie z „(postać: Patrick)" na „(Patrick)"

---

## [0.3.0] - 2026-07-05

### Dodano

- Dane: pełny alfabet A-Z jako żetony liter — wszystkie 26 liter alfabetu dostępne w grze (wcześniej tylko A i B)
- Dane: nowe przedmioty z scenariusza „Party time" — 8 roomItems i 5 storyItems z grafikami
- Dane: nowe postacie z scenariusza „Party time" — 8 postaci z grafikami (Jeff, Patrick, Josh, Jessica, Margaret, gość od pizzy, policjant, sąsiad)
- Dane: nowe symbole dla scenariusza „Party time" — Cecha i Dialog
- Dokumentacja: przewodnik ADDING_SCENARIO.md — kompletny szablon procesu dodawania nowych scenariuszy

---

## [0.2.12] - 2026-06-27

### Naprawiono

- Edytor: importowane scenariusze teraz zapisują się do IndexedDB i pozostają dostępne po odświeżeniu strony
- Edytor: eksport scenariuszy generuje bardziej zwięzły JSON — proste tablice (np. `id`, `accessibleFrom`) są teraz w jednej linii zamiast rozłożone na wiele wierszy
- Scenariusz „Droga donikąd": poprawiono `accessibleFrom` w paragrafach 75 i 113

---

## [0.2.11] - 2026-06-16

### Dodano

- Edytor: możliwość zaimportowania wbudowanych scenariuszy jako szablon — kliknij „Importuj wbudowany scenariusz" w menu głównym edytora, wybierz scenariusz i edytuj go według własnych potrzeb
- Edytor: kontrola odstępów między akapitami — przycisk „⏶" w pasku narzędzi pozwala usunąć przerwy między wybranymi blokami tekstu dla lepszej kontroli układu
- Edytor: podgląd przygotowania podczas edycji — edytor i podgląd setupu wyświetlane obok siebie dla łatwiejszej pracy

### Zmieniono

- Ulepszony format zapisu scenariuszy — zaimportowane i wyeksportowane pliki `.horrorstory` są teraz bardziej zwięzłe i czytelne (automatyczna konwersja przy imporcie starszych plików)

---

## [0.2.10] - 2026-06-13

### Dodano

- Edytor: pole Postacie w formularzu meta — checkboxy ze wszystkich dostępnych postaci (`data/characters`); zaznaczone widoczne na karcie scenariusza
- Edytor: pole Notatki w formularzu meta — textarea z notatkami dla prowadzącego
- Edytor: widok Przeciwnicy — lista checkboxów dostępnych wrogów (wielokrotny wybór) oraz presety modyfikatorów kości gracza (−2, −1, +1, +2)
- Edytor: węzeł `[Setup]` widoczny w grafie połączeń z połączeniami do paragrafów wynikających z wyborów w przygotowaniu

### Zmieniono

- Edytor: kolejność pól formularza meta: tytuł → ID → opis → liczba graczy/czas → postacie → notatki
- Edytor: kolejność pozycji menu bocznego: Dane scenariusza → Żetony alfabetu → Przeciwnicy → Grafiki → Przygotowanie → Graf połączeń
- Edytor: scenariusz może mieć wielu przeciwników (zamiast jednego `enemyId`)

---

## [0.2.9] - 2026-06-07

### Dodano

- Edytor: LettersEditor — dodawanie, edytowanie i usuwanie żetonów alfabetu (`letters.json`); każdy żeton łączy literę z docelowym paragrafem
- Edytor: Żetony alfabetu widoczne w grafie scenariusza jako oddzielne węzły kołowe (np. `((A))`) z połączeniami do paragrafów; kliknięcie węzła przechodzi na ekran liter
- Edytor: Interfejs LettersEditor w stylu wyborów — pole paragrafu docelowego z autouzupełnianiem i zapobieganiem duplikatom
- Edytor: W bocznym panelu paragraf wyświetla tag `(litera A)` gdy jest podpięty pod żeton alfabetu
- Edytor: W edytorze paragrafu sekcja „Dostępna przez literę: [A]" z tagiem-linkiem prowadzącym do ekranu liter
- Edytor: SetupEditor — dodawanie, edytowanie i usuwanie kroków przygotowania scenariusza (`setup.json`); każdy krok to bloki treści (edytor bloków) i opcjonalne wybory z autouzupełnianiem
- Eksport/import `.horrorstory` obejmuje teraz `letters.json` i `setup.json`
- Importowane scenariusze użytkownika zapisują żetony alfabetu i kroki setupu w `localStorage`, dzięki czemu gra je wczytuje poprawnie
- `getLetter` obsługuje litery zarówno małe, jak i wielkie (`a` = `A`)
- Żetony alfabetu w widoku alfabetu posortowane alfabetycznie

---

## [0.2.8] - 2026-06-01

### Dodano

- Aliasy dla paragrafów — jeden paragraf dostępny pod wieloma numerami; edytowalne w panelu paragrafu jako oddzielna lista
- Panel grafik scenariusza — nowa strona „Grafiki" w lewym menu edytora; pozwala wgrywać własne obrazki (JPG/PNG, max 2 MB, do 32 sztuk), podglądać miniaturki i usuwać grafiki
- Grafiki są zapisywane razem ze scenariuszem i pakowane do pliku `.horrorstory` przy eksporcie; po ponownym imporcie wracają bez utraty
- Przy wstawianiu obrazka do treści paragrafu lub do tekstu wyboru lista dostępnych grafik scenariusza pojawia się w dropdownie z miniaturkami
- Pasek „Tekst:" ma przycisk 🖼️ — wstawia grafikę inline wewnątrz akapitu
- Pasek „Akapit:" ma przycisk 🖼️ — wstawia grafikę jako osobny akapit pełnej szerokości
- Podgląd wyborów pokazuje własne grafiki scenariusza wstawione w tekście wyboru
- Potwierdzenia destruktywnych akcji (nowy scenariusz, usuń szkic, usuń paragraf, usuń wariant, przełącz na tryb prosty) są teraz wyświetlane bezpośrednio w interfejsie — bez systemowych okienek przeglądarki

### Naprawiono

- Paragraf 100 (śmierć) w nowym scenariuszu otwierał się w trybie „stary format — tylko tekst" zamiast normalnego edytora bloków
- Import scenariuszy użytkownika — warianty z pustymi wyborami (dead-end) pokazywały selektor głównego paragrafu zamiast być dead-end

---

## [0.2.7] - 2026-05-27

> Wersja techniczna — brak zmian widocznych dla użytkownika

---

## [0.2.6] - 2026-05-24

### Dodano

- Tworzenie paragrafów wariantowych — przełącznik „Prosty / Wariantowy" otwiera tryb z treścią wprowadzającą i selektorem poziomych przycisków prowadzących do osobnych wariantów
- Każdy wariant ma własne strony treści i wybory; można go zwinąć, rozwinąć, zmienić mu nazwę lub usunąć
- Połączenia wychodzące z wariantów są widoczne w grafie scenariusza
- Plik `.horrorstory` w pełni zachowuje strukturę wariantową — zapis i odczyt bez utraty danych
- Podgląd selektorów i wyborów w edytorze wygląda identycznie jak przyciski w grze
- Pole docelowe wyboru ma teraz podpowiadacz — po kliknięciu otwiera się lista dostępnych paragrafów, filtrowana w trakcie wpisywania; lista pojawia się w górę i w prawo, nie zasłaniając pozostałych wyborów
- Wpisanie numeru paragrafu który jeszcze nie istnieje automatycznie go tworzy — pojawia się od razu na liście bez konieczności ręcznego zakładania
- Pole tekstowe wyboru otrzymało pełny pasek narzędzi: pogrubienie, kursywa, podkreślenie, kolor zaznaczenia, gotowe kolorowe wstawki oraz pickery grafik — te same narzędzia co w edytorze treści paragrafu
- Gotowe wstawki (`</>`): `§ paragraf` (zielony), `UWAGA` (czerwony), `nagroda` (niebieski), `NEWS` (fioletowy) — wstawiają kolorowy tekst jednym kliknięciem
- Podgląd wyborów renderuje kolorowe tagi, obrazki i inne znaczniki — widać efekt końcowy zamiast surowego kodu

### Zmieniono

- Nie można dodać wyboru bez wpisania tekstu — przycisk „+ Dodaj" jest nieaktywny dopóki pole jest puste
- Nie można dodać wyboru wskazującego na ten sam paragraf
- Sidebar z listą paragrafów i panel edycji scrollują się niezależnie od siebie

---

## [0.2.5] - 2026-05-16

### Dodano

- Toolbar edytora: przyciski-picki grafik dla wszystkich globalnych elementów inline — symboli akcji, żetonów planszy, postaci, przeciwników, przedmiotów fabularnych, żetonów statusu, żetonów liter i przedmiotów losowych
- Najechanie na miniaturkę w pickerze pokazuje tooltip z nazwą i opisem elementu
- Nowy tag `<enemy id="..."/>` dla figurek przeciwników (do tej pory używany był `<person>`)
- Nowy tag `<random id="..."/>` dla przedmiotów losowych
- Postacie podzielone na dwie kategorie: postacie graczy (`<person>`) i przeciwnicy (`<enemy>`)

### Zmieniono

- Symbol `rewers` przemianowany na `karta-akcji`; symbol `losowe` przemianowany na `przedmiot-losowy`
- Symbole posortowane alfabetycznie
- Przedmioty losowe mają teraz uproszczone identyfikatory (i, ii, iii…) zamiast opisowych nazw
- Statusy wzbogacone o pole `name` wyświetlane w toolbarze jako „Żeton statusu: {name}"
- Etykiety pickerów: „Żeton statusu:", „Wstaw żeton statusu", „Wstaw przedmiot losowy" — spójne nazewnictwo
- Przedmioty fabularne posortowane według wartości liczby rzymskiej (XIII → XIV → XVII → LIII)
- Wszystkie grafiki inline ujednolicone do tej samej wysokości (1.4em)

---

## [0.2.4] - 2026-05-11

### Dodano

- Edycja treści paragrafu jako bloki (ContentBlock[]) — każda linia to osobny blok z niezależnym formatowaniem
- Formatowanie bloku: pogrubienie, kursywa, podkreślenie, kolor (żółty / czerwony / fioletowy / zielony / niebieski) oraz rozmiar (xs / sm / lg / xl)
- Formatowanie inline wewnątrz bloku — zaznacz fragment tekstu i użyj przycisków w toolbarze
- Wielostronicowe paragrafy — paragraf może składać się z wielu stron; wybory pojawiają się tylko na ostatniej stronie
- Toolbar edytora podzielony na dwa rzędy: „Tekst" (formatowanie inline) i „Akapit" (formatowanie bloku) z wizualnym podświetleniem aktywnych opcji
- Wstawianie grafik ze scenariusza bezpośrednio w treści paragrafu

### Naprawiono

- Eksport `.horrorstory`: paragrafy sortowane numerycznie (§1, §2… zamiast kolejności dodania)
- Eksport `.horrorstory`: wewnętrzne identyfikatory wyborów nie trafiają do pliku

---

## [0.2.3] - 2026-05-06

### Dodano

- Dodawanie, edycja i usuwanie wyborów (`Choice`) w paragrafie — tekst wyboru i docelowy paragraf
- Lista wybieranych paragrafów posortowana numerycznie
- Sekcja „Prowadzi tutaj" w nagłówku paragrafu — klikalny skrót do każdego paragrafu, który do niego prowadzi
- Cele wyborów w podglądzie jako klikalne przyciski nawigacji
- Graf połączeń między paragrafami (zakładka „Graf połączeń" w edytorze) — renderowany przez Mermaid, kliknięcie węzła nawiguje do paragrafu
- Eksport `.horrorstory` automatycznie generuje `accessibleFrom` dla każdego paragrafu na podstawie wyborów
- Konwersja wyborów edytora do formatu gry przy wczytywaniu scenariusza użytkownika

---

## [0.2.2] - 2026-05-03

### Dodano

- Edycja treści paragrafu bezpośrednio w edytorze — pole tekstowe z podglądem na żywo po prawej stronie
- Podgląd renderuje każdą linię jako osobny akapit (Enter = nowy akapit)
- Paragraf §100 wyświetla zablokowany przycisk "Nie można usunąć"; pozostałe paragrafy można usunąć z ich widoku
- Wczytanie pliku `.horrorstory` z listy scenariuszy zapisuje teraz paragrafy — scenariusz jest w pełni grywalny (paragrafy ładowane z localStorage podczas gry)
- Usunięcie scenariusza z listy usuwa też zapisane paragrafy

---

## [0.2.1] - 2026-04-30

### Dodano

- Lewy panel edytora stał się pełnym menu nawigacyjnym: sekcje "Dane scenariusza", "Przygotowanie" i "Żetony alfabetu" oraz lista paragrafów scenariusza
- Kliknięcie paragrafu w panelu przełącza widok na ten paragraf
- Paragraf §100 (zakończenie śmiercią) jest zawsze obecny w scenariuszu i wyświetla się z etykietą _(śmierć)_
- Dodawanie nowych paragrafów przez pole w dolnej części panelu — wystarczy wpisać numer i nacisnąć Enter lub przycisk +
- Eksport .horrorstory zawiera teraz listę paragrafów; wczytany plik zachowuje wszystkie dodane paragrafy

---

## [0.2.0] - 2026-04-28

### Dodano

- Nowa sekcja "Edytor scenariuszy" dostępna z menu głównego (przycisk "Edytor")
- W edytorze można wypełnić metadane scenariusza: tytuł, opis, liczbę graczy i czas trwania
- Gotowy scenariusz można wyeksportować do pliku `.horrorstory` przyciskiem "Eksportuj"
- Plik `.horrorstory` można wczytać z powrotem do edytora przyciskiem "Wczytaj plik"
- Plik `.horrorstory` można też wczytać bezpośrednio z listy scenariuszy — pojawi się na górze listy i będzie dostępny do gry
- Wczytany scenariusz można usunąć z listy przyciskiem 🗑 w prawym górnym rogu jego karty
- Edytor zapamiętuje niezapisany szkic — po powrocie do edytora można kontynuować pracę

---

## [0.1.7] - 2026-04-26

### Dodano

- Ekran przeciwnika (przycisk "👽 Przeciwnik" w menu scenariusza i na ślepych zaułkach): wybór figurki, rzut kością, wyświetlanie wykonywanej akcji
- Warunek akcji wyświetlany jako twierdzenie z przyciskami "Prawda" / "Fałsz" — Fałsz automatycznie przechodzi do akcji o niższym wyniku
- Po potwierdzeniu warunku: animowany rzut kością i wynik zanim pojawi się opis akcji
- Symbol ciężkiej rany z grafiką

---

## [0.1.6] - 2026-04-22

### Dodano

- Paragraf 100 w "Droga donikąd": warianty dla śmierci postaci — Klaun, Jessica, Patrick; możliwość wskazania czy ciężką ranę ma jedna czy obie postacie

### Naprawiono

- Żetony stanu (`<status id='...'/>`) teraz wyświetlają się jako ikony inline w treści paragrafów

---

## [0.1.5] - 2026-04-19

### Dodano

- Widok żetonów alfabetu w menu scenariusza: kafelki z grafikami liter, kliknięcie przenosi bezpośrednio do odpowiedniego paragrafu
- Przycisk powrotu do widoku żetonów alfabetu z poziomu paragrafu
- Przycisk "💀 Śmierć" w menu scenariusza: po potwierdzeniu przechodzi do paragrafu 100
- Przyciski rzutu kością, żetonów alfabetu i śmierci dostępne teraz również gdy paragraf nie ma wyborów (tzw. dead-end) — nie trzeba wracać do menu

### Zmieniono

- Wszystkie przyciski nawigacyjne mają teraz spójny wygląd: ikona + dwuwierszowy opis
- Strzałki w przyciskach zmienione z tekstowych (← →) na emoji (◀️ ▶️ 🔄)
- Przycisk "Następny" ma strzałkę ▶️ po prawej stronie, "Poprzedni" — ◀️ po lewej
- Skrócone etykiety przycisków powrotu: "Menu scenariusza", "Żetony alfabetu", "§X" zamiast "Wróć do §X"
- Na małych ekranach (poniżej 576px) widok przygotowania scenariusza wyświetla tytuł, numer kroku i przyciski wyśrodkowane w kolumnie
- Na małych ekranach (poniżej 576px) treść zajmuje pełną szerokość ekranu

### Naprawiono

- Obrazki w paragrafie 30 scenariusza "Droga donikąd" nie wyświetlały się poprawnie

---

## [0.1.4] - 2026-04-09

### Dodano

- Grafiki okładkowe na kafelkach scenariuszy "Eksperyment" i "Kolejny dzień w pracy"
- Przycisk "← Menu główne" widoczny w lewym górnym rogu na podstronach (Scenariusze, Instrukcja, O grze) oraz wśród przycisków w menu gry

### Zmieniono

- Strona główna przeprojektowana: duże logo, przycisk "Wybierz scenariusz" oraz skróty do Instrukcji i O grze
- Pasek nawigacyjny usunięty — powrót do menu głównego przez przycisk "← Menu główne"
- Stopka uproszczona do jednej linii z autorem i rokiem — widoczna wyłącznie na stronie głównej
- Grafika tła widoczna na wszystkich podstronach, w tym podczas rozgrywki
- Przyciski nawigacyjne w grze mają spójny wygląd z resztą aplikacji

---

## [0.1.3] - 2026-04-02

### Dodano

- Grafiki okładkowe na kafelkach scenariuszy "Droga donikąd" i "Party time" na liście scenariuszy
- 5 nowych scenariuszy na liście (bez zawartości): Party time, Eksperyment, Kolejny dzień w pracy, Śmiertelna zabawa, Świnki trzy i wilk

---

## [0.1.2] - 2026-03-30

### Dodano

- Przycisk rzutu kością dostępny teraz również w paragrafach bez wyborów (dead-end), nie trzeba wracać do menu

### Poprawiono

- Nagłówek paragrafu pokazuje teraz właściwy numer zamiast listy wszystkich numerów (np. "Paragraf 3" zamiast "Paragraf 3, 15, 52, 62...")

---

## [0.1.1] - 2026-03-24

> Wersja techniczna — brak zmian widocznych dla użytkownika

---

## [0.1.0] - 2026-03-20

### Dodano

- Nowy widok rzutu kością z opcjami 1x/2x/3x, animacjami i wyświetleniem rozbicia wyników (np. "2 + 3 = 5")
- Nagłówki sekcji - "Paragraf #XX" na ekranach paragrafów i "Przygotowanie scenariusza" w sekcji setup
- Dodatkowe przyciski Poprzedni/Następny + licznik kroków na dole sekcji przygotowania scenariusza
- Ujednolicone ostrzeżenie dostępności paragrafu - teraz wygląda jak normalna strona gry z przyciskiem powrotu

### Zmieniono

- Nazwy przycisków nawigacji - "Graj" → "Scenariusze", "Wróć do gry" → "Wróć do menu scenariusza", "Powrót do Menu" → "Lista scenariuszy"
- Wygląd interface'u - wszystkie sekcje (setup, paragraf, rzut kością) mają teraz spójny design z ujednoliconymi przyciskami
- Szerokość ekranów - wszystkie główne widoki (input, setup, paragraf, rzut) używają znormalizowanej szerokości dla lepszej czytelności

### Poprawiono

- Routing aplikacji na GitHub Pages - HashRouter zapewnia niezawodne działanie linków na GitHub Pages
- Input field na wieloetapowych paragrafach - pole do wpisania numeru paragrafu teraz się resetuje przy zmianie paragrafu
- Błędne ID paragrafów w scenariuszu "Droga Donikąd" - usunięty duplikat (97→87) i naprawiona dostępność paragrafu 123

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
