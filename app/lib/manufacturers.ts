/**
 * Herstellerinformationen je Shopify-Hersteller (vendor) – Angaben nach GPSR
 * (Name, Postanschrift, elektronische Kontaktadresse).
 * Unbekannte Hersteller fallen auf WORTMANN zurück (Großteil des Sortiments).
 */
export type Manufacturer = {
  name: string;
  lines: string[];
  email?: string;
  web?: string;
};

const WORTMANN: Manufacturer = {
  name: 'Wortmann AG',
  lines: ['Bredenhop 20', 'DE 32609 Hüllhorst', 'Deutschland'],
  email: 'info@wortmann.de',
  web: 'https://www.wortmann.de',
};

export const MANUFACTURERS: Record<string, Manufacturer> = {
  terra: WORTMANN,
  wortmann: WORTMANN,
  'wortmann ag': WORTMANN,
  microsoft: {
    name: 'Microsoft Ireland Operations Limited',
    lines: ['One Microsoft Place', 'South County Business Park', 'Leopardstown, Dublin D18 P521', 'Irland'],
    web: 'https://www.microsoft.com/de-de',
  },
  eset: {
    name: 'ESET, spol. s r.o.',
    lines: ['Einsteinova 24', '851 01 Bratislava', 'Slowakei'],
    web: 'https://www.eset.com/de/',
  },
  'smit digital services': {
    name: 'SMIT Digital Services, Inhaber Simon Manigel',
    lines: ['Schlangenweg 73', 'DE 33415 Verl', 'Deutschland'],
    email: 'info@wawi-servicepartner.de',
    web: 'https://www.terra-computershop.de',
  },
};

export function manufacturerFor(vendor?: string | null): Manufacturer {
  return MANUFACTURERS[(vendor ?? '').trim().toLowerCase()] ?? WORTMANN;
}
