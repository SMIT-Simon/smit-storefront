/**
 * Bilder im Kopfbereich der Kategorien (Arbeitsplatz- und Gaming-Bilder von WORTMANN).
 * Schlüssel: Kategorie-Handle oder „handle/unterkategorie“.
 */
export type CategoryBanner = {image: string; alt: string; theme?: 'gaming'};

const BANNERS: Record<string, CategoryBanner> = {
  monitore: {image: '/images/ap/2748w-pv.png', alt: 'Dual-Monitor-Arbeitsplatz mit TERRA LCD/LED 2748W PV'},
  'monitore/24-zoll': {image: '/images/ap/2427w-ha.png', alt: 'Arbeitsplatz mit zwei TERRA 24-Zoll-Monitoren LCD/LED 2427W HA'},
  'monitore/27-zoll': {image: '/images/ap/2727w.png', alt: 'Arbeitsplatz mit TERRA 27-Zoll-Monitoren LCD/LED 2727W'},
  'monitore/hoehenverstellbar': {image: '/images/ap/2772w-pv.png', alt: 'Höhenverstellbarer TERRA Monitor LCD/LED 2772W PV am Arbeitsplatz'},
  'desktop-pcs': {image: '/images/ap/2456w-pv.png', alt: 'TERRA PC mit Monitor am Schreibtisch'},
  'desktop-pcs/business': {image: '/images/ap/2456w-pv.png', alt: 'TERRA Business-PC mit Monitor am Schreibtisch'},
  'desktop-pcs/gamer': {image: '/images/gaming/bg2.jpg', alt: 'TERRA GAMING', theme: 'gaming'},
};

export function categoryBanner(handle: string, sub?: string | null): CategoryBanner | null {
  return (sub ? BANNERS[`${handle}/${sub}`] : null) ?? (sub ? null : BANNERS[handle]) ?? null;
}
