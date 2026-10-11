/**
 * PC-Konfigurator (Bauen nach Auftrag / BTO).
 *
 * Alle Preise in `ek` sind Einkaufspreise netto (WORTMANN-HEK). Für die
 * Anzeige wird mit MARKUP aufgeschlagen. Optionen tragen die Differenz zur
 * Standardkomponente (delta), damit der Grundpreis die Basiskonfiguration ist.
 * `fixedNet` = fester Verkaufspreis netto (ohne Aufschlag, z. B. Dienstleistung).
 */
export const MARKUP = 1.2;

export type ConfigOption = {id: string; label: string; detail?: string; ek?: number; fixedNet?: number; art?: string};
export type ConfigGroup = {
  id: string;
  title: string;
  type: 'single' | 'multi';
  options: ConfigOption[];
  /** Vorauswahl (single) */
  default?: string;
};

export type ConfigModel = {
  slug: string;
  name: string;
  baseArt: string;
  ean: string;
  baseEk: number;
  intro: string;
  standard: string[];
  image?: string;
  productHandle?: string;
  groups: ConfigGroup[];
};

/** Vor-Ort-Service: Verkaufspreis = Anteil am Systempreis (min. Betrag netto). */
export const SERVICE_TIERS = [
  {id: 'bring-in', label: 'Bring-In-Service 24 Monate', detail: 'im Preis enthalten', pct: 0, minNet: 0},
  {id: 'vo-24', label: '24H Vor-Ort-Service 24 Monate', detail: 'inkl. Medieneinbehalt', pct: 0.035, minNet: 12},
  {id: 'vo-36', label: '24H Vor-Ort-Service 36 Monate', detail: 'inkl. Medieneinbehalt', pct: 0.06, minNet: 18},
  {id: 'vo-48', label: '24H Vor-Ort-Service 48 Monate', detail: 'inkl. Medieneinbehalt', pct: 0.095, minNet: 24},
  {id: 'vo-60', label: '24H Vor-Ort-Service 60 Monate', detail: 'inkl. Medieneinbehalt', pct: 0.14, minNet: 30},
];

