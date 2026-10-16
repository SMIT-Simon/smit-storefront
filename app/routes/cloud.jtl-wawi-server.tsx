import {useState} from 'react';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/cloud.jtl-wawi-server';
import {Icon} from '~/components/Icon';
import {CloudInquiry} from '~/components/CloudInquiry';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {SITE_URL, pageTitle} from '~/lib/seo';
import {siteImg} from '~/lib/site-images';

const SLUG = '/cloud/jtl-wawi-server';
const H1 = 'JTL-Wawi Cloud Server mit fest zugewiesenen Ressourcen';
const TITLE = 'JTL-Wawi Cloud Server mieten – TERRA CLOUD';
const DESCRIPTION =
  'JTL-Wawi Cloud Server für Geschäftskunden: dedizierte Ressourcen im TERRA CLOUD Rechenzentrum, Windows Server, SQL Server, RDP und VPN inklusive – ab 57,60 € netto/Monat.';

/**
 * Angebot nur für Geschäftskunden → auf dieser Seite nur Nettopreise.
 * Die Shopify-Produkte enthalten den Bruttopreis (netto × 1,19).
 */
const PRICE = {start: 57.6, advance: 119, pro: 199, enterprise: 249, rdp: 10.95, sqlUpgrade: 19.9, sqlUser: 19.95};

type TariffId = 'start' | 'advance' | 'pro' | 'enterprise';
type Tariff = {
  id: TariffId;
  name: string;
  specs: string[];
  users: string;
  price: number;
  from?: boolean;
  highlight?: boolean;
};

const STANDARD_STORAGE = 'Standard Plus Storage (NVMe, bis 30.000 IOPS)';

const TARIFFS: Tariff[] = [
  {id: 'start', name: 'Cloud Start', specs: ['8 GB RAM', '2 Kerne', '100 GB SSD/NVMe', STANDARD_STORAGE, 'SQL Server 2022 Express'], users: 'für 1–2 Benutzer', price: PRICE.start},
  {id: 'advance', name: 'Cloud Advance', specs: ['12 GB RAM', '4 Kerne', '200 GB SSD/NVMe', STANDARD_STORAGE, 'SQL Express, optional Standard'], users: 'für bis zu 4 Benutzer', price: PRICE.advance, highlight: true},
  {id: 'pro', name: 'Cloud Pro', specs: ['24 GB RAM', '6 Kerne', '400 GB SSD/NVMe', STANDARD_STORAGE, 'SQL Express, optional Standard'], users: 'für bis zu 10 Benutzer', price: PRICE.pro},
  {id: 'enterprise', name: 'Cloud Enterprise', specs: ['bis 256 GB RAM', 'bis 16 Kerne oder Enterprise-CPU mit 3,6 GHz', 'Speicher nahezu unbegrenzt, mehrere Laufwerke', 'Performance Storage (bis 65.000 IOPS)', 'SQL Express oder Standard'], users: 'beliebig viele Benutzer', price: PRICE.enterprise, from: true},
];

const ORDERABLE: Exclude<TariffId, 'enterprise'>[] = ['start', 'advance', 'pro'];

const INCLUDED = [
  'Fest zugewiesene Ressourcen – CPU, RAM und Speicher werden nicht geteilt',
  'Windows Server inklusive Lizenz',
  'Administrator-Zugang per RDP inklusive',
  'JTL-Worker läuft rund um die Uhr in der Cloud',
  'VPN-Zugang auf Wunsch inklusive',
  'Backup der SQL-Datenbank inklusive',
  'Volle Administratorrechte auf Ihrem Server',
  'Persönlich eingerichtet, bereit in 2–4 Werktagen',
];

/** Vergleich Cloud Server ↔ eigener Server im Büro */
const COMPARE: [string, string, string][] = [
  ['Anschaffung', 'Keine Investition – fester Monatspreis', 'Server, Lizenzen und USV einmalig kaufen'],
  ['Wartung & Hardware', 'Übernimmt das Rechenzentrum', 'Ihre Aufgabe – inklusive Austausch defekter Teile'],
  ['Strom, Kühlung, Lärm', 'Im Preis enthalten', 'Laufende Kosten im eigenen Büro'],
  ['Zugriff', 'Von überall per Remote Desktop, auf Wunsch per VPN', 'Im Büronetz, für unterwegs extra einzurichten'],
  ['Mehr Leistung', 'Tarif wechseln oder Enterprise individuell erweitern', 'Neue Hardware kaufen'],
  ['JTL-Worker', 'Läuft rund um die Uhr', 'Nur, solange der Rechner im Büro läuft'],
];

