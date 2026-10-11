import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import {MockShopNotice} from '~/components/MockShopNotice';
import {Icon} from '~/components/Icon';
import {CATEGORIES} from '~/lib/categories';

export const meta: Route.MetaFunction = ({matches}) => {
  const root = matches.find((m) => m?.id === 'root')?.data as
    | {header?: {shop?: {name?: string}}}
    | undefined;
  const name = root?.header?.shop?.name ?? 'TERRA Shop';
  return [
    {title: `${name} – TERRA Notebooks, PCs & Server für Unternehmen`},
    {
      name: 'description',
      content:
        'TERRA Notebooks, Desktop-PCs, All-in-One-PCs, Monitore, Server und Zubehör von WORTMANN – für Unternehmen, Behörden und Privatkunden.',
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  return {
    ...deferredData,
    isShopLinked: Boolean(args.context.env.PUBLIC_STORE_DOMAIN),
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {recommendedProducts};
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      {data.isShopLinked ? null : (
        <div className="container">
          <MockShopNotice />
        </div>
      )}
      <Hero />
      <CategoryGrid />
      <RecommendedProducts products={data.recommendedProducts} />
      <BusinessBanner />
    </div>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="eyebrow">Autorisierter TERRA-Händler</span>
          <h1>
            IT-Hardware, die im Büro <span>einfach funktioniert.</span>
          </h1>
          <p className="hero-lead">
            Notebooks, PCs, Server und Zubehör von WORTMANN – entwickelt und
            gefertigt in Deutschland. Für Unternehmen, Behörden, Schulen und
            alle, die verlässliche Technik brauchen.
          </p>
          <div className="hero-actions">
            <Link to="/collections/notebooks" className="btn btn-primary" prefetch="intent">
              Notebooks ansehen <Icon name="arrow-right" size={18} />
            </Link>
            <Link to="/pages/kontakt" className="btn btn-secondary">
              Angebot anfragen
            </Link>
          </div>
          <ul className="hero-checks">
            <li>
              <Icon name="check" size={16} /> Herstellergarantie
            </li>
            <li>
              <Icon name="check" size={16} /> Netto-Preise für Firmen
            </li>
            <li>
              <Icon name="check" size={16} /> Beratung vor dem Kauf
            </li>
          </ul>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-card hero-card-1">
            <Icon name="notebook" size={56} />
            <span>Notebooks</span>
          </div>
          <div className="hero-card hero-card-2">
            <Icon name="desktop" size={56} />
            <span>Desktop-PCs</span>
          </div>
          <div className="hero-card hero-card-3">
            <Icon name="server" size={56} />
            <span>Server</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryGrid() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2>Sortiment nach Kategorie</h2>
          <Link to="/collections/all" className="link-arrow" prefetch="intent">
            Alle Produkte <Icon name="chevron-right" size={16} />
          </Link>
        </div>
        <div className="category-grid">
          {CATEGORIES.map((c) => (
            <Link
              key={c.handle}
              to={`/collections/${c.handle}`}
              className="category-tile"
              prefetch="intent"
            >
              <span className="category-tile-icon">
                <Icon name={c.icon} size={32} />
              </span>
              <span className="category-tile-title">{c.title}</span>
              <span className="category-tile-teaser">{c.teaser}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <section className="section section-muted" aria-labelledby="new-products">
      <div className="container">
        <div className="section-head">
          <h2 id="new-products">Neu im Sortiment</h2>
          <Link to="/collections/all" className="link-arrow" prefetch="intent">
            Alles ansehen <Icon name="chevron-right" size={16} />
          </Link>
        </div>
        <Suspense fallback={<div className="products-grid skeleton-grid" />}>
          <Await resolve={products}>
            {(response) => (
              <div className="products-grid">
                {response
                  ? response.products.nodes.map((product) => (
                      <ProductItem key={product.id} product={product} />
                    ))
                  : null}
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

function BusinessBanner() {
  return (
    <section className="section">
      <div className="container">
        <div className="b2b-banner">
          <div>
            <span className="eyebrow eyebrow-light">Für Geschäftskunden</span>
            <h2>Größere Stückzahlen oder individuelle Konfiguration?</h2>
            <p>
              Wir erstellen Ihnen ein persönliches Angebot – inklusive
              Staffelpreisen, Garantieerweiterung und Vorinstallation.
            </p>
          </div>
          <Link to="/pages/kontakt" className="btn btn-light">
            Angebot anfragen <Icon name="arrow-right" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    vendor
    productType
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
