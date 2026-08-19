# Eksperyment - Brakujące grafiki i placeholdery

Data wygenerowania: 2026-08-20 (aktualizacja: pełne skanowanie po imporcie wszystkich 148 paragrafów)

## Podsumowanie

Po weryfikacji z uwzględnieniem refaktoru nazw plików (priorytet: paragraphId → rzymskie → name):

- **Story items:** 6 faktycznie brakujących (nie ma w items.json), 10 przemianowanych (już istnieją)
- **Room items:** 5 faktycznie brakujących (92, 101, 114, 146, 148), reszta istnieje
- **Statusy:** 2 brakujące (niebieski, czerwony)
- **Placeholdery tekstowe:** 11 do zastąpienia

**Łącznie do utworzenia: 13 plików graficznych (11 items + 2 statusy) + 11 tekstów**

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

Te przedmioty są używane w scenariuszu, ale w ogóle nie istnieją w `items.json`:

| ID      | Status               | Paragrafy |
| ------- | -------------------- | --------- |
| `vii`   | ❌ Brak w items.json | §20       |
| `xvii`  | ❌ Brak w items.json | §20       |
| `xxvi`  | ❌ Brak w items.json | §20       |
| `lvii`  | ❌ Brak w items.json | §20       |
| `xxix`  | ❌ Brak w items.json | §20       |
| `xv`    | ❌ Brak w items.json | §24       |
| `xviii` | ❌ Brak w items.json | §24       |

**Faktycznie brakuje: 6 przedmiotów** (trzeba dodać do items.json i stworzyć grafiki)

## Brakujące grafiki pomieszczeń/przedmiotów (room items)

### ❌ Brakujące pliki

| ID    | Paragrafy                          |
| ----- | ---------------------------------- |
| `92`  | §103                               |
| `101` | §125 (nowy, wykryty po §110)       |
| `114` | §103                               |
| `146` | §104, §110                         |
| `148` | §139, §175 (nowy, wykryty po §110) |

**Faktycznie brakuje: 5 plików graficznych**

### ✅ Istniejące pliki (przykłady nowych wykrytych po §110)

52, 12, 46, 47, 50, 53, 61, 64, 69, 71, 72, 84, 85, 106, 112, 118, 119, 120, 121, 123, 139, 147, 222

## Brakujące statusy (status items)

| ID          | Paragrafy |
| ----------- | --------- |
| `niebieski` | §157      |
| `czerwony`  | §193      |

**Faktycznie brakuje: 2 pliki graficzne statusów**

**Istniejące:** zielony

## Placeholdery tekstowe do zastąpienia

### §4

- **Placeholder:** `XXXXXXXXXXXXXXXXXXXXXXXXXX`
- **Kontekst:** "Wtasuj XXXXXXXXXXXXXXXXXXXXXXXXXX do swojej talii."
- **Prawdopodobnie:** Nazwa karty akcji

### §5

- **Placeholder:** `YYYYYYYYYYYYYYYYYYYYYY`
- **Kontekst:** "Dodaj dwie YYYYYYYYYYYYYYYYYYYYYY do swojego stosu odrzuconego"
- **Prawdopodobnie:** Nazwa karty akcji

### §10

- **Placeholder:** `ZZZZZZZZZZZZZZZZZZZZZZ`
- **Kontekst:** "Każda postać dodaje do swojego stosu odrzuconego jedną ZZZZZZZZZZZZZZZZZZZZZZ"
- **Prawdopodobnie:** Nazwa karty akcji

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

1. **Dodać do items.json:** 6 story items (vii, xvii, xxvi, lvii, xxix, xv, xviii)
2. **Stworzyć grafiki:** 13 plików
   - Story items: 6 (vii, xvii, xxvi, lvii, xxix, xv, xviii)
   - Room items: 5 (92, 101, 114, 146, 148)
   - Statusy: 2 (niebieski, czerwony)
3. **Zastąpić placeholdery:** 11 wystąpień w 10 paragrafach (nazwy kart akcji z dokumentacji gry)
