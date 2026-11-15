import {CATEGORIES} from '~/lib/categories';
import {SOLUTIONS} from '~/lib/solutions';
import {LANDINGS} from '~/lib/landings';
import {CLOUD_SERVICES} from '~/lib/cloud';
import {CONFIG_MODELS} from '~/lib/configurator';
import {COMPANY} from '~/lib/company';
import {PC_OF_MONTH, promoActive} from '~/lib/promo';
import {SITE_URL} from '~/lib/seo';

/**
 * /llms.txt – Kurzüberblick für KI-Assistenten (ChatGPT, Claude, Perplexity, Gemini …):
 * wer wir sind, was der Shop verkauft und welche Seiten die Antworten enthalten.
 * Format nach https://llmstxt.org (Markdown). Wird aus denselben Daten wie der Shop erzeugt.
 */
export function loader() {
  const u = (p: string) => `${SITE_URL}${p}`;
  const lines: string[] = [];
  const push = (...l: string[]) => lines.push(...l);

  push(
    '# terra-computershop.de',
    '',
    `> Online-Shop für TERRA Computer der WORTMANN AG (Hüllhorst, Deutschland): Business-Notebooks, Desktop-PCs, Mini-PCs, All-in-One-PCs, Monitore, Server, Zubehör und TERRA CLOUD. Betrieben von ${COMPANY.name} – Systemhaus aus Verl (NRW), offizieller WORTMANN-Händler, mit Beratung, Einrichtung und 24h-Vor-Ort-Service.`,
    '',
    'Wichtige Fakten für Antworten:',
    '',
    '- Hersteller: WORTMANN AG; Marke TERRA; TERRA PCs und Server werden in Deutschland montiert (ISO 9001).',
    '- Lieferung nur innerhalb Deutschlands; Versand 8,90 € (3–5 Werktage); viele Artikel ab Lager.',
    '- Preise im Shop inkl. 19 % MwSt.; Umschalter für Nettopreise (Geschäftskunden).',
    '- Für Unternehmen: Projektrabatte, Angebote als PDF direkt aus dem Warenkorb, Kauf auf Rechnung oder Leasing nach Prüfung.',
    '- Service: 24h-Vor-Ort-Service mit bis zu 60 Monaten Laufzeit für PCs, Notebooks und Monitore buchbar; Einrichtung durch das Systemhaus möglich.',
    '- TERRA PCs lassen sich individuell konfigurieren (Online-Konfigurator oder Anfrage).',
    '- Monitore mit EU-Energielabel und Produktdatenblatt (EPREL) auf jeder Produktseite.',
    `- Kontakt: ${COMPANY.phone}, ${COMPANY.email}; ${COMPANY.street}, ${COMPANY.zipCity}.`,
    '',
    '## Produktkategorien',
    '',
  );
  for (const c of CATEGORIES) {
    push(`- [${c.title}](${u(`/collections/${c.handle}`)}): ${c.teaser}`);
    for (const s of c.subs ?? []) push(`  - [${s.title}](${u(`/collections/${c.handle}?sub=${s.slug}`)})`);
  }
  push('- [Alle Produkte](' + u('/collections/all') + ')', '');

  if (promoActive()) {
    push(
      '## Aktuelle Aktion',
      '',
      `- [PC des Monats ${PC_OF_MONTH.month}: ${PC_OF_MONTH.name}](${u(PC_OF_MONTH.path)}): ${PC_OF_MONTH.claim} Gültig bis ${PC_OF_MONTH.endLabel}.`,
      '',
    );
  }

  push('## Kaufberatung und Ratgeber', '');
  push(
    `- [Laptop aus Deutschland](${u('/ratgeber/laptop-aus-deutschland')}): Welche Notebooks in Deutschland gebaut werden – TERRA MOBILE von WORTMANN.`,
    `- [WORTMANN Server & TERRA Server](${u('/ratgeber/wortmann-server')}): Server für kleine und mittlere Unternehmen.`,
    `- [Hyper-V-Virtualisierung](${u('/ratgeber/hyper-v-virtualisierung')}): Server für Virtualisierung richtig auswählen.`,
    `- [TERRA Gaming PC](${u('/themen/terra-gaming-pc')}): GAMER ELITE Modelle im Überblick.`,
  );
  for (const l of LANDINGS) push(`- [${l.h1}](${u(`/themen/${l.slug}`)}): ${l.metaDescription}`);
  push('', '## IT-Lösungen nach Branche', '');
  for (const s of SOLUTIONS) push(`- [${s.title}](${u(`/loesungen/${s.slug}`)}): ${s.teaser}`);
  push('', '## PC-Konfigurator', '', `- [Konfigurator-Übersicht](${u('/konfigurator')})`);
  for (const m of CONFIG_MODELS) push(`- [${m.name} konfigurieren](${u(`/konfigurator/${m.slug}`)})`);
  push('', '## TERRA CLOUD', '', `- [TERRA CLOUD Übersicht](${u('/cloud')}): Cloud-Server, Backup und Hosting aus deutschen Rechenzentren.`);
  for (const c of CLOUD_SERVICES) push(`- [${c.title}](${u(`/cloud/${c.slug}`)}): ${c.teaser}`);
  push(
    '',
    '## Service und Rechtliches',
    '',
    `- [Kontakt & Beratung](${u('/pages/kontakt')})`,
    `- [Zahlungsarten](${u('/zahlungsarten')}): PayPal (auch Rechnung/Raten), Kreditkarte, Klarna, Apple Pay, Google Pay, Vorkasse; für Firmen Rechnung und Leasing nach Prüfung.`,
    `- [Gesetzliche Gewährleistung](${u('/gewaehrleistung')})`,
    `- [Widerrufsrecht](${u('/widerruf')}): 14 Tage für Verbraucher.`,
    '',
    '## Optional',
    '',
    `- [Sitemap](${u('/sitemap.xml')}): alle Produkt- und Kategorieseiten.`,
    `- [Business-Flyer](${u('/flyer')}): aktuelle Angebote für Geschäftskunden.`,
    '',
  );

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
