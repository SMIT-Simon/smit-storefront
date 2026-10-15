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
import {ProductBadges} from '~/components/ProductBadges';
import {LegalGuaranteeFull} from '~/components/LegalGuaranteeNotice';
import {CONFIG_MODELS} from '~/lib/configurator';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import {parseSpecs, keySpecs} from '~/lib/specs';
import {SITE_NAME, pageTitle, SITE_URL, OFFER_SHIPPING_DETAILS, OFFER_RETURN_POLICY} from '~/lib/seo';
import {getWortmannContent} from '~/lib/wortmann.server';
import {
  ADDON_PRODUCT_TYPES,
  SERVICE_PRODUCT_TYPES,
  isListable,
  serviceTextsFor,
  addonHandlesFor,
  osFromTags,
  serviceHandleFor,
  includedServiceFor,
  type IncludedService,
} from '~/lib/addons';
import {productsByHandle, type CardProductData} from '~/lib/products-by-handle.server';
import {manufacturerFor, type Manufacturer} from '~/lib/manufacturers';

export const meta: Route.MetaFunction = ({data}) => {
  const p = data?.product;
  if (!p) return [{title: 'Produkt nicht gefunden'}];
  const facts = keySpecs(parseSpecs(p.descriptionHtml), 4)
    .map((x) => x.value)
    .join(', ');
  const fallback = `${p.title} kaufen${facts ? `: ${facts}` : ''}. Original TERRA von WORTMANN – Beratung & Einrichtung vom Systemhaus.`;
  const description = (p.seo?.description || fallback).slice(0, 300);
  const title = p.seo?.title || pageTitle(`${p.title} kaufen`);
  const image = p.selectedOrFirstAvailableVariant?.image?.url ?? p.images.nodes[0]?.url;
  return [
    {title},
    ...(isListable(p) ? [] : [{name: 'robots', content: 'noindex, nofollow'}]),
    {name: 'description', content: description},
    {property: 'og:title', content: p.title},
    {property: 'og:description', content: description},
    ...(image ? [{property: 'og:image', content: image}] : []),
  ];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const criticalData = await loadCriticalData(args);
  const deferredData = loadDeferredData(args);

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
    const osTag = osFromTags(product.tags);
    const os = (parseSpecs(product.descriptionHtml).find((s) => s.label === 'Betriebssystem')?.value ?? '')
      .replace(/WORTMANN AG empfiehlt Windows 11 Pro f\u00fcr Unternehmen/gi, '');
    const hasWindows = osTag ? osTag !== 'none' : /windows|\bW11/i.test(`${product.title} ${os}`);
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

  // TERRA Vor-Ort-Service (eigenes Produkt je Gerät, Varianten = Laufzeit)
  const serviceHandle = SERVICE_PRODUCT_TYPES.includes(product.productType)
    ? serviceHandleFor(product.productType, product.selectedOrFirstAvailableVariant?.sku)
    : null;
  const serviceProduct = serviceHandle
    ? (
        await storefront
          .query(SERVICE_OPTION_QUERY, {
            variables: {handle: serviceHandle},
            cache: storefront.CacheShort(),
          })
          .catch(() => null)
      )?.product ?? null
    : null;

  // Passendes Zubehör: Metafeld hat Vorrang, sonst Wortmann-Zuordnung
  const metaHandles = (product.accessories?.references?.nodes ?? [])
    .map((n) => ('handle' in n ? n.handle : null))
    .filter((h): h is string => Boolean(h));
  const accHandles = (metaHandles.length ? metaHandles : wm.accessoryHandles).slice(0, 6);
  const accMap = accHandles.length
    ? await productsByHandle(storefront, accHandles).catch((e: Error) => {
        console.error(e);
        return {} as Record<string, CardProductData>;
      })
    : {};
  const accessoryProducts = accHandles
    .map((h) => accMap[h])
    .filter((x): x is CardProductData => Boolean(x?.selectedOrFirstAvailableVariant?.id));

  return {
    product,
    accessoryProducts,
    serviceProduct,
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
function loadDeferredData({context, params}: Route.LoaderArgs) {
  const {storefront} = context;
  const recommendations = storefront
    .query(PRODUCT_RECOMMENDATIONS_QUERY, {variables: {handle: params.handle!}})
    .then((r) => (r.productRecommendations ?? []).filter(isListable))
    .catch((error: Error) => {
      console.error(error);
      return [];
    });
  return {recommendations};
}


export default function Product() {
  const {
    product,
    recommendations,
    accessoryProducts,
    wmOverviewHtml,
    wmFeatures,
    addons,
    serviceProduct,
  } = useLoaderData<typeof loader>();

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
  const configModel = CONFIG_MODELS.find(
    (m) => m.baseArt === product.selectedOrFirstAvailableVariant?.sku,
  );
  const images = product.images.nodes;
  const category =
    CATEGORIES.find((c) =>
      product.collections.nodes.some((pc) => pc.handle === c.handle),
    ) ?? null;
  const specs = parseSpecs(descriptionHtml);
  const highlights = keySpecs(specs, 6);
  const overview = product.overview?.value?.trim() ?? '';
  const service = product.service?.value?.trim() ?? '';
  const included = includedServiceFor(productType);

  const price = selectedVariant?.price;
  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    sku: selectedVariant?.sku || undefined,
    mpn: selectedVariant?.sku || undefined,
    gtin13: selectedVariant?.barcode && /^\d{13}$/.test(selectedVariant.barcode) ? selectedVariant.barcode : undefined,
    brand: {'@type': 'Brand', name: vendor || 'TERRA'},
    manufacturer: {'@type': 'Organization', name: 'WORTMANN AG'},
    category: productType || undefined,
    image: images.slice(0, 6).map((i) => i.url),
    description: highlights.map((h) => `${h.label}: ${h.value}`).join(' · ') || title,
    url: `${SITE_URL}/products/${product.handle}`,
    additionalProperty: specs.slice(0, 20).map((x) => ({
      '@type': 'PropertyValue',
      name: x.label,
      value: x.value,
    })),
    offers: price
      ? {
          '@type': 'Offer',
          url: `${SITE_URL}/products/${product.handle}`,
          price: Number(price.amount).toFixed(2),
          priceCurrency: price.currencyCode,
          availability: selectedVariant?.availableForSale
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: {'@id': `${SITE_URL}/#store`},
          shippingDetails: OFFER_SHIPPING_DETAILS,
          hasMerchantReturnPolicy: OFFER_RETURN_POLICY,
        }
      : undefined,
  };

  return (
    <div className="product-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(productLd)}}
      />
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

            <ProductBadges tags={product.tags} productType={productType} />
            {configModel ? (
              <Link to={`/konfigurator/${configModel.slug}`} className="cfg-cta">
                <Icon name="desktop" size={20} />
                <span>
                  <strong>Individuell konfigurieren</strong>
                  <small>Prozessor, RAM, SSD, Grafik nach Wunsch – Angebot in 1 Werktag</small>
                </span>
                <Icon name="chevron-right" size={18} />
              </Link>
            ) : null}

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
                accessories={accessoryProducts}
                service={serviceProduct}
                serviceTexts={serviceTextsFor(productType)}
              />
              <ul className="buy-usps">
                <li>
                  <Icon name="shield" size={18} />{' '}
                  {included
                    ? `${included.months} Monate ${included.kind} inklusive`
                    : 'Originalware vom Hersteller'}
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
        included={included}
        hasServiceOptions={Boolean(serviceProduct)}
        title={title}
        isMonitor={productType === 'Monitor'}
        manufacturer={manufacturerFor(vendor)}
      />

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


type TabKey = 'overview' | 'specs' | 'service' | 'manufacturer';

function ProductTabs({
  overview,
  overviewHtml,
  features,
  specsHtml,
  hasSpecs,
  highlights,
  included,
  hasServiceOptions,
  title,
  isMonitor = false,
  manufacturer,
}: {
  manufacturer: Manufacturer;
  overview: string;
  overviewHtml: string;
  features: string[];
  specsHtml: string;
  hasSpecs: boolean;
  highlights: {label: string; value: string}[];
  included: IncludedService | null;
  hasServiceOptions: boolean;
  title: string;
  isMonitor?: boolean;
}) {
  const tabs: {key: TabKey; label: string}[] = [
    {key: 'overview', label: 'Übersicht'},
    ...(hasSpecs ? [{key: 'specs' as TabKey, label: 'Technische Daten'}] : []),
    {key: 'service', label: 'Service & Gewährleistung'},
    {key: 'manufacturer', label: 'Herstellerinformationen'},
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
            {included ? (
              <div className="service-card">
                <Icon name="shield" size={28} />
                <h3>
                  Inklusive: {included.months} Monate {included.kind}
                </h3>
                <p>{included.scope}</p>
              </div>
            ) : (
              <div className="service-card">
                <Icon name="shield" size={28} />
                <h3>Originalware</h3>
                <p>Originalprodukte von TERRA und weiteren Markenherstellern.</p>
              </div>
            )}
            <div className="service-card">
              <Icon name="truck" size={28} />
              <h3>Service &amp; Support</h3>
              <p>
                {hasServiceOptions
                  ? isMonitor
                    ? 'Optional zubuchbar: Vor-Ort-Austausch mit bis zu 60 Monaten Laufzeit, auf Wunsch mit Pixelservice – direkt beim Kauf wählbar.'
                    : 'Optional zubuchbar: 24h-Vor-Ort-Service mit bis zu 60 Monaten Laufzeit – direkt beim Kauf wählbar.'
                  : included
                    ? 'Serviceerweiterungen für dieses Gerät erhalten Sie auf Anfrage.'
                    : 'Unterstützung bei Fragen, Einrichtung und technischen Problemen.'}
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
          </div>

          {included ? (
            <div className="manufacturer-box included-service-terms">
              <h3>Angaben zum inklusiven Herstellerservice</h3>
              <dl>
                <dt>Leistung</dt>
                <dd>
                  {included.kind}: {included.scope}
                </dd>
                <dt>Laufzeit</dt>
                <dd>{included.months} Monate ab Kaufdatum</dd>
                <dt>Garantiegeber</dt>
                <dd>WORTMANN AG, Bredenhop 20, 32609 Hüllhorst, Deutschland</dd>
                <dt>Geltungsbereich</dt>
                <dd>Deutschland</dd>
                <dt>Abwicklung</dt>
                <dd>
                  Melden Sie sich im Servicefall bei uns (
                  <a href="mailto:info@wawi-servicepartner.de">info@wawi-servicepartner.de</a>,{' '}
                  <a href="tel:+4952469098980">+49 (0)5246-9098980</a>) – wir übernehmen die
                  Abwicklung mit dem Hersteller. Die Inanspruchnahme ist für Sie kostenlos.
                </dd>
                <dt>Bedingungen</dt>
                <dd>Es gelten die TERRA-Servicebedingungen der WORTMANN AG; wir senden sie Ihnen auf Wunsch zu.</dd>
              </dl>
              <p className="manufacturer-note">
                Ihre gesetzlichen Gewährleistungsrechte gegenüber uns als Verkäufer bestehen daneben
                uneingeschränkt; sie werden durch den Herstellerservice nicht eingeschränkt.
              </p>
            </div>
          ) : null}

          <div className="manufacturer-box">
            <h3>Gesetzliche Gewährleistung</h3>
            <LegalGuaranteeFull />
          </div>

        </div>

        <div
          role="tabpanel"
          id="panel-manufacturer"
          aria-labelledby="tab-manufacturer"
          hidden={active !== 'manufacturer'}
          className="tab-panel"
        >
          <div className="manufacturer-box manufacturer-info">
            <h3>Hersteller</h3>
            <address>
              <strong>{manufacturer.name}</strong>
              {manufacturer.lines.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            <p>
              {manufacturer.email ? (
                <>
                  E-Mail: <a href={`mailto:${manufacturer.email}`}>{manufacturer.email}</a>
                  <br />
                </>
              ) : null}
              {manufacturer.web ? (
                <>
                  Web:{' '}
                  <a href={manufacturer.web} target="_blank" rel="noopener noreferrer">
                    {manufacturer.web.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </a>
                </>
              ) : null}
            </p>
            <p className="manufacturer-note">
              Verantwortlicher Wirtschaftsakteur in der EU ist der oben genannte Hersteller. Verkäufer:
              SMIT Digital Services, Schlangenweg 73, 33415 Verl.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const RELATED_PRODUCT_FRAGMENT = `#graphql
  fragment RelatedProduct on Product {
    tags
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
    tags
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

const SERVICE_OPTION_QUERY = `#graphql
  query ServiceOption($handle: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      variants(first: 10) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
` as const;
