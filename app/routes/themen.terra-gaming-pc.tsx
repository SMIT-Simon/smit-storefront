import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/themen.terra-gaming-pc';
import {formatPrice} from '~/components/Price';
import {ProductItem} from '~/components/ProductItem';
import {Icon} from '~/components/Icon';
import {PRODUCT_ITEM_FRAGMENT} from '~/lib/product-item-fragment';
import {isListable} from '~/lib/addons';
import {SITE_URL, pageTitle} from '~/lib/seo';
import {siteImg} from '~/lib/site-images';
import {CONFIG_MODELS, priceOf, defaultSelection} from '~/lib/configurator';

const SLUG = '/themen/terra-gaming-pc';
const H1 = 'TERRA Gaming PC – Gaming-Rechner aus Deutschland';
const TITLE = 'TERRA Gaming PC kaufen – GAMER ELITE von WORTMANN';
const DESCRIPTION =
  'TERRA Gaming PCs der Serie GAMER ELITE: Intel Core Ultra oder AMD Ryzen, GeForce RTX 50 oder Radeon RX 9060 XT, montiert in Deutschland. Alle Modelle im Vergleich mit Preis.';

const NOTEBOOK = 'terra-mobile-elite-5v4-1220870';

/** Ausstattung der Modelle (aus den Datenblättern der WORTMANN AG) */
const SPECS: Record<string, {tier: string; cpu: string; gpu: string; ram: string; extra: string}> = {
  'terra-pc-gamer-elite-1-1000172': {
    tier: 'Einstieg',
    cpu: 'Intel Core Ultra 5 225',
    gpu: 'GeForce RTX 3050 · 6 GB',
    ram: '16 GB DDR5 · 1 TB SSD',
    extra: 'Leiser Heatpipe-Kühler, Tastatur & Maus',
  },
  'terra-pc-gamer-elite-2-ryzen-5-9600x-16-gb-1-tb-w11-pro-1000182': {
    tier: 'Mittelklasse · AMD',
    cpu: 'AMD Ryzen 5 9600X',
    gpu: 'Radeon RX 9060 XT · 16 GB',
    ram: '16 GB DDR5 · 1 TB SSD',
    extra: 'Cooler Master TD500 Mesh, Wi-Fi 6, RGB-Tastatur & Maus',
  },
  'terra-pc-gamer-elite-2-core-ultra-5-245k-16-gb-1-tb-w11-pro-1000173': {
    tier: 'Mittelklasse · Intel',
    cpu: 'Intel Core Ultra 5 245K',
    gpu: 'GeForce RTX 5060 Ti · 16 GB',
    ram: '16 GB DDR5 · 1 TB SSD',
    extra: 'Noctua-Kühler, Wi-Fi 7, RGB-Tastatur & Maus',
  },
  'terra-pc-gamer-elite-3-1000174': {
    tier: 'High-End',
    cpu: 'Intel Core Ultra 7 265KF',
    gpu: 'GeForce RTX 5070 Ti · 16 GB',
    ram: '32 GB DDR5 · 1 TB SSD',
    extra: '240-mm-Wasserkühlung, be quiet! Gehäuse mit Fenster, Wi-Fi 7',
  },
};
const ORDER = Object.keys(SPECS);