const BENEFITS = [
  {title: 'Dedizierte Ressourcen', text: 'Prozessorkerne, Arbeitsspeicher und Speicher sind Ihrem Server fest zugewiesen und werden nicht mit anderen Kunden geteilt. Ihre Wawi bleibt auch dann schnell, wenn auf anderen Systemen viel los ist.'},
  {title: 'Rechenzentrum der WORTMANN AG', text: 'Ihr Server läuft in der TERRA CLOUD in Hüllhorst (NRW) – zertifiziert nach ISO/IEC 27001, mit redundanter Strom- und Netzanbindung. Ihre Daten bleiben in Deutschland.'},
  {title: 'VPN inklusive', text: 'Auf Wunsch richten wir einen verschlüsselten VPN-Zugang ein – zum Beispiel für Lager-PCs, Etikettendrucker und Scanner oder als zusätzliche Absicherung des Fernzugriffs. Ohne Aufpreis.'},
  {title: 'JTL-Worker rund um die Uhr', text: 'Der JTL-Worker gleicht Onlineshop, Marktplätze und Versand automatisch ab – auch nachts und am Wochenende, ohne dass im Büro ein PC laufen muss.'},
  {title: 'Persönlich eingerichtet', text: 'Kein anonymes Hosting: Wir installieren SQL Server und JTL-Wawi, übernehmen auf Wunsch Ihre bestehende Datenbank und sind bei Fragen direkt erreichbar – Ihr Systemhaus aus Verl.'},
  {title: 'Datenbank gesichert', text: 'Die SQL-Datenbank Ihrer JTL-Wawi wird regelmäßig gesichert – das ist im Preis enthalten. Eine Komplettsicherung des gesamten Servers bieten wir auf Anfrage zusätzlich an.'},
  {title: 'Wächst mit Ihrem Handel', text: 'Mehr Benutzer, mehr Leistung oder SQL Server Standard: Sie wechseln in den nächsten Tarif, wenn Ihr Geschäft wächst – bis zum individuell ausgelegten Enterprise-Server.'},
];

const ENTERPRISE_OPTIONS = [
  'Arbeitsspeicher bis 256 GB',
  'Standard-CPU mit 2,9 GHz und bis zu 16 Kernen – oder Enterprise-CPU mit 3,6 GHz und bis zu 12 Kernen für maximale Einzelkern-Leistung',
  'SSD/NVMe-Speicher praktisch ohne Obergrenze',
  'Mehrere Laufwerke, z. B. getrennt für System, Datenbank und Bilder',
  'Performance Storage statt Standard Plus: bis zu 65.000 IOPS und 500 MB/s statt 30.000 IOPS und 250 MB/s',
  'SQL Server Standard, beliebig viele RDP-Benutzer, VPN-Anbindung mehrerer Standorte',
];

