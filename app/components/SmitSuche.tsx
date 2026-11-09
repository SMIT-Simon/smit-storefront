import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {Link, useFetcher, useNavigate} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {Icon} from '~/components/Icon';
import {ModePrice} from '~/components/PriceMode';
import {Price} from '~/components/Price';
import {useAside} from '~/components/Aside';
import {CATEGORIES} from '~/lib/categories';
import type {SmitSucheProduct, SmitSucheResult} from '~/routes/api.smit-suche';

/**
 * SMIT Suche – Such-Fenster für den Terrashop (Vorbild: SMIT Suche der JTL-Shops).
 * Öffnet sich beim Klick ins Suchfeld im Header. Live-Treffer mit Bild, Preis (brutto/netto),
 * Lieferstatus und Artikelnummer, Kategorien als Chips, Filter + Sortierung,
 * „In den Warenkorb“ direkt aus der Suche, Sprachsuche, Tippfehler-Fallback.
 * Daten: /api/smit-suche (routes/api.smit-suche.tsx).
 */

type Sort = 'relevance' | 'price-asc' | 'price-desc';
const SORT_LABELS: Record<Sort, string> = {
  relevance: 'Relevanz',
  'price-asc': 'Preis aufsteigend',
  'price-desc': 'Preis absteigend',
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  onresult: ((ev: {results: ArrayLike<ArrayLike<{transcript: string}>>}) => void) | null;
  onend: (() => void) | null;
  start: () => void;
};
type SpeechCtor = new () => SpeechRecognitionLike;
function speechCtor(): SpeechCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {SpeechRecognition?: SpeechCtor; webkitSpeechRecognition?: SpeechCtor};
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function SmitSuche({
  open,
  initialTerm,
  onClose,
}: {
  open: boolean;
  initialTerm: string;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [term, setTerm] = useState(initialTerm);
  const [sort, setSort] = useState<Sort>('relevance');
  const [filters, setFilters] = useState<string[]>([]); // ProductFilter-JSON-Strings (value.input)
  const [data, setData] = useState<SmitSucheResult | null>(null);
  const [extra, setExtra] = useState<SmitSucheProduct[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [listening, setListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();

  useEffect(() => setMounted(true), []);

  // Beim Öffnen: Begriff übernehmen, Fokus setzen, Seite nicht scrollen
  useEffect(() => {
    if (!open) return;
    setTerm(initialTerm);
    document.documentElement.classList.add('smit-su-open');
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('smit-su-open');
    };
  }, [open, initialTerm, onClose]);

  const load = useCallback(
    async (opts: {append?: boolean; after?: string | null} = {}) => {
      const q = term.trim();
      if (!q) {
        setData(null);
        setExtra([]);
        return;
      }
      abortRef.current?.abort();
      const ctl = new AbortController();
      abortRef.current = ctl;
      const p = new URLSearchParams({q, sort});
      if (filters.length) p.set('f', JSON.stringify(filters.map((f) => JSON.parse(f) as unknown)));
      if (opts.after) p.set('after', opts.after);
      setLoading(true);
      try {
        const res = await fetch(`/api/smit-suche?${p.toString()}`, {signal: ctl.signal});
        const json = (await res.json()) as SmitSucheResult;
        if (opts.append) {
          setExtra((prev) => [...prev, ...json.products]);
        } else {
          setData(json);
          setExtra([]);
        }
        setCursor(json.hasNextPage ? json.endCursor : null);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') setData(emptyResult(q));
      } finally {
        if (abortRef.current === ctl) setLoading(false);
      }
    },
    [term, sort, filters],
  );

  // Suchen mit kurzer Verzögerung beim Tippen
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => void load(), 220);
    return () => window.clearTimeout(t);
  }, [open, load]);

  // Neuer Begriff → Filter zurücksetzen
  const onTermChange = (v: string) => {
    setTerm(v);
    setFilters([]);
  };

  const toggleFilter = (input: string) =>
    setFilters((prev) => (prev.includes(input) ? prev.filter((x) => x !== input) : [...prev, input]));

  const startVoice = () => {
    const SR = speechCtor();
    if (!SR) return;
    const rec = new SR();
    rec.lang = 'de-DE';
    rec.interimResults = false;
    setListening(true);
    rec.onresult = (ev) => onTermChange(String(ev.results[0]?.[0]?.transcript || ''));
    rec.onend = () => setListening(false);
    try {
      rec.start();
    } catch {
      setListening(false);
    }
  };
  const voiceAvailable = mounted && speechCtor() !== null;

  const q = term.trim();
  const products = useMemo(() => [...(data?.products ?? []), ...extra], [data, extra]);
  const filterGroups = (data?.filters ?? []).filter((f) => f.values?.length);
  const categoryChips = useMemo(() => matchCategories(q), [q]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className={`smit-su${loading ? ' is-loading' : ''}${showFilters ? ' show-filters' : ''}`}>
      <button type="button" className="smit-su-backdrop" aria-label="Suche schließen" onClick={onClose} />
      <div className="smit-su-panel" role="dialog" aria-modal="true" aria-label="Produktsuche">
        <div className="smit-su-head">
          <form
            className="smit-su-form"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (!q) return;
              onClose();
              void navigate(`/search?q=${encodeURIComponent(q)}`);
            }}
          >
            <Icon name="search" />
            <label htmlFor="smit-su-input" className="sr-only">Produkte durchsuchen</label>
            <input
              id="smit-su-input"
              ref={inputRef}
              type="search"
              value={term}
              onChange={(e) => onTermChange(e.target.value)}
              placeholder="Suche nach Modell, Artikelnummer, Prozessor …"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            {term && (
              <button
                type="button"
                className="smit-su-icon"
                aria-label="Eingabe löschen"
                onClick={() => {
                  onTermChange('');
                  inputRef.current?.focus();
                }}
              >
                <XIcon />
              </button>
            )}
            {voiceAvailable && (
              <button type="button" className={`smit-su-icon${listening ? ' is-on' : ''}`} aria-label="Sprachsuche" onClick={startVoice}>
                <MicIcon />
              </button>
            )}
          </form>
          <button type="button" className="smit-su-icon smit-su-close" aria-label="Suche schließen" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="smit-su-body">
          {q && filterGroups.length > 0 && (
            <aside className="smit-su-filters" aria-label="Filter">
              <div className="smit-su-fhead">
                <strong>Filter</strong>
                {filters.length > 0 && (
                  <button type="button" onClick={() => setFilters([])}>Zurücksetzen</button>
                )}
                <button type="button" className="smit-su-fclose" aria-label="Filter schließen" onClick={() => setShowFilters(false)}>
                  <XIcon />
                </button>
              </div>
              {filterGroups.map((g) => (
                <fieldset key={g.id} className="smit-su-fgroup">
                  <legend>{g.label}</legend>
                  {g.values.slice(0, 30).map((v) => {
                    const on = filters.includes(v.input);
                    const empty = v.count === 0 && !on;
                    return (
                      <label key={v.id} className={`smit-su-check${empty ? ' is-empty' : ''}`}>
                        <input type="checkbox" checked={on} disabled={empty} onChange={() => toggleFilter(v.input)} />
                        <span>{v.label}</span>
                        <small>{v.count}</small>
                      </label>
                    );
                  })}
                </fieldset>
              ))}
            </aside>
          )}

          <div className="smit-su-main">
            {!q ? (
              <StartState onPick={onClose} />
            ) : (
              <>
                {(categoryChips.length > 0 || (data?.collections?.length ?? 0) > 0 || (data?.queries?.length ?? 0) > 0) && (
                  <div className="smit-su-chips">
                    {categoryChips.map((c) => (
                      <Link key={c.to} to={c.to} className="smit-su-chip is-cat" onClick={onClose} prefetch="intent">
                        <span>{c.title}</span>
                        <small>Kategorie</small>
                      </Link>
                    ))}
                    {(data?.collections ?? [])
                      .filter((c) => !categoryChips.some((x) => x.to === `/collections/${c.handle}`))
                      .map((c) => (
                        <Link key={c.handle} to={`/collections/${c.handle}`} className="smit-su-chip is-cat" onClick={onClose} prefetch="intent">
                          <span>{c.title}</span>
                          <small>Kategorie</small>
                        </Link>
                      ))}
                    {(data?.queries ?? [])
                      .filter((s) => s.toLowerCase() !== q.toLowerCase())
                      .slice(0, 5)
                      .map((s) => (
                        <button key={s} type="button" className="smit-su-chip" onClick={() => onTermChange(s)}>
                          <Icon name="search" size={14} />
                          <span>{s}</span>
                        </button>
                      ))}
                  </div>
                )}

                {data && (
                  <div className="smit-su-bar">
                    {filterGroups.length > 0 && (
                      <button type="button" className="smit-su-filterbtn" onClick={() => setShowFilters(true)}>
                        Filter{filters.length ? ` (${filters.length})` : ''}
                      </button>
                    )}
                    <p className="smit-su-count" aria-live="polite">
                      {data.fallback ? (
                        <>Keine genauen Treffer für „{q}“ – meinten Sie:</>
                      ) : (
                        <>
                          <strong>{data.count}</strong> Artikel für „{q}“
                        </>
                      )}
                    </p>
                    {!data.fallback && data.count > 0 && (
                      <div className="smit-su-bar-right">
                        <label className="smit-su-sort">
                          <span>Sortieren</span>
                          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                            {(Object.keys(SORT_LABELS) as Sort[]).map((s) => (
                              <option key={s} value={s}>{SORT_LABELS[s]}</option>
                            ))}
                          </select>
                        </label>
                        <Link className="smit-su-all" to={`/search?q=${encodeURIComponent(q)}`} onClick={onClose}>
                          Ergebnisseite
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {data && !products.length && (
                  <div className="smit-su-none">
                    <strong>Keine Treffer für „{q}“.</strong>
                    <span>Prüfen Sie die Schreibweise oder versuchen Sie einen allgemeineren Begriff, z. B. „Notebook“, „i7“ oder eine Artikelnummer.</span>
                  </div>
                )}

                <div className="smit-su-grid">
                  {products.map((p) => (
                    <ProductCard key={p.handle} p={p} term={q} onNavigate={onClose} />
                  ))}
                </div>

                {cursor && !data?.fallback && (
                  <div className="smit-su-more">
                    <button type="button" onClick={() => void load({append: true, after: cursor})} disabled={loading}>
                      Weitere Artikel laden
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function ProductCard({p, term, onNavigate}: {p: SmitSucheProduct; term: string; onNavigate: () => void}) {
  const fetcher = useFetcher({key: `smit-su-add-${p.handle}`});
  const aside = useAside();
  const [added, setAdded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const busy = fetcher.state !== 'idle';

  useEffect(() => {
    if (submitted && fetcher.state === 'idle') {
      setSubmitted(false);
      setAdded(true);
      const t = window.setTimeout(() => setAdded(false), 3000);
      return () => window.clearTimeout(t);
    }
  }, [submitted, fetcher.state]);

  const add = () => {
    if (!p.variantId) return;
    setSubmitted(true);
    void fetcher.submit(
      {
        [CartForm.INPUT_NAME]: JSON.stringify({
          action: CartForm.ACTIONS.LinesAdd,
          inputs: {lines: [{merchandiseId: p.variantId, quantity: 1}]},
        }),
      },
      {method: 'POST', action: '/cart'},
    );
  };

  const url = `/products/${p.handle}`;
  return (
    <article className="smit-su-card">
      <Link to={url} className="smit-su-img" onClick={onNavigate} prefetch="intent">
        {p.image ? <img src={p.image} alt="" loading="lazy" width={240} height={240} /> : null}
      </Link>
      <div className="smit-su-info">
        {p.sku ? (
          <span className="smit-su-sku">
            Art.-Nr. <Mark text={p.sku} term={term} />
          </span>
        ) : null}
        <Link to={url} className="smit-su-title" onClick={onNavigate} prefetch="intent">
          <Mark text={p.title} term={term} />
        </Link>
        <span className="smit-su-price">
          {p.priceVaries ? 'ab ' : ''}
          <ModePrice data={p.price} />
          {p.compareAt ? (
            <s>
              <Price data={p.compareAt} />
            </s>
          ) : null}
        </span>
        <span className={`smit-su-stock ${p.available ? 'is-ok' : 'is-out'}`}>
          {p.available ? 'Lieferbar' : 'Derzeit nicht verfügbar'}
        </span>
      </div>
      {p.variantId ? (
        added ? (
          <button
            type="button"
            className="smit-su-add is-done"
            onClick={() => {
              onNavigate();
              aside.open('cart');
            }}
          >
            <Icon name="check" size={18} /> <span>Im Warenkorb – ansehen</span>
          </button>
        ) : (
          <button type="button" className="smit-su-add" onClick={add} disabled={busy}>
            <Icon name="cart" size={18} /> <span>{busy ? 'Wird hinzugefügt …' : 'In den Warenkorb'}</span>
          </button>
        )
      ) : (
        <Link to={url} className="smit-su-add is-link" onClick={onNavigate} prefetch="intent">
          {p.available ? 'Details & Optionen' : 'Ansehen'} <Icon name="arrow-right" size={16} />
        </Link>
      )}
    </article>
  );
}

function StartState({onPick}: {onPick: () => void}) {
  return (
    <div className="smit-su-start">
      <p className="smit-su-label">Kategorien</p>
      <div className="smit-su-cats">
        {CATEGORIES.map((c) => (
          <Link key={c.handle} to={`/collections/${c.handle}`} className="smit-su-cat" onClick={onPick} prefetch="intent">
            <span className="smit-su-cat-ico">
              <Icon name={c.icon} size={22} />
            </span>
            <span>
              <strong>{c.title}</strong>
              <small>{c.teaser}</small>
            </span>
          </Link>
        ))}
      </div>
      <p className="smit-su-tip">Tipp: Suchen Sie auch nach Artikelnummer, Prozessor oder Bildschirmgröße.</p>
    </div>
  );
}

/** Kategorien und Unterkategorien, deren Name zum Suchbegriff passt (z. B. „mini“ → PC-Mini & PC-Micro). */
function matchCategories(q: string): Array<{title: string; to: string}> {
  const s = q.toLowerCase();
  if (s.length < 3) return [];
  const out: Array<{title: string; to: string}> = [];
  for (const c of CATEGORIES) {
    const t = c.title.toLowerCase();
    if (t.includes(s) || s.includes(t.replace(/s$/, ''))) {
      out.push({title: c.title, to: `/collections/${c.handle}`});
    }
    for (const sub of c.subs ?? []) {
      if (sub.title.toLowerCase().includes(s)) {
        out.push({title: `${c.title}: ${sub.title}`, to: `/collections/${c.handle}?sub=${sub.slug}`});
      }
    }
  }
  return out.slice(0, 6);
}

function Mark({text, term}: {text: string; term: string}) {
  const words = term.split(/\s+/).filter((w) => w.length > 1);
  if (!words.length) return <>{text}</>;
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(re);
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
    </>
  );
}

function emptyResult(term: string): SmitSucheResult {
  return {term, count: 0, products: [], filters: [], hasNextPage: false, endCursor: null, collections: [], queries: [], fallback: false};
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  );
}