export const CONFIG_MODELS: ConfigModel[] = [
  {
    slug: 'terra-pc-business-6000',
    name: 'TERRA PC-BUSINESS 6000',
    baseArt: '1000133',
    ean: '4039407088065',
    baseEk: 792.32,
    image: '/images/loesungen/tower-familie.webp',
    productHandle:
      'terra-pc-business-6000-core-ultra-5-225-16-gb-500-gb-w11-pro-art-nr-1000133-1000133',
    intro:
      'Ihr TERRA Business-PC, gebaut nach Ihren Vorgaben in Hüllhorst. Wählen Sie Prozessor, Speicher, Grafik und Ausstattung – wir senden Ihnen innerhalb von einem Werktag ein verbindliches Angebot.',
    standard: [
      'Gehäuse TERRA µATX Micro-Tower PC212, USB Type-C',
      'Mainboard ASUS PRO B860M-C-CSM (LGA1851, DDR5, 2× DP + HDMI, 2× M.2)',
      'Intel Core Ultra 200 (Arrow Lake) ready',
    ],
    groups: [
      {
        id: 'cpu', title: 'Prozessor', type: 'single', default: 'u5-225',
        options: [
          {id: 'u5-225', label: 'Intel Core Ultra 5 225', detail: 'bis 4,9 GHz, 13 TOPS NPU', ek: 0, art: '2180839'},
          {id: 'u7-265', label: 'Intel Core Ultra 7 265', detail: 'bis 5,3 GHz, 13 TOPS NPU', ek: 217.22, art: '2180794'},
        ],
      },
      {
        id: 'ram', title: 'Arbeitsspeicher (DDR5)', type: 'single', default: '1x8',
        options: [
          {id: '1x8', label: '8 GB (1 × 8 GB)', ek: 0, art: '2690151'},
          {id: '2x8', label: '16 GB (2 × 8 GB, Dual-Channel)', ek: 131, art: '2690151'},
          {id: '1x16', label: '16 GB (1 × 16 GB)', ek: 144.9, art: '2690115'},
          {id: '2x16', label: '32 GB (2 × 16 GB, Dual-Channel)', ek: 420.8, art: '2690115'},
          {id: '1x32', label: '32 GB (1 × 32 GB)', ek: 353.9, art: '2690116'},
          {id: '2x32', label: '64 GB (2 × 32 GB, Dual-Channel)', ek: 838.8, art: '2690116'},
        ],
      },
      {
        id: 'ssd', title: 'SSD (M.2 NVMe)', type: 'single', default: '500',
        options: [
          {id: '250', label: '250 GB PCIe 4.0', detail: 'bis 4.000 MB/s', ek: -35.25, art: '2470415'},
          {id: '500', label: '500 GB PCIe 4.0 (SanDisk Optimus 5100)', detail: 'bis 6.600 MB/s', ek: 0, art: '2473545'},
          {id: '1tb', label: '1 TB PCIe 4.0 (SanDisk Optimus 5100)', detail: 'bis 7.100 MB/s', ek: 84, art: '2473544'},
          {id: '2tb', label: '2 TB PCIe 5.0', detail: 'bis 7.250 MB/s', ek: 307.5, art: '2191044'},
          {id: '4tb', label: '4 TB PCIe 5.0', detail: 'bis 7.250 MB/s', ek: 407.5, art: '2191045'},
        ],
      },
      {
        id: 'ssd2', title: 'Zusätzliche SSD (2,5" SATA)', type: 'single', default: 'none',
        options: [
          {id: 'none', label: 'Keine', ek: 0},
          {id: '250', label: '250 GB Samsung 870 EVO', ek: 120.5, art: '2190752'},
          {id: '500', label: '500 GB Samsung 870 EVO', ek: 158.5, art: '2190753'},
          {id: '1tb', label: '1 TB Samsung 870 EVO', ek: 228.5, art: '2190754'},
        ],
      },
      {
        id: 'hdd', title: 'Zusätzliche Festplatte', type: 'single', default: 'none',
        options: [
          {id: 'none', label: 'Keine', ek: 0},
          {id: '1tb', label: '1 TB HDD 3,5" SATA (5.400 U/min)', ek: 117, art: '2475212'},
        ],
      },
      {
        id: 'gpu', title: 'Grafik', type: 'single', default: 'igpu',
        options: [
          {id: 'igpu', label: 'Integrierte Intel-Grafik', detail: '2× DisplayPort + HDMI', ek: 0},
          {id: 'gt1030', label: 'NVIDIA GeForce GT 1030 2 GB (passiv)', ek: 87.12, art: '2510047'},
          {id: 'rx6400', label: 'AMD Radeon RX 6400 4 GB', ek: 174.24, art: '2520066'},
          {id: 'a400', label: 'NVIDIA RTX A400 4 GB (4× mDP)', detail: 'Profi-Grafik für CAD', ek: 230, art: '2590592'},
          {id: 'rtx3050', label: 'NVIDIA GeForce RTX 3050 LP 6 GB', ek: 265.27, art: '2500330'},
          {id: 'a1000', label: 'NVIDIA RTX A1000 8 GB (4× mDP)', detail: 'Profi-Grafik für CAD', ek: 510, art: '2590594'},
          {id: 'arcb50', label: 'Intel Arc Pro B50 16 GB (4× mDP)', detail: 'Profi-Grafik', ek: 521.06, art: '3750146'},
        ],
      },
      {
        id: 'psu', title: 'Netzteil', type: 'single', default: '350',
        options: [
          {id: '350', label: '350 W Bronze', detail: 'Standardbetrieb, max. 60 Std./Woche', ek: 0, art: '2090252'},
          {id: '400', label: '400 W Bronze 24/7', detail: 'für Dauerbetrieb', ek: 2.1, art: '2090180'},
          {id: '550', label: '550 W Bronze 24/7', detail: 'für Dauerbetrieb und Grafikkarten', ek: 35.43, art: '2090214'},
        ],
      },
      {
        id: 'extras', title: 'Ausstattung', type: 'multi',
        options: [
          {id: 'wlan', label: 'WLAN Wi-Fi 6E + Bluetooth 5.4 (Intel AX210)', ek: 28.08, art: '2110379'},
          {id: 'nic', label: 'Netzwerkkarte 2 × 1 GbE (Broadcom)', ek: 37, art: '3750108'},
          {id: 'com', label: 'Serielle Schnittstelle (COM DB9)', ek: 4.9, art: '2119028'},
          {id: 'dvd', label: 'DVD-Brenner (Slim)', ek: 19.9, art: '2260002'},
          {id: 'fan', label: 'Zusätzlicher Gehäuselüfter 80 mm (24/7)', ek: 4.79, art: '2750117'},
        ],
      },
      {
        id: 'mouse', title: 'Maus', type: 'single', default: 'm1500',
        options: [
          {id: 'm1500', label: 'TERRA Mouse 1500 (kabelgebunden)', ek: 0, art: '2920513'},
          {id: 'm4000', label: 'TERRA Mouse 4000 Wireless Silent', ek: 3.38, art: '2920558'},
          {id: 'cherry', label: 'CHERRY GENTIX SILENT', ek: 8.25, art: '2810070'},
          {id: 'none', label: 'Ohne Maus', ek: -4.65},
        ],
      },
      {
        id: 'kb', title: 'Tastatur', type: 'single', default: 'k1500',
        options: [
          {id: 'k1500', label: 'TERRA Keyboard 1500 [DE] (kabelgebunden, Copilot-Taste)', ek: 0, art: '2810714'},
          {id: 'k4000', label: 'TERRA Keyboard 4000 [DE] (kabelgebunden, Copilot-Taste)', ek: 8.84, art: '2810756'},
          {id: 'mk270', label: 'Logitech MK270 Wireless Desktop [DE]', detail: 'Tastatur + Maus', ek: 7, art: '2920400'},
          {id: 'd4000', label: 'TERRA Desktop 4000 Wireless AES [DE]', detail: 'Tastatur + Maus, verschlüsselt', ek: 20.09, art: '2810757'},
          {id: 'none', label: 'Ohne Tastatur', ek: -7.9},
        ],
      },
      {
        id: 'os', title: 'Betriebssystem', type: 'single', default: 'none',
        options: [
          {id: 'none', label: 'Ohne Betriebssystem', ek: 0, art: '9990016'},
          {id: 'w11pro', label: 'Windows 11 Pro 64 Bit OEM – vorinstalliert', detail: 'inkl. Windows-11-Logo und Recovery-DVD', ek: 133.5, art: '6500072'},
        ],
      },
      {
        id: 'part', title: 'Partitionierung', type: 'single', default: '100',
        options: [
          {id: '100', label: 'Eine Partition (100 %)', ek: 0},
          {id: '50', label: 'Zwei Partitionen 50/50 %', ek: 0},
          {id: '40', label: 'Zwei Partitionen 40/60 %', ek: 0},
          {id: '30', label: 'Zwei Partitionen 30/70 %', ek: 0},
          {id: '20', label: 'Zwei Partitionen 20/80 %', ek: 0},
        ],
      },
      {
        id: 'setup', title: 'Einrichtung', type: 'multi',
        options: [
          {id: 'einrichtung', label: 'Einrichtungsservice SMIT', detail: 'Updates, Treiber, Benutzer und Grundsoftware – startklar geliefert', fixedNet: 49.9},
        ],
      },
    ],
  },
];

