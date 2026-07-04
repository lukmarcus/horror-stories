# Adding New Scenario - Guide

Przewodnik krok po kroku dla dodawania nowego scenariusza do Horror Stories.
Ten proces jest szablonem dla wersji 0.x.0 (v0.3.0, v0.4.0, v0.5.0...).

---

## Filozofia

**1 wersja minor (0.x.0) = 1 nowy scenariusz + bugfixy + małe ulepszenia**

Każdy scenariusz przechodzi przez 5 faz: Przygotowanie → Integracja → Testowanie → Fixing → Dokumentacja.

---

## Faza 1: Przygotowanie danych (2-3h)

### A. Dane scenariusza

**Struktura folderów:**

```
src/scenarios/{scenario-id}/
  ├── paragraphs.json      # Wszystkie paragrafy scenariusza
  ├── setup.json           # Przygotowanie gry (opcjonalne)
  ├── letters.json         # Żetony alfabetu (opcjonalne)
  └── images/
      ├── cover.jpg        # Cover na liście scenariuszy (obowiązkowe)
      └── *.jpg/png        # Obrazki używane w paragrafach
```

**Checklist:**

- [ ] Utworzenie folderu `src/scenarios/{scenario-id}/`
- [ ] Dodanie `paragraphs.json` (struktura zgodna z `Paragraph` interface)
- [ ] Dodanie `setup.json` (jeśli scenariusz ma przygotowanie)
- [ ] Dodanie `letters.json` (jeśli scenariusz używa żetonów alfabetu)
- [ ] Dodanie wszystkich grafik scenariusza do `images/`
- [ ] Dodanie `images/cover.jpg` (grafika na liście scenariuszy)
- [ ] Aktualizacja `src/scenarios/index.json`:
  ```json
  {
    "id": "scenario-id",
    "title": "Tytuł Scenariusza",
    "description": "Opis scenariusza...",
    "minPlayerCount": 1,
    "maxPlayerCount": 2,
    "duration": 90,
    "characters": ["Postać 1", "Postać 2"],
    "notes": "Dodatkowe uwagi",
    "enemyIds": ["wrog-id"],
    "enemyDiceModifiers": [1]
  }
  ```

### B. Game data (jeśli scenariusz wymaga nowych zasobów)

#### Przeciwnicy (Enemies)

**Jeśli scenariusz używa nowego wroga:**

1. **Plik JSON wroga:**
   - Lokalizacja: `src/data/enemies/{nazwa-wroga}.json`
   - Format zgodny z `Enemy` interface
   - Zawiera: action table, dice config, tile configuration

2. **Grafika wroga:**
   - Lokalizacja: `public/assets/images/enemies/{nazwa-wroga}.png`
   - Format: PNG z przezroczystym tłem
   - Zalecany rozmiar: dostosowany do layoutu

**Checklist:**

- [ ] Dodanie `src/data/enemies/{nazwa}.json`
- [ ] Dodanie `public/assets/images/enemies/{nazwa}.png`
- [ ] Dodanie ID wroga do `enemyIds` w meta scenariusza

#### Przedmioty (Items)

**8 kategorii przedmiotów w `src/data/items/`:**

1. **Story Items** (`storyItems.json`) - przedmioty fabularne
   - Format: `{ "id": "i", "paragraphId": 5, "description": "..." }`
   - Grafiki: `public/assets/images/storyItems/{id}.png`

2. **Room Items** (`roomItems.json`) - przedmioty pokojowe
   - Format: `{ "id": 5, "name": "Klucz" }`
   - Grafiki: `public/assets/images/roomItems/{id}.png`

3. **Random Items** (`randomItems.json`) - losowe przedmioty
   - Format: `{ "id": "i", "description": "..." }`
   - Grafiki: `public/assets/images/randomItems/{id}.png`

4. **Symbols** (`symbols.json`) - symbole
   - Format: `{ "id": "symbol-id", "name": "Nazwa" }`
   - Grafiki: `public/assets/images/symbols/{id}.png`

5. **Statuses** (`statuses.json`) - statusy postaci
   - Format: `{ "id": "status-id", "name": "Nazwa" }`
   - Grafiki: `public/assets/images/statuses/{id}.png`

6. **Persons** (`persons.json`) - osoby
   - Format: `{ "id": "person-id", "name": "Nazwa" }`
   - Grafiki: `public/assets/images/persons/{id}.png`

