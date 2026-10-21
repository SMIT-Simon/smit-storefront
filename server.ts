import * as serverBuild from 'virtual:react-router/server-build';
import {createRequestHandler, storefrontRedirect} from '@shopify/hydrogen';
import {createHydrogenRouterContext} from '~/lib/context';

/** Indien, Brasilien, Saudi-Arabien – siehe AGENTS.md */
const BLOCKED_COUNTRIES = new Set(['IN', 'BR', 'SA']);

const BLOCKED_HTML = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>terra-computershop.de</title><style>body{font-family:system-ui,sans-serif;max-width:560px;margin:15vh auto;padding:0 16px;color:#0b1f3a;line-height:1.5}h1{font-size:1.4rem}</style></head><body><h1>terra-computershop.de</h1><p>Dieser Shop liefert ausschließlich innerhalb der Europäischen Union.</p><p lang="en">This shop only delivers within the European Union.</p><p>Kontakt / Contact: <a href="mailto:info@wawi-servicepartner.de">info@wawi-servicepartner.de</a></p></body></html>`;

/**
 * Export a fetch handler in module format.
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    // Länder ohne Lieferung, aus denen nur Bot-Traffic kommt (Warenkorb-Spam in der Statistik).
    // USA/EU NICHT sperren – dort sitzen u. a. die Google-Prüfer für Shopping.
    const country = request.headers.get('oxygen-buyer-country')?.toUpperCase();
    if (country && BLOCKED_COUNTRIES.has(country)) {
      return new Response(BLOCKED_HTML, {
        status: 403,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Robots-Tag': 'noindex',
          'Cache-Control': 'no-store',
        },
      });
    }

    try {
      const hydrogenContext = await createHydrogenRouterContext(
        request,
        env,
        executionContext,
      );

      /**
       * Create a Hydrogen request handler that internally
       * delegates to React Router for routing and rendering.
       */
      const handleRequest = createRequestHandler({
        build: serverBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => hydrogenContext,
      });

      const response = await handleRequest(request);

      if (hydrogenContext.session.isPending) {
        response.headers.set(
          'Set-Cookie',
          await hydrogenContext.session.commit(),
        );
      }

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({
          request,
          response,
          storefront: hydrogenContext.storefront,
        });
      }

      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};
