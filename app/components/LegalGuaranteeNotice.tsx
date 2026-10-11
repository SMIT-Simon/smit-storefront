import {useRef, type ReactNode} from 'react';

/**
 * EU-Gewährleistungslabel (harmonisierter Hinweis, Pflicht seit 27.09.2026).
 * Das Bild ist die unveränderte offizielle Datei der EU-Kommission (farbig).
 * Klick öffnet den vollständigen Hinweis im Modal; ohne JavaScript führt der
 * Link auf /gewaehrleistung.
 */
export const EU_NOTICE_SRC = '/images/eu-gewaehrleistung-de.jpg';
export const EU_NOTICE_ALT =
  'EU-Hinweis zur gesetzlichen Gewährleistung: Mindestens zwei Jahre gesetzliche Gewährleistung der Vertragsmäßigkeit für Waren, die in der Europäischen Union verkauft werden. Verbraucher können ihre Rechte geltend machen, wenn Waren nicht der Beschreibung entsprechen oder nicht bestimmungsgemäß funktionieren. Verkäufer müssen kostenlose Nachbesserung oder Ersatzlieferung, in bestimmten Fällen Preisminderung oder Erstattung anbieten. Weitere Informationen: europa.eu/youreurope/garantien';

/** Link, der den EU-Hinweis im Modal öffnet. */
export function GuaranteeModalLink({
  children,
  className,
  label = 'EU-Hinweis zur gesetzlichen Gewährleistung öffnen',
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <a
        href="/gewaehrleistung"
        className={className}
        aria-label={label}
        onClick={(e) => {
          if (ref.current?.showModal) {
            e.preventDefault();
            ref.current.showModal();
          }
        }}
      >
        {children}
      </a>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- Hintergrund-Klick; Esc schließt nativ */}
      <dialog
        ref={ref}
        className="eu-notice-dialog"
        aria-label="Gesetzliche Gewährleistung"
        onClick={(e) => {
          // Klick auf den Hintergrund schließt
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className="eu-notice-dialog-inner">
          <div className="eu-notice-dialog-head">
            <strong>Gesetzliche Gewährleistung</strong>
            <button type="button" onClick={() => ref.current?.close()} aria-label="Schließen">
              ×
            </button>
          </div>
          <img src={EU_NOTICE_SRC} alt={EU_NOTICE_ALT} width={880} height={1199} loading="lazy" />
          <p>
            Im Gewährleistungsfall: <a href="mailto:info@wawi-servicepartner.de">info@wawi-servicepartner.de</a> ·{' '}
            <a href="tel:+4952469098980">+49 (0)5246-9098980</a> · Mehr unter{' '}
            <a href="https://europa.eu/youreurope/garantien" target="_blank" rel="noopener noreferrer">
              europa.eu/youreurope/garantien
            </a>
          </p>
        </div>
      </dialog>
    </>
  );
}

export function LegalGuaranteeNotice({compact = false}: {compact?: boolean}) {
  return (
    <div className={compact ? 'eu-notice eu-notice-compact' : 'eu-notice'}>
      <GuaranteeModalLink className="eu-notice-img">
        <img src={EU_NOTICE_SRC} alt={EU_NOTICE_ALT} width={880} height={1199} loading="lazy" />
      </GuaranteeModalLink>
      <div className="eu-notice-text">
        <strong>Gesetzliche Gewährleistung: mindestens 2 Jahre</strong>
        <span>
          Für alle Waren gilt die gesetzliche Gewährleistung der EU.{' '}
          <GuaranteeModalLink>EU-Hinweis ansehen</GuaranteeModalLink>
        </span>
      </div>
    </div>
  );
}

/** Hinweis in normaler Größe (z. B. im Reiter „Service & Gewährleistung“). */
export function LegalGuaranteeFull() {
  return (
    <figure className="eu-notice-figure">
      <img src={EU_NOTICE_SRC} alt={EU_NOTICE_ALT} width={880} height={1199} loading="lazy" />
      <figcaption>
        Für alle Waren gilt die gesetzliche Gewährleistung von mindestens zwei Jahren. Im
        Gewährleistungsfall: <a href="mailto:info@wawi-servicepartner.de">info@wawi-servicepartner.de</a> ·{' '}
        <a href="tel:+4952469098980">+49 (0)5246-9098980</a>
      </figcaption>
    </figure>
  );
}
