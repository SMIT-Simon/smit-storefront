import {Suspense} from 'react';
import {Await, Form, Link, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {Icon} from '~/components/Icon';
import {CATEGORIES} from '~/lib/categories';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({header, isLoggedIn, cart}: HeaderProps) {
  const {shop} = header;
  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container topbar-inner">
          <span>
            <Icon name="check" size={14} /> Original TERRA-Hardware von
            WORTMANN
          </span>
          <span className="topbar-hide-mobile">
            <Icon name="invoice" size={14} /> Geschäftskunden: Netto-Preise
            &amp; Angebote auf Anfrage
          </span>
        </div>
      </div>

      <div className="container header-main">
        <HeaderMenuMobileToggle />
        <Link prefetch="intent" to="/" className="logo" aria-label="Startseite">
          <Logo name={shop.name} />
        </Link>

        <Form method="get" action="/search" className="header-search" role="search">
          <label htmlFor="header-search-input" className="sr-only">
            Produkte durchsuchen
          </label>
          <input
            id="header-search-input"
            name="q"
            type="search"
            placeholder="Suche nach Modell, Artikelnummer, Prozessor …"
            autoComplete="off"
          />
          <button type="submit" aria-label="Suchen">
            <Icon name="search" />
          </button>
        </Form>

        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>

      <HeaderMenu viewport="desktop" />
    </header>
  );
}

function Logo({name}: {name: string}) {
  const [first, ...rest] = name.split(' ');
  return (
    <span className="logo-mark">
      <span className="logo-badge">{first}</span>
      {rest.length ? <span className="logo-rest">{rest.join(' ')}</span> : null}
    </span>
  );
}

/**
 * Kategorie-Navigation. Die Kategorien sind fest hinterlegt (siehe
 * ~/lib/categories), damit die Navigation unabhängig vom Shopify-Menü ist.
 */
export function HeaderMenu({viewport}: {viewport: Viewport}) {
  const {close} = useAside();

  if (viewport === 'mobile') {
    return (
      <nav className="mobile-nav" aria-label="Kategorien">
        <NavLink end onClick={close} prefetch="intent" to="/">
          Startseite
        </NavLink>
        {CATEGORIES.map((c) => (
          <NavLink
            key={c.handle}
            onClick={close}
            prefetch="intent"
            to={`/collections/${c.handle}`}
          >
            <Icon name={c.icon} />
            {c.title}
          </NavLink>
        ))}
        <NavLink onClick={close} prefetch="intent" to="/collections/all">
          Alle Produkte
        </NavLink>
        <NavLink onClick={close} prefetch="intent" to="/account">
          Kundenkonto
        </NavLink>
      </nav>
    );
  }

  return (
    <nav className="category-nav" aria-label="Kategorien">
      <div className="container category-nav-inner">
        {CATEGORIES.map((c) => (
          <NavLink
            key={c.handle}
            prefetch="intent"
            to={`/collections/${c.handle}`}
            className={({isActive}) =>
              isActive ? 'category-link active' : 'category-link'
            }
          >
            {c.title}
          </NavLink>
        ))}
        <NavLink
          prefetch="intent"
          to="/collections/all"
          className={({isActive}) =>
            isActive ? 'category-link active' : 'category-link'
          }
        >
          Alle Produkte
        </NavLink>
      </div>
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <div className="header-ctas">
      <NavLink prefetch="intent" to="/account" className="header-icon-link">
        <Icon name="user" size={22} />
        <span className="header-icon-label">
          <Suspense fallback="Anmelden">
            <Await resolve={isLoggedIn} errorElement="Anmelden">
              {(isLoggedIn) => (isLoggedIn ? 'Konto' : 'Anmelden')}
            </Await>
          </Suspense>
        </span>
      </NavLink>
      <CartToggle cart={cart} />
    </div>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle"
      onClick={() => open('mobile')}
      aria-label="Menü öffnen"
    >
      <Icon name="menu" size={24} />
    </button>
  );
}

function CartBadge({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      className="header-icon-link"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <span className="cart-icon">
        <Icon name="cart" size={22} />
        {count > 0 ? (
          <span className="cart-count" aria-label={`${count} Artikel`}>
            {count}
          </span>
        ) : null}
      </span>
      <span className="header-icon-label">Warenkorb</span>
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}
