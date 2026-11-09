import {isListable} from '~/lib/addons';
import {useLoaderData} from 'react-router';
import type {Route} from './+types/search';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {SmitSuche} from '~/components/SmitSuche';
import {runSmitSuche, smitSucheParamsFromUrl} from '~/lib/smit-suche.server';
import {emptySmitSucheResult, type SmitSucheResult, type SmitSucheSort} from '~/lib/smit-suche';
import {
  type RegularSearchReturn,
  type PredictiveSearchReturn,
  getEmptyPredictiveSearchResult,
} from '~/lib/search';
import type {
  RegularSearchQuery,
  PredictiveSearchQuery,
} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = ({data}) => {
  const term = data && 'term' in data ? String(data.term || '') : '';
  return [
    {title: term ? `Suche: ${term} | terra-computershop.de` : 'Produktsuche | terra-computershop.de'},
    // Suchergebnisseiten nicht in den Google-Index, Links darauf aber verfolgen
    {name: 'robots', content: 'noindex, follow'},
  ];
};

type SmitSuchePage = {type: 'smit'; term: string; sort: SmitSucheSort; result: SmitSucheResult};

export async function loader({request, context}: Route.LoaderArgs): Promise<PredictiveSearchReturn | SmitSuchePage> {
  const url = new URL(request.url);
  // Vorschau-Suche (Hydrogen-Standard, ?predictive) bleibt unverändert
  if (url.searchParams.has('predictive')) return predictiveSearch({request, context});

  const params = smitSucheParamsFromUrl(url);
  const sortParam = url.searchParams.get('sort');
  const sort: SmitSucheSort = sortParam === 'price-asc' || sortParam === 'price-desc' ? sortParam : 'relevance';
  try {
    const result = await runSmitSuche(context.storefront, {...params, sort});
    return {type: 'smit', term: params.term, sort, result};
  } catch (error) {
    // Rückfall: Standard-Suche von Hydrogen, damit die Seite immer Treffer zeigt
    console.error(error);
    const regular = await regularSearch({request, context}).catch(() => null);
    return {type: 'smit', term: params.term, sort, result: regularToSmit(params.term, regular)};
  }
}

/**
 * Ergebnisseite /search – gleiche Oberfläche wie das SMIT-Such-Fenster:
 * Filter, Sortierung, Kategorie-Chips, Karten mit Preis (brutto/netto) und Warenkorb, „Weitere laden“.
 * Treffer kommen vom Server mit (sofort sichtbar, ohne JavaScript nutzbar).
 */
export default function SearchPage() {
  const data = useLoaderData<typeof loader>();
  if (data.type === 'predictive') return null;
  const {term, sort, result} = data;

  return (
    <div className="container smit-su-pagewrap">
      <SmitSuche
        variant="page"
        open
        initialTerm={term}
        initialData={result}
        initialSort={sort}
        onClose={noop}
      />
      <Analytics.SearchView data={{searchTerm: term}} />
    </div>
  );
}

function noop() {}

/** Ergebnis der Hydrogen-Standardsuche in das SMIT-Format übertragen (nur für den Rückfall). */
function regularToSmit(term: string, regular: RegularSearchReturn | null): SmitSucheResult {
  const res = emptySmitSucheResult(term);
  const nodes = regular?.result?.items?.products?.nodes ?? [];
  res.products = nodes.map((p) => {
    const v = p.selectedOrFirstAvailableVariant;
    const price = v?.price ?? {amount: '0', currencyCode: 'EUR'};
    return {
      handle: p.handle,
      title: p.title,
      vendor: p.vendor,
      image: v?.image?.url ?? null,
      price: {amount: String(price.amount), currencyCode: String(price.currencyCode)},
      priceVaries: false,
      compareAt: v?.compareAtPrice ? {amount: String(v.compareAtPrice.amount), currencyCode: String(v.compareAtPrice.currencyCode)} : null,
      available: true,
      variantId: null,
      sku: '',
    };
  });
  res.count = res.products.length;
  return res;
}

/**
 * Regular search query and fragments
 * (adjust as needed)
 */
const SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment SearchProduct on Product {
    __typename
    productType
    tags
    handle
    id
    publishedAt
    title
    trackingParameters
    vendor
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
      selectedOptions {
        name
        value
      }
      product {
        handle
        title
      }
    }
  }
` as const;

const SEARCH_PAGE_FRAGMENT = `#graphql
  fragment SearchPage on Page {
     __typename
     handle
    id
    title
    trackingParameters
  }
` as const;

const SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
  }
` as const;

