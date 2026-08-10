# Eksperyment - Brakujące grafiki i placeholdery

Data wygenerowania: 2026-08-10

## Podsumowanie

Po weryfikacji z uwzględnieniem refaktoru nazw plików (priorytet: paragraphId → rzymskie → name):

- **Story items:** 6 faktycznie brakujących (nie ma w items.json), 10 przemianowanych (już istnieją)
- **Room items:** 3 faktycznie brakujące (92, 114, 146), 1 istnieje (52)
- **Placeholdery tekstowe:** 9 do zastąpienia

**Łącznie do utworzenia: 9 plików graficznych + 9 tekstów**

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

| ID    | Status      | Paragrafy  |
| ----- | ----------- | ---------- |
| `52`  | ✅ Istnieje | §23, §95   |
| `92`  | ❌ Brakuje  | §103       |
| `114` | ❌ Brakuje  | §103       |
| `146` | ❌ Brakuje  | §104, §110 |

**Faktycznie brakuje: 3 pliki graficzne**

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

## Akcje do wykonania

1. **Dodać do items.json:** 6 story items (vii, xvii, xxvi, lvii, xxix, xv, xviii)
2. **Stworzyć grafiki:** 9 plików (6 story items + 3 room items: 92, 114, 146)
3. **Zastąpić placeholdery:** 9 wystąpień w 8 paragrafach (nazwy kart akcji z dokumentacji gry)
