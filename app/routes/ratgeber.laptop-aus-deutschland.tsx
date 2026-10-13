import {Link} from 'react-router';
import type {Route} from './+types/ratgeber.laptop-aus-deutschland';
import {SITE_URL} from '~/lib/seo';

const TITLE = 'Laptop aus Deutschland: TERRA Notebooks vom deutschen Hersteller WORTMANN';
const DESCRIPTION =
  'Deutsche Laptop-Hersteller gesucht? TERRA Laptops (TERRA MOBILE) kommen von der WORTMANN AG aus Hüllhorst – mit Service und Support in Deutschland. Größen, Modelle und Tipps.';

const FAQ = [
  {
    q: 'Gibt es deutsche Laptop-Hersteller?',
    a: 'Ja. Die WORTMANN AG aus Hüllhorst in Ostwestfalen entwickelt und vertreibt seit 1986 Computer unter der Marke TERRA – darunter die Notebook-Serie TERRA MOBILE, Desktop-PCs, Monitore und Server.',
  },
  {
    q: 'Wer stellt TERRA Laptops her?',
    a: 'TERRA ist die Eigenmarke der WORTMANN AG, Bredenhop 20, 32609 Hüllhorst. Service, Support und die Abwicklung im Servicefall laufen über WORTMANN in Deutschland.',
  },
  {
    q: 'Gibt es TERRA Laptops mit 15 Zoll?',
    a: 'Ja. TERRA MOBILE Notebooks gibt es mit 14 Zoll, 15,6 bzw. 16 Zoll und 17,3 Zoll – vom günstigen Business-Notebook bis zum Copilot+ PC mit KI-Prozessor.',
  },
  {
    q: 'Welcher Service ist bei TERRA Notebooks dabei?',
    a: 'TERRA Notebooks enthalten 24 Monate Bring-In-Service der WORTMANN AG (Akku 6 Monate). Die gesetzliche Gewährleistung besteht unabhängig davon.',
  },
];

export const meta: Route.MetaFunction = () => [
  {title: `${TITLE} | terra-computershop.de`},
  {name: 'description', content: DESCRIPTION},
  {property: 'og:title', content: TITLE},
  {property: 'og:description', content: DESCRIPTION},
  {
    'script:ld+json': {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {'@type': 'Answer', text: f.a},
      })),
    },
  },
  {
    'script:ld+json': {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {'@type': 'ListItem', position: 1, name: 'Startseite', item: `${SITE_URL}/`},
        {'@type': 'ListItem', position: 2, name: 'Laptop aus Deutschland', item: `${SITE_URL}/ratgeber/laptop-aus-deutschland`},
      ],
    },
  },
];

const SIZES = [
  {label: 'bis 14 Zoll', text: 'leicht und kompakt für unterwegs', to: '/collections/notebooks?f=nb-14'},
  {label: '15,6 – 16 Zoll', text: 'der Allrounder fürs Büro und Homeoffice', to: '/collections/notebooks?f=nb-16'},
  {label: '17,3 Zoll', text: 'großes Display, voller Ziffernblock', to: '/collections/notebooks?f=nb-17'},
];

export default function LaptopAusDeutschland() {
  return (
    <div className="container page-narrow ratgeber">
      <nav className="breadcrumb" aria-label="Brotkrumen">
        <Link to="/">Startseite</Link>
        <span aria-hidden="true">/</span>
        <span>Laptop aus Deutschland</span>
      </nav>

      <h1 className="page-title">Laptop aus Deutschland: TERRA Notebooks von WORTMANN</h1>
      <p className="ratgeber-lead">
        Wer einen Laptop von einem deutschen Hersteller sucht, landet schnell bei <strong>TERRA</strong>. Die
        Marke gehört zur <strong>WORTMANN AG aus Hüllhorst</strong> in Ostwestfalen, die seit 1986 Computer
        entwickelt und vertreibt. Unter dem Namen <strong>TERRA MOBILE</strong> gibt es Business-Laptops,
        Convertibles und Copilot+ PCs, dazu TERRA PCs, Mini-PCs, Monitore und Server.
      </p>

      <h2>Warum ein Laptop von einem deutschen Hersteller?</h2>
      <ul className="check-list">
        <li>
          <strong>Ansprechpartner in Deutschland:</strong> Service, Support und die Abwicklung im Servicefall
          laufen über WORTMANN in Hüllhorst – auf Deutsch und ohne lange Versandwege ins Ausland.
        </li>
        <li>
          <strong>Für den Business-Einsatz gebaut:</strong> Windows 11 Pro, solide Gehäuse, viele Anschlüsse
          und passende Dockingstations.
        </li>
        <li>
          <strong>24 Monate Bring-In-Service inklusive</strong> (Akku 6 Monate), optional erweiterbar.
        </li>
        <li>
          <strong>Beratung und Einrichtung</strong> durch unser Systemhaus in Verl – ebenfalls aus Ostwestfalen.
        </li>
      </ul>

      <h2>TERRA Laptop in 14, 15 oder 17 Zoll?</h2>
      <div className="ratgeber-sizes">
        {SIZES.map((s) => (
          <Link key={s.label} to={s.to} className="ratgeber-size" prefetch="intent">
            <strong>{s.label}</strong>
            <span>{s.text}</span>
            <span className="link-arrow">Modelle ansehen →</span>
          </Link>
        ))}
      </div>

      <h2>Die TERRA-Familie im Überblick</h2>
      <ul className="ratgeber-links">
        <li>
          <Link to="/collections/notebooks">TERRA Laptops &amp; Notebooks (TERRA MOBILE)</Link>
        </li>
        <li>
          <Link to="/collections/notebooks?sub=copilot-pc">TERRA Copilot+ PCs mit KI-Prozessor</Link>
        </li>
        <li>
          <Link to="/collections/desktop-pcs">TERRA PCs – Business-PC bis Workstation</Link>
        </li>
        <li>
          <Link to="/collections/desktop-pcs?sub=mini-micro">TERRA Mini-PCs</Link>
        </li>
        <li>
          <Link to="/collections/tablets">TERRA PAD Tablets</Link>
        </li>
        <li>
          <Link to="/collections/zubehoer?sub=eingabegeraete">TERRA Tastaturen &amp; Mäuse</Link>
        </li>
      </ul>

      <h2>Häufige Fragen</h2>
      <div className="ratgeber-faq">
        {FAQ.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>

      <div className="ratgeber-cta">
        <p>Sie sind unsicher, welcher TERRA Laptop passt? Wir beraten Sie gern und erstellen ein Angebot.</p>
        <Link to="/pages/kontakt" className="btn btn-primary">
          Beratung anfragen
        </Link>
      </div>
    </div>
  );
}