export function findModel(slug?: string) {
  return CONFIG_MODELS.find((m) => m.slug === slug) ?? null;
}

export type Selection = Record<string, string | string[]>;

export function defaultSelection(m: ConfigModel): Selection {
  const sel: Selection = {};
  for (const g of m.groups) sel[g.id] = g.type === 'multi' ? [] : g.default ?? g.options[0].id;
  return sel;
}

/** Netto-Verkaufspreise: System (Hardware + Software), Einrichtung, Service. */
export function priceOf(m: ConfigModel, sel: Selection, serviceId: string) {
  let ek = m.baseEk;
  let fixed = 0;
  for (const g of m.groups) {
    const ids = ([] as string[]).concat(sel[g.id] ?? []);
    for (const id of ids) {
      const o = g.options.find((x) => x.id === id);
      if (!o) continue;
      ek += o.ek ?? 0;
      fixed += o.fixedNet ?? 0;
    }
  }
  const system = round2(ek * MARKUP);
  const tier = SERVICE_TIERS.find((t) => t.id === serviceId) ?? SERVICE_TIERS[0];
  const service = tier.pct ? round2(Math.max(system * tier.pct, tier.minNet)) : 0;
  return {system, fixed, service, total: round2(system + fixed + service)};
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/** Klartext der Konfiguration (für Anfrage-Mail). */
export function describe(m: ConfigModel, sel: Selection, serviceId: string) {
  const lines: string[] = [`${m.name} (Basis Art.-Nr. ${m.baseArt})`];
  for (const g of m.groups) {
    const ids = ([] as string[]).concat(sel[g.id] ?? []);
    const labels = ids
      .map((id) => g.options.find((o) => o.id === id))
      .filter(Boolean)
      .map((o) => `${o!.label}${o!.art ? ` [${o!.art}]` : ''}`);
    if (labels.length) lines.push(`- ${g.title}: ${labels.join(', ')}`);
  }
  const tier = SERVICE_TIERS.find((t) => t.id === serviceId) ?? SERVICE_TIERS[0];
  lines.push(`- Service: ${tier.label}`);
  return lines.join('\n');
}
