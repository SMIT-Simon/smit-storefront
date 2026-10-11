import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/products.$handle';
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
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

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

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: Route.LoaderArgs) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();

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
  const hasSpecs = descriptionHtml.trim().length > 0;

  return (
    <div className="container product-page">
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

      {hasSpecs ? (
        <section className="specs" aria-labelledby="specs-title">
          <h2 id="specs-title">Technische Daten</h2>
          <div
            className="specs-body rich-text"
            dangerouslySetInnerHTML={{__html: descriptionHtml}}
          />
        </section>
      ) : null}

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
