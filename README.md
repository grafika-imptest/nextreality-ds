# NEXT Reality – jednotný design system (HTML předloha)

Předloha pro vývoj, ne produkční kód. Vývoj ji přepíše do CMS (RealEstateOffice) podle sebe.
Zdroj pravdy = `site/tokens.css`. Figma se nepoužívá.

Náhled: `node dev.js` → http://localhost:5194/prehled.html (rozcestník předlohy)
- `styleguide.html` knihovna komponent se všemi stavy · `predani.html` pravidla pro vývoj + export tokens.json · `porovnani.html` automatické porovnání barevných variant
- `index.html` homepage · `vypis.html` výpis (seznam / mapa) · `detail.html` detail nemovitosti
- `prodat.html` chci prodat + průvodce odhadem · `makleri.html` · `makler.html?slug=zdenek-kubat` · `projekty.html` · `projekt.html` · `kontakty.html` · `404.html` (`?variant=sold` = nemovitost už není v nabídce; neexistující adresa vrací 404.html)
- `?office=tgh | stars | test` – přepnutí kanceláře (drží se i při proklikávání)
- `?clean` – bez kontrolního panelu a cookie lišty (pro screenshoty)
- výpis bere filtry z URL: `type, deal, loc, disp, pmin, pmax, area, sort, view=map, status=sold, page`
- panel „Předloha · kontrola“ vpravo nahoře: kancelář, stav cookies, překryv mřížky, tlačítka na knihovnu komponent / pravidla / porovnání / přehled, živé měření přejímacích kritérií
- `?grid` – zapne překryv 12sloupcové mřížky

Obnovení dat: `node tools/fetch-listings.mjs` (nabídky TGH a Stars z endpointu mapy výpisu) a `node tools/fetch-phase3.mjs` (makléři, detail makléře, projekty, pobočky).

## Soubory
| Soubor | Obsah |
|---|---|
| `site/tokens.css` | barvy, typografie (mobil / tablet / desktop), odsazení, rádiusy, stíny, proměnné kanceláří |
| `site/components.css` | základní komponenty (tlačítka, pole, karta nemovitosti, hlavička, patička, cookies…) |
| `site/pages.css` | komponenty výpisu a detailu (filtry, mapa, stránkování, galerie, PENB, lepící lišta…) |
| `site/core.js` | společné: ikonová sada, hlavička/patička, cookies, karta nemovitosti, přepínač kanceláře, kontrola kritérií |
| `site/home.js` · `listing.js` · `detail.js` · `prodat.js` | logika stránek (menší stránky mají skript přímo v HTML) |
| `site/data.js` | obsah homepage kanceláří (makléři, reference, projekty) |
| `site/data/*-listings.js` | reálné nabídky s GPS: TGH 238 aktivních, Stars 68 aktivních + 184 realizovaných |
| `site/data/detail-bzany.js` | reálná zakázka N119591 (TGH) – 29 fotek + video, parametry, PENB, popis, makléř |
| `site/data/phase3.js` | makléři TGH (33 ze 7 kanceláří) a Stars (7), detail makléře, 16 projektů TGH, 7 poboček TGH |
| `site/data/phase3-manual.js` | ručně převzaté texty: bio Zdeňka Kubáta, detail projektu Musílkova 39 |
| `tools/*.mjs` | stahovací skripty dat; `peek.mjs` = rychlý výpis textu stránky |

## Stav
- [x] Fáze 0 – re-audit živých webů
- [x] Fáze 1 – tokeny + homepage (375 / 768 / 1440) – schváleno 6. 10. 2026
- [x] Fáze 2 – výpis (seznam + mapa, filtry, prázdný stav, realizované), detail nemovitosti – schváleno 6. 10. 2026
- [x] Fáze 3 – chci prodat (průvodce odhadem), makléři, detail makléře, projekty + detail, kontakty, 404 / už není v nabídce – schváleno 6. 10. 2026
- [x] Fáze 4 – knihovna komponent, druhá barevná varianta + porovnání, klikací prototyp hlavní cesty, pravidla pro vývoj ← **čeká na schválení**

