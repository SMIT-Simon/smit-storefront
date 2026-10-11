import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import {MockShopNotice} from '~/components/MockShopNotice';
import {Icon} from '~/components/Icon';
import {CATEGORIES} from '~/lib/categories';
import {HeroSlider, type Slide} from '~/components/HeroSlider';

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

const SLIDES: Slide[] = [
  {
    image: '/images/home/slide-familie.webp',
    alt: 'TERRA Produktfamilie: Server, Monitor, Desktop-PC, Mini-PC, Tablet und Notebook',
    eyebrow: 'TERRA – IT Made in Germany',
    title: 'Das komplette TERRA-Sortiment für Ihr Unternehmen',
    text: 'Notebooks, Desktop-PCs, Monitore, Server und Zubehör von WORTMANN – entwickelt und gefertigt in Deutschland, mit Herstellergarantie.',
    cta: {label: 'Sortiment entdecken', to: '/collections/all'},
    secondary: {label: 'Angebot anfragen', to: '/pages/kontakt'},
  },
  {
    image: '/images/home/slide-arbeitsplatz.webp',
    alt: 'TERRA Arbeitsplatz mit Notebook, Monitor, Dockingstation, Headset, Tastatur und Maus',
    eyebrow: 'Arbeitsplatz aus einer Hand',
    title: 'Notebook, Monitor, Dock – perfekt aufeinander abgestimmt',
    text: 'Stellen Sie komplette Arbeitsplätze zusammen: TERRA Business-Notebooks mit passenden Monitoren, Dockingstations und Eingabegeräten.',
    cta: {label: 'Notebooks ansehen', to: '/collections/notebooks'},
    secondary: {label: 'Zubehör', to: '/collections/zubehoer'},
  },
  {
    image: '/images/home/slide-server.webp',
    alt: 'TERRA Rack-Server in verschiedenen Bauformen',
    eyebrow: 'Server & Netzwerk',
    title: 'TERRA Server – zuverlässig im Dauerbetrieb',
    text: 'Rack- und Tower-Server für kleine und mittlere Unternehmen. Gerne beraten wir Sie zu Konfiguration, Service und Laufzeit.',
    cta: {label: 'Server ansehen', to: '/collections/server-netzwerk'},
    secondary: {label: 'Beratung anfragen', to: '/pages/kontakt'},
  },
  {
    image: '/images/home/slide-monitor.webp',
    alt: 'TERRA Mini-PC mit Monitor, Tastatur und Maus',
    eyebrow: 'Platzsparend arbeiten',
    title: 'Kompakte PCs und Monitore für jeden Schreibtisch',
    text: 'Leise, sparsame TERRA Mini-PCs und ergonomische Monitore – ideal für Büro, Empfang und Schulungsräume.',
    cta: {label: 'Desktop-PCs ansehen', to: '/collections/desktop-pcs'},
    secondary: {label: 'Monitore', to: '/collections/monitore'},
  },
];

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      {data.isShopLinked ? null : (
        <div className="container">
          <MockShopNotice />
        </div>
      )}
      <HeroSlider slides={SLIDES} />
      <TrustBar />
      <CategoryGrid />
      <FeatureWorkplace />
      <RecommendedProducts products={data.recommendedProducts} />
      <DuoTeasers />
      <BrandSection />
      <BusinessBanner />
    </div>
  );
}

