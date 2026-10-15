/**
 * Liest die Wortmann-Datentabelle (Produktbeschreibung) aus und liefert
 * die wichtigsten Eckdaten für die "Auf einen Blick"-Box.
 */
export type Spec = {label: string; value: string};

function clean(s: string) {
  return s
    .replace(/<br\s*\/?>/gi, ', ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*,/g, ',')
    .trim()
    .replace(/,$/, '');
}

export function parseSpecs(html: string): Spec[] {
  const out: Spec[] = [];
  const re = /<td>\s*<strong>([^<]+)<\/strong>\s*<\/td>\s*<td>([\s\S]*?)<\/td>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const label = clean(m[1]);
    const value = clean(m[2]);
    if (label && value) out.push({label, value});
  }
  return out;
}

/** Reihenfolge = Priorität. Pro Zeile: Anzeigename + mögliche Feldnamen. */
const KEY_SPECS: [string, string[]][] = [
  ['Prozessor', ['Prozessor']],
  ['Display', ['Bildschirmdiagonale', 'Displaygröße']],
  ['Auflösung', ['Display-Auflösung', 'Auflösung']],
  ['Arbeitsspeicher', ['Speicherkapazität']],
  ['Speicher', ['Gesamtspeicherkapazität', 'SSD Speicherkapazität']],
  ['Grafik', ['Grafikkarte']],
  ['Betriebssystem', ['Betriebssystem']],
  ['Panel', ['Displaytyp', 'Paneltyp']],
  ['Anschlüsse', ['Schnittstelle', 'Geräteschnittstelle']],
  ['Gewicht', ['Gewicht']],
];

export function keySpecs(specs: Spec[], max = 6): Spec[] {
  const res: Spec[] = [];
  for (const [name, keys] of KEY_SPECS) {
    const hit = specs.find((s) => keys.includes(s.label));
    if (hit && !/^(nein|keine?\(r\)|-)$/i.test(hit.value)) {
      let value = hit.value;
      if (value.length > 70) value = value.slice(0, 68).replace(/[ ,(]+[^ ,(]*$/, '') + ' …';
      res.push({label: name, value});
    }
    if (res.length >= max) break;
  }
  return res;
}

/**
 * Die Shopify-Produktbeschreibung enthält vorne den Übersichtstext (für Google & Co.)
 * in einem markierten Block, danach die technischen Daten.
 * Hier wird beides für die Tabs „Übersicht“ und „Technische Daten“ getrennt.
 */
const OVERVIEW_BLOCK = /<div[^>]*data-smit-overview[^>]*>([\s\S]*?)<\/div>\s*<!--\s*\/smit-overview\s*-->/i;

export function splitDescription(html: string): {overviewHtml: string; specsHtml: string} {
  const m = OVERVIEW_BLOCK.exec(html ?? '');
  if (!m) return {overviewHtml: '', specsHtml: html ?? ''};
  return {overviewHtml: m[1].trim(), specsHtml: html.replace(m[0], '').trim()};
}
