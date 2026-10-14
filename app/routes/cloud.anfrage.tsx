import type {Route} from './+types/cloud.anfrage';
import {COMPANY} from '~/lib/company';
import {CloudInquiry} from '~/components/CloudInquiry';

/**
 * Cloud-Anfrage: nimmt das Formular entgegen und schickt es per Resend an uns.
 * Ohne konfigurierten Mailversand bekommt der Besucher einen vorausgefüllten E-Mail-Link.
 */
export const meta: Route.MetaFunction = () => [
  {title: 'TERRA CLOUD anfragen | terra-computershop.de'},
  {name: 'robots', content: 'noindex, follow'},
];

export type CloudInquiryResult =
  | {ok: true; sent: true}
  | {ok: true; sent: false; mailto: string}
  | {ok: false; error: string};

const clean = (v: FormDataEntryValue | null, max = 2000) => String(v ?? '').trim().slice(0, max);

export async function action({request, context}: Route.ActionArgs): Promise<CloudInquiryResult> {
  const fd = await request.formData();
  if (clean(fd.get('website'))) return {ok: false, error: 'Ungültige Anfrage.'};
  const f = {
    company: clean(fd.get('company'), 200),
    name: clean(fd.get('name'), 200),
    email: clean(fd.get('email'), 200),
    phone: clean(fd.get('phone'), 60),
    interest: fd.getAll('interest').map((x) => clean(x, 80)).filter(Boolean).join(', '),
    message: clean(fd.get('message')),
    page: clean(fd.get('page'), 200),
    topic: clean(fd.get('topic'), 60) === 'Server-Anfrage' ? 'Server-Anfrage' : 'Cloud-Anfrage',
  };
  if (!f.name || !/^\S+@\S+\.\S+$/.test(f.email)) {
    return {ok: false, error: 'Bitte Name und eine gültige E-Mail-Adresse angeben.'};
  }

  const subject = `${f.topic}: ${f.interest || (f.topic === 'Server-Anfrage' ? 'TERRA SERVER' : 'TERRA CLOUD')} – ${f.company || f.name}`;
  const text = [
    f.topic === 'Server-Anfrage' ? 'Neue Server-Anfrage über terra-computershop.de' : 'Neue Anfrage zur TERRA CLOUD über terra-computershop.de',
    '',
    `Firma: ${f.company || '–'}`,
    `Name: ${f.name}`,
    `E-Mail: ${f.email}`,
    `Telefon: ${f.phone || '–'}`,
    `Interesse: ${f.interest || '–'}`,
    `Seite: ${f.page || '–'}`,
    '',
    f.message || '(keine Nachricht)',
  ].join('\n');

  const {env} = context;
  if (env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json'},
        body: JSON.stringify({
          from: env.WIDERRUF_FROM || 'terra-computershop.de <widerruf@terra-computershop.de>',
          to: [env.WIDERRUF_NOTIFY || COMPANY.email],
          reply_to: f.email,
          subject,
          text,
        }),
      });
      if (res.ok) return {ok: true, sent: true};
      console.error('Cloud-Anfrage: Resend', res.status);
    } catch (e) {
      console.error('Cloud-Anfrage Fehler', e);
    }
  }
  const mailto = `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  return {ok: true, sent: false, mailto};
}

export default function CloudAnfrage() {
  return (
    <div className="container page-narrow cloud-page">
      <h1 className="page-title">TERRA CLOUD anfragen</h1>
      <p className="ratgeber-lead">
        Beschreiben Sie kurz, was Sie vorhaben – wir melden uns innerhalb eines Werktags mit einem Vorschlag
        und Preis.
      </p>
      <CloudInquiry />
    </div>
  );
}
