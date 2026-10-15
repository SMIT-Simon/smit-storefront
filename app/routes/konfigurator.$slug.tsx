import {useMemo, useState} from 'react';
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

export function loader({params}: Route.LoaderArgs) {
  const model = findModel(params.slug);
  if (!model) throw new Response('Not found', {status: 404});
  return {model};
}

const eur = (n: number) =>
  n.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'});

export default function Configurator() {
  const {model} = useLoaderData<typeof loader>();
  const {mode} = usePriceMode();
  const [sel, setSel] = useState<Selection>(() => defaultSelection(model));
  const [service, setService] = useState('bring-in');
  const [qty, setQty] = useState(1);
  const [contact, setContact] = useState({company: '', name: '', email: '', phone: '', note: ''});

  const price = useMemo(() => priceOf(model, sel, service), [model, sel, service]);
  const markup = model.markup ?? MARKUP;
  const gaming = model.theme === 'gaming';
  const show = (net: number) => (mode === 'net' ? net : net * (1 + VAT_RATE));
  const other = (net: number) => (mode === 'net' ? net * (1 + VAT_RATE) : net);
  const taxNote = mode === 'net' ? 'netto zzgl. MwSt.' : 'inkl. 19 % MwSt.';

  const pick = (gid: string, oid: string, multi: boolean) =>
    setSel((s) => {
      if (!multi) return {...s, [gid]: oid};
      const cur = ([] as string[]).concat(s[gid] ?? []);
      return {...s, [gid]: cur.includes(oid) ? cur.filter((x) => x !== oid) : [...cur, oid]};
    });

  const configText = describe(model, sel, service);
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
          <span>Konfigurator</span>
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
                  const delta = o.fixedNet ?? (o.ek ?? 0) * markup;
                  return (
                    <label key={o.id} className={checked ? 'cfg-opt checked' : 'cfg-opt'}>
                      <input
                        type={multi ? 'checkbox' : 'radio'}
                        name={g.id}
                        checked={checked}
                        onChange={() => pick(g.id, o.id, multi)}
                      />
                      <span className="cfg-opt-text">
                        <strong>{o.label}</strong>
                        {o.detail ? <small>{o.detail}</small> : null}
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
                const net = t.pct ? Math.max(price.system * t.pct, t.minNet) : 0;
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
              <span className="cfg-label">Richtpreis je Gerät</span>
              <strong className="cfg-total">{eur(show(price.total))}</strong>
              <span className="cfg-tax">
                {taxNote} · {eur(other(price.total))} {mode === 'net' ? 'brutto' : 'netto'}
              </span>
              <p className="cfg-promise">
                <Icon name="invoice" size={18} /> Verbindliches Angebot innerhalb von <strong>1 Werktag</strong>
              </p>
              {model.productHandle && model.theme === 'gaming' ? (
                <p className="cfg-small">
                  Tipp: Die{' '}
                  <Link to={`/products/${model.productHandle}`}>fertig konfigurierte Standardausstattung</Link> ist
                  günstiger als eine individuelle Fertigung.
                </p>
              ) : null}
              {model.leadTime ? (
                <p className="cfg-promise">
                  <Icon name="truck" size={18} /> Lieferzeit nach Auftrag: <strong>{model.leadTime}</strong>
                </p>
              ) : null}

              <label className="cfg-field cfg-qty">
                <span>Menge</span>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || '1', 10)))}
                />
              </label>
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
              <p className="cfg-small">
                Richtpreis ohne Gewähr – maßgeblich ist unser Angebot.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
