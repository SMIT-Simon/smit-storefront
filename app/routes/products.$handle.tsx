import {Suspense, useState} from 'react';
import {Await, Link, useLoaderData} from 'react-router';
import type {Route} from './+types/products.$handle';
import type {RelatedProductFragment} from 'storefrontapi.generated';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductGallery} from '~/components/ProductGallery';
import {Icon} from '~/components/Icon';
import {CATEGORIES} from '~/lib/categories';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import {parseSpecs, keySpecs} from '~/lib/specs';
import {getWortmannContent} from '~/lib/wortmann.server';
import {ADDON_PRODUCT_TYPES, addonHandlesFor} from '~/lib/addons';
import {productsByHandle, type CardProductData} from '~/lib/products-by-handle.server';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: data?.product.seo?.title || `${data?.product.title ?? ''} kaufen`},
    {name: 'description', content: data?.product.seo?.description || data?.product.description?.slice(0, 155) || ''},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const criticalData = await loadCriticalData(args);
  const deferredData = loadDeferredData(args, criticalData);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  const wm = getWortmannContent(product.selectedOrFirstAvailableVariant?.sku);

  // Zusatzleistungen (Einrichtung, Windows, Office, Virenschutz) für Computer
  let addons: CardProductData[] = [];
  if (ADDON_PRODUCT_TYPES.includes(product.productType)) {
    const os = parseSpecs(product.descriptionHtml).find((s) => s.label === 'Betriebssystem')?.value ?? '';
    const hasWindows = /windows|\bW11/i.test(`${product.title} ${os}`);
    const map = await productsByHandle(storefront, addonHandlesFor(hasWindows)).catch(
      (e: Error) => {
        console.error(e);
        return {} as Record<string, CardProductData>;
      },
    );
    addons = addonHandlesFor(hasWindows)
      .map((h) => map[h])
      .filter((x): x is CardProductData => Boolean(x));
  }

  return {
    product,
    wmOverviewHtml: wm.overviewHtml,
    wmFeatures: wm.features,
    wmAccessoryHandles: wm.accessoryHandles,
    addons,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData(
  {context, params}: Route.LoaderArgs,
  critical: {wmAccessoryHandles: string[]; product: {accessories?: unknown}},
) {
  const {storefront} = context;
  const hasMetafieldAccessories = Boolean(
    (critical.product as {accessories?: {references?: {nodes?: unknown[]}} | null})
      .accessories?.references?.nodes?.length,
  );
  const handles = hasMetafieldAccessories ? [] : critical.wmAccessoryHandles.slice(0, 8);
  const wmAccessories: Promise<RelatedProductFragment[]> = handles.length
    ? (
        storefront.query as unknown as (
          query: string,
          options: {cache: unknown},
        ) => Promise<Record<string, RelatedProductFragment | null>>
      ).call(storefront, buildAccessoryQuery(handles), {cache: storefront.CacheLong()})
        .then((r) =>
          Object.values(r).filter((x): x is RelatedProductFragment => Boolean(x?.id)),
        )
        .catch((error: Error) => {
          console.error(error);
          return [];
        })
    : Promise.resolve([]);
  const recommendations = storefront
    .query(PRODUCT_RECOMMENDATIONS_QUERY, {variables: {handle: params.handle!}})
    .then((r) => r.productRecommendations ?? [])
    .catch((error: Error) => {
      console.error(error);
      return [];
    });
  return {recommendations, wmAccessories};
}

/** Baut eine Abfrage mit einem Alias pro Zubehör-Handle. */
function buildAccessoryQuery(handles: string[]) {
  const fields = handles
    .map((h, i) => `a${i}: product(handle: "${h}") { ...RelatedProduct }`)
    .join('\n');
  return `
    query WortmannAccessories($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
      ${fields}
    }
    ${RELATED_PRODUCT_FRAGMENT}
  `;
}

export default function Product() {
  const {product, recommendations, wmAccessories, wmOverviewHtml, wmFeatures, addons} =
    useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml, vendor, productType} = product;
  const images = product.images.nodes;
  const category =
    CATEGORIES.find((c) =>
      product.collections.nodes.some((pc) => pc.handle === c.handle),
    ) ?? null;
  const specs = parseSpecs(descriptionHtml);
  const highlights = keySpecs(specs, 6);
  const overview = product.overview?.value?.trim() ?? '';
  const service = product.service?.value?.trim() ?? '';
  const accessories = (product.accessories?.references?.nodes ?? []).filter(
    (n): n is Extract<typeof n, {__typename: 'Product'}> =>
      n.__typename === 'Product',
  );

  return (
    <div className="product-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Brotkrumen">
          <Link to="/">Startseite</Link>
          <span aria-hidden="true">/</span>
          {category ? (
            <>
              <Link to={`/collections/${category.handle}`}>{category.title}</Link>
              <span aria-hidden="true">/</span>
            </>
          ) : null}
          <span>{title}</span>
        </nav>

        <div className="product">
          <ProductGallery images={images} title={title} />

          <div className="product-main">
            {vendor || productType ? (
              <span className="eyebrow">
                {[vendor, productType].filter(Boolean).join(' · ')}
              </span>
            ) : null}
            <h1 className="product-title">{title}</h1>

            <div className="product-meta-row">
              {service ? (
                <span className="service-badge">
                  <Icon name="shield" size={16} /> {service}
                </span>
              ) : null}
              <dl className="product-ids">
                {selectedVariant?.sku ? (
                  <div>
                    <dt>Art.-Nr.</dt>
                    <dd>{selectedVariant.sku}</dd>
                  </div>
                ) : null}
                {selectedVariant?.barcode ? (
                  <div>
                    <dt>EAN</dt>
                    <dd>{selectedVariant.barcode}</dd>
                  </div>
                ) : null}
              </dl>
            </div>

            {highlights.length ? (
              <ul className="key-specs" aria-label="Wichtigste Merkmale">
                {highlights.map((h) => (
                  <li key={h.label}>
                    <span>{h.label}</span>
                    <strong>{h.value}</strong>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="buy-box">
              <ProductPrice
                price={selectedVariant?.price}
                compareAtPrice={selectedVariant?.compareAtPrice}
              />
              <p
                className={
                  selectedVariant?.availableForSale
                    ? 'availability in-stock'
                    : 'availability out-of-stock'
                }
              >
                <span className="dot" aria-hidden="true" />
                {selectedVariant?.availableForSale
                  ? 'Lieferbar – Versand aus Deutschland'
                  : 'Derzeit nicht verfügbar'}
              </p>
              <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
                addons={addons}
              />
              <ul className="buy-usps">
                <li>
                  <Icon name="shield" size={18} /> Original TERRA mit
                  Herstellergarantie
                </li>
                <li>
                  <Icon name="invoice" size={18} /> Rechnung mit ausgewiesener
                  MwSt.
                </li>
                <li>
                  <Icon name="headset" size={18} /> Fragen zum Gerät?{' '}
                  <Link to="/pages/kontakt">Beratung anfragen</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <ProductTabs
        overview={overview}
        overviewHtml={wmOverviewHtml}
        features={wmFeatures}
        specsHtml={descriptionHtml}
        hasSpecs={specs.length > 0 || descriptionHtml.trim().length > 0}
        highlights={highlights}
        service={service}
        title={title}
        isMonitor={productType === 'Monitor'}
      />

      {accessories.length ? (
        <AccessorySection products={accessories} />
      ) : (
        <Suspense fallback={null}>
          <Await resolve={wmAccessories}>
            {(items) =>
              items.length ? <AccessorySection products={items} /> : null
            }
          </Await>
        </Suspense>
      )}

      {addons.length ? (
        <section className="section product-related software-section">
          <div className="container">
            <div className="section-head">
              <h2>Passende Software &amp; Services</h2>
              <Link to="/collections/software-services" className="link-arrow">
                Alle ansehen <Icon name="chevron-right" size={16} />
              </Link>
            </div>
            <div className="products-grid">
              {addons.slice(0, 4).map((p) => (
                <ProductItem key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Suspense fallback={null}>
        <Await resolve={recommendations}>
          {(recs) =>
            recs.length ? (
              <section className="section product-related">
                <div className="container">
                  <div className="section-head">
                    <h2>Ähnliche Produkte</h2>
                    {category ? (
                      <Link
                        to={`/collections/${category.handle}`}
                        className="link-arrow"
                      >
                        Alle {category.title} <Icon name="chevron-right" size={16} />
                      </Link>
                    ) : null}
                  </div>
                  <div className="products-grid">
                    {recs.slice(0, 4).map((p) => (
                      <ProductItem key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              </section>
            ) : null
          }
        </Await>
      </Suspense>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

function AccessorySection({products}: {products: RelatedProductFragment[]}) {
  return (
    <section className="section section-muted product-related">
      <div className="container">
        <div className="section-head">
          <h2>Passendes Zubehör</h2>
        </div>
        <div className="products-grid">
          {products.map((p) => (
            <ProductItem key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

type TabKey = 'overview' | 'specs' | 'service';

function ProductTabs({
  overview,
  overviewHtml,
  features,
  specsHtml,
  hasSpecs,
  highlights,
  service,
  title,
  isMonitor = false,
}: {
  overview: string;
  overviewHtml: string;
  features: string[];
  specsHtml: string;
  hasSpecs: boolean;
  highlights: {label: string; value: string}[];
  service: string;
  title: string;
  isMonitor?: boolean;
}) {
  const tabs: {key: TabKey; label: string}[] = [
    {key: 'overview', label: 'Übersicht'},
    ...(hasSpecs ? [{key: 'specs' as TabKey, label: 'Technische Daten'}] : []),
    {key: 'service', label: 'Service & Garantie'},
  ];
  const [active, setActive] = useState<TabKey>('overview');
  const paragraphs = overview ? overview.split(/\n\s*\n/) : [];

  return (
    <section className="product-tabs" aria-label="Produktinformationen">
      <div className="container">
        <div className="tab-list" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              id={`tab-${t.key}`}
              aria-selected={active === t.key}
              aria-controls={`panel-${t.key}`}
              className={active === t.key ? 'tab active' : 'tab'}
              onClick={() => setActive(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id="panel-overview"
          aria-labelledby="tab-overview"
          hidden={active !== 'overview'}
          className="tab-panel"
        >
          <div className="overview-grid">
            <div className="overview-text">
              <h2>{title}</h2>
              {paragraphs.length ? (
                paragraphs.map((p, i) => <p key={i}>{p}</p>)
              ) : overviewHtml ? (
                <div
                  className="overview-rich"
                  dangerouslySetInnerHTML={{__html: overviewHtml}}
                />
              ) : (
                <p>
                  Original TERRA-Hardware von WORTMANN – entwickelt und
                  gefertigt in Deutschland. Alle Details finden Sie unter
                  „Technische Daten“.
                </p>
              )}
              {features.length ? (
                <ul className="feature-logos" aria-label="Merkmale und Zertifikate">
                  {features.map((src) => (
                    <li key={src}>
                      <img src={src} alt="" loading="lazy" height={48} />
                    </li>
                  ))}
                </ul>
              ) : null}
              {hasSpecs ? (
                <button
                  type="button"
                  className="link-arrow as-button"
                  onClick={() => setActive('specs')}
                >
                  Alle technischen Daten anzeigen
                  <Icon name="chevron-right" size={16} />
                </button>
              ) : null}
            </div>
            {highlights.length ? (
              <div className="overview-facts">
                <h3>Auf einen Blick</h3>
                <dl>
                  {highlights.map((h) => (
                    <div key={h.label}>
                      <dt>{h.label}</dt>
                      <dd>{h.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </div>
        </div>

        {hasSpecs ? (
          <div
            role="tabpanel"
            id="panel-specs"
            aria-labelledby="tab-specs"
            hidden={active !== 'specs'}
            className="tab-panel"
          >
            <div
              className="specs-body rich-text"
              dangerouslySetInnerHTML={{__html: specsHtml}}
            />
          </div>
        ) : null}

        <div
          role="tabpanel"
          id="panel-service"
          aria-labelledby="tab-service"
          hidden={active !== 'service'}
          className="tab-panel"
        >
          <div className="service-grid">
            <div className="service-card">
              <Icon name="shield" size={28} />
              <h3>Inklusive</h3>
              <p>
                {service ||
                  'Herstellergarantie der WORTMANN AG gemäß den TERRA-Servicebedingungen.'}
              </p>
            </div>
            <div className="service-card">
              <Icon name="truck" size={28} />
              <h3>Vor-Ort-Service</h3>
              <p>
                Für TERRA-Geräte sind Garantieerweiterungen und 24h-Vor-Ort-Service
                mit bis zu 60 Monaten Laufzeit erhältlich – sprechen Sie uns an.
              </p>
            </div>
            <div className="service-card">
              <Icon name="headset" size={28} />
              <h3>Beratung</h3>
              <p>
                Sie sind unsicher, welche Ausstattung passt? Wir beraten Sie gern
                und erstellen ein individuelles Angebot.
              </p>
              <Link to="/pages/kontakt" className="link-arrow">
                Beratung anfragen <Icon name="chevron-right" size={16} />
              </Link>
            </div>
            {isMonitor ? (
              <div className="service-card service-card-accent">
                <Icon name="monitor" size={28} />
                <h3>TERRA Pixelgarantie</h3>
                <p>
                  Kleine Pixelfehler gelten herstellerübergreifend meist nicht als
                  Garantiefall. Mit der optionalen TERRA Pixelgarantie sind Sie
                  während der gesamten Garantiedauer gegen jeden Pixelfehler
                  abgesichert.
                </p>
                <Link to="/pages/kontakt" className="link-arrow">
                  Pixelgarantie anfragen <Icon name="chevron-right" size={16} />
                </Link>
              </div>
            ) : null}
          </div>

          <div className="manufacturer-box">
            <h3>Herstellerangaben</h3>
            <p>
              WORTMANN AG<br />
              Bredenhop 20<br />
              32609 Hüllhorst<br />
              Deutschland
            </p>
            <p>
              <a href="https://www.wortmann.de" target="_blank" rel="noreferrer">
                www.wortmann.de
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const RELATED_PRODUCT_FRAGMENT = `#graphql
  fragment RelatedProduct on Product {
    id
    title
    handle
    vendor
    productType
    featuredImage {
      id
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
` as const;

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    barcode
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    productType
    handle
    descriptionHtml
    images(first: 12) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    collections(first: 10) {
      nodes {
        handle
        title
      }
    }
    overview: metafield(namespace: "custom", key: "overview") {
      value
    }
    service: metafield(namespace: "custom", key: "service") {
      value
    }
    accessories: metafield(namespace: "custom", key: "accessories") {
      references(first: 8) {
        nodes {
          __typename
          ... on Product {
            ...RelatedProduct
          }
        }
      }
    }
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
  ${RELATED_PRODUCT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_RECOMMENDATIONS_QUERY = `#graphql
  query ProductRecommendations(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productHandle: $handle, intent: RELATED) {
      ...RelatedProduct
    }
  }
  ${RELATED_PRODUCT_FRAGMENT}
` as const;