const PAGE_INFO_FRAGMENT = `#graphql
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/search
export const SEARCH_QUERY = `#graphql
  query RegularSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    articles: search(
      query: $term,
      types: [ARTICLE],
      first: $first,
    ) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
    }
    pages: search(
      query: $term,
      types: [PAGE],
      first: $first,
    ) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
    }
    products: search(
      after: $endCursor,
      before: $startCursor,
      first: $first,
      last: $last,
      query: $term,
      sortKey: RELEVANCE,
      types: [PRODUCT],
      unavailableProducts: HIDE,
    ) {
      nodes {
        ...on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${SEARCH_PRODUCT_FRAGMENT}
  ${SEARCH_PAGE_FRAGMENT}
  ${SEARCH_ARTICLE_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * Regular search fetcher
 */
async function regularSearch({
  request,
  context,
}: Pick<
  Route.LoaderArgs,
  'request' | 'context'
>): Promise<RegularSearchReturn> {
  const {storefront} = context;
  const url = new URL(request.url);
  const variables = getPaginationVariables(request, {pageBy: 8});
  const term = String(url.searchParams.get('q') || '');

  // Search articles, pages, and products for the `q` term
  const {
    errors,
    ...items
  }: {errors?: Array<{message: string}>} & RegularSearchQuery =
    await storefront.query(SEARCH_QUERY, {
      variables: {...variables, term},
    });

  if (!items) {
    throw new Error('No search data returned from Shopify API');
  }
  hideOptionProducts(items);

  const total = Object.values(items).reduce(
    (acc: number, {nodes}: {nodes: Array<unknown>}) => acc + nodes.length,
    0,
  );

  const error = errors
    ? errors.map(({message}: {message: string}) => message).join(', ')
    : undefined;

  return {type: 'regular', term, error, result: {total, items}};
}

/**
 * Predictive search query and fragments
 * (adjust as needed)
 */
const PREDICTIVE_SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment PredictiveArticle on Article {
    __typename
    id
    title
    handle
    blog {
      handle
    }
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_COLLECTION_FRAGMENT = `#graphql
  fragment PredictiveCollection on Collection {
    __typename
    id
    title
    handle
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_PAGE_FRAGMENT = `#graphql
  fragment PredictivePage on Page {
    __typename
    id
    title
    handle
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment PredictiveProduct on Product {
    __typename
    productType
    tags
    id
    title
    handle
    trackingParameters
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
    }
  }
` as const;

const PREDICTIVE_SEARCH_QUERY_FRAGMENT = `#graphql
  fragment PredictiveQuery on SearchQuerySuggestion {
    __typename
    text
    styledText
    trackingParameters
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/predictiveSearch
const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit,
      limitScope: $limitScope,
      query: $term,
      types: $types,
    ) {
      articles {
        ...PredictiveArticle
      }
      collections {
        ...PredictiveCollection
      }
      pages {
        ...PredictivePage
      }
      products {
        ...PredictiveProduct
      }
      queries {
        ...PredictiveQuery
      }
    }
  }
  ${PREDICTIVE_SEARCH_ARTICLE_FRAGMENT}
  ${PREDICTIVE_SEARCH_COLLECTION_FRAGMENT}
  ${PREDICTIVE_SEARCH_PAGE_FRAGMENT}
  ${PREDICTIVE_SEARCH_PRODUCT_FRAGMENT}
  ${PREDICTIVE_SEARCH_QUERY_FRAGMENT}
` as const;

/**
 * Predictive search fetcher
 */
async function predictiveSearch({
  request,
  context,
}: Pick<
  Route.ActionArgs,
  'request' | 'context'
>): Promise<PredictiveSearchReturn> {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 10);
  const type = 'predictive';

  if (!term) return {type, term, result: getEmptyPredictiveSearchResult()};

  // Predictively search articles, collections, pages, products, and queries (suggestions)
  const {
    predictiveSearch: items,
    errors,
  }: PredictiveSearchQuery & {errors?: Array<{message: string}>} =
    await storefront.query(PREDICTIVE_SEARCH_QUERY, {
      variables: {
        // customize search options as needed
        limit,
        limitScope: 'EACH',
        term,
      },
    });

  if (errors) {
    throw new Error(
      `Shopify API errors: ${errors.map(({message}: {message: string}) => message).join(', ')}`,
    );
  }

  if (!items) {
    throw new Error('No predictive search data returned from Shopify API');
  }
  hideOptionProducts(items);

  const total = Object.values(items).reduce(
    (acc: number, item: Array<unknown>) => acc + item.length,
    0,
  );

  return {type, term, result: {items, total}};
}

/** Service- und Software-Optionen (nur über die Produktseite buchbar) nicht in der Suche zeigen. */
function hideOptionProducts(items: object) {
  const products = (items as {products?: {nodes?: Array<{productType?: string; tags?: string[]}>}})
    .products;
  if (products?.nodes) products.nodes = products.nodes.filter(isListable);
}
