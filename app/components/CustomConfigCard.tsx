import {COMPANY} from '~/lib/company';
import {Icon} from '~/components/Icon';

const OPTIONS = [
  'Mehr Arbeitsspeicher',
  'Größere oder zweite SSD',
  'Zusätzliche Festplatte',
  'DVD-Laufwerk',
  'Grafikkarte',
  'WLAN / Bluetooth',
  'Windows & Office',
];

/**
 * Hinweis „Wunschkonfiguration“ auf Desktop-PC-Seiten (auch Mini/Micro).
 * Solange kein Mailversand (Resend) eingerichtet ist: vorausgefüllte E-Mail + Telefon.
 */
export function CustomConfigCard({title, sku}: {title: string; sku?: string | null}) {
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
        <Icon name="desktop" size={20} />
        <strong>Ihre Wunschkonfiguration – einfach anfragen</strong>
      </div>
      <p>
        Jeder TERRA PC lässt sich ab Werk anpassen. Sagen Sie uns, was Sie brauchen – Sie bekommen ein Angebot,
        innerhalb eines Werktags.
      </p>
      <ul className="config-card-chips">
        {OPTIONS.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>
      <div className="config-card-actions">
        <a href={mailto} className="btn btn-secondary">
          Konfiguration anfragen
        </a>
        <a href={tel} className="config-card-phone">
          oder anrufen: {COMPANY.phone}
        </a>
      </div>
    </section>
  );
}
