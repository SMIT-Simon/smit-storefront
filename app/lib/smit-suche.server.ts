import type {ProductFilter} from '@shopify/hydrogen/storefront-api-types';
import type {AppLoadContext} from 'react-router';
import {isListable} from '~/lib/addons';
import {
  emptySmitSucheResult,
  type Money,
  type SmitSucheFilter,
  type SmitSucheProduct,
  type SmitSucheResult,
} from '~/lib/smit-suche';

/**
 * SMIT Suche – Abfrage an die Storefront API (search + predictiveSearch).
 * Genutzt von /api/smit-suche (Such-Fenster) und /search (Ergebnisseite).
 * Findet die Volltextsuche nichts, kommen tippfehlertolerante Vorschläge der Predictive Search.
 */

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
const SORTS: Record<string, {sortKey: 'RELEVANCE' | 'PRICE'; reverse: boolean}> = {
  relevance: {sortKey: 'RELEVANCE', reverse: false},
  'price-asc': {sortKey: 'PRICE', reverse: false},
  'price-desc': {sortKey: 'PRICE', reverse: true},
};

export type SmitSucheParams = {term: string; sort?: string | null; after?: string | null; filters?: ProductFilter[]};

/** Liest q, sort, after und f (JSON ProductFilter[]) aus einer URL. */
export function smitSucheParamsFromUrl(url: URL): SmitSucheParams {
  let filters: ProductFilter[] = [];
  try {
    const raw = url.searchParams.get('f');
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) filters = parsed.slice(0, 20) as ProductFilter[];
  } catch {
    filters = [];
  }
  return {
    term: String(url.searchParams.get('q') || '').trim().slice(0, 120),
    sort: url.searchParams.get('sort'),
    after: url.searchParams.get('after') || null,
    filters,
  };
}

export async function runSmitSuche(
  storefront: AppLoadContext['storefront'],
  {term, sort, after = null, filters = []}: SmitSucheParams,
): Promise<SmitSucheResult> {
  if (!term) return emptySmitSucheResult(term);
  const s = SORTS[sort || 'relevance'] ?? SORTS.relevance;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await storefront.query(SMIT_SUCHE_QUERY, {
    variables: {term, first: 24, after, sortKey: s.sortKey, reverse: s.reverse, filters},
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
    filters: (search?.productFilters ?? []) as SmitSucheFilter[],
    hasNextPage: Boolean(search?.pageInfo?.hasNextPage),
    endCursor: search?.pageInfo?.endCursor ?? null,
    collections: data?.predictiveSearch?.collections ?? [],
    queries: (data?.predictiveSearch?.queries ?? []).map((q: {text: string}) => q.text),
    fallback: false,
  };

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
  return result;
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
