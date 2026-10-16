import {Link} from 'react-router';
import type {Route} from './+types/cloud._index';
import {Icon} from '~/components/Icon';
import {CloudInquiry} from '~/components/CloudInquiry';
import {CLOUD_SERVICES, CLOUD_USPS, RZ_GALLERY} from '~/lib/cloud';
import {SITE_URL, absUrl, pageTitle} from '~/lib/seo';
import {siteImg} from '~/lib/site-images';

const TITLE = 'TERRA CLOUD – Cloud-Server & Backup aus Deutschland';
const DESCRIPTION =
  'Cloud „IT made in Germany“: virtuelle Server, Cloud-Backup, S3-Speicher und Hosting aus dem TERRA CLOUD Rechenzentrum in Hüllhorst – ISO 27001, DSGVO-konform, monatlich kündbar. Preise auf Anfrage.';

const FAQ = [
  {q: 'Was ist die TERRA CLOUD?', a: 'Die Cloud-Plattform der WORTMANN AG aus Hüllhorst – dem Hersteller der TERRA PCs und Server. Seit 2014 betreibt sie eigene Rechenzentren in Deutschland und der Schweiz für Unternehmen aus dem Mittelstand.'},
  {q: 'Was kostet die TERRA CLOUD?', a: 'Abgerechnet wird monatlich nach gebuchten Ressourcen bzw. Verbrauch. Da jede Umgebung anders ist, erstellen wir Ihnen ein individuelles Angebot – in der Regel innerhalb eines Werktags.'},
  {q: 'Warum über terra-computershop.de?', a: 'Die TERRA CLOUD wird ausschließlich über Fachhändler vertrieben. Als Systemhaus aus Verl richten wir Ihre Umgebung ein, betreuen sie und sind Ihr direkter Ansprechpartner.'},
  {q: 'Gibt es eine Mindestlaufzeit?', a: 'Für virtuelle Server (IaaS) und Backup gibt es laut Leistungsbeschreibung keine Mindestlaufzeit – die Verträge verlängern sich monatlich.'},
];

export const meta: Route.MetaFunction = () => [
  {title: pageTitle(TITLE)},
  {name: 'description', content: DESCRIPTION},
  {property: 'og:title', content: 'TERRA CLOUD – Cloud aus deutschem Rechenzentrum'},
  {property: 'og:description', content: DESCRIPTION},
  {property: 'og:image', content: absUrl('/images/og-default.jpg')},
];

