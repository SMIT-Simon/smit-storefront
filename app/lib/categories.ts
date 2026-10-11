/**
 * Hauptkategorien des Shops. Die Handles entsprechen den automatischen
 * Kollektionen in Shopify (Produkte werden dort per Produkttyp einsortiert).
 */
export type Category = {
  handle: string;
  title: string;
  teaser: string;
  icon: IconName;
};

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
  },
  {
    handle: 'desktop-pcs',
    title: 'Desktop-PCs',
    teaser: 'Vom Mini-PC bis zur Workstation',
    icon: 'desktop',
  },
  {
    handle: 'all-in-one-pcs',
    title: 'All-in-One',
    teaser: 'PC und Monitor in einem Gerät',
    icon: 'aio',
  },
  {
    handle: 'monitore',
    title: 'Monitore',
    teaser: 'Displays für Arbeitsplatz und Konferenz',
    icon: 'monitor',
  },
  {
    handle: 'tablets',
    title: 'Tablets',
    teaser: 'Mobile Geräte mit Windows und Android',
    icon: 'tablet',
  },
  {
    handle: 'server-netzwerk',
    title: 'Server & Netzwerk',
    teaser: 'Server, Firewalls und Netzwerktechnik',
    icon: 'server',
  },
  {
    handle: 'zubehoer',
    title: 'Zubehör',
    teaser: 'Dockingstations, Eingabegeräte, Taschen',
    icon: 'accessory',
  },
];

/** Deutscher Mehrwertsteuersatz für die Netto-Anzeige. */
export const VAT_RATE = 0.19;
