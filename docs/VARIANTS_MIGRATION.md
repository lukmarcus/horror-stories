# Migracja variants → paragrafy z literami (v0.4.1)

Checklist roboczy do Milestone v0.4.1 (zobacz [ROADMAP.md](ROADMAP.md)). Robione ręcznie, jeden paragraf na raz.

Zasada: każdy klucz w `variants` (w kolejności występowania w JSON) → nowy paragraf-dziecko `<parentId><litera>` (a, b, c, ...). `choices[].nextVariantId` → `choices[].nextParagraphId` wskazujący nowy ID. Usunąć pole `variants` z rodzica.

## droga-donikad/paragraphs.json (4 paragrafy z wariantami)

- [x] §9 — warianty: jessica, patrick-lezy, patrick-stoi, patrick → `9j`/`9l`/`9s`/`9p`
- [x] §26 — warianty: jessica, patrick → `26j` (Jessica), `26p` (Patrick)
- [x] §65 — warianty: patrick-leży, patrick-stoi → `65l` (leży), `65s` (stoi)
- [x] §100 — warianty: klaun, jessica, patrick, graj-dalej → `100k`/`100j`/`100p`/`100g`

**droga-donikad: 4/4 gotowe ✅**

## eksperyment/paragraphs.json (12 paragrafów z wariantami)

- [x] §1 — warianty: jeff, nie-jeff, jeff-lezy, jeff-stoi → `1i`/`1l`/`1s`/`1j`
- [x] §5 — warianty: y-tak, y-nie → `5t` (y-tak), `5n` (y-nie)
- [x] §9 — warianty: patrick, nie-patrick, patrick-lezy, patrick-stoi → `9i`/`9p`/`9l`/`9s`
- [x] §11 — warianty: ostatni, nie-ostatni → `11t`/`11n`
- [x] §16 — warianty: josh, nie-josh, josh-lezy, josh-stoi → `16i`/`16j`/`16l`/`16s`
- [ ] §20 — warianty: vii, xvii, xxvi, lvii, xxix
- [x] §26 — warianty: jessica, nie-jessica, jessica-lezy, jessica-stoi → `26i`/`26j`/`26l`/`26s`
- [x] §30 — warianty: z-tak, z-nie → `30t`/`30n`
- [x] §52 — warianty: tak, nie → `52t`/`52n`
- [x] §55 — warianty: nie-margaret, margaret, margaret-lezy, margaret-stoi → `55i`/`55m`/`55l`/`55s`
- [ ] §73 — warianty: tak-l, nie-l, tak-88, nie-88
- [x] §77 — warianty: tak-15a, nie-15a → `77t`/`77n`

## Status

- Automatyczny skrypt migracji został uruchomiony na próbę i cofnięty (git checkout) — migracja robiona jest ręcznie, paragraf po paragrafie, z potwierdzeniem przed przejściem dalej.
- Ten plik można usunąć po zakończeniu całej migracji (oba scenariusze odhaczone).

## Potencjalne duplikaty treści w eksperyment (NIE w zakresie tej migracji)

Znalezione przy okazji przeglądu — osobne, stałe numery paragrafów (zgodne z fizycznymi komponentami gry planszowej) o bardzo podobnej/prawie identycznej treści, osiągane różnymi wyborami przedmiotu z tego samego rodzica. To NIE jest mechanizm `variants`/`nextVariantId` i scalenie ich złamałoby zgodność z fizycznymi numerami paragrafów — do ewentualnego rozważenia osobno jako redukcja duplikacji treści, nie jako migracja wariantów:

- §42/§66/§75 — otwieranie drzwi §118 różnymi narzędziami (mop/broń/pięść), niemal identyczny tekst o "zgrzycie" drzwi
- §32/§105 — rozpoznanie dłoni Jacka vs Lauren przez panel (różne litery AKTYWNE)
- §90/§109/§185/§220 — schemat "przyłóż dłoń naukowca do panelu" (4x)
- §151/§152 — zniszczenie kratki łomem vs bronią
- §57/§96 — identyczny opis planszy 10a
- §36/§127 — niemal identyczny opis planszy 15a (drzwi wyjściowe)
- §7/§28 — podobny opis planszy 8a (pokój z monitorami)
- §25/§108 — podobny opis planszy 6a (kuchnia)

## Sprawdzone: wzorzec "Jeśli X, zrób Y" (potencjalny spoiler drugiej gałęzi)

Przejrzano wszystkie 64 wystąpienia słowa "Jeśli" w eksperyment pod kątem miejsc, gdzie jeden paragraf opisuje OBIE gałęzie (tak/nie) w prozie zamiast jawnego wyboru Tak/Nie — co ujawniałoby graczowi treść niewłaściwej gałęzi niezależnie od stanu gry. **Nie znaleziono nowych kandydatów** poza już znanymi wariantami (§5, §30 — litera na torze czasu/AKTYWNE). Pozostałe wystąpienia to:
- ugruntowany, powtarzający się mechanizm "Sprawdź rzymską cyfrę przedmiotu..." (gracz sam zadeklarował przedmiot, więc zna odpowiedź — brak spoilera)
- jednostronne warunki "jeśli X, przejdź do Y" bez opisanej gałęzi przeciwnej (np. §32, §105, §137, §192 — zwykła instrukcja porządkowa po już wybranej ścieżce)

