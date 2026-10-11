# SMIT Storefront

Headless-Shopfrontend (Shopify Hydrogen) für TERRA-Hardware von WORTMANN.
Gehostet auf Shopify Oxygen, Daten kommen aus dem Shopify-Shop *smit-digital-services*.

## Aufbau

- `app/lib/categories.ts` – die Hauptkategorien (Handles = Shopify-Kollektionen)
- `app/styles/app.css` – komplettes Design; Farben oben als CSS-Variablen (`--brand` usw.)
- `app/routes/_index.tsx` – Startseite
- `app/routes/collections.$handle.tsx` – Kategorieseiten mit Sortierung
- `app/routes/products.$handle.tsx` – Produktseite (Galerie, Brutto/Netto, technische Daten)
- `app/components/Header.tsx`, `Footer.tsx` – Kopf- und Fußbereich

## Lokal starten

```bash
npm install
npx shopify hydrogen link   # einmalig mit dem Shop verbinden
npm run dev
```

Ohne `link` zeigt die lokale Vorschau Beispieldaten von mock.shop.

## Deployment

Jeder Push auf `main` wird von Oxygen automatisch gebaut und veröffentlicht,
sobald das Repo im Hydrogen-Vertriebskanal verbunden ist.
