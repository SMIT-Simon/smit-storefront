import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/ratgeber.hyper-v-virtualisierung';
import {ProductItem} from '~/components/ProductItem';
import {Icon} from '~/components/Icon';
import {CloudInquiry} from '~/components/CloudInquiry';
import {PRODUCT_ITEM_FRAGMENT} from '~/lib/product-item-fragment';
import {isListable} from '~/lib/addons';
import {SITE_URL, pageTitle} from '~/lib/seo';
import {siteImg} from '~/lib/site-images';

const SLUG = '/ratgeber/hyper-v-virtualisierung';
const H1 = 'Virtualisierung mit Hyper-V: mehrere Server auf einer Hardware';
const TITLE = 'Hyper-V Virtualisierung mit Windows Server 2025';
const DESCRIPTION =
  'Hyper-V einfach erklärt: mehrere virtuelle Server auf einem TERRA SERVER mit Windows Server 2025. Vorteile, Lizenzierung Standard vs. Datacenter und Planung.';

const FACTS = [
  {value: '1 Server', label: 'für viele virtuelle Maschinen'},
  {value: '2 VMs', label: 'inklusive bei Windows Server Standard'},
  {value: 'unbegrenzt', label: 'VMs mit Windows Server Datacenter'},
  {value: 'Made in Germany', label: 'TERRA SERVER aus Hüllhorst'},
];

const BENEFITS = [
  {
    title: 'Weniger Hardware, weniger Kosten',
    text: 'Statt für jede Anwendung einen eigenen Server zu kaufen, teilen sich mehrere virtuelle Maschinen eine leistungsstarke Hardware. Das spart Anschaffung, Strom, Kühlung und Platz – und die Ressourcen werden deutlich besser ausgelastet.',
  },
  {
    title: 'Flexibel und schnell erweiterbar',
    text: 'Eine neue VM ist in Minuten angelegt, kopiert oder verschoben. Braucht eine Anwendung mehr Leistung, bekommt sie per Klick mehr Prozessorkerne oder Arbeitsspeicher – ohne neue Hardware.',
  },
  {
    title: 'Sauber getrennt, besser geschützt',
    text: 'Jede VM läuft isoliert von den anderen. Ein Problem in einer Maschine – etwa durch Schadsoftware – greift nicht automatisch auf die übrigen über. Secure Boot und Verschlüsselung der VMs sorgen für zusätzliche Sicherheit.',
  },
  {
    title: 'Wartung ohne Stillstand',
    text: 'Mit Live-Migration lassen sich laufende VMs zwischen zwei Hyper-V-Hosts verschieben, während die Benutzer weiterarbeiten. So können Sie einen Server warten oder austauschen, ohne den Betrieb zu unterbrechen.',
  },
  {
    title: 'Schnelle Wiederherstellung',
    text: 'Eine VM ist im Kern eine Datei. Sie lässt sich komplett sichern, per Prüfpunkt (Snapshot) vor Updates absichern und im Notfall schnell wiederherstellen – auf Wunsch auch in der TERRA CLOUD.',
  },
  {
    title: 'Wächst mit dem Unternehmen',
    text: 'Vom einzelnen Server bis zum Failover-Cluster mit gemeinsamem Speicher: Hyper-V skaliert mit. Netzwerkvirtualisierung und die Anbindung an Microsoft-Dienste wie Azure sind integriert.',
  },
];

const LICENSE: [string, string, string][] = [
  ['Virtuelle Maschinen mit Windows Server', '2 VMs pro vollständig lizenziertem Server', 'Unbegrenzt viele VMs'],
  ['Lizenzierung', 'Pro Prozessorkern, mindestens 16 Kerne je Server', 'Pro Prozessorkern, mindestens 16 Kerne je Server'],
  ['Mehr VMs nötig?', 'Weitere 2 VMs durch erneutes Lizenzieren aller Kerne', 'Nicht nötig'],
  ['Zugriffslizenzen (CALs)', 'Erforderlich für Benutzer oder Geräte', 'Erforderlich für Benutzer oder Geräte'],
  ['Passt für …', 'Kleine Umgebungen mit wenigen Servern', 'Viele VMs, Cluster, stark virtualisierte Umgebungen'],
];