const FAQ = [
  {q: 'Was ist ein JTL-Wawi Cloud Server?', a: 'Ein eigener virtueller Windows-Server im Rechenzentrum, auf dem JTL-Wawi mit Datenbank (SQL Server) und JTL-Worker läuft. Sie greifen per Remote Desktop darauf zu und brauchen im Büro keinen eigenen Server mehr.'},
  {q: 'Teilt sich mein Server Ressourcen mit anderen?', a: 'Nein. Prozessorkerne, Arbeitsspeicher und Speicherplatz sind Ihrem Server fest zugewiesen. Die gebuchte Leistung steht Ihnen jederzeit vollständig zur Verfügung.'},
  {q: 'Wann brauche ich SQL Server Standard statt Express?', a: 'SQL Server Express ist kostenlos, aber auf 10 GB pro Datenbank begrenzt. Wächst Ihre JTL-Datenbank darüber hinaus – etwa durch viele Artikel, Aufträge und Bilder –, ist SQL Server Standard nötig: 19,90 € im Monat zzgl. 19,95 € je Benutzer (netto).'},
  {q: 'Wie viele Benutzer sind enthalten?', a: 'In jedem Tarif ist ein Administrator-Zugang per Remote Desktop enthalten – für Einrichtung, Updates und Wartung. Für die tägliche Arbeit in der Wawi buchen Sie RDP-Benutzer dazu: 10,95 € je Benutzer und Monat (netto).'},
  {q: 'Wie schnell ist mein Server bereit?', a: 'Wir richten jeden Server persönlich ein. In der Regel ist Ihr JTL-Wawi Cloud Server nach 2 bis 4 Werktagen einsatzbereit – auf Wunsch inklusive Übernahme Ihrer bestehenden Datenbank.'},
  {q: 'Was wird gesichert?', a: 'Im Preis enthalten ist die Sicherung Ihrer SQL-Datenbank, also aller Daten Ihrer JTL-Wawi. Eine Sicherung des kompletten Servers inklusive System und Dateien bieten wir auf Anfrage zusätzlich an.'},
  {q: 'Habe ich Administratorrechte?', a: 'Ja. Sie erhalten volle Administratorrechte auf Ihrem Server und können zusätzliche Programme wie Druckertreiber, Versandsoftware oder Tools installieren. Auf Wunsch übernehmen wir die Betreuung.'},
  {q: 'Was bietet Cloud Enterprise?', a: 'Cloud Enterprise stellen wir frei nach Ihrem Bedarf zusammen: bis 256 GB RAM, Standard- oder Enterprise-CPU, nahezu unbegrenzter NVMe-Speicher auf mehreren Laufwerken und schneller Performance Storage. Preis ab 249 € netto im Monat.'},
  {q: 'Für wen ist das Angebot?', a: 'Der JTL-Wawi Cloud Server richtet sich an Unternehmen, Händler und Selbstständige. Alle Preise verstehen sich zzgl. gesetzlicher MwSt.'},
];

const INQUIRY_OPTIONS = ['Cloud Start', 'Cloud Advance', 'Cloud Pro', 'Cloud Enterprise', 'Umzug bestehende JTL-Wawi', 'Weiß noch nicht'];

const eur = (n: number) => n.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'});

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
      advance: v(res?.advance),
      pro: v(res?.pro),
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

