/**
 * SEO-Themenseiten (/themen/<slug>) für konkrete Suchanfragen aus der Search Console.
 * Jede Seite hat eigenen Ratgeber-Inhalt und zeigt die passenden Produkte live aus dem Shop.
 */
export type LandingFaq = {q: string; a: string};

export type Landing = {
  slug: string;
  keyword: string; // Haupt-Suchbegriff
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  /** Storefront-Suchquery für die Produkte */
  productQuery: string;
  /** Link zur passenden Kategorie (mit Filtern) */
  category: {label: string; href: string};
  /** Großes Produktbild oben (Produkt-Handle) mit kurzer Bildunterschrift */
  hero?: {handle: string; caption: string};
  /** Vergleichstabelle aus den Produkt-Tags erzeugen */
  compare?: 'monitor';
  guide: {title: string; text: string}[];
  faq: LandingFaq[];
  related: {label: string; href: string}[];
};

export const LANDINGS: Landing[] = [
  {
    slug: 'terra-monitor-27-zoll',
    keyword: 'TERRA Monitor 27 Zoll',
    h1: 'TERRA Monitor 27 Zoll',
    metaTitle: 'TERRA Monitor 27 Zoll kaufen – Full HD & WQHD, höhenverstellbar | terra-computershop.de',
    metaDescription:
      'TERRA 27-Zoll-Monitore von WORTMANN im Vergleich: Full HD oder WQHD (2K), IPS-Panel, höhenverstellbar mit Pivot, USB-C mit Power Delivery. Alle Modelle mit Preis – direkt bestellen.',
    intro: [
      'Ein 27-Zoll-Monitor bietet spürbar mehr Arbeitsfläche als die klassischen 24 Zoll: zwei Dokumente nebeneinander, große Tabellen, Videokonferenz plus Notizen – ohne zweites Display.',
      'Alle TERRA LCD/LED-Monitore in 27 Zoll (68,6 cm) nutzen IPS-Panels mit blickwinkelstabilen Farben. Unterschiede gibt es bei Auflösung, Standfuß und Anschlüssen – die Übersicht unten hilft bei der Auswahl.',
    ],
    productQuery: 'product_type:Monitor AND tag:"sub:27-zoll"',
    category: {label: 'Alle 27-Zoll-Monitore mit Filtern', href: '/collections/monitore?sub=27-zoll'},
    hero: {
      handle: 'terra-lcd-led-2775w-pv-v3-2k-ips-black-usb-c-dp-hdmi-3030231',
      caption: 'Topmodell: TERRA LCD/LED 2775W PV V3 – WQHD, höhenverstellbar mit Pivot, USB-C-Dock',
    },
    compare: 'monitor',
    guide: [
      {
        title: 'Full HD oder WQHD (2K)?',
        text: 'Bei 27 Zoll ergibt Full HD (1920 × 1080) rund 82 Pixel pro Zoll – gut für Office und größeren Sitzabstand. WQHD (2560 × 1440, bei TERRA „2K“) liefert rund 109 ppi: deutlich schärfere Schrift und mehr Platz für Fenster. Für Tabellen, CAD und Bildbearbeitung empfehlen wir WQHD.',
      },
      {
        title: 'Höhenverstellbar und Pivot (PV / HA)',
        text: 'Modelle mit „HA“ sind höhenverstellbar, „PV“-Modelle zusätzlich drehbar ins Hochformat (Pivot). Für ergonomisches Arbeiten am Büroarbeitsplatz ist ein höhenverstellbarer Fuß die beste Wahl.',
      },
      {
        title: 'USB-C mit Power Delivery',
        text: 'Mit USB-C überträgt ein einziges Kabel Bild, Ton und Daten – und lädt bei Power Delivery gleichzeitig das Notebook. Einige Modelle haben zusätzlich einen integrierten USB-Hub bzw. Dock-Funktionen.',
      },
      {
        title: '100 Hz für flüssiges Arbeiten',
        text: 'Mehrere 27-Zoll-Modelle bieten 100 Hz Bildwiederholrate. Scrollen und Mausbewegungen wirken flüssiger – angenehm auch im normalen Büroalltag.',
      },
    ],
    faq: [
      {
        q: 'Wie groß ist ein 27-Zoll-Monitor?',
        a: '27 Zoll entsprechen 68,6 cm Bilddiagonale. Im 16:9-Format ist die sichtbare Fläche etwa 60 × 34 cm, mit Standfuß ist der Monitor rund 61 cm breit.',
      },
      {
        q: 'Welcher TERRA 27-Zoll-Monitor ist der günstigste?',
        a: 'Der Einstieg ist der TERRA LCD/LED 2727W V3 mit Full HD, IPS-Panel und 100 Hz. Die aktuellen Preise aller Modelle sehen Sie in der Übersicht oben.',
      },
      {
        q: 'Brauche ich WQHD bei 27 Zoll?',
        a: 'Für reine Office-Arbeit genügt Full HD. Wer viel mit Tabellen, mehreren Fenstern oder Grafik arbeitet, profitiert von der schärferen WQHD-Auflösung.',
      },
      {
        q: 'Gibt es TERRA Monitore auch größer als 27 Zoll?',
        a: 'Ja. Für noch mehr Arbeitsfläche gibt es TERRA Monitore mit 32 Zoll (81,3 cm) – zum Beispiel den TERRA LCD/LED 3285W HA mit gebogenem WQHD-Display (Curved), 100 Hz und USB-C sowie den 3295W PV mit 4K-Auflösung. Alle Modelle finden Sie unter „32-Zoll-Monitore“.',
      },
      {
        q: 'Gibt es Vor-Ort-Service für TERRA Monitore?',
        a: 'Ja. TERRA Monitore haben 24 Monate Vor-Ort-Austausch-Service inklusive; optional zubuchbar sind längere Laufzeiten bis 60 Monate und Pixelservice.',
      },
    ],
    related: [
      {label: 'Höhenverstellbare Monitore', href: '/collections/monitore?sub=hoehenverstellbar'},
      {label: '24-Zoll-Monitore', href: '/collections/monitore?sub=24-zoll'},
      {label: '32-Zoll-Monitore', href: '/collections/monitore?sub=32-zoll'},
      {label: 'Multimonitor-Arbeitsplatz', href: '/loesungen/multimonitor-arbeitsplatz'},
    ],
  },
];

export function findLanding(slug?: string) {
  return LANDINGS.find((l) => l.slug === slug);
}

/** Monitor-Eigenschaften aus den Filter-Tags (f:…) lesen */
export function monitorSpecs(tags: string[]) {
  const has = (t: string) => tags.includes(`f:${t}`);
  return {
    resolution: has('res-wqhd') ? 'WQHD 2560 × 1440' : has('res-4k') ? '4K UHD' : 'Full HD 1920 × 1080',
    stand: has('pivot') ? 'höhenverstellbar + Pivot' : has('hv') ? 'höhenverstellbar' : 'neigbar',
    usbc: has('usbc-dock') ? 'USB-C (PD, Dock)' : has('usbc-pd') ? 'USB-C (Power Delivery)' : 'USB-C',
    hz: has('hz-100') ? '100 Hz' : '–',
  };
}