const PLANNING = [
  'Welche Anwendungen sollen virtualisiert werden – z. B. Domänencontroller, Dateiserver, Warenwirtschaft, SQL-Datenbank, Terminalserver?',
  'Wie viele Prozessorkerne und wie viel Arbeitsspeicher brauchen die VMs zusammen – mit Reserve für die nächsten Jahre?',
  'Wie viel Speicherplatz, wie schnell (NVMe-SSD) und in welchem RAID-Level?',
  'Wie werden die VMs gesichert – lokal und zusätzlich außer Haus, z. B. in der TERRA CLOUD?',
  'Wie lange darf ein Ausfall dauern? Reicht ein Server mit Vor-Ort-Service oder braucht es einen Cluster?',
  'Welche Windows-Server-Edition und wie viele Zugriffslizenzen (CALs) werden benötigt?',
];

const INTEREST_OPTIONS = [
  'Neuer Server für Hyper-V',
  'Bestehende Server virtualisieren',
  'Lizenzierung Windows Server',
  'Backup der VMs / TERRA CLOUD',
  'Hochverfügbarkeit (Cluster)',
  'Weiß noch nicht',
];

const FAQ = [
  {
    q: 'Was ist Hyper-V?',
    a: 'Hyper-V ist die Virtualisierungsplattform von Microsoft und fester Bestandteil von Windows Server. Ein sogenannter Hypervisor verteilt Prozessor, Arbeitsspeicher, Speicher und Netzwerk eines physischen Servers auf mehrere virtuelle Maschinen, die jeweils wie ein eigener Server mit eigenem Betriebssystem arbeiten.',
  },
  {
    q: 'Kostet Hyper-V extra?',
    a: 'Nein. Die Hyper-V-Rolle ist in Windows Server enthalten. Kosten entstehen für die Windows-Server-Lizenz des Hosts, die Lizenzen der Betriebssysteme in den VMs und die Zugriffslizenzen (CALs). Mit Windows Server Standard sind zwei Windows-Server-VMs abgedeckt, mit Datacenter beliebig viele.',
  },
  {
    q: 'Windows Server Standard oder Datacenter – was brauche ich?',
    a: 'Für kleine Umgebungen mit bis zu zwei virtuellen Windows-Servern reicht meist die Standard Edition. Sollen deutlich mehr VMs laufen oder ein Cluster aufgebaut werden, ist Datacenter oft günstiger, weil es beliebig viele Windows-Server-VMs auf dem lizenzierten Host erlaubt. Wir rechnen das gern für Ihren Fall durch.',
  },
  {
    q: 'Welcher TERRA SERVER eignet sich für Hyper-V?',
    a: 'Entscheidend sind genügend Prozessorkerne, viel Arbeitsspeicher und schnelle, redundante Laufwerke (RAID). Für kleinere Umgebungen genügt oft ein TERRA MINISERVER oder SERVER 3030, für mehr VMs ein 19-Zoll-Rack-Server wie der TERRA SERVER 3230 oder 7000er mit Hot-Swap-Laufwerken und redundanten Netzteilen.',
  },
  {
    q: 'Können meine bestehenden Server virtualisiert werden?',
    a: 'In vielen Fällen ja. Ältere physische Server lassen sich als virtuelle Maschinen auf einen neuen TERRA SERVER übernehmen. Ob und wie das sinnvoll ist, hängt von Betriebssystem, Software-Lizenzen und Hardware-Abhängigkeiten ab – das prüfen wir vorab mit Ihnen.',
  },
  {
    q: 'Wie werden virtuelle Maschinen gesichert?',
    a: 'VMs lassen sich als Ganzes sichern, inklusive Betriebssystem, Programmen und Daten. Wir empfehlen eine lokale Sicherung plus eine Kopie außer Haus – zum Beispiel mit TERRA CLOUD Backup im deutschen Rechenzentrum der WORTMANN AG.',
  },
];

export async function loader({context}: Route.LoaderArgs) {
  const res = await context.storefront
    .query(HYPERV_PRODUCTS_QUERY, {
      variables: {query: 'product_type:Server', first: 30},
      cache: context.storefront.CacheShort(),
    })
    .catch(() => null);
  const all = (res?.products.nodes ?? []).filter(isListable);
  const withWindows = all.filter((p) => /windows server/i.test(p.title));
  const products = (withWindows.length ? withWindows : all).sort(
    (a, b) =>
      Number(a.priceRange.minVariantPrice.amount) - Number(b.priceRange.minVariantPrice.amount),
  );
  return {products};
}

