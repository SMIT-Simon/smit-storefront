/**
 * Monatsaktion „PC des Monats“ (nach WORTMANN-Newsletter).
 * Für den nächsten Monat: Handle, Texte und Enddatum austauschen.
 * Preis/Streichpreis werden in Shopify gepflegt (compareAtPrice = Preis vor der Aktion).
 */
export const PC_OF_MONTH = {
  month: 'November',
  /** Letzter Aktionstag 30.11.2026 (Ende = Mitternacht deutscher Zeit) */
  endsAt: '2026-12-01T00:00:00+01:00',
  endLabel: '30.11.2026',
  path: '/aktion/pc-des-monats',
  handle: 'terra-pc-mini-5000v6-1-1000078',
  name: 'TERRA PC MINI 5000V6.1',
  claim: 'Kompakter Büro-PC mit Windows 11 Pro – für drei Monitore, im Vollmetallgehäuse aus Deutschland.',
  bullets: [
    'Intel® Core™ i3-14100 (14. Gen.), 4 Kerne / 8 Threads, bis 4,7 GHz',
    'Windows 11 Pro vorinstalliert',
    '8 GB DDR5 (bis 64 GB) · 500 GB NVMe-SSD',
    '2× DisplayPort 1.4 + 1× HDMI 2.0 – bis zu 3 Monitore',
    'Wi-Fi 6E, Bluetooth 5.3, Gigabit-LAN',
    'Nur 1,3 Liter, VESA-Halterung für die Montage hinter dem Monitor',
  ],
};

export function promoActive(now = Date.now()) {
  return now < Date.parse(PC_OF_MONTH.endsAt);
}
