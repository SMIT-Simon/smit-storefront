import {useState} from 'react';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/cloud.jtl-wawi-server';
import {Icon} from '~/components/Icon';
import {CloudInquiry} from '~/components/CloudInquiry';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {usePriceMode} from '~/components/PriceMode';
import {VAT_RATE} from '~/lib/categories';
import {SITE_URL, pageTitle} from '~/lib/seo';
import {siteImg} from '~/lib/site-images';

const SLUG = '/cloud/jtl-wawi-server';
const H1 = 'JTL-Wawi Cloud Server – gehostet im deutschen Rechenzentrum';
const TITLE = 'JTL-Wawi Cloud Server mieten – TERRA CLOUD';
const DESCRIPTION =
  'JTL-Wawi Cloud Server im TERRA CLOUD Rechenzentrum der WORTMANN AG: Windows Server, SQL Server, RDP-Zugang und VPN inklusive. Ab 57,60 € netto im Monat.';

/** Netto-Monatspreise (Shopify-Produkte enthalten den Bruttopreis) */
const PRICE = {start: 57.6, rdp: 10.95, sqlUpgrade: 19.9, sqlUser: 19.95};

type Tariff = {
  id: 'start' | 'advance' | 'pro' | 'enterprise';
  name: string;
  ram: string;
  cores: string;
  disk: string;
  users: string;
  sql: string;
  price: number | null;
  priceNote: string;
  highlight?: boolean;
};

const TARIFFS: Tariff[] = [
  {id: 'start', name: 'Cloud Start', ram: '8 GB RAM', cores: '2 Kerne', disk: '100 GB SSD/NVMe', users: 'für 1–2 Benutzer', sql: 'SQL Server 2022 Express', price: PRICE.start, priceNote: 'pro Monat zzgl. MwSt.'},
  {id: 'advance', name: 'Cloud Advance', ram: '12 GB RAM', cores: '4 Kerne', disk: '200 GB SSD/NVMe', users: 'für bis zu 4 Benutzer', sql: 'SQL Express, optional Standard', price: null, priceNote: 'Preis folgt – jetzt anfragen', highlight: true},
  {id: 'pro', name: 'Cloud Pro', ram: '24 GB RAM', cores: '6 Kerne', disk: '400 GB SSD/NVMe', users: 'für bis zu 10 Benutzer', sql: 'SQL Express, optional Standard', price: null, priceNote: 'Preis folgt – jetzt anfragen'},
  {id: 'enterprise', name: 'Cloud Enterprise', ram: 'RAM nach Bedarf', cores: 'Kerne nach Bedarf', disk: 'Speicher nach Bedarf', users: 'beliebig viele Benutzer', sql: 'SQL Express oder Standard', price: null, priceNote: 'Preis auf Anfrage – frei konfigurierbar'},
];

const INCLUDED = [
  'Windows Server inklusive Lizenz',
  '1 RDP-Benutzer inklusive',
  'JTL-Worker läuft rund um die Uhr in der Cloud',
  'VPN-Zugang auf Wunsch inklusive',
  'Einrichtung durch uns, Bereitstellung in 2–4 Werktagen',
];

const BENEFITS = [
  {title: 'Rechenzentrum der WORTMANN AG', text: 'Ihr Server läuft in der TERRA CLOUD in Hüllhorst (NRW) – zertifiziert nach ISO/IEC 27001, mit redundanter Strom- und Netzanbindung. Ihre Daten bleiben in Deutschland.'},
  {title: 'VPN inklusive', text: 'Auf Wunsch richten wir einen verschlüsselten VPN-Zugang ein – zum Beispiel für Ihre Lager-PCs, Etikettendrucker und Scanner oder als zusätzliche Absicherung des Fernzugriffs. Ohne Aufpreis.'},
  {title: 'JTL-Worker rund um die Uhr', text: 'Der JTL-Worker gleicht Onlineshop, Marktplätze und Versand automatisch ab – auch nachts und am Wochenende, ohne dass im Büro ein PC laufen muss.'},
  {title: 'Persönlich eingerichtet', text: 'Kein anonymes Hosting: Wir installieren SQL Server und JTL-Wawi, übernehmen auf Wunsch Ihre bestehende Datenbank und sind bei Fragen direkt erreichbar – Ihr Systemhaus aus Verl.'},
  {title: 'Von überall arbeiten', text: 'Per Remote Desktop arbeiten Sie im Büro, im Lager oder im Homeoffice mit derselben Wawi – ohne eigene Serverhardware, Wartung und Stromkosten.'},
  {title: 'Wächst mit Ihrem Handel', text: 'Mehr Benutzer, mehr Leistung oder SQL Server Standard: Sie erweitern Ihren Cloud Server, wenn Ihr Geschäft wächst – bis zum individuell ausgelegten Enterprise-Server.'},
];

