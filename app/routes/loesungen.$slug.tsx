import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/loesungen.$slug';
import {ProductItem} from '~/components/ProductItem';
import {Icon} from '~/components/Icon';
import {PriceModeNote} from '~/components/PriceMode';
import {PRODUCT_ITEM_FRAGMENT} from '~/lib/product-item-fragment';
import {findSolution, scenarioQuery, SOLUTIONS} from '~/lib/solutions';
import {SolutionTiles} from '~/components/SolutionTiles';

export const meta: Route.MetaFunction = ({data, location}) => {
  const s = data?.solution;
  if (!s) return [{title: 'Lösung nicht gefunden'}];
  return [
    {title: s.metaTitle},
    {name: 'description', content: s.metaDescription},
    {property: 'og:title', content: s.metaTitle},
    {property: 'og:description', content: s.metaDescription},
    {property: 'og:image', content: s.image},
    {tagName: 'link', rel: 'canonical', href: location.pathname},
  ];
};

export async function loader({params, context}: Route.LoaderArgs) {
  const solution = findSolution(params.slug);
  if (!solution) throw new Response('Not found', {status: 404});
  const {storefront} = context;

  const scenarios = await Promise.all(
    solution.scenarios.map(async (sc) => {
      const {query, href} = scenarioQuery(sc);
      const res = await storefront
        .query(SOLUTION_PRODUCTS_QUERY, {
          variables: {query, first: 10},
          cache: storefront.CacheShort(),
        })
        .catch(() => null);
      // Barebones (ohne RAM/SSD/Betriebssystem) sind keine Arbeitsplatz-Empfehlung.
      const products = (res?.products.nodes ?? [])
        .filter((p) => !/barebone/i.test(p.title))
        .slice(0, 4);
      return {...sc, href, products};
    }),
  );

  return {solution, scenarios};
}

export default function SolutionPage() {
  const {solution: s, scenarios} = useLoaderData<typeof loader>();
  const related = s.related
    .map((slug) => SOLUTIONS.find((x) => x.slug === slug))
    .filter(Boolean) as typeof SOLUTIONS;
  const kindLabel = s.kind === 'branche' ? 'Branchenlösung' : 'Einsatzbereich';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: s.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {'@type': 'Answer', text: f.a},
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {'@type': 'ListItem', position: 1, name: 'Startseite', item: '/'},
          {'@type': 'ListItem', position: 2, name: 'Branchen & Lösungen', item: '/loesungen'},
          {'@type': 'ListItem', position: 3, name: s.name},
        ],
      },
    ],
  };

  return (
    <div className="solution-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
      <div className="container">
        <nav className="breadcrumb" aria-label="Brotkrümel">
          <Link to="/">Startseite</Link>
          <span aria-hidden>›</span>
          <Link to="/loesungen">Branchen &amp; Lösungen</Link>
          <span aria-hidden>›</span>
          <span>{s.name}</span>
        </nav>
      </div>

      <section className="solution-hero">
        <div className="container solution-hero-inner">
          <div className="solution-hero-copy">
            <span className="eyebrow">{kindLabel}</span>
            <h1>{s.title}</h1>
            {s.intro.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <div className="feature-actions">
              <a href="#empfehlungen" className="btn btn-primary">
                Zu den Empfehlungen <Icon name="arrow-right" size={18} />
              </a>
              <Link to="/pages/kontakt" className="btn btn-secondary">
                Beratung anfragen
              </Link>
            </div>
          </div>
          <div className="solution-hero-media">
            <img src={s.image} alt={s.imageAlt} width={1200} height={800} loading="eager" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Worauf es ankommt</h2>
          <div className="needs-grid">
            {s.needs.map((n, i) => (
              <div key={n.title} className="need-card">
                <span className="need-num">{String(i + 1).padStart(2, '0')}</span>
                <strong>{n.title}</strong>
                <p>{n.text}</p>
              </div>
            ))}
          </div>
          {s.notice ? (
            <p className="solution-notice">
              <Icon name="shield" size={20} />
              <span>{s.notice}</span>
            </p>
          ) : null}
        </div>
      </section>

      <section className="section section-muted" id="empfehlungen">
        <div className="container">
          <div className="section-head">
            <h2>Unsere Empfehlungen</h2>
            <PriceModeNote />
          </div>
          {scenarios.map((sc) => (
            <div key={sc.title} className="scenario">
              <div className="scenario-head">
                <div>
                  <h3>{sc.title}</h3>
                  <p>{sc.text}</p>
                </div>
                <Link to={sc.href} className="link-arrow" prefetch="intent">
                  Alle ansehen <Icon name="chevron-right" size={16} />
                </Link>
              </div>
              {sc.products.length ? (
                <div className="products-grid">
                  {sc.products.map((p) => (
                    <ProductItem key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <p className="scenario-empty">
                  Aktuell keine Geräte im Shop – wir stellen Ihnen gern ein passendes
                  Angebot zusammen. <Link to="/pages/kontakt">Anfrage senden →</Link>
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container solution-cta">
          <div>
            <h2>Fertig eingerichtet geliefert</h2>
            <p>
              Mit unserem Einrichtungsservice kommt Ihr Gerät startklar an: Windows-Updates,
              Benutzer und Grundsoftware sind vorbereitet. Für mehrere Arbeitsplätze erstellen
              Sie im Warenkorb mit einem Klick ein PDF-Angebot.
            </p>
          </div>
          <div className="feature-actions">
            <Link to="/products/einrichtungsservice" className="btn btn-primary">
              Einrichtungsservice
            </Link>
            <a href="https://systemhaus-verl.de/ITService" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              IT-Service vom Systemhaus
            </a>
          </div>
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

      {related.length ? (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Das könnte Sie auch interessieren</h2>
            <SolutionTiles items={related} />
          </div>
        </section>
      ) : null}
    </div>
  );
}

const SOLUTION_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query SolutionProducts(
    $query: String!
    $first: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(query: $query, first: $first, sortKey: CREATED_AT, reverse: true) {
      nodes {
        ...ProductItem
      }
    }
  }
` as const;
