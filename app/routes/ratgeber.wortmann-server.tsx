import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/ratgeber.wortmann-server';
import {formatPrice} from '~/components/Price';
import {ProductItem} from '~/components/ProductItem';
import {Icon} from '~/components/Icon';
import {CloudInquiry} from '~/components/CloudInquiry';
import {PRODUCT_ITEM_FRAGMENT} from '~/lib/product-item-fragment';
import {isListable} from '~/lib/addons';
import {SITE_URL, pageTitle} from '~/lib/seo';
import {siteImg} from '~/lib/site-images';

const SLUG = '/ratgeber/wortmann-server';
/** Großes Bild oben: Rack-Server statt Tower */
const HERO_HANDLE = 'terra-server-3230-g6-xeon-6369p-64-gb-3840-gb-ohne-betriebssystem-1100419';
const H1 = 'Wortmann Server: TERRA SERVER made in Germany';
const TITLE = 'Wortmann Server & TERRA Server – Ratgeber';
const DESCRIPTION =
  'Wortmann Server bzw. TERRA Server aus Hüllhorst: individuell konfiguriert, Vor-Ort-Service bis 10 Jahre und kostenloser Notfallservice. Server im Haus oder TERRA CLOUD? Beratung gemeinsam mit WORTMANN.';

const FACTS = [
  {value: 'Made in Germany', label: 'Fertigung in Hüllhorst (ISO 9001)'},
  {value: 'bis 10 Jahre', label: 'Vor-Ort-Service für Server'},
  {value: '48 h', label: 'Wunschserver in dringenden Fällen'},
  {value: '99,95 %', label: 'VM-Verfügbarkeit in der TERRA CLOUD'},
];

const SERIES = [
  {
    name: 'TERRA MINISERVER',
    text: 'Der meistverkaufte TERRA Server für kleine und mittlere Anforderungen. Ein eigens entwickeltes Gehäuse kühlt effektiv und trotzdem leise – geeignet für den Betrieb direkt im Büro, in Praxis oder Kanzlei.',
  },
  {
    name: 'TERRA SERVER 3000 bis 7000',
    text: 'Tower- und 19"-Rack-Server in allen Leistungsklassen mit Intel Xeon oder AMD EPYC, Hot-Swap-Laufwerken und redundanten Netzteilen. Gut zu wissen: Mehr Leistung braucht mehr Kühlung und wird lauter – starke Modelle gehören in einen eigenen Raum oder Serverschrank.',
  },
  {
    name: 'Hochverfügbarkeit',
    text: 'Zwei Server im Cluster mit einem zentralen Speicher: Fällt ein Bauteil aus, übernimmt die intakte Hardware. Sinnvoll, wenn jede Stunde Stillstand teuer wird – und heute auch für den Mittelstand bezahlbar.',
  },
  {
    name: 'Server im Rechenzentrum',
    text: 'Ihr eigener TERRA Server kann auch im TERRA CLOUD Rechenzentrum in Hüllhorst laufen (Housing) – sicher, klimatisiert, redundant angebunden. Oft der Zwischenschritt zum Umstieg in die Cloud.',
  },
  {
    name: 'TERRA STORAGE',
    text: 'Speichererweiterungen (DAS) und SAN-Systeme, wenn Daten und Backups wachsen oder mehrere Server auf einen gemeinsamen Speicher zugreifen.',
  },
  {
    name: 'TERRA Xaler (hyperkonvergent)',
    text: 'Für besondere Anforderungen und maximale Performance: hyperkonvergente Systeme, die WORTMANN-Experten gemeinsam mit uns individuell auslegen und in Betrieb nehmen.',
  },
];

