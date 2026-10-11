import {useState} from 'react';
import {Form, Link, useActionData, useNavigation} from 'react-router';
import type {Route} from './+types/widerruf';
import {COMPANY} from '~/lib/company';

/**
 * Elektronische Widerrufsfunktion nach § 356a BGB (seit 19.06.2026).
 * Schritt 1: Angaben (Name, Vertrag/Bestellung, E-Mail). Schritt 2: "Widerruf bestätigen".
 * Danach: Eingangsbestätigung mit Inhalt, Datum und Uhrzeit per E-Mail (dauerhafter Datenträger).
 */
export const meta: Route.MetaFunction = () => [
  {title: 'Vertrag widerrufen | terra-computershop.de'},
  {name: 'description', content: 'Widerrufen Sie Ihren Vertrag online – einfach, ohne Kundenkonto.'},
  {name: 'robots', content: 'noindex, follow'},
];

type Fields = {
  name: string;
  order: string;
  email: string;
  orderDate: string;
  items: string;
  reason: string;
};

type ActionResult =
  | {ok: true; receivedAt: string; fields: Fields; mailSent: boolean}
  | {ok: false; error: string};

const clean = (v: FormDataEntryValue | null, max = 2000) =>
  String(v ?? '').replace(/\s+\n/g, '\n').trim().slice(0, max);

export async function action({request, context}: Route.ActionArgs): Promise<ActionResult> {
  const fd = await request.formData();
  if (clean(fd.get('website'))) return {ok: false, error: 'Ungültige Anfrage.'}; // Spam-Falle
  const fields: Fields = {
    name: clean(fd.get('name'), 200),
    order: clean(fd.get('order'), 100),
    email: clean(fd.get('email'), 200),
    orderDate: clean(fd.get('orderDate'), 40),
    items: clean(fd.get('items')),
    reason: clean(fd.get('reason')),
  };
  if (!fields.name || !fields.order || !/^\S+@\S+\.\S+$/.test(fields.email)) {
    return {ok: false, error: 'Bitte Name, Bestell- bzw. Vertragsnummer und E-Mail-Adresse angeben.'};
  }

  const now = new Date();
  const receivedAt = now.toLocaleString('de-DE', {
    timeZone: 'Europe/Berlin',
    dateStyle: 'long',
    timeStyle: 'medium',
  });

  const {env} = context;
  let mailSent = false;
  if (env.RESEND_API_KEY) {
    const from = env.WIDERRUF_FROM || `terra-computershop.de <widerruf@terra-computershop.de>`;
    const notify = env.WIDERRUF_NOTIFY || COMPANY.email;
    const text = receiptText(fields, receivedAt);
    const send = (to: string, subject: string, body: string, replyTo?: string) =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json'},
        body: JSON.stringify({from, to: [to], subject, text: body, ...(replyTo ? {reply_to: replyTo} : {})}),
      });
    try {
      const [customer, merchant] = await Promise.all([
        send(fields.email, `Eingangsbestätigung Ihres Widerrufs – Bestellung ${fields.order}`, text, notify),
        send(notify, `Neuer Widerruf: Bestellung ${fields.order} (${fields.name})`, text, fields.email),
      ]);
      mailSent = customer.ok;
      if (!customer.ok || !merchant.ok) {
        console.error('Widerruf-Mail fehlgeschlagen', customer.status, merchant.status);
      }
    } catch (e) {
      console.error('Widerruf-Mail Fehler', e);
    }
  } else {
    console.error('RESEND_API_KEY fehlt – Widerruf nicht per E-Mail bestätigt', fields.order);
  }

  return {ok: true, receivedAt, fields, mailSent};
}

function receiptText(f: Fields, receivedAt: string) {
  return [
    'Eingangsbestätigung Ihres Widerrufs',
    '',
    `Ihre Widerrufserklärung ist am ${receivedAt} (Uhrzeit Deutschland) bei uns eingegangen.`,
    'Wir prüfen den Vorgang und melden uns mit den weiteren Schritten (z. B. Rücksendung).',
    '',
    'Inhalt Ihrer Widerrufserklärung:',
    `Hiermit widerrufe ich den von mir abgeschlossenen Vertrag.`,
    `Name: ${f.name}`,
    `Bestell-/Vertragsnummer: ${f.order}`,
    f.orderDate ? `Bestellt/erhalten am: ${f.orderDate}` : '',
    `Umfang: ${f.items || 'gesamte Bestellung'}`,
    f.reason ? `Anmerkung: ${f.reason}` : '',
    `E-Mail für die Bestätigung: ${f.email}`,
    '',
    `${COMPANY.name} · Inhaber ${COMPANY.owner} · ${COMPANY.street} · ${COMPANY.zipCity}`,
    `Tel. ${COMPANY.phone} · ${COMPANY.email}`,
  ]
    .filter((l) => l !== '')
    .join('\n');
}