export default function JtlCloudServer() {
  const {variants} = useLoaderData<typeof loader>();
  const {open} = useAside();
  const [tariff, setTariff] = useState<Exclude<TariffId, 'enterprise'>>('advance');
  const [extraUsers, setExtraUsers] = useState(0);
  const [sqlStandard, setSqlStandard] = useState(false);
  const [preset, setPreset] = useState<string | undefined>(undefined);

  const t = TARIFFS.find((x) => x.id === tariff)!;
  const users = 1 + extraUsers;
  const monthly = t.price + extraUsers * PRICE.rdp + (sqlStandard ? PRICE.sqlUpgrade + users * PRICE.sqlUser : 0);
  const base = variants[tariff];
  const orderable = Boolean(base && (!extraUsers || variants.rdp) && (!sqlStandard || (variants.sqlUpgrade && variants.sqlUser)));

  const info = [
    {key: 'Tarif', value: `JTL-Wawi Cloud Server – ${t.name}`},
    {key: 'RDP-Benutzer', value: `${extraUsers} + Admin-Zugang`},
    {key: 'Datenbank', value: sqlStandard ? 'SQL Server Standard' : 'SQL Server 2022 Express'},
    {key: 'Abrechnung', value: 'Erster Monat – Folgemonate monatlich'},
  ];
  const lines = [
    ...(base ? [{merchandiseId: base, quantity: 1, attributes: info}] : []),
    ...(extraUsers && variants.rdp ? [{merchandiseId: variants.rdp, quantity: extraUsers}] : []),
    ...(sqlStandard && variants.sqlUpgrade ? [{merchandiseId: variants.sqlUpgrade, quantity: 1}] : []),
    ...(sqlStandard && variants.sqlUser ? [{merchandiseId: variants.sqlUser, quantity: users}] : []),
  ];

  const order = (id: TariffId) => {
    if (id === 'enterprise') {
      setPreset('Cloud Enterprise');
      document.getElementById('anfrage')?.scrollIntoView({behavior: 'smooth'});
      return;
    }
    setTariff(id);
    document.getElementById('bestellen')?.scrollIntoView({behavior: 'smooth'});
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
        offers: TARIFFS.map((x) => ({
          '@type': 'Offer',
          name: x.name,
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: x.price.toFixed(2),
            priceCurrency: 'EUR',
            valueAddedTaxIncluded: false,
            unitText: 'Monat',
          },
        })),
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
            <span className="eyebrow">Für Geschäftskunden · Rechenzentrum in Deutschland</span>
            <h1>{H1}</h1>
            <p>
              Ihre <strong>JTL-Wawi</strong> mit Datenbank und JTL-Worker auf einem eigenen Cloud Server im
              TERRA CLOUD Rechenzentrum der <strong>WORTMANN AG</strong>. Die gebuchte Leistung gehört allein Ihnen –
              erreichbar per Remote Desktop aus Büro, Lager und Homeoffice, persönlich eingerichtet von uns.
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
            {TARIFFS.map((x) => (
              <article key={x.id} className={x.highlight ? 'jtl-tariff highlight' : 'jtl-tariff'}>
                {x.highlight ? <span className="jtl-badge">Beliebt</span> : null}
                <header>
                  <h3>{x.name}</h3>
                  <p className="jtl-price">
                    {x.from ? <span>ab</span> : null} <strong>{eur(x.price)}</strong>
                    <small>pro Monat, netto zzgl. MwSt.</small>
                  </p>
                </header>
                <ul>
                  {x.specs.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                  <li>Ressourcen fest zugewiesen</li>
                  <li>Admin-Zugang inkl., RDP-Benutzer je {eur(PRICE.rdp)}/Monat</li>
                  <li>Windows Server inkl. Lizenz · VPN inklusive</li>
                  <li>Backup der SQL-Datenbank inklusive</li>
                  <li className="jtl-users">Empfohlen {x.users}</li>
                </ul>
                <button
                  type="button"
                  className={x.id === 'enterprise' ? 'btn btn-secondary btn-block' : 'btn btn-primary btn-block'}
                  onClick={() => order(x.id)}
                >
                  {x.id === 'enterprise' ? 'Individuell anfragen' : 'Auswählen & bestellen'}
                </button>
              </article>
            ))}
          </div>
          <p className="jtl-note">
            Alle Preise pro Monat, netto zzgl. gesetzlicher MwSt. – das Angebot richtet sich an Geschäftskunden. SQL
            Server Standard (ab ca. 10 GB Datenbankgröße nötig): {eur(PRICE.sqlUpgrade)} pro Monat zzgl.{' '}
            {eur(PRICE.sqlUser)} je Benutzer.
          </p>
        </div>
      </section>

      <section className="section" id="bestellen">
        <div className="container jtl-order">
          <div>
            <span className="eyebrow">Direkt bestellen</span>
            <h2>Cloud Server zusammenstellen</h2>
            <fieldset className="jtl-pick">
              <legend>Tarif</legend>
              {ORDERABLE.map((id) => {
                const x = TARIFFS.find((y) => y.id === id)!;
                return (
                  <label key={id} className={tariff === id ? 'addon checked' : 'addon'} aria-label={x.name}>
                    <input type="radio" name="tarif" checked={tariff === id} onChange={() => setTariff(id)} />
                    <span className="addon-text">
                      <strong>{x.name}</strong>
                      <small>{x.specs.slice(0, 3).join(' · ')}</small>
                    </span>
                    <span className="addon-price">
                      {eur(x.price)}
                      <small>netto/Monat</small>
                    </span>
                  </label>
                );
              })}
              <p className="jtl-pick-hint">
                Mehr Leistung, Performance Storage oder Enterprise-CPU?{' '}
                <button type="button" className="link-button" onClick={() => order('enterprise')}>
                  Cloud Enterprise anfragen
                </button>
              </p>
            </fieldset>
            <div className="jtl-order-row">
              <span>
                <strong>RDP-Benutzer</strong>
                <small>je {eur(PRICE.rdp)} netto pro Monat</small>
              </span>
              <div className="qty" aria-label="RDP-Benutzer">
                <button type="button" onClick={() => setExtraUsers((n) => Math.max(0, n - 1))} aria-label="Weniger Benutzer">
                  −
                </button>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={extraUsers}
                  onChange={(e) => setExtraUsers(Math.min(30, Math.max(0, parseInt(e.target.value || '0', 10))))}
                  aria-label="RDP-Benutzer"
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
                  Nötig ab ca. 10 GB Datenbankgröße – {eur(PRICE.sqlUpgrade)}/Monat zzgl. {eur(PRICE.sqlUser)} je
                  Benutzer (netto)
                </small>
              </span>
            </label>
          </div>
          <div className="jtl-summary">
            <h3>Ihre Auswahl</h3>
            <dl>
              <div>
                <dt>{t.name}</dt>
                <dd>{eur(t.price)}</dd>
              </div>
              {extraUsers ? (
                <div>
                  <dt>{extraUsers} RDP-Benutzer</dt>
                  <dd>{eur(extraUsers * PRICE.rdp)}</dd>
                </div>
              ) : null}
              {sqlStandard ? (
                <>
                  <div>
                    <dt>SQL Server Standard</dt>
                    <dd>{eur(PRICE.sqlUpgrade)}</dd>
                  </div>
                  <div>
                    <dt>
                      {users} SQL-Benutzerlizenz{users > 1 ? 'en' : ''}
                    </dt>
                    <dd>{eur(users * PRICE.sqlUser)}</dd>
                  </div>
                </>
              ) : null}
            </dl>
            <p className="jtl-total">
              <span>Pro Monat</span>
              <strong>{eur(monthly)}</strong>
              <small>netto zzgl. MwSt.</small>
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
              Mit der Bestellung zahlen Sie den ersten Monat. Die Folgemonate rechnen wir monatlich ab. Bereitstellung
              in 2–4 Werktagen – wir melden uns nach der Bestellung zur Einrichtung.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container server-guide-split jtl-enterprise">
          <div>
            <span className="eyebrow">Cloud Enterprise · ab {eur(PRICE.enterprise)} netto/Monat</span>
            <h2>Frei konfigurierbar für große Datenbanken und viele Benutzer</h2>
            <ul className="check-list">
              {ENTERPRISE_OPTIONS.map((o) => (
                <li key={o}>
                  <Icon name="check" size={18} />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="server-guide-box">
            <Icon name="server" size={28} />
            <strong>Wir legen Ihren Server aus</strong>
            <p>
              Nennen Sie uns Benutzerzahl, Datenbankgröße und Anzahl Aufträge pro Tag – wir empfehlen CPU, RAM und
              Storage und erstellen Ihnen ein Angebot.
            </p>
            <button type="button" className="link-arrow link-button" onClick={() => order('enterprise')}>
              Enterprise anfragen <Icon name="chevron-right" size={16} />
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Gut abwägen</span>
              <h2>Cloud Server oder eigener Server im Büro?</h2>
            </div>
          </div>
          <div className="cloud-table-wrap">
            <table className="cloud-table server-compare">
              <thead>
                <tr>
                  <th aria-label="Kriterium" />
                  <th>JTL-Wawi Cloud Server</th>
                  <th>Eigener Server im Büro</th>
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
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <h2 className="section-title">Ihre Vorteile</h2>
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
          <CloudInquiry key={preset ?? 'none'} preset={preset} options={INQUIRY_OPTIONS} />
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
    advance: product(handle: "jtl-cloud-advance") { ...JtlCloudVariant }
    pro: product(handle: "jtl-cloud-pro") { ...JtlCloudVariant }
    rdp: product(handle: "jtl-cloud-rdp-benutzer") { ...JtlCloudVariant }
    sqlUpgrade: product(handle: "jtl-cloud-sql-standard") { ...JtlCloudVariant }
    sqlUser: product(handle: "jtl-cloud-sql-benutzer") { ...JtlCloudVariant }
  }
  fragment JtlCloudVariant on Product {
    variants(first: 1) { nodes { id availableForSale } }
  }
` as const;
