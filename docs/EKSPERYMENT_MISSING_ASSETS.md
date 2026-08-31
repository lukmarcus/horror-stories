# Eksperyment - Brakujące grafiki i placeholdery

Data wygenerowania: 2026-08-20  
**Ostatnia aktualizacja: 2026-09-01**

## Podsumowanie

Po dodaniu nowych grafik (2026-08-26) i weryfikacji (2026-09-01):

- **Story items:** ✅ Wszystkie dodane (vii, xxvi, lvii, xxix, xv, xviii, xvii)
- **Room items:** ✅ Wszystkie dodane (92, 101, 114, 146, 148)
- **Statusy:** ✅ Wszystkie dodane (niebieski, czerwony)
- **Karty:** ✅ 3 karty dodane (zatrucie, krwawienie, zranienie)
- **Placeholdery tekstowe:** 8 pozostałych do zastąpienia (3 zastąpione kartami)

**Łącznie pozostało: 8 tekstów do zastąpienia**

## Brakujące grafiki przedmiotów (story items)

### ✅ Pliki przemianowane podczas refaktoru (już istnieją)

Te przedmioty mają grafiki pod nazwami z `paragraphId` (priorytet: paragraphId → liczby rzymskie → name):

| ID     | Plik         | Paragrafy |
| ------ | ------------ | --------- |
| `xlix` | `21.jpg` ✅  | §4, §21   |
| `li`   | `124.jpg` ✅ | §5        |
| `liv`  | `76.jpg` ✅  | §7, §28   |
| `lv`   | `59.jpg` ✅  | §7, §28   |
| `lii`  | `63.jpg` ✅  | §29       |
| `xlv`  | `43.jpg` ✅  | §15, §43  |
| `xxiv` | `222.jpg` ✅ | §44, §70  |
| `xiii` | `48.jpg` ✅  | §24, §49  |
| `xiv`  | `61.jpg` ✅  | §24       |
| `xvii` | `84.jpg` ✅  | §20       |

### ❌ Naprawdę brakujące (nie ma w items.json)

_Wszystkie brakujące przedmioty zostały dodane! ✅_

### ✅ Dodane (2026-08-26, 2026-08-31)

| ID      | Plik          | Status | Paragrafy |
| ------- | ------------- | ------ | --------- |
| `xv`    | `92.jpg` ✅   | Dodane | §24       |
| `xviii` | `114.jpg` ✅  | Dodane | §24       |
| `vii`   | `vii.jpg` ✅  | Dodane | §20       |
| `xxvi`  | `xxvi.jpg` ✅ | Dodane | §20       |
| `lvii`  | `lvii.jpg` ✅ | Dodane | §20       |
| `xxix`  | `xxix.jpg` ✅ | Dodane | §20       |

## Brakujące grafiki pomieszczeń/przedmiotów (room items)

### ✅ Wszystkie dodane (2026-08-26)

| ID    | Status    | Paragrafy                          |
| ----- | --------- | ---------------------------------- |
| `92`  | ✅ Dodane | §103                               |
| `101` | ✅ Dodane | §125 (nowy, wykryty po §110)       |
| `114` | ✅ Dodane | §103                               |
| `146` | ✅ Dodane | §104, §110                         |
| `148` | ✅ Dodane | §139, §175 (nowy, wykryty po §110) |

**Wszystkie room items kompletne! ✅**

### ✅ Istniejące pliki (przykłady nowych wykrytych po §110)

52, 12, 46, 47, 50, 53, 61, 64, 69, 71, 72, 84, 85, 106, 112, 118, 119, 120, 121, 123, 139, 147, 222

## Brakujące statusy (status items)

### ✅ Wszystkie dodane (2026-08-26)

| ID          | Status    | Paragrafy |
| ----------- | --------- | --------- |
| `niebieski` | ✅ Dodane | §157      |
| `czerwony`  | ✅ Dodane | §193      |