export default function Widerruf() {
  const result = useActionData<typeof action>();
  const nav = useNavigation();
  const [step, setStep] = useState<1 | 2>(1);
  const [f, setF] = useState<Fields>({name: '', order: '', email: '', orderDate: '', items: '', reason: ''});
  const valid = f.name.trim() && f.order.trim() && /^\S+@\S+\.\S+$/.test(f.email);

  if (result?.ok) {
    return (
      <div className="container widerruf">
        <h1>Ihr Widerruf ist bei uns eingegangen</h1>
        <div className="widerruf-receipt" id="receipt">
          <p>
            <strong>Eingang:</strong> {result.receivedAt} (Uhrzeit Deutschland)
          </p>
          <p>Hiermit widerrufe ich den von mir abgeschlossenen Vertrag.</p>
          <dl>
            <dt>Name</dt>
            <dd>{result.fields.name}</dd>
            <dt>Bestell-/Vertragsnummer</dt>
            <dd>{result.fields.order}</dd>
            {result.fields.orderDate ? (
              <>
                <dt>Bestellt/erhalten am</dt>
                <dd>{result.fields.orderDate}</dd>
              </>
            ) : null}
            <dt>Umfang</dt>
            <dd>{result.fields.items || 'gesamte Bestellung'}</dd>
            <dt>E-Mail</dt>
            <dd>{result.fields.email}</dd>
          </dl>
          <p className="widerruf-note">
            {result.mailSent
              ? `Eine Eingangsbestätigung mit diesem Inhalt haben wir an ${result.fields.email} gesendet.`
              : `Bitte speichern oder drucken Sie diese Bestätigung. Sollten Sie keine E-Mail von uns erhalten, melden Sie sich bitte unter ${COMPANY.email}.`}{' '}
            Wir prüfen den Vorgang und melden uns mit den weiteren Schritten.
          </p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
          Bestätigung drucken / als PDF speichern
        </button>
      </div>
    );
  }

  return (
    <div className="container widerruf">
      <h1>Vertrag widerrufen</h1>
      <p className="widerruf-intro">
        Hier können Sie als Verbraucher einen bei uns geschlossenen Vertrag innerhalb der Widerrufsfrist
        widerrufen – ohne Kundenkonto. Nach dem Absenden erhalten Sie eine Eingangsbestätigung per E-Mail.
        Details finden Sie in unserer <Link to="/policies/refund-policy">Widerrufsbelehrung</Link>.
      </p>

      {result && !result.ok ? <p className="widerruf-error">{result.error}</p> : null}

      <Form method="post" className="widerruf-form">
        {/* Spam-Falle: für Menschen unsichtbar */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />
        {Object.entries(f).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}

        {step === 1 ? (
          <>
            <label className="cfg-field">
              <span>Ihr Name *</span>
              <input required value={f.name} onChange={(e) => setF({...f, name: e.target.value})} autoComplete="name" />
            </label>
            <label className="cfg-field">
              <span>Bestellnummer oder Vertragsnummer *</span>
              <input required value={f.order} onChange={(e) => setF({...f, order: e.target.value})} placeholder="z. B. #1001" />
            </label>
            <label className="cfg-field">
              <span>E-Mail-Adresse für die Eingangsbestätigung *</span>
              <input required type="email" value={f.email} onChange={(e) => setF({...f, email: e.target.value})} autoComplete="email" />
            </label>
            <label className="cfg-field">
              <span>Bestellt am / erhalten am (optional)</span>
              <input value={f.orderDate} onChange={(e) => setF({...f, orderDate: e.target.value})} />
            </label>
            <label className="cfg-field">
              <span>Welche Artikel? (optional – leer = gesamte Bestellung)</span>
              <textarea rows={3} value={f.items} onChange={(e) => setF({...f, items: e.target.value})} />
            </label>
            <label className="cfg-field">
              <span>Anmerkung (optional, keine Begründung erforderlich)</span>
              <textarea rows={2} value={f.reason} onChange={(e) => setF({...f, reason: e.target.value})} />
            </label>
            <button type="button" className="btn btn-primary" disabled={!valid} onClick={() => setStep(2)}>
              Weiter zur Bestätigung
            </button>
          </>
        ) : (
          <>
            <div className="widerruf-receipt">
              <p>Hiermit widerrufe ich den von mir abgeschlossenen Vertrag.</p>
              <dl>
                <dt>Name</dt>
                <dd>{f.name}</dd>
                <dt>Bestell-/Vertragsnummer</dt>
                <dd>{f.order}</dd>
                {f.orderDate ? (
                  <>
                    <dt>Bestellt/erhalten am</dt>
                    <dd>{f.orderDate}</dd>
                  </>
                ) : null}
                <dt>Umfang</dt>
                <dd>{f.items || 'gesamte Bestellung'}</dd>
                <dt>Eingangsbestätigung an</dt>
                <dd>{f.email}</dd>
              </dl>
            </div>
            <div className="widerruf-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                Angaben ändern
              </button>
              <button type="submit" className="btn btn-primary btn-widerruf" disabled={nav.state !== 'idle'}>
                Widerruf bestätigen
              </button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
}
