/**
 * Eigene Seitenbilder liegen zusätzlich in Shopify > Inhalte > Dateien. Ausgeliefert werden sie
 * über das Shopify-Bild-CDN: passende Breite (srcset) und automatisch WebP/AVIF.
 * (Statische Dateien aus /public liefert Oxygen als große PNG/JPEG aus.)
 */
const CDN = 'https://cdn.shopify.com/s/files/1/1089/3439/8286/files/';
const VERSION = '1791747634';

const SITE_IMAGES: Record<string, [file: string, width: number, height: number]> = {
  '/images/cloud/header.jpg': ['site-cloud-header.jpg', 1600, 588],
  '/images/cloud/team.jpg': ['site-cloud-team.jpg', 1400, 940],
  '/images/cloud/kachel-iaas.jpg': ['site-cloud-kachel-iaas.jpg', 1500, 1500],
  '/images/cloud/kachel-basic.jpg': ['site-cloud-kachel-basic.jpg', 1500, 1500],
  '/images/cloud/kachel-s3.jpg': ['site-cloud-kachel-s3.jpg', 1500, 1500],
  '/images/cloud/kachel-backup.jpg': ['site-cloud-kachel-backup.jpg', 250, 250],
  '/images/cloud/rz-server.jpg': ['site-cloud-rz-server.jpg', 1600, 762],
  '/images/server/rack.png': ['site-server-rack.png', 2400, 1251],
  // Hyper-V (WORTMANN, unverändert)
  '/images/hyperv/header.jpg': ['site-hyperv-header.jpg', 1140, 332],
  '/images/hyperv/schaubild.jpg': ['site-hyperv-schaubild.jpg', 1920, 1080],
  // Zielgruppenbilder Tower-Server (KI-generiert, Kennzeichnung im Bild)
  '/images/tower/zielgruppe-praxis.webp': ['site-tower-zielgruppe-praxis.jpg', 1448, 1086],
  '/images/tower/zielgruppe-kanzlei.webp': ['site-tower-zielgruppe-kanzlei.jpg', 1448, 1086],
  '/images/tower/zielgruppe-handel.webp': ['site-tower-zielgruppe-handel.jpg', 1448, 1086],
  '/images/tower/zielgruppe-kmu.webp': ['site-tower-zielgruppe-kmu.jpg', 1448, 1086],
  // Arbeitsplatzbilder aus der WORTMANN-Bilddatenbank (unverändert, nur skaliert ausgeliefert)
  '/images/ap/2448w-pv.png': ['site-ap-2448w-pv.png', 4000, 3500],
  '/images/ap/2727w.png': ['site-ap-2727w.png', 4000, 2340],
  '/images/ap/2456w-pv.png': ['site-ap-2456w-pv.png', 3522, 4000],
  '/images/ap/2427w-ha.png': ['site-ap-2427w-ha.png', 4000, 3937],
  '/images/ap/2427w.png': ['site-ap-2427w.png', 4000, 3933],
  '/images/ap/2748w-pv.png': ['site-ap-2748w-pv.png', 4000, 2285],
  '/images/ap/2772w-pv.png': ['site-ap-2772w-pv.png', 4000, 3000],
  // TERRA GAMING (WORTMANN-Bilddatenbank)
  '/images/gaming/bg1.png': ['site-gaming-bg1.png', 1920, 1080],
  '/images/gaming/bg2.jpg': ['site-gaming-bg2.jpg', 1920, 1080],
  '/images/gaming/bg5.jpg': ['site-gaming-bg5.jpg', 1920, 1080],
  '/images/gaming/elite5-front.png': ['site-gaming-elite5-front.png', 999, 782],
  '/images/cloud/rz-tuer.jpg': ['site-cloud-rz-tuer.jpg', 330, 250],
  '/images/cloud/rz-luft.jpg': ['site-cloud-rz-luft.jpg', 330, 250],
  '/images/cloud/rz-netz.jpg': ['site-cloud-rz-netz.jpg', 900, 704],
  '/images/cloud/rz-brandschutz.jpg': ['site-cloud-rz-brandschutz.jpg', 900, 704],
  '/images/cloud/rz-strom.jpg': ['site-cloud-rz-strom.jpg', 900, 704],
  '/images/cloud/rz-klima.jpg': ['site-cloud-rz-klima.jpg', 720, 480],
  '/images/cloud/rz-zutritt.jpg': ['site-cloud-rz-zutritt.jpg', 900, 704],
  '/images/cloud/rz-hebel.jpg': ['site-cloud-rz-hebel.jpg', 1600, 762],
  '/images/home/pc-des-monats.png': ['site-home-pc-des-monats-2026-10.png', 788, 709],
  '/images/home/hero-bg-terra.webp': ['site-home-hero-bg-terra.jpg', 1877, 838],
  '/images/home/imig.webp': ['site-home-imig.webp', 1140, 450],
  '/images/home/mobile-1671l.webp': ['site-home-mobile-1671l.webp', 788, 694],
  '/images/home/produktion.webp': ['site-home-produktion.webp', 1400, 788],
  '/images/home/section-arbeitsplatz.webp': ['site-home-section-arbeitsplatz.webp', 1400, 783],
  '/images/home/section-dual-monitor.webp': ['site-home-section-dual-monitor.webp', 1400, 800],
  '/images/home/section-pc-familie.webp': ['site-home-section-pc-familie.webp', 1400, 632],
  '/images/home/section-tower-server.webp': ['site-home-section-tower-server.webp', 1400, 779],
  '/images/home/slide-arbeitsplatz.webp': ['site-home-slide-arbeitsplatz.webp', 1400, 939],
  '/images/home/slide-familie.webp': ['site-home-slide-familie.webp', 1400, 624],
  '/images/home/slide-monitor.webp': ['site-home-slide-monitor.webp', 1333, 1000],
  '/images/home/slide-server.webp': ['site-home-slide-server.webp', 1400, 731],
  '/images/home/terra-logo.webp': ['site-home-terra-logo.webp', 185, 64],
  '/images/loesungen/arbeitsplatz-notebook.webp': ['site-loesungen-arbeitsplatz-notebook.webp', 1200, 702],
  '/images/loesungen/arbeitsplatz.webp': ['site-loesungen-arbeitsplatz.webp', 1200, 900],
  '/images/loesungen/dual-monitor.webp': ['site-loesungen-dual-monitor.webp', 1200, 686],
  '/images/loesungen/homeoffice.webp': ['site-loesungen-homeoffice.webp', 1200, 805],
  '/images/loesungen/multimonitor.webp': ['site-loesungen-multimonitor.webp', 1200, 1050],
  '/images/loesungen/notebooks.webp': ['site-loesungen-notebooks.webp', 1140, 699],
  '/images/loesungen/pc-familie.webp': ['site-loesungen-pc-familie.webp', 1200, 800],
  '/images/loesungen/rack-server.webp': ['site-loesungen-rack-server.webp', 1200, 627],
  '/images/loesungen/server-tower.webp': ['site-loesungen-server-tower.webp', 1200, 1200],
  '/images/loesungen/tower-familie.webp': ['site-loesungen-tower-familie.webp', 1200, 668],
  '/flyer/seite-1.webp': ['site-flyer-seite-1.webp', 1182, 1595],
  '/flyer/seite-10.webp': ['site-flyer-seite-10.webp', 1182, 1595],
  '/flyer/seite-11.webp': ['site-flyer-seite-11.webp', 1182, 1595],
  '/flyer/seite-12.webp': ['site-flyer-seite-12.webp', 1182, 1595],
  '/flyer/seite-2.webp': ['site-flyer-seite-2.webp', 1182, 1595],
  '/flyer/seite-3.webp': ['site-flyer-seite-3.webp', 1182, 1595],
  '/flyer/seite-4.webp': ['site-flyer-seite-4.webp', 1182, 1595],
  '/flyer/seite-5.webp': ['site-flyer-seite-5.webp', 1182, 1595],
  '/flyer/seite-6.webp': ['site-flyer-seite-6.webp', 1182, 1595],
  '/flyer/seite-7.webp': ['site-flyer-seite-7.webp', 1182, 1595],
  '/flyer/seite-8.webp': ['site-flyer-seite-8.webp', 1182, 1595],
  '/flyer/seite-9.webp': ['site-flyer-seite-9.webp', 1182, 1595],
  '/images/logo-smit.webp': ['site-logo-smit.webp', 512, 164],
  '/images/logo-smit-white.webp': ['site-logo-smit-white.webp', 512, 164],
};

const STEPS = [320, 480, 560, 640, 720, 800, 1000, 1200, 1400, 1600];

export type SiteImgProps = {
  src: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
};

/** Props für <img>: CDN-URL mit srcset; unbekannte Pfade bleiben lokal. */
export function siteImg(path: string, sizes = '100vw'): SiteImgProps {
  const entry = SITE_IMAGES[path];
  if (!entry) return {src: path};
  const [file, width, height] = entry;
  const url = (w: number) => `${CDN}${file}?v=${VERSION}&width=${w}`;
  const steps = STEPS.filter((w) => w < width).concat(width);
  return {
    src: url(Math.min(width, 800)),
    srcSet: steps.map((w) => `${url(w)} ${w}w`).join(', '),
    sizes,
    width,
    height,
  };
}
