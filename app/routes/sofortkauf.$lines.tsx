import {redirect} from 'react-router';
import type {Route} from './+types/sofortkauf.$lines';

/**
 * Sofortkauf: legt einen separaten Warenkorb nur mit den übergebenen Artikeln an
 * und leitet direkt in den Shopify-Checkout (dort u. a. PayPal Express).
 * Der normale Warenkorb des Kunden bleibt unverändert.
 * URL: /sofortkauf/<variantId>:<menge>,<variantId>:<menge>
 */
export async function loader({context, params}: Route.LoaderArgs) {
  const lines = (params.lines ?? '')
    .split(',')
    .map((l) => l.split(':'))
    .filter(([id, q]) => /^\d+$/.test(id) && /^\d+$/.test(q ?? '1'))
    .map(([id, q]) => ({
      merchandiseId: `gid://shopify/ProductVariant/${id}`,
      quantity: Math.max(1, Math.min(999, parseInt(q ?? '1', 10))),
    }));
  if (!lines.length) return redirect('/cart');

  const result = await context.cart.create({lines});
  const checkoutUrl = result.cart?.checkoutUrl;
  if (result.errors?.length || !checkoutUrl) {
    throw new Response('Der Sofortkauf konnte nicht gestartet werden.', {status: 410});
  }
  return redirect(checkoutUrl);
}
