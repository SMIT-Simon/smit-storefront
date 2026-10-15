import {useCallback, useEffect, useRef, useState} from 'react';
import {Link} from 'react-router';
import {Icon} from '~/components/Icon';
import {siteImg} from '~/lib/site-images';

export type Slide = {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  text: string;
  cta: {label: string; to: string};
  secondary?: {label: string; to: string};
  /** Optionales Hintergrundbild hinter der ganzen Folie (Produkte bleiben davor) */
  background?: {image: string; note?: string};
};

const INTERVAL = 6500;
/** Mobil max. 240px hoch → selten breiter als ~360px. */
export const HERO_SIZES = '(min-width: 64em) 620px, 360px';
/** Slide mit Hintergrund: Produktbild läuft auf dem Desktop bis an den rechten Rand (~62 % der Breite). */
export const HERO_SIZES_WIDE = '(min-width: 64em) 62vw, 360px';

/**
 * Startseiten-Slider. Alle Slides liegen im selben Grid-Feld übereinander,
 * dadurch richtet sich die Höhe nach dem größten Slide (kein Springen).
 * Bilder werden unverändert angezeigt (Wortmann-Nutzungsbedingungen).
 */
export function HeroSlider({slides}: {slides: Slide[]}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchX = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback(
    (i: number) => setIndex(((i % count) + count) % count),
    [count],
  );

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (paused || reduce || count < 2) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, count, index]);

  return (
    <section
      className="hero-slider"
      aria-roledescription="Karussell"
      aria-label="Highlights"
      // Nur echte Maus pausiert (Touch löst sonst „mouseenter“ ohne „mouseleave“ aus → Slider bleibt stehen)
      onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setPaused(false)}
      // Tastatur-Fokus pausiert, Tippen nicht
      onFocus={(e) => e.target.matches(':focus-visible') && setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        touchX.current = null;
        const end = e.changedTouches[0]?.clientX;
        if (start == null || end == null) return;
        const dx = end - start;
        if (Math.abs(dx) > 40) go(dx < 0 ? index + 1 : index - 1);
      }}
    >
      {slides.map((s, i) =>
        s.background ? (
          <div key={`bg-${s.image}`} className={i === index ? 'slide-bg active' : 'slide-bg'} aria-hidden>
            <img
              {...siteImg(s.background.image, '100vw')}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority="low"
              decoding="async"
            />
            {s.background.note ? <span className="slide-bg-note">{s.background.note}</span> : null}
          </div>
        ) : null,
      )}
      <div className="container">
        <div className="slides">
          {slides.map((s, i) => (
            <div
              key={s.image}
              className={`slide${i === index ? ' active' : ''}${s.background ? ' has-bg' : ''}`}
              role="group"
              aria-roledescription="Folie"
              aria-label={`${i + 1} von ${count}`}
              aria-hidden={i !== index}
            >
              <div className="slide-copy">
                <span className="eyebrow">{s.eyebrow}</span>
                {i === 0 ? <h1>{s.title}</h1> : <h2>{s.title}</h2>}
                <p>{s.text}</p>
                <div className="slide-actions">
                  <Link
                    to={s.cta.to}
                    className="btn btn-primary"
                    prefetch="intent"
                    tabIndex={i === index ? 0 : -1}
                  >
                    {s.cta.label} <Icon name="arrow-right" size={18} />
                  </Link>
                  {s.secondary ? (
                    <Link
                      to={s.secondary.to}
                      className="btn btn-secondary"
                      tabIndex={i === index ? 0 : -1}
                    >
                      {s.secondary.label}
                    </Link>
                  ) : null}
                </div>
              </div>
              <div className="slide-media">
                <img
                  {...siteImg(s.image, s.background ? HERO_SIZES_WIDE : HERO_SIZES)}
                  alt={s.alt}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  decoding={i === 0 ? 'sync' : 'async'}
                />
              </div>
            </div>
          ))}
        </div>

        {count > 1 ? (
          <div className="slider-controls">
            <button
              type="button"
              className="slider-arrow"
              aria-label="Vorherige Folie"
              onClick={() => go(index - 1)}
            >
              <Icon name="chevron-right" size={20} />
            </button>
            <div className="slider-dots">
              {slides.map((s, i) => (
                <button
                  key={s.image}
                  type="button"
                  className={i === index ? 'dot active' : 'dot'}
                  aria-label={`Folie ${i + 1}: ${s.title}`}
                  aria-current={i === index}
                  onClick={() => go(i)}
                />
              ))}
            </div>
            <button
              type="button"
              className="slider-arrow next"
              aria-label="Nächste Folie"
              onClick={() => go(index + 1)}
            >
              <Icon name="chevron-right" size={20} />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
