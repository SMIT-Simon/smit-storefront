import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {Price} from '~/components/Price';
import {netOf, usePriceMode} from '~/components/PriceMode';
import {QuoteButton} from '~/components/QuoteDialog';
import {LegalGuaranteeNotice} from '~/components/LegalGuaranteeNotice';
import {ShippingInfoLink} from '~/components/ShippingInfo';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useId, useRef, useState} from 'react';
import {useFetcher} from 'react-router';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';
  const summaryId = useId();
  const discountsHeadingId = useId();
  const discountCodeInputId = useId();
  const giftCardHeadingId = useId();
  const giftCardInputId = useId();

  return (
    <div aria-labelledby={summaryId} className={className}>
      <h4 id={summaryId} className="sr-only">
        Summe
      </h4>
      <CartTotals amount={cart?.cost?.subtotalAmount} />
      <details className="cart-codes">
        <summary>Rabattcode oder Gutschein einlösen</summary>
        <CartDiscounts
          discountCodes={cart?.discountCodes}
          discountsHeadingId={discountsHeadingId}
          discountCodeInputId={discountCodeInputId}
        />
        <CartGiftCard
          giftCardCodes={cart?.appliedGiftCards}
          giftCardHeadingId={giftCardHeadingId}
          giftCardInputId={giftCardInputId}
        />
      </details>
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
      <QuoteButton cart={cart} />
      <LegalGuaranteeNotice compact />
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="cart-checkout">
      <a href={checkoutUrl} target="_self" className="btn btn-primary btn-block">
        Zur Kasse
      </a>
      <p className="cart-secure">Sichere Bezahlung über Shopify Checkout</p>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
  discountsHeadingId,
  discountCodeInputId,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
  discountsHeadingId: string;
  discountCodeInputId: string;
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <section aria-label="Rabatte">
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt id={discountsHeadingId}>Rabatte</dt>
          <UpdateDiscountForm>
            <div
              className="cart-discount"
              role="group"
              aria-labelledby={discountsHeadingId}
            >
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button type="submit" aria-label="Rabatt entfernen">
                Entfernen
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="code-row">
          <label htmlFor={discountCodeInputId} className="sr-only">
            Rabattcode
          </label>
          <input
            id={discountCodeInputId}
            type="text"
            name="discountCode"
            placeholder="Rabattcode"
          />
          <button type="submit" className="btn btn-secondary" aria-label="Rabattcode anwenden">
            Anwenden
          </button>
        </div>
      </UpdateDiscountForm>
    </section>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
  giftCardHeadingId,
  giftCardInputId,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
  giftCardHeadingId: string;
  giftCardInputId: string;
}) {
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const removeButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const previousCardIdsRef = useRef<string[]>([]);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});
  const [removedCardIndex, setRemovedCardIndex] = useState<number | null>(null);

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      if (giftCardCodeInput.current !== null) {
        giftCardCodeInput.current.value = '';
      }
    }
  }, [giftCardAddFetcher.data]);

  useEffect(() => {
    const currentCardIds = giftCardCodes?.map((card) => card.id) || [];

    if (removedCardIndex !== null && giftCardCodes) {
      const focusTargetIndex = Math.min(
        removedCardIndex,
        giftCardCodes.length - 1,
      );
      const focusTargetCard = giftCardCodes[focusTargetIndex];
      const focusButton = focusTargetCard
        ? removeButtonRefs.current.get(focusTargetCard.id)
        : null;

      if (focusButton) {
        focusButton.focus();
      } else if (giftCardCodeInput.current) {
        giftCardCodeInput.current.focus();
      }

      setRemovedCardIndex(null);
    }

    previousCardIdsRef.current = currentCardIds;
  }, [giftCardCodes, removedCardIndex]);

  const handleRemoveClick = (cardId: string) => {
    const index = previousCardIdsRef.current.indexOf(cardId);
    if (index !== -1) {
      setRemovedCardIndex(index);
    }
  };

  return (
    <section aria-label="Geschenkkarten">
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl>
          <dt id={giftCardHeadingId}>Eingelöste Gutscheine</dt>
          {giftCardCodes.map((giftCard) => (
            <dd key={giftCard.id} className="cart-discount">
              <RemoveGiftCardForm
                giftCardId={giftCard.id}
                lastCharacters={giftCard.lastCharacters}
                onRemoveClick={() => handleRemoveClick(giftCard.id)}
                buttonRef={(el: HTMLButtonElement | null) => {
                  if (el) {
                    removeButtonRefs.current.set(giftCard.id, el);
                  } else {
                    removeButtonRefs.current.delete(giftCard.id);
                  }
                }}
              >
                <code>***{giftCard.lastCharacters}</code>
                &nbsp;
                <Price data={giftCard.amountUsed} />
              </RemoveGiftCardForm>
            </dd>
          ))}
        </dl>
      )}

      <AddGiftCardForm fetcherKey="gift-card-add">
        <div className="code-row">
          <label htmlFor={giftCardInputId} className="sr-only">
            Geschenkkarten-Code
          </label>
          <input
            id={giftCardInputId}
            type="text"
            name="giftCardCode"
            placeholder="Gutscheincode"
            ref={giftCardCodeInput}
          />
          <button
            type="submit"
            className="btn btn-secondary"
            disabled={giftCardAddFetcher.state !== 'idle'}
            aria-label="Geschenkkarte anwenden"
          >
            Anwenden
          </button>
        </div>
      </AddGiftCardForm>
    </section>
  );
}

function AddGiftCardForm({
  fetcherKey,
  children,
}: {
  fetcherKey?: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  lastCharacters,
  children,
  onRemoveClick,
  buttonRef,
}: {
  giftCardId: string;
  lastCharacters: string;
  children: React.ReactNode;
  onRemoveClick?: () => void;
  buttonRef?: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
      &nbsp;
      <button
        type="submit"
        aria-label={`Geschenkkarte mit Endung ${lastCharacters} entfernen`}
        onClick={onRemoveClick}
        ref={buttonRef}
      >
        Entfernen
      </button>
    </CartForm>
  );
}

function CartTotals({amount}: {amount?: {amount?: string | null; currencyCode?: string | null} | null}) {
  const {mode} = usePriceMode();
  if (!amount?.amount) {
    return (
      <dl role="group" className="cart-subtotal">
        <dt>Zwischensumme</dt>
        <dd>-</dd>
      </dl>
    );
  }
  const net = netOf(amount);
  const vat = {
    amount: (Number(amount.amount) - Number(net.amount)).toFixed(2),
    currencyCode: amount.currencyCode,
  };
  return (
    <div className="cart-totals">
      <dl className={mode === 'net' ? 'is-primary' : undefined}>
        <dt>Summe netto</dt>
        <dd><Price data={net} /></dd>
      </dl>
      <dl>
        <dt>zzgl. 19 % MwSt.</dt>
        <dd><Price data={vat} /></dd>
      </dl>
      <dl className={mode === 'gross' ? 'is-primary total' : 'total'}>
        <dt>Gesamt brutto</dt>
        <dd><Price data={amount} /></dd>
      </dl>
      <p className="cart-tax-note">
        zzgl. <ShippingInfoLink>Versandkosten</ShippingInfoLink>
      </p>
    </div>
  );
}
