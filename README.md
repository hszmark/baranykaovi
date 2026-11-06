# Bárányka Keresztyén Óvoda – honlap

A [baranykaovi.hu](https://baranykaovi.hu) új honlapja. Egyszerű, statikus oldal: nincs benne tartalomkezelő (WordPress) és nincs telepítendő program. A `honlap/` mappát kell feltölteni a tárhelyre, és már működik is.

## Mi van itt

| Mappa | Tartalom |
|---|---|
| `honlap/` | Maga a honlap. Ezt kell feltölteni a tárhelyre. |
| `honlap/dokumentumok/` | A letölthető PDF-dokumentumok |
| `honlap/kepek/` | A logó, a kezdőlap fotója és a többi kép |
| `honlap/kepek/galeria/` | A képgalériák, galériánként egy mappa |
| `terv/` | Az előzetes látványterv (Claude-tervvászon fájlok). Csak tájékoztatásul, a honlap nem használja. |

### A dokumentumok fájlnevei

A honlap ezeket a fájlneveket keresi a `honlap/dokumentumok/` mappában. A fájlnévnek pontosan egyeznie kell (kisbetű, ékezet nélkül, aláhúzással):

| Fájlnév | Dokumentum |
|---|---|
| `kozzeteteli_lista.pdf` | Közzétételi lista |
| `alapito_okirat.pdf` | Alapító okirat |
| `nyilvantartasba_veteli_hatarozat.pdf` | Nyilvántartásba vételi határozat |
| `mukodesi_engedely.pdf` | Működési engedély |
| `pedagogiai_program.pdf` | Pedagógiai program |
| `hazirend.pdf` | Házirend (a Szülőknek oldalon is szerepel) |
| `szervezeti_es_mukodesi_szabalyzat.pdf` | Szervezeti és működési szabályzat |
| `panaszkezelesi_szabalyzat.pdf` | Panaszkezelési szabályzat |
| `adat_es_iratkezelesi_szabalyzat.pdf` | Adat- és iratkezelési szabályzat |
| `helyi_minositesi_szabalyzat.pdf` | Helyi minősítési szabályzat |
| `munkaterv.pdf` | Munkaterv |
| `kozlemeny_beiratkozasrol.pdf` | Közlemény az óvodai beiratkozásról |
| `fenntartoi_ertekeles.pdf` | Fenntartói értékelés |
| `adatkezelesi_tajekoztato.pdf` | Adatkezelési tájékoztató (a láblécből és a Kapcsolat oldalról nyílik) |

## Dokumentum cseréje

1. Nevezze át az új PDF-et pontosan arra a névre, amelyen a régi szerepel (lásd a fenti táblázatot), például `hazirend.pdf`.
2. Töltse fel a `dokumentumok` mappába, és írja felül a régit.

Ennyi. A honlapon a dokumentum mellett megjelenő „Frissítve: …” dátum magától átáll a feltöltés napjára. A fájlnévben ne legyen dátum: a dátumot a honlap a fájlból olvassa ki.

## Képek hozzáadása egy galériához

Minden galéria egy mappa a `kepek/galeria/` alatt:

| Mappa | Hol jelenik meg |
|---|---|
| `kornyezetunk/` | Az óvodáról → Környezete |
| `felszereltsegunk/` | Az óvodáról → Felszereltség |
| `kozos-alkalmaink/` | Szülőknek → Nyitott óvoda |

- Új kép: töltse fel a mappába. A következő oldalbetöltéskor már látszik.
- Kép törlése: törölje a fájlt a mappából.
- Sorrend: a képek fájlnév szerint sorakoznak. Számmal kezdve a sorrend tetszés szerint állítható: `01_udvar.jpg`, `02_hinta.jpg`, … `10_kert.jpg`.
- Formátum: JPG vagy WebP. Az iPhone HEIC formátumát a böngészők nem jelenítik meg, ezt előbb JPG-re kell alakítani.
- Méret: a kép hosszabbik oldala legfeljebb kb. 2000 képpont legyen. A telefonnal készült, sokmegás fotókat előbb kicsinyítse le, különben telefonon lassan töltődik az oldal.
- Ha egy mappa üres, a galéria nem jelenik meg az oldalon.

## Egyedi képek cseréje

Ezeket ugyanazon a néven kell felülírni a `kepek/` mappában:

| Fájl | Hol látszik | Arány |
|---|---|---|
| `logo.webp` | Fejléc, lábléc, Az óvodáról | átlátszó háttér, kb. 10:7 |
| `favicon.png` | A böngészőfül ikonja | négyzet, 64×64 |
| `kezdolap.jpg` | Kezdőlap nagy képe | fekvő, kb. 4:3 |
| `hitre-neveles.webp` | Küldetésünk → Az óvodáskor jelentősége | fekvő, 16:10 |

## Új dokumentum felvétele

Ehhez a `dokumentumok.html` fájlt kell szerkeszteni (egyszerű szövegszerkesztővel):

1. Keresse meg a megfelelő csoportot (például „Szabályzatok és program”).
2. Másolja le az egyik `<li data-document>` … `</li>` blokkot.
3. Az új blokkban írja át a fájlnevet (`dokumentumok/….pdf`) és a dokumentum címét.
4. Töltse fel az új PDF-et ezen a néven a `dokumentumok` mappába.

## Feltöltés a Hostingerre

**Első feltöltés:** a `honlap/` mappa teljes tartalmát töltse fel a tárhely `public_html/` mappájába (a Hostinger Fájlkezelőjével vagy FTP-vel). Maga a `honlap` mappa ne kerüljön fel, csak a tartalma.

**Később csak a megváltozott fájlokat töltse fel.** A tárhely minden feltöltött fájl dátumát a feltöltés idejére állítja. Ha a teljes mappát újra feltölti, minden dokumentum „Frissítve” dátuma a feltöltés napjára ugrik.

**Az első feltöltés után ellenőrizze:**

1. Nyissa meg böngészőben: `https://baranykaovi.hu/kepek/galeria/kornyezetunk/`. Ha fájllistát lát, a galériák működnek.
2. Ha „403 Forbidden” vagy „500” hibát kap, a tárhely nem engedi a mappák listázását. Ilyenkor törölje a `kepek/galeria/.htaccess` fájlt, és kérje a Hostinger ügyfélszolgálatát, hogy engedélyezze a könyvtárlistázást (Indexes) ehhez a mappához. Addig a galériák helyén egy „Képek megtekintése” link jelenik meg.
3. A honlap nyilvánossá tétele előtt töltse fel az összes PDF-et a fenti táblázat szerinti néven, különben a dokumentumlinkek hibaoldalra vezetnek.
4. Ellenőrizze a Kapcsolat oldal impresszumában a tárhelyszolgáltató adatait.

## Fejlesztőknek

- **Nincs build lépés.** Kézzel írt HTML, egy CSS-pár és három kis JavaScript-fájl. Helyi kipróbálás: `cd honlap && python3 -m http.server`, majd `http://localhost:8000`. A Python szervere is listázza a mappákat és küldi a `Last-Modified` fejlécet, így a galériák és a dátumok helyben is működnek.
- **Fejléc és lábléc:** mind a hét oldalon szó szerint ugyanaz a kód. Menüváltozásnál mind a hét fájlt át kell írni (az aktuális oldal linkjén `aria-current="page"` van).
- **Stílusok:** a `css/tokens.css` tartalmazza az összes színt, térközt, lekerekítést, betűméretet, árnyékot és szélességet CSS-változóként. A `css/main.css` ezekre hivatkozik; benne nem lehet nyers színkód. A töréspontok: 48rem (tablet), 64rem (kétoszlopos oldalelrendezés), 67rem (teljes fejléc, menügomb nélkül).
- **Betűk:** a `fonts/` mappában, saját tárhelyről (Nunito, Baloo 2, Kavoon; latin és latin-ext részhalmaz). A licencek (OFL) mellettük vannak.
- **JavaScript** (a HTML `data-` attribútumaira épül, JS nélkül is használható az oldal):
  - `js/menu.js`: mobilmenü nyitása-zárása.
  - `js/gallery.js`: a `data-gallery` elemek mappájának szerver-generált listájából építi fel a képnézegetőt és a nagyítást. A listaolvasás egyetlen függvényben (`listImages`) van, így szükség esetén lecserélhető például egy PHP-s fájllistára.
  - `js/documents.js`: a `data-modified` elemekbe írja a PDF-ek `Last-Modified` dátumát (HEAD kérés).
- **`.htaccess`:** a `kepek/galeria/` alatt bekapcsolja a mappalistázást, a `dokumentumok/` alatt `Cache-Control: no-cache`-t állít a PDF-ekre, hogy a lecserélt fájl ne a böngésző gyorsítótárából jöjjön.
