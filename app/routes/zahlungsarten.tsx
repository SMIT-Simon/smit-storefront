import {Link} from 'react-router';
import type {Route} from './+types/zahlungsarten';
import {Icon} from '~/components/Icon';
import {PAYMENT_ICONS, PAYMENT_METHODS, paymentIconSrc} from '~/lib/payment';
import {PaymentIconRow} from '~/components/PaymentIcons';
import {SITE_URL} from '~/lib/seo';
import {COMPANY} from '~/lib/company';

const TITLE = 'Zahlungsarten: PayPal, Kreditkarte, Klarna, Apple Pay & Kauf auf Rechnung | terra-computershop.de';
const DESCRIPTION =
  'So bezahlen Sie bei terra-computershop.de: PayPal, Visa, Mastercard, American Express, Klarna, Apple Pay, Google Pay und Shop Pay. Für Firmen, Schulen und Behörden Kauf auf Rechnung nach Prüfung.';

const FAQ = [
  {
    q: 'Welche Zahlungsarten gibt es bei terra-computershop.de?',
    a: 'Sie können mit PayPal, Kreditkarte (Visa, Mastercard, Maestro, American Express, UnionPay), Klarna, Apple Pay, Google Pay und Shop Pay bezahlen. Geschäftskunden, Schulen und Behörden können nach Prüfung auf Rechnung kaufen.',
  },
  {
    q: 'Kann ich auf Rechnung kaufen?',
    a: 'Ja – für Unternehmen, Schulen und öffentliche Einrichtungen nach kurzer Prüfung. Fordern Sie dazu ein Angebot an oder schreiben Sie uns; wir liefern dann auf Rechnung. Privatkunden können über Klarna oder PayPal später bezahlen, sofern der jeweilige Anbieter dies anbietet.',
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
  {title: TITLE},
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
        Für Firmen, Schulen und Behörden ist außerdem Kauf auf Rechnung möglich.
      </p>
      <PaymentIconRow />

      <div className="payment-grid">
        {PAYMENT_METHODS.map((m) => (
          <section key={m.title} className="payment-card">
            <div className="payment-card-icons">
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

        <section className="payment-card payment-card-invoice">
          <div className="payment-card-icons">
            <span className="payment-invoice-icon">
              <Icon name="invoice" size={26} />
            </span>
          </div>
          <h2>Kauf auf Rechnung für Geschäftskunden</h2>
          <p>
            Unternehmen, Schulen und öffentliche Einrichtungen können nach kurzer Prüfung auf Rechnung bestellen.
            Fordern Sie einfach ein Angebot an oder schreiben Sie uns – wir melden uns schnell zurück.
          </p>
          <ul className="check-list">
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
              Rechnungskauf anfragen
            </Link>
            <a href={`mailto:${COMPANY.email}?subject=${encodeURIComponent('Kauf auf Rechnung')}`} className="btn btn-secondary">
              E-Mail schreiben
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
