import {createContext, useCallback, useContext, useState} from 'react';
import {Price, type MoneyLike} from '~/components/Price';
import {VAT_RATE} from '~/lib/categories';

/**
 * Preisanzeige brutto (Standard) oder netto – umschaltbar im Header.
 * Die Wahl wird im Cookie "price_mode" gespeichert, damit auch die
 * serverseitig gerenderte Seite gleich richtig aussieht.
 */
export type PriceMode = 'gross' | 'net';
export const PRICE_MODE_COOKIE = 'price_mode';

export function readPriceMode(cookieHeader: string | null): PriceMode {
  const m = cookieHeader?.match(/(?:^|;\s*)price_mode=(net|gross)/);
  return (m?.[1] as PriceMode) ?? 'gross';
}

const Ctx = createContext<{mode: PriceMode; setMode: (m: PriceMode) => void}>({
  mode: 'gross',
  setMode: () => {},
});

export function PriceModeProvider({
  initial,
  children,
}: {
  initial: PriceMode;
  children: React.ReactNode;
}) {
  const [mode, setState] = useState<PriceMode>(initial);
  const setMode = useCallback((m: PriceMode) => {
    setState(m);
    try {
      document.cookie = `${PRICE_MODE_COOKIE}=${m}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      /* Cookies gesperrt – Auswahl gilt dann nur für diese Sitzung */
    }
  }, []);
  return <Ctx.Provider value={{mode, setMode}}>{children}</Ctx.Provider>;
}

export function usePriceMode() {
  return useContext(Ctx);
}

export function netOf(price: MoneyLike): MoneyLike {
  const gross = Number(price.amount ?? 0);
  return {
    amount: (gross / (1 + VAT_RATE)).toFixed(2),
    currencyCode: price.currencyCode,
  };
}

/** Hauptpreis im gewählten Modus. */
export function ModePrice({
  data,
  as,
  className,
}: {
  data: MoneyLike;
  as?: 'span' | 'div' | 'strong';
  className?: string;
}) {
  const {mode} = usePriceMode();
  return <Price data={mode === 'net' ? netOf(data) : data} as={as} className={className} />;
}

/** Zweitpreis: im Brutto-Modus der Nettopreis und umgekehrt. */
export function AltPrice({price}: {price?: MoneyLike | null}) {
  const {mode} = usePriceMode();
  if (!price) return null;
  return (
    <span className="price-net">
      {mode === 'net' ? (
        <>
          <Price as="span" data={price} /> brutto
        </>
      ) : (
        <>
          <Price as="span" data={netOf(price)} /> netto
        </>
      )}
    </span>
  );
}

export function PriceModeNote() {
  const {mode} = usePriceMode();
  return (
    <span className="collection-count">
      {mode === 'net'
        ? 'Nettopreise zzgl. 19 % MwSt. · Bruttopreis jeweils darunter'
        : 'Preise inkl. 19 % MwSt. · Nettopreis jeweils darunter'}
    </span>
  );
}

export function PriceModeToggle({className}: {className?: string}) {
  const {mode, setMode} = usePriceMode();
  return (
    <div
      className={`price-toggle${className ? ` ${className}` : ''}`}
      role="radiogroup"
      aria-label="Preisanzeige"
    >
      <button
        type="button"
        role="radio"
        aria-checked={mode === 'gross'}
        className={mode === 'gross' ? 'active' : ''}
        onClick={() => setMode('gross')}
      >
        Brutto
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={mode === 'net'}
        className={mode === 'net' ? 'active' : ''}
        onClick={() => setMode('net')}
      >
        Netto
      </button>
    </div>
  );
}
