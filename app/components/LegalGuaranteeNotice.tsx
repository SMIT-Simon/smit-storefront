import {Link} from 'react-router';

/**
 * EU-Gewährleistungslabel (harmonisierter Hinweis, Pflicht seit 27.09.2026).
 * Das Bild ist die unveränderte offizielle Datei der EU-Kommission (farbig).
 */
export const EU_NOTICE_SRC = '/images/eu-gewaehrleistung-de.jpg';

export function LegalGuaranteeNotice({compact = false}: {compact?: boolean}) {
  return (
    <div className={compact ? 'eu-notice eu-notice-compact' : 'eu-notice'}>
      <Link to="/gewaehrleistung" className="eu-notice-img" aria-label="EU-Hinweis zur gesetzlichen Gewährleistung öffnen">
        <img
          src={EU_NOTICE_SRC}
          alt="EU-Hinweis: Mindestens zwei Jahre gesetzliche Gewährleistung der Vertragsmäßigkeit für Waren, die in der Europäischen Union verkauft werden."
          width={880}
          height={1199}
          loading="lazy"
        />
      </Link>
      <div className="eu-notice-text">
        <strong>Gesetzliche Gewährleistung: mindestens 2 Jahre</strong>
        <span>
          Für alle Waren gilt die gesetzliche Gewährleistung der EU.{' '}
          <Link to="/gewaehrleistung">EU-Hinweis ansehen</Link>
        </span>
      </div>
    </div>
  );
}
