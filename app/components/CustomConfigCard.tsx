import {Link} from 'react-router';
import {COMPANY} from '~/lib/company';
import {Icon} from '~/components/Icon';

const OPTIONS = [
  'Mehr Arbeitsspeicher',
  'Größere oder zweite SSD',
  'Zusätzliche Festplatte',
  'Grafikkarte',
  'DVD-Laufwerk',
  'WLAN / Bluetooth',
  'Windows & Office',
  'Einrichtung',
];

/**
 * Hinweis „Wunschkonfiguration“ auf Desktop-PC-Seiten (auch Mini/Micro).
 * Mit `configSlug` führt der Hauptbutton in den Online-Konfigurator,
 * sonst vorausgefüllte E-Mail (solange kein Mailversand eingerichtet ist).
 */
export function CustomConfigCard({
  title,
  sku,
  configSlug,
}: {
  title: string;
  sku?: string | null;
  configSlug?: string | null;
}) {
  const subject = `Wunschkonfiguration: ${title}${sku ? ` (Art.-Nr. ${sku})` : ''}`;
  const body = [
    'Guten Tag,',
    '',
    `ich interessiere mich für den ${title}${sku ? ` (Art.-Nr. ${sku})` : ''} mit folgenden Änderungen:`,
    '',
    '- Arbeitsspeicher: ',
    '- SSD / Festplatte: ',
    '- Laufwerk / Grafik / Sonstiges: ',
    '- Stückzahl: ',
    '',
    'Firma / Name: ',
    'Telefon: ',
  ].join('\n');
  const mailto = `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const tel = `tel:${COMPANY.phone.replace(/[^\d+]/g, '').replace('+490', '+49')}`;

  return (
    <section className="config-card" aria-label="Wunschkonfiguration">
      <div className="config-card-head">
        <span className="config-card-icon" aria-hidden="true">
          <Icon name="desktop" size={22} />
        </span>
        <div>
          <strong>Ihre Wunschkonfiguration</strong>
          <span>Jeder TERRA PC wird ab Werk nach Ihren Vorgaben gebaut.</span>
        </div>
      </div>
      <div className="config-card-body">
        <ul className="config-card-list">
          {OPTIONS.map((o) => (
            <li key={o}>
              <Icon name="check" size={14} />
              {o}
            </li>
          ))}
        </ul>
        <div className="config-card-actions">
          {configSlug ? (
            <Link to={`/konfigurator/${configSlug}`} className="btn btn-primary">
              Jetzt online konfigurieren
              <Icon name="arrow-right" size={16} />
            </Link>
          ) : (
            <a href={mailto} className="btn btn-primary">
              Konfiguration anfragen
              <Icon name="arrow-right" size={16} />
            </a>
          )}
          <a href={tel} className="btn btn-secondary config-card-phone">
            <Icon name="headset" size={16} />
            {COMPANY.phone}
          </a>
        </div>
        <p className="config-card-note">
          <Icon name="invoice" size={14} /> Verbindliches Angebot innerhalb von 1 Werktag
        </p>
      </div>
    </section>
  );
}
