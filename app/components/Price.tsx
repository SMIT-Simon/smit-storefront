/**
 * Preisanzeige im deutschen Format ("1.299,00 €").
 * Ersetzt Hydrogens <Money>, das ohne ShopifyProvider immer en-US formatiert.
 */
export type MoneyLike = {
  amount?: string | number | null;
  currencyCode?: string | null;
};

const formatters = new Map<string, Intl.NumberFormat>();

export function formatPrice(money: MoneyLike): string {
  const currency = money.currencyCode || 'EUR';
  let f = formatters.get(currency);
  if (!f) {
    f = new Intl.NumberFormat('de-DE', {style: 'currency', currency});
    formatters.set(currency, f);
  }
  return f.format(Number(money.amount ?? 0));
}

export function Price({
  data,
  as: Tag = 'span',
  className,
}: {
  data: MoneyLike;
  as?: 'span' | 'div' | 'strong';
  className?: string;
  /** wird zur Kompatibilität mit <Money> akzeptiert */
  withoutTrailingZeros?: boolean;
}) {
  return <Tag className={className}>{formatPrice(data)}</Tag>;
}
