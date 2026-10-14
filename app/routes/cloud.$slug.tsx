import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/cloud.$slug';
import {Icon} from '~/components/Icon';
import {CloudInquiry} from '~/components/CloudInquiry';
import {CLOUD_INTEREST_OPTIONS, CLOUD_SERVICES, RZ_GALLERY, findCloudService} from '~/lib/cloud';
import {SITE_URL, absUrl} from '~/lib/seo';
import {siteImg} from '~/lib/site-images';

export const meta: Route.MetaFunction = ({data}) => {
  const s = data?.service;
  if (!s) return [{title: 'Nicht gefunden'}];
  return [
    {title: s.metaTitle},
    {name: 'description', content: s.metaDescription},
    {property: 'og:title', content: s.title},
    {property: 'og:description', content: s.metaDescription},
    {property: 'og:image', content: absUrl('/images/og-default.jpg')},
  ];
};

export function loader({params}: Route.LoaderArgs) {
  const service = findCloudService(params.slug);
  if (!service) throw new Response('Not found', {status: 404});
  return {service};
}

/** Passende Vorauswahl im Anfrageformular */
const PRESET: Record<string, string> = {
  'virtuelle-server': 'Virtuelle Server (IaaS)',
  backup: 'Cloud-Backup',
  's3-storage': 'S3-Speicher',
  'hosting-housing': 'Hosting / Housing',
  'jtl-wawi-cloud': 'JTL-Wawi in der Cloud',
};

export default function CloudService() {
  const {service: s} = useLoaderData<typeof loader>();
  const others = CLOUD_SERVICES.filter((x) => x.slug !== s.slug);
  const url = `${SITE_URL}/cloud/${s.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {'@type': 'ListItem', position: 1, name: 'Startseite', item: `${SITE_URL}/`},
          {'@type': 'ListItem', position: 2, name: 'TERRA CLOUD', item: `${SITE_URL}/cloud`},
          {'@type': 'ListItem', position: 3, name: s.name, item: url},
        ],
      },
      {
        '@type': 'Service',
        name: s.title,
        description: s.metaDescription,
        url,
        serviceType: s.name,
        areaServed: {'@type': 'Country', name: 'Deutschland'},
        provider: {'@id': `${SITE_URL}/#store`},
        brand: {'@type': 'Brand', name: 'TERRA CLOUD'},
      },
      {
        '@type': 'FAQPage',
        mainEntity: s.faq.map((f) => ({'@type': 'Question', name: f.q, acceptedAnswer: {'@type': 'Answer', text: f.a}})),
      },
    ],
  };
  const preset = PRESET[s.slug] && CLOUD_INTEREST_OPTIONS.includes(PRESET[s.slug]) ? PRESET[s.slug] : undefined;

  return (
    <div className="cloud-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
      <div className="container">
        <nav className="breadcrumb" aria-label="Brotkrümel">
          <Link to="/">Startseite</Link>
          <span aria-hidden>›</span>
          <Link to="/cloud">TERRA CLOUD</Link>
          <span aria-hidden>›</span>
          <span>{s.name}</span>
        </nav>
      </div>

      <section className="solution-hero">
        <div className="container solution-hero-inner">
          <div className="solution-hero-copy">
            <span className="eyebrow">TERRA CLOUD · Preise auf Anfrage</span>
            <h1>{s.title}</h1>
            {s.intro.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <div className="feature-actions">
              <a href="#anfrage" className="btn btn-primary">
                Angebot anfragen <Icon name="arrow-right" size={18} />
              </a>
              <Link to="/cloud" className="btn btn-secondary">
                Alle Cloud-Leistungen
              </Link>
            </div>
          </div>
          <div className="solution-hero-media cloud-hero-media">
            <img {...siteImg(s.image, '(min-width: 64em) 520px, 100vw')} alt={s.imageAlt} loading="eager" fetchPriority="high" />
          </div>
        </div>
      </section>

      <section className="cloud-usps">
        <div className="container cloud-usps-inner">
          {s.facts.map((u) => (
            <div key={u.label}>
              <strong>{u.value}</strong>
              <span>{u.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Leistungen im Überblick</h2>
          <div className="needs-grid cloud-features">
            {s.features.map((f, i) => (
              <div key={f.title} className="need-card">
                <span className="need-num">{String(i + 1).padStart(2, '0')}</span>
                <strong>{f.title}</strong>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
          {s.note ? (
            <p className="solution-notice">
              <Icon name="shield" size={20} />
              <span>{s.note}</span>
            </p>
          ) : null}
        </div>
      </section>

      {s.compare ? (
        <section className="section section-muted">
          <div className="container">
            <h2 className="section-title">IaaS oder IaaS Basic?</h2>
            <div className="cloud-table-wrap">
              <table className="cloud-table">
                <thead>
                  <tr>
                    {s.compare.head.map((h) => (
                      <th key={h || 'x'}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.compare.rows.map((r) => (
                    <tr key={r[0]}>
                      {r.map((c, i) => (i === 0 ? <th key={c}>{c}</th> : <td key={c}>{c}</td>))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}

      {s.slug === 'rechenzentrum' ? (
        <section className="section">
          <div className="container">
            <div className="cloud-gallery">
              {RZ_GALLERY.map((g) => (
                <figure key={g.src}>
                  <img {...siteImg(g.src, '(min-width: 64em) 380px, 50vw')} alt={g.alt} loading="lazy" />
                  <figcaption>{g.label}</figcaption>
                </figure>
              ))}
            </div>
            <figure className="cloud-team">
              <img {...siteImg('/images/cloud/team.jpg', '(min-width: 64em) 900px, 100vw')} alt="Das TERRA CLOUD Team vor dem Rechenzentrum in Hüllhorst" loading="lazy" />
              <figcaption>Mehr als 100 Fachleute betreiben die TERRA CLOUD in Hüllhorst.</figcaption>
            </figure>
          </div>
        </section>
      ) : null}

      <section className="section" id="anfrage">
        <div className="container cloud-inquiry-wrap">
          <div>
            <span className="eyebrow">Preise auf Anfrage</span>
            <h2>{s.name} anfragen</h2>
            <p>
              Nennen Sie uns kurz Ihre Anforderungen – wir melden uns innerhalb eines Werktags mit Vorschlag und
              Monatspreis.
            </p>
          </div>
          <CloudInquiry preset={preset} />
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="faq">
            <h2 className="section-title">Häufige Fragen</h2>
            {s.faq.map((f) => (
              <details key={f.q} className="faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Weitere Cloud-Leistungen</h2>
          <div className="cloud-grid cloud-grid-small">
            {others.map((o) => (
              <Link key={o.slug} to={`/cloud/${o.slug}`} className="cloud-card" prefetch="intent">
                <span className="cloud-card-body">
                  <strong>{o.name}</strong>
                  <span>{o.teaser}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
