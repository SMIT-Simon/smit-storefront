import {Link} from 'react-router';
import type {Route} from './+types/zahlungsarten';
import {Icon} from '~/components/Icon';
import {PAYMENT_ICONS, PAYMENT_METHODS, paymentIconSrc} from '~/lib/payment';
import {PaymentIconRow} from '~/components/PaymentIcons';
import {SITE_URL, pageTitle} from '~/lib/seo';
import {COMPANY} from '~/lib/company';

const TITLE = 'Zahlungsarten – PayPal, Klarna, Rechnung & Leasing';
const DESCRIPTION =
  'So bezahlen Sie bei terra-computershop.de: PayPal, Visa, Mastercard, American Express, Klarna, Apple Pay, Google Pay und Shop Pay, Vorkasse per Überweisung. Später bezahlen und Rechnungskauf über PayPal oder Klarna, für Firmen Rechnung, Bankeinzug und Leasing.';

const FAQ = [
  {
    q: 'Welche Zahlungsarten gibt es bei terra-computershop.de?',
    a: 'Sie können mit PayPal (auch Rechnungskauf, Bezahlung nach 30 Tagen oder Ratenzahlung), Kreditkarte (Visa, Mastercard, Maestro, American Express, UnionPay), Klarna, Apple Pay, Google Pay und Shop Pay bezahlen oder per Vorkasse überweisen. Geschäftskunden, Schulen und Behörden können nach Prüfung direkt bei uns auf Rechnung oder per Bankeinzug kaufen; für Firmen ist auch Leasing auf Anfrage möglich.',
  },
  {
    q: 'Kann ich auf Rechnung kaufen?',
    a: 'Ja – für Unternehmen, Schulen und öffentliche Einrichtungen nach kurzer Prüfung. Fordern Sie dazu ein Angebot an oder schreiben Sie uns; wir liefern dann auf Rechnung. Alle Kunden können außerdem im Checkout über PayPal oder Klarna auf Rechnung bzw. später bezahlen – nach Prüfung durch den jeweiligen Anbieter.',
  },
  {
    q: 'Kann ich per Vorkasse überweisen?',
    a: 'Ja. Wählen Sie im Checkout „Banküberweisung“. Nach der Bestellung erhalten Sie unsere Bankverbindung; sobald der Betrag eingegangen ist, versenden wir Ihre Bestellung.',
  },
  {
    q: 'Ist Bankeinzug (SEPA-Lastschrift) möglich?',
    a: 'Ja, für Firmenkunden nach kurzer Prüfung. Sprechen Sie uns dazu einfach an.',
  },
  {
    q: 'Kann ich TERRA Hardware leasen?',
    a: 'Ja, für Firmenkunden bieten wir Leasing auf Anfrage an – für einzelne Geräte, ganze Arbeitsplätze oder Server. Sie zahlen eine feste monatliche Rate. Sprechen Sie uns an, wir erstellen Ihnen ein Angebot.',
  },
  {
    q: 'Wann wird mein Konto belastet?',
    a: 'Bei PayPal, Kreditkarte, Apple Pay, Google Pay und Shop Pay wird die Zahlung mit Abschluss der Bestellung ausgelöst. Bei Klarna gelten die Bedingungen der gewählten Klarna-Option.',
  },
  {
    q: 'Ist die Zahlung sicher?',
    a: 'Ja. Der Bezahlvorgang läuft über den verschlüsselten Shopify-Checkout. Kartendaten werden von den Zahlungsanbietern verarbeitet und nicht bei uns gespeichert.',
  },
];

export const meta: Route.MetaFunction = () => [
  {title: pageTitle(TITLE)},
  {name: 'description', content: DESCRIPTION},
  {property: 'og:title', content: 'Zahlungsarten bei terra-computershop.de'},
  {property: 'og:description', content: DESCRIPTION},
];

