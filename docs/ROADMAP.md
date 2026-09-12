# ROADMAP.md - Horror Stories

Projekt Horror Stories - Aplikacja towarzysząca grze planszowej.

**Ukończone wersje znajdują się w [CHANGELOG.md](CHANGELOG.md)**

---

## Notatki na przyszłość

- **Refactor: zastąpienie wariantów aliasami paragrafów** — obecnie warianty (variants) komplikują edytor i kod. Zamiast tego:
  - Paragraf §100 z wariantami → osobne paragrafy §100a, §100b, §100c
  - Dodanie pola `areChoicesHorizontal` do zwykłych paragrafów (nie tylko wariantów) — przyciski na górze strony zamiast wybory na dole
  - Uproszczenie edytora — jeden widok dla wszystkich paragrafów, bez specjalnego trybu wariantów
  - Lepsza nawigacja — wszystkie "warianty" widoczne w spisie jako aliasy
  - Migracja istniejących scenariuszy (droga-donikad: §15, §36, §100, §105; eksperyment: §1, §5, §9)
  - Breaking change — zaplanować na v0.4.0
- Strona **Wykrywanie problemów** (paragrafy bez połączeń, niedostępne §, brakujące nextParagraphId) — do osobnego milestone'u po v0.2.10
- **Edytor: rzut kostką** — edycja `diceResult` (próg, tekst sukcesu/porażki, docelowe paragrafy); gdy pojawi się pierwszy scenariusz korzystający z tej funkcji
- **Osobne pliki JSON per zasób scenariusza** — zamiast `paragraphs.json` jeden plik per paragraf (`paragraphs/1.json`, `paragraphs/77.json`...); poprawa git diff i DX edytora; wymaga refaktoru loadingu w `index.ts` i ZIP handlera; sensowne przy scenariuszach 200+ paragrafów
- **Cover image support** — umożliwienie definiowania i wyświetlania grafiki okładkowej dla scenariuszy (przełożone z v0.3.1)
- **Code-splitting tras (`React.lazy`)** — `/editor/*` jest importowany statycznie w `App.tsx` i ciągnie za sobą cały pakiet `mermaid` (+ cytoscape, dagre, katex, silniki diagramów) do głównego bundla; gracz, który nigdy nie otwiera edytora, i tak to pobiera. Owinąć `<Editor />` (i ew. inne cięższe strony) w `React.lazy` + `<Suspense>`
- **Ujednolicenie ładowania lokalnych grafik scenariusza** — `contentBlockRenderer.tsx`/`customTagRenderers.tsx` używają `new URL(dynamiczny_template, import.meta.url)`, co jest kruche (patrz kwirk testowy w TESTING_GUIDE.md) i niespójne z podejściem `import.meta.glob` już użytym w `builtinScenarios.ts`; warto zunifikować na jeden, bardziej przewidywalny mechanizm
- **Audyt duplikatów grafik w `droga-donikad/images/`** — kontynuacja porządków z v0.3.3 (znaleziono i scalono już karta-negatywna, karta-gwiazda, rip, rana-ciezka); pozostałe pliki (np. `karta-rozwoju.jpg`) nie zostały jeszcze sprawdzone pod kątem duplikatów ze wspólnymi zasobami (cards/symbols)

---

## Milestone v0.4.0 - Kolejny dzień w pracy (Scenariusz 3)

### Zakres

**Scenariusz "Kolejny dzień w pracy"** — według procesu opisanego w [ADDING_SCENARIO.md](ADDING_SCENARIO.md)

### Status

- ⏳ Planowane (po v0.3.3)

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
