# Eksperyment - Brakujące grafiki i placeholdery

Data wygenerowania: 2026-08-20  
**Ostatnia aktualizacja: 2026-09-06**

## Podsumowanie

Po dodaniu nowych grafik (2026-08-26) i weryfikacji (2026-09-01, 2026-09-06):

- **Story items:** ✅ Wszystkie dodane (vii, xxvi, lvii, xxix, xv, xviii, xvii)
- **Room items:** ✅ Wszystkie dodane (92, 101, 114, 146, 148)
- **Statusy:** ✅ Wszystkie dodane (niebieski, czerwony)
- **Karty:** ✅ 3 karty dodane (zatrucie, krwawienie, zranienie) + 3 karty bazowe (0/1/2 gwiazdek)
- **Placeholdery tekstowe:** 1 pozostały do zastąpienia (10 zastąpionych)
- **setup.json:** ✅ nie był objęty tym dokumentem — brakujące karty gwiazdkowe w talii startowej znalezione i uzupełnione

**Łącznie pozostało: 1 tekst do zastąpienia**

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
- **Teraz:** `<card id="zatrucie"/>`
- **Kontekst:** "Wtasuj `<card id="zatrucie"/>` do swojej talii."

### ✅ §5 - Zastąpione

- **Było:** `YYYYYYYYYYYYYYYYYYYYYY`
- **Teraz:** `<card id="krwawienie"/>`
- **Kontekst:** "Dodaj dwie `<card id="krwawienie"/>` do swojego stosu odrzuconego"

### ✅ §10 - Zastąpione

- **Było:** `ZZZZZZZZZZZZZZZZZZZZZZ`
- **Teraz:** `<card id="zranienie"/>`
- **Kontekst:** "Każda postać dodaje do swojego stosu odrzuconego jedną `<card id="zranienie"/>`"

### ✅ §19 - Zastąpione

- **Było:** `AAAAAAAAAAAAAAAAA`
- **Teraz:** `<card id="zranienie"/>` (3 karty)
- **Kontekst:** "dodaj do swojego stosu odrzuconego trzy karty `<card id="zranienie"/>`"

### §27

- **Placeholder 1:** ✅ Zastąpiony — `<image id="wilkolak"/>` (grafika planszetki przeciwnika)
- **Placeholder 2:** `DDDDDDDDDDDDDDDDDDDDDDDDD`
- **Kontekst:** Żeton przypominający
- **Prawdopodobnie:** Grafika letter/symbol

### ✅ setup.json - Zastąpione (2026-09-06, nie było w tym pliku)

- **Było:** "DLA KAŻDEJ Z POSTACI SFORMUJ TALIĘ:  2 x , 2 x , 2 x ." (puste miejsca po kartach)
- **Teraz:** `2 x <card id='0-gwiazdek'/>, 2 x <card id='1-gwiazdka'/>, 2 x <card id='2-gwiazdki'/>`
- **Kontekst:** Startowa talia postaci — ten sam wzorzec co w droga-donikad

### ✅ §52 - Zastąpione

- **Było:** `DDDDDDDDDDDDDDD` (2 wystąpienia)
- **Teraz:** `<card id="zatrucie"/>`
- **Kontekst:** "Czy masz `<card id="zatrucie"/>`?" oraz "Odrzuć `<card id="zatrucie"/>` z talii"

### ✅ §93 - Zastąpione

- **Było:** `FFFFFFFFFFFF`
- **Teraz:** `<card id="zranienie"/>`
- **Kontekst:** "Dodaj z puli ogólnej `<card id="zranienie"/>` do swojego stosu odrzuconego"

### ✅ §103 - Zastąpione

- **Było:** `FFFFFFFFFFFFFFFFFF`
- **Teraz:** `<card id="zatrucie"/>`
- **Kontekst:** "Dodaj również do swojego stosu odrzuconego `<card id="zatrucie"/>` (robi Ci się niedobrze)"

### ✅ §128 - Zastąpione

- **Było:** `FFFFFFFFFFFFFFFFF`
- **Teraz:** `<card id="zatrucie"/>`
- **Kontekst:** "Dodaj `<card id="zatrucie"/>` do swojego stosu odrzuconego" (po dobraniu przedmiotu 61 lub 101)

### ✅ §221 - Zastąpione

- **Było:** `GGGGGGGGGGGGGGGGGGGGG`
- **Teraz:** `<card id="zatrucie"/>`
- **Kontekst:** "Dodaj do stosu odrzuconego jedną `<card id="zatrucie"/>`"

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