export default function CloudIndex() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {'@type': 'ListItem', position: 1, name: 'Startseite', item: `${SITE_URL}/`},
          {'@type': 'ListItem', position: 2, name: 'TERRA CLOUD', item: `${SITE_URL}/cloud`},
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({'@type': 'Question', name: f.q, acceptedAnswer: {'@type': 'Answer', text: f.a}})),
      },
      {
        '@type': 'ItemList',
        name: 'TERRA CLOUD Leistungen',
        itemListElement: CLOUD_SERVICES.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/cloud/${s.slug}`,
          name: s.name,
        })),
      },
    ],
  };

  return (
    <div className="cloud-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />

      <section className="cloud-hero">
        <img
          {...siteImg('/images/cloud/header.jpg', '100vw')}
          alt="TERRA CLOUD – flexibel, hochverfügbar, sicher"
          className="cloud-hero-bg"
          loading="eager"
          fetchPriority="high"
        />
        <div className="container cloud-hero-inner">
          <nav className="breadcrumb breadcrumb-light" aria-label="Brotkrümel">
            <Link to="/">Startseite</Link>
            <span aria-hidden>›</span>
            <span>TERRA CLOUD</span>
          </nav>
          <span className="eyebrow eyebrow-light">IT made in Germany</span>
          <h1>Die Cloud aus Ostwestfalen</h1>
          <p>
            Virtuelle Server, Backup, Speicher und Hosting aus dem TERRA CLOUD Rechenzentrum der WORTMANN AG in
            Hüllhorst – eingerichtet und betreut von Ihrem Systemhaus aus Verl.
          </p>
          <div className="feature-actions">
            <a href="#anfrage" className="btn btn-primary">
              Unverbindlich anfragen <Icon name="arrow-right" size={18} />
            </a>
            <Link to="/cloud/rechenzentrum" className="btn btn-light">
              Zum Rechenzentrum
            </Link>
          </div>
        </div>
      </section>

      <section className="cloud-usps">
        <div className="container cloud-usps-inner">
          {CLOUD_USPS.map((u) => (
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
              <span className="eyebrow">Leistungen</span>
              <h2>Was Sie in der TERRA CLOUD buchen können</h2>
            </div>
          </div>
          <div className="cloud-grid">
            {CLOUD_SERVICES.map((s) => (
              <Link key={s.slug} to={`/cloud/${s.slug}`} className="cloud-card" prefetch="intent">
                <span className="cloud-card-media">
                  <img {...siteImg(s.image, '(min-width: 64em) 380px, 100vw')} alt={s.imageAlt} loading="lazy" />
                </span>
                <span className="cloud-card-body">
                  <strong>{s.name}</strong>
                  <span>{s.teaser}</span>
                  <span className="link-arrow">
                    Mehr erfahren <Icon name="chevron-right" size={16} />
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <p className="solution-notice">
            <Icon name="server" size={20} />
            <span>
              <strong>Für JTL-Händler:</strong> Ihre JTL-Wawi mit Datenbank und Worker auf einem eigenen Cloud Server –
              ab 57,60 € netto im Monat, VPN inklusive.{' '}
              <Link to="/cloud/jtl-wawi-server" prefetch="intent">JTL-Wawi Cloud Server ansehen</Link>
            </span>
          </p>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container cloud-split">
          <div className="cloud-split-media">
            <img {...siteImg('/images/cloud/rz-server.jpg', '(min-width: 64em) 600px, 100vw')} alt="Serverschrank mit TERRA CLOUD Logo" loading="lazy" />
          </div>
          <div>
            <span className="eyebrow">Warum TERRA CLOUD?</span>
            <h2>Ihre Daten bleiben in Deutschland</h2>
            <ul className="check-list">
              <li>Rechenzentren in Deutschland, Firmensitz und Gerichtsstand in Deutschland</li>
              <li>Verträge nach deutschem Recht, ISO/IEC 27001:2022-zertifiziert</li>
              <li>Jede Umgebung in einem privaten Netzwerk mit eigener Firewall</li>
              <li>Eigene Rechenzentren, eigene Hardware, eigenes Personal – ohne externe Investoren</li>
              <li>Rund 90 % Ökostrom, großer Anteil Freiluftkühlung</li>
            </ul>
            <Link to="/cloud/rechenzentrum" className="link-arrow">
              Das Rechenzentrum ansehen <Icon name="chevron-right" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Einblicke ins Rechenzentrum</h2>
          <div className="cloud-gallery">
            {RZ_GALLERY.map((g) => (
              <figure key={g.src}>
                <img {...siteImg(g.src, '(min-width: 64em) 380px, 50vw')} alt={g.alt} loading="lazy" />
                <figcaption>{g.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container cloud-steps">
          <h2 className="section-title">So einfach kommen Sie in die Cloud</h2>
          <ol>
            <li><strong>Anfrage</strong><span>Sie beschreiben kurz Ihr Vorhaben – Server, Benutzer, Datenmenge.</span></li>
            <li><strong>Angebot</strong><span>Wir schlagen eine passende Umgebung vor, mit festem Monatspreis.</span></li>
            <li><strong>Bereitstellung</strong><span>Virtuelle Server stehen in der Regel nach etwa drei Arbeitstagen bereit.</span></li>
            <li><strong>Betreuung</strong><span>Wir richten ein, ziehen Daten um und kümmern uns um Updates und Backup.</span></li>
          </ol>
        </div>
      </section>

      <section className="section" id="anfrage">
        <div className="container cloud-inquiry-wrap">
          <div>
            <span className="eyebrow">Preise auf Anfrage</span>
            <h2>Ihr Angebot für die TERRA CLOUD</h2>
            <p>
              Jede Umgebung ist anders. Sagen Sie uns, was Sie brauchen – wir melden uns innerhalb eines
              Werktags mit Vorschlag und Monatspreis.
            </p>
          </div>
          <CloudInquiry />
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="faq">
            <h2 className="section-title">Häufige Fragen</h2>
            {FAQ.map((f) => (
              <details key={f.q} className="faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
