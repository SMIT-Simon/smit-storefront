/**
 * Hauptkategorien des Shops. Die Handles entsprechen den automatischen
 * Kollektionen in Shopify (Produkte werden dort per Produkttyp einsortiert).
 */
export type Category = {
  handle: string;
  title: string;
  teaser: string;
  icon: IconName;
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
  | 'accessory';

export const CATEGORIES: Category[] = [
  {
    handle: 'notebooks',
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
];

/** Deutscher Mehrwertsteuersatz für die Netto-Anzeige. */
export const VAT_RATE = 0.19;

export const SUB_TAG_PREFIX = 'sub:';
export function findSub(handle: string, slug?: string | null) {
  const cat = CATEGORIES.find((c) => c.handle === handle);
  return cat?.subs?.find((x) => x.slug === slug) ?? null;
}
