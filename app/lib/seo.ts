/**
 * Zentrale SEO-Angaben. Die Shop-Domain wird für Canonical-URLs,
 * Open Graph und strukturierte Daten (schema.org) verwendet.
 */
import {COMPANY} from '~/lib/company';

export const SITE_URL = 'https://www.terra-computershop.de';
export const SITE_NAME = 'terra-computershop.de';
/**
 * Seitentitel: Google zeigt ca. 580 px (≈ 60 Zeichen). Der Shopname wird nur angehängt,
 * wenn er noch hineinpasst – sonst bleibt der Titel ohne Zusatz (Google blendet den
 * Websitenamen ohnehin separat ein).
 */
export function pageTitle(title: string) {
  const suffix = ` | ${SITE_NAME}`;
  return title.length + suffix.length <= 60 ? `${title}${suffix}` : title;
}

/** Meta-Description auf sinnvolle Länge bringen (≈ 120–155 Zeichen). */
export function metaDescription(text: string, extra: string) {
  let d = text.trim();
  if (d.length < 120) d = `${d} ${extra}`.trim();
  if (d.length <= 158) return d;
  const cut = d.slice(0, 155);
  return `${cut.slice(0, cut.lastIndexOf(' '))} …`;
}

export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;

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

/**
 * Versand- und Rückgabeangaben für Google (Produkt-Snippets / Merchant Listings).
 * Muss zu Versandprofil und Widerrufsbelehrung passen: DE 8,90 € (3–5 Werktage),
 * AT/BE/DK 24,90 € (5–8 Werktage); 14 Tage Widerruf, Rücksendekosten trägt der Kunde.
 */
const shipping = (countries: string[], value: number, minDays: number, maxDays: number) =>
  countries.map((c) => ({
    '@type': 'OfferShippingDetails',
    shippingRate: {'@type': 'MonetaryAmount', value: value.toFixed(2), currency: 'EUR'},
    shippingDestination: {'@type': 'DefinedRegion', addressCountry: c},
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: {'@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY'},
      transitTime: {'@type': 'QuantitativeValue', minValue: minDays, maxValue: maxDays, unitCode: 'DAY'},
    },
  }));

export const OFFER_SHIPPING_DETAILS = [
  ...shipping(['DE'], 8.9, 3, 5),
  ...shipping(['AT', 'BE', 'DK'], 24.9, 5, 8),
];

export const OFFER_RETURN_POLICY = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: ['DE', 'AT', 'BE', 'DK'],
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: 14,
  returnMethod: 'https://schema.org/ReturnByMail',
  returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
};
