/**
 * Zubuchbare Leistungen und Software für Computer (Produktseite → "Dazu bestellen").
 * Handles verweisen auf Shopify-Produkte. Pro Gruppe ist höchstens eine Auswahl möglich.
 */
export type AddonGroup = 'service' | 'windows' | 'office' | 'security';

export const ADDONS: {handle: string; group: AddonGroup; label: string; hint: string}[] = [
  {handle: 'einrichtungsservice', group: 'service', label: 'Einrichtungsservice', hint: 'Startklar eingerichtet: Windows, Updates, Treiber, Software'},
  {handle: 'windows-11-pro-oem-vorinstalliert-6500072', group: 'windows', label: 'Windows 11 Pro – vorinstalliert', hint: 'OEM-Lizenz ab Werk installiert, inkl. Recovery-DVD'},
  {handle: 'office-2024-home-business-6530250', group: 'office', label: 'Office 2024 Home & Business', hint: 'Einmalkauf, gewerbliche Nutzung'},
  {handle: 'microsoft-365-business-standard-6530188', group: 'office', label: 'Microsoft 365 Business Standard', hint: '1 Jahr, inkl. Teams & Exchange'},
  {handle: 'office-2024-home-6530254', group: 'office', label: 'Office 2024 Home', hint: 'Einmalkauf, private Nutzung'},
  {handle: 'eset-home-security-premium-6690089', group: 'security', label: 'ESET HOME Security Premium', hint: '1 Gerät, 1 Jahr'},
  {handle: 'eset-home-security-essential-6690088', group: 'security', label: 'ESET HOME Security Essential', hint: '1 Gerät, 1 Jahr'},
];

export const ADDON_GROUP_TITLES: Record<AddonGroup, string> = {
  service: 'Einrichtung',
  windows: 'Betriebssystem',
  office: 'Office',
  security: 'Virenschutz',
};

/** Produkttypen, bei denen die Zusatzleistungen angeboten werden. */
export const ADDON_PRODUCT_TYPES = ['Desktop-PC', 'Notebook', 'All-in-One-PC'];

/**
 * Produkttypen mit wählbarem TERRA-Service.
 * PCs/AIO: eigenes Produkt je Gerät "vor-ort-service-<artikelnr>" (Preis abhängig vom Gerät).
 * Monitore: ein gemeinsames Produkt "terra-lcd-vor-ort-service" für alle TERRA LCDs.
 */
export const SERVICE_PRODUCT_TYPES = ['Desktop-PC', 'All-in-One-PC', 'Monitor'];

export const LCD_SERVICE_HANDLE = 'terra-lcd-vor-ort-service';

export type ServiceTexts = {base: string; prefix: string; note: string};

export function serviceTextsFor(productType?: string | null): ServiceTexts {
  if (productType === 'Monitor') {
    return {
      base: 'Vor-Ort-Austausch-Service 24 Monate',
      prefix: '',
      note: 'Vor-Ort-Austausch: Bei einem Defekt wird der Monitor bei Ihnen ausgetauscht. Pixelservice: Austausch bereits bei Pixelfehlern.',
    };
  }
  return {
    base: 'Bring-In-Service 24 Monate',
    prefix: '24H Vor-Ort-Service ',
    note: 'Vor-Ort-Service: Techniker am nächsten Werktag, defekte Datenträger bleiben bei Ihnen.',
  };
}

/** Optionen, die nur über die Produktseite gebucht werden (nicht in Kategorien/Suche). */
export const OPTION_PRODUCT_TYPES = ['Service-Option', 'Software-Option'];

export function serviceHandleFor(productType?: string | null, sku?: string | null) {
  if (productType === 'Monitor') return LCD_SERVICE_HANDLE;
  return sku ? `vor-ort-service-${sku.toLowerCase()}` : null;
}

export function addonHandlesFor(hasWindows: boolean) {
  return ADDONS.filter((a) => (hasWindows ? a.group !== 'windows' : true)).map((a) => a.handle);
}

/** Betriebssystem laut Filter-Tag (f:os-…). */
export function osFromTags(tags?: string[] | null): 'pro' | 'home' | 'none' | null {
  if (!tags) return null;
  if (tags.includes('f:os-w11-pro')) return 'pro';
  if (tags.includes('f:os-w11-home')) return 'home';
  if (tags.includes('f:os-ohne')) return 'none';
  return null;
}

/** Tag, mit dem man beliebige Produkte aus Listen, Suche und Empfehlungen ausblendet. */
export const HIDDEN_TAG = 'ausblenden';

/** Storefront-Suchfilter: keine Options-/Service-Produkte und nichts mit Tag "ausblenden". */
export const LISTING_EXCLUDE_QUERY =
  "-product_type:'Service-Option' -product_type:'Software-Option' -tag:'ausblenden'";

/** Soll ein Produkt in Listen/Empfehlungen erscheinen? */
export function isListable(p: {productType?: string | null; tags?: string[] | null}) {
  return !OPTION_PRODUCT_TYPES.includes(p.productType ?? '') && !(p.tags ?? []).includes(HIDDEN_TAG);
}