7. **Enemies** (`enemies.json`) - znaczniki wrogów (tiles)
   - Format: `{ "id": "enemy-id" }`
   - Grafiki: `public/assets/images/enemies/{id}.png`

8. **Letters** (`letters.json`) - litery alfabetu
   - Format: `{ "id": "A", "name": "A" }`
   - Grafiki: `public/assets/images/letters/{id}.png`

**Checklist:**

- [ ] Dodanie nowych story items (jeśli są) + grafiki
- [ ] Dodanie nowych room items (jeśli są) + grafiki
- [ ] Dodanie nowych random items (jeśli są) + grafiki
- [ ] Dodanie nowych symbols (jeśli są) + grafiki
- [ ] Dodanie nowych statuses (jeśli są) + grafiki
- [ ] Dodanie nowych persons (jeśli są) + grafiki
- [ ] Dodanie grafik nowych liter (jeśli są)

#### Postacie (Characters)

**Jeśli scenariusz używa nowych postaci:**

- [ ] Dodanie do `src/data/characters/` (struktura do ustalenia)
- [ ] Dodanie do pola `characters` w meta scenariusza

### C. Weryfikacja danych

**Przed integracją sprawdź:**

- [ ] Wszystkie pliki JSON są valid (brak błędów składni)
- [ ] Wszystkie `nextParagraphId` w choices prowadzą do istniejących paragrafów
- [ ] Wszystkie obrazki używane w paragrafach (`image: "plik"`) istnieją w folderze `images/`
- [ ] Wszystkie enemy/item/status ID są unikalne (nie kolidują z istniejącymi)
- [ ] Paragraf §100 (death) istnieje
- [ ] Paragraf startowy istnieje i jest dostępny

---

## Faza 2: Integracja kodu (30-60min)

### A. Import scenariusza

**Plik:** `src/scenarios/index.ts`

```typescript
// 1. Dodaj importy na górze pliku
import scenarioName from "./scenario-id/paragraphs.json";
import scenarioNameSetup from "./scenario-id/setup.json";
import scenarioNameLetters from "./scenario-id/letters.json";

// 2. Dodaj do odpowiednich map
export const PARAGRAPHS: Record<string, Record<string, Paragraph>> = {
  // ... existing
  "scenario-id": createParagraphMap(
    (scenarioName as ImportedParagraphs).paragraphs,
  ),
};

export const SETUP_DATA: Record<string, SetupData> = {
  // ... existing
  "scenario-id": scenarioNameSetup as SetupData,
};

export const LETTERS_DATA: Record<string, { letters: LetterToken[] }> = {
  // ... existing
  "scenario-id": scenarioNameLetters as { letters: LetterToken[] },
};
```

**Checklist:**

- [ ] Import `paragraphs.json`
- [ ] Import `setup.json` (jeśli istnieje)
- [ ] Import `letters.json` (jeśli istnieje)
- [ ] Dodanie do `PARAGRAPHS` map
- [ ] Dodanie do `SETUP_DATA` map (jeśli setup exists)
- [ ] Dodanie do `LETTERS_DATA` map (jeśli letters exist)

### B. Import enemies (jeśli dodawano nowego wroga)

**Plik:** `src/data/enemies/index.ts`

```typescript
import enemyName from "./enemy-name.json";
import type { Enemy } from "../../types";

export const getEnemy = (id: string): Enemy | null => {
  const enemies: Record<string, Enemy> = {
    // ... existing
    "enemy-id": enemyName as Enemy,
  };
  return enemies[id] ?? null;
};
```

**Checklist:**

- [ ] Import pliku JSON wroga
- [ ] Dodanie do `enemies` map w `getEnemy()`

### C. Weryfikacja typów

**Checklist:**

- [ ] `npm run build` - kompilacja bez błędów TypeScript
- [ ] `npm run lint` - brak błędów ESLint
- [ ] VS Code nie pokazuje błędów typów w plikach scenariusza

---

## Faza 3: Testowanie mechanik (1-2h)

### A. Podstawowe testowanie

**Uruchomienie aplikacji:**

```bash
npm run dev
```

**Checklist - lista scenariuszy:**

- [ ] Scenariusz widoczny na liście
- [ ] Cover image się wyświetla
- [ ] Meta informacje są poprawne (gracze, czas, postacie)
- [ ] Żetony alfabetu wyświetlone (jeśli są)