const COMPARE: [string, string, string][] = [
  ['Anschaffung', 'Einmalige Investition – Kauf oder Leasing', 'Keine Investition, fester Monatspreis'],
  ['Strom & Kühlung', 'Laufende Kosten im eigenen Haus, Serverraum nötig', 'Im Preis enthalten – Rechenzentrum mit rund 90 % Ökostrom'],
  ['Wartung der Hardware', 'Über Vor-Ort-Service bis 10 Jahre abgesichert', 'Erledigt das Rechenzentrum – kein Hardware-Tausch bei Ihnen'],
  ['Verfügbarkeit', 'Abhängig von Raum, USV und redundanten Komponenten', '99,95 % VM-Verfügbarkeit (IaaS), Netzwerk 99,98 %'],
  ['Mehr Leistung', 'Aufrüsten = neue Hardware zum aktuellen Speicherpreis', 'CPU, RAM und Speicher monatlich anpassen'],
  ['Standort der Daten', 'Im eigenen Haus', 'Rechenzentrum in Deutschland, ISO/IEC 27001'],
  ['Passt besonders, wenn …', 'Anwendungen lokal laufen müssen, große Datenmengen vor Ort liegen oder die Internetleitung schwach ist', 'mehrere Standorte, Homeoffice oder kein eigener Serverraum vorhanden sind'],
];

const EMERGENCY = [
  'Kreditlimit innerhalb von 24 Stunden',
  'Ersatz-Server in 24 Stunden gefertigt – ohne Express-Zuschlag',
  'Kostenlose Express-Lieferung',
  'Restlaufzeit des Service wird auf das neue Gerät übertragen',
  'Rechnungsstellung bis zu 6 Monate aufgeschoben – Zeit für die Versicherung',
  'Mit TERRA CLOUD Backup: sofort eine IaaS-Umgebung für die Wiederherstellung',
  'Bei Leasing: Vertragsverlängerung zur gleichen Rate',
];

const SERVER_INTEREST_OPTIONS = [
  'Server im Haus (TERRA SERVER)',
  'Server in der TERRA CLOUD',
  'Kombination: Server + Cloud-Backup',
  'Vor-Ort- / Notfallservice',
  'Beratung mit WORTMANN',
  'Weiß noch nicht',
];

const FAQ = [
  {
    q: 'Was ist der Unterschied zwischen Wortmann Server und TERRA Server?',
    a: 'Keiner – es ist dasselbe Produkt. WORTMANN ist der Hersteller aus Hüllhorst, TERRA die Marke. Wer nach „Wortmann Server“ oder „TERRA Server“ sucht, findet hier also dieselben Systeme.',
  },
  {
    q: 'Was sind Wortmann Server?',
    a: 'Wortmann Server sind die Server der WORTMANN AG aus Hüllhorst, die unter der Marke TERRA SERVER verkauft werden – vom leisen MINISERVER bis zum Rack-Server für Virtualisierung. Gefertigt werden sie in Deutschland nach ISO 9001:2015.',
  },
  {
    q: 'Kann ich einen TERRA SERVER individuell konfigurieren lassen?',
    a: 'Ja. Prozessor, Arbeitsspeicher, Laufwerke, RAID-Controller, Netzteile und Service-Laufzeit werden passend zu Ihren Anwendungen zusammengestellt. Gemeinsam mit den Server-Spezialisten von WORTMANN erstellen wir ein Angebot. Die meisten TERRA Server werden nach Kundenwunsch gefertigt, einige Standardmodelle sind ab Lager lieferbar – in dringenden Fällen ist Ihr Wunschserver binnen 48 Stunden gebaut.',
  },
  {
    q: 'Was kostet ein Wortmann Server?',
    a: 'Fertig konfigurierte TERRA Server gibt es in unserem Shop ab rund 6.000 € brutto. Der Endpreis hängt stark von Arbeitsspeicher und Laufwerken ab, deren Preise derzeit schwanken – deshalb lohnt eine Beratung vor dem Kauf.',
  },
  {
    q: 'Server im Haus oder TERRA CLOUD – was ist besser?',
    a: 'Das hängt von Ihren Anwendungen, der Internetanbindung und den Standorten ab. Die TERRA CLOUD spart Strom, Wartung und Investition und bietet 99,95 % Verfügbarkeit. Ein eigener Server ist sinnvoll, wenn Software lokal laufen muss oder große Datenmengen vor Ort verarbeitet werden. Oft ist die Kombination ideal: Server im Haus, Backup in der TERRA CLOUD.',
  },
  {
    q: 'Was ist der TERRA Notfallservice?',
    a: 'Bei TERRA Servern mit Vor-Ort-Service ist der Notfallservice kostenlos enthalten. Nach Brand, Wasser, Sturm, Ransomware, Sabotage oder Diebstahl fertigt WORTMANN innerhalb von 24 Stunden einen Ersatz-Server ohne Express-Aufpreis, liefert kostenlos und schiebt die Rechnung bis zu 6 Monate auf.',
  },
  {
    q: 'Wie lange gibt es Service für TERRA Server?',
    a: 'TERRA Server werden mit 36 Monaten Bring-In-Service ausgeliefert. Vor-Ort-Service ist für bis zu 10 Jahre zubuchbar, auch mit 4-Stunden-Reaktionszeit, Premium-Support rund um die Uhr und Einbehalt defekter Datenträger.',
  },
];

