import {useLocation} from 'react-router';
import {canonicalUrl, DEFAULT_OG_IMAGE, isNoindex, SITE_NAME, siteJsonLd} from '~/lib/seo';

/** Canonical, Open-Graph-Grundwerte und strukturierte Shop-Daten für jede Seite. */
export function SeoHead() {
  const {pathname, search} = useLocation();
  const canonical = canonicalUrl(pathname, search);
  return (
    <>
      <link rel="canonical" href={canonical} />
      {isNoindex(pathname, search) ? <meta name="robots" content="noindex, follow" /> : null}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="de_DE" />
      <meta property="og:type" content={pathname.startsWith('/products/') ? 'product' : 'website'} />
      <meta property="og:url" content={canonical} />
      {/^\/(products|loesungen)\/./.test(pathname) ? null : (
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      )}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="theme-color" content="#0b4f9c" />
      {pathname === '/' ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(siteJsonLd())}}
        />
      ) : null}
    </>
  );
}
