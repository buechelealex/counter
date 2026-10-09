# Counter

Eine schlichte Web-App zum Zählen beliebiger Dinge, zum Beispiel Gläser Wasser, Trainingseinheiten oder Zigaretten. Du kannst mehrere Counter anlegen. Bei jedem Tippen speichert die App den Tag, sodass du später siehst, wie oft du an welchem Tag gezählt hast.

Die App ist eine **Progressive Web App (PWA)**: Du kannst sie über Chrome auf dem Handy installieren, und sie funktioniert danach auch offline.

## Funktionen

- Beliebig viele Counter mit eigenem Namen und eigener Farbe
- Schnelles Hochzählen direkt aus der Übersicht über den **+**-Knopf
- Detailansicht mit großem Zählknopf, Anzahl von heute und Anzahl der aktiven Tage
- Verlauf pro Tag, neueste Tage zuerst
- Rückgängig für den letzten Klick
- Counter löschen
- Heller und dunkler Modus, richtet sich nach der Systemeinstellung
- Offline nutzbar über einen Service Worker

## Projektstruktur

Jede Activity (jeder Bildschirm) liegt in einem eigenen Ordner mit eigener `index.html`, `style.css` und `scripts.js`.

```
counter/
├── index.html            Leitet weiter auf home/
├── manifest.json         PWA-Manifest (Name, Icons, Start-URL)
├── sw.js                 Service Worker (Offline-Cache)
├── icons/                App-Icons (192px, 512px, maskable)
├── shared/
│   ├── store.js          Datenschicht (localStorage) und Registrierung des Service Workers
│   └── base.css          Farben, Dark Mode, gemeinsame Layout-Elemente
├── home/                 Activity: Übersicht aller Counter
├── new/                  Activity: neuen Counter anlegen
└── counter/              Activity: Detailansicht eines Counters (?id=...)
```

## Datenformat

Die Daten liegen im `localStorage` des Browsers unter dem Schlüssel `counters.v1`:

```json
[
  {
    "id": "mv1cusjemlvc",
    "name": "Wasser",
    "color": "#0090ff",
    "created": "2026-10-09",
    "counts": ["2026-10-08", "2026-10-09", "2026-10-09"]
  }
]
```

Jeder Eintrag in `counts` steht für einen Klick und enthält den lokalen Tag im Format `YYYY-MM-DD`.

> **Achtung:** Die Daten liegen nur auf dem jeweiligen Gerät. Wenn du die App deinstallierst oder die Website-Daten in Chrome löschst, gehen alle Counter verloren.

## Lokal starten

Die App braucht keinen Build-Schritt. Es genügt ein beliebiger statischer Webserver. Der Service Worker funktioniert nicht über `file://`, deshalb musst du die App über einen Server öffnen:

```bash
python -m http.server 8123
```

Danach im Browser `http://localhost:8123` öffnen.

## Auf dem Handy installieren

Chrome bietet die Installation nur für Seiten an, die über **HTTPS** laufen. Am einfachsten geht das mit GitHub Pages:

1. Das Repo auf GitHub pushen.
2. Im Repo unter **Settings → Pages** den Branch auswählen und speichern.
3. Die angezeigte Adresse (`https://<user>.github.io/<repo>/`) in Chrome auf dem Handy öffnen.
4. Im Menü **⋮ → App installieren** bzw. **Zum Startbildschirm hinzufügen** wählen.

Andere statische Hoster wie Netlify oder Cloudflare Pages funktionieren genauso.

## Updates ausliefern

Der Service Worker lädt Dateien zuerst aus dem Netz und greift nur offline auf den Cache zurück. Änderungen kommen deshalb beim nächsten Öffnen mit Internetverbindung an.

Wenn du neue Dateien hinzufügst, trägst du sie zusätzlich in die `ASSETS`-Liste in `sw.js` ein und erhöhst die Versionsnummer in `CACHE` (z. B. `counter-v2`).