export async function loader({context}: Route.LoaderArgs) {
  const res = await context.storefront
    .query(SERVER_PRODUCTS_QUERY, {
      variables: {query: 'product_type:Server', first: 30},
      cache: context.storefront.CacheShort(),
    })
    .catch(() => null);
  const products = (res?.products.nodes ?? [])
    .filter(isListable)
    .sort(
      (a, b) =>
        Number(a.priceRange.minVariantPrice.amount) -
        Number(b.priceRange.minVariantPrice.amount),
    );
  const hero =
    products.find((p) => p.handle === HERO_HANDLE && p.featuredImage) ??
    products.find((p) => /3230-g6/.test(p.handle) && p.featuredImage) ??
    products.find((p) => p.featuredImage) ??
    null;
  return {products, hero};
}

export const meta: Route.MetaFunction = ({data}) => [
  {title: pageTitle(TITLE)},
  {name: 'description', content: DESCRIPTION},
  {property: 'og:title', content: H1},
  {property: 'og:description', content: DESCRIPTION},
  {
    property: 'og:image',
    content: 'https://cdn.shopify.com/s/files/1/1089/3439/8286/files/site-server-rack.png?width=1200',
  },
];

const imgUrl = (url: string, w: number) => `${url}${url.includes('?') ? '&' : '?'}width=${w}`;

