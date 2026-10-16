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
  /** Aufschlag auf den EK (Standard: MARKUP) */
  markup?: number;
  /** Lieferzeit-Hinweis, z. B. „2–3 Wochen“ */
  leadTime?: string;
  /** Darstellung (Gaming = dunkles Design, eigene Brotkrümel) */
  theme?: 'gaming';
  eyebrow?: string;
  groups: ConfigGroup[];
};

/** Optionen aus absoluten EK-Preisen bauen: ek = Preis − Preis der Standardkomponente. */
type Raw = [id: string, label: string, price: number, art?: string, detail?: string];
function rel(defPrice: number, rows: Raw[]): ConfigOption[] {
  return rows.map(([id, label, price, art, detail]) => ({
    id,
    label,
    ek: Math.round((price - defPrice) * 100) / 100,
    ...(art ? {art} : {}),
    ...(detail ? {detail} : {}),
  }));
}

/** Gaming: Windows-Varianten (Standard: Windows 11 Home vorinstalliert, 107,00 € EK) */
const GAMING_OS: ConfigGroup = {
  id: 'os', title: 'Betriebssystem', type: 'single', default: 'w11home',
  options: rel(107, [
    ['w11home', 'Windows 11 Home 64 Bit – vorinstalliert', 107, '6500076'],
    ['w11pro', 'Windows 11 Pro 64 Bit – vorinstalliert', 132, '6500072'],
    ['w11prohe', 'Windows 11 Pro for Workstations (High-End) – vorinstalliert', 142, '6500078', 'für Systeme mit sehr viel RAM / Profi-Anwendungen'],
    ['none', 'Ohne Betriebssystem', 0, '9990016'],
  ]),
};
const GAMING_PART: ConfigGroup = {
  id: 'part', title: 'Partitionierung', type: 'single', default: '100',
  options: [
    {id: '100', label: 'Eine Partition (100 %)', ek: 0},
    {id: '30', label: 'Zwei Partitionen 30/70 %', ek: 0},
    {id: '20', label: 'Zwei Partitionen 20/80 %', ek: 0},
  ],
};
const RAZER_MICE: Raw[] = [
  ['razer-deathadder-ess', 'Razer DeathAdder Essential', 14.9, '9820019', '6.400 dpi'],
  ['razer-viper', 'Razer Viper 8KHz', 29.9, '9823000'],
  ['razer-cobra', 'Razer Cobra', 29.9, '9820047', '58 g, 8.500 dpi'],
  ['razer-basilisk', 'Razer Basilisk V3', 39.9, '9820018', '26K dpi, RGB'],
  ['razer-deathadder-v3', 'Razer DeathAdder V3', 39.9, '9820040', '30K dpi'],
  ['razer-basilisk-pro', 'Razer Basilisk V3 Pro', 83.9, '9820048'],
];
const GAMING_EXTRAS: ConfigGroup = {
  id: 'extras', title: 'Zubehör', type: 'multi',
  options: rel(0, [
    ['kraken-x-lite', 'Headset Razer Kraken X Lite (3,5 mm)', 20.9, '4620461'],
    ['kraken-v3x', 'Headset Razer Kraken V3 X (USB)', 31.9, '4620498'],
    ['barracuda-x', 'Headset Razer Barracuda X Wireless (Bluetooth)', 57.9, '4620451'],
    ['blackshark', 'Headset Razer BlackShark V2 HyperSpeed Wireless 7.1', 71.9, '4620490'],
    ['mousepad', 'TERRA Mousepad XXL PURE Gaming', 19.99, '2810744'],
  ]),
};
const GAMING_SETUP: ConfigGroup = {
  id: 'setup', title: 'Einrichtung', type: 'multi',
  options: [
    {id: 'einrichtung', label: 'Einrichtungsservice SMIT', detail: 'Windows-Updates, Treiber, Benutzerkonto, Steam/Launcher – spielbereit geliefert', fixedNet: 67.14},
  ],
};
const SATA_SSD = (): ConfigGroup => ({
  id: 'ssd2', title: 'Zusätzliches Laufwerk', type: 'single', default: 'none',
  options: rel(0, [
    ['none', 'Keines', 0],
    ['sata1', '1 TB SSD Samsung 870 EVO (2,5" SATA)', 219 + 9.5, '2190754', 'inkl. Einbaublech'],
    ['sata2', '2 TB SSD Samsung 870 EVO (2,5" SATA)', 479 + 9.5, '2190755', 'inkl. Einbaublech'],
  ]),
});
const GAMING_INTRO = (n: string) =>
  `Ihr ${n}, gebaut nach Ihren Vorgaben von WORTMANN in Hüllhorst. Wählen Sie Prozessor, Grafikkarte, Speicher, Windows und Service – und bestellen Sie direkt online. Lieferzeit 2–3 Wochen.`;

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
          {id: 'einrichtung', label: 'Einrichtungsservice SMIT', detail: 'Updates, Treiber, Benutzer und Grundsoftware – startklar geliefert', fixedNet: 67.14},
        ],
      },
    ],
  },
  {
    slug: 'terra-pc-gamer-elite-1',
    name: 'TERRA PC GAMER ELITE 1',
    baseArt: '1000172',
    ean: '4039407089895',
    baseEk: 1266.87,
    markup: 1.12,
    leadTime: '2–3 Wochen',
    theme: 'gaming',
    eyebrow: 'Gaming-PC-Konfigurator · Bauen nach Auftrag',
    image: '/images/gaming/bg2.jpg',
    productHandle: 'terra-pc-gamer-elite-1-1000172',
    intro: GAMING_INTRO('TERRA PC GAMER ELITE 1'),
    standard: [
      'TERRA ATX Midi Tower PC605 mit Arctic-P8-Lüfter, Front-USB und SD-Kartenleser',
      'Mainboard ASUS PRO B860M-C-CSM (LGA1851, DDR5, 2× M.2, 24/7)',
      'Intel Core Ultra 200 (Arrow Lake) ready',
    ],
    groups: [
      {id: 'cpu', title: 'Prozessor', type: 'single', default: 'u5-225', options: rel(139, [
        ['u5-225', 'Intel Core Ultra 5 225', 139, '2180839', 'bis 4,9 GHz, 10 Kerne'],
        ['u5-245kf', 'Intel Core Ultra 5 245KF', 151.86, '2180771', 'bis 5,2 GHz, ohne iGPU'],
        ['u5-245k', 'Intel Core Ultra 5 245K', 169, '2180772', 'bis 5,2 GHz, 14 Kerne'],
        ['u7-270k', 'Intel Core Ultra 7 270K Plus', 269, '2180866', 'bis 5,5 GHz'],
        ['u7-265', 'Intel Core Ultra 7 265', 358.42, '2180794', 'bis 5,3 GHz, 20 Kerne'],
      ])},
      {id: 'gpu', title: 'Grafikkarte', type: 'single', default: 'rtx3050', options: rel(266.91, [
        ['rtx3050', 'NVIDIA GeForce RTX 3050 6 GB (Gigabyte Windforce OC)', 266.91, '2130585'],
        ['rx7600', 'AMD Radeon RX 7600 8 GB (Sapphire Pulse)', 282.97, '2560161'],
        ['rtx5050', 'NVIDIA GeForce RTX 5050 8 GB (ASUS Dual OC)', 381.3, '2510527'],
        ['rtx5060', 'NVIDIA GeForce RTX 5060 8 GB (MSI Ventus 2X OC)', 405.58, '2500320'],
      ])},
      {id: 'ram', title: 'Arbeitsspeicher (DDR5)', type: 'single', default: '1x16', options: rel(277.9, [
        ['2x8', '16 GB (2 × 8 GB, Dual-Channel)', 280, '2690107'],
        ['1x16', '16 GB (1 × 16 GB)', 277.9, '2690115'],
        ['2x16', '32 GB (2 × 16 GB, Dual-Channel)', 555.8, '2690115'],
        ['gskill32', '32 GB G.Skill DDR5-6000 RGB (2 × 16 GB)', 530, '2696519'],
        ['2x32', '64 GB (2 × 32 GB, Dual-Channel)', 969.8, '2690116'],
      ])},
      {id: 'ssd', title: 'SSD (M.2 NVMe)', type: 'single', default: '1tb', options: rel(176.5, [
        ['500', '500 GB SanDisk Optimus 5100 (PCIe 4.0)', 92, '2473545', 'bis 6.600 MB/s'],
        ['1tb', '1 TB SanDisk Optimus 5100 (PCIe 4.0)', 176.5, '2473544', 'bis 7.100 MB/s'],
        ['2tb', '2 TB Samsung 990 EVO Plus', 399, '2191044', 'bis 7.250 MB/s'],
        ['4tb', '4 TB Samsung 990 EVO Plus', 499, '2191045', 'bis 7.250 MB/s'],
      ])},
      SATA_SSD(),
      {id: 'psu', title: 'Netzteil', type: 'single', default: '650', options: rel(47.8, [
        ['650', 'be quiet! System Power 11 650 W (80+ Bronze)', 47.8, '2090379'],
        ['750', 'be quiet! System Power 11 750 W (80+ Bronze)', 55.2, '2090380'],
        ['850', 'be quiet! System Power 11M 850 W (80+ Gold, modular)', 67.38, '2090382'],
        ['1000', 'be quiet! Dark Power 14 1000 W (Full Modular)', 249, '2090399'],
      ])},
      {id: 'wlan', title: 'WLAN', type: 'single', default: 'wifi6', options: rel(23.99, [
        ['wifi6', 'TP-Link Wi-Fi 6 (AX1800) + Bluetooth 5.2', 23.99, '3860418'],
        ['none', 'Ohne WLAN', 0],
      ])},
      {id: 'kb', title: 'Tastatur', type: 'single', default: 'k4000', options: rel(16.74, [
        ['k4000', 'TERRA Keyboard 4000 [DE]', 16.74, '2810756'],
        ['devastator', 'Cooler Master Devastator 3 RGB [DE]', 35.9, '2000041', 'Gaming-Set Tastatur + Maus'],
        ['none', 'Ohne Tastatur', 0],
      ])},
      {id: 'mouse', title: 'Maus', type: 'single', default: 'm1500', options: rel(4.65, [
        ['m1500', 'TERRA Mouse 1500 (kabelgebunden)', 4.65, '2920513'],
        ...RAZER_MICE,
        ['none', 'Ohne Maus', 0],
      ])},
      GAMING_OS,
      GAMING_PART,
      GAMING_EXTRAS,
      GAMING_SETUP,
    ],
  },
  {
    slug: 'terra-pc-gamer-elite-2',
    name: 'TERRA PC GAMER ELITE 2 (Intel)',
    baseArt: '1000173',
    ean: '4039407089925',
    baseEk: 2059.2,
    markup: 1.12,
    leadTime: '2–3 Wochen',
    theme: 'gaming',
    eyebrow: 'Gaming-PC-Konfigurator · Bauen nach Auftrag',
    image: '/images/gaming/bg2.jpg',
    productHandle: 'terra-pc-gamer-elite-2-core-ultra-5-245k-16-gb-1-tb-w11-pro-1000173',
    intro: GAMING_INTRO('TERRA PC GAMER ELITE 2'),
    standard: [
      'Gehäuse TERRA Pure Base 501 Black – kompakt und leise',
      'Mainboard Gigabyte B860M DS3H (LGA1851, DDR5)',
      'Intel Core Ultra 200 (Arrow Lake) ready',
    ],
    groups: [
      {id: 'cpu', title: 'Prozessor', type: 'single', default: 'u5-245k', options: rel(169, [
        ['u5-245kf', 'Intel Core Ultra 5 245KF', 151.86, '2180771', 'bis 5,2 GHz, ohne iGPU'],
        ['u5-245k', 'Intel Core Ultra 5 245K', 169, '2180772', 'bis 5,2 GHz, 14 Kerne'],
        ['u7-270k', 'Intel Core Ultra 7 270K Plus', 269, '2180866', 'bis 5,5 GHz'],
      ])},
      {id: 'cooler', title: 'CPU-Kühler', type: 'single', default: 'noctua', options: rel(58, [
        ['noctua', 'Noctua NH-U9S (leiser Premium-Luftkühler)', 58, '2750121'],
        ['ml240', 'Cooler Master MasterLiquid 240 Core II ARGB (Wasserkühlung)', 65, '2750222'],
      ])},
      {id: 'gpu', title: 'Grafikkarte', type: 'single', default: 'rtx5060ti16', options: rel(737.08, [
        ['rtx5050', 'NVIDIA GeForce RTX 5050 8 GB (ASUS Dual OC)', 381.3, '2510527'],
        ['rtx5060', 'NVIDIA GeForce RTX 5060 8 GB (MSI Ventus 2X OC)', 405.58, '2500320'],
        ['rtx5060ti16', 'NVIDIA GeForce RTX 5060 Ti 16 GB (Gigabyte Windforce Max OC)', 737.08, '2130580'],
        ['rtx5070', 'NVIDIA GeForce RTX 5070 12 GB (MSI Shadow 2X OC)', 740.22, '2500333'],
        ['rtx5070ti', 'NVIDIA GeForce RTX 5070 Ti 16 GB (MSI Shadow 3X OC)', 1266.16, '2500332'],
      ])},
      {id: 'ram', title: 'Arbeitsspeicher (DDR5)', type: 'single', default: '1x16', options: rel(277.9, [
        ['1x16', '16 GB (1 × 16 GB)', 277.9, '2690115'],
        ['2x16', '32 GB (2 × 16 GB, Dual-Channel)', 555.8, '2690115'],
        ['gskill32', '32 GB G.Skill DDR5-6000 CL30 (2 × 16 GB)', 510, '2696522'],
        ['2x32', '64 GB (2 × 32 GB, Dual-Channel)', 969.8, '2690116'],
      ])},
      {id: 'ssd', title: 'SSD (M.2 NVMe)', type: 'single', default: 'pm9e1', options: rel(249, [
        ['9100-1', '1 TB Samsung 9100 Pro (PCIe 5.0)', 190, '2191090', 'bis 14.700 MB/s'],
        ['pm9e1', '1 TB Samsung PM9E1 (PCIe 5.0)', 249, '2191205', 'bis 14.000 MB/s'],
        ['sn7100', '2 TB WD Black SN7100 (PCIe 4.0)', 235, '2475596', 'bis 7.250 MB/s'],
        ['evo2', '2 TB Samsung 990 EVO Plus', 399, '2191044', 'bis 7.250 MB/s'],
        ['9100-2', '2 TB Samsung 9100 Pro (PCIe 5.0)', 499, '2191095', 'bis 14.700 MB/s'],
      ])},
      SATA_SSD(),
      {id: 'psu', title: 'Netzteil', type: 'single', default: '750', options: rel(55.2, [
        ['750', 'be quiet! System Power 11 750 W (80+ Bronze)', 55.2, '2090380'],
        ['850', 'be quiet! System Power 11M 850 W (80+ Gold, modular)', 67.38, '2090382'],
        ['1000', 'be quiet! Dark Power 14 1000 W (Full Modular)', 249, '2090399'],
      ])},
      {id: 'wlan', title: 'WLAN', type: 'single', default: 'wifi7', options: rel(39.9, [
        ['wifi7', 'Gigabyte Wi-Fi 7 + Bluetooth 5.3', 39.9, '2120845'],
        ['none', 'Ohne WLAN', 0],
      ])},
      {id: 'kb', title: 'Tastatur & Maus', type: 'single', default: 'devastator', options: rel(35.9, [
        ['devastator', 'Cooler Master Devastator 3 RGB [DE]', 35.9, '2000041', 'Gaming-Set Tastatur + Maus'],
        ['none', 'Ohne Tastatur/Maus-Set', 0],
      ])},
      {id: 'mouse', title: 'Zusätzliche Gaming-Maus', type: 'single', default: 'none', options: rel(0, [
        ['none', 'Keine', 0],
        ...RAZER_MICE,
      ])},
      {id: 'vga', title: 'Grafikkarten-Zubehör', type: 'multi', options: rel(0, [
        ['holder', 'Grafikkarten-Halterung (stabilisiert große Karten)', 12.9, '2000001'],
      ])},
      GAMING_OS,
      GAMING_PART,
      GAMING_EXTRAS,
      GAMING_SETUP,
    ],
  },
  {
    slug: 'terra-pc-gamer-elite-2-amd',
    name: 'TERRA PC GAMER ELITE 2 (AMD)',
    baseArt: '1000182',
    ean: '4039407090761',
    baseEk: 1923.32,
    markup: 1.12,
    leadTime: '2–3 Wochen',
    theme: 'gaming',
    eyebrow: 'Gaming-PC-Konfigurator · Bauen nach Auftrag',
    image: '/images/gaming/bg2.jpg',
    productHandle: 'terra-pc-gamer-elite-2-ryzen-5-9600x-16-gb-1-tb-w11-pro-1000182',
    intro: GAMING_INTRO('TERRA PC GAMER ELITE 2 mit AMD Ryzen'),
    standard: [
      'Gehäuse Cooler Master MasterBox TD500 Mesh',
      'Mainboard Gigabyte B840M DS3H (Sockel AM5, DDR5)',
      'AMD Ryzen 9000 ready',
    ],
    groups: [
      {id: 'cpu', title: 'Prozessor', type: 'single', default: 'r5-9600x', options: rel(223.56, [
        ['r5-9600x', 'AMD Ryzen 5 9600X', 223.56, '2180753', '6 Kerne / 12 Threads, bis 5,4 GHz'],
        ['r7-9700x', 'AMD Ryzen 7 9700X', 288.22, '2180752', '8 Kerne / 16 Threads, bis 5,5 GHz'],
        ['r9-9900x', 'AMD Ryzen 9 9900X', 338.1, '2180751', '12 Kerne / 24 Threads, bis 5,6 GHz'],
      ])},
      {id: 'cooler', title: 'CPU-Kühler', type: 'single', default: 'purerock3', options: rel(25, [
        ['purerock3', 'be quiet! Pure Rock 3 (Luftkühler)', 25, '2750221'],
        ['ml240', 'Cooler Master MasterLiquid 240 Core II ARGB (Wasserkühlung)', 65, '2750222'],
      ])},
      {id: 'gpu', title: 'Grafikkarte', type: 'single', default: 'rx9060xt-s', options: rel(660.25, [
        ['rtx5050', 'NVIDIA GeForce RTX 5050 8 GB (ASUS Dual OC)', 381.3, '2510527'],
        ['rtx5060', 'NVIDIA GeForce RTX 5060 8 GB (MSI Ventus 2X OC)', 405.58, '2500320'],
        ['rtx5060ti8', 'NVIDIA GeForce RTX 5060 Ti 8 GB (MSI Ventus 2X OC Plus)', 466.7, '2500319'],
        ['rx9060xt-x', 'AMD Radeon RX 9060 XT 16 GB (XFX Swift OC)', 641.9, '2520086'],
        ['rx9060xt-s', 'AMD Radeon RX 9060 XT 16 GB (Sapphire Pulse OC)', 660.25, '2560191'],
        ['rtx5070', 'NVIDIA GeForce RTX 5070 12 GB (MSI Shadow 2X OC)', 740.22, '2500333'],
        ['rx9070', 'AMD Radeon RX 9070 16 GB (Gigabyte Gaming OC)', 827.92, '2130547'],
        ['rx9070xt', 'AMD Radeon RX 9070 XT 16 GB (Gigabyte Gaming OC)', 914.73, '2130546'],
      ])},
      {id: 'ram', title: 'Arbeitsspeicher (DDR5)', type: 'single', default: '1x16', options: rel(277.9, [
        ['1x16', '16 GB (1 × 16 GB)', 277.9, '2690115'],
        ['2x16', '32 GB (2 × 16 GB, Dual-Channel)', 555.8, '2690115'],
        ['gskill32', '32 GB G.Skill DDR5-6000 CL30 (2 × 16 GB)', 510, '2696522'],
        ['2x32', '64 GB (2 × 32 GB, Dual-Channel)', 969.8, '2690116'],
      ])},
      {id: 'ssd', title: 'SSD (M.2 NVMe)', type: 'single', default: 'pm9e1', options: rel(249, [
        ['9100-1', '1 TB Samsung 9100 Pro (PCIe 5.0)', 190, '2191090', 'bis 14.700 MB/s'],
        ['pm9e1', '1 TB Samsung PM9E1 (PCIe 5.0)', 249, '2191205', 'bis 14.000 MB/s'],
        ['sn7100', '2 TB WD Black SN7100 (PCIe 4.0)', 235, '2475596', 'bis 7.250 MB/s'],
        ['evo2', '2 TB Samsung 990 EVO Plus', 399, '2191044', 'bis 7.250 MB/s'],
        ['9100-2', '2 TB Samsung 9100 Pro (PCIe 5.0)', 499, '2191095', 'bis 14.700 MB/s'],
      ])},
      SATA_SSD(),
      {id: 'psu', title: 'Netzteil', type: 'single', default: '750', options: rel(55.2, [
        ['750', 'be quiet! System Power 11 750 W (80+ Bronze)', 55.2, '2090380'],
        ['850', 'be quiet! System Power 11M 850 W (80+ Gold, modular)', 67.38, '2090382'],
        ['1000', 'be quiet! Dark Power 14 1000 W (Full Modular)', 249, '2090399'],
      ])},
      {id: 'wlan', title: 'WLAN', type: 'single', default: 'wifi6', options: rel(23.99, [
        ['wifi6', 'TP-Link Wi-Fi 6 (AX1800) + Bluetooth 5.2', 23.99, '3860418'],
        ['none', 'Ohne WLAN', 0],
      ])},
      {id: 'kb', title: 'Tastatur & Maus', type: 'single', default: 'devastator', options: rel(35.9, [
        ['devastator', 'Cooler Master Devastator 3 RGB [DE]', 35.9, '2000041', 'Gaming-Set Tastatur + Maus'],
        ['none', 'Ohne Tastatur/Maus-Set', 0],
      ])},
      {id: 'mouse', title: 'Zusätzliche Gaming-Maus', type: 'single', default: 'none', options: rel(0, [
        ['none', 'Keine', 0],
        ...RAZER_MICE,
      ])},
      GAMING_OS,
      GAMING_PART,
      GAMING_EXTRAS,
      GAMING_SETUP,
    ],
  },
  {
    slug: 'terra-pc-gamer-elite-4',
    name: 'TERRA PC GAMER ELITE 4 (Intel)',
    baseArt: '1001387',
    ean: '4039407085163',
    baseEk: 3269,
    markup: 1.12,
    leadTime: '2–3 Wochen',
    theme: 'gaming',
    eyebrow: 'Gaming-PC-Konfigurator · Bauen nach Auftrag',
    image: '/images/gaming/bg2.jpg',
    intro: GAMING_INTRO('TERRA PC GAMER ELITE 4 – das Topmodell mit GeForce RTX 5080'),
    standard: [
      'Big-Tower be quiet! Shadow Base 800 FX Window Black mit USB Type-C',
      'Mainboard ASUS TUF GAMING Z890-PLUS WIFI (LGA1851, DDR5, 4× M.2, WLAN)',
      'Ohne optisches Laufwerk',
    ],
    groups: [
      {id: 'cpu', title: 'Prozessor', type: 'single', default: 'u7-270k', options: rel(269, [
        ['u5-245kf', 'Intel Core Ultra 5 245KF', 151.86, '2180771', 'bis 5,2 GHz'],
        ['u5-245k', 'Intel Core Ultra 5 245K', 169, '2180772', 'bis 5,2 GHz'],
        ['u7-270k', 'Intel Core Ultra 7 270K Plus', 269, '2180866', 'bis 5,5 GHz'],
        ['u7-265', 'Intel Core Ultra 7 265', 358.42, '2180794', 'bis 5,3 GHz'],
        ['u9-285k', 'Intel Core Ultra 9 285K', 479, '2180767', 'bis 5,7 GHz, 24 Kerne'],
        ['u9-285', 'Intel Core Ultra 9 285', 529, '2180796', 'bis 5,7 GHz, 24 Kerne'],
      ])},
      {id: 'cooler', title: 'CPU-Kühler', type: 'single', default: 'pl360', options: rel(89, [
        ['purerock3', 'be quiet! Pure Rock 3 (Luftkühler)', 25, '2750221'],
        ['ml240', 'Cooler Master MasterLiquid 240 Core II ARGB', 65, '2750222'],
        ['pl240', 'be quiet! Pure Loop 3 LX 240 mm (Wasserkühlung)', 75, '2750236'],
        ['pl360', 'be quiet! Pure Loop 3 LX 360 mm (Wasserkühlung)', 89, '2750237'],
        ['darkrock', 'be quiet! Dark Rock Elite (Premium-Luftkühler)', 89, '2750220'],
      ])},
      {id: 'gpu', title: 'Grafikkarte', type: 'single', default: 'rtx5080', options: rel(1329.63, [
        ['rtx5060ti16', 'NVIDIA GeForce RTX 5060 Ti 16 GB (ASUS Dual OC)', 711, '2510514'],
        ['rtx5070', 'NVIDIA GeForce RTX 5070 12 GB (MSI Shadow 2X OC)', 740.22, '2500333'],
        ['rtx5070ti', 'NVIDIA GeForce RTX 5070 Ti 16 GB (MSI Shadow 3X OC)', 1266.16, '2500332'],
        ['rtx5080', 'NVIDIA GeForce RTX 5080 16 GB (Gigabyte Windforce SFF OC)', 1329.63, '2130589'],
        ['rtx5090', 'NVIDIA GeForce RTX 5090 32 GB (ASUS TUF Gaming OC)', 6386.79, '2510495'],
      ])},
      {id: 'ram', title: 'Arbeitsspeicher (DDR5)', type: 'single', default: 'gskill5600', options: rel(384, [
        ['gskill5600', '32 GB G.Skill DDR5-5600 RGB (2 × 16 GB)', 384, '2696503'],
        ['gskill6000cl30', '32 GB G.Skill DDR5-6000 CL30 (2 × 16 GB)', 510, '2696522'],
        ['gskill6400', '32 GB G.Skill DDR5-6400 CL32 RGB (2 × 16 GB)', 520, '2696505'],
        ['gskill6000rgb', '32 GB G.Skill DDR5-6000 CL36 RGB (2 × 16 GB)', 531.5, '2696504'],
        ['4x16', '64 GB (4 × 16 GB)', 1111.6, '2690115'],
        ['gskill64', '64 GB G.Skill DDR5-6400 CL32 RGB (2 × 32 GB)', 1750, '2696510'],
        ['4x32', '128 GB (4 × 32 GB)', 1939.6, '2690116'],
      ])},
      {id: 'ssd', title: 'SSD (M.2 NVMe)', type: 'single', default: 'evo2', options: rel(399, [
        ['sandisk1', '1 TB SanDisk Optimus 5100 (PCIe 4.0)', 176.5, '2473544'],
        ['9100-1', '1 TB Samsung 9100 Pro (PCIe 5.0)', 190, '2191090', 'bis 14.700 MB/s'],
        ['pm9e1', '1 TB Samsung PM9E1 (PCIe 5.0)', 249, '2191205'],
        ['990pro1', '1 TB Samsung 990 PRO (PCIe 4.0)', 319, '2190919'],
        ['evo2', '2 TB Samsung 990 EVO Plus', 399, '2191044', 'bis 7.250 MB/s'],
        ['990pro2', '2 TB Samsung 990 PRO (PCIe 4.0)', 499, '2190920'],
        ['9100-2', '2 TB Samsung 9100 Pro (PCIe 5.0)', 499, '2191095'],
        ['evo4', '4 TB Samsung 990 EVO Plus', 499, '2191045'],
        ['990pro4', '4 TB Samsung 990 PRO (PCIe 4.0)', 519, '2190983'],
        ['9100-4', '4 TB Samsung 9100 Pro (PCIe 5.0)', 790, '2191097'],
      ])},
      {id: 'ssd2', title: 'Zusätzliches Laufwerk', type: 'single', default: 'none', options: rel(0, [
        ['none', 'Keines', 0],
        ['m2-evo2', '2 TB Samsung 990 EVO Plus (M.2)', 399, '2191044'],
        ['m2-evo4', '4 TB Samsung 990 EVO Plus (M.2)', 499, '2191045'],
        ['sata1', '1 TB Samsung 870 EVO (2,5" SATA)', 228.5, '2190754', 'inkl. Einbaublech'],
        ['sata2', '2 TB Samsung 870 EVO (2,5" SATA)', 488.5, '2190755', 'inkl. Einbaublech'],
      ])},
      {id: 'psu', title: 'Netzteil', type: 'single', default: '850', options: rel(67.38, [
        ['850', 'be quiet! System Power 11M 850 W (80+ Gold, modular)', 67.38, '2090382'],
        ['pp1000', 'be quiet! Pure Power 13M 1000 W (80+ Gold)', 104.9, '2090393'],
        ['cm1250', 'Cooler Master MWE Gold 1250 W V2 (Full Modular)', 125, '2090374'],
        ['fsp1000', 'FSP Hydro PTM 1000 W (80+ Platinum)', 149, '2090108'],
        ['dp1000', 'be quiet! Dark Power 14 1000 W (Full Modular)', 249, '2090399'],
      ])},
      {id: 'kb', title: 'Tastatur', type: 'single', default: 'none', options: rel(0, [
        ['none', 'Ohne Tastatur', 0],
        ['devastator', 'Cooler Master Devastator 3 RGB [DE]', 35.9, '2000041', 'Gaming-Set Tastatur + Maus'],
      ])},
      {id: 'mouse', title: 'Maus', type: 'single', default: 'none', options: rel(0, [
        ['none', 'Ohne Maus', 0],
        ...RAZER_MICE,
      ])},
      {id: 'vga', title: 'Grafikkarten-Zubehör', type: 'multi', options: rel(0, [
        ['holder', 'Grafikkarten-Halterung (stabilisiert große Karten)', 12.9, '2000001'],
      ])},
      GAMING_OS,
      GAMING_PART,
      GAMING_EXTRAS,
      GAMING_SETUP,
    ],
  },
  {
    slug: 'terra-pc-gamer-elite-4-amd',
    name: 'TERRA PC GAMER ELITE 4 (AMD)',
    baseArt: '1001383',
    ean: '4039407083695',
    baseEk: 3499,
    markup: 1.12,
    leadTime: '2–3 Wochen',
    theme: 'gaming',
    eyebrow: 'Gaming-PC-Konfigurator · Bauen nach Auftrag',
    image: '/images/gaming/bg2.jpg',
    intro: GAMING_INTRO('TERRA PC GAMER ELITE 4 mit AMD Ryzen 7 9800X3D und GeForce RTX 5080'),
    standard: [
      'Big-Tower be quiet! Shadow Base 800 FX Window Black mit USB Type-C',
      'Mainboard ASUS PRIME X870-P WIFI (Sockel AM5, USB4, 4× M.2, WLAN)',
      'Ohne optisches Laufwerk',
    ],
    groups: [
      {id: 'cpu', title: 'Prozessor', type: 'single', default: 'r7-9800x3d', options: rel(347.94, [
        ['r7-8700g', 'AMD Ryzen 7 8700G', 214.87, '2180834', '8 Kerne, mit Radeon-Grafik'],
        ['r9-9900x', 'AMD Ryzen 9 9900X', 338.1, '2180751', '12 Kerne / 24 Threads'],
        ['r7-9800x3d', 'AMD Ryzen 7 9800X3D', 347.94, '2180783', '8 Kerne, 104 MB Cache – die Gaming-CPU'],
        ['r9-9950x', 'AMD Ryzen 9 9950X', 480.36, '2180750', '16 Kerne / 32 Threads'],
      ])},
      {id: 'cooler', title: 'CPU-Kühler', type: 'single', default: 'pl360', options: rel(89, [
        ['ml240', 'Cooler Master MasterLiquid 240 Core II ARGB', 65, '2750222'],
        ['ml360', 'Cooler Master MasterLiquid 360 Core II ARGB', 75, '2750223'],
        ['pl240', 'be quiet! Pure Loop 3 LX 240 mm (Wasserkühlung)', 75, '2750236'],
        ['pl360', 'be quiet! Pure Loop 3 LX 360 mm (Wasserkühlung)', 89, '2750237'],
      ])},
      {id: 'gpu', title: 'Grafikkarte', type: 'single', default: 'rtx5080', options: rel(1329.63, [
        ['rtx5060', 'NVIDIA GeForce RTX 5060 8 GB (MSI Ventus 2X OC)', 405.58, '2500320'],
        ['rtx5060ti8', 'NVIDIA GeForce RTX 5060 Ti 8 GB (MSI Ventus 2X OC Plus)', 466.7, '2500319'],
        ['rtx5070', 'NVIDIA GeForce RTX 5070 12 GB (MSI Shadow 2X OC)', 740.22, '2500333'],
        ['rtx5070ti', 'NVIDIA GeForce RTX 5070 Ti 16 GB (MSI Shadow 3X OC)', 1266.16, '2500332'],
        ['rtx5080', 'NVIDIA GeForce RTX 5080 16 GB (Gigabyte Windforce SFF OC)', 1329.63, '2130589'],
        ['rtx5090', 'NVIDIA GeForce RTX 5090 32 GB (ASUS TUF Gaming OC)', 6386.79, '2510495'],
      ])},
      {id: 'ram', title: 'Arbeitsspeicher (DDR5)', type: 'single', default: 'gskill-fx5', options: rel(530, [
        ['2x8', '16 GB (2 × 8 GB)', 279.8, '2690101'],
        ['gskill-cl36', '32 GB G.Skill DDR5-6000 CL36 (2 × 16 GB, AMD EXPO)', 475, '2696513'],
        ['gskill-fx5', '32 GB G.Skill DDR5-6000 CL32 (2 × 16 GB, AMD EXPO)', 530, '2696512'],
        ['gskill-rgb', '32 GB G.Skill DDR5-6000 CL32 RGB (2 × 16 GB, AMD EXPO)', 530, '2696519'],
        ['gskill64', '64 GB G.Skill DDR5-6400 CL32 RGB (2 × 32 GB)', 1750, '2696510'],
      ])},
      {id: 'ssd', title: 'SSD (M.2 NVMe)', type: 'single', default: 'evo2', options: rel(399, [
        ['sandisk1', '1 TB SanDisk Optimus 5100 (PCIe 4.0)', 176.5, '2473544'],
        ['9100-1', '1 TB Samsung 9100 Pro (PCIe 5.0)', 190, '2191090', 'bis 14.700 MB/s'],
        ['pm9e1', '1 TB Samsung PM9E1 (PCIe 5.0)', 249, '2191205'],
        ['evo2', '2 TB Samsung 990 EVO Plus', 399, '2191044', 'bis 7.250 MB/s'],
        ['9100-2', '2 TB Samsung 9100 Pro (PCIe 5.0)', 499, '2191095'],
        ['evo4', '4 TB Samsung 990 EVO Plus', 499, '2191045'],
        ['9100-4', '4 TB Samsung 9100 Pro (PCIe 5.0)', 790, '2191097'],
      ])},
      {id: 'ssd2', title: 'Zusätzliches Laufwerk', type: 'single', default: 'none', options: rel(0, [
        ['none', 'Keines', 0],
        ['m2-evo2', '2 TB Samsung 990 EVO Plus (M.2)', 399, '2191044'],
        ['m2-evo4', '4 TB Samsung 990 EVO Plus (M.2)', 499, '2191045'],
        ['sata1', '1 TB Samsung 870 EVO (2,5" SATA)', 228.5, '2190754', 'inkl. Einbaublech'],
        ['sata2', '2 TB Samsung 870 EVO (2,5" SATA)', 488.5, '2190755', 'inkl. Einbaublech'],
      ])},
      {id: 'psu', title: 'Netzteil', type: 'single', default: '850', options: rel(67.38, [
        ['850', 'be quiet! System Power 11M 850 W (80+ Gold, modular)', 67.38, '2090382'],
        ['cm750', 'Cooler Master 750 W Gold (Full Modular, 24/7)', 77.9, '2090373'],
        ['pp1000', 'be quiet! Pure Power 13M 1000 W (80+ Gold)', 104.9, '2090393'],
        ['cm1250', 'Cooler Master MWE Gold 1250 W V2 (Full Modular)', 125, '2090374'],
        ['dp1000', 'be quiet! Dark Power 14 1000 W (Full Modular)', 249, '2090399'],
      ])},
      {id: 'kb', title: 'Tastatur', type: 'single', default: 'none', options: rel(0, [
        ['none', 'Ohne Tastatur', 0],
        ['devastator', 'Cooler Master Devastator 3 RGB [DE]', 35.9, '2000041', 'Gaming-Set Tastatur + Maus'],
      ])},
      {id: 'mouse', title: 'Maus', type: 'single', default: 'none', options: rel(0, [
        ['none', 'Ohne Maus', 0],
        ...RAZER_MICE,
      ])},
      {id: 'vga', title: 'Grafikkarten-Zubehör', type: 'multi', options: rel(0, [
        ['holder', 'Grafikkarten-Halterung (stabilisiert große Karten)', 12.9, '2000001'],
        ['cable', 'be quiet! 12V-2x6 Kabel, 90° abgewinkelt', 15.9, '2560171'],
      ])},
      GAMING_OS,
      GAMING_PART,
      GAMING_EXTRAS,
      GAMING_SETUP,
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
  const system = round2(ek * (m.markup ?? MARKUP));
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
