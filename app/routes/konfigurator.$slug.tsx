import {useMemo, useState} from 'react';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {pageTitle} from '~/lib/seo';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/konfigurator.$slug';
import {Icon} from '~/components/Icon';
import {usePriceMode} from '~/components/PriceMode';
import {COMPANY} from '~/lib/company';
import {siteImg} from '~/lib/site-images';
import {VAT_RATE} from '~/lib/categories';
import {
  defaultSelection,
  describe,
  findModel,
  MARKUP,
  priceOf,
  SERVICE_TIERS,
  type Selection,
} from '~/lib/configurator';

export const meta: Route.MetaFunction = ({data}) => {
  const m = data?.model;
  if (!m) return [{title: 'Konfigurator'}];
  return [
    {title: pageTitle(`${m.name} individuell konfigurieren`)},
    {property: 'og:title', content: `${m.name} individuell konfigurieren`},
    {
      name: 'description',
      content: `${m.name} nach Wunsch konfigurieren: Prozessor, ${m.theme === 'gaming' ? 'Grafikkarte, RAM, SSD, Kühlung' : 'RAM, SSD, Grafik'}, Windows und Vor-Ort-Service. Verbindliches Angebot innerhalb von einem Werktag.`,
    },
  ];
};

export async function loader({params, context}: Route.LoaderArgs) {
  const model = findModel(params.slug);
  if (!model) throw new Response('Not found', {status: 404});
  // Gaming-Konfigurationen sind direkt bestellbar: Preise kommen aus dem versteckten
  // Shopify-Produkt „konfiguration-<slug>“ (Grundgerät + Aufpreis-Varianten, SKU cfg|<gruppe>:<option>).
  let shop: Record<string, {id: string; price: number}> | null = null;
  if (model.theme === 'gaming') {
    const res = await context.storefront
      .query(CONFIG_PRODUCT_QUERY, {
        variables: {handle: `konfiguration-${model.slug}`},
        cache: context.storefront.CacheShort(),
      })
      .catch(() => null);
    const nodes = res?.product?.variants.nodes ?? [];
    if (nodes.length) {
      shop = {};
      for (const v of nodes) {
        if (v.sku?.startsWith('cfg|') && v.availableForSale) {
          shop[v.sku.slice(4)] = {id: v.id, price: Number(v.price.amount)};
        }
      }
      if (!shop.base) shop = null;
    }
  }
  return {model, shop};
}

const CONFIG_PRODUCT_QUERY = `#graphql
  query ConfigProduct($handle: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      variants(first: 100) {
        nodes {
          id
          sku
          availableForSale
          price {
            amount
          }
        }
      }
    }
  }
` as const;

const eur = (n: number) =>
  n.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'});

