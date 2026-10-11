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
};

const INTERVAL = 6500;
/** Mobil max. 240px hoch → selten breiter als ~360px. */
export const HERO_SIZES = '(min-width: 64em) 620px, 360px';

/**
 * Startseiten-Slider. Alle Slides liegen im selben Grid-Feld übereinander,
 * dadurch richtet sich die Höhe nach dem größten Slide (kein Springen).
 * Bilder werden unverändert angezeigt (Wortmann-Nutzungsbedingungen).
 */
export function HeroSlider({slides}: {slides: Slide[]}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
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
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container">
        <div className="slides">
          {slides.map((s, i) => (
            <div
              key={s.image}
              className={i === index ? 'slide active' : 'slide'}
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
                  {...siteImg(s.image, HERO_SIZES)}
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
