import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/aktion.pc-des-monats';
import {Icon} from '~/components/Icon';
import {ModePrice} from '~/components/PriceMode';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {COMPANY} from '~/lib/company';
import {SITE_URL, pageTitle} from '~/lib/seo';
import {PC_OF_MONTH, promoActive} from '~/lib/promo';

const P = PC_OF_MONTH;
const TITLE = `PC des Monats ${P.month}: ${P.name} zum Aktionspreis`;
const DESCRIPTION = `${P.name} mit Intel Core i3 der 14. Generation, Windows 11 Pro, 500 GB SSD und Triple-Monitor-Support – nur im ${P.month} zum Sonderpreis. Original TERRA von WORTMANN.`;

export const meta: Route.MetaFunction = () => [
  {title: pageTitle(TITLE)},
  {name: 'description', content: DESCRIPTION},
  {property: 'og:title', content: TITLE},
  {property: 'og:description', content: DESCRIPTION},
  {tagName: 'link', rel: 'canonical', href: `${SITE_URL}${P.path}`},
];

export async function loader({context}: Route.LoaderArgs) {
  const {product} = await context.storefront.query(PROMO_PRODUCT_QUERY, {
    variables: {handle: P.handle},
    cache: context.storefront.CacheShort(),
  });
  return {product, active: promoActive()};
}

const USES = [
  {icon: 'desktop' as const, title: 'Büro & Verwaltung', text: 'Office, E-Mail, ERP und Browser – flüssig und leise auf bis zu drei Monitoren.'},
  {icon: 'user' as const, title: 'Empfang & Kasse', text: 'Dank VESA-Halterung unsichtbar hinter dem Monitor – mehr Platz auf dem Tresen.'},
  {icon: 'monitor' as const, title: 'Schulung & Homeoffice', text: 'Klein, sparsam (ca. 10 W im Leerlauf) und mit Wi-Fi 6E schnell überall einsatzbereit.'},
];

const FAQ = [
  {q: 'Wie lange gilt der Aktionspreis?', a: `Der Sonderpreis gilt bis zum ${P.endLabel} bzw. solange der Vorrat reicht.`},
  {q: 'Kann ich den PC aufrüsten?', a: 'Ja. Der Arbeitsspeicher lässt sich bis 64 GB erweitern, dazu sind ein zweiter M.2-Steckplatz und ein 2,5"-Schacht frei. Gerne liefern wir ihn direkt mit mehr RAM oder SSD – fragen Sie einfach an.'},
  {q: 'Sind Tastatur und Maus dabei?', a: 'Nein, Tastatur und Maus sind optional. Passende TERRA Eingabegeräte und Monitore finden Sie im Shop oder wir bieten sie Ihnen gerne mit an.'},
  {q: 'Gibt es einen Vor-Ort-Service?', a: 'Standard sind 24 Monate Bring-In-Service. Auf der Produktseite können Sie einen 24h-Vor-Ort-Service mit bis zu 60 Monaten Laufzeit dazubuchen.'},
];

