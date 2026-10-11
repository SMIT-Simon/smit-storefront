/**
 * Zubuchbare Leistungen und Software für Computer (Produktseite → "Dazu bestellen").
 * Handles verweisen auf Shopify-Produkte. Pro Gruppe ist höchstens eine Auswahl möglich.
 */
export type AddonGroup = 'service' | 'windows' | 'office' | 'security';

export const ADDONS: {handle: string; group: AddonGroup; label: string; hint: string}[] = [
  {handle: 'einrichtungsservice', group: 'service', label: 'Einrichtungsservice', hint: 'Startklar eingerichtet: Windows, Updates, Treiber, Software'},
  {handle: 'windows-11-pro-system-builder-6530217', group: 'windows', label: 'Windows 11 Pro', hint: 'System-Builder-Lizenz, auf Wunsch vorinstalliert'},
  {handle: 'windows-11-home-system-builder-6530210', group: 'windows', label: 'Windows 11 Home', hint: 'System-Builder-Lizenz'},
  {handle: 'office-2024-home-business-6530250', group: 'office', label: 'Office 2024 Home & Business', hint: 'Einmalkauf, gewerbliche Nutzung'},
  {handle: 'microsoft-365-business-standard-6530188', group: 'office', label: 'Microsoft 365 Business Standard', hint: '1 Jahr, inkl. Teams & Exchange'},
  {handle: 'office-2024-home-6530254', group: 'office', label: 'Office 2024 Home', hint: 'Einmalkauf, private Nutzung'},
  {handle: 'eset-home-security-premium-6690089', group: 'security', label: 'ESET HOME Security Premium', hint: '1 Gerät, 1 Jahr'},
  {handle: 'eset-home-security-essential-6690088', group: 'security', label: 'ESET HOME Security Essential', hint: '1 Gerät, 1 Jahr'},
];

export const ADDON_GROUP_TITLES: Record<AddonGroup, string> = {
  service: 'Service',
  windows: 'Betriebssystem',
  office: 'Office',
  security: 'Virenschutz',
};

/** Produkttypen, bei denen die Zusatzleistungen angeboten werden. */
export const ADDON_PRODUCT_TYPES = ['Desktop-PC', 'Notebook', 'All-in-One-PC'];

export function addonHandlesFor(hasWindows: boolean) {
  return ADDONS.filter((a) => hasWindows ? a.group !== 'windows' : true).map((a) => a.handle);
}