const FAQ = [
  {q: 'Was ist ein JTL-Wawi Cloud Server?', a: 'Ein eigener virtueller Windows-Server im Rechenzentrum, auf dem JTL-Wawi mit Datenbank (SQL Server) und JTL-Worker läuft. Sie greifen per Remote Desktop darauf zu und brauchen im Büro keinen eigenen Server mehr.'},
  {q: 'Wann brauche ich SQL Server Standard statt Express?', a: 'SQL Server Express ist kostenlos, aber auf 10 GB pro Datenbank begrenzt. Wächst Ihre JTL-Datenbank darüber hinaus – etwa durch viele Artikel, Aufträge und Bilder –, ist SQL Server Standard nötig. Das Upgrade kostet 19,90 € im Monat zzgl. 19,95 € je Benutzer (netto).'},
  {q: 'Wie viele Benutzer sind enthalten?', a: 'In jedem Tarif ist ein RDP-Benutzer enthalten. Jeder weitere Benutzer mit eigenem Remote-Desktop-Zugang kostet 10,95 € im Monat (netto).'},
  {q: 'Wie schnell ist mein Server bereit?', a: 'Wir richten jeden Server persönlich ein. In der Regel ist Ihr JTL-Wawi Cloud Server nach 2 bis 4 Werktagen einsatzbereit – auf Wunsch inklusive Übernahme Ihrer bestehenden Datenbank.'},
  {q: 'Wo stehen die Server?', a: 'In der TERRA CLOUD der WORTMANN AG in Hüllhorst, Nordrhein-Westfalen. Das Rechenzentrum ist nach ISO/IEC 27001 zertifiziert, Ihre Daten verlassen Deutschland nicht.'},
  {q: 'Ist ein VPN möglich?', a: 'Ja, ein VPN-Zugang ist bei uns auf Wunsch inklusive – etwa um Drucker, Scanner und Lagerrechner sicher anzubinden.'},
];

const INQUIRY_OPTIONS = ['Cloud Start', 'Cloud Advance', 'Cloud Pro', 'Cloud Enterprise', 'Umzug bestehende JTL-Wawi', 'Weiß noch nicht'];

export async function loader({context}: Route.LoaderArgs) {
  const res = await context.storefront
    .query(JTL_CLOUD_QUERY, {cache: context.storefront.CacheShort()})
    .catch(() => null);
  const v = (p?: {variants: {nodes: {id: string; availableForSale: boolean}[]}} | null) => {
    const n = p?.variants.nodes[0];
    return n?.availableForSale ? n.id : null;
  };
  return {
    variants: {
      start: v(res?.start),
      rdp: v(res?.rdp),
      sqlUpgrade: v(res?.sqlUpgrade),
      sqlUser: v(res?.sqlUser),
    },
  };
}

export const meta: Route.MetaFunction = () => [
  {title: pageTitle(TITLE)},
  {name: 'description', content: DESCRIPTION},
  {property: 'og:title', content: 'JTL-Wawi Cloud Server aus der TERRA CLOUD'},
  {property: 'og:description', content: DESCRIPTION},
];

const eur = (n: number) => n.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'});

