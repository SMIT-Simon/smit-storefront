import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/policies.$handle';
import {type Shop} from '@shopify/hydrogen/storefront-api-types';

type SelectedPolicies = keyof Pick<
  Shop,
  'privacyPolicy' | 'shippingPolicy' | 'termsOfService' | 'refundPolicy' | 'legalNotice'
>;

/** Deutsche Seitentitel (Shopify liefert teils englische Standardtitel). */
const GERMAN_TITLES: Record<string, string> = {
  shippingPolicy: 'Versand',
  refundPolicy: 'Widerrufsrecht',
  privacyPolicy: 'Datenschutzerklärung',
  termsOfService: 'AGB',
  legalNotice: 'Impressum',
};

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: data?.policy.title ?? 'Rechtliches'}];
};

export async function loader({params, context}: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Response('No handle was passed in', {status: 404});
  }

  const policyName = params.handle.replace(
    /-([a-z])/g,
    (_: unknown, m1: string) => m1.toUpperCase(),
  ) as SelectedPolicies;

  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      legalNotice: false,
      [policyName]: true,
      language: context.storefront.i18n?.language,
    },
  });

  const policy = data.shop?.[policyName];

  if (!policy) {
    throw new Response('Diese Seite wurde nicht gefunden', {status: 404});
  }

  return {policy: {...policy, title: GERMAN_TITLES[policyName] ?? policy.title}};
}

export default function Policy() {
  const {policy} = useLoaderData<typeof loader>();

  return (
    <div className="container page-narrow policy">
      <nav className="breadcrumb" aria-label="Brotkrumen">
        <Link to="/">Startseite</Link>
        <span aria-hidden="true">/</span>
        <span>{policy.title}</span>
      </nav>
      <h1 className="page-title">{policy.title}</h1>
      <div
        className="rich-text"
        dangerouslySetInnerHTML={{__html: policy.body}}
      />
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/Shop
const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $country: CountryCode
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $refundPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
    $legalNotice: Boolean!
  ) @inContext(language: $language, country: $country) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
      legalNotice @include(if: $legalNotice) {
        ...Policy
      }
    }
  }
` as const;
