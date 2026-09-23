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
- **Niepotrzebny podwójny cast w `Game.tsx`** — `.filter(Boolean as unknown as <T>(v: T | undefined) => v is T)`; zastąpić czytelnym type guardem
- **Zdublowana logika rzutu kością** — ten sam wzorzec `Math.floor(Math.random() * 6) + 1` w `hooks/useDiceRoll.ts` i `EnemyView.tsx` (`rollActionDice`); wydzielić do `src/utils/diceRoll.ts`
- **Podwójny cast w `editorReducer.ts`** — `action.payload as unknown as Record<string, unknown>`; wymaga przejrzenia typów akcji, żeby zrobić to porządnie (nie 5-minutowa poprawka)
- **Non-null assertion `state.scenario!.meta`** w kilku miejscach edytora (`EnemyMetaEditor.tsx`, `ScenarioMetaForm.tsx`) — prawdopodobnie bezpieczne, ale kontrakt nie został do końca zweryfikowany

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
