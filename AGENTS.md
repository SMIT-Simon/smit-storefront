# Shopify Hydrogen development

This storefront is scaffolded from Shopify's Hydrogen skeleton template. See the README for framework-specific details.

Use the [Shopify AI Toolkit](https://shopify.dev/docs/apps/build/ai-toolkit) for all Shopify API and platform work. If missing, install it in the agent host per that page (or `npx skills add Shopify/shopify-ai-toolkit --list` for skill-compatible hosts).

## Produktbeschreibungen (Shopify = Quelle für Shop UND Google)

- Die Shopify-Produktbeschreibung (`descriptionHtml`) besteht aus zwei Teilen:
  1. Übersichtstext in `<div data-smit-overview>…</div><!-- /smit-overview -->` (vorne)
  2. danach die technischen Daten (Wortmann-Tabelle)
- Der Shop trennt das mit `splitDescription()` (`app/lib/specs.ts`): Teil 1 → Tab „Übersicht“, Teil 2 → „Technische Daten“.
  Google & YouTube bekommt die komplette Beschreibung.
- Bei neuen oder geänderten Produkten IMMER beides in Shopify pflegen (Übersichtsblock + technische Daten).
  `app/data/wortmann-content.json` ist nur noch Fallback, wenn kein Übersichtsblock existiert.
- Kein Artikel, der an Google geht, darf eine leere Beschreibung haben.

## Google Merchant Center: Produktlinks (Headless)

- Die Shopify-Google-App schreibt als Produktlink die myshopify-Domain (Hauptdomain des Onlineshops) in den Feed.
- Korrektur über `app/routes/feeds.google-links[.]csv.tsx` → https://www.terra-computershop.de/feeds/google-links.csv
  (Spalten `id,link`, ID-Format `shopify_ZZ_<productId>_<variantId>`). NICHT löschen/umbenennen.
- Im Merchant Center als „ergänzende Datenquelle“ (SUPPLEMENTAL SOURCE 1 = DE, 2 = EU) hinterlegt, täglicher Abruf 00:00.
- Produktseiten müssen unter `/products/<handle>` erreichbar bleiben.

## Onlineshop-Kanal (Horizon-Theme auf ahkvdq-fn.myshopify.com)

- Kanal „Onlineshop“ NICHT entfernen und NICHT mit Passwort sperren: Die Google-&-YouTube-App braucht ihn für die Produktsynchronisierung.
- Stattdessen leitet `layout/theme.liquid` (direkt nach `<head>`) jeden Aufruf der myshopify-Domain auf dieselbe Seite unter www.terra-computershop.de um
  (JS `location.replace`, ausgenommen `request.design_mode`). Kein zusätzlicher canonical-Tag (macht schon `meta-tags`).
- Die Kasse und `/cart/<variante>:<menge>` laufen unabhängig vom Theme weiter.
- Über die Admin-API (MCP) darf das LIVE-Theme nicht beschrieben werden → Theme-Änderungen gibt der Nutzer selbst im Code-Editor ein; danach mit Playwright prüfen.

## Ländersperre (server.ts)

- `BLOCKED_COUNTRIES` (IN, BR, SA) bekommen per `oxygen-buyer-country` eine 403-Seite „liefert nur innerhalb der EU“ – reiner Bot-Traffic, keine Lieferländer.
- USA und EU NIEMALS sperren (Google-Shopping-Prüfer, Kunden).
