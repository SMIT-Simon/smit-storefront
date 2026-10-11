/**
 * Inhalte von wortmann.de (Übersichtstext, Zubehör, Feature-Logos),
 * einmalig ausgelesen und hier als Daten mitgeliefert.
 * Ein in Shopify gepflegtes Metafeld hat immer Vorrang.
 */
import data from '~/data/wortmann-content.json';

type Entry = {o: string; a: string[]; f: string[]};
const CONTENT = data as Record<string, Entry>;
// Feature-Logos liegen im Repo (unabhängig vom Shopify-Shop)
const FILE_BASE = '/images/features/';

export type WortmannContent = {
  overviewHtml: string;
  accessoryHandles: string[];
  features: string[];
};

export function getWortmannContent(sku?: string | null): WortmannContent {
  const e = sku ? CONTENT[sku] : undefined;
  return {
    overviewHtml: e?.o ?? '',
    accessoryHandles: (e?.a ?? []).filter((h) => /^[a-z0-9-]+$/.test(h)),
    features: (e?.f ?? []).map((f) => FILE_BASE + encodeURIComponent(f)),
  };
}
