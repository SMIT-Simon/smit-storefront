import {useState} from 'react';
import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  CurrencyCode,
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';
import type {CardProductData} from '~/lib/products-by-handle.server';
import {ADDONS, ADDON_GROUP_TITLES, type AddonGroup} from '~/lib/addons';
import {ModePrice, usePriceMode} from '~/components/PriceMode';

export function ProductForm({
  productOptions,
  selectedVariant,
  addons = [],
  accessories = [],
  service = null,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  addons?: CardProductData[];
  accessories?: CardProductData[];
  service?: ServiceProduct | null;
}) {
  const [serviceVariant, setServiceVariant] = useState<string | null>(null);
  const [picked, setPicked] = useState<Partial<Record<AddonGroup, string>>>({});
  const [accQty, setAccQty] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  const {open} = useAside();
  const [quantity, setQuantity] = useState(1);
  const available = Boolean(selectedVariant?.availableForSale);

  const extraLines = [
    ...(serviceVariant ? [{merchandiseId: serviceVariant, quantity}] : []),
    ...Object.values(picked)
      .map((h) => addons.find((a) => a.handle === h))
      .filter((a): a is CardProductData => Boolean(a?.selectedOrFirstAvailableVariant?.id))
      .map((a) => ({merchandiseId: a.selectedOrFirstAvailableVariant!.id, quantity})),
    ...accessories
      .filter((a) => (accQty[a.handle] ?? 0) > 0 && a.selectedOrFirstAvailableVariant?.id)
      .map((a) => ({merchandiseId: a.selectedOrFirstAvailableVariant!.id, quantity: accQty[a.handle]})),
  ];
  const lines = selectedVariant
    ? [{merchandiseId: selectedVariant.id, quantity, selectedVariant}, ...extraLines]
    : [];
  const buyNowHref = selectedVariant
    ? `/sofortkauf/${lines
        .map((l) => `${l.merchandiseId.split('/').pop()}:${l.quantity}`)
        .join(',')}`
    : '';

  return (
    <div className="product-form">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div className="product-options" key={option.name}>
            <h3 className="product-options-label">{option.name}</h3>
            <div className="product-options-grid">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const cls = [
                  'product-options-item',
                  selected ? 'selected' : '',
                  available ? '' : 'unavailable',
                ]
                  .filter(Boolean)
                  .join(' ');

                if (isDifferentProduct) {
                  return (
                    <Link
                      className={cls}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                }
                return (
                  <button
                    type="button"
                    className={cls}
                    key={option.name + name}
                    disabled={!exists}
                    onClick={() => {
                      if (!selected) {
                        void navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                  >
                    <ProductOptionSwatch swatch={swatch} name={name} />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {accessories.length ? (
        <AccessoryPicker items={accessories} qty={accQty} setQty={setAccQty} />
      ) : null}

      {service?.variants.nodes.length ? (
        <ServicePicker service={service} value={serviceVariant} onChange={setServiceVariant} />
      ) : null}

      {addons.length ? (
        <AddonPicker addons={addons} picked={picked} setPicked={setPicked} />
      ) : null}

      <div className="buy-row">
        <div className="qty" aria-label="Menge">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Menge verringern"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value || '1', 10)))
            }
            aria-label="Menge"
          />
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Menge erhöhen"
          >
            +
          </button>
        </div>
        <AddToCartButton
          disabled={!selectedVariant || !available}
          onClick={() => open('cart')}
          lines={lines}
        >
          {available ? 'In den Warenkorb' : 'Derzeit nicht verfügbar'}
        </AddToCartButton>
      </div>
      {available && buyNowHref ? (
        <a href={buyNowHref} className="btn btn-buynow btn-block" rel="nofollow">
          Sofort kaufen
          <span className="buynow-methods">PayPal · Kreditkarte · Rechnung</span>
        </a>
      ) : null}
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{backgroundColor: color || 'transparent'}}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}

function AddonPicker({
  addons,
  picked,
  setPicked,
}: {
  addons: CardProductData[];
  picked: Partial<Record<AddonGroup, string>>;
  setPicked: (p: Partial<Record<AddonGroup, string>>) => void;
}) {
  const {mode} = usePriceMode();
  const byHandle = new Map(addons.map((a) => [a.handle, a]));
  const groups = (Object.keys(ADDON_GROUP_TITLES) as AddonGroup[])
    .map((g) => ({
      g,
      items: ADDONS.filter((x) => x.group === g && byHandle.has(x.handle)),
    }))
    .filter((x) => x.items.length);
  return (
    <fieldset className="addons">
      <legend>Dazu bestellen</legend>
      {groups.map(({g, items}) => (
        <div key={g} className="addon-group">
          <span className="addon-group-title">{ADDON_GROUP_TITLES[g]}</span>
          {items.map((x) => {
            const p = byHandle.get(x.handle)!;
            const checked = picked[g] === x.handle;
            return (
              <label key={x.handle} className={checked ? 'addon checked' : 'addon'}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    setPicked({...picked, [g]: checked ? undefined : x.handle})
                  }
                />
                <span className="addon-text">
                  <strong>{x.label}</strong>
                  <small>{x.hint}</small>
                </span>
                <span className="addon-price">
                  + <ModePrice data={p.priceRange.minVariantPrice} />
                  <small>{mode === 'net' ? 'netto' : 'inkl. MwSt.'}</small>
                </span>
              </label>
            );
          })}
        </div>
      ))}
      <p className="addon-note">Wird in gleicher Menge wie das Gerät in den Warenkorb gelegt.</p>
    </fieldset>
  );
}

function AccessoryPicker({
  items,
  qty,
  setQty,
}: {
  items: CardProductData[];
  qty: Record<string, number>;
  setQty: (q: Record<string, number>) => void;
}) {
  const {mode} = usePriceMode();
  const set = (h: string, n: number) => setQty({...qty, [h]: Math.max(0, Math.min(99, n))});
  return (
    <div className="acc-picker">
      <h3>Passendes Zubehör</h3>
      {items.map((p) => {
        const n = qty[p.handle] ?? 0;
        const img = p.featuredImage;
        return (
          <div key={p.handle} className={n > 0 ? 'acc-item active' : 'acc-item'}>
            <Link to={`/products/${p.handle}`} className="acc-img" prefetch="intent">
              {img ? <img src={`${img.url}${img.url.includes('?') ? '&' : '?'}width=160`} alt={img.altText || p.title} loading="lazy" /> : null}
            </Link>
            <div className="acc-body">
              <Link to={`/products/${p.handle}`} className="acc-title" prefetch="intent">
                {p.title}
              </Link>
              <div className="qty qty-small acc-qty" aria-label={`Menge ${p.title}`}>
                <button type="button" onClick={() => set(p.handle, n - 1)} aria-label="weniger">−</button>
                <span className="qty-value">{n}</span>
                <button type="button" onClick={() => set(p.handle, n + 1)} aria-label="mehr">+</button>
                <span className="acc-unit">Stk</span>
              </div>
            </div>
            <div className="acc-price">
              <ModePrice data={p.priceRange.minVariantPrice} as="strong" />
              <small>{mode === 'net' ? 'netto' : 'inkl. MwSt.'}</small>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export type ServiceProduct = {
  id: string;
  title: string;
  variants: {
    nodes: {
      id: string;
      title: string;
      availableForSale: boolean;
      price: {amount: string; currencyCode: CurrencyCode};
    }[];
  };
};

function ServicePicker({
  service,
  value,
  onChange,
}: {
  service: ServiceProduct;
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const {mode} = usePriceMode();
  return (
    <fieldset className="addons service-picker">
      <legend>Serviceauswahl</legend>
      <label className={value === null ? 'addon checked' : 'addon'}>
        <input type="radio" name="service" checked={value === null} onChange={() => onChange(null)} />
        <span className="addon-text">
          <strong>Bring-In-Service 24 Monate</strong>
          <small>Standard-Herstellergarantie, Einsendung ins TERRA-Servicecenter</small>
        </span>
        <span className="addon-price">
          inklusive
        </span>
      </label>
      {service.variants.nodes.map((v) => (
        <label key={v.id} className={value === v.id ? 'addon checked' : 'addon'}>
          <input type="radio" name="service" checked={value === v.id} onChange={() => onChange(v.id)} />
          <span className="addon-text">
            <strong>24H Vor-Ort-Service {v.title}</strong>
            <small>Techniker vor Ort am nächsten Werktag, inkl. Medieneinbehalt</small>
          </span>
          <span className="addon-price">
            + <ModePrice data={v.price} />
            <small>{mode === 'net' ? 'netto' : 'inkl. MwSt.'}</small>
          </span>
        </label>
      ))}
    </fieldset>
  );
}