export default function JtlCloudServer() {
  const {variants} = useLoaderData<typeof loader>();
  const {mode} = usePriceMode();
  const {open} = useAside();
  const [extraUsers, setExtraUsers] = useState(0);
  const [sqlStandard, setSqlStandard] = useState(false);
  const [preset, setPreset] = useState<string | undefined>(undefined);

  const show = (net: number) => (mode === 'net' ? net : net * (1 + VAT_RATE));
  const users = 1 + extraUsers;
  const monthlyNet =
    PRICE.start + extraUsers * PRICE.rdp + (sqlStandard ? PRICE.sqlUpgrade + users * PRICE.sqlUser : 0);
  const orderable = Boolean(variants.start && (!extraUsers || variants.rdp) && (!sqlStandard || (variants.sqlUpgrade && variants.sqlUser)));

  const info = [
    {key: 'Tarif', value: 'JTL-Wawi Cloud Server – Cloud Start'},
    {key: 'RDP-Benutzer gesamt', value: String(users)},
    {key: 'Datenbank', value: sqlStandard ? 'SQL Server Standard' : 'SQL Server 2022 Express'},
    {key: 'Abrechnung', value: 'Erster Monat – Folgemonate monatlich'},
  ];
  const lines = [
    ...(variants.start ? [{merchandiseId: variants.start, quantity: 1, attributes: info}] : []),
    ...(extraUsers && variants.rdp ? [{merchandiseId: variants.rdp, quantity: extraUsers}] : []),
    ...(sqlStandard && variants.sqlUpgrade ? [{merchandiseId: variants.sqlUpgrade, quantity: 1}] : []),
    ...(sqlStandard && variants.sqlUser ? [{merchandiseId: variants.sqlUser, quantity: users}] : []),
  ];

  const ask = (name: string) => {
    setPreset(name);
    document.getElementById('anfrage')?.scrollIntoView({behavior: 'smooth'});
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {'@type': 'ListItem', position: 1, name: 'Startseite', item: `${SITE_URL}/`},
          {'@type': 'ListItem', position: 2, name: 'TERRA CLOUD', item: `${SITE_URL}/cloud`},
          {'@type': 'ListItem', position: 3, name: 'JTL-Wawi Cloud Server', item: `${SITE_URL}${SLUG}`},
        ],
      },
      {
        '@type': 'Service',
        name: 'JTL-Wawi Cloud Server',
        provider: {'@type': 'Organization', name: 'SMIT Digital Services'},
        areaServed: 'DE',
        offers: {'@type': 'Offer', price: (PRICE.start * (1 + VAT_RATE)).toFixed(2), priceCurrency: 'EUR'},
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({'@type': 'Question', name: f.q, acceptedAnswer: {'@type': 'Answer', text: f.a}})),
      },
    ],
  };

  return (
    <div className="cloud-page jtl-cloud">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
      <div className="container">
        <nav className="breadcrumb" aria-label="Brotkrümel">
          <Link to="/">Startseite</Link>
          <span aria-hidden>›</span>
          <Link to="/cloud">TERRA CLOUD</Link>
          <span aria-hidden>›</span>
          <span>JTL-Wawi Cloud Server</span>
        </nav>
        <div className="jtl-hero">
          <div>
            <span className="eyebrow">Hosting für JTL-Händler · Made in Germany</span>
            <h1>{H1}</h1>
            <p>
              Ihre <strong>JTL-Wawi</strong> mit Datenbank und JTL-Worker auf einem eigenen Cloud Server im
              Rechenzentrum der <strong>WORTMANN AG</strong> – erreichbar per Remote Desktop aus Büro, Lager und
              Homeoffice. Keine eigene Serverhardware, keine Wartung, persönlich eingerichtet von uns.
            </p>
            <ul className="check-list">
              {INCLUDED.map((x) => (
                <li key={x}>
                  <Icon name="check" size={18} />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <div className="feature-actions">
              <a href="#tarife" className="btn btn-primary">
                Tarife ansehen <Icon name="arrow-right" size={18} />
              </a>
              <a href="#anfrage" className="btn btn-secondary">
                Beratung anfragen
              </a>
            </div>
          </div>
          <figure className="jtl-hero-media">
            <img
              {...siteImg('/images/cloud/rz-server.jpg', '(min-width: 64em) 560px, 100vw')}
              alt="Serverschrank im TERRA CLOUD Rechenzentrum der WORTMANN AG"
              loading="eager"
            />
          </figure>
        </div>
      </div>

      <section className="section section-muted" id="tarife">
        <div className="container">
          <h2 className="section-title">Tarife für Ihren JTL-Wawi Cloud Server</h2>
          <div className="jtl-tariffs">
            {TARIFFS.map((t) => (
              <article key={t.id} className={t.highlight ? 'jtl-tariff highlight' : 'jtl-tariff'}>
                <header>
                  <h3>{t.name}</h3>
                  {t.price !== null ? (
                    <p className="jtl-price">
                      <span>ab</span> <strong>{eur(show(t.price))}</strong>
                      <small>pro Monat {mode === 'net' ? 'zzgl.' : 'inkl.'} MwSt.</small>
                    </p>
                  ) : (
                    <p className="jtl-price jtl-price-open">
                      <strong>{t.id === 'enterprise' ? 'Auf Anfrage' : 'Preis folgt'}</strong>
                      <small>{t.priceNote}</small>
                    </p>
                  )}
                </header>
                <ul>
                  <li>{t.ram}</li>
                  <li>{t.cores}</li>
                  <li>{t.disk}</li>
                  <li>{t.sql}</li>
                  <li>1 RDP-Benutzer inkl., weitere {eur(show(PRICE.rdp))}/Monat</li>
                  <li>Windows Server inkl. Lizenz</li>
                  <li>VPN auf Wunsch inklusive</li>
                  <li className="jtl-users">Empfohlen {t.users}</li>
                </ul>
                {t.id === 'start' ? (
                  <a href="#bestellen" className="btn btn-primary btn-block">
                    Jetzt bestellen
                  </a>
                ) : (
                  <button type="button" className="btn btn-secondary btn-block" onClick={() => ask(t.name)}>
                    {t.id === 'enterprise' ? 'Individuell anfragen' : 'Jetzt anfragen'}
                  </button>
                )}
              </article>
            ))}
          </div>
          <p className="jtl-note">
            Alle Preise pro Monat. SQL Server Standard (ab ca. 10 GB Datenbankgröße nötig): {eur(show(PRICE.sqlUpgrade))}{' '}
            pro Monat zzgl. {eur(show(PRICE.sqlUser))} je Benutzer. Bereitstellung in 2–4 Werktagen.
          </p>
        </div>
      </section>

      <section className="section" id="bestellen">
        <div className="container jtl-order">
          <div>
            <span className="eyebrow">Direkt bestellen</span>
            <h2>Cloud Start zusammenstellen</h2>
            <p>
              8 GB RAM, 2 Kerne, 100 GB SSD/NVMe, Windows Server und SQL Server 2022 Express – mit einem
              RDP-Benutzer inklusive. Ergänzen Sie weitere Benutzer und bei Bedarf SQL Server Standard.
            </p>
            <div className="jtl-order-row">
              <span>
                <strong>Weitere RDP-Benutzer</strong>
                <small>je {eur(show(PRICE.rdp))} pro Monat</small>
              </span>
              <div className="qty" aria-label="Weitere Benutzer">
                <button type="button" onClick={() => setExtraUsers((n) => Math.max(0, n - 1))} aria-label="Weniger Benutzer">
                  −
                </button>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={extraUsers}
                  onChange={(e) => setExtraUsers(Math.min(30, Math.max(0, parseInt(e.target.value || '0', 10))))}
                  aria-label="Weitere Benutzer"
                />
                <button type="button" onClick={() => setExtraUsers((n) => Math.min(30, n + 1))} aria-label="Mehr Benutzer">
                  +
                </button>
              </div>
            </div>
            <label className={sqlStandard ? 'addon checked' : 'addon'} aria-label="Upgrade auf SQL Server Standard">
              <input type="checkbox" checked={sqlStandard} onChange={() => setSqlStandard(!sqlStandard)} />
              <span className="addon-text">
                <strong>Upgrade auf SQL Server Standard</strong>
                <small>
                  Nötig ab ca. 10 GB Datenbankgröße – {eur(show(PRICE.sqlUpgrade))}/Monat zzgl.{' '}
                  {eur(show(PRICE.sqlUser))} je Benutzer
                </small>
              </span>
            </label>
          </div>
          <aside className="jtl-summary">
            <h3>Ihre Auswahl</h3>
            <dl>
              <div>
                <dt>Cloud Start</dt>
                <dd>{eur(show(PRICE.start))}</dd>
              </div>
              {extraUsers ? (
                <div>
                  <dt>{extraUsers} weitere RDP-Benutzer</dt>
                  <dd>{eur(show(extraUsers * PRICE.rdp))}</dd>
                </div>
              ) : null}
              {sqlStandard ? (
                <>
                  <div>
                    <dt>SQL Server Standard</dt>
                    <dd>{eur(show(PRICE.sqlUpgrade))}</dd>
                  </div>
                  <div>
                    <dt>{users} SQL-Benutzerlizenz{users > 1 ? 'en' : ''}</dt>
                    <dd>{eur(show(users * PRICE.sqlUser))}</dd>
                  </div>
                </>
              ) : null}
            </dl>
            <p className="jtl-total">
              <span>Pro Monat</span>
              <strong>{eur(show(monthlyNet))}</strong>
              <small>{mode === 'net' ? 'zzgl. MwSt.' : 'inkl. MwSt.'}</small>
            </p>
            {orderable ? (
              <AddToCartButton lines={lines} onClick={() => open('cart')}>
                In den Warenkorb
              </AddToCartButton>
            ) : (
              <a href="#anfrage" className="btn btn-primary btn-block">
                Jetzt anfragen
              </a>
            )}
            <p className="jtl-summary-note">
              Mit der Bestellung zahlen Sie den ersten Monat. Die Folgemonate rechnen wir monatlich ab.
              Bereitstellung in 2–4 Werktagen – wir melden uns nach der Bestellung zur Einrichtung.
            </p>
          </aside>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <h2 className="section-title">Warum Ihr JTL-Server bei uns besser aufgehoben ist</h2>
          <div className="needs-grid cloud-features">
            {BENEFITS.map((b, i) => (
              <div key={b.title} className="need-card">
                <span className="need-num">{String(i + 1).padStart(2, '0')}</span>
                <strong>{b.title}</strong>
                <p>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="anfrage">
        <div className="container cloud-inquiry-wrap">
          <div>
            <span className="eyebrow">Unverbindlich</span>
            <h2>JTL-Wawi Cloud Server anfragen</h2>
            <p>
              Sagen Sie uns kurz, wie viele Benutzer mit der Wawi arbeiten und wie groß Ihre Datenbank ist. Wir
              empfehlen den passenden Tarif und melden uns innerhalb eines Werktags – auch für den Umzug Ihrer
              bestehenden JTL-Wawi.
            </p>
          </div>
          <CloudInquiry key={preset ?? 'none'} preset={preset} options={INQUIRY_OPTIONS} topic="Cloud-Anfrage JTL-Wawi" />
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="faq">
            <h2 className="section-title">Häufige Fragen zum JTL-Wawi Cloud Server</h2>
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
            <Link to="/cloud/backup" className="sub-chip" prefetch="intent">TERRA CLOUD Backup</Link>
            <Link to="/ratgeber/hyper-v-virtualisierung" className="sub-chip" prefetch="intent">Hyper-V Virtualisierung</Link>
            <Link to="/loesungen/lager-logistik" className="sub-chip" prefetch="intent">IT für Lager &amp; Logistik</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const JTL_CLOUD_QUERY = `#graphql
  query JtlCloudProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    start: product(handle: "jtl-cloud-start") { ...JtlCloudVariant }
    rdp: product(handle: "jtl-cloud-rdp-benutzer") { ...JtlCloudVariant }
    sqlUpgrade: product(handle: "jtl-cloud-sql-standard") { ...JtlCloudVariant }
    sqlUser: product(handle: "jtl-cloud-sql-benutzer") { ...JtlCloudVariant }
  }
  fragment JtlCloudVariant on Product {
    variants(first: 1) { nodes { id availableForSale } }
  }
` as const;
