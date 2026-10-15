import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/flyer';
import {FLYER, flyerHandles, type FlyerHotspot} from '~/lib/flyer';
import {productsByHandle, type CardProductData} from '~/lib/products-by-handle.server';
import {ProductItem} from '~/components/ProductItem';
import {ModePrice} from '~/components/PriceMode';
import {Icon} from '~/components/Icon';
import {siteImg} from '~/lib/site-images';

export const meta: Route.MetaFunction = () => [
  {title: `${FLYER.title} – Business-Flyer zum Durchklicken`},
  {property: 'og:title', content: `${FLYER.title} – Business-Flyer`},
  {
    name: 'description',
    content:
      'Der aktuelle TERRA BUSINESS-Flyer von WORTMANN – alle Produkte direkt anklickbar und im Shop bestellbar.',
  },
];

export async function loader({context}: Route.LoaderArgs) {
  const products = await productsByHandle(context.storefront, flyerHandles()).catch(
    (e: Error) => {
      console.error(e);
      return {} as Record<string, CardProductData>;
    },
  );
  return {products};
}

export default function Flyer() {
  const {products} = useLoaderData<typeof loader>();
  return (
    <div className="flyer-page">
      <section className="flyer-hero">
        <div className="container flyer-hero-inner">
          <div>
            <span className="eyebrow">Aktueller Business-Flyer</span>
            <h1>{FLYER.title}</h1>
            <p className="flyer-sub">{FLYER.subtitle}</p>
            <p>
              Blättern Sie durch den aktuellen TERRA BUSINESS-Flyer der WORTMANN AG.
              Jedes Produkt ist anklickbar – direkt zur Produktseite mit Bestellung,
              Datenblatt und Angebot als PDF.
            </p>
            <div className="flyer-actions">
              <a href="#seite-1" className="btn btn-primary">
                Flyer ansehen <Icon name="arrow-right" size={18} />
              </a>
              <a href={FLYER.wortmannUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
                Blätterkatalog bei WORTMANN
              </a>
            </div>
            <p className="flyer-note">
              Hinweis: Die im Flyer abgedruckten Preise sind unverbindliche
              Preisempfehlungen der WORTMANN AG. Es gelten die aktuellen Preise im Shop.
            </p>
          </div>
          <nav className="flyer-thumbs" aria-label="Seiten">
            {FLYER.pages.map((p) => (
              <a key={p.page} href={`#seite-${p.page}`}>
                <img {...siteImg(FLYER.image(p.page), '160px')} alt={`Seite ${p.page}`} loading="lazy" />
                <span>{p.page}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="container flyer-pages">
        {FLYER.pages.map((p) => {
          const items = p.hotspots
            .map((h) => (h.handle ? products[h.handle] : undefined))
            .filter((x): x is CardProductData => Boolean(x));
          return (
            <section key={p.page} id={`seite-${p.page}`} className="flyer-spread">
              <figure className="flyer-sheet">
                <img
                  {...siteImg(FLYER.image(p.page), '(min-width: 64em) 600px, 100vw')}
                  alt={`${FLYER.title}, Seite ${p.page}`}
                  width={p.w}
                  height={p.h}
                  loading={p.page <= 2 ? 'eager' : 'lazy'}
                />
                {p.hotspots.map((h) => (
                  <Hotspot key={`${h.sku}-${h.y}`} h={h} product={h.handle ? products[h.handle] : undefined} />
                ))}
                <figcaption>Seite {p.page}</figcaption>
              </figure>
              {items.length ? (
                <aside className="flyer-products" aria-label={`Produkte auf Seite ${p.page}`}>
                  <h2>Auf dieser Seite</h2>
                  <div className="flyer-product-list">
                    {items.map((prod) => (
                      <ProductItem key={prod.id} product={prod} />
                    ))}
                  </div>
                </aside>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Hotspot({h, product}: {h: FlyerHotspot; product?: CardProductData}) {
  const style = {left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%`};
  if (product) {
    return (
      <Link
        to={`/products/${product.handle}`}
        className="flyer-hotspot"
        style={style}
        prefetch="intent"
        aria-label={`${product.title} im Shop ansehen`}
      >
        <span className="flyer-hotspot-tag">
          <ModePrice data={product.priceRange.minVariantPrice} />
          <Icon name="cart" size={14} />
        </span>
      </Link>
    );
  }
  return (
    <Link
      to="/pages/kontakt"
      className="flyer-hotspot is-request"
      style={style}
      aria-label={`${h.title || h.sku} – auf Anfrage`}
    >
      <span className="flyer-hotspot-tag">Auf Anfrage</span>
    </Link>
  );
}