export default function WortmannServer() {
  const {products, hero} = useLoaderData<typeof loader>();
  const url = `${SITE_URL}${SLUG}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {'@type': 'ListItem', position: 1, name: 'Startseite', item: `${SITE_URL}/`},
          {'@type': 'ListItem', position: 2, name: 'Wortmann Server', item: url},
        ],
      },
      {
        '@type': 'ItemList',
        name: 'TERRA SERVER von WORTMANN',
        itemListElement: products.map((p, i) => ({
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

  return (
    <div className="landing-page server-guide">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
      <div className="container">
        <nav className="breadcrumb" aria-label="Brotkrümel">
          <Link to="/">Startseite</Link>
          <span aria-hidden>›</span>
          <span>Wortmann Server</span>
        </nav>
        <div className="landing-top">
          <header className="landing-head">
            <span className="eyebrow">Ratgeber · IT made in Germany</span>
            <h1>{H1}</h1>
            <p>
              Hinter dem Suchbegriff <strong>„Wortmann Server“</strong> stehen die <strong>TERRA SERVER</strong> der
              WORTMANN AG aus Hüllhorst in Ostwestfalen – entwickelt, gefertigt und betreut in Deutschland. Vom
              leisen Miniserver fürs Büro über 19-Zoll-Rack-Server bis zur Hochverfügbarkeitslösung.
            </p>
            <p>
              Kein Server gleicht dem anderen. Deshalb beraten wir als Systemhaus aus Verl – auf Wunsch{' '}
              <strong>gemeinsam mit den Server-Spezialisten von WORTMANN</strong> – und klären auch, ob ein eigener
              Server oder die <Link to="/cloud">TERRA CLOUD</Link> für Sie die bessere Wahl ist.
            </p>
            <div className="feature-actions">
              <a href="#anfrage" className="btn btn-primary">
                Server-Beratung anfragen <Icon name="arrow-right" size={18} />
              </a>
              <a href="#modelle" className="btn btn-secondary">
                {products.length ? `${products.length} Server ansehen` : 'Server ansehen'}
              </a>
            </div>
          </header>
          <figure className="landing-hero server-guide-hero">
            <img
              {...siteImg('/images/server/rack.png', '(min-width: 64em) 560px, 92vw')}
              alt="TERRA SERVER Rack-Server der WORTMANN AG, gefertigt in Deutschland"
              loading="eager"
              fetchPriority="high"
            />
            {hero ? (
              <figcaption>
                <Link to={`/products/${hero.handle}`} prefetch="intent">
                  z. B. {hero.title.replace(/\s*-\s*\d{7}$/, '').slice(0, 70)}
                </Link>
                <span className="landing-hero-price">{formatPrice(hero.priceRange.minVariantPrice)}</span>
              </figcaption>
            ) : null}
          </figure>
        </div>
      </div>

      <section className="cloud-usps">
        <div className="container cloud-usps-inner">
          {FACTS.map((u) => (
            <div key={u.label}>
              <strong>{u.value}</strong>
              <span>{u.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Das Portfolio</span>
              <h2>Welcher TERRA SERVER passt zu Ihnen?</h2>
            </div>
          </div>
          <div className="needs-grid cloud-features">
            {SERIES.map((s, i) => (
              <div key={s.name} className="need-card">
                <span className="need-num">{String(i + 1).padStart(2, '0')}</span>
                <strong>{s.name}</strong>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container server-guide-split">
          <div>
            <span className="eyebrow">Gut abwägen</span>
            <h2>Jeder Server ist individuell – und Speicher ist teuer geworden</h2>
            <p>
              Welche Anwendungen laufen darauf, wie viele Benutzer greifen zu, wie schnell wachsen die Daten, wie
              lange darf ein Ausfall dauern? Erst aus diesen Antworten ergibt sich die richtige Konfiguration.
            </p>
            <p>
              Gerade <strong>Arbeitsspeicher und SSDs</strong> sind zuletzt deutlich teurer geworden und machen
              einen großen Teil des Serverpreises aus. Zu knapp geplant heißt teures Nachrüsten, zu großzügig
              bindet unnötig Kapital. Wir rechnen deshalb gemeinsam durch:
            </p>
            <ul className="check-list">
              <li>
                <Icon name="check" size={18} />
                <span>Wie viel RAM und Speicher brauchen Sie heute – und in drei bis fünf Jahren?</span>
              </li>
              <li>
                <Icon name="check" size={18} />
                <span>Lohnt Kauf oder Leasing (mit automatisch verlängertem Service)?</span>
              </li>
              <li>
                <Icon name="check" size={18} />
                <span>Welche Teile laufen besser in der TERRA CLOUD, wo Ressourcen monatlich anpassbar sind?</span>
              </li>
            </ul>
          </div>
          <div className="server-guide-box">
            <Icon name="shield" size={28} />
            <strong>Beratung gemeinsam mit WORTMANN</strong>
            <p>
              Mehr als 100 Spezialisten der WORTMANN AG unterstützen Fachhändler bei Konzeption, Ausschreibungen
              und Projekten. Wir holen sie bei Bedarf mit an den Tisch – Sie haben trotzdem einen festen
              Ansprechpartner bei uns in Verl.
            </p>
            <a href="#anfrage" className="link-arrow">
              Beratungstermin anfragen <Icon name="chevron-right" size={16} />
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Im Haus oder in der Cloud?</span>
              <h2>Eigener Server oder TERRA CLOUD im Vergleich</h2>
            </div>
            <Link to="/cloud/virtuelle-server" className="link-arrow" prefetch="intent">
              Virtuelle Server ansehen <Icon name="chevron-right" size={16} />
            </Link>
          </div>
          <div className="cloud-table-wrap">
            <table className="cloud-table server-compare">
              <thead>
                <tr>
                  <th aria-label="Kriterium" />
                  <th>Server im Haus (TERRA SERVER)</th>
                  <th>TERRA CLOUD (virtueller Server)</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r) => (
                  <tr key={r[0]}>
                    <th>{r[0]}</th>
                    <td>{r[1]}</td>
                    <td>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="solution-notice">
            <Icon name="server" size={20} />
            <span>
              <strong>Oft die beste Lösung: beides.</strong> Der Server läuft bei Ihnen,{' '}
              <Link to="/cloud/backup">TERRA CLOUD Backup</Link> sichert die Daten verschlüsselt ins deutsche
              Rechenzentrum. Fällt der Server aus, kann er dort sofort als virtuelle Maschine weiterlaufen.
            </span>
          </p>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container cloud-split">
          <div className="cloud-split-media">
            <img
              {...siteImg('/images/cloud/rz-server.jpg', '(min-width: 64em) 600px, 100vw')}
              alt="Serverschrank im TERRA CLOUD Rechenzentrum der WORTMANN AG"
              loading="lazy"
            />
          </div>
          <div>
            <span className="eyebrow">Server im eigenen Haus</span>
            <h2>Der TERRA Notfallservice – kostenlos inklusive</h2>
            <p>
              Brand, Wasserschaden, Sturm, Ransomware, Sabotage oder Diebstahl: Für TERRA Server mit
              Vor-Ort-Service ist der Notfallservice ohne Aufpreis enthalten. WORTMANN hilft dann schnell und
              unbürokratisch:
            </p>
            <ul className="check-list">
              {EMERGENCY.map((e) => (
                <li key={e}>
                  <Icon name="check" size={18} />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Service für TERRA Server</h2>
          <div className="needs-grid cloud-features server-four">
            <div className="need-card">
              <span className="need-num">01</span>
              <strong>36 Monate inklusive</strong>
              <p>Jeder TERRA Server kommt mit 36 Monaten Bring-In-Service der WORTMANN AG.</p>
            </div>
            <div className="need-card">
              <span className="need-num">02</span>
              <strong>Vor-Ort bis 10 Jahre</strong>
              <p>Vor-Ort-Service innerhalb von 24 oder 4 Stunden, auf Wunsch Premium-Support rund um die Uhr.</p>
            </div>
            <div className="need-card">
              <span className="need-num">03</span>
              <strong>Daten bleiben bei Ihnen</strong>
              <p>Defekte Festplatten und SSDs werden auf Wunsch einbehalten – wichtig für Datenschutz und DSGVO.</p>
            </div>
            <div className="need-card">
              <span className="need-num">04</span>
              <strong>Service aus Deutschland</strong>
              <p>Servicecenter in Hüllhorst und über 1.000 Servicepartner bundesweit, dazu unser Team in Verl.</p>
            </div>
          </div>
        </div>
      </section>

      {products.length ? (
        <section className="section section-muted" id="modelle">
          <div className="container">
            <div className="section-head">
              <h2>TERRA SERVER – direkt bestellen</h2>
              <Link to="/collections/server-netzwerk" className="link-arrow" prefetch="intent">
                Alle Server &amp; Netzwerk <Icon name="chevron-right" size={16} />
              </Link>
            </div>
            <p className="server-guide-hint">
              Vorkonfigurierte Standardmodelle mit Preis. Die meisten TERRA Server werden aber individuell nach Ihren
              Wünschen gefertigt – einfach unten anfragen.
            </p>
            <div className="products-grid">
              {products.map((p) => (
                <ProductItem key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section" id="anfrage">
        <div className="container cloud-inquiry-wrap">
          <div>
            <span className="eyebrow">Unverbindlich</span>
            <h2>Server-Beratung anfragen</h2>
            <p>
              Beschreiben Sie kurz Ihr Vorhaben – Anwendungen, Benutzer, Datenmenge. Wir melden uns innerhalb
              eines Werktags, auf Wunsch gemeinsam mit WORTMANN, und vergleichen eigenen Server und TERRA CLOUD
              für Sie.
            </p>
          </div>
          <CloudInquiry options={SERVER_INTEREST_OPTIONS} topic="Server-Anfrage" />
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="faq">
            <h2 className="section-title">Häufige Fragen zu Wortmann Servern</h2>
            {FAQ.map((f) => (
              <details key={f.q} className="faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <div className="solution-chips landing-related">
            <span>Auch interessant:</span>
            <Link to="/cloud" className="sub-chip" prefetch="intent">TERRA CLOUD</Link>
            <Link to="/cloud/hosting-housing" className="sub-chip" prefetch="intent">Eigenen Server im Rechenzentrum (Housing)</Link>
            <Link to="/cloud/rechenzentrum" className="sub-chip" prefetch="intent">Rechenzentrum</Link>
            <Link to="/collections/server-netzwerk?sub=tower-server" className="sub-chip" prefetch="intent">Tower-Server</Link>
            <Link to="/ratgeber/laptop-aus-deutschland" className="sub-chip" prefetch="intent">Laptop aus Deutschland</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const SERVER_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query ServerGuideProducts(
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
