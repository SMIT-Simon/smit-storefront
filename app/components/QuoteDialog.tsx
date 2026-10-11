import {useEffect, useRef, useState} from 'react';
import type {OptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {Icon} from '~/components/Icon';
import type {QuoteCustomer, QuoteLine} from '~/lib/quote-pdf';

const STORAGE_KEY = 'smit-quote-customer';
const EMPTY: QuoteCustomer = {
  company: '',
  contact: '',
  street: '',
  zipCity: '',
  email: '',
  phone: '',
  vatId: '',
  reference: '',
  note: '',
};

const FIELDS: {key: keyof QuoteCustomer; label: string; required?: boolean; type?: string; wide?: boolean; autoComplete?: string}[] = [
  {key: 'company', label: 'Firma', required: true, wide: true, autoComplete: 'organization'},
  {key: 'contact', label: 'Ansprechpartner', autoComplete: 'name'},
  {key: 'reference', label: 'Ihr Zeichen / Projekt'},
  {key: 'street', label: 'Straße und Hausnummer', required: true, wide: true, autoComplete: 'street-address'},
  {key: 'zipCity', label: 'PLZ und Ort', required: true, autoComplete: 'address-level2'},
  {key: 'vatId', label: 'USt-IdNr. (optional)'},
  {key: 'email', label: 'E-Mail', type: 'email', autoComplete: 'email'},
  {key: 'phone', label: 'Telefon', type: 'tel', autoComplete: 'tel'},
];

/** Button + Dialog: Warenkorb als PDF-Angebot herunterladen. */
export function QuoteButton({cart}: {cart: OptimisticCart<CartApiQueryFragment | null>}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [data, setData] = useState<QuoteCustomer>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setData({...EMPTY, ...(JSON.parse(saved) as Partial<QuoteCustomer>), note: ''});
    } catch {
      /* ohne gespeicherte Daten weiter */
    }
  }, []);

  const lines: QuoteLine[] = (cart?.lines?.nodes ?? []).map((line) => {
    const m = line.merchandise as {
      sku?: string | null;
      title?: string;
      product?: {title?: string};
    };
    return {
      sku: m.sku ?? '',
      title: m.product?.title ?? '',
      variant: m.title,
      quantity: line.quantity,
      unitGross: Number(line.cost?.amountPerQuantity?.amount ?? 0),
    };
  });

  if (!lines.length) return null;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({...data, note: ''}));
      } catch {
        /* Speichern optional */
      }
      const {downloadQuotePdf} = await import('~/lib/quote-pdf');
      await downloadQuotePdf(data, lines);
      dialog.current?.close();
    } catch (err) {
      console.error(err);
      setError('Das PDF konnte nicht erstellt werden. Bitte versuchen Sie es erneut.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary btn-block quote-btn"
        onClick={() => dialog.current?.showModal()}
      >
        <Icon name="invoice" size={18} /> PDF-Angebot erstellen
      </button>

      <dialog ref={dialog} className="quote-dialog" aria-labelledby="quote-title">
        <form method="dialog" onSubmit={submit}>
          <div className="quote-head">
            <div>
              <h2 id="quote-title">Angebot als PDF</h2>
              <p>
                Ihre Firmendaten erscheinen als Empfänger im Angebot. Die Daten
                bleiben in Ihrem Browser und werden nicht an uns übertragen.
              </p>
            </div>
            <button
              type="button"
              className="quote-close"
              aria-label="Schließen"
              onClick={() => dialog.current?.close()}
            >
              ×
            </button>
          </div>

          <div className="quote-grid">
            {FIELDS.map((f) => (
              <label key={f.key} className={f.wide ? 'wide' : undefined}>
                <span>
                  {f.label}
                  {f.required ? ' *' : ''}
                </span>
                <input
                  type={f.type ?? 'text'}
                  required={f.required}
                  autoComplete={f.autoComplete}
                  value={data[f.key]}
                  onChange={(e) => setData({...data, [f.key]: e.target.value})}
                />
              </label>
            ))}
            <label className="wide">
              <span>Bemerkung (optional)</span>
              <textarea
                rows={2}
                value={data.note}
                onChange={(e) => setData({...data, note: e.target.value})}
              />
            </label>
          </div>

          <p className="quote-summary">
            {lines.length} {lines.length === 1 ? 'Position' : 'Positionen'} ·
            Preise im Angebot netto zzgl. MwSt.
          </p>
          {error ? <p className="quote-error">{error}</p> : null}

          <div className="quote-actions">
            <button type="button" className="btn btn-secondary" onClick={() => dialog.current?.close()}>
              Abbrechen
            </button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Wird erstellt …' : 'PDF herunterladen'}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
