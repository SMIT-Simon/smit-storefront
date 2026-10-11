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
import {BRANCHEN, EINSATZBEREICHE} from '~/lib/solutions';
import {CATEGORIES} from '~/lib/categories';
import {PriceModeToggle} from '~/components/PriceMode';

const FLYER_LABEL = 'III-26';

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
    <>
    <header className="site-header">
      <div className="topbar">
        <div className="container topbar-inner">
          <span>
            <Icon name="check" size={14} /> Original TERRA-Hardware ·{' '}
            <a href="https://systemhaus-verl.de/" target="_blank" rel="noopener noreferrer">
              Ihr Systemhaus aus Verl
            </a>
          </span>
          <span className="topbar-right">
            <span className="topbar-hide-mobile">
              <Icon name="invoice" size={14} /> Angebote als PDF direkt aus dem Warenkorb
            </span>
            <span className="topbar-price">
              Preise:
              <PriceModeToggle />
            </span>
          </span>
        </div>
      </div>

      <div className="container header-main">
        <HeaderMenuMobileToggle />
        <Link prefetch="intent" to="/" className="logo" aria-label="Startseite">
          <img
            src="/images/logo-smit.webp"
            alt={shop.name}
            width={160}
            height={51}
            className="logo-img"
          />
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

    </header>
    <HeaderMenu viewport="desktop" />
    </>
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
          <div key={c.handle} className="mobile-nav-group">
            <NavLink
              end
              onClick={close}
              prefetch="intent"
              to={`/collections/${c.handle}`}
            >
              <Icon name={c.icon} />
              {c.title}
            </NavLink>
            {c.subs?.length ? (
              <div className="mobile-nav-subs">
                {c.subs.map((x) => (
                  <Link
                    key={x.slug}
                    onClick={close}
                    prefetch="intent"
                    to={`/collections/${c.handle}?sub=${x.slug}`}
                  >
                    {x.title}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ))}
        <div className="mobile-nav-group">
          <NavLink end onClick={close} prefetch="intent" to="/loesungen">
            Branchen &amp; Lösungen
          </NavLink>
          <div className="mobile-nav-subs">
            {[...BRANCHEN, ...EINSATZBEREICHE].map((x) => (
              <Link key={x.slug} onClick={close} prefetch="intent" to={`/loesungen/${x.slug}`}>
                {x.name}
              </Link>
            ))}
          </div>
        </div>
        <NavLink onClick={close} prefetch="intent" to="/collections/all">
          Alle Produkte
        </NavLink>
        <NavLink onClick={close} prefetch="intent" to="/flyer">
          Business-Flyer {FLYER_LABEL}
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
          <div key={c.handle} className="nav-item">
            <NavLink
              prefetch="intent"
              to={`/collections/${c.handle}`}
              className={({isActive}) =>
                isActive ? 'category-link active' : 'category-link'
              }
            >
              {c.title}
              {c.subs?.length ? (
                <Icon name="chevron-right" size={14} className="nav-caret" />
              ) : null}
            </NavLink>
            {c.subs?.length ? (
              <div className="nav-dropdown">
                <Link
                  to={`/collections/${c.handle}`}
                  prefetch="intent"
                  className="nav-dropdown-all"
                >
                  <Icon name={c.icon} size={20} />
                  Alle {c.title}
                </Link>
                {c.subs.map((x) => (
                  <Link
                    key={x.slug}
                    to={`/collections/${c.handle}?sub=${x.slug}`}
                    prefetch="intent"
                  >
                    {x.title}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ))}
        <div className="nav-item nav-item-solutions">
          <NavLink
            prefetch="intent"
            to="/loesungen"
            className={({isActive}) =>
              isActive ? 'category-link nav-solutions active' : 'category-link nav-solutions'
            }
          >
            Branchen
            <Icon name="chevron-right" size={14} className="nav-caret" />
          </NavLink>
          <div className="nav-dropdown nav-dropdown-wide">
            <div className="nav-dropdown-col">
              <span className="nav-dropdown-label">Nach Branche</span>
              {BRANCHEN.map((x) => (
                <Link key={x.slug} to={`/loesungen/${x.slug}`} prefetch="intent">
                  {x.name}
                </Link>
              ))}
            </div>
            <div className="nav-dropdown-col">
              <span className="nav-dropdown-label">Nach Einsatzbereich</span>
              {EINSATZBEREICHE.map((x) => (
                <Link key={x.slug} to={`/loesungen/${x.slug}`} prefetch="intent">
                  {x.name}
                </Link>
              ))}
              <Link to="/loesungen" prefetch="intent" className="nav-dropdown-more">
                Alle Lösungen →
              </Link>
            </div>
          </div>
        </div>
        <NavLink
          prefetch="intent"
          to="/flyer"
          className={({isActive}) =>
            isActive ? 'category-link nav-flyer active' : 'category-link nav-flyer'
          }
        >
          Business-Flyer
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
