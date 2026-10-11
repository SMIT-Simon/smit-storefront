/**
 * Eigenschaften-Filter für PCs, Notebooks, All-in-Ones und Monitore.
 *
 * Grundlage sind Produkt-Tags "f:<wert>", die aus den WORTMANN-Datenblättern
 * erzeugt wurden (Prozessor, RAM, SSD, Betriebssystem, Display …).
 * URL: ?f=cpu-core5,ram-16 – innerhalb einer Gruppe ODER, zwischen Gruppen UND.
 * Gruppen mit mode "all" (Ausstattung) verknüpfen ihre Werte mit UND.
 */
export const FILTER_TAG_PREFIX = 'f:';

export type FilterGroup = {
  key: string;
  title: string;
  mode?: 'any' | 'all';
  categories: string[];
  values: {slug: string; label: string}[];
};

const PCS = ['notebooks', 'desktop-pcs', 'all-in-one-pcs'];

export const FILTER_GROUPS: FilterGroup[] = [
  {
    key: 'cpu',
    title: 'Prozessor',
    categories: PCS,
    values: [
      {slug: 'cpu-entry', label: 'Intel N / Pentium'},
      {slug: 'cpu-core3', label: 'Intel Core i3 / Core 3'},
      {slug: 'cpu-core5', label: 'Intel Core i5 / Core 5'},
      {slug: 'cpu-ultra5', label: 'Intel Core Ultra 5'},
      {slug: 'cpu-core7', label: 'Intel Core i7'},
      {slug: 'cpu-ultra7', label: 'Intel Core Ultra 7'},
      {slug: 'cpu-ryzen5', label: 'AMD Ryzen 5'},
      {slug: 'cpu-ryzen7', label: 'AMD Ryzen 7 / AI'},
      {slug: 'cpu-highend', label: 'High-End (i9, Ultra 9, Xeon, Threadripper)'},
    ],
  },
  {
    key: 'ram',
    title: 'Arbeitsspeicher',
    categories: PCS,
    values: [
      {slug: 'ram-8', label: 'bis 8 GB'},
      {slug: 'ram-16', label: '16 GB'},
      {slug: 'ram-32', label: '32 GB'},
      {slug: 'ram-64', label: '64 GB und mehr'},
    ],
  },
  {
    key: 'ssd',
    title: 'Speicher (SSD)',
    categories: PCS,
    values: [
      {slug: 'ssd-256', label: 'bis 256 GB'},
      {slug: 'ssd-512', label: '500 / 512 GB'},
      {slug: 'ssd-1tb', label: '1 TB'},
      {slug: 'ssd-2tb', label: '2 TB und mehr'},
    ],
  },
  {
    key: 'os',
    title: 'Betriebssystem',
    categories: PCS,
    values: [
      {slug: 'os-w11-pro', label: 'Windows 11 Pro'},
      {slug: 'os-w11-home', label: 'Windows 11 Home'},
      {slug: 'os-ohne', label: 'Ohne Betriebssystem'},
    ],
  },
  {
    key: 'nb',
    title: 'Displaygröße',
    categories: ['notebooks'],
    values: [
      {slug: 'nb-14', label: 'bis 14 Zoll'},
      {slug: 'nb-16', label: '15 – 16 Zoll'},
      {slug: 'nb-17', label: '17 Zoll'},
    ],
  },
  {
    key: 'size',
    title: 'Bildschirmgröße',
    categories: ['monitore'],
    values: [
      {slug: 'size-24', label: '24 Zoll'},
      {slug: 'size-27', label: '27 Zoll'},
      {slug: 'size-32', label: '32 Zoll'},
    ],
  },
  {
    key: 'res',
    title: 'Auflösung',
    categories: ['monitore'],
    values: [
      {slug: 'res-fhd', label: 'Full HD (1920 × 1080)'},
      {slug: 'res-wqhd', label: 'WQHD (2560 × 1440)'},
      {slug: 'res-4k', label: '4K UHD (3840 × 2160)'},
    ],
  },
  {
    key: 'feat',
    title: 'Ausstattung',
    mode: 'all',
    categories: ['monitore'],
    values: [
      {slug: 'hv', label: 'Höhenverstellbar'},
      {slug: 'pivot', label: 'Pivot (drehbar)'},
      {slug: 'usbc-pd', label: 'USB-C mit Ladefunktion'},
      {slug: 'usbc-dock', label: 'USB-C-Dock mit LAN'},
      {slug: 'hz-100', label: '100 Hz und mehr'},
      {slug: 'curved', label: 'Curved'},
    ],
  },
];

export function groupsFor(handle: string) {
  return FILTER_GROUPS.filter((g) => g.categories.includes(handle));
}

/** Liest ?f= und behält nur Werte, die für die Kategorie gültig sind. */
export function parseFilters(handle: string, param: string | null) {
  const valid = new Set(groupsFor(handle).flatMap((g) => g.values.map((v) => v.slug)));
  return [...new Set((param ?? '').split(',').filter((x) => valid.has(x)))];
}

/** Prüft, ob die Tags eines Produkts die gewählten Filter erfüllen. */
export function matches(tags: Set<string>, selected: string[], groups: FilterGroup[]) {
  for (const g of groups) {
    const sel = g.values.filter((v) => selected.includes(v.slug));
    if (!sel.length) continue;
    const has = (s: string) => tags.has(FILTER_TAG_PREFIX + s);
    const ok = g.mode === 'all' ? sel.every((v) => has(v.slug)) : sel.some((v) => has(v.slug));
    if (!ok) return false;
  }
  return true;
}

/** Storefront-Suchanfrage für die gewählten Filter (wird an die Kategorie-Abfrage gehängt). */
export function filterQuery(selected: string[], groups: FilterGroup[]) {
  const parts: string[] = [];
  for (const g of groups) {
    const sel = g.values.filter((v) => selected.includes(v.slug));
    if (!sel.length) continue;
    const terms = sel.map((v) => `tag:"${FILTER_TAG_PREFIX}${v.slug}"`);
    parts.push(terms.length > 1 ? `(${terms.join(g.mode === 'all' ? ' AND ' : ' OR ')})` : terms[0]);
  }
  return parts.join(' AND ');
}

export type FacetCounts = Record<string, number>;

/**
 * Trefferzahl je Filterwert: wie viele Produkte es gäbe, wenn man diesen Wert
 * zusätzlich (bzw. bei ODER-Gruppen alternativ) auswählt.
 */
export function facetCounts(allTags: string[][], selected: string[], groups: FilterGroup[]) {
  const sets = allTags.map((t) => new Set(t));
  const counts: FacetCounts = {};
  for (const g of groups) {
    const others = selected.filter((s) => !g.values.some((v) => v.slug === s));
    const own = selected.filter((s) => g.values.some((v) => v.slug === s));
    for (const v of g.values) {
      const sel = g.mode === 'all' ? [...others, ...own, v.slug] : [...others, v.slug];
      counts[v.slug] = sets.filter((t) => matches(t, sel, groups)).length;
    }
  }
  return counts;
}
