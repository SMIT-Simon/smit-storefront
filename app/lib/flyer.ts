import pages from '~/data/flyer-iii-2026.json';

export type FlyerHotspot = {
  sku: string;
  handle: string | null;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
};
export type FlyerPage = {page: number; w: number; h: number; hotspots: FlyerHotspot[]};

/** Aktueller TERRA BUSINESS-Flyer (WORTMANN AG). Bei neuem Flyer hier austauschen. */
export const FLYER = {
  title: 'TERRA BUSINESS III-26',
  subtitle: 'Industrie · Handel · Handwerk',
  image: (n: number) => `/flyer/seite-${n}.webp`,
  wortmannUrl:
    'https://b2b.wortmann.de/content/files/content/Externe_Dokumente_Ablage/Blaetterkataloge/TERRA-BUSINESS/III-2026/DE/index.html',
  pages: pages as FlyerPage[],
};

export function flyerHandles(): string[] {
  const seen = new Set<string>();
  for (const p of FLYER.pages)
    for (const h of p.hotspots) if (h.handle && /^[a-z0-9-]+$/.test(h.handle)) seen.add(h.handle);
  return [...seen];
}
