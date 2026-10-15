import {Link, redirect, useLoaderData, useNavigate, useSearchParams} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import type {
  ProductCollectionSortKeys,
  ProductSortKeys,
} from '@shopify/hydrogen/storefront-api-types';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import {CATEGORIES, categoryQuery, findSub} from '~/lib/categories';
import {
  facetCounts,
  filterQuery,
  FILTER_TAG_PREFIX,
  groupsFor,
  parseFilters,
} from '~/lib/filters';
import {metaDescription, pageTitle} from '~/lib/seo';
import {categoryIntro, categorySeoTitle} from '~/lib/category-texts';
import {isListable} from '~/lib/addons';
import {CollectionFilters} from '~/components/CollectionFilters';
import {Icon} from '~/components/Icon';
import {PRODUCT_ITEM_FRAGMENT} from '~/lib/product-item-fragment';
import {PriceModeNote} from '~/components/PriceMode';
import type {ProductItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = ({data}) => {
  const c = data?.collection;
  if (!c) return [{title: 'Kategorie'}];
  const cat = CATEGORIES.find((x) => x.handle === c.handle);
  const name = data?.sub ? `${data.sub.title} (${c.title})` : c.title;
  const description = metaDescription(
    categoryIntro(c.handle, data?.sub?.slug) ||
      c.description ||
      `${name} von TERRA / WORTMANN kaufen: ${cat?.teaser ?? 'IT-Hardware für Unternehmen'}.`,
    'Originalware von WORTMANN, Kauf auf Rechnung für Firmen, Beratung vom Systemhaus aus Verl.',
  );
  return [
    {title: pageTitle(categorySeoTitle(c.handle, data?.sub?.slug) ?? `${name} kaufen – TERRA von WORTMANN`)},
    {name: 'description', content: description},
    {property: 'og:title', content: `${name} – TERRA von WORTMANN`},
    {property: 'og:description', content: description},
  ];
};

const SORT_OPTIONS: {
  value: string;
  label: string;
  sortKey: ProductCollectionSortKeys;
  searchKey: ProductSortKeys;
  reverse: boolean;
}[] = [
  {value: 'price-asc', label: 'Preis aufsteigend', sortKey: 'PRICE', searchKey: 'PRICE', reverse: false},
  {value: 'price-desc', label: 'Preis absteigend', sortKey: 'PRICE', searchKey: 'PRICE', reverse: true},
  {value: 'newest', label: 'Neueste zuerst', sortKey: 'CREATED', searchKey: 'CREATED_AT', reverse: true},
  {value: 'title', label: 'Name A–Z', sortKey: 'TITLE', searchKey: 'TITLE', reverse: false},
  {value: 'best', label: 'Beliebteste', sortKey: 'BEST_SELLING', searchKey: 'BEST_SELLING', reverse: false},
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

  const groups = groupsFor(handle);
  const selected = parseFilters(handle, url.searchParams.get('f'));
  const baseQuery = categoryQuery(handle, sub?.slug).query;
  const fq = filterQuery(selected, groups);
  const useSearch = Boolean(sub || fq);

  const [{collection}, subResult, facetResult] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        sortKey: sort.sortKey,
        reverse: sort.reverse,
        // Bei Unterkategorie/Filter nur Kopf-Infos laden, Produkte kommen aus der Suche
        ...(useSearch ? {first: 1} : paginationVariables),
      },
    }),
    useSearch
      ? storefront.query(SUB_PRODUCTS_QUERY, {
          variables: {
            query: fq ? `(${baseQuery}) AND ${fq}` : baseQuery,
            sortKey: sort.searchKey,
            reverse: sort.reverse,
            ...paginationVariables,
          },
        })
      : Promise.resolve(null),
    groups.length
      ? storefront
          .query(FACET_TAGS_QUERY, {
            variables: {query: baseQuery},
            cache: storefront.CacheShort(),
          })
          .catch(() => null)
      : Promise.resolve(null),
  ]);

  if (!collection) {
    throw new Response(`Kategorie ${handle} nicht gefunden`, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  const rawProducts = subResult?.products ?? collection.products;
  // Ausgeblendete Produkte (Tag "ausblenden", Service-Optionen) nie in Listen zeigen
  const products = {...rawProducts, nodes: rawProducts.nodes.filter(isListable)};
  const allTags = (facetResult?.products.nodes ?? []).map((n) => n.tags);
  const counts = facetCounts(allTags, selected, groups);
  // Nur Werte anbieten, die in der Kategorie überhaupt vorkommen
  const present = new Set(allTags.flat());
  const filterGroups = groups
    .map((g) => ({
      ...g,
      values: g.values.filter((v) => present.has(FILTER_TAG_PREFIX + v.slug)),
    }))
    .filter((g) => g.values.length > 1 || g.values.some((v) => selected.includes(v.slug)));
  return {collection, products, sort: sort.value, sub, selected, filterGroups, counts};
}

export default function Collection() {
  const {collection, products, sort, sub, selected, filterGroups, counts} =
    useLoaderData<typeof loader>();
  const category = CATEGORIES.find((c) => c.handle === collection.handle);
  const subHref = (slug?: string) => {
    const next = new URLSearchParams();
    if (slug) next.set('sub', slug);
    if (sort !== 'price-asc') next.set('sort', sort);
    if (selected.length) next.set('f', selected.join(','));
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
          {categoryIntro(collection.handle, sub?.slug) || collection.description ? (
            <p className="collection-description">
              {categoryIntro(collection.handle, sub?.slug) || collection.description}
            </p>
          ) : null}
          {collection.handle === 'monitore' && (!sub || sub.slug === '27-zoll') ? (
            <p className="collection-guide-link">
              <Link to="/themen/terra-monitor-27-zoll" prefetch="intent">
                Ratgeber: TERRA Monitor 27 Zoll – alle Modelle im Vergleich →
              </Link>
            </p>
          ) : null}
          {collection.handle === 'desktop-pcs' && !sub ? (
            <p className="collection-guide-link">
              <Link to="/themen/terra-pc" prefetch="intent">
                Ratgeber: TERRA PC – Baureihen, beliebte Modelle und Geschichte →
              </Link>
            </p>
          ) : null}
          {collection.handle === 'server-netzwerk' ? (
            <p className="collection-guide-link">
              <Link to="/ratgeber/wortmann-server" prefetch="intent">
                Ratgeber: Wortmann Server – eigener Server oder TERRA CLOUD? →
              </Link>
            </p>
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
          {collection.handle === 'desktop-pcs' ? (
            <Link to="/konfigurator/terra-pc-business-6000" className="cfg-cta cfg-cta-wide">
              <Icon name="desktop" size={22} />
              <span>
                <strong>PC nach Wunsch? Zum Konfigurator</strong>
                <small>TERRA PC-BUSINESS 6000 individuell zusammenstellen – verbindliches Angebot innerhalb von 1 Werktag</small>
              </span>
              <Icon name="chevron-right" size={18} />
            </Link>
          ) : null}
          {filterGroups.length ? (
            <CollectionFilters groups={filterGroups} selected={selected} counts={counts} />
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

      <Analytics.CollectionView
        data={{collection: {id: collection.id, handle: collection.handle}}}
      />
    </div>
  );
}


const SUB_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query SubCategoryProducts(
    $query: String!
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
      query: $query,
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      sortKey: $sortKey,
      reverse: $reverse
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

const FACET_TAGS_QUERY = `#graphql
  query FacetTags($query: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(query: $query, first: 250) {
      nodes {
        tags
      }
    }
  }
` as const;
