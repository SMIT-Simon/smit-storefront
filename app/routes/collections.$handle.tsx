import {Link, redirect, useLoaderData, useNavigate, useSearchParams} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import type {ProductCollectionSortKeys} from '@shopify/hydrogen/storefront-api-types';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import {CATEGORIES, SUB_TAG_PREFIX, findSub} from '~/lib/categories';
import {Icon} from '~/components/Icon';
import {PriceModeNote} from '~/components/PriceMode';
import type {ProductItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = ({data}) => {
  const c = data?.collection;
  return [
    {title: c ? `${c.title} kaufen – TERRA von WORTMANN` : 'Kategorie'},
    {name: 'description', content: c?.description ?? ''},
  ];
};

const SORT_OPTIONS: {
  value: string;
  label: string;
  sortKey: ProductCollectionSortKeys;
  reverse: boolean;
}[] = [
  {value: 'price-asc', label: 'Preis aufsteigend', sortKey: 'PRICE', reverse: false},
  {value: 'price-desc', label: 'Preis absteigend', sortKey: 'PRICE', reverse: true},
  {value: 'newest', label: 'Neueste zuerst', sortKey: 'CREATED', reverse: true},
  {value: 'title', label: 'Name A–Z', sortKey: 'TITLE', reverse: false},
  {value: 'best', label: 'Beliebteste', sortKey: 'BEST_SELLING', reverse: false},
];

export async function loader(args: Route.LoaderArgs) {
  return await loadCriticalData(args);
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {pageBy: 24});

  if (!handle) {
    throw redirect('/collections');
  }

  const url = new URL(request.url);
  const sortParam = url.searchParams.get('sort') ?? 'price-asc';
  const sub = findSub(handle, url.searchParams.get('sub'));
  const sort =
    SORT_OPTIONS.find((o) => o.value === sortParam) ?? SORT_OPTIONS[0];

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      sortKey: sort.sortKey,
      reverse: sort.reverse,
      filters: sub ? [{tag: SUB_TAG_PREFIX + sub.slug}] : [],
      ...paginationVariables,
    },
  });

  if (!collection) {
    throw new Response(`Kategorie ${handle} nicht gefunden`, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {collection, sort: sort.value, sub};
}

export default function Collection() {
  const {collection, sort, sub} = useLoaderData<typeof loader>();
  const category = CATEGORIES.find((c) => c.handle === collection.handle);
  const subHref = (slug?: string) => {
    const next = new URLSearchParams();
    if (slug) next.set('sub', slug);
    if (sort !== 'price-asc') next.set('sort', sort);
    const q = next.toString();
    return `/collections/${collection.handle}${q ? `?${q}` : ''}`;
  };
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return (
    <div className="collection">
      <div className="collection-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Brotkrumen">
            <Link to="/">Startseite</Link>
            <span aria-hidden="true">/</span>
            {sub ? (
              <>
                <Link to={subHref()}>{collection.title}</Link>
                <span aria-hidden="true">/</span>
                <span>{sub.title}</span>
              </>
            ) : (
              <span>{collection.title}</span>
            )}
          </nav>
          <h1 className="page-title">{sub ? sub.title : collection.title}</h1>
          {collection.description ? (
            <p className="collection-description">{collection.description}</p>
          ) : null}
        </div>
      </div>

      <div className="container collection-layout">
        <nav className="collection-sidebar" aria-label="Kategorien">
          <h2>Kategorien</h2>
          <ul>
            {CATEGORIES.map((c) => (
              <li key={c.handle}>
                <Link
                  to={`/collections/${c.handle}`}
                  prefetch="intent"
                  className={c.handle === collection.handle ? 'active' : undefined}
                >
                  <Icon name={c.icon} size={18} />
                  {c.title}
                </Link>
                {c.handle === collection.handle && c.subs?.length ? (
                  <ul className="sidebar-subs">
                    {c.subs.map((x) => (
                      <li key={x.slug}>
                        <Link
                          to={subHref(x.slug)}
                          prefetch="intent"
                          className={sub?.slug === x.slug ? 'active' : undefined}
                        >
                          {x.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <div className="collection-main">
          {category?.subs?.length ? (
            <div className="sub-chips" role="navigation" aria-label="Unterkategorien">
              <Link
                to={subHref()}
                prefetch="intent"
                className={!sub ? 'sub-chip active' : 'sub-chip'}
              >
                Alle {category.title}
              </Link>
              {category.subs.map((x) => (
                <Link
                  key={x.slug}
                  to={subHref(x.slug)}
                  prefetch="intent"
                  className={sub?.slug === x.slug ? 'sub-chip active' : 'sub-chip'}
                >
                  {x.title}
                </Link>
              ))}
            </div>
          ) : null}
          <div className="collection-toolbar">
            <PriceModeNote />
            <label className="sort-select">
              <span>Sortieren:</span>
              <select
                value={sort}
                onChange={(e) => {
                  const next = new URLSearchParams(searchParams);
                  next.set('sort', e.target.value);
                  next.delete('cursor');
                  next.delete('direction');
                  void navigate(`?${next.toString()}`, {preventScrollReset: true});
                }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <PaginatedResourceSection<ProductItemFragment>
            connection={collection.products}
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

      <Analytics.CollectionView
        data={{collection: {id: collection.id, handle: collection.handle}}}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    vendor
    productType
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        sortKey: $sortKey,
        reverse: $reverse,
        filters: $filters
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
