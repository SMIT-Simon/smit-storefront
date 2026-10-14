import {PAYMENT_ICONS, paymentIconSrc} from '~/lib/payment';

/** Zeile mit allen Zahlungssymbolen – auch im Footer genutzt */
export function PaymentIconRow({compact = false}: {compact?: boolean}) {
  return (
    <ul className={compact ? 'payment-icons payment-icons-compact' : 'payment-icons'} aria-label="Akzeptierte Zahlungsarten">
      {PAYMENT_ICONS.map((p) => (
        <li key={p.file}>
          <img src={paymentIconSrc(p.file)} alt={p.label} width={compact ? 38 : 57} height={compact ? 24 : 36} loading="lazy" />
        </li>
      ))}
    </ul>
  );
}
