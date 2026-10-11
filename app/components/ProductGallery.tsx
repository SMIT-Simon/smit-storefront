import {useState, useEffect} from 'react';
import {Image} from '@shopify/hydrogen';

type GalleryImage = {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export function ProductGallery({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  // Bei Produktwechsel wieder beim ersten Bild beginnen
  useEffect(() => setActive(0), [images[0]?.url]);

  if (!images.length) {
    return (
      <div className="gallery">
        <div className="gallery-main gallery-empty">Kein Bild verfügbar</div>
      </div>
    );
  }

  const current = images[Math.min(active, images.length - 1)];

  return (
    <div className="gallery">
      <div className="gallery-main">
        <Image
          data={current}
          alt={current.altText || title}
          aspectRatio="1/1"
          sizes="(min-width: 64em) 560px, 100vw"
          loading="eager"
        />
      </div>
      {images.length > 1 ? (
        <div className="gallery-thumbs" role="list">
          {images.map((img, i) => (
            <button
              key={img.id ?? img.url}
              type="button"
              role="listitem"
              className={i === active ? 'gallery-thumb active' : 'gallery-thumb'}
              onClick={() => setActive(i)}
              aria-label={`Bild ${i + 1} von ${images.length} anzeigen`}
            >
              <Image
                data={img}
                alt=""
                aspectRatio="1/1"
                sizes="80px"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