export const meta: Route.MetaFunction = () => [
  {title: pageTitle(TITLE)},
  {name: 'description', content: DESCRIPTION},
  {property: 'og:title', content: 'Virtualisierung mit Hyper-V – Ratgeber'},
  {property: 'og:description', content: DESCRIPTION},
  {
    property: 'og:image',
    content: 'https://cdn.shopify.com/s/files/1/1089/3439/8286/files/site-hyperv-schaubild.jpg?width=1200',
  },
];

export default function HyperVGuide() {
  const {products} = useLoaderData<typeof loader>();
  const url = `${SITE_URL}${SLUG}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {'@type': 'ListItem', position: 1, name: 'Startseite', item: `${SITE_URL}/`},
          {'@type': 'ListItem', position: 2, name: 'Hyper-V Virtualisierung', item: url},
        ],
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
    <div className="landing-page server-guide hyperv-guide">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
      <div className="container">
        <nav className="breadcrumb" aria-label="Brotkrümel">
          <Link to="/">Startseite</Link>
          <span aria-hidden>›</span>
          <Link to="/ratgeber/wortmann-server">Wortmann Server</Link>
          <span aria-hidden>›</span>
          <span>Hyper-V Virtualisierung</span>
        </nav>
        <figure className="hyperv-banner">
          <img
            {...siteImg('/images/hyperv/header.jpg', '(min-width: 80em) 1232px, 100vw')}
            alt="Virtualisierung mit Microsoft Hyper-V unter Windows Server 2025 auf TERRA SERVER"
            loading="eager"
            fetchPriority="high"
          />
        </figure>
        <header className="landing-head hyperv-head">
          <span className="eyebrow">Ratgeber · Windows Server 2025</span>
          <h1>{H1}</h1>
          <p>
            Mit <strong>Hyper-V</strong> laufen Dateiserver, Warenwirtschaft, Datenbank und Terminalserver nicht mehr
            auf eigenen Geräten, sondern als <strong>virtuelle Maschinen (VMs)</strong> gemeinsam auf einem
            leistungsstarken TERRA SERVER. Das spart Hardware und Strom und macht Ihre IT deutlich flexibler.
          </p>
          <p>
            Hyper-V ist bereits in Windows Server enthalten. Wir planen mit Ihnen die passende Hardware,
            die richtige Lizenzierung und die Datensicherung – und richten alles ein.
          </p>
          <div className="feature-actions">
            <a href="#anfrage" className="btn btn-primary">
              Virtualisierung planen <Icon name="arrow-right" size={18} />
            </a>
            <a href="#modelle" className="btn btn-secondary">
              Passende Server ansehen
            </a>
          </div>
        </header>
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
        <div className="container cloud-split">
          <div className="cloud-split-media">
            <img
              {...siteImg('/images/hyperv/schaubild.jpg', '(min-width: 64em) 600px, 100vw')}
              alt="Schaubild: Hypervisor auf einem TERRA SERVER mit vier virtuellen Maschinen für Exchange, SQL und Web"
              loading="lazy"
            />
          </div>
          <div>
            <span className="eyebrow">So funktioniert es</span>
            <h2>Was ist Hyper-V?</h2>
            <p>
              Hyper-V ist die Virtualisierungsplattform von Microsoft. Direkt auf der Server-Hardware läuft der{' '}
              <strong>Hypervisor</strong>. Er teilt Prozessor, Arbeitsspeicher, Laufwerke und Netzwerk auf mehrere
              virtuelle Maschinen auf.
            </p>
            <p>
              Jede VM verhält sich wie ein eigener Server mit eigenem Betriebssystem – zum Beispiel eine VM für
              Exchange, zwei für SQL-Datenbanken und eine für den Webserver, wie im Schaubild. Für die Anwendungen
              macht das keinen Unterschied, für Ihre Kosten und Ihre Flexibilität einen großen.
            </p>
            <ul className="check-list">
              <li>
                <Icon name="check" size={18} />
                <span>Rolle ist in Windows Server 2025 enthalten – keine Zusatzsoftware nötig</span>
              </li>
              <li>
                <Icon name="check" size={18} />
                <span>Windows- und Linux-Systeme als Gast möglich</span>
              </li>
              <li>
                <Icon name="check" size={18} />
                <span>Verwaltung über den Hyper-V-Manager oder Windows Admin Center</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <h2 className="section-title">Ihre Vorteile mit Hyper-V</h2>
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

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Lizenzierung</span>
              <h2>Windows Server Standard oder Datacenter?</h2>
            </div>
          </div>
          <div className="cloud-table-wrap">
            <table className="cloud-table server-compare">
              <thead>
                <tr>
                  <th aria-label="Kriterium" />
                  <th>Windows Server Standard</th>
                  <th>Windows Server Datacenter</th>
                </tr>
              </thead>
              <tbody>
                {LICENSE.map((r) => (
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
              <strong>Faustregel:</strong> Bis zu zwei virtuelle Windows-Server reicht meist Standard. Ab etwa
              vier bis sechs VMs pro Host wird Datacenter oft wirtschaftlicher. Die genaue Rechnung hängt von
              Prozessorkernen und Anzahl der VMs ab – wir erstellen Ihnen ein Angebot mit passender Lizenzierung.
            </span>
          </p>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container server-guide-split">
          <div>
            <span className="eyebrow">Gut geplant</span>
            <h2>Diese Fragen klären wir vor dem Kauf</h2>
            <ul className="check-list">
              {PLANNING.map((p) => (
                <li key={p}>
                  <Icon name="check" size={18} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="server-guide-box">
            <Icon name="shield" size={28} />
            <strong>Server von WORTMANN, Einrichtung von uns</strong>
            <p>
              Die TERRA SERVER werden in Hüllhorst nach Ihren Vorgaben gefertigt, auf Wunsch mit Windows Server 2025
              vorinstalliert und mit Vor-Ort-Service bis zu 10 Jahre. Wir übernehmen Einrichtung, Migration Ihrer
              bestehenden Server und die Datensicherung – alles aus einer Hand aus Verl.
            </p>
            <a href="#anfrage" className="link-arrow">
              Beratung anfragen <Icon name="chevron-right" size={16} />
            </a>
          </div>
        </div>
      </section>

      {products.length ? (
        <section className="section" id="modelle">
          <div className="container">
            <div className="section-head">
              <h2>TERRA SERVER mit Windows Server 2025</h2>
              <Link to="/ratgeber/wortmann-server" className="link-arrow" prefetch="intent">
                Alle TERRA Server im Überblick <Icon name="chevron-right" size={16} />
              </Link>
            </div>
            <p className="server-guide-hint">
              Vorkonfigurierte Modelle mit Windows Server 2025 – für mehr VMs, mehr Arbeitsspeicher oder die
              Datacenter-Edition konfigurieren wir Ihren Server individuell.
            </p>
            <div className="products-grid">
              {products.map((p) => (
                <ProductItem key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section section-muted" id="anfrage">
        <div className="container cloud-inquiry-wrap">
          <div>
            <span className="eyebrow">Unverbindlich</span>
            <h2>Virtualisierung planen lassen</h2>
            <p>
              Nennen Sie uns kurz Ihre Anwendungen, die Anzahl der Benutzer und Ihre heutigen Server. Wir melden
              uns innerhalb eines Werktags mit einem Vorschlag für Hardware, Lizenzierung und Datensicherung.
            </p>
          </div>
          <CloudInquiry options={INTEREST_OPTIONS} topic="Server-Anfrage" />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="faq">
            <h2 className="section-title">Häufige Fragen zu Hyper-V</h2>
            {FAQ.map((f) => (
              <details key={f.q} className="faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <div className="solution-chips landing-related">
            <span>Auch interessant:</span>
            <Link to="/ratgeber/wortmann-server" className="sub-chip" prefetch="intent">Wortmann Server</Link>
            <Link to="/themen/tower-server" className="sub-chip" prefetch="intent">Tower-Server</Link>
            <Link to="/cloud/backup" className="sub-chip" prefetch="intent">TERRA CLOUD Backup</Link>
            <Link to="/cloud/virtuelle-server" className="sub-chip" prefetch="intent">Virtuelle Server in der Cloud</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const HYPERV_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query HyperVGuideProducts(
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