export default function PcOfMonth() {
  const {product, active} = useLoaderData<typeof loader>();
  const {open} = useAside();
  const v = product?.selectedOrFirstAvailableVariant;
  const img = product?.featuredImage;
  const saving =
    v?.compareAtPrice && Number(v.compareAtPrice.amount) > Number(v.price.amount)
      ? {amount: (Number(v.compareAtPrice.amount) - Number(v.price.amount)).toFixed(2), currencyCode: v.price.currencyCode}
      : null;
  const subject = `Anfrage ${P.name} (PC des Monats ${P.month})`;
  const mailto = `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Guten Tag,\n\nich interessiere mich für den ${P.name}.\n\nStückzahl: \nWünsche (RAM, SSD, Service): \n\nFirma / Name: \nTelefon: `)}`;

  return (
    <div className="promo-page">
      <section className="promo-hero">
        <div className="container promo-hero-inner">
          <div className="promo-hero-media">
            {img ? (
              <img
                src={`${img.url}&width=720`}
                srcSet={[360, 540, 720, 960].map((w) => `${img.url}&width=${w} ${w}w`).join(', ')}
                sizes="(min-width: 64em) 520px, 90vw"
                width={img.width ?? 720}
                height={img.height ?? 720}
                alt={img.altText || P.name}
                fetchPriority="high"
              />
            ) : null}
            {active && saving ? (
              <span className="promo-burst">
                <small>Sie sparen</small>
                <ModePrice data={saving} />
              </span>
            ) : null}
          </div>
          <div className="promo-hero-body">
            <span className="promo-badge">
              <Icon name="check" size={14} /> PC des Monats · {P.month}
            </span>
            <h1>{P.name}</h1>
            <p className="promo-claim">{P.claim}</p>
            <ul className="promo-bullets">
              {P.bullets.map((b) => (
                <li key={b}>
                  <Icon name="check" size={16} />
                  {b}
                </li>
              ))}
            </ul>
            {v ? (
              <div className="promo-buy">
                <div className="promo-price">
                  <ModePrice data={v.price} as="strong" />
                  {v.compareAtPrice && Number(v.compareAtPrice.amount) > Number(v.price.amount) ? (
                    <span className="promo-was">
                      statt <s><ModePrice data={v.compareAtPrice} /></s>
                    </span>
                  ) : null}
                </div>
                <div className="promo-actions">
                  {v.availableForSale ? (
                    <AddToCartButton
                      lines={[{merchandiseId: v.id, quantity: 1, selectedVariant: v}]}
                      onClick={() => open('cart')}
                    >
                      In den Warenkorb
                    </AddToCartButton>
                  ) : null}
                  <Link to={`/products/${product!.handle}`} className="btn btn-secondary" prefetch="intent">
                    Details & Vor-Ort-Service
                  </Link>
                </div>
                <p className="promo-note">
                  {active
                    ? `Aktionspreis gültig bis ${P.endLabel}, solange der Vorrat reicht · Art.-Nr. ${v.sku}`
                    : `Die Aktion „PC des Monats ${P.month}“ ist beendet – den ${P.name} erhalten Sie weiterhin zum aktuellen Shop-Preis.`}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Wofür sich der {P.name} eignet</h2>
          </div>
          <div className="promo-uses">
            {USES.map((u) => (
              <article key={u.title} className="promo-use">
                <span className="promo-use-icon">
                  <Icon name={u.icon} size={22} />
                </span>
                <h3>{u.title}</h3>
                <p>{u.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container promo-b2b">
          <div>
            <span className="eyebrow">Für Unternehmen</span>
            <h2>Mehrere Arbeitsplätze ausstatten?</h2>
            <p>
              Für größere Stückzahlen geben wir gerne Projektrabatte – auch mit Monitor, Tastatur/Maus, mehr Arbeitsspeicher,
              Einrichtung und 24h-Vor-Ort-Service. Sie erhalten ein Angebot innerhalb eines Werktags.
            </p>
          </div>
          <div className="promo-b2b-actions">
            <a href={mailto} className="btn btn-primary">
              Projektangebot anfragen <Icon name="arrow-right" size={16} />
            </a>
            <a href={`tel:${COMPANY.phone.replace(/[^\d+]/g, '').replace('+490', '+49')}`} className="btn btn-secondary">
              <Icon name="headset" size={16} /> {COMPANY.phone}
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container promo-faq">
          <h2>Häufige Fragen</h2>
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

const PROMO_PRODUCT_QUERY = `#graphql
  query PromoProduct($handle: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      handle
      title
      featuredImage { url altText width height }
      selectedOrFirstAvailableVariant {
        id
        sku
        availableForSale
        title
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        image { url altText width height }
        product { title handle }
        selectedOptions { name value }
      }
    }
  }
` as const;
