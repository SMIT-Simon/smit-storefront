import type {Route} from './+types/sitemap.$type.$page[.xml]';
import {getSitemap} from '@shopify/hydrogen';

/**
 * Produkt-/Kategorie-Sitemaps. Der Shop ist nur deutschsprachig: keine
 * hreflang-Alternativen (die Vorlage hatte EN-US/EN-CA/FR-CA → 404).
 * Versteckte Optionsprodukte (Service-/Software-Optionen, noindex) werden entfernt.
 */
const HIDDEN_HANDLES = [
  /^vor-ort-service-/,
  /^terra-lcd-vor-ort-service$/,
  /^windows-11-pro-oem-vorinstalliert-/,
  /^konfiguration-/,
  /^jtl-cloud-/,
];

export async function loader({
  request,
  params,
  context: {storefront},
}: Route.LoaderArgs) {
  const response = await getSitemap({
    storefront,
    request,
    params,
    locales: [],
    getLink: ({type, baseUrl, handle}) => `${baseUrl}/${type}/${handle}`,
  });

  let xml = await response.text();
  if (params.type === 'products') {
    xml = xml.replace(/<url>[\s\S]*?<\/url>\s*/g, (block) => {
      const handle = block.match(/\/products\/([^<\s]+)<\/loc>/)?.[1] ?? '';
      return HIDDEN_HANDLES.some((re) => re.test(handle)) ? '' : block;
    });
  }

  if (params.type === 'pages') {
    xml = xml.replace(/<url>[\s\S]*?<\/url>\s*/g, (block) =>
      /\/pages\/contact<\/loc>/.test(block) ? '' : block,
    );
  }

  const headers = new Headers(response.headers);
  headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);
  return new Response(xml, {status: response.status, headers});
}