## Re-audit 6. 10. 2026 (zadání je ze srpna)
| Zjištění | Dopad |
|---|---|
| TGH, Stars i Dynamic mají stále root 8,4 px při 1440 px (H1 37 / 50 / 50 px) | problém ze zadání trvá |
| **Všechny tři kanceláře mají stejné barvy** (zelená #85B929, modrá #3187AA) | „přebarvení na kancelář“ v praxi = logo + fotka + kontakty. Proměnné barev nechávám, varianta `test` dokazuje, že fungují |
| **Brand zelená s bílým textem má kontrast 2,3:1, modrá 4,1:1** – obojí pod WCAG AA | pro tlačítka ztmaveno na #4E7D12 (4,9:1) a #22729A (5,3:1); originály jen pro dekor. **Nutné odsouhlasit s majitelem značky** |
| TGH homepage nemá výpis nemovitostí vůbec | v novém systému nabídka hned pod hero |
| Výpis TGH na 1440×900: nad ohybem jen filtr, žádná nemovitost | vyřešeno – viz kritéria níže |
| Tlačítka všude VERZÁLKAMI | zadání: verzálky jen na štítky → tlačítka normálně |
| Garáž Meziboří: stav v CRM „Volný“, ve fotce vpálené „REZERVACE“ | datová kvalita – předat kanceláři |
| TGH na webu nemá adresu ani telefon kanceláře | šablona musí blok kontaktu umět bez nich |
| **PENB na detailu TGH už je** (třída, kWh/m²/rok, PDF) – zadání tvrdí „nenalezen“ | data existují, jen se nově zobrazí jako stupnice |
| **Video je v galerii TGH už jako první položka** (Vimeo) | zachováno, v mozaice je video hlavní dlaždice |
| **TGH a Stars běží na dvou různých šablonách** (jiné značkování výpisu i markerů mapy) | potvrzuje důvod zadání – dnes jde o 2 kódové báze |
| CMS generuje jen pevné velikosti obrázků: karta 549×480 (TGH) / **480×240 (Stars, 2:1, nízké rozlišení)**, galerie **jen 1920×1440 (~700 kB)** | **požadavek na vývoj:** náhledy 4:3 (např. 400×300, 800×600) a webp; dnes mozaika detailu stahuje 5 × 700 kB |
| Mapa výpisu TGH vrací 238 nabídek, web uvádí 258 | pravděpodobně ~20 nabídek bez GPS → v mapě chybí. Ověřit v CRM |
| **„Online odhad“ je na každém webu jiný: TGH = obecný kontaktní formulář (jméno, telefon, e-mail, zpráva), Stars = strukturovaný formulář (typ, dispozice, plochy, stav, konstrukce, vlastnictví, adresa, typ ocenění), Dynamic = widget třetí strany (cemap.cz)** | zadání předpokládá „máme na všech třech webech“ – reálně 3 různá řešení. Předloha sjednocuje na průvodce podle pole Stars; **žádný web cenu automaticky nepočítá** – výsledkem je poptávka pro makléře |
| Formulář Stars má překlepy v číselnících („Monotovaná“, „Dřevená“), projekty TGH „3 nadzemní podaží“ | opravit v CMS (v předloze opraveno) |
| TGH: duplicitní profily makléřů se stejným telefonem (Tomáš Böhm STYLE / Tomáš Böhm, DiS.; Ladislav Nedvěd / Ladislav Nedvěd STYLE) | datová kvalita – předat TGH; předloha je zobrazuje tak, jak jsou |
| TGH je holding 7 kanceláří (Style, Vision, Bridge, Capital, Horizont, Heroes, Victory); pobočky nemají v CMS souřadnice ani telefon | kontakty bez mapy, s odkazem „Navigovat“ na Mapy.cz. V patičce TGH je kontakt +420 800 700 099 / style@nextreality.cz – nejasné, komu patří, proto ho předloha nepoužívá |
| Detail makléře TGH má 20 odkazů na nemovitosti, z toho 12 je v aktivní nabídce | zbytek pravděpodobně realizované / stažené – CRM by mělo stav posílat |
| **Blog TGH**: 4 články, žádný nemá fotku, všechny s datem 13. 2. 2025, „nejaktuálnější“ článek popisuje trendy roku 2023 | obsahově zastaralé; karta článku má brandový prázdný stav místo šedého „noimage“ |
| Štítek stavu „Volný“ měl kontrast 4,49 : 1 (pod AA pro 12 px) | zjištěno živým měřením v knihovně, ztmaveno na #256B29 (5,7 : 1) |
| CRM posílá „Plocha pozemku: 528“ bez jednotky; u pozemků názvy typu „Perštejn,Chomutov,Ústecký kraj“ bez mezer | šablona musí jednotky doplňovat sama; nekonzistence názvů předat CRM |

## Rozhodnutí v předloze (odchylky od zadání)
1. **Odsazení**: do škály doplněny 20 a 40 px (okraje stránky 20 / 32 / 40 ze zadání ve škále nebyly).
2. **Tablet 768–1279** doplněn (zadání mělo jen mobil a desktop): hero 40/48, H1 34/42, H2 28/36, H3 22/30.
3. **Karta nemovitosti**: CRM název je v kartě jako popisek max. 2 řádky (`line-clamp`), plný text v `title`.
   Nadpisem karty je lokalita, nad ní štítky parametrů. Cena a lokalita mají pevné pozice → stejná výška karet v řadě (ověřeno měřením: 490 reálných karet TGH + Stars vč. realizovaných na 1440 px = 123 řad, žádná s rozdílnou výškou; nejdelší název: „Prodej komerčních prostor činžovní dům 660 m², Vaněčkova, Benátky nad Jizerou-Benátky nad Jizerou I“).
   V předloze se parametry parsují z názvu (`tools/fetch-listings.mjs`) – **produkce je musí brát z polí CRM**.
4. **Pronájem**: k ceně „/ měsíc“ + štítek „Pronájem“.
5. **Hodnocení**: jedna hvězda + číslo místo 5 plných hvězd.
6. **Cookie lišta**: „Odmítnout vše“ a „Povolit vše“ stejná komponenta vedle sebe. Po odmítnutí se místo mapy/videa ukáže náhradní stav s tlačítkem „Povolit a zobrazit“ (žádné prázdné bílé místo).
7. **H1 na detailu – varianta 1 ze zadání**: plný CRM název o stupeň menší (32 px desktop, 24 px mobil), nic se neschovává.
   Důvod: varianta 2 (zkrácení na 2 řádky + plný název pod tím) by ten samý text ukázala dvakrát a zkrácený H1 je horší pro SEO i čtečky. Reálný název má na desktopu 2 řádky, na mobilu 3. Klíčové parametry jsou pod H1 jako samostatné štítky (cena, typ, plocha, pozemek, pokoje, stav).
8. **Filtry**: desktop = lišta nad výsledky, výsledky se mění hned (krátký skeleton). Mobil/tablet = tlačítko „Filtry (n)“ → vysouvací panel s živým počtem na tlačítku („Zobrazit 3 nabídky“). Aktivní filtry jako odebíratelné štítky.
9. **Seznam / Mapa**: přepínač, mapa přes celou šířku (žádné trvalé půlení). Piny s cenou, shlukování, klik → karta nemovitosti nad mapou.
10. **Hlídací pes**: ve výpisu po 8. kartě a v prázdném výsledku. Prázdný výsledek navíc nabízí, který filtr uvolnit, s reálným počtem („Bez ‚do 1 000 Kč‘ 3“).
11. **Realizováno**: záložka ve výpisu (jen když kancelář prodané nabídky má – Stars 184, TGH 0 na mapě) + stav karty „Prodáno“. Na homepage počet v pásu Realizováno.
12. **Lepící lišta**: mobil dole vždy (cena + telefon + „Mám zájem“), desktop nahoře po odscrollování cenového boxu. Boční panel se proto nelepí.
13. **Detail – pořadí**: galerie (video první) → H1 + klíčové štítky → Parametry a vybavení (ikony + tabulka s vysvětlivkami) → popis sbalený na ~9 řádků → půdorys → PENB → mapa → hypoteční kalkulačka; vpravo cena, CTA, uložit / hlídat cenu / porovnat / sdílet, makléř.
14. **Odhad ceny = 4krokový průvodce** (nemovitost → parametry → adresa → kontakt), pole se mění podle typu (byt / dům / pozemek), validace u pole, souhrn po odeslání. Na homepage zůstává krátký vstup, který vede do průvodce. Výsledkem je poptávka, ne vypočtená cena – stejně jako dnes.
15. **Makléři**: filtr kanceláře (jen když jich je víc – TGH ano, Stars ne) + hledání jména bez diakritiky. Z poboček v Kontaktech vede odkaz „Makléři pobočky“ s předvybraným filtrem.
16. **Detail makléře**: motto, bio, jeho aktuální nabídky spárované s výpisem. Makléř bez vyplněného profilu = prázdný stav místo prázdného místa.
17. **Projekt**: tabulka jednotek (řazení podle plochy a ceny, filtr dispozice; na mobilu karty), ceny „od–do“ v bočním panelu, hlídání novinek v projektu.
18. **404 ve dvou variantách**: obecná (vyhledávání + rychlé odkazy + aktuální nabídky) a „nemovitost už není v nabídce“ pro staré URL inzerátů – místo slepé 404 nabídne podobné nemovitosti a hlídacího psa.

## Fáze 4 – ověřeno
- **Klikací prototyp**: homepage (Byty, Praha, 2+kk) → výpis se stejnými filtry (20 nabídek) → karta → detail → „Mám zájem“ s předvyplněnou zprávou → potvrzení. Funguje i na mobilu.
- **Barevné varianty** (`porovnani.html`): TGH ↔ Test přebarvení – homepage 8 sekcí a výpis 5 sekcí, layout shodný na 1440 i 375 px (tolerance 2 px).
- **Kontrast** všech tokenů měřen živě v knihovně (sekce Barvy).
- **Export**: tokens.json generovaný z tokens.css (základ, přepisy pro 768 a 1280 px, kanceláře), SVG sprite i jednotlivé ikony ke stažení.
- Stránkování ve výpisu se na úzkém mobilu (< 480 px) zkracuje na první / aktuální / poslední stránku.

## Přejímací kritéria (kap. 3.3) – naměřeno v předloze
| Kritérium | 1440×900 | 768 | 375 |
|---|---|---|---|
| H1 ≤ 48 px | homepage 48 · výpis 40 · detail 32 ✓ | 40 / 34 / 28 ✓ | 32 / 28 / 24 ✓ |
| obsah ≤ 1280 px | 1280 ✓ | – | – |
| homepage: hero + začátek další sekce nad ohybem | sekce na 643 px ✓ | ✓ | – |
| výpis: 4 karty v řadě | 4 ✓ (výška 416 px) | 2 | 1 |
| výpis: 1. nemovitost do 1 posunutí od hlavičky výpisu | 367 px ✓ | ✓ | 319 px ✓ |
| detail: H1 + klíčové parametry nad ohybem | spodní hrana štítků 831 px ✓ | | |
| bez vodorovného scrollu | ✓ | ✓ | ✓ |
| přebarvení nemění layout | pozice sekcí TGH / test shodné ✓ | | |

## Simulace v předloze (vývoj napojí na CRM)
- Homepage: počty v kategoriích reálné; počet po výběru lokality / dispozice na homepage je **simulovaný**. Výpis počítá vše nad reálnými daty.
- Všechny karty vedou na jeden ukázkový detail (N119591). Plný profil má jen Zdeněk Kubát, plný detail projektu jen Musílkova 39.
- Odeslání formulářů (odhad, kontakt, zájem) jen ukáže potvrzení, nic se neodesílá.
- Vybavení na detailu je ručně vytažené z popisu (CRM ho u zakázky strukturovaně neposílá). Půdorys CRM neposílá → prázdný stav. Texty vysvětlivek u ploch dodá NEXT (v předloze označené).
- Kalkulačka: sazba 4,5 % je ilustrativní, uživatel ji přepíše.
- Hlídací pes, uložení, hlídání ceny, porovnání: jen stavy UI, bez backendu.
- Mapa: OpenStreetMap + Leaflet (CDN) – produkce může použít Mapy.cz; náhradní stav při odmítnutých cookies platí pro obě.
- Obrázky jsou hotlinkované z živých webů.

## Otevřené otázky
- Zelená / modrá: smí se pro tlačítka použít ztmavená varianta? (WCAG AA vs. brand manuál NEXT)
- Posílá CRM strukturovaně dispozici, plochy, vybavení, půdorys a stav? Bez toho nejde filtr dispozice, štítky karty ani ikonový řádek vybavení.
- Náhledové velikosti obrázků v CMS (viz re-audit) – kdo je doplní?
- Hlídací pes, živý počet, hlídání ceny = backend v CMS → kdo vlastní vývoj?
