import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {Price, type MoneyLike} from '~/components/Price';
import {AltPrice, ModePrice, usePriceMode} from '~/components/PriceMode';

/** Zweitpreis (netto bzw. brutto – je nach gewähltem Modus). */
export function NetPrice({price}: {price?: MoneyLike | null}) {
  return <AltPrice price={price} />;
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
  const {mode} = usePriceMode();
  return (
    <div aria-label="Preis" className={`product-price product-price-${size}`} role="group">
      <div className="price-gross">
        {price ? <ModePrice data={price} /> : <span>&nbsp;</span>}
        {compareAtPrice ? (
          <s className="price-compare">
            <Price data={compareAtPrice} />
          </s>
        ) : null}
      </div>
      <div className="price-meta">
        <span>
          {mode === 'net'
            ? 'netto, zzgl. 19\u00a0% MwSt. und Versand'
            : 'inkl. 19\u00a0% MwSt., zzgl. Versand'}
        </span>
        {price ? <AltPrice price={price} /> : null}
      </div>
    </div>
  );
}
