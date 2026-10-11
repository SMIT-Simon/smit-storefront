import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {VAT_RATE} from '~/lib/categories';

function netOf(price: Pick<MoneyV2, 'amount' | 'currencyCode'>): MoneyV2 {
  const gross = parseFloat(price.amount);
  return {
    amount: (gross / (1 + VAT_RATE)).toFixed(2),
    currencyCode: price.currencyCode,
  } as MoneyV2;
}

/** Netto-Hinweis unter einem Bruttopreis, z. B. "584,03 € netto". */
export function NetPrice({price}: {price?: Pick<MoneyV2, 'amount' | 'currencyCode'>}) {
  if (!price) return null;
  return (
    <span className="price-net">
      <Money as="span" data={netOf(price)} /> netto
    </span>
  );
}

export function ProductPrice({
  price,
  compareAtPrice,
  size = 'large',
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
  size?: 'large' | 'small';
}) {
  return (
    <div aria-label="Preis" className={`product-price product-price-${size}`} role="group">
      <div className="price-gross">
        {price ? <Money data={price} /> : <span>&nbsp;</span>}
        {compareAtPrice ? (
          <s className="price-compare">
            <Money data={compareAtPrice} />
          </s>
        ) : null}
      </div>
      <div className="price-meta">
        <span>inkl. 19&nbsp;% MwSt., zzgl. Versand</span>
        {price ? <NetPrice price={price} /> : null}
      </div>
    </div>
  );
}
