import {useRef, type ReactNode} from 'react';

/**
 * Versandkosten-Hinweis als Modal (Warenkorb, Produktpreis).
 * Werte entsprechen dem Shopify-Versandprofil „Allgemeines Profil“ –
 * bei Änderungen dort bitte hier mitpflegen.
 * Ohne JavaScript führt der Link auf die Versandrichtlinie.
 */
export const SHIPPING_RATES = [
  {zone: 'Deutschland', countries: 'DE', price: '8,90 €'},
  {
    zone: 'EU',
    countries: 'Österreich, Belgien, Dänemark, Frankreich, Luxemburg, Niederlande',
    price: '24,90 €',
  },
];

export function ShippingInfoLink({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <a
        href="/policies/shipping-policy"
        className={className ? `shipping-info-link ${className}` : 'shipping-info-link'}
        onClick={(e) => {
          if (ref.current?.showModal) {
            e.preventDefault();
            e.stopPropagation();
            ref.current.showModal();
          }
        }}
      >
        {children}
      </a>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- Hintergrund-Klick; Esc schließt nativ */}
      <dialog
        ref={ref}
        className="eu-notice-dialog shipping-dialog"
        aria-label="Versandkosten"
        onClick={(e) => {
          e.stopPropagation();
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className="eu-notice-dialog-inner">
          <div className="eu-notice-dialog-head">
            <strong>Versandkosten</strong>
            <button type="button" onClick={() => ref.current?.close()} aria-label="Schließen">
              ×
            </button>
          </div>
          <table className="shipping-table">
            <thead>
              <tr>
                <th scope="col">Lieferung nach</th>
                <th scope="col">Versandkosten</th>
              </tr>
            </thead>
            <tbody>
              {SHIPPING_RATES.map((r) => (
                <tr key={r.zone}>
                  <td>
                    <strong>{r.zone}</strong>
                    {r.zone !== 'Deutschland' ? <small>{r.countries}</small> : null}
                  </td>
                  <td>{r.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            Pauschal pro Bestellung, unabhängig von Anzahl und Gewicht der Artikel. Alle Preise inkl. gesetzl. MwSt.
            Die genauen Versandkosten sehen Sie vor dem Absenden der Bestellung in der Kasse.
          </p>
          <p>
            Andere Länder auf Anfrage: <a href="mailto:info@wawi-servicepartner.de">info@wawi-servicepartner.de</a> ·{' '}
            <a href="tel:+4952469098980">+49 (0)5246-9098980</a> ·{' '}
            <a href="/policies/shipping-policy">Versandbedingungen</a>
          </p>
        </div>
      </dialog>
    </>
  );
}
