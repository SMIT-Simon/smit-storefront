import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/themen.$slug';
import {formatPrice} from '~/components/Price';
import {ProductItem} from '~/components/ProductItem';
import {Icon} from '~/components/Icon';
import {PriceModeNote} from '~/components/PriceMode';
import {PRODUCT_ITEM_FRAGMENT} from '~/lib/product-item-fragment';
import {findLanding, monitorSpecs} from '~/lib/landings';
import {isListable} from '~/lib/addons';
import {SITE_URL, pageTitle} from '~/lib/seo';

export const meta: Route.MetaFunction = ({data}) => {
  const l = data?.landing;
  if (!l) return [{title: 'Nicht gefunden'}];
  return [
    {title: pageTitle(l.metaTitle)},
    {name: 'description', content: l.metaDescription},
    {property: 'og:title', content: l.h1},
    {property: 'og:description', content: l.metaDescription},
    ...(data?.hero?.featuredImage
      ? [{property: 'og:image', content: `${data.hero.featuredImage.url}&width=1200`}]
      : []),
  ];
};

export async function loader({params, context}: Route.LoaderArgs) {
  const landing = findLanding(params.slug);
  if (!landing) throw new Response('Not found', {status: 404});
  const res = await context.storefront
    .query(LANDING_PRODUCTS_QUERY, {
      variables: {query: landing.productQuery, first: landing.picks ? 100 : 30},
      cache: context.storefront.CacheShort(),
    })
    .catch(() => null);
  const all = (res?.products.nodes ?? []).filter(isListable);
  const products = landing.picks
    ? landing.picks
        .map((h) => all.find((p) => p.handle === h))
        .filter((p): p is (typeof all)[number] => Boolean(p))
    : all.sort(
        (a, b) =>
          Number(a.priceRange.minVariantPrice.amount) -
          Number(b.priceRange.minVariantPrice.amount),
      );
  const hero = landing.hero
    ? (products.find((p) => p.handle === landing.hero?.handle) ?? null)
    : null;
  return {landing, products, hero};
}

export default function LandingPage() {
  const {landing: l, products, hero} = useLoaderData<typeof loader>();
  const url = `${SITE_URL}/themen/${l.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Startseite',
            item: `${SITE_URL}/`,
          },
          {'@type': 'ListItem', position: 2, name: l.h1, item: url},
        ],
      },
      {
        '@type': 'ItemList',
        name: l.h1,
        itemListElement: products.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/products/${p.handle}`,
          name: p.title,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: l.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {'@type': 'Answer', text: f.a},
        })),
      },
    ],
  };

  return (
    <div className="landing-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
      <div className="container">
        <nav className="breadcrumb" aria-label="Brotkrümel">
          <Link to="/">Startseite</Link>
          <span aria-hidden>›</span>
          <span>{l.h1}</span>
        </nav>
        <div className={hero ? 'landing-top' : undefined}>
          <header className="landing-head">
            <h1>{l.h1}</h1>
            {l.intro.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <div className="feature-actions">
              <a href="#modelle" className="btn btn-primary">
                {l.picks ? 'Beliebte Modelle ansehen' : `${products.length} Modelle ansehen`}{' '}
                <Icon name="arrow-right" size={18} />
              </a>
              <Link
                to={l.category.href}
                className="btn btn-secondary"
                prefetch="intent"
              >
                {l.category.label}
              </Link>
            </div>
          </header>
          {hero?.featuredImage ? (
            <figure className="landing-hero">
              <Link to={`/products/${hero.handle}`} prefetch="intent">
                <img
                  src={`${hero.featuredImage.url}${hero.featuredImage.url.includes('?') ? '&' : '?'}width=700`}
                  srcSet={[400, 560, 700, 900]
                    .map(
                      (w) =>
                        `${hero.featuredImage!.url}${hero.featuredImage!.url.includes('?') ? '&' : '?'}width=${w} ${w}w`,
                    )
                    .join(', ')}
                  sizes="(min-width: 64em) 460px, 90vw"
                  alt={hero.featuredImage.altText || hero.title}
                  width={700}
                  height={700}
                  loading="eager"
                  fetchPriority="high"
                />
              </Link>
              <figcaption>
                <Link to={`/products/${hero.handle}`} prefetch="intent">
                  {l.hero?.caption}
                </Link>
                <span className="landing-hero-price">
                  {formatPrice(hero.priceRange.minVariantPrice)}
                </span>
              </figcaption>
            </figure>
          ) : null}
        </div>
      </div>

      {l.compare === 'monitor' && products.length ? (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2>Alle Modelle im Vergleich</h2>
              <PriceModeNote />
            </div>
            <div className="cloud-table-wrap">
              <table className="cloud-table landing-table">
                <thead>
                  <tr>
                    <th>Modell</th>
                    <th>Auflösung</th>
                    <th>Standfuß</th>
                    <th>Anschluss</th>
                    <th>Bildrate</th>
                    <th>Preis (brutto)</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const s = monitorSpecs(p.tags);
                    return (
                      <tr key={p.id}>
                        <th>
                          <Link to={`/products/${p.handle}`} prefetch="intent">
                            {p.title
                              .replace(/ IPS black.*$/i, '')
                              .replace(/^TERRA LCD\/LED /, 'TERRA ')}
                          </Link>
                        </th>
                        <td>{s.resolution}</td>
                        <td>{s.stand}</td>
                        <td>{s.usbc}</td>
                        <td>{s.hz}</td>
                        <td className="landing-price">
                          {formatPrice(p.priceRange.minVariantPrice)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}

      {l.series?.length ? (
        <section className="section">
          <div className="container">
            <h2 className="section-title">{l.seriesTitle ?? 'Baureihen'}</h2>
            <div className="landing-series">
              {l.series.map((s) => (
                <Link key={s.href} to={s.href} className="landing-series-card" prefetch="intent">
                  <strong>{s.title}</strong>
                  <span>{s.text}</span>
                  <span className="link-arrow">
                    Modelle ansehen <Icon name="chevron-right" size={16} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section section-muted" id="modelle">
        <div className="container">
          <div className="section-head">
            <h2>{l.productsTitle ?? `${l.keyword} – direkt bestellen`}</h2>
            <Link to={l.category.href} className="link-arrow" prefetch="intent">
              Mit Filtern ansehen <Icon name="chevron-right" size={16} />
            </Link>
          </div>
          <div className="products-grid">
            {products.map((p) => (
              <ProductItem key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {l.story ? (
        <section className="section">
          <div className="container landing-story">
            <div>
              <h2>{l.story.title}</h2>
              {l.story.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
              {l.story.source ? <small className="landing-story-source">{l.story.source}</small> : null}
            </div>
            <ol className="landing-timeline">
              {l.story.milestones.map((m) => (
                <li key={m.year}>
                  <strong>{m.year}</strong>
                  <span>{m.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container">
          <h2 className="section-title">{l.guideTitle ?? 'Worauf Sie beim Kauf achten sollten'}</h2>
          <div className="needs-grid cloud-features">
            {l.guide.map((g, i) => (
              <div key={g.title} className="need-card">
                <span className="need-num">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <strong>{g.title}</strong>
                <p>{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="faq">
            <h2 className="section-title">Häufige Fragen</h2>
            {l.faq.map((f) => (
              <details key={f.q} className="faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <div className="solution-chips landing-related">
            <span>Auch interessant:</span>
            {l.related.map((r) => (
              <Link
                key={r.href}
                to={r.href}
                className="sub-chip"
                prefetch="intent"
              >
                {r.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const LANDING_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query LandingProducts(
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
