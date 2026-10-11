import {Link} from 'react-router';
import {Price} from '~/components/Price';
import {Image} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {NetPrice} from '~/components/ProductPrice';

type CardProduct = (
  | CollectionItemFragment
  | ProductItemFragment
  | RecommendedProductFragment
) & {vendor?: string; productType?: string};

export function ProductItem({
  product,
  loading,
}: {
  product: CardProduct;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const min = product.priceRange.minVariantPrice;
  const hasRange =
    'maxVariantPrice' in product.priceRange &&
    product.priceRange.maxVariantPrice.amount !== min.amount;

  return (
    <Link
      className="product-card"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="product-card-image">
        {image ? (
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            data={image}
            loading={loading}
            sizes="(min-width: 64em) 280px, (min-width: 45em) 33vw, 50vw"
          />
        ) : (
          <div className="product-card-noimage">Kein Bild</div>
        )}
      </div>
      <div className="product-card-body">
        {product.productType || product.vendor ? (
          <span className="product-card-eyebrow">
            {[product.vendor, product.productType].filter(Boolean).join(' · ')}
          </span>
        ) : null}
        <h3 className="product-card-title">{product.title}</h3>
        <div className="product-card-price">
          <strong>
            {hasRange ? 'ab ' : null}
            <Price data={min} />
          </strong>
          <NetPrice price={min} />
        </div>
      </div>
    </Link>
  );
}
