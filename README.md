# Bárányka Keresztyén Óvoda – honlap

A [baranykaovi.hu](https://baranykaovi.hu) statikus honlapja. Nincs telepítendő program: a `honlap/` mappa tartalmát kell feltölteni a tárhelyre, a rejtett `.htaccess` fájlt is (Finderben Cmd+Shift+. mutatja meg). A `design/terv/` mappában az előzetes Claude-látványterv található, a honlap nem használja.

## Képek a galériákban

A `honlap/kepek/galeria/` alatti mappákba képeket lehet feltölteni vagy onnan törölni, és ezek automatikusan megjelennek, illetve eltűnnek a honlap galériáiban. A képek fájlnév szerint sorakoznak (például `01_udvar.jpg`, `02_hinta.jpg`).

## Dokumentumok frissítése

Cseréld le a fájlt a `honlap/iratok/` mappában egy ugyanolyan nevű új fájlra. A honlap a fájlból olvassa ki a módosítás dátumát, így a „Frissítve” dátum magától átáll.

