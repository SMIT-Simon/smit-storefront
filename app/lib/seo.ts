/**
 * Zentrale SEO-Angaben. Die Shop-Domain wird für Canonical-URLs,
 * Open Graph und strukturierte Daten (schema.org) verwendet.
 */
import {COMPANY} from '~/lib/company';

export const SITE_URL = 'https://terra-computershop.de';
export const SITE_NAME = 'terra-computershop.de';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/home/slide-familie.webp`;

/** Parameter, die eigenständige, indexierbare Seiten erzeugen. */
const INDEXABLE_PARAMS = ['sub'];

export function canonicalUrl(pathname: string, search: string) {
  const params = new URLSearchParams(search);
  const keep = new URLSearchParams();
  for (const k of INDEXABLE_PARAMS) {
    const v = params.get(k);
    if (v) keep.set(k, v);
  }
  const q = keep.toString();
  const path = pathname !== '/' ? pathname.replace(/\/$/, '') : '/';
  return `${SITE_URL}${path}${q ? `?${q}` : ''}`;
}

/** Filter-, Sortier- und Blätterseiten nicht in den Index aufnehmen. */
export function isNoindex(pathname: string, search: string) {
  const p = new URLSearchParams(search);
  return (
    p.has('f') ||
    p.has('cursor') ||
    pathname.startsWith('/search') ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/sofortkauf')
  );
}

export function absUrl(path: string) {
  return path.startsWith('http') ? path : `${SITE_URL}${path}`;
}

/** Händler + Website (mit Suchfeld) für Google. */
export function siteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Store', 'LocalBusiness'],
        '@id': `${SITE_URL}/#store`,
        name: `${SITE_NAME} – ${COMPANY.name}`,
        alternateName: 'TERRA Computer Shop',
        description:
          'Online-Shop für TERRA Notebooks, PCs, Monitore, Server und Zubehör von WORTMANN – mit Beratung und Einrichtung durch das Systemhaus aus Verl.',
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo-smit-pdf.png`,
        image: DEFAULT_OG_IMAGE,
        email: COMPANY.email,
        telephone: '+49-5246-9098980',
        vatID: COMPANY.vatId,
        founder: {'@type': 'Person', name: COMPANY.owner},
        address: {
          '@type': 'PostalAddress',
          streetAddress: COMPANY.street,
          postalCode: '33415',
          addressLocality: 'Verl',
          addressRegion: 'Nordrhein-Westfalen',
          addressCountry: 'DE',
        },
        areaServed: 'DE',
        sameAs: ['https://systemhaus-verl.de/'],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: 'de-DE',
        publisher: {'@id': `${SITE_URL}/#store`},
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };
}
