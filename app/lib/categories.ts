/**
 * Hauptkategorien des Shops. Die Handles entsprechen den automatischen
 * Kollektionen in Shopify (Produkte werden dort per Produkttyp einsortiert).
 */
export type Category = {
  handle: string;
  title: string;
  teaser: string;
  icon: IconName;
  /** Produkttypen der Kategorie (wie die Regeln der Shopify-Kollektion). */
  types?: string[];
  /** Unterkategorien – entsprechen Produkt-Tags "sub:<slug>". */
  subs?: SubCategory[];
};

export type SubCategory = {slug: string; title: string};

export type IconName =
  | 'notebook'
  | 'desktop'
  | 'aio'
  | 'monitor'
  | 'tablet'
  | 'server'
  | 'accessory'
  | 'software';

export const CATEGORIES: Category[] = [
  {
    handle: 'notebooks',
    types: ['Notebook'],
    title: 'Notebooks',
    teaser: 'Business-Notebooks für Büro und unterwegs',
    icon: 'notebook',
    subs: [
      {slug: 'business', title: 'Business-Notebooks'},
      {slug: 'copilot-pc', title: 'Copilot+ PC'},
      {slug: 'premium', title: 'MOBILE ELITE'},
      {slug: 'convertible', title: 'Convertible / 2-in-1'},
      {slug: 'industry', title: 'Industry (Rugged)'},
    ],
  },
  {
    handle: 'desktop-pcs',
    types: ['Desktop-PC'],
    title: 'Desktop-PCs',
    teaser: 'Vom Mini-PC bis zur Workstation',
    icon: 'desktop',
    subs: [
      {slug: 'business', title: 'PC-Business'},
      {slug: 'mini-micro', title: 'PC-Mini & PC-Micro'},
      {slug: 'workstation', title: 'Workstation'},
      {slug: 'industry', title: 'Industry'},
      {slug: 'home', title: 'PC-Home'},
      {slug: 'gamer', title: 'PC-Gamer'},
      {slug: 'copilot-pc', title: 'Copilot+ PC'},
    ],
  },
  {
    handle: 'all-in-one-pcs',
    types: ['All-in-One-PC'],
    title: 'All-in-One',
    teaser: 'PC und Monitor in einem Gerät',
    icon: 'aio',
    subs: [
      {slug: '24-zoll', title: '24 Zoll'},
      {slug: '27-zoll', title: '27 Zoll'},
    ],
  },
  {
    handle: 'monitore',
    types: ['Monitor'],
    title: 'Monitore',
    teaser: 'Displays für Arbeitsplatz und Konferenz',
    icon: 'monitor',
    subs: [
      {slug: '24-zoll', title: '24 Zoll'},
      {slug: '27-zoll', title: '27 Zoll'},
      {slug: '32-zoll', title: '32 Zoll'},
      {slug: 'hoehenverstellbar', title: 'Höhenverstellbar (PV/HA)'},
    ],
  },
  {
    handle: 'tablets',
    types: ['Tablet'],
    title: 'Tablets',
    teaser: 'Mobile Geräte mit Windows und Android',
    icon: 'tablet',
    subs: [
      {slug: 'windows', title: 'Windows-Tablets'},
      {slug: 'android', title: 'Android-Tablets'},
    ],
  },
  {
    handle: 'server-netzwerk',
    types: ['Server', 'Firewall', 'Netzwerkzubehör'],
    title: 'Server & Netzwerk',
    teaser: 'Server, Firewalls und Netzwerktechnik',
    icon: 'server',
    subs: [
      {slug: 'tower-server', title: 'Miniserver / Tower'},
      {slug: 'rack-server', title: 'Rack-Server'},
      {slug: 'firewall', title: 'Firewall & VPN'},
    ],
  },
  {
    handle: 'zubehoer',
    types: ['Dockingstation', 'Tastatur', 'Maus', 'Eingabezubehör', 'Webcam', 'Tasche & Hülle', 'Netzteil', 'Netzteil & Akku', 'Kabel', 'Adapter', 'AV-Zubehör', 'Systemzubehör', 'Gehäuse', 'Ersatzteil'],
    title: 'Zubehör',
    teaser: 'Dockingstations, Eingabegeräte, Taschen',
    icon: 'accessory',
    subs: [
      {slug: 'dockingstations', title: 'Dockingstations'},
      {slug: 'eingabegeraete', title: 'Tastaturen & Mäuse'},
      {slug: 'webcams', title: 'Webcams'},
      {slug: 'taschen', title: 'Taschen & Schutzhüllen'},
      {slug: 'netzteile', title: 'Netzteile & Akkus'},
      {slug: 'halterungen', title: 'Halterungen & Standfüße'},
      {slug: 'ersatzteile', title: 'Kabel, Adapter & Ersatzteile'},
    ],
  },
  {
    handle: 'software-services',
    types: ['Software', 'Dienstleistung'],
    title: 'Software & Service',
    teaser: 'Windows, Office, Virenschutz und Einrichtung',
    icon: 'software',
    subs: [
      {slug: 'services', title: 'Einrichtungsservice'},
      {slug: 'betriebssysteme', title: 'Windows'},
      {slug: 'office', title: 'Microsoft Office & 365'},
      {slug: 'sicherheit', title: 'Virenschutz'},
    ],
  },
];

/** Deutscher Mehrwertsteuersatz für die Netto-Anzeige. */
export const VAT_RATE = 0.19;

export const SUB_TAG_PREFIX = 'sub:';
export function findSub(handle: string, slug?: string | null) {
  const cat = CATEGORIES.find((c) => c.handle === handle);
  return cat?.subs?.find((x) => x.slug === slug) ?? null;
}

/** Suchanfrage für die Storefront-API: Produkttyp der Kategorie UND Unterkategorie-Tag. */
export function subQuery(handle: string, slug: string) {
  const cat = CATEGORIES.find((c) => c.handle === handle);
  const types = (cat?.types ?? []).map((t) => `product_type:"${t}"`).join(' OR ');
  const tag = `tag:"${SUB_TAG_PREFIX}${slug}"`;
  return types ? `(${types}) AND ${tag}` : tag;
}

/** Suchanfrage + Link für eine Kategorie, optional eingeschränkt auf eine Unterkategorie. */
export function categoryQuery(handle: string, slug?: string) {
  if (slug) return {query: subQuery(handle, slug), href: `/collections/${handle}?sub=${slug}`};
  const cat = CATEGORIES.find((c) => c.handle === handle);
  const types = (cat?.types ?? []).map((t) => `product_type:"${t}"`).join(' OR ');
  return {query: types || '*', href: `/collections/${handle}`};
}
