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
- [x] §20 — warianty: vii, xvii, xxvi, lvii, xxix → `20a`(vii)/`20b`(xvii)/`20c`(xxvi)/`20d`(xxix)/`20e`(lvii), litery i kolejność wg rosnącej wartości rzymskiej
- [x] §26 — warianty: jessica, nie-jessica, jessica-lezy, jessica-stoi → `26i`/`26j`/`26l`/`26s`
- [x] §30 — warianty: z-tak, z-nie → `30t`/`30n`
- [x] §52 — warianty: tak, nie → `52t`/`52n`
- [x] §55 — warianty: nie-margaret, margaret, margaret-lezy, margaret-stoi → `55i`/`55m`/`55l`/`55s`
- [x] §73 — warianty: tak-l, nie-l, tak-88, nie-88 → `73l`/`73b`/`73t`/`73n`
- [x] §77 — warianty: tak-15a, nie-15a → `77t`/`77n`

**eksperyment: 12/12 gotowe ✅**

## Podsumowanie

**Migracja danych zakończona: 16/16 paragrafów, oba scenariusze.** Oba pliki `paragraphs.json` są w pełni wolne od `variants`/`nextVariantId` (zweryfikowane grepem), 776/776 testów przechodzi. Plik NIE do usunięcia jeszcze — patrz sekcja "Poprawki anty-spoilerowe" poniżej (kontekst od autora: warianty były pierwotnie dodawane ręcznie tam, gdzie pomagały uniknąć spoilowania, ale autor przestał to robić w pewnym momencie z braku czasu — poniższa lista to dokończenie tej roboty, inną metodą: literowe paragrafy zamiast starego mechanizmu `variants`).

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

## Poprawki anty-spoilerowe (zgłoszone przez autora, do zrobienia)

### Do pełnego rozbicia na jawne Tak/Nie (jak §73 → `73t`/`73n`)

Ten sam mechanizm "czy pozostałe litery już AKTYWNE / na torze czasu" co w §73 (który miał `variants` i już go rozbiliśmy), ale tu zapisany jako zwykła proza "Jeśli już..., przejdź do X" zamiast jawnego pytania — przez co zawsze ujawnia regułę niezależnie od stanu gry:

- [x] §32 — czy w AKTYWNE jest już litera e, d lub p → `32t`/`32n`
- [x] §105 — czy w AKTYWNE jest już litera e, d lub f → `105t`/`105n`
- [x] §137 — czy w AKTYWNE jest już litera d, p lub f → `137t`/`137n` (osobno od istniejącej, niezmienionej logiki "czy wskazano I")
- [x] §192 — czy litera g jest już na torze czasu → `192t`/`192n`. Zaktualizowano accessibleFrom §88: dodano `32t`, `105t`, `137t`.

### Do prostszej poprawki (edycja tekstu, bez tworzenia nowych paragrafów)

- [ ] §98 — usunąć zbędny dopisek "(UWAGA: jeśli jesteś ostatnią figurką...)" z tekstu wyboru — to duplikat tego, co już poprawnie robi §11 (pyta Tak/Nie i dopiero wtedy ujawnia konsekwencję)
- [ ] §160 — zmienić opisy `choices`, żeby nie zdradzały z góry progu/wyniku testu (wynik i tak trafia do podparagrafu §2, gdzie jest opisany)
- [ ] §143 — jak §160, sam tekst strony zdradza próg testu przed rzutem

### Zgłoszone jako spoiler — do dalszej analizy i poprawki

- [ ] §119 — spoiler z wynikiem przesuwania regału (choice zdradza, że za regałem coś jest, zanim gracz spróbuje)
- [ ] §118 — spoiler (do ustalenia dokładnej poprawki)
- [ ] §113 — spoiler wynikowy (do ustalenia dokładnej poprawki)

### Zweryfikowane jako OK — bez zmian

- §149, §136, §135 — ugruntowany wzorzec "deklarujesz przedmiot, potem efekt" — gracz sam zadeklarował przedmiot, więc zna odpowiedź przed czytaniem, brak spoilera
- §191, §192(choices z §100) — już poprawnie osobne, realne paragrafy osiągane przez jawny wybór
