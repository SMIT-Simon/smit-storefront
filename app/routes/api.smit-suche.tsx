import type {Route} from './+types/api.smit-suche';
import {isListable} from '~/lib/addons';

/**
 * SMIT Suche – Datenquelle für das Such-Fenster (components/SmitSuche.tsx).
 * GET /api/smit-suche?q=…&sort=relevance|price-asc|price-desc&after=<cursor>&f=<JSON ProductFilter[]>
 * Liefert Treffer (mit Filtern, Anzahl, Seiten-Cursor), passende Kollektionen und Suchvorschläge.
 * Findet die Volltextsuche nichts, kommen tippfehlertolerante Vorschläge der Predictive Search.
 */

type Money = {amount: string; currencyCode: string};
type SearchNode = {
  __typename: string;
  id: string;
  handle: string;
  title: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  featuredImage: {url: string; altText: string | null} | null;
  priceRange: {minVariantPrice: Money; maxVariantPrice: Money};
  compareAtPriceRange: {maxVariantPrice: Money};
  variants: {nodes: Array<{id: string; sku: string | null; availableForSale: boolean}>};
};
type FilterValue = {id: string; label: string; count: number; input: string};
type Filter = {id: string; label: string; type: string; values: FilterValue[]};

export type SmitSucheProduct = {
  handle: string;
  title: string;
  vendor: string;
  image: string | null;
  price: Money;
  priceVaries: boolean;
  compareAt: Money | null;
  available: boolean;
  variantId: string | null;
  sku: string;
};
export type SmitSucheResult = {
  term: string;
  count: number;
  products: SmitSucheProduct[];
  filters: Filter[];
  hasNextPage: boolean;
  endCursor: string | null;
  collections: Array<{title: string; handle: string}>;
  queries: string[];
  fallback: boolean;
};

const SORTS: Record<string, {sortKey: 'RELEVANCE' | 'PRICE'; reverse: boolean}> = {
  relevance: {sortKey: 'RELEVANCE', reverse: false},
  'price-asc': {sortKey: 'PRICE', reverse: false},
  'price-desc': {sortKey: 'PRICE', reverse: true},
};

export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim().slice(0, 120);
  const sort = SORTS[url.searchParams.get('sort') || 'relevance'] ?? SORTS.relevance;
  const after = url.searchParams.get('after') || null;
  let filters: unknown[] = [];
  try {
    const raw = url.searchParams.get('f');
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) filters = parsed.slice(0, 20);
  } catch {
    filters = [];
  }

  const empty: SmitSucheResult = {
    term, count: 0, products: [], filters: [], hasNextPage: false, endCursor: null,
    collections: [], queries: [], fallback: false,
  };
  if (!term) return Response.json(empty);

  const {storefront} = context;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await storefront.query(SMIT_SUCHE_QUERY, {
    variables: {term, first: 24, after, sortKey: sort.sortKey, reverse: sort.reverse, filters},
    cache: storefront.CacheShort(),
  });

  const search = data?.search;
  const nodes: SearchNode[] = (search?.nodes ?? []).filter(
    (n: SearchNode) => n?.__typename === 'Product' && isListable(n),
  );
  const result: SmitSucheResult = {
    term,
    count: search?.totalCount ?? 0,
    products: nodes.map(toProduct),
    filters: (search?.productFilters ?? []) as Filter[],
    hasNextPage: Boolean(search?.pageInfo?.hasNextPage),
    endCursor: search?.pageInfo?.endCursor ?? null,
    collections: data?.predictiveSearch?.collections ?? [],
    queries: (data?.predictiveSearch?.queries ?? []).map((q: {text: string}) => q.text),
    fallback: false,
  };

  // Nichts gefunden (z. B. Tippfehler): Predictive Search ist fehlertolerant
  if (!result.count && !after && filters.length === 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fb: any = await storefront.query(SMIT_SUCHE_FALLBACK_QUERY, {
      variables: {term},
      cache: storefront.CacheShort(),
    });
    const fbNodes: SearchNode[] = (fb?.predictiveSearch?.products ?? []).filter(isListable);
    if (fbNodes.length) {
      result.products = fbNodes.map(toProduct);
      result.fallback = true;
    }
  }

  return Response.json(result, {headers: {'Cache-Control': 'public, max-age=60'}});
}

function toProduct(n: SearchNode): SmitSucheProduct {
  const variants = n.variants?.nodes ?? [];
  const firstAvailable = variants.find((v) => v.availableForSale) ?? variants[0];
  const min = n.priceRange.minVariantPrice;
  const max = n.priceRange.maxVariantPrice;
  const compare = n.compareAtPriceRange?.maxVariantPrice;
  return {
    handle: n.handle,
    title: n.title,
    vendor: n.vendor,
    image: n.featuredImage?.url ?? null,
    price: min,
    priceVaries: Number(max.amount) > Number(min.amount),
    compareAt: compare && Number(compare.amount) > Number(min.amount) ? compare : null,
    available: n.availableForSale,
    // „In den Warenkorb“ direkt nur bei Artikeln ohne Auswahl (genau eine Variante)
    variantId: variants.length === 1 && firstAvailable?.availableForSale ? firstAvailable.id : null,
    sku: firstAvailable?.sku ?? '',
  };
}

const SMIT_SUCHE_PRODUCT_FRAGMENT = `#graphql
  fragment SmitSucheProduct on Product {
    __typename
    id
    handle
    title
    vendor
    productType
    tags
    availableForSale
    featuredImage { url(transform: {maxWidth: 480, maxHeight: 480}) altText }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    compareAtPriceRange { maxVariantPrice { amount currencyCode } }
    variants(first: 2) { nodes { id sku availableForSale } }
  }
` as const;

const SMIT_SUCHE_QUERY = `#graphql
  query SmitSuche(
    $term: String!
    $first: Int!
    $after: String
    $sortKey: SearchSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    search(
      query: $term
      first: $first
      after: $after
      sortKey: $sortKey
      reverse: $reverse
      types: [PRODUCT]
      productFilters: $filters
      prefix: LAST
      unavailableProducts: LAST
    ) {
      totalCount
      pageInfo { hasNextPage endCursor }
      productFilters { id label type values { id label count input } }
      nodes { ... on Product { ...SmitSucheProduct } }
    }
    predictiveSearch(query: $term, limit: 6, limitScope: EACH, types: [COLLECTION, QUERY]) {
      collections { title handle }
      queries { text }
    }
  }
  ${SMIT_SUCHE_PRODUCT_FRAGMENT}
` as const;

const SMIT_SUCHE_FALLBACK_QUERY = `#graphql
  query SmitSucheFallback($term: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    predictiveSearch(query: $term, limit: 10, limitScope: EACH, types: [PRODUCT]) {
      products { ...SmitSucheProduct }
    }
  }
  ${SMIT_SUCHE_PRODUCT_FRAGMENT}
` as const;
