import {Link} from 'react-router';
import type {Route} from './+types/sitemap._index';
import {CATEGORIES} from '~/lib/categories';
import {BRANCHEN, EINSATZBEREICHE} from '~/lib/solutions';
import {CONFIG_MODELS} from '~/lib/configurator';
import {CLOUD_SERVICES} from '~/lib/cloud';
import {RATGEBER} from '~/lib/ratgeber';

export const meta: Route.MetaFunction = () => [
  {title: 'Sitemap | terra-computershop.de'},
  {property: 'og:title', content: 'Sitemap – terra-computershop.de'},
  {name: 'description', content: 'Sitemap von terra-computershop.de: alle Kategorien (TERRA Notebooks, PCs, Monitore, Server, Zubehör), Branchenlösungen, Ratgeber, TERRA CLOUD und Service-Seiten auf einen Blick.'},
];

const INFO = [
  ...RATGEBER.map((r) => ({to: r.to, label: `Ratgeber: ${r.label}`})),
  {to: '/collections/all', label: 'Alle Produkte'},
  {to: '/flyer', label: 'Business-Flyer'},
  ...CONFIG_MODELS.map((m) => ({to: `/konfigurator/${m.slug}`, label: `PC-Konfigurator ${m.name}`})),
  {to: '/pages/kontakt', label: 'Kontakt & Angebotsanfrage'},
  {to: '/zahlungsarten', label: 'Zahlungsarten'},
  {to: '/search', label: 'Produktsuche'},
  {to: '/account', label: 'Kundenkonto'},
];

const LEGAL = [
  {to: '/policies/legal-notice', label: 'Impressum'},
  {to: '/policies/privacy-policy', label: 'Datenschutzerklärung'},
  {to: '/policies/terms-of-service', label: 'AGB'},
  {to: '/policies/refund-policy', label: 'Widerrufsrecht'},
  {to: '/widerruf', label: 'Vertrag widerrufen'},
  {to: '/policies/shipping-policy', label: 'Versand'},
  {to: '/gewaehrleistung', label: 'Gesetzliche Gewährleistung'},
];

export default function Sitemap() {
  return (
    <div className="container sitemap-page">
      <nav className="breadcrumb" aria-label="Brotkrumen">
        <Link to="/">Startseite</Link>
        <span aria-hidden="true">/</span>
        <span>Sitemap</span>
      </nav>
      <h1 className="page-title">Sitemap</h1>

      <div className="sitemap-grid">
        <section>
          <h2>Sortiment</h2>
          <ul>
            {CATEGORIES.map((c) => (
              <li key={c.handle}>
                <Link to={`/collections/${c.handle}`}>{c.title}</Link>
                {c.subs?.length ? (
                  <ul>
                    {c.subs.map((x) => (
                      <li key={x.slug}>
                        <Link to={`/collections/${c.handle}?sub=${x.slug}`}>{x.title}</Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Branchen</h2>
          <ul>
            {BRANCHEN.map((s) => (
              <li key={s.slug}>
                <Link to={`/loesungen/${s.slug}`}>{s.name}</Link>
              </li>
            ))}
          </ul>
          <h2>Einsatzbereiche</h2>
          <ul>
            {EINSATZBEREICHE.map((s) => (
              <li key={s.slug}>
                <Link to={`/loesungen/${s.slug}`}>{s.name}</Link>
              </li>
            ))}
            <li>
              <Link to="/loesungen">Alle Lösungen</Link>
            </li>
          </ul>
        </section>

        <section>
          <h2>TERRA CLOUD</h2>
          <ul>
            <li>
              <Link to="/cloud">TERRA CLOUD im Überblick</Link>
            </li>
            {CLOUD_SERVICES.map((c) => (
              <li key={c.slug}>
                <Link to={`/cloud/${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Service & Info</h2>
          <ul>
            {INFO.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
          <h2>Rechtliches</h2>
          <ul>
            {LEGAL.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
