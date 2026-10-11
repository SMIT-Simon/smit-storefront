import {Link} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {CATEGORIES} from '~/lib/categories';
import {Icon} from '~/components/Icon';
import {GuaranteeModalLink} from '~/components/LegalGuaranteeNotice';
import {siteImg} from '~/lib/site-images';

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
  {title: 'Versand', to: '/policies/shipping-policy'},
];

export function Footer({header}: FooterProps) {
  const year = new Date().getFullYear();
  const shopName = header?.shop?.name ?? '';

  return (
    <footer className="site-footer">
      <div className="footer-trust">
        <div className="container footer-trust-inner">
          <TrustItem icon="shield" title="Originalware">
            Original TERRA-Geräte von WORTMANN
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
          <img
            {...siteImg('/images/logo-smit-white.webp', '200px')}
            alt={shopName}
            width={200}
            height={64}
            className="footer-logo-img"
            loading="lazy"
          />
          <p>
            <strong>terra-computershop.de</strong> – Ihr Fachhändler für TERRA Notebooks, PCs, Server und Zubehör von
            WORTMANN – für Unternehmen, Behörden, Schulen und Privatkunden.
          </p>
          <address className="footer-contact">
            SMIT Digital Services · Inhaber Simon Manigel
            <br />
            Schlangenweg 73 · 33415 Verl
            <br />
            <a href="tel:+4952469098980">+49 (0)5246-9098980</a>
            <br />
            <a href="mailto:info@wawi-servicepartner.de">info@wawi-servicepartner.de</a>
          </address>
          <a
            href="https://systemhaus-verl.de/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-systemhaus"
          >
            IT-Service vom Systemhaus Verl →
          </a>
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
            <li>
              <Link prefetch="intent" to="/collections/all">
                Alle Produkte
              </Link>
            </li>
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
              <Link to="/loesungen">Branchen &amp; Lösungen</Link>
            </li>
            <li>
              <Link to="/flyer">Business-Flyer</Link>
            </li>
            <li>
              <Link to="/search">Produktsuche</Link>
            </li>
            <li>
              <Link to="/sitemap">Sitemap</Link>
            </li>
            <li>
              <a href="https://systemhaus-verl.de/ITService" target="_blank" rel="noopener noreferrer">
                IT-Service &amp; Einrichtung
              </a>
            </li>
            <li>
              <a href="https://systemhaus-verl.de/Wartungsvertraege" target="_blank" rel="noopener noreferrer">
                Wartungsverträge
              </a>
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

      <div className="container footer-guarantee">
        <GuaranteeModalLink className="footer-guarantee-link">
          <img src="/images/eu-gewaehrleistung-de.jpg" alt="" width={66} height={90} loading="lazy" />
          <span>
            <strong>Gesetzliche Gewährleistung: mindestens 2 Jahre</strong>
            <small>EU-Hinweis zur Gewährleistung ansehen →</small>
          </span>
        </GuaranteeModalLink>
      </div>

      <div className="container footer-widerruf">
        <span>Sie möchten einen Kauf widerrufen? Online und ohne Kundenkonto:</span>
        <Link to="/widerruf" className="btn-widerruf-footer" prefetch="intent">
          Vertrag widerrufen
        </Link>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>
            © {year} terra-computershop.de · ein Angebot von SMIT Digital Services
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