const FAQ = [
  {
    q: 'Wer baut TERRA Gaming PCs?',
    a: 'TERRA Gaming PCs kommen von der WORTMANN AG aus Hüllhorst in Ostwestfalen. Die GAMER-ELITE-Modelle werden nach ISO 9001 in Deutschland montiert und geprüft – mit Markenkomponenten von Herstellern wie ASUS, Gigabyte, MSI, Noctua, be quiet! und Cooler Master.',
  },
  {
    q: 'Welcher TERRA Gaming PC ist der richtige?',
    a: 'Für Full-HD-Gaming und E-Sports reicht der GAMER ELITE 1. Wer aktuelle Spiele in WQHD mit hohen Details spielen möchte, ist mit einem GAMER ELITE 2 (RTX 5060 Ti oder RX 9060 XT mit je 16 GB) gut bedient. Der GAMER ELITE 3 mit RTX 5070 Ti und 32 GB RAM ist für WQHD/4K, Streaming und Content Creation gedacht.',
  },
  {
    q: 'Ist Windows bei TERRA Gaming PCs dabei?',
    a: 'Ja, die Gaming PCs werden mit vorinstalliertem Windows 11 Home ausgeliefert, dazu ein Monat Xbox Game Pass für PC und ein Testmonat Microsoft 365 für Neukunden.',
  },
  {
    q: 'Gibt es auch Gaming-Notebooks von TERRA?',
    a: 'Ja. Das TERRA MOBILE ELITE 5v4 ist ein 17,3-Zoll-Notebook mit WQHD-Display (165 Hz), Intel Core Ultra 9 275HX, GeForce RTX 5070 und 32 GB RAM – genug Leistung zum Spielen und für anspruchsvolle Anwendungen unterwegs.',
  },
  {
    q: 'Welcher Service ist bei TERRA Gaming PCs dabei?',
    a: 'Wie alle TERRA PCs haben die Gaming-Modelle 24 Monate Bring-In-Service der WORTMANN AG inklusive. Die gesetzliche Gewährleistung besteht unabhängig davon.',
  },
];

export const meta: Route.MetaFunction = () => [
  {title: pageTitle(TITLE)},
  {name: 'description', content: DESCRIPTION},
  {property: 'og:title', content: H1},
  {property: 'og:description', content: DESCRIPTION},
  {property: 'og:image', content: siteImg('/images/gaming/bg2.jpg').src},
];

export async function loader({context}: Route.LoaderArgs) {
  const res = await context.storefront
    .query(GAMING_QUERY, {
      variables: {query: 'tag:"sub:gamer" OR title:"TERRA MOBILE ELITE 5v4"', first: 20},
      cache: context.storefront.CacheShort(),
    })
    .catch(() => null);
  const all = (res?.products.nodes ?? []).filter(isListable);
  const pcs = ORDER.map((h) => all.find((p) => p.handle === h)).filter(
    (p): p is (typeof all)[number] => Boolean(p),
  );
  // weitere Gaming-PCs, die später dazukommen, hinten anhängen
  for (const p of all) {
    if (!ORDER.includes(p.handle) && p.handle !== NOTEBOOK && p.productType === 'Desktop-PC') pcs.push(p);
  }
  const notebook = all.find((p) => p.handle === NOTEBOOK) ?? null;
  return {pcs, notebook};
}

