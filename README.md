# Bárányka Keresztyén Óvoda – honlap

A [baranykaovi.hu](https://baranykaovi.hu) statikus honlapja. Nincs telepítendő program: a `honlap/` mappa tartalmát kell feltölteni a tárhelyre, a rejtett `.htaccess` fájlt is (Finderben Cmd+Shift+. mutatja meg). A `design/terv/` mappában az előzetes Claude-látványterv található, a honlap nem használja.

## Képek a galériákban

A `honlap/tartalom/kepek/galeria/` alatti mappákba képeket lehet feltölteni vagy onnan törölni, és ezek automatikusan megjelennek, illetve eltűnnek a honlap galériáiban. A képek fájlnév szerint sorakoznak (például `01_udvar.jpg`, `02_hinta.jpg`).

A Galéria menüpont négy albumának mappái:

- `ovodarol/` – Óvodánkról
- `szulokkel/` – Szülőkkel
- `szabadban/` – A szabadban
- `jatszunk/` – Játszunk!

Az album borítóképe a mappa első képe. Ha egy mappa üres, az album kártyáján „Hamarosan” felirat jelenik meg.

## Dokumentumok frissítése

Cseréld le a fájlt a `honlap/tartalom/dokumentumok/` mappában egy ugyanolyan nevű új fájlra. A honlap a fájlból olvassa ki a módosítás dátumát, így a „Frissítve” dátum magától átáll.

