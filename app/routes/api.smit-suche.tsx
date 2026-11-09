import type {Route} from './+types/api.smit-suche';
import {runSmitSuche, smitSucheParamsFromUrl} from '~/lib/smit-suche.server';

/**
 * SMIT Suche – Datenquelle für das Such-Fenster (components/SmitSuche.tsx).
 * GET /api/smit-suche?q=…&sort=relevance|price-asc|price-desc&after=<cursor>&f=<JSON ProductFilter[]>
 */
export async function loader({request, context}: Route.LoaderArgs) {
  const result = await runSmitSuche(context.storefront, smitSucheParamsFromUrl(new URL(request.url)));
  return Response.json(result, {headers: {'Cache-Control': 'public, max-age=60'}});
}