export default function Zahlungsarten() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {'@type': 'ListItem', position: 1, name: 'Startseite', item: `${SITE_URL}/`},
          {'@type': 'ListItem', position: 2, name: 'Zahlungsarten', item: `${SITE_URL}/zahlungsarten`},
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
    <div className="container page-narrow payment-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
      <nav className="breadcrumb" aria-label="Brotkrümel">
        <Link to="/">Startseite</Link>
        <span aria-hidden>›</span>
        <span>Zahlungsarten</span>
      </nav>

      <h1 className="page-title">Zahlungsarten</h1>
      <p className="ratgeber-lead">
        Bezahlen Sie so, wie es für Sie am einfachsten ist – sicher und verschlüsselt über den Shopify-Checkout.
        Für Firmen, Schulen und Behörden ist außerdem Kauf auf Rechnung und Leasing möglich.
      </p>
      <PaymentIconRow />

      <div className="payment-grid">
        {PAYMENT_METHODS.map((m) => (
          <section key={m.title} className="payment-card">
            <div className="payment-card-icons">
              {m.icons.length === 0 ? (
                <span className="payment-invoice-icon">
                  <Icon name="invoice" size={26} />
                </span>
              ) : null}
              {m.icons.map((i) => {
                const icon = PAYMENT_ICONS.find((p) => p.file === i);
                return (
                  <img key={i} src={paymentIconSrc(i)} alt={icon?.label ?? i} width={57} height={36} loading="lazy" />
                );
              })}
            </div>
            <h2>{m.title}</h2>
            <p>{m.text}</p>
            <ul className="check-list">
              {m.points.map((p) => (
                <li key={p}>
                  <Icon name="check" size={18} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

      </div>

      <h2 className="payment-section-title">Für Firmenkunden, Schulen und Behörden</h2>
      <div className="payment-grid">
        <section className="payment-card payment-card-invoice">
          <div className="payment-card-icons">
            <span className="payment-invoice-icon">
              <Icon name="invoice" size={26} />
            </span>
          </div>
          <h2>Rechnung &amp; Bankeinzug für Geschäftskunden</h2>
          <p>
            Unternehmen, Schulen und öffentliche Einrichtungen können nach kurzer Prüfung direkt bei uns auf
            Rechnung bestellen – auf Wunsch auch bequem per SEPA-Lastschrift (Bankeinzug). Fordern Sie einfach ein
            Angebot an oder schreiben Sie uns.
          </p>
          <ul className="check-list">
            <li>
              <Icon name="check" size={18} />
              <span>Bankeinzug per SEPA-Lastschrift nur für Firmenkunden</span>
            </li>
            <li>
              <Icon name="check" size={18} />
              <span>PDF-Angebot direkt aus dem Warenkorb erstellen</span>
            </li>
            <li>
              <Icon name="check" size={18} />
              <span>Ideal für Ausschreibungen, Beschaffungen und größere Mengen</span>
            </li>
          </ul>
          <div className="feature-actions">
            <Link to="/pages/kontakt" className="btn btn-primary">
              Rechnungskauf / Bankeinzug anfragen
            </Link>
          </div>
        </section>

        <section className="payment-card payment-card-invoice">
          <div className="payment-card-icons">
            <span className="payment-invoice-icon">
              <Icon name="desktop" size={26} />
            </span>
          </div>
          <h2>Leasing für Firmenkunden</h2>
          <p>
            Hardware leasen statt kaufen: Sie zahlen eine feste monatliche Rate und schonen Ihre Liquidität –
            für einzelne Geräte, komplette Arbeitsplätze oder Server.
          </p>
          <ul className="check-list">
            <li>
              <Icon name="check" size={18} />
              <span>Feste Monatsrate, gut planbar</span>
            </li>
            <li>
              <Icon name="check" size={18} />
              <span>Auf Anfrage – wir erstellen Ihnen ein individuelles Angebot</span>
            </li>
          </ul>
          <div className="feature-actions">
            <a
              href={`mailto:${COMPANY.email}?subject=${encodeURIComponent('Leasing-Anfrage')}`}
              className="btn btn-primary"
            >
              Leasing anfragen
            </a>
          </div>
        </section>
      </div>

      <div className="payment-secure">
        <Icon name="shield" size={22} />
        <span>
          <strong>Sicher bezahlen:</strong> Alle Zahlungen laufen verschlüsselt über den Shopify-Checkout. Ihre
          Karten- und Kontodaten verarbeiten ausschließlich die Zahlungsanbieter.
        </span>
      </div>

      <h2>Häufige Fragen zur Zahlung</h2>
      <div className="ratgeber-faq">
        {FAQ.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>

      <p className="payment-more">
        Weitere Informationen: <Link to="/policies/shipping-policy">Versand</Link> ·{' '}
        <Link to="/policies/refund-policy">Widerrufsrecht</Link> ·{' '}
        <Link to="/policies/terms-of-service">AGB</Link>
      </p>
    </div>
  );
}
