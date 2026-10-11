import {COMPANY} from '~/lib/company';
import {VAT_RATE} from '~/lib/categories';

export type QuoteCustomer = {
  company: string;
  contact: string;
  street: string;
  zipCity: string;
  email: string;
  phone: string;
  vatId: string;
  reference: string;
  note: string;
};

export type QuoteLine = {
  sku: string;
  title: string;
  variant?: string;
  quantity: number;
  /** Bruttopreis je Stück (wie im Shop) */
  unitGross: number;
};

const eur = new Intl.NumberFormat('de-DE', {style: 'currency', currency: 'EUR'});
const date = new Intl.DateTimeFormat('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'});
const r2 = (n: number) => Math.round(n * 100) / 100;

export function quoteNumber(now = new Date()) {
  const p = (n: number) => String(n).padStart(2, '0');
  return `ANG-${now.getFullYear()}${p(now.getMonth() + 1)}${p(now.getDate())}-${p(now.getHours())}${p(now.getMinutes())}`;
}

/** Erstellt das Angebots-PDF im Browser und startet den Download. */
export async function downloadQuotePdf(customer: QuoteCustomer, lines: QuoteLine[]) {
  const [{jsPDF}, {default: autoTable}] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const doc = new jsPDF({unit: 'mm', format: 'a4'});
  const brand: [number, number, number] = [11, 79, 156];
  const ink: [number, number, number] = [27, 36, 48];
  const mute: [number, number, number] = [107, 118, 133];
  const now = new Date();
  const valid = new Date(now.getTime() + COMPANY.quoteValidDays * 86400000);
  const number = quoteNumber(now);
  const L = 20;
  const R = 190;

  // Kopf
  doc.setFillColor(...brand);
  doc.rect(0, 0, 210, 6, 'F');
  const logo = await loadLogo();
  if (logo) {
    doc.addImage(logo, 'PNG', L, 11, 50, 16);
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(...brand);
    doc.text(COMPANY.name, L, 22);
  }
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...mute);
  const seller = [COMPANY.street, COMPANY.zipCity, COMPANY.phone && `Tel. ${COMPANY.phone}`, COMPANY.email, COMPANY.web]
    .filter(Boolean) as string[];
  seller.forEach((t, i) => doc.text(t, R, 16 + i * 4, {align: 'right'}));

  // Absenderzeile + Empfänger
  doc.setFontSize(7.5);
  doc.text([COMPANY.name, COMPANY.street, COMPANY.zipCity].filter(Boolean).join(' · '), L, 44);
  doc.setFontSize(10.5);
  doc.setTextColor(...ink);
  const recipient = [
    customer.company,
    customer.contact && `z. Hd. ${customer.contact}`,
    customer.street,
    customer.zipCity,
  ].filter(Boolean) as string[];
  recipient.forEach((t, i) => doc.text(t, L, 51 + i * 5));

  // Angebotsdaten rechts
  const meta: [string, string][] = [
    ['Angebot-Nr.', number],
    ['Datum', date.format(now)],
    ['Gültig bis', date.format(valid)],
  ];
  if (customer.reference) meta.push(['Ihr Zeichen', customer.reference]);
  if (customer.vatId) meta.push(['Ihre USt-IdNr.', customer.vatId]);
  doc.setFontSize(9);
  meta.forEach(([k, v], i) => {
    doc.setTextColor(...mute);
    doc.text(k, 130, 51 + i * 5);
    doc.setTextColor(...ink);
    doc.text(v, R, 51 + i * 5, {align: 'right'});
  });

  // Titel + Einleitung
  let y = 88;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(`Angebot ${number}`, L, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  y += 8;
  const intro = doc.splitTextToSize(
    `Sehr geehrte Damen und Herren,\n\nvielen Dank für Ihre Anfrage. Gerne bieten wir Ihnen die folgenden Positionen an:`,
    R - L,
  );
  doc.text(intro, L, y);
  y += intro.length * 4.6 + 3;

  // Positionen (Netto)
  let net = 0;
  const body = lines.map((l, i) => {
    const unitNet = r2(l.unitGross / (1 + VAT_RATE));
    const total = r2(unitNet * l.quantity);
    net += total;
    const name = l.variant && l.variant !== 'Default Title' ? `${l.title}\n${l.variant}` : l.title;
    return [String(i + 1), l.sku || '–', name, String(l.quantity), eur.format(unitNet), eur.format(total)];
  });
  autoTable(doc, {
    startY: y,
    margin: {left: L, right: 210 - R},
    head: [['Pos.', 'Art.-Nr.', 'Bezeichnung', 'Menge', 'Einzelpreis netto', 'Gesamt netto']],
    body,
    styles: {font: 'helvetica', fontSize: 8.8, cellPadding: 2.2, textColor: ink, lineColor: [226, 230, 236], lineWidth: 0.1},
    headStyles: {fillColor: brand, textColor: 255, fontStyle: 'bold'},
    alternateRowStyles: {fillColor: [245, 247, 250]},
    columnStyles: {
      0: {cellWidth: 11},
      1: {cellWidth: 22},
      3: {cellWidth: 15, halign: 'right'},
      4: {cellWidth: 28, halign: 'right'},
      5: {cellWidth: 28, halign: 'right'},
    },
  });
  // @ts-expect-error lastAutoTable wird vom Plugin gesetzt
  y = (doc.lastAutoTable?.finalY ?? y) + 6;

  // Summen
  net = r2(net);
  const vat = r2(net * VAT_RATE);
  const gross = r2(net + vat);
  const totals: [string, string, boolean][] = [
    ['Summe netto', eur.format(net), false],
    [`zzgl. ${Math.round(VAT_RATE * 100)} % MwSt.`, eur.format(vat), false],
    ['Gesamtbetrag brutto', eur.format(gross), true],
  ];
  if (y > 250) {
    doc.addPage();
    y = 25;
  }
  totals.forEach(([k, v, bold], i) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(bold ? 11 : 10);
    doc.text(k, 135, y + i * 6);
    doc.text(v, R, y + i * 6, {align: 'right'});
  });
  doc.setDrawColor(...brand);
  doc.line(135, y + 13.2, R, y + 13.2);
  y += 24;

  // Hinweise
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...ink);
  const notes = [
    customer.note ? `Bemerkung: ${customer.note}` : '',
    `Dieses Angebot ist gültig bis ${date.format(valid)} und freibleibend, solange der Vorrat reicht. Lieferzeit und Versandkosten nach Absprache. Es gelten unsere Allgemeinen Geschäftsbedingungen.`,
    'Alle Geräte sind Originalprodukte der Marke TERRA (WORTMANN AG, Hüllhorst) mit Herstellergarantie.',
    '',
    'Mit freundlichen Grüßen',
    COMPANY.owner ? `${COMPANY.owner} · ${COMPANY.name}` : COMPANY.name,
  ].filter((t, i) => t || i === 3);
  notes.forEach((t) => {
    const w = doc.splitTextToSize(t, R - L);
    if (y + w.length * 4.4 > 275) {
      doc.addPage();
      y = 25;
    }
    doc.text(w, L, y);
    y += w.length * 4.4 + (t ? 2 : 0);
  });

  // Fußzeile auf jeder Seite
  const pages = doc.getNumberOfPages();
  const foot = [
    [COMPANY.name, COMPANY.street, COMPANY.zipCity].filter(Boolean).join(' · '),
    [COMPANY.vatId && `USt-IdNr. ${COMPANY.vatId}`, COMPANY.bank, COMPANY.iban && `IBAN ${COMPANY.iban}`, COMPANY.bic && `BIC ${COMPANY.bic}`]
      .filter(Boolean)
      .join(' · '),
  ].filter(Boolean);
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFontSize(7.5);
    doc.setTextColor(...mute);
    doc.setDrawColor(226, 230, 236);
    doc.line(L, 282, R, 282);
    foot.forEach((t, i) => doc.text(t, 105, 286 + i * 3.6, {align: 'center'}));
    doc.text(`Seite ${p} von ${pages}`, R, 293, {align: 'right'});
  }

  const safe = (customer.company || 'Kunde').replace(/[^\w\-äöüÄÖÜß ]+/g, '').trim().replace(/\s+/g, '_');
  doc.save(`${number}_${safe}.pdf`);
}

async function loadLogo(): Promise<string | null> {
  try {
    const res = await fetch('/images/logo-smit-pdf.png');
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(typeof r.result === 'string' ? r.result : null);
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}
