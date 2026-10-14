import {useFetcher, useLocation} from 'react-router';
import {CLOUD_INTEREST_OPTIONS} from '~/lib/cloud';
import {COMPANY} from '~/lib/company';
import type {CloudInquiryResult} from '~/routes/cloud.anfrage';

/** Anfrageformular für TERRA CLOUD Leistungen (Preise auf Anfrage). */
export function CloudInquiry({
  preset,
  options = CLOUD_INTEREST_OPTIONS,
  topic,
}: {
  preset?: string;
  /** Auswahl-Chips (Standard: Cloud-Leistungen) */
  options?: string[];
  /** Betreff-Präfix der E-Mail, z. B. „Server-Anfrage“ */
  topic?: string;
}) {
  const fetcher = useFetcher<CloudInquiryResult>();
  const {pathname} = useLocation();
  const r = fetcher.data;
  const busy = fetcher.state !== 'idle';

  if (r?.ok && r.sent) {
    return (
      <div className="cloud-inquiry cloud-inquiry-done" role="status">
        <h3>Vielen Dank für Ihre Anfrage!</h3>
        <p>Wir melden uns innerhalb eines Werktags bei Ihnen – mit Vorschlag und Preis.</p>
      </div>
    );
  }
  if (r?.ok && !r.sent) {
    return (
      <div className="cloud-inquiry cloud-inquiry-done" role="status">
        <h3>Fast geschafft</h3>
        <p>
          Bitte senden Sie die vorbereitete E-Mail ab – dann liegt Ihre Anfrage direkt bei uns.
        </p>
        <a href={r.mailto} className="btn btn-primary">
          E-Mail öffnen
        </a>
        <p className="cloud-inquiry-alt">
          Oder rufen Sie uns an: <a href="tel:+4952469098980">{COMPANY.phone}</a>
        </p>
      </div>
    );
  }

  return (
    <fetcher.Form method="post" action="/cloud/anfrage" className="cloud-inquiry">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />
      <input type="hidden" name="page" value={pathname} />
      {topic ? <input type="hidden" name="topic" value={topic} /> : null}
      <fieldset className="cloud-interest">
        <legend>Was interessiert Sie?</legend>
        {options.map((o) => (
          <label key={o} className="cloud-chip">
            <input type="checkbox" name="interest" value={o} defaultChecked={o === preset} />
            <span>{o}</span>
          </label>
        ))}
      </fieldset>
      <div className="cloud-inquiry-grid">
        <label className="cfg-field">
          <span>Firma</span>
          <input name="company" autoComplete="organization" />
        </label>
        <label className="cfg-field">
          <span>Ihr Name *</span>
          <input name="name" required autoComplete="name" />
        </label>
        <label className="cfg-field">
          <span>E-Mail *</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label className="cfg-field">
          <span>Telefon</span>
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
      </div>
      <label className="cfg-field">
        <span>Ihr Vorhaben (z. B. Anzahl Benutzer, Server, Datenmenge)</span>
        <textarea name="message" rows={4} />
      </label>
      {r && !r.ok ? <p className="widerruf-error">{r.error}</p> : null}
      <div className="cloud-inquiry-actions">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Wird gesendet …' : 'Unverbindlich anfragen'}
        </button>
        <small>
          Preise auf Anfrage – Antwort innerhalb eines Werktags. Ihre Angaben verwenden wir nur zur
          Bearbeitung der Anfrage.
        </small>
      </div>
    </fetcher.Form>
  );
}