export default function Configurator() {
  const {model, shop} = useLoaderData<typeof loader>();
  const {mode} = usePriceMode();
  const {open} = useAside();
  const [sel, setSel] = useState<Selection>(() => defaultSelection(model));
  const [service, setService] = useState('bring-in');
  const [qty, setQty] = useState(1);
  const [contact, setContact] = useState({company: '', name: '', email: '', phone: '', note: ''});

  const markup = model.markup ?? MARKUP;
  const gaming = model.theme === 'gaming';
  const orderable = Boolean(shop);
  const vat = 1 + VAT_RATE;
  /** Aufpreis brutto einer Shop-Variante (0, wenn im Grundgerät enthalten) */
  const vp = (key: string) => shop?.[key]?.price ?? 0;
  const price = useMemo(() => {
    if (!shop) return priceOf(model, sel, service);
    let gross = vp('base');
    for (const g of model.groups) {
      for (const id of ([] as string[]).concat(sel[g.id] ?? [])) gross += vp(`${g.id}:${id}`);
    }
    gross += vp(`service:${service}`);
    return {system: 0, fixed: 0, service: 0, total: Math.round((gross / vat) * 100) / 100, gross};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, sel, service, shop]);
  const [cfgId] = useState(() => Math.random().toString(36).slice(2, 8).toUpperCase());
  const show = (net: number) => (mode === 'net' ? net : net * (1 + VAT_RATE));
  const other = (net: number) => (mode === 'net' ? net * (1 + VAT_RATE) : net);
  const taxNote = mode === 'net' ? 'netto zzgl. MwSt.' : 'inkl. 19 % MwSt.';

  const pick = (gid: string, oid: string, multi: boolean) =>
    setSel((s) => {
      // Einrichtungsservice nur mit Windows: bei „Ohne Betriebssystem“ abwählen
      if (!multi) return gid === 'os' && oid === 'none' ? {...s, [gid]: oid, setup: []} : {...s, [gid]: oid};
      const cur = ([] as string[]).concat(s[gid] ?? []);
      return {...s, [gid]: cur.includes(oid) ? cur.filter((x) => x !== oid) : [...cur, oid]};
    });

  const configText = describe(model, sel, service);

  /** Warenkorb-Positionen: Grundgerät (mit kompletter Konfiguration) + Aufpreis-Komponenten. */
  const cartLines = () => {
    if (!shop) return [];
    const tag = {key: 'Konfiguration Nr.', value: cfgId};
    const lines = [
      {
        merchandiseId: shop.base.id,
        quantity: qty,
        attributes: [
          tag,
          {key: 'Modell', value: model.name},
          {key: 'Ausstattung', value: configText.split('\n').slice(1).join(' | ').slice(0, 1800)},
          ...(model.leadTime ? [{key: 'Lieferzeit', value: `${model.leadTime} (Fertigung nach Auftrag)`}] : []),
        ],
      },
    ];
    const keys: string[] = [];
    for (const g of model.groups) {
      for (const id of ([] as string[]).concat(sel[g.id] ?? [])) keys.push(`${g.id}:${id}`);
    }
    keys.push(`service:${service}`);
    for (const k of keys) {
      const v = shop[k];
      if (v) lines.push({merchandiseId: v.id, quantity: qty, attributes: [tag]});
    }
    // Shopify zeigt neu hinzugefügte Positionen zuerst – Grundgerät soll oben stehen
    return lines.reverse();
  };
  const mailBody = [
    'Guten Tag,',
    '',
    `bitte senden Sie mir ein Angebot für folgende Konfiguration (Menge: ${qty}):`,
    '',
    configText,
    '',
    `Richtpreis laut Konfigurator: ${eur(price.total)} netto / ${eur(price.total * (1 + VAT_RATE))} brutto je Gerät`,
    '',
    contact.company ? `Firma: ${contact.company}` : null,
    contact.name ? `Ansprechpartner: ${contact.name}` : null,
    contact.email ? `E-Mail: ${contact.email}` : null,
    contact.phone ? `Telefon: ${contact.phone}` : null,
    contact.note ? `\nAnmerkung: ${contact.note}` : null,
  ]
    .filter((l): l is string => typeof l === 'string')
    .join('\n');
  const mailto = `mailto:${COMPANY.email}?subject=${encodeURIComponent(
    `Konfigurationsanfrage ${model.name}`,
  )}&body=${encodeURIComponent(mailBody)}`;
  const canSend = /\S+@\S+\.\S+/.test(contact.email);

  return (
    <div className={gaming ? 'configurator configurator-gaming' : 'configurator'}>
      <div className="container">
        <nav className="breadcrumb" aria-label="Brotkrümel">
          <Link to="/">Startseite</Link>
          <span aria-hidden>›</span>
          {gaming ? (
            <Link to="/themen/terra-gaming-pc">TERRA Gaming PC</Link>
          ) : (
            <Link to="/collections/desktop-pcs">Desktop-PCs</Link>
          )}
          <span aria-hidden>›</span>
          <Link to="/konfigurator">Konfigurator</Link>
        </nav>

        <header className="cfg-head">
          <div>
            <span className="eyebrow">{model.eyebrow ?? 'PC-Konfigurator · Bauen nach Auftrag'}</span>
            <h1>{model.name} individuell konfigurieren</h1>
            <p>{model.intro}</p>
            <ul className="cfg-standard">
              {model.standard.map((s) => (
                <li key={s}>
                  <Icon name="check" size={16} /> {s}
                </li>
              ))}
            </ul>
          </div>
          {model.image ? (
            <img {...siteImg(model.image, '(min-width: 64em) 480px, 100vw')} alt="" width={480} height={270} />
          ) : null}
        </header>

        <div className="cfg-layout">
          <div className="cfg-groups">
            {model.groups.map((g) => (
              <fieldset key={g.id} className="cfg-group">
                <legend>{g.title}</legend>
                {g.options.map((o) => {
                  const multi = g.type === 'multi';
                  const checked = multi
                    ? ([] as string[]).concat(sel[g.id] ?? []).includes(o.id)
                    : sel[g.id] === o.id;
                  const delta = orderable
                    ? (vp(`${g.id}:${o.id}`) - (multi ? 0 : vp(`${g.id}:${g.default ?? g.options[0].id}`))) / vat
                    : (o.fixedNet ?? (o.ek ?? 0) * markup);
                  const locked = g.id === 'setup' && sel.os === 'none';
                  return (
                    <label
                      key={o.id}
                      className={`cfg-opt${checked ? ' checked' : ''}${locked ? ' disabled' : ''}`}
                    >
                      <input
                        type={multi ? 'checkbox' : 'radio'}
                        name={g.id}
                        checked={checked}
                        disabled={locked}
                        onChange={() => pick(g.id, o.id, multi)}
                      />
                      <span className="cfg-opt-text">
                        <strong>{o.label}</strong>
                        {locked ? (
                          <small>Nur zusammen mit Windows – bitte oben ein Windows auswählen</small>
                        ) : o.detail ? (
                          <small>{o.detail}</small>
                        ) : null}
                      </span>
                      <span className="cfg-opt-price">
                        {delta === 0 ? (checked ? 'inklusive' : '±0,00 €') : `${delta > 0 ? '+' : '−'} ${eur(Math.abs(show(delta)))}`}
                      </span>
                    </label>
                  );
                })}
              </fieldset>
            ))}

            <fieldset className="cfg-group">
              <legend>Serviceauswahl</legend>
              {SERVICE_TIERS.map((t) => {
                const net = orderable
                  ? vp(`service:${t.id}`) / vat
                  : t.pct
                    ? Math.max(price.system * t.pct, t.minNet)
                    : 0;
                return (
                  <label key={t.id} className={service === t.id ? 'cfg-opt checked' : 'cfg-opt'}>
                    <input
                      type="radio"
                      name="service"
                      checked={service === t.id}
                      onChange={() => setService(t.id)}
                    />
                    <span className="cfg-opt-text">
                      <strong>{t.label}</strong>
                      <small>{t.detail}</small>
                    </span>
                    <span className="cfg-opt-price">{net ? `+ ${eur(show(net))}` : 'inklusive'}</span>
                  </label>
                );
              })}
            </fieldset>
          </div>

          <div className="cfg-summary">
            <div className="cfg-summary-inner">
              <span className="cfg-label">{orderable ? 'Preis je Gerät' : 'Richtpreis je Gerät'}</span>
              <strong className="cfg-total">
                {eur(orderable && 'gross' in price ? (mode === 'net' ? price.total : price.gross) : show(price.total))}
              </strong>
              <span className="cfg-tax">
                {taxNote} ·{' '}
                {eur(orderable && 'gross' in price ? (mode === 'net' ? price.gross : price.total) : other(price.total))}{' '}
                {mode === 'net' ? 'brutto' : 'netto'}
              </span>
              {orderable ? (
                <p className="cfg-promise">
                  <Icon name="cart" size={18} /> Direkt bestellen und <strong>sicher bezahlen</strong>
                </p>
              ) : (
                <p className="cfg-promise">
                  <Icon name="invoice" size={18} /> Verbindliches Angebot innerhalb von <strong>1 Werktag</strong>
                </p>
              )}
              {model.leadTime ? (
                <p className="cfg-promise">
                  <Icon name="truck" size={18} /> Lieferzeit nach Auftrag: <strong>{model.leadTime}</strong>
                </p>
              ) : null}
              {model.productHandle && gaming ? (
                <p className="cfg-small">
                  Tipp: Die{' '}
                  <Link to={`/products/${model.productHandle}`}>fertig konfigurierte Standardausstattung</Link> ist
                  günstiger als eine individuelle Fertigung.
                </p>
              ) : null}

              <label className="cfg-field cfg-qty">
                <span>Menge</span>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={qty}
                  onChange={(e) => setQty(Math.min(20, Math.max(1, parseInt(e.target.value || '1', 10))))}
                />
              </label>

              {orderable && shop ? (
                <>
                  <AddToCartButton lines={cartLines()} onClick={() => open('cart')}>
                    In den Warenkorb
                  </AddToCartButton>
                  <p className="cfg-small">
                    Im Warenkorb erscheinen Grundgerät und gewählte Komponenten als einzelne Positionen – die
                    komplette Konfiguration wird mit der Bestellung übermittelt.
                  </p>
                  <p className="cfg-small">
                    Lieber erst ein Angebot? <a href={mailto}>Konfiguration per E-Mail anfragen</a> oder{' '}
                    <a href="tel:+4952469098980">05246 909 89 80</a>
                  </p>
                </>
              ) : (
                <>
                  <label className="cfg-field">
                    <span>Firma</span>
                    <input value={contact.company} onChange={(e) => setContact({...contact, company: e.target.value})} />
                  </label>
                  <label className="cfg-field">
                    <span>Ansprechpartner</span>
                    <input value={contact.name} onChange={(e) => setContact({...contact, name: e.target.value})} />
                  </label>
                  <label className="cfg-field">
                    <span>E-Mail *</span>
                    <input type="email" value={contact.email} onChange={(e) => setContact({...contact, email: e.target.value})} />
                  </label>
                  <label className="cfg-field">
                    <span>Telefon</span>
                    <input value={contact.phone} onChange={(e) => setContact({...contact, phone: e.target.value})} />
                  </label>
                  <label className="cfg-field">
                    <span>Anmerkung</span>
                    <textarea rows={2} value={contact.note} onChange={(e) => setContact({...contact, note: e.target.value})} />
                  </label>

                  <a
                    href={canSend ? mailto : undefined}
                    aria-disabled={!canSend}
                    className={canSend ? 'btn btn-primary btn-block' : 'btn btn-primary btn-block disabled'}
                  >
                    Angebot anfordern
                  </a>
                  <p className="cfg-small">
                    Öffnet Ihr E-Mail-Programm mit der fertigen Anfrage. Lieber telefonisch?{' '}
                    <a href="tel:+4952469098980">05246 909 89 80</a>
                  </p>
                  <p className="cfg-small">Richtpreis ohne Gewähr – maßgeblich ist unser Angebot.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