**Checklist - setup:**

- [ ] Setup się wczytuje (jeśli istnieje)
- [ ] Wszystkie strony setupu działają (Next/Prev)
- [ ] Grafiki w setupie się wyświetlają
- [ ] Wybory w setupie prowadzą do właściwych paragrafów

### B. Gameplay testing

**Test głównej ścieżki:**

- [ ] Start scenariusza działa
- [ ] Przejście przez główną fabułę (start → §100)
- [ ] Wszystkie grafiki w paragrafach się wczytują
- [ ] Wybory prowadzą do właściwych paragrafów
- [ ] Multi-page paragrafy działają (Next button)
- [ ] Zakończenie (§100) wyświetla się prawidłowo

**Test alternatywnych ścieżek:**

- [ ] Przejście przez minimum 2-3 alternatywne ścieżki
- [ ] Sprawdzenie dead-ends (czy prowadzą do §100)
- [ ] Sprawdzenie loop-ów (czy gra się nie zapętla)

**Test specjalnych mechanik:**

- [ ] **Rzuty kostką** (jeśli są): próg działa, success/fail prowadzą do właściwych §
- [ ] **Warianty** (jeśli są): selektory działają, warianty się przełączają
- [ ] **Żetony alfabetu** (jeśli są): kliknięcie prowadzi do właściwego §
- [ ] **Conditional choices** (jeśli są): Yes/No prowadzą do właściwych §
- [ ] **Back buttons** (accessibleFrom): działają dla paragrafów z wieloma wejściami

**Test przeciwników (jeśli są):**

- [ ] Przeciwnik się wyświetla w widoku EnemyView
- [ ] Grafika wroga się wczytuje
- [ ] Action table wyświetla prawidłowe dane
- [ ] Rzuty kostką wroga działają
- [ ] Modyfikatory kości gracza działają
- [ ] Wszystkie action outcomes mają opisy

**Test przedmiotów (jeśli są):**

- [ ] Story items: grafiki się wyświetlają
- [ ] Room items: grafiki się wyświetlają
- [ ] Random items: grafiki się wyświetlają
- [ ] Symbols: grafiki się wyświetlają
- [ ] Statuses: grafiki się wyświetlają
- [ ] Persons: grafiki się wyświetlają

### C. Weryfikacja techniczna

**Konsola przeglądarki:**

- [ ] Brak błędów JavaScript w konsoli
- [ ] Brak błędów "404 Not Found" dla grafik
- [ ] Brak warningów React

**Network tab:**

- [ ] Wszystkie obrazki scenariusza się wczytują (200 OK)
- [ ] Brak 404 dla brakujących zasobów

---

## Faza 4: Bugfixy (czas zależny od znalezionych bugów)

### Proces

1. **Zbierz wszystkie znalezione problemy** w Fazie 3
2. **Priorytetyzuj:**
   - **Critical** - scenariusz się nie wczytuje / nie można ukończyć
   - **High** - brakujące grafiki / broken links
   - **Medium** - błędy w danych / typos
   - **Low** - drobne issues / косметyka

3. **Napraw po kolei:**
   - Każdy bugfix = osobny commit
   - Retest po każdej poprawce
   - Update checklisty w ROADMAP

4. **Decyzja o scope:**
   - Critical/High: **fix w v0.x.0**
   - Medium/Low: rozważ przesunięcie do v0.x.1

### Checklist

- [ ] Lista bugów utworzona
- [ ] Wszystkie critical/high bugi naprawione
- [ ] Retesty przeprowadzone
- [ ] Final smoke test: start → §100 działa

---

## Faza 5: Dokumentacja (30min)

### A. CHANGELOG.md

Dodaj sekcję dla nowej wersji:

```markdown
## [0.x.0] - YYYY-MM-DD

### Dodano

- Nowy scenariusz: "{Tytuł Scenariusza}"
- [Jeśli są nowe enemies] Przeciwnik: {Nazwa wroga}
- [Jeśli są nowe mechaniki] {Opis nowej mechaniki}

### Naprawiono

- [Lista bugfixów z Fazy 4]
```

### B. README.md

Zaktualizuj liczby:

- Aktualna wersja: `0.x.0`
- Liczba dostępnych scenariuszy

### C. SCENARIO_SCHEMA.md

**Tylko jeśli pojawiły się nowe wzorce:**