function TrustBar() {
  const items: {icon: Parameters<typeof Icon>[0]['name']; title: string; text: string}[] = [
    {icon: 'shield', title: 'Herstellergarantie', text: 'Original TERRA von WORTMANN'},
    {icon: 'invoice', title: 'Netto-Preise', text: 'Rechnung mit ausgewiesener MwSt.'},
    {icon: 'headset', title: 'Persönliche Beratung', text: 'Vor und nach dem Kauf'},
    {icon: 'truck', title: 'Versand aus Deutschland', text: 'Schnell und versichert'},
  ];
  return (
    <section className="trust-bar" aria-label="Unsere Vorteile">
      <div className="container trust-bar-inner">
        {items.map((it) => (
          <div key={it.title} className="trust-item">
            <Icon name={it.icon} size={26} />
            <div>
              <strong>{it.title}</strong>
              <span>{it.text}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureWorkplace() {
  return (
    <section className="section">
      <div className="container feature-split">
        <div className="feature-media">
          <img
            src="/images/home/section-arbeitsplatz.webp"
            alt="TERRA Arbeitsplatz mit Monitor, Notebook, Dockingstation, Tastatur und Maus"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="feature-copy">
          <span className="eyebrow">Moderne Arbeitsplätze</span>
          <h2>Mehr Produktivität im Büro und im Homeoffice</h2>
          <p>
            Mit einem TERRA-Notebook, einer USB-C-Dockingstation und einem
            großen Monitor wird jeder Schreibtisch zum vollwertigen Arbeitsplatz
            – ein Kabel genügt für Bild, Netzwerk und Strom.
          </p>
          <ul className="check-list">
            <li><Icon name="check" size={18} /> Business-Notebooks mit Windows 11 Pro</li>
            <li><Icon name="check" size={18} /> Monitore mit ergonomischem Standfuß</li>
            <li><Icon name="check" size={18} /> Docks, Tastaturen, Mäuse und Headsets</li>
          </ul>
          <div className="feature-actions">
            <Link to="/collections/notebooks" className="btn btn-primary" prefetch="intent">
              Notebooks <Icon name="arrow-right" size={18} />
            </Link>
            <Link to="/collections/monitore" className="btn btn-secondary" prefetch="intent">
              Monitore
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function DuoTeasers() {
  const teasers = [
    {
      image: '/images/home/section-pc-familie.webp',
      alt: 'TERRA Desktop-PCs in verschiedenen Bauformen vom Mini-PC bis zum Tower',
      eyebrow: 'Desktop-PCs',
      title: 'Vom Mini-PC bis zur Workstation',
      text: 'Small-Form-Factor, Midi-Tower oder Mini-PC – TERRA PCs gibt es für jeden Einsatz.',
      to: '/collections/desktop-pcs',
      cta: 'Desktop-PCs ansehen',
    },
    {
      image: '/images/home/section-tower-server.webp',
      alt: 'TERRA Tower-Server in drei Größen',
      eyebrow: 'Server',
      title: 'Tower-Server für Büro und Filiale',
      text: 'Leise Tower-Server für kleine Netzwerke – ohne Serverschrank, mit Service-Optionen.',
      to: '/collections/server-netzwerk',
      cta: 'Server ansehen',
    },
  ];
  return (
    <section className="section">
      <div className="container duo-teasers">
        {teasers.map((t) => (
          <Link key={t.to} to={t.to} className="duo-teaser" prefetch="intent">
            <div className="duo-teaser-media">
              <img src={t.image} alt={t.alt} loading="lazy" decoding="async" />
            </div>
            <div className="duo-teaser-body">
              <span className="eyebrow">{t.eyebrow}</span>
              <h3>{t.title}</h3>
              <p>{t.text}</p>
              <span className="link-arrow">
                {t.cta} <Icon name="chevron-right" size={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function BrandSection() {
  return (
    <section className="section brand-section">
      <div className="container brand-inner">
        <div className="brand-copy">
          <img
            src="/images/home/terra-logo.webp"
            alt="TERRA – IT. Made in Germany."
            width={185}
            height={64}
            className="brand-logo"
            loading="lazy"
          />
          <h2>IT-Hardware aus Ostwestfalen</h2>
          <p>
            TERRA ist die Marke der WORTMANN AG aus Hüllhorst. Notebooks, PCs und
            Server werden dort entwickelt, montiert und getestet – und auch der
            Service sitzt in Deutschland. Das sorgt für kurze Wege, langfristige
            Verfügbarkeit und Ansprechpartner, die Ihre Sprache sprechen.
          </p>
          <div className="brand-points">
            <div><strong>Made in Germany</strong><span>Entwicklung &amp; Fertigung</span></div>
            <div><strong>Service</strong><span>Garantie &amp; Vor-Ort-Optionen</span></div>
            <div><strong>Nachhaltig</strong><span>Lange Verfügbarkeit &amp; Ersatzteile</span></div>
          </div>
        </div>
        <div className="brand-media">
          <img
            src="/images/home/section-dual-monitor.webp"
            alt="TERRA Arbeitsplatz mit zwei Monitoren"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}

function CategoryGrid() {
  return (
    <section className="section section-tight">
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
