import type {Route} from './+types/feeds.google-links[.]csv';
import type {GoogleLinkFeedQuery} from 'storefrontapi.generated';

/**
 * Ergänzende Datenquelle für das Google Merchant Center.
 * Die Shopify-Google-App schreibt als Produktlink die myshopify-Domain in den Feed
 * (Headless-Shop). Diese Datei überschreibt `link` je Artikel-ID mit der echten
 * Shop-Domain. Google ruft sie täglich ab, neue Produkte sind automatisch enthalten.
 * ID-Format der Shopify-App: shopify_ZZ_<productId>_<variantId>
 */
const SHOP_ORIGIN = 'https://www.terra-computershop.de';

const QUERY = `#graphql
  query GoogleLinkFeed($after: String) {
    products(first: 250, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes { id handle variants(first: 100) { nodes { id } } }
    }
  }
` as const;

const num = (gid: string) => gid.split('/').pop() ?? gid;

export async function loader({context}: Route.LoaderArgs) {
  const rows: string[] = ['id,link'];
  let after: string | null = null;
  for (let page = 0; page < 20; page++) {
    const {products}: GoogleLinkFeedQuery = await context.storefront.query(QUERY, {
      variables: {after},
      cache: context.storefront.CacheShort(),
    });
    for (const p of products.nodes) {
      const link = `${SHOP_ORIGIN}/products/${p.handle}`;
      for (const v of p.variants.nodes) {
        rows.push(`shopify_ZZ_${num(p.id)}_${num(v.id)},${link}`);
      }
    }
    if (!products.pageInfo.hasNextPage) break;
    after = products.pageInfo.endCursor ?? null;
  }
  return new Response(rows.join('\n') + '\n', {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Cache-Control': `max-age=${60 * 60}`,
      'X-Robots-Tag': 'noindex',
    },
  });
}
