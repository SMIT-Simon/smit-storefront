import {Link} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {CATEGORIES} from '~/lib/categories';
import {Icon} from '~/components/Icon';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

const POLICY_LINKS = [
  {title: 'Impressum', to: '/policies/legal-notice'},
  {title: 'Datenschutz', to: '/policies/privacy-policy'},
  {title: 'AGB', to: '/policies/terms-of-service'},
  {title: 'Widerrufsrecht', to: '/policies/refund-policy'},
  {title: 'Versand & Zahlung', to: '/policies/shipping-policy'},
];

export function Footer({header}: FooterProps) {
  const year = new Date().getFullYear();
  const shopName = header?.shop?.name ?? '';

  return (
    <footer className="site-footer">
      <div className="footer-trust">
        <div className="container footer-trust-inner">
          <TrustItem icon="shield" title="Herstellergarantie">
            Original TERRA-Geräte mit WORTMANN-Garantie
          </TrustItem>
          <TrustItem icon="invoice" title="Kauf auf Rechnung">
            Für Geschäftskunden nach Prüfung möglich
          </TrustItem>
          <TrustItem icon="headset" title="Persönliche Beratung">
            Wir helfen bei Auswahl und Konfiguration
          </TrustItem>
          <TrustItem icon="truck" title="Versand aus Deutschland">
            Schnelle Lieferung direkt ab Lager
          </TrustItem>
        </div>
      </div>

      <div className="container footer-columns">
        <div className="footer-col footer-about">
          <div className="footer-logo">{shopName}</div>
          <p>
            Ihr Fachhändler für TERRA Notebooks, PCs, Server und Zubehör von
            WORTMANN – für Unternehmen, Behörden, Schulen und Privatkunden.
          </p>
        </div>

        <nav className="footer-col" aria-label="Sortiment">
          <h3>Sortiment</h3>
          <ul>
            {CATEGORIES.map((c) => (
              <li key={c.handle}>
                <Link prefetch="intent" to={`/collections/${c.handle}`}>
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="footer-col" aria-label="Service">
          <h3>Service</h3>
          <ul>
            <li>
              <Link to="/account">Kundenkonto</Link>
            </li>
            <li>
              <Link to="/pages/kontakt">Kontakt &amp; Angebotsanfrage</Link>
            </li>
            <li>
              <Link to="/search">Produktsuche</Link>
            </li>
          </ul>
        </nav>

        <nav className="footer-col" aria-label="Rechtliches">
          <h3>Rechtliches</h3>
          <ul>
            {POLICY_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>{l.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>
            © {year} {shopName}
          </span>
          <span>
            Alle Preise inkl. gesetzl. MwSt., zzgl. Versandkosten. TERRA ist
            eine Marke der WORTMANN AG.
          </span>
        </div>
      </div>
    </footer>
  );
}

function TrustItem({
  icon,
  title,
  children,
}: {
  icon: 'shield' | 'invoice' | 'headset' | 'truck';
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="trust-item">
      <span className="trust-icon">
        <Icon name={icon} size={26} />
      </span>
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </div>
  );
}
