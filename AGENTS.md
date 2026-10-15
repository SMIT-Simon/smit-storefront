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
