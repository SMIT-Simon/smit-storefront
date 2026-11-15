import type {Route} from './+types/datenblatt.eprel.$id';

/**
 * Produktdatenblatt (EU-Energielabel, Displays) aus der EU-Datenbank EPREL über die eigene Domain:
 * so lässt es sich im Modal einbetten (CSP frame-src 'self') und mit echtem Download anbieten.
 * /datenblatt/eprel/1275445          → PDF inline
 * /datenblatt/eprel/1275445?download=1 → PDF als Download
 */
export async function loader({params, request}: Route.LoaderArgs) {
  const id = params.id ?? '';
  if (!/^\d{3,10}$/.test(id)) throw new Response('Not found', {status: 404});
  const upstream = await fetch(
    `https://eprel.ec.europa.eu/api/products/electronicdisplays/${id}/fiches?language=DE&format=PDF`,
    {headers: {Accept: 'application/pdf', 'User-Agent': 'Mozilla/5.0 (compatible; terra-computershop.de)'}},
  );
  if (!upstream.ok || !(upstream.headers.get('content-type') ?? '').includes('pdf')) {
    // Fallback: Datenblatt direkt bei EPREL
    return new Response(null, {
      status: 302,
      headers: {
        Location: `https://eprel.ec.europa.eu/screen/product/electronicdisplays/${id}`,
        'X-Upstream-Status': String(upstream.status),
      },
    });
  }
  const download = new URL(request.url).searchParams.has('download');
  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="Produktdatenblatt_EPREL_${id}.pdf"`,
      'Cache-Control': 'public, max-age=86400',
      'X-Robots-Tag': 'noindex',
    },
  });
}
