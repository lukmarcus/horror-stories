# ROADMAP.md - Horror Stories

Projekt Horror Stories - Aplikacja towarzysząca grze planszowej.

**Ukończone wersje znajdują się w [CHANGELOG.md](CHANGELOG.md)**

---

## Notatki na przyszłość

- Strona **Wykrywanie problemów** (paragrafy bez połączeń, niedostępne §, brakujące nextParagraphId) — do osobnego milestone'u po v0.2.10
- **Edytor: rzut kostką** — edycja `diceResult` (próg, tekst sukcesu/porażki, docelowe paragrafy); gdy pojawi się pierwszy scenariusz korzystający z tej funkcji
- **Osobne pliki JSON per zasób scenariusza** — zamiast `paragraphs.json` jeden plik per paragraf (`paragraphs/1.json`, `paragraphs/77.json`...); poprawa git diff i DX edytora; wymaga refaktoru loadingu w `index.ts` i ZIP handlera; sensowne przy scenariuszach 200+ paragrafów

---

## Milestone v0.3.0 - Party Time (Scenariusz 1)

### Filozofia

Każda wersja 0.x.0 = **1 nowy scenariusz** + bugfixy + małe ulepszenia.

**📋 Pełny przewodnik:** [ADDING_SCENARIO.md](ADDING_SCENARIO.md) - szczegółowe checklisty i instrukcje

---

### Zakres v0.3.0

**Główny cel: Import i integracja scenariusza "Party time"**

**5 faz realizacji:**

1. **Przygotowanie danych** (2-3h) - import JSON, grafik, enemies, items
2. **Integracja kodu** (30-60min) - dodanie do `scenarios/index.ts`, `enemies/index.ts`
3. **Testowanie mechanik** (1-2h) - gameplay testing, weryfikacja grafik
4. **Bugfixy** (zależnie od znalezionych) - naprawa problemów
5. **Dokumentacja** (30min) - CHANGELOG, README

Szczegóły każdej fazy w [ADDING_SCENARIO.md](ADDING_SCENARIO.md)

---

### Progress Tracking

- [x] Faza 0: Planowanie ✅
- [x] Dane: Alfabet A-Z (letters.json + 26 PNG) ✅
- [x] Dane: Items (roomItems.json + storyItems.json) ✅
- [ ] Faza 1: Przygotowanie danych ⏳
- [ ] Faza 2: Integracja kodu
- [ ] Faza 3: Testowanie mechanik
- [ ] Faza 4: Bugfixy
- [ ] Faza 5: Dokumentacja

**Status:** 🚧 W trakcie realizacji (2026-07-01) - Faza 1: Przygotowanie danych

---

### Checklist gotowości do release

Pełny checklist w [ADDING_SCENARIO.md](ADDING_SCENARIO.md#checklist-gotowości-do-release)

**Quick check:**

- [ ] Scenariusz ukończalny (start → §100)
- [ ] Wszystkie grafiki się wczytują
- [ ] `npm run build` + `npm test` + `npm run lint` ✅
- [ ] Dokumentacja zaktualizowana
- [ ] Branch zmergowany do main
- [ ] Tag v0.3.0 utworzony

---

## Milestone v0.4.0 - Eksperyment (Scenariusz 2)

### Zakres

Ten sam proces co v0.3.0 - szablon w [ADDING_SCENARIO.md](ADDING_SCENARIO.md)

### Status

- ⏳ Oczekuje na v0.3.0

---

## Milestone v0.5.0+ - Kolejne scenariusze

**Kolejność (wstępna):**

- v0.5.0: Kolejny dzień w pracy (Scenariusz 3)
- v0.6.0: Śmiertelna zabawa (Scenariusz 4)
- v0.7.0: Świnki trzy i wilk (Scenariusz 5)
- v0.8.0: Do samego końca (Scenariusz 6)
- v0.9.0: (Nie) jesteśmy tu sami (Scenariusz 7)
- v0.10.0: Spotkanie (Scenariusz 8)
- v1.0.0: Production Ready + polish

**Features do rozważenia między wersjami:**

- Cover image support (v0.4.x lub v0.5.x)
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
