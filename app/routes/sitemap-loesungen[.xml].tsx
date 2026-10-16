import type {Route} from './+types/sitemap-loesungen[.xml]';
import {SOLUTIONS} from '~/lib/solutions';
import {CONFIG_MODELS} from '~/lib/configurator';
import {CLOUD_SERVICES} from '~/lib/cloud';
import {LANDINGS} from '~/lib/landings';

/** Zusätzliche Sitemap für die eigenen Inhaltsseiten (Lösungen, Flyer). */
export async function loader({request}: Route.LoaderArgs) {
  const origin = new URL(request.url).origin;
  const paths = [...LANDINGS.map((l) => `/themen/${l.slug}`), '/cloud', '/cloud/jtl-wawi-server', ...CLOUD_SERVICES.map((c) => `/cloud/${c.slug}`), '/ratgeber/laptop-aus-deutschland', '/ratgeber/wortmann-server', '/ratgeber/hyper-v-virtualisierung', '/themen/terra-gaming-pc', '/zahlungsarten', '/loesungen', ...SOLUTIONS.map((s) => `/loesungen/${s.slug}`), '/flyer', '/konfigurator', ...CONFIG_MODELS.map((m) => `/konfigurator/${m.slug}`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${origin}${p}</loc><changefreq>weekly</changefreq></url>`).join('\n')}
</urlset>`;
  return new Response(body, {
    headers: {'Content-Type': 'application/xml', 'Cache-Control': `max-age=${60 * 60 * 24}`},
  });
}