export default function TerraGamingPc() {
  const {pcs, notebook} = useLoaderData<typeof loader>();
  const url = `${SITE_URL}${SLUG}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {'@type': 'ListItem', position: 1, name: 'Startseite', item: `${SITE_URL}/`},
          {'@type': 'ListItem', position: 2, name: 'TERRA Gaming PC', item: url},
        ],
      },
      {
        '@type': 'ItemList',
        name: 'TERRA Gaming PCs',
        itemListElement: [...pcs, ...(notebook ? [notebook] : [])].map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/products/${p.handle}`,
          name: p.title,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {'@type': 'Answer', text: f.a},
        })),
      },
    ],
  };
  const from = pcs.length
    ? Math.min(...pcs.map((p) => Number(p.priceRange.minVariantPrice.amount)))
    : null;

  return (
    <div className="gaming-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />

      <section className="gaming-hero">
        <img
          {...siteImg('/images/gaming/bg2.jpg', '100vw')}
          alt=""
          className="gaming-hero-bg"
          loading="eager"
          fetchPriority="high"
        />
        <div className="container gaming-hero-inner">
          <nav className="breadcrumb breadcrumb-light" aria-label="Brotkrümel">
            <Link to="/">Startseite</Link>
            <span aria-hidden>›</span>
            <span>TERRA Gaming PC</span>
          </nav>
          <span className="gaming-eyebrow">TERRA GAMING · montiert in Deutschland</span>
          <h1>{H1}</h1>
          <p>
            Die Gaming PCs der Serie <strong>TERRA PC GAMER ELITE</strong> baut die WORTMANN AG in Hüllhorst – mit
            aktuellen Prozessoren von Intel und AMD, Grafikkarten der GeForce RTX 50 und Radeon RX 9000 Serie
            und Markenkomponenten von ASUS, Gigabyte, MSI, Noctua, be quiet! und Cooler Master.
          </p>
          <div className="feature-actions">
            <a href="#modelle" className="btn btn-gaming">
              Gaming PCs ansehen <Icon name="arrow-right" size={18} />
            </a>
            <Link to="/collections/desktop-pcs?sub=gamer" className="btn btn-outline-light" prefetch="intent">
              Zur Kategorie PC-Gamer
            </Link>
          </div>
          <ul className="gaming-usps">
            <li>
              <strong>{from ? `ab ${formatPrice({amount: String(from), currencyCode: 'EUR'})}` : 'GAMER ELITE'}</strong>
              <span>komplett mit Windows 11</span>
            </li>
            <li>
              <strong>bis RTX 5070 Ti</strong>
              <span>16 GB Grafikspeicher</span>
            </li>
            <li>
              <strong>ISO 9001</strong>
              <span>Montage in Deutschland</span>
            </li>
            <li>
              <strong>24 Monate</strong>
              <span>Bring-In-Service inklusive</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="section gaming-section" id="modelle">
        <div className="container">
          <h2 className="section-title">TERRA PC GAMER ELITE im Vergleich</h2>
          <div className="gaming-tiers">
            {pcs
              .filter((p) => SPECS[p.handle])
              .map((p) => {
                const s = SPECS[p.handle];
                return (
                  <Link key={p.id} to={`/products/${p.handle}`} className="gaming-tier" prefetch="intent">
                    <span className="gaming-tier-badge">{s.tier}</span>
                    {p.featuredImage ? (
                      <img
                        src={`${p.featuredImage.url}${p.featuredImage.url.includes('?') ? '&' : '?'}width=360`}
                        alt={p.featuredImage.altText || p.title}
                        width={360}
                        height={360}
                        loading="lazy"
                      />
                    ) : null}
                    <strong>{p.title.replace(/ – .*$/, '')}</strong>
                    <ul>
                      <li>
                        <span>Prozessor</span>
                        {s.cpu}
                      </li>
                      <li>
                        <span>Grafik</span>
                        {s.gpu}
                      </li>
                      <li>
                        <span>Speicher</span>
                        {s.ram}
                      </li>
                    </ul>
                    <small>{s.extra}</small>
                    <span className="gaming-tier-price">{formatPrice(p.priceRange.minVariantPrice)}</span>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>

      <section className="section gaming-section gaming-config" id="konfigurator">
        <div className="container">
          <span className="gaming-eyebrow">Gaming-PC-Konfigurator</span>
          <h2 className="section-title">Ihren Gaming PC selbst zusammenstellen</h2>
          <p className="gaming-config-lead">
            Grafikkarte, Prozessor, Arbeitsspeicher, Kühlung, Windows und Service frei wählen – WORTMANN baut Ihren
            PC nach Auftrag in Hüllhorst. Lieferzeit 2–3 Wochen, verbindliches Angebot innerhalb von einem Werktag.
          </p>
          <div className="gaming-config-grid">
            {CONFIG_MODELS.filter((m) => m.theme === 'gaming').map((m) => {
              const p = priceOf(m, defaultSelection(m), 'bring-in');
              return (
                <Link key={m.slug} to={`/konfigurator/${m.slug}`} className="gaming-config-card" prefetch="intent">
                  <strong>{m.name}</strong>
                  <span>{m.standard[1]}</span>
                  <span className="gaming-config-price">
                    ab {formatPrice({amount: String(Math.round(p.total * 1.19 * 100) / 100), currencyCode: 'EUR'})}
                  </span>
                  <span className="link-arrow">
                    Konfigurieren <Icon name="chevron-right" size={16} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {notebook ? (
        <section className="section gaming-section gaming-notebook">
          <div className="container gaming-split">
            <div className="gaming-split-media">
              <img
                {...siteImg('/images/gaming/elite5-front.png', '(min-width: 64em) 520px, 100vw')}
                alt="TERRA MOBILE ELITE Gaming-Notebook"
                loading="lazy"
              />
            </div>
            <div>
              <span className="gaming-eyebrow">Gaming unterwegs</span>
              <h2>TERRA MOBILE ELITE 5v4</h2>
              <p>
                Das 17,3-Zoll-Notebook für Spieler und Kreative: WQHD-Display mit 165 Hz, Intel Core Ultra 9 275HX,
                GeForce RTX 5070 und 32 GB DDR5 – dazu Windows 11 Pro.
              </p>
              <div className="feature-actions">
                <Link to={`/products/${notebook.handle}`} className="btn btn-gaming" prefetch="intent">
                  Ansehen · {formatPrice(notebook.priceRange.minVariantPrice)}
                </Link>
                <Link to="/collections/notebooks?sub=premium" className="btn btn-outline-light" prefetch="intent">
                  Alle MOBILE ELITE
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container">
          <h2 className="section-title">Worauf es beim Gaming PC ankommt</h2>
          <div className="needs-grid cloud-features server-four">
            <div className="need-card">
              <span className="need-num">01</span>
              <strong>Die Grafikkarte zuerst</strong>
              <p>
                Sie bestimmt die Bildrate am stärksten. 16 GB Grafikspeicher – wie bei RTX 5060 Ti, RX 9060 XT und
                RTX 5070 Ti – geben Reserven für hohe Texturdetails und WQHD.
              </p>
            </div>
            <div className="need-card">
              <span className="need-num">02</span>
              <strong>Passender Prozessor</strong>
              <p>
                Core Ultra 5 und Ryzen 5 sind ausgewogene Gaming-CPUs. Für Streaming, Videoschnitt und sehr hohe
                Bildraten lohnt der Core Ultra 7.
              </p>
            </div>
            <div className="need-card">
              <span className="need-num">03</span>
              <strong>16 oder 32 GB RAM</strong>
              <p>
                16 GB DDR5 reichen für die meisten Spiele. Wer nebenbei streamt oder viele Programme offen hat,
                greift zu 32 GB – alle Modelle lassen sich später aufrüsten.
              </p>
            </div>
            <div className="need-card">
              <span className="need-num">04</span>
              <strong>Kühlung &amp; Lautstärke</strong>
              <p>
                Markenkühler von Noctua, be quiet! oder eine 240-mm-Wasserkühlung halten die Komponenten auch unter
                Last kühl und leise.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="gaming-band">
        <img {...siteImg('/images/gaming/bg5.jpg', '100vw')} alt="" className="gaming-band-bg" loading="lazy" />
        <div className="container gaming-band-inner">
          <h2>Gaming-Hardware von WORTMANN</h2>
          <p>
            Unter der Marke TERRA GAMING bündelt die WORTMANN AG ihre Gaming PCs, Notebooks und Monitore. Bei uns
            bestellen Sie sie direkt – auf Wunsch mit Einrichtung und Datenübernahme vom Systemhaus aus Verl.
          </p>
        </div>
      </section>

      {pcs.length ? (
        <section className="section section-muted">
          <div className="container">
            <div className="section-head">
              <h2>Alle TERRA Gaming PCs</h2>
              <Link to="/collections/desktop-pcs?sub=gamer" className="link-arrow" prefetch="intent">
                Mit Filtern ansehen <Icon name="chevron-right" size={16} />
              </Link>
            </div>
            <div className="products-grid">
              {[...pcs, ...(notebook ? [notebook] : [])].map((p) => (
                <ProductItem key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container">
          <div className="faq">
            <h2 className="section-title">Häufige Fragen zu TERRA Gaming PCs</h2>
            {FAQ.map((f) => (
              <details key={f.q} className="faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <div className="solution-chips landing-related">
            <span>Auch interessant:</span>
            <Link to="/themen/terra-pc" className="sub-chip" prefetch="intent">TERRA PC</Link>
            <Link to="/themen/terra-monitor-27-zoll" className="sub-chip" prefetch="intent">TERRA Monitor 27 Zoll</Link>
            <Link to="/collections/zubehoer?sub=eingabegeraete" className="sub-chip" prefetch="intent">Tastatur &amp; Maus</Link>
            <Link to="/zahlungsarten" className="sub-chip" prefetch="intent">Zahlungsarten</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const GAMING_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query GamingProducts(
    $query: String!
    $first: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(query: $query, first: $first) {
      nodes {
        ...ProductItem
      }
    }
  }
` as const;