- Nowe typy `ContentBlock`
- Nowe pola w `Paragraph`
- Nowe struktury danych

### Checklist

- [ ] `CHANGELOG.md` zaktualizowany
- [ ] `README.md` zaktualizowany (wersja + liczba scenariuszy)
- [ ] `SCENARIO_SCHEMA.md` zaktualizowany (jeśli potrzebne)
- [ ] Commit dokumentacji: `git commit -m "docs: finalize v0.x.0"`

---

## Checklist gotowości do release

### Scenariusz

- [ ] Wszystkie pliki scenariusza zaimportowane (paragraphs, setup, letters, images)
- [ ] Scenariusz widoczny na liście z cover image
- [ ] Scenariusz można ukończyć (dojść do §100)
- [ ] Wszystkie ścieżki fabularne działają
- [ ] Wszystkie grafiki się wczytują

### Game data

- [ ] Wszystkie nowe enemies dodane do `src/data/enemies/` + grafiki
- [ ] Wszystkie nowe items dodane do odpowiednich JSON + grafiki
- [ ] Wszystkie nowe characters dodane (jeśli są)
- [ ] Brak duplikatów ID w bazie danych

### Testy techniczne

- [ ] Brak błędów w konsoli podczas gry
- [ ] Wszystkie obrazki się wczytują (brak 404)
- [ ] `npm run build` przechodzi bez błędów
- [ ] `npm test` przechodzi (wszystkie testy)
- [ ] `npm run lint` przechodzi

### Dokumentacja

- [ ] `CHANGELOG.md` zaktualizowany
- [ ] `README.md` zaktualizowany (wersja + liczba scenariuszy)
- [ ] `SCENARIO_SCHEMA.md` zaktualizowany (jeśli nowe wzorce)
- [ ] `ROADMAP.md` zaktualizowany (status milestone)

### Finalizacja

- [ ] Wszystkie commity w branchu v0.x.0
- [ ] Branch zmergowany do main
- [ ] Tag v0.x.0 utworzony
- [ ] Push do remote

---

## Znane ryzyka

### Dane scenariusza

- **Nowy format danych** - scenariusz może używać struktur których jeszcze nie obsługujemy
- **Brakujące grafiki** - mogą być odwołania do nieistniejących plików obrazków
- **Błędy w linkach** - złe `nextParagraphId` prowadzące do nieistniejących paragrafów
- **Nowe mechaniki** - scenariusz może wymagać funkcji których jeszcze nie ma

### Game data

- **Duplikaty ID** - nowe items mogą mieć ID kolidujące z istniejącymi
- **Brakujące grafiki** - items/enemies/statuses bez odpowiednich plików PNG
- **Nowe typy enemies** - nowy wróg może mieć inną strukturę action table
- **Zależności między danymi** - scenariusz może wymagać items które nie istnieją w bazie

### Mitygacja

Każdy problem = decyzja: **fix w v0.x.0** lub **odłóż do v0.x.1**

---

## Wskazówki

### Performance

- Grafiki scenariusza: zalecana optymalizacja (WebP lub kompresja JPEG)
- Cover: max 500KB, rozdzielczość dostosowana do UI

### Testowanie

- Zawsze testuj na czystym localStorage (może wpływać na stan gry)
- Testuj na różnych rozdzielczościach (desktop/tablet/mobile)
- Sprawdź scenario w trybie produkcyjnym (`npm run build` + `npm run preview`)

### Git workflow

- Branch naming: `v0.x.0` dla każdej wersji minor
- Commit messages: Conventional Commits (`feat:`, `fix:`, `docs:`)
- Merge strategy: squash commits przed merge do main (opcjonalne)

---

## Template commit messages

```bash
# Faza 1
git commit -m "feat: add {scenario-name} paragraphs and images"
git commit -m "feat: add {enemy-name} enemy with action table"
git commit -m "feat: add new items/symbols/statuses for {scenario-name}"

# Faza 2
git commit -m "feat: integrate {scenario-name} into scenarios index"
git commit -m "feat: add {enemy-name} to enemies data"

# Faza 4
git commit -m "fix: correct paragraph links in {scenario-name}"
git commit -m "fix: add missing images for {scenario-name}"

# Faza 5
git commit -m "docs: finalize v0.x.0 release"
```

---

**Last updated:** v0.3.0 planning (2026-06-28)
