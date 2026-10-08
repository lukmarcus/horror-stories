# Migracja variants → paragrafy z literami (v0.4.1)

Checklist roboczy do Milestone v0.4.1 (zobacz [ROADMAP.md](ROADMAP.md)). Robione ręcznie, jeden paragraf na raz.

Zasada: każdy klucz w `variants` (w kolejności występowania w JSON) → nowy paragraf-dziecko `<parentId><litera>` (a, b, c, ...). `choices[].nextVariantId` → `choices[].nextParagraphId` wskazujący nowy ID. Usunąć pole `variants` z rodzica.

## droga-donikad/paragraphs.json (4 paragrafy z wariantami)

- [x] §9 — warianty: jessica, patrick-lezy, patrick-stoi, patrick → `9j`/`9l`/`9s`/`9p`
- [x] §26 — warianty: jessica, patrick → `26j` (Jessica), `26p` (Patrick)
- [x] §65 — warianty: patrick-leży, patrick-stoi → `65l` (leży), `65s` (stoi)
- [ ] §100 — warianty: klaun, jessica, patrick, graj-dalej (UWAGA: to `DEATH_PARAGRAPH`, chroniony przez `ensureDeath` — tylko samo §100 chronione, dzieci 100a-100d zwykłe)

## eksperyment/paragraphs.json (12 paragrafów z wariantami)

- [ ] §1 — warianty: jeff, nie-jeff, jeff-lezy, jeff-stoi
- [ ] §5 — warianty: y-tak, y-nie
- [ ] §9 — warianty: patrick, nie-patrick, patrick-lezy, patrick-stoi
- [ ] §11 — warianty: ostatni, nie-ostatni
- [ ] §16 — warianty: josh, nie-josh, josh-lezy, josh-stoi
- [ ] §20 — warianty: vii, xvii, xxvi, lvii, xxix
- [ ] §26 — warianty: jessica, nie-jessica, jessica-lezy, jessica-stoi
- [ ] §30 — warianty: z-tak, z-nie
- [ ] §52 — warianty: tak, nie
- [ ] §55 — warianty: nie-margaret, margaret, margaret-lezy, margaret-stoi
- [ ] §73 — warianty: tak-l, nie-l, tak-88, nie-88
- [ ] §77 — warianty: tak-15a, nie-15a

## Status

- Automatyczny skrypt migracji został uruchomiony na próbę i cofnięty (git checkout) — migracja robiona jest ręcznie, paragraf po paragrafie, z potwierdzeniem przed przejściem dalej.
- Ten plik można usunąć po zakończeniu całej migracji (oba scenariusze odhaczone).
