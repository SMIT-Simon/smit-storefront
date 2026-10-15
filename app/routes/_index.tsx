import {isListable} from '~/lib/addons';
import {pageTitle} from '~/lib/seo';
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
import {HERO_SIZES, HeroSlider, type Slide} from '~/components/HeroSlider';
import {BRANCHEN, EINSATZBEREICHE} from '~/lib/solutions';
import {SolutionTiles} from '~/components/SolutionTiles';
import {siteImg} from '~/lib/site-images';
import {CLOUD_SERVICES} from '~/lib/cloud';

/** Erstes Slider-Bild (LCP) vorladen. */
export const links: Route.LinksFunction = () => {
  const img = siteImg(SLIDES[0].image, HERO_SIZES);
  return [
    {
      rel: 'preload',
      as: 'image',
      href: img.src,
      imageSrcSet: img.srcSet,
      imageSizes: img.sizes,
      fetchPriority: 'high',
    },
  ];
};

export const meta: Route.MetaFunction = () => [
  {title: pageTitle('TERRA Computer kaufen – PC, Laptop, Mini-PC & Monitor')},
  {
    name: 'description',
    content:
      'TERRA Computer vom deutschen Hersteller WORTMANN: TERRA PCs, Laptops (TERRA MOBILE), Mini-PCs, Monitore, Server und Zubehör. Netto-Preise für Firmen, PDF-Angebot, Kauf auf Rechnung, Einrichtung vom Systemhaus aus Verl.',
  },
  {property: 'og:title', content: 'TERRA Computer Shop – IT made in Germany'},
];

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
    .then((r) => {
      r.products.nodes = r.products.nodes.filter(isListable);
      return r;
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  const highlights = context.storefront
    .query(HIGHLIGHTS_QUERY, {
      variables: {
        pc: MONTH_HIGHLIGHT.pc.handle,
        monitor: MONTH_HIGHLIGHT.monitor.handle,
        notebook: MONTH_HIGHLIGHT.notebook.handle,
      },
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
  pc: {
    handle: 'terra-pc-business-6000-core-ultra-5-225-16-gb-500-gb-w11-pro-art-nr-1000133-1000133',
    eyebrow: 'PC des Monats',
    title: 'TERRA PC BUSINESS 6000',
    image: '/images/home/pc-des-monats.png',
    bullets: [
      'Intel® Core™ Ultra 5 Prozessor 225 (20 MB Cache, bis zu 4,90 GHz)',
      'Windows 11 Pro',
      'Intel® Grafik',
      '2× DisplayPort, 1× HDMI',
    ],
  },
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
    text: 'Notebooks, Desktop-PCs, Monitore, Server und Zubehör von WORTMANN – entwickelt und gefertigt in Deutschland.',
    cta: {label: 'Sortiment entdecken', to: '/collections/all'},
    secondary: {label: 'Angebot anfragen', to: '/pages/kontakt'},
    background: {image: '/images/home/hero-bg-terra.webp', note: 'Hintergrund mit Hilfe KI erstellt'},
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
      <SolutionsSection />
      <CloudTeaser />
      <RecommendedProducts products={data.recommendedProducts} />
      <PixelBanner />
      <DuoTeasers />
      <MadeInGermany />
      <SystemhausSection />
      <BusinessBanner />
    </div>
  );
}

function CloudTeaser() {
  const tiles = CLOUD_SERVICES.filter((x) =>
    ['virtuelle-server', 'backup', 'jtl-wawi-cloud', 'rechenzentrum'].includes(x.slug),
  );
  return (
    <section className="home-cloud" aria-labelledby="home-cloud">
      <img
        {...siteImg('/images/cloud/header.jpg', '100vw')}
        alt=""
        className="home-cloud-bg"
        loading="lazy"
      />
      <div className="container home-cloud-inner">
        <div>
          <span className="eyebrow eyebrow-light">Neu: TERRA CLOUD</span>
          <h2 id="home-cloud">Ihre Server in der Cloud – aus Ostwestfalen</h2>
          <p>
            Virtuelle Server, Backup und Hosting aus dem Rechenzentrum der WORTMANN AG in Hüllhorst:
            ISO 27001-zertifiziert, DSGVO-konform und monatlich kündbar. Eingerichtet und betreut von
            uns – Preise auf Anfrage.
          </p>
          <div className="feature-actions">
            <Link to="/cloud" className="btn btn-light" prefetch="intent">
              TERRA CLOUD entdecken <Icon name="arrow-right" size={18} />
            </Link>
            <Link to="/cloud#anfrage" className="btn btn-outline-light">
              Angebot anfragen
            </Link>
          </div>
        </div>
        <div className="home-cloud-tiles">
          {tiles.map((t) => (
            <Link key={t.slug} to={`/cloud/${t.slug}`} className="home-cloud-tile" prefetch="intent">
              <strong>{t.name}</strong>
              <span>{t.teaser}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionsSection() {
  return (
    <section className="section" aria-labelledby="branchen-home">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Branchen &amp; Lösungen</span>
            <h2 id="branchen-home">Die passende IT für Ihre Branche</h2>
          </div>
          <Link to="/loesungen" className="link-arrow" prefetch="intent">
            Alle Lösungen <Icon name="chevron-right" size={16} />
          </Link>
        </div>
        <SolutionTiles items={BRANCHEN} />
        <div className="solution-chips">
          <span>Nach Einsatzbereich:</span>
          {EINSATZBEREICHE.map((x) => (
            <Link key={x.slug} to={`/loesungen/${x.slug}`} className="sub-chip" prefetch="intent">
              {x.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const items: {icon: Parameters<typeof Icon>[0]['name']; title: string; text: string}[] = [
    {icon: 'shield', title: 'Originalware', text: 'Original TERRA von WORTMANN'},
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
            {...siteImg('/images/home/section-arbeitsplatz.webp', '(min-width: 64em) 600px, 93vw')}
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
              <img {...siteImg(t.image, '(min-width: 64em) 600px, 100vw')} alt={t.alt} loading="lazy" decoding="async" />
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
                  wide
                  eyebrow={`${m.pc.eyebrow} – ${m.label}`}
                  title={m.pc.title}
                  bullets={m.pc.bullets}
                  product={res?.pc ?? null}
                  image={m.pc.image}
                />
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
  wide = false,
  eyebrow,
  title,
  bullets,
  product,
  image,
}: {
  wide?: boolean;
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
    <article className={wide ? 'highlight-card highlight-card-wide' : 'highlight-card'}>
      <Link to={`/products/${product.handle}`} className="highlight-media" prefetch="intent">
        {image ? (
          <img {...siteImg(image, '(min-width: 64em) 600px, 82vw')} alt={title} loading="lazy" />
        ) : img ? (
          <img
            src={`${img.url}&width=640`}
            srcSet={[320, 480, 560, 640, 800]
              .map((w) => `${img.url}&width=${w} ${w}w`)
              .join(', ')}
            sizes="(min-width: 64em) 300px, 73vw"
            width={img.width ?? 640}
            height={img.height ?? 640}
            alt={img.altText || title}
            loading="lazy"
          />
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
            {...siteImg(FLYER.image(1), '(min-width: 64em) 420px, 87vw')}
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
          <img {...siteImg('/images/logo-smit.webp', '220px')} alt="SMIT Digital Services" width={220} height={70} loading="lazy" className="systemhaus-logo" />
          <span className="eyebrow">Ihr IT-Partner aus Verl</span>
          <h2 id="systemhaus">Hardware kaufen – und die IT gleich mit betreuen lassen</h2>
          <p>
            Hinter diesem Shop steht SMIT Digital Services, das Systemhaus aus Verl.
            Neben TERRA-Hardware kümmern wir uns um IT-Service, Beratung, Hosting und
            Wartung – damit Ihre neuen Geräte sauber in Ihr Unternehmen passen.
          </p>
          <div className="feature-actions">
            <a href="https://systemhaus-verl.de/" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              systemhaus-verl.de <Icon name="arrow-right" size={18} />
            </a>
            <Link to="/pages/kontakt" className="btn btn-secondary">
              Kontakt aufnehmen
            </Link>
          </div>
        </div>
        <div className="systemhaus-grid">
          {services.map((s) => (
            <a key={s.title} href={s.href} target="_blank" rel="noopener noreferrer" className="systemhaus-card">
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
            <h2>TERRA Pixelservice für Monitore</h2>
            <p>
              Zu jedem TERRA Monitor optional zubuchbar: Vor-Ort-Austausch mit
              Pixelservice – der Monitor wird bereits bei Pixelfehlern
              ausgetauscht. Laufzeit 24 bis 60 Monate, direkt beim Kauf wählbar.
            </p>
          </div>
          <div className="pixel-actions">
            <Link to="/collections/monitore" className="btn btn-primary" prefetch="intent">
              Monitore ansehen
            </Link>
            <Link to="/pages/kontakt" className="btn btn-secondary">
              Beratung anfragen
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
    {value: 'bis 5 Jahre', label: 'Vor-Ort-Service zubuchbar'},
  ];
  return (
    <section className="section brand-section">
      <div className="container">
        <div className="imig-banner">
          <img
            {...siteImg('/images/home/imig.webp', '(min-width: 72em) 1140px, 100vw')}
            alt="WORTMANN AG – IT. Made in Germany. Eine Erfolgsgeschichte aus Ostwestfalen."
            loading="lazy"
            width={1140}
            height={450}
          />
        </div>
        <div className="brand-inner">
          <div className="brand-copy">
            <img
              {...siteImg('/images/home/terra-logo.webp', '185px')}
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
              {...siteImg('/images/home/produktion.webp', '(min-width: 64em) 600px, 100vw')}
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

/** Typisches Wortmann-Produktfoto je Kategorie (Shopify-CDN, unverändert). */
const IMG = 'https://cdn.shopify.com/s/files/1/1089/3439/8286/files/';
const CATEGORY_IMAGES: Record<string, string> = {
  notebooks: `${IMG}item122085320000_ddc927d4-fc09-4bd6-94d5-94b077efeb9d.jpg?v=1791735055`,
  'desktop-pcs': `${IMG}item10000915000_d932a031-027d-489a-9e69-12d253cc7f35.jpg?v=1791734953`,
  'all-in-one-pcs': `${IMG}item100017510000.jpg?v=1791734982`,
  monitore: `${IMG}item303020110000.jpg?v=1791735203`,
  tablets: `${IMG}item122075215000.jpg?v=1791735039`,
  'server-netzwerk': `${IMG}item110011810000.jpg?v=1791735022`,
  zubehoer: `${IMG}item281075710000.jpg?v=1791735184`,
  'software-services': `${IMG}item65302505000.jpg?v=1791735231`,
};

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
              <span className="category-tile-media">
                {CATEGORY_IMAGES[c.handle] ? (
                  <img
                    src={`${CATEGORY_IMAGES[c.handle]}&width=300`}
                    srcSet={`${CATEGORY_IMAGES[c.handle]}&width=200 200w, ${CATEGORY_IMAGES[c.handle]}&width=300 300w, ${CATEGORY_IMAGES[c.handle]}&width=450 450w`}
                    sizes="(min-width: 64em) 200px, 35vw"
                    alt=""
                    width={300}
                    height={300}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <Icon name={c.icon} size={32} />
                )}
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
              Staffelpreisen, Serviceerweiterung und Vorinstallation.
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
    tags
    id
    handle
    title
    featuredImage { url altText width height }
    priceRange { minVariantPrice { amount currencyCode } }
    selectedOrFirstAvailableVariant { sku }
  }
  query Highlights($country: CountryCode, $language: LanguageCode, $pc: String!, $monitor: String!, $notebook: String!)
  @inContext(country: $country, language: $language) {
    pc: product(handle: $pc) { ...HighlightProduct }
    monitor: product(handle: $monitor) { ...HighlightProduct }
    notebook: product(handle: $notebook) { ...HighlightProduct }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    tags
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
    products(
      first: 8
      sortKey: CREATED_AT
      reverse: true
      query: "-product_type:'Service-Option' -product_type:'Software-Option' -product_type:'Software' -product_type:'Dienstleistung' -tag:'ausblenden'"
    ) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
