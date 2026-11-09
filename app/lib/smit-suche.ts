/** SMIT Suche – gemeinsame Typen für Such-Fenster, Ergebnisseite und Server (siehe smit-suche.server.ts). */
export type Money = {amount: string; currencyCode: string};
export type FilterValue = {id: string; label: string; count: number; input: string};
export type SmitSucheFilter = {id: string; label: string; type: string; values: FilterValue[]};

export type SmitSucheProduct = {
  handle: string;
  title: string;
  vendor: string;
  image: string | null;
  price: Money;
  priceVaries: boolean;
  compareAt: Money | null;
  available: boolean;
  variantId: string | null;
  sku: string;
};
export type SmitSucheResult = {
  term: string;
  count: number;
  products: SmitSucheProduct[];
  filters: SmitSucheFilter[];
  hasNextPage: boolean;
  endCursor: string | null;
  collections: Array<{title: string; handle: string}>;
  queries: string[];
  fallback: boolean;
};

export type SmitSucheSort = 'relevance' | 'price-asc' | 'price-desc';

export function emptySmitSucheResult(term: string): SmitSucheResult {
  return {term, count: 0, products: [], filters: [], hasNextPage: false, endCursor: null, collections: [], queries: [], fallback: false};
}

