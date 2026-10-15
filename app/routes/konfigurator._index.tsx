import {Link} from 'react-router';
import type {Route} from './+types/konfigurator._index';
import {Icon} from '~/components/Icon';
import {CONFIG_MODELS, defaultSelection, priceOf, type ConfigModel} from '~/lib/configurator';
import {SITE_URL, pageTitle} from '~/lib/seo';
import {siteImg} from '~/lib/site-images';

const TITLE = 'PC-Konfigurator – TERRA PC & Gaming PC nach Wunsch';
const DESCRIPTION =
  'TERRA PCs individuell konfigurieren: Business-PC TERRA PC-BUSINESS 6000 und Gaming PCs GAMER ELITE 1, 2 und 4. Prozessor, Grafikkarte, RAM, SSD, Windows und Service frei wählen – gebaut von WORTMANN.';

export const meta: Route.MetaFunction = () => [
  {title: pageTitle(TITLE)},
  {name: 'description', content: DESCRIPTION},
  {property: 'og:title', content: 'PC-Konfigurator für TERRA PCs'},
  {property: 'og:description', content: DESCRIPTION},
];

const eur = (n: number) => n.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'});
const fromGross = (m: ConfigModel) => priceOf(m, defaultSelection(m), 'bring-in').total * 1.19;

export default function KonfiguratorIndex() {
  const business = CONFIG_MODELS.filter((m) => m.theme !== 'gaming');
  const gaming = CONFIG_MODELS.filter((m) => m.theme === 'gaming');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {'@type': 'ListItem', position: 1, name: 'Startseite', item: `${SITE_URL}/`},
          {'@type': 'ListItem', position: 2, name: 'PC-Konfigurator', item: `${SITE_URL}/konfigurator`},
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Konfigurierbare TERRA PCs',
        itemListElement: CONFIG_MODELS.map((m, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/konfigurator/${m.slug}`,
          name: m.name,
        })),
      },
    ],
  };

  return (
    <div className="cfg-index">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
      <div className="container">
        <nav className="breadcrumb" aria-label="Brotkrümel">
          <Link to="/">Startseite</Link>
          <span aria-hidden>›</span>
          <span>PC-Konfigurator</span>
        </nav>
        <header className="cfg-index-head">
          <span className="eyebrow">Bauen nach Auftrag · WORTMANN Hüllhorst</span>
          <h1>PC-Konfigurator: Ihr TERRA PC nach Wunsch</h1>
          <p>
            Wählen Sie ein Modell und stellen Sie Prozessor, Arbeitsspeicher, SSD, Grafik, Windows und Service selbst
            zusammen. WORTMANN fertigt Ihren PC nach Auftrag in Deutschland – wir liefern ihn auf Wunsch fertig
            eingerichtet.
          </p>
        </header>

        <section className="cfg-index-section">
          <h2>Business-PC</h2>
          <div className="cfg-index-grid">
            {business.map((m) => (
              <Link key={m.slug} to={`/konfigurator/${m.slug}`} className="cfg-index-card" prefetch="intent">
                {m.image ? (
                  <img {...siteImg(m.image, '(min-width: 64em) 380px, 100vw')} alt="" loading="lazy" />
                ) : null}
                <span className="cfg-index-badge">Angebot innerhalb von 1 Werktag</span>
                <strong>{m.name}</strong>
                <span>{m.standard.slice(0, 2).join(' · ')}</span>
                <span className="cfg-index-price">Richtpreis ab {eur(fromGross(m))}</span>
                <span className="link-arrow">
                  Jetzt konfigurieren <Icon name="chevron-right" size={16} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="cfg-index-section">
          <h2>Gaming PC</h2>
          <p className="cfg-index-lead">
            Direkt bestellbar und bezahlbar – Lieferzeit 2–3 Wochen. Mehr zu den Modellen auf der Seite{' '}
            <Link to="/themen/terra-gaming-pc">TERRA Gaming PC</Link>.
          </p>
          <div className="cfg-index-grid">
            {gaming.map((m) => (
              <Link
                key={m.slug}
                to={`/konfigurator/${m.slug}`}
                className="cfg-index-card cfg-index-card-gaming"
                prefetch="intent"
              >
                <span className="cfg-index-badge">Direkt bestellbar · {m.leadTime}</span>
                <strong>{m.name}</strong>
                <span>{m.standard.slice(0, 2).join(' · ')}</span>
                <span className="cfg-index-price">ab {eur(fromGross(m))}</span>
                <span className="link-arrow">
                  Jetzt konfigurieren <Icon name="chevron-right" size={16} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
