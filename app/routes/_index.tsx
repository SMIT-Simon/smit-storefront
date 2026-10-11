import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import type {
  RecommendedProductsQuery,
  HighlightsQuery,
  HighlightProductFragment,
} from 'storefrontapi.generated';
import {Price} from '~/components/Price';
import {FLYER, flyerHandles} from '~/lib/flyer';
import {productsByHandle, type CardProductData} from '~/lib/products-by-handle.server';
import {NetPrice} from '~/components/ProductPrice';
import {ModePrice} from '~/components/PriceMode';
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

  const highlights = context.storefront
    .query(HIGHLIGHTS_QUERY, {
      variables: {monitor: MONTH_HIGHLIGHT.monitor.handle, notebook: MONTH_HIGHLIGHT.notebook.handle},
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  const flyerProducts = productsByHandle(context.storefront, flyerHandles().slice(0, 8)).catch(
    (error: Error) => {
      console.error(error);
      return {} as Record<string, CardProductData>;
    },
  );

  return {recommendedProducts, highlights, flyerProducts};
}

/**
 * Highlights des Monats – hier einfach Handle und Texte austauschen.
 * (Angelehnt an den WORTMANN-Newsletter "LCD des Monats".)
 */
const MONTH_HIGHLIGHT = {
  label: 'Oktober',
  monitor: {
    handle: 'terra-lcd-led-2427w-v3-ips-black-hdmi-dp-usb-c-3030256',
    eyebrow: 'LCD des Monats',
    title: 'TERRA LCD/LED 2427W',
    bullets: [
      '60,5 cm (23,8") IPS-LED-Technologie',
      '1920 × 1080 Pixel, Full-HD-Display',
      'Bildwiederholrate 100 Hz',
      'HDMI, DisplayPort, USB-C (Audio & Video), Lautsprecher',
    ],
  },
  notebook: {
    handle: 'terra-mobile-1671l-copilot-pc-core-ultra-5-prozessor-32-gb-1-tb-w11-pro-1220867',
    eyebrow: 'Notebook-Highlight',
    title: 'TERRA MOBILE 1671L',
    image: '/images/home/mobile-1671l.webp',
    bullets: [
      'Copilot+ PC mit Intel Core Ultra 5',
      '16" QHD+ Display, beleuchtete Tastatur',
      'Bis zu 18 h Akkulaufzeit, nur 1,42 kg',
      'Magnesiumgehäuse, Windows Hello Kamera',
    ],
  },
};

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
      <MonthHighlights data={data.highlights} />
      <FlyerTeaser products={data.flyerProducts} />
      <FeatureWorkplace />
      <RecommendedProducts products={data.recommendedProducts} />
      <PixelBanner />
      <DuoTeasers />
      <MadeInGermany />
      <SystemhausSection />
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

function MonthHighlights({data}: {data: Promise<HighlightsQuery | null>}) {
  const m = MONTH_HIGHLIGHT;
  return (
    <section className="section section-muted" aria-labelledby="highlights">
      <div className="container">
        <div className="section-head">
          <h2 id="highlights">Highlights im {m.label}</h2>
        </div>
        <Suspense fallback={<div className="highlight-grid skeleton-grid" />}>
          <Await resolve={data}>
            {(res) => (
              <div className="highlight-grid">
                <HighlightCard
                  eyebrow={`${m.monitor.eyebrow} – ${m.label}`}
                  title={m.monitor.title}
                  bullets={m.monitor.bullets}
                  product={res?.monitor ?? null}
                />
                <HighlightCard
                  eyebrow={m.notebook.eyebrow}
                  title={m.notebook.title}
                  bullets={m.notebook.bullets}
                  product={res?.notebook ?? null}
                  image={m.notebook.image}
                />
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

function HighlightCard({
  eyebrow,
  title,
  bullets,
  product,
  image,
}: {
  eyebrow: string;
  title: string;
  bullets: string[];
  product: HighlightProductFragment | null;
  image?: string;
}) {
  if (!product) return null;
  const img = product.featuredImage;
  const sku = product.selectedOrFirstAvailableVariant?.sku;
  return (
    <article className="highlight-card">
      <Link to={`/products/${product.handle}`} className="highlight-media" prefetch="intent">
        {image ? (
          <img src={image} alt={title} loading="lazy" />
        ) : img ? (
          <img src={`${img.url}&width=640`} alt={img.altText || title} loading="lazy" />
        ) : null}
      </Link>
      <div className="highlight-body">
        <span className="highlight-badge">{eyebrow}</span>
        <h3>
          <Link to={`/products/${product.handle}`} prefetch="intent">
            {title}
          </Link>
        </h3>
        <ul className="check-list">
          {bullets.map((b) => (
            <li key={b}>
              <Icon name="check" size={18} /> {b}
            </li>
          ))}
        </ul>
        {sku ? <p className="highlight-sku">Art.-Nr. {sku}</p> : null}
        <div className="highlight-buy">
          <div>
            <strong className="highlight-price">
              <ModePrice data={product.priceRange.minVariantPrice} />
            </strong>
            <NetPrice price={product.priceRange.minVariantPrice} />
          </div>
          <Link to={`/products/${product.handle}`} className="btn btn-primary" prefetch="intent">
            Jetzt ansehen <Icon name="arrow-right" size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function FlyerTeaser({products}: {products: Promise<Record<string, CardProductData>>}) {
  return (
    <section className="section flyer-teaser" aria-labelledby="flyer-teaser">
      <div className="container flyer-teaser-inner">
        <Link to="/flyer" className="flyer-teaser-cover" prefetch="intent">
          <img
            src={FLYER.image(1)}
            alt={`${FLYER.title} – Titelseite`}
            loading="lazy"
            width={FLYER.pages[0].w}
            height={FLYER.pages[0].h}
          />
          <span className="flyer-teaser-badge">{FLYER.pages.length} Seiten</span>
        </Link>
        <div className="flyer-teaser-body">
          <span className="eyebrow">Aktueller Business-Flyer</span>
          <h2 id="flyer-teaser">{FLYER.title}</h2>
          <p>
            Die aktuellen Business-Angebote der WORTMANN AG für {FLYER.subtitle.replace(/ · /g, ', ')} –
            jedes Produkt im Flyer ist anklickbar und direkt bestellbar.
          </p>
          <Suspense fallback={<div className="products-grid skeleton-grid" />}>
            <Await resolve={products}>
              {(map) => (
                <div className="products-grid flyer-teaser-grid">
                  {Object.values(map)
                    .slice(0, 4)
                    .map((p) => (
                      <ProductItem key={p.id} product={p} />
                    ))}
                </div>
              )}
            </Await>
          </Suspense>
          <Link to="/flyer" className="btn btn-primary" prefetch="intent">
            Flyer durchklicken <Icon name="arrow-right" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function SystemhausSection() {
  const services = [
    {title: 'IT-Service', text: 'Einrichtung, Betreuung und Support Ihrer IT', href: 'https://systemhaus-verl.de/ITService'},
    {title: 'IT-Beratung', text: 'Planung von Arbeitsplätzen, Netzwerk und Infrastruktur', href: 'https://systemhaus-verl.de/ITBeratung'},
    {title: 'Wartungsverträge', text: 'Planbare Pflege und Updates für Ihre Systeme', href: 'https://systemhaus-verl.de/Wartungsvertraege'},
    {title: 'IT-Notfallservice', text: 'Schnelle Hilfe, wenn es darauf ankommt', href: 'https://systemhaus-verl.de/ITNotfallservice'},
    {title: 'Hosting', text: 'Server und Hosting für Ihr Unternehmen', href: 'https://systemhaus-verl.de/Hosting'},
    {title: 'JTL-Dienstleistungen', text: 'JTL-Wawi und JTL-Shop für Onlinehändler', href: 'https://systemhaus-verl.de/JTL'},
  ];
  return (
    <section className="section systemhaus" aria-labelledby="systemhaus">
      <div className="container systemhaus-inner">
        <div className="systemhaus-copy">
          <img src="/images/logo-smit.webp" alt="SMIT Digital Services" width={220} height={70} loading="lazy" className="systemhaus-logo" />
          <span className="eyebrow">Ihr IT-Partner aus Verl</span>
          <h2 id="systemhaus">Hardware kaufen – und die IT gleich mit betreuen lassen</h2>
          <p>
            Hinter diesem Shop steht SMIT Digital Services, das Systemhaus aus Verl.
            Neben TERRA-Hardware kümmern wir uns um IT-Service, Beratung, Hosting und
            Wartung – damit Ihre neuen Geräte sauber in Ihr Unternehmen passen.
          </p>
          <div className="feature-actions">
            <a href="https://systemhaus-verl.de/" target="_blank" rel="noopener" className="btn btn-primary">
              systemhaus-verl.de <Icon name="arrow-right" size={18} />
            </a>
            <Link to="/pages/kontakt" className="btn btn-secondary">
              Kontakt aufnehmen
            </Link>
          </div>
        </div>
        <div className="systemhaus-grid">
          {services.map((s) => (
            <a key={s.title} href={s.href} target="_blank" rel="noopener" className="systemhaus-card">
              <strong>{s.title}</strong>
              <span>{s.text}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function PixelBanner() {
  return (
    <section className="section">
      <div className="container">
        <div className="pixel-banner">
          <span className="pixel-icon" aria-hidden="true">
            <Icon name="monitor" size={34} />
          </span>
          <div>
            <h2>Die TERRA Pixelgarantie</h2>
            <p>
              Kleine Pixel- oder Subpixelfehler sind herstellerübergreifend in der
              Regel zu tolerieren und kein Garantiefall. Mit der TERRA
              Pixelgarantie schützen Sie sich vor jedem noch so kleinen
              Pixelfehler – während der gesamten Garantiedauer.
            </p>
          </div>
          <div className="pixel-actions">
            <Link to="/collections/monitore" className="btn btn-primary" prefetch="intent">
              Monitore ansehen
            </Link>
            <Link to="/pages/kontakt" className="btn btn-secondary">
              Pixelgarantie anfragen
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function MadeInGermany() {
  const facts = [
    {value: '800+', label: 'Mitarbeitende in Ostwestfalen'},
    {value: 'Hüllhorst', label: 'Entwicklung, Fertigung & Service'},
    {value: '24 h', label: 'individuell konfigurierte PCs'},
    {value: 'bis 5 Jahre', label: 'Garantie auf Wunsch'},
  ];
  return (
    <section className="section brand-section">
      <div className="container">
        <div className="imig-banner">
          <img
            src="/images/home/imig.webp"
            alt="WORTMANN AG – IT. Made in Germany. Eine Erfolgsgeschichte aus Ostwestfalen."
            loading="lazy"
            width={1140}
            height={450}
          />
        </div>
        <div className="brand-inner">
          <div className="brand-copy">
            <img
              src="/images/home/terra-logo.webp"
              alt="TERRA – IT. Made in Germany."
              width={185}
              height={64}
              className="brand-logo"
              loading="lazy"
            />
            <h2>IT made in Germany – aus Ostwestfalen für Europa</h2>
            <p>
              TERRA ist die Marke der WORTMANN AG aus Hüllhorst. PCs, Notebooks
              und Server werden dort entwickelt, montiert und geprüft – mit
              Komponenten namhafter Hersteller. Die eigene Fertigung macht
              individuelle Konfigurationen schnell möglich, und auch Service und
              Support sitzen in Deutschland.
            </p>
            <div className="fact-grid">
              {facts.map((f) => (
                <div key={f.label} className="fact">
                  <strong>{f.value}</strong>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="brand-media">
            <img
              src="/images/home/produktion.webp"
              alt="Montage eines TERRA Systems in der Produktion in Hüllhorst"
              loading="lazy"
              width={1400}
              height={788}
            />
          </div>
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

const HIGHLIGHTS_QUERY = `#graphql
  fragment HighlightProduct on Product {
    id
    handle
    title
    featuredImage { url altText width height }
    priceRange { minVariantPrice { amount currencyCode } }
    selectedOrFirstAvailableVariant { sku }
  }
  query Highlights($country: CountryCode, $language: LanguageCode, $monitor: String!, $notebook: String!)
  @inContext(country: $country, language: $language) {
    monitor: product(handle: $monitor) { ...HighlightProduct }
    notebook: product(handle: $notebook) { ...HighlightProduct }
  }
` as const;

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
