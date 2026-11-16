import {Link} from 'react-router';
import {Icon} from '~/components/Icon';
import {PC_OF_MONTH} from '~/lib/promo';

/** Banner „PC des Monats“ (Startseite, TERRA-PC-Themenseite) – nur anzeigen, solange promoActive(). */
export function PromoStrip() {
  return (
    <Link to={PC_OF_MONTH.path} className="promo-strip" prefetch="intent">
      <span className="container promo-strip-inner">
        <span className="promo-strip-badge">PC des Monats · {PC_OF_MONTH.month}</span>
        <span className="promo-strip-text">
          <strong>{PC_OF_MONTH.name}</strong> mit Windows 11 Pro – nur bis {PC_OF_MONTH.endLabel} zum Aktionspreis
        </span>
        <span className="promo-strip-cta">
          Zum Angebot <Icon name="arrow-right" size={16} />
        </span>
      </span>
    </Link>
  );
}