**Wszystkie statusy kompletne! ✅**

**Istniejące:** zielony, niebieski, czerwony

## Placeholdery tekstowe do zastąpienia

### ✅ §4 - Zastąpione

- **Było:** `XXXXXXXXXXXXXXXXXXXXXXXXXX`
- **Teraz:** zatrucie
- **Kontekst:** "Wtasuj zatrucie do swojej talii."

### ✅ §5 - Zastąpione

- **Było:** `YYYYYYYYYYYYYYYYYYYYYY`
- **Teraz:** krwawienie
- **Kontekst:** "Dodaj dwie krwawienie do swojego stosu odrzuconego"

### ✅ §10 - Zastąpione

- **Było:** `ZZZZZZZZZZZZZZZZZZZZZZ`
- **Teraz:** zranienie
- **Kontekst:** "Każda postać dodaje do swojego stosu odrzuconego jedną zranienie"

### §19

- **Placeholder:** `AAAAAAAAAAAAAAAAA`
- **Kontekst:** "dodaj do swojego stosu odrzuconego trzy karty AAAAAAAAAAAAAAAAA"
- **Prawdopodobnie:** Nazwa karty akcji

### §27

- **Placeholder 1:** `CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC`
- **Kontekst:** Obrazek planszętki przeciwnika
- **Prawdopodobnie:** Grafika enemy
- **Placeholder 2:** `DDDDDDDDDDDDDDDDDDDDDDDDD`
- **Kontekst:** Żeton przypominający
- **Prawdopodobnie:** Grafika letter/symbol

### §52

- **Placeholder:** `DDDDDDDDDDDDDDD` (2 wystąpienia)
- **Kontekst:** "Czy masz DDDDDDDDDDDDDDD?" oraz "Odrzuć DDDDDDDDDDDDDDD z talii"
- **Prawdopodobnie:** Nazwa karty akcji lub przedmiotu

### §93

- **Placeholder:** `FFFFFFFFFFFF`
- **Kontekst:** "Dodaj z puli ogólnej FFFFFFFFFFFF do swojego stosu odrzuconego"
- **Prawdopodobnie:** Nazwa karty akcji

### §103

- **Placeholder:** `FFFFFFFFFFFFFFFFFF`
- **Kontekst:** "Dodaj również do swojego stosu odrzuconego FFFFFFFFFFFFFFFFFF (robi Ci się niedobrze)"
- **Prawdopodobnie:** Nazwa karty akcji

### §128

- **Placeholder:** `FFFFFFFFFFFFFFFFF`
- **Kontekst:** "Dodaj FFFFFFFFFFFFFFFFF do swojego stosu odrzuconego" (po dobraniu przedmiotu 61 lub 101)
- **Prawdopodobnie:** Nazwa karty akcji (inny placeholder F!)

### §221

- **Placeholder:** `GGGGGGGGGGGGGGGGGGGGG`
- **Kontekst:** "Dodaj do stosu odrzuconego jedną GGGGGGGGGGGGGGGGGGGGG"
- **Prawdopodobnie:** Nazwa karty akcji

## Akcje do wykonania

### ✅ Zakończone (2026-08-26)

1. ~~**Dodać do items.json:** 2 story items (xv, xviii)~~ ✅ + **xvii (weryfikacja 2026-08-27: już istniał jako 84.jpg)** ✅
2. ~~**Stworzyć grafiki:**~~ ✅
   - ~~Room items: 5 (92, 101, 114, 146, 148)~~ ✅
   - ~~Statusy: 2 (niebieski, czerwony)~~ ✅

### ❌ Pozostało do zrobienia

1. **Dodać do items.json:** 4 story items (vii, xxvi, lvii, xxix)
2. **Stworzyć grafiki:** 4 pliki (vii, xxvi, lvii, xxix)
3. **Zastąpić placeholdery:** 11 wystąpień w 10 paragrafach (nazwy kart akcji z dokumentacji gry)
