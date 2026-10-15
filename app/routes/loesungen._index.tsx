import {Link} from 'react-router';
import type {Route} from './+types/loesungen._index';
import {BRANCHEN, EINSATZBEREICHE} from '~/lib/solutions';
import {SolutionTiles} from '~/components/SolutionTiles';

export const meta: Route.MetaFunction = () => [
  {title: 'IT-Lösungen nach Branche und Einsatzbereich – TERRA Shop'},
  {property: 'og:title', content: 'IT-Lösungen nach Branche und Einsatzbereich'},
  {
    name: 'description',
    content:
      'PCs, Notebooks, Monitore und Server für Arztpraxen, Steuerberater, Kanzleien, Handwerk, Industrie, Lager, Empfang, Homeoffice und CAD – passend zusammengestellt.',
  },
];

export default function Solutions() {
  return (
    <div className="solutions-index">
      <div className="container">
        <nav className="breadcrumb" aria-label="Brotkrümel">
          <Link to="/">Startseite</Link>
          <span aria-hidden>›</span>
          <span>Branchen &amp; Lösungen</span>
        </nav>
        <header className="solutions-head">
          <span className="eyebrow">Branchen &amp; Lösungen</span>
          <h1>Die passende IT für Ihren Arbeitsalltag</h1>
          <p>
            Nicht jeder weiß, welcher Prozessor oder wie viel Arbeitsspeicher es sein muss –
            aber jeder weiß, wofür der Rechner gebraucht wird. Hier finden Sie TERRA-Hardware
            nach Branche und Einsatzbereich, mit Tipps, worauf es ankommt.
          </p>
        </header>

        <section className="section-tight" aria-labelledby="branchen">
          <h2 id="branchen" className="section-title">Nach Branche</h2>
          <SolutionTiles items={BRANCHEN} />
        </section>

        <section className="section-tight" aria-labelledby="einsatz">
          <h2 id="einsatz" className="section-title">Nach Einsatzbereich</h2>
          <SolutionTiles items={EINSATZBEREICHE} />
        </section>

        <section className="solution-cta solution-cta-boxed">
          <div>
            <h2>Ihre Branche ist nicht dabei?</h2>
            <p>
              Erzählen Sie uns, wofür Sie die Geräte brauchen – wir stellen Ihnen ein
              passendes Angebot zusammen, auf Wunsch inklusive Einrichtung.
            </p>
          </div>
          <div className="feature-actions">
            <Link to="/pages/kontakt" className="btn btn-primary">Beratung anfragen</Link>
            <a href="tel:+4952469098980" className="btn btn-secondary">05246 909 89 80</a>
          </div>
        </section>
      </div>
    </div>
  );
}
