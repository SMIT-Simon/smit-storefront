import {Link} from 'react-router';
import type {Route} from './+types/gewaehrleistung';
import {EU_NOTICE_SRC} from '~/components/LegalGuaranteeNotice';

export const meta: Route.MetaFunction = () => [
  {title: 'Gesetzliche Gewährleistung – EU-Hinweis'},
  {property: 'og:title', content: 'Gesetzliche Gewährleistung (EU-Hinweis)'},
  {
    name: 'description',
    content: 'Harmonisierter EU-Hinweis zur gesetzlichen Gewährleistung: mindestens zwei Jahre für Waren, die in der EU verkauft werden.',
  },
];

export default function Gewaehrleistung() {
  return (
    <div className="container page-narrow policy">
      <nav className="breadcrumb" aria-label="Brotkrumen">
        <Link to="/">Startseite</Link>
        <span aria-hidden="true">/</span>
        <span>Gesetzliche Gewährleistung</span>
      </nav>
      <h1 className="page-title">Gesetzliche Gewährleistung</h1>
      <p>
        Für alle Waren in unserem Shop gilt die gesetzliche Gewährleistung von mindestens zwei Jahren.
        Ein bei einzelnen Geräten inklusiver Herstellerservice besteht zusätzlich und schränkt diese
        Rechte nicht ein – Details auf der jeweiligen Produktseite unter „Service &amp;
        Gewährleistung“. Im Gewährleistungsfall wenden
        Sie sich bitte an uns: <a href="mailto:info@wawi-servicepartner.de">info@wawi-servicepartner.de</a>{' '}
        · <a href="tel:+4952469098980">+49 (0)5246-9098980</a>.
      </p>
      <img
        className="eu-notice-full"
        src={EU_NOTICE_SRC}
        alt="EU-Hinweis zur gesetzlichen Gewährleistung: Mindestens zwei Jahre gesetzliche Gewährleistung der Vertragsmäßigkeit für Waren, die in der Europäischen Union verkauft werden. Verbraucher können ihre Rechte geltend machen, wenn Waren nicht der Beschreibung entsprechen oder nicht bestimmungsgemäß funktionieren. Verkäufer müssen kostenlose Nachbesserung oder Ersatzlieferung, in bestimmten Fällen Preisminderung oder Erstattung anbieten. Weitere Informationen: europa.eu/youreurope/garantien"
        width={880}
        height={1199}
      />
      <p>
        Weitere Informationen:{' '}
        <a href="https://europa.eu/youreurope/garantien" target="_blank" rel="noopener noreferrer">
          europa.eu/youreurope/garantien
        </a>
      </p>
    </div>
  );
}
