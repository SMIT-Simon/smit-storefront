import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';

/** Lädt mehrere Produkte per Handle in einer Abfrage (ein Alias je Handle). */
export type CardProductData = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  productType: string;
  featuredImage?: {id?: string; url: string; altText?: string; width?: number; height?: number};
  priceRange: {minVariantPrice: {amount: string; currencyCode: CurrencyCode}};
};

const FIELDS = `
  id handle title vendor productType
  featuredImage { id url altText width height }
  priceRange { minVariantPrice { amount currencyCode } }
`;

type Storefront = {
  query: (...args: never[]) => Promise<unknown>;
  CacheLong: () => unknown;
};

export async function productsByHandle(
  storefront: Storefront,
  handles: string[],
): Promise<Record<string, CardProductData>> {
  const safe = handles.filter((h) => /^[a-z0-9-]+$/.test(h));
  if (!safe.length) return {};
  const body = safe.map((h, i) => `p${i}: product(handle: "${h}") { ${FIELDS} }`).join('\n');
  const query = `query ProductsByHandle($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) { ${body} }`;
  const run = storefront.query as unknown as (
    q: string,
    o: {cache: unknown},
  ) => Promise<Record<string, CardProductData | null>>;
  const res = await run.call(storefront, query, {cache: storefront.CacheLong()});
  const out: Record<string, CardProductData> = {};
  for (const v of Object.values(res ?? {})) if (v?.handle) out[v.handle] = v;
  return out;
}
