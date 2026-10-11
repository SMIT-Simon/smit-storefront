import type {Route} from './+types/collections.all';
import {Link, useLoaderData, useNavigate} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import type {ProductSortKeys} from '@shopify/hydrogen/storefront-api-types';
import {CATEGORIES} from '~/lib/categories';
import {Icon} from '~/components/Icon';
import {PriceModeNote} from '~/components/PriceMode';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';
import type {CollectionItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Alle Produkte – TERRA Notebooks, PCs, Monitore & Server | terra-computershop.de'}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 24,
  });
  const sortParam = new URL(request.url).searchParams.get('sort') ?? 'newest';
  const sort = SORTS.find((o) => o.value === sortParam) ?? SORTS[0];

  const {products} = await storefront.query(CATALOG_QUERY, {
    variables: {...paginationVariables, sortKey: sort.key, reverse: sort.reverse},
  });
  return {products, sort: sort.value};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {products, sort} = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <div className="collection">
      <div className="collection-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Brotkrumen">
            <Link to="/">Startseite</Link>
            <span aria-hidden="true">/</span>
            <span>Alle Produkte</span>
          </nav>
          <h1 className="page-title">Alle Produkte</h1>
          <p className="collection-description">
            Das komplette TERRA-Sortiment: Notebooks, PCs, Monitore, Server, Zubehör und Software.
          </p>
        </div>
      </div>

      <div className="container collection-layout">
        <nav className="collection-sidebar" aria-label="Kategorien">
          <h2>Kategorien</h2>
          <ul>
            {CATEGORIES.map((c) => (
              <li key={c.handle}>
                <Link to={`/collections/${c.handle}`} prefetch="intent">
                  <Icon name={c.icon} size={18} />
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="collection-main">
          <div className="sub-chips" role="navigation" aria-label="Kategorien">
            {CATEGORIES.map((c) => (
              <Link key={c.handle} to={`/collections/${c.handle}`} prefetch="intent" className="sub-chip">
                {c.title}
              </Link>
            ))}
          </div>
          <div className="collection-toolbar">
            <PriceModeNote />
            <label className="sort-select">
              <span>Sortieren:</span>
              <select
                value={sort}
                onChange={(e) => void navigate(`?sort=${e.target.value}`, {preventScrollReset: true})}
              >
                {SORTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <PaginatedResourceSection<CollectionItemFragment>
            connection={products}
            resourcesClassName="products-grid products-grid-3"
          >
            {({node: product, index}) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 6 ? 'eager' : undefined}
              />
            )}
          </PaginatedResourceSection>
        </div>
      </div>
    </div>
  );
}

const SORTS: {value: string; label: string; key: ProductSortKeys; reverse: boolean}[] = [
  {value: 'newest', label: 'Neueste zuerst', key: 'CREATED_AT', reverse: true},
  {value: 'price-asc', label: 'Preis aufsteigend', key: 'PRICE', reverse: false},
  {value: 'price-desc', label: 'Preis absteigend', key: 'PRICE', reverse: true},
  {value: 'title', label: 'Name A–Z', key: 'TITLE', reverse: false},
];

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    tags
    productType
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
      sortKey: $sortKey
      reverse: $reverse
      query: "-product_type:'Service-Option' -product_type:'Software-Option' -tag:'ausblenden'"
    ) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;
