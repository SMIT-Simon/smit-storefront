import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  // Elfsight KI-Chatbot (wird erst nach Einwilligung bzw. Klick geladen)
  const ELFSIGHT = ['https://elfsightcdn.com', 'https://*.elfsightcdn.com', 'https://*.elfsight.com'];
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    defaultSrc: [...ELFSIGHT, 'data:', 'blob:'],
    scriptSrc: ["'self'", 'https://cdn.shopify.com', 'https://shopify.com', ...ELFSIGHT],
    styleSrc: [...ELFSIGHT, 'https://fonts.googleapis.com'],
    fontSrc: ["'self'", 'https://cdn.shopify.com', 'https://fonts.gstatic.com', 'data:', ...ELFSIGHT],
    imgSrc: ["'self'", 'https://cdn.shopify.com', 'data:', 'blob:', ...ELFSIGHT],
    connectSrc: [...ELFSIGHT, 'wss://*.elfsight.com'],
    frameSrc: ["'self'", 'https://shopify.com', ...ELFSIGHT],
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN || context.env.PUBLIC_STORE_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
