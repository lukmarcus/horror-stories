# ROADMAP.md - Horror Stories

Projekt Horror Stories - Aplikacja towarzysząca grze planszowej.

**Ukończone wersje znajdują się w [CHANGELOG.md](CHANGELOG.md)**

---

## Notatki na przyszłość

- Strona **Wykrywanie problemów** (paragrafy bez połączeń, niedostępne §, brakujące nextParagraphId) — do osobnego milestone'u po v0.2.10
- **Edytor: rzut kostką** — edycja `diceResult` (próg, tekst sukcesu/porażki, docelowe paragrafy); gdy pojawi się pierwszy scenariusz korzystający z tej funkcji
- **Osobne pliki JSON per zasób scenariusza** — zamiast `paragraphs.json` jeden plik per paragraf (`paragraphs/1.json`, `paragraphs/77.json`...); poprawa git diff i DX edytora; wymaga refaktoru loadingu w `index.ts` i ZIP handlera; sensowne przy scenariuszach 200+ paragrafów

---

## Milestone v0.4.0 - Refactor wariantów (Etap 1/3): fundament

### Kontekst

Obecnie warianty (`variants`) komplikują edytor i kod. Docelowo zastępujemy je zwykłymi paragrafami z literowymi sufiksami (np. §100 → §100a, §100b, §100c) + polem `areChoicesHorizontal` dostępnym na każdym paragrafie (nie tylko w trybie wariantowym). To breaking change, rozłożony na kilka wersji 0.4.x.

**Odkrycie z research'u:** mechanizm poziomych/pionowych wyborów już działa niezależnie od `variants` — `ParagraphView.tsx` liczy `isHorizontal = !!paragraph.variants || !!paragraph.areChoicesHorizontal`, a kliknięcie przycisku już obsługuje zarówno `nextVariantId`, jak i zwykłe `nextParagraphId`. Etap 1 jest więc w dużej mierze już zrobiony po stronie gry.

### Zakres

- ✅ Zgeneralizować etykiety horizontal/vertical w `ChoicesSection.tsx` — usunięto słowo "wariant" z aria-label/legend ("Dostępne warianty"/"Wybierz wariant" → "Dostępne opcje"/"Wybierz opcję"); `EditorPreview.tsx` zostaje bez zmian, bo tam kontekst to faktyczny tryb wariantowy edytora
- ⏳ Dodać test end-to-end: zwykły paragraf (bez `variants`) z `areChoicesHorizontal: true` i zwykłymi `nextParagraphId` renderuje się poziomo i nawiguje poprawnie
- ⏳ Potwierdzić, że nawigacja do takiego paragrafu idzie przez zwykłe `SET_PARAGRAPH` (prawdziwa historia przeglądarki, nie `variantPath`)

### Status

- ⏳ Planowane

---

## Milestone v0.4.1 - Refactor wariantów (Etap 2/3): migracja danych

### Zakres

- ⏳ Spłaszczyć istniejące `variants` na realne paragrafy z literowymi sufiksami w `droga-donikad` i `eksperyment`
- ✅ **Rozstrzygnięte:** nazewnictwo — każdy wariant staje się paragrafem-dzieckiem rodzica z dodaną literą na końcu ID (np. §100 z wariantami Klaun/Jessica/Patrick → §100a, §100b, §100c); kolejność liter niekoniecznie musi być alfabetyczna wg nazwy wariantu, ważna jest sama reguła "rodzic + litera"
- ✅ **Rozstrzygnięte:** zagnieżdżone warianty — spłaszczamy wszystko jako rodzeństwo pod jednym rodzicem (§9a, §9b, §9c, §9d), bez tworzenia kolejnego poziomu zależności w dół
- ✅ **Rozstrzygnięte:** §100 nie zawsze będzie miało dzieci (nie każdy scenariusz ma warianty śmierci), a ochrona `DEATH_PARAGRAPH`/`ensureDeath` dotyczy tylko samego §100 (nie da się go usunąć, bo silnik go wymaga) — §100a/§100b/§100c to zwykłe paragrafy autora, w pełni edytowalne i usuwalne jak każde inne
- ✅ **Rozstrzygnięte:** brak kompatybilności wstecznej dla starych eksportów `.horrorstory` ze starym polem `variants` — aplikacja wciąż w rozwoju, to świadomie zostaje złamane, bez auto-spłaszczania przy imporcie

### Status

- ⏳ Planowane

---

## Milestone v0.4.2 - Refactor wariantów (Etap 3/3): przebudowa edytora

### Zakres

- ⏳ Usunięcie trybu "Wariantowy": `VariantModeEditor.tsx`, `VariantEditor.tsx`, `VariantsSection.tsx`, `VariantHeader.tsx`, `variantReducer.ts` i powiązane akcje
- ⏳ Dodanie prostego przełącznika układu (pionowo/poziomo) bezpośrednio przy wyborach zwykłego paragrafu
- ⏳ Rozwijanie/zwijanie "podparagrafów" w lewym sidebarze — algorytm grupowania po wzorcu ID (numer + opcjonalna litera), stan rozwinięcia/zwinięcia, wcięcie wizualne
- ⏳ Auto-tworzenie dzieci z literą — rozszerzyć istniejące auto-tworzenie paragrafu (przy wpisaniu nieistniejącego ID w polu wyboru) o auto-sugestię kolejnej wolnej litery (100 → zaproponuj 100a)
- ⏳ Uproszczenie `useGame.ts`/`Game.tsx` — usunięcie `variantPath`/`ADD_VARIANT`/`CLEAR_VARIANTS` i przycisku "↻ Odśwież warianty"
- ⏳ Przepisanie/usunięcie testów związanych z wariantami: `variantReducer`, `useGame.test.ts` (variantPath), `Game.e2e.test.tsx`, `EditorContext.test.ts`
- ⏳ Aktualizacja dokumentacji: `SCENARIO_SCHEMA.md` (sekcje "Variant Paragraph"/"Nested Variants"), `ADDING_SCENARIO.md`, `TESTING_GUIDE.md` (wiersz "Variant System")

### Status

- ⏳ Planowane

---

## Milestone v0.4.3 - Kolejny dzień w pracy (Scenariusz 3)

### Zakres

**Scenariusz "Kolejny dzień w pracy"** — według procesu opisanego w [ADDING_SCENARIO.md](ADDING_SCENARIO.md), budowany już na czystym modelu (bez wariantów od początku)

### Status

- ⏳ Planowane (po v0.4.2)

---

## Milestone v0.5.0+ - Kolejne scenariusze

**Kolejność (wstępna):**

- v0.5.0: Party time
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
