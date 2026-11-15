import {useEffect, useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent} from 'react';
import {createPortal} from 'react-dom';

/**
 * EU-Energielabel für elektronische Displays (VO (EU) 2019/2013, Anhang VIII):
 * farbiger Pfeil mit Klassenbuchstabe + Skala A–G nahe am Preis (verschachtelte Anzeige).
 * Klick/Tippen öffnet das vollständige Label aus der EU-Datenbank EPREL;
 * daneben der Link „Produktdatenblatt“ (EPREL-Datenblatt als PDF).
 *
 * Daten kommen aus den Produkt-Metafeldern custom.energy_class und custom.eprel_id.
 */

const COLORS: Record<string, string> = {
  A: '#00a651',
  B: '#50b848',
  C: '#bed630',
  D: '#fff200',
  E: '#fdb913',
  F: '#f37021',
  G: '#ed1c24',
};

const EPREL = 'https://eprel.ec.europa.eu/api/products/electronicdisplays';
export const eprelLabelUrl = (id: string) => `${EPREL}/${id}/labels?format=SVG`;
export const eprelSheetUrl = (id: string) => `${EPREL}/${id}/fiches?language=DE&format=PDF`;

type MF = {value?: string | null} | null | undefined;

export function energyData(p: {energyClass?: MF; eprelId?: MF} | null | undefined) {
  const cls = p?.energyClass?.value?.trim().toUpperCase();
  const id = p?.eprelId?.value?.trim();
  return cls && COLORS[cls] ? {cls, id: id || null} : null;
}

/** Pfeil-Grafik: Buchstabe in Weiß/fett etwa in Preis-Schriftgröße (1em), Skala A–G in Schwarz. */
function Arrow({cls}: {cls: string}) {
  return (
    <svg
      className="energy-arrow"
      viewBox="0 0 66 32"
      height="1.6em"
      width="3.3em"
      role="img"
      aria-label={`Energieeffizienzklasse ${cls} (Skala A bis G)`}
    >
      <path d="M1 1 H38 L52 16 L38 31 H1 Z" fill={COLORS[cls]} stroke="#000" strokeWidth="2" strokeLinejoin="round" />
      <text
        x="20"
        y="23"
        textAnchor="middle"
        fill="#fff"
        stroke="#000"
        strokeWidth="1.4"
        paintOrder="stroke"
        fontFamily="Calibri, Carlito, Arial, sans-serif"
        fontWeight="700"
        fontSize="21"
      >
        {cls}
      </text>
      <g fill="#000" fontFamily="Calibri, Carlito, Arial, sans-serif" fontWeight="700" fontSize="11" textAnchor="middle">
        <text x="60" y="11">A</text>
        <path d="M60 13.5 v5" stroke="#000" strokeWidth="1.3" />
        <path d="M57.8 15.8 L60 12.8 L62.2 15.8" fill="none" stroke="#000" strokeWidth="1.3" />
        <text x="60" y="30">G</text>
      </g>
    </svg>
  );
}

/** Datenblatt über die eigene Domain (Route /datenblatt/eprel/:id) – einbettbar im Modal und echt herunterladbar */
export const sheetProxyUrl = (id: string, download = false) =>
  `/datenblatt/eprel/${id}${download ? '?download=1' : ''}`;

type View = 'label' | 'sheet';

export function EnergyLabel({
  energyClass,
  eprelId,
  compact = false,
  inLink = false,
}: {
  energyClass: string;
  eprelId?: string | null;
  compact?: boolean;
  /** true, wenn der Baustein in einem <a> (Produktkarte) steckt: keine verschachtelten Links */
  inLink?: boolean;
}) {
  const [view, setView] = useState<View | null>(null);
  const show = (v: View) => (e: MouseEvent | ReactKeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setView(v);
  };

  return (
    <span className={`energy-label${compact ? ' energy-label-compact' : ''}`}>
      <button type="button" className="energy-label-btn" onClick={show('label')} title="Energielabel anzeigen">
        <Arrow cls={energyClass} />
      </button>
      {eprelId ? (
        inLink ? (
          <span
            role="link"
            tabIndex={0}
            className="energy-sheet"
            onClick={show('sheet')}
            onKeyDown={(e) => e.key === 'Enter' && show('sheet')(e)}
          >
            Produktdatenblatt
          </span>
        ) : (
          <a className="energy-sheet" href={sheetProxyUrl(eprelId)} onClick={show('sheet')}>
            Produktdatenblatt
          </a>
        )
      ) : null}
      {view ? (
        <LabelOverlay cls={energyClass} eprelId={eprelId} view={view} setView={setView} onClose={() => setView(null)} />
      ) : null}
    </span>
  );
}

function LabelOverlay({
  cls,
  eprelId,
  view,
  setView,
  onClose,
}: {
  cls: string;
  eprelId?: string | null;
  view: View;
  setView: (v: View) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.classList.add('energy-modal-open');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('energy-modal-open');
    };
  }, [onClose]);
  if (typeof document === 'undefined') return null;
  const isSheet = view === 'sheet' && eprelId;
  return createPortal(
    // Portal-Klicks blubbern in React bis zur Produktkarte (<Link>) – hier abfangen, sonst navigiert die Karte
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <div
      className="energy-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={isSheet ? 'Produktdatenblatt' : `EU-Energielabel, Klasse ${cls}`}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest('a')) e.preventDefault();
        e.stopPropagation();
      }}
    >
      <button type="button" className="energy-overlay-backdrop" aria-label="Schließen" onClick={onClose} />
      <div className={`energy-overlay-box${isSheet ? ' is-sheet' : ''}`}>
        <div className="energy-overlay-head">
          {eprelId ? (
            <div className="energy-tabs" role="tablist">
              <button type="button" role="tab" aria-selected={!isSheet} onClick={() => setView('label')}>
                Energielabel
              </button>
              <button type="button" role="tab" aria-selected={Boolean(isSheet)} onClick={() => setView('sheet')}>
                Produktdatenblatt
              </button>
            </div>
          ) : (
            <strong>Energielabel</strong>
          )}
          <button type="button" className="energy-overlay-close" onClick={onClose} aria-label="Schließen">
            ×
          </button>
        </div>
        {isSheet ? (
          <>
            <iframe className="energy-sheet-frame" src={sheetProxyUrl(eprelId)} title="Produktdatenblatt (PDF)" />
            <div className="energy-sheet-actions">
              <a className="btn btn-secondary" href={sheetProxyUrl(eprelId)} target="_blank" rel="noopener noreferrer">
                In neuem Fenster öffnen
              </a>
              <a className="btn btn-primary" href={sheetProxyUrl(eprelId, true)} download={`Produktdatenblatt_EPREL_${eprelId}.pdf`}>
                Herunterladen (PDF)
              </a>
            </div>
          </>
        ) : eprelId ? (
          <img src={eprelLabelUrl(eprelId)} alt={`EU-Energielabel: Energieeffizienzklasse ${cls}`} />
        ) : (
          <p>Energieeffizienzklasse {cls}</p>
        )}
      </div>
    </div>,
    document.body,
  );
}
