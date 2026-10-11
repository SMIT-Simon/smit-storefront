import {useEffect, useRef} from 'react';
import {Link, useLocation} from 'react-router';
import type {FacetCounts, FilterGroup} from '~/lib/filters';

/**
 * Eigenschaften-Filter als Leiste mit Aufklapp-Menüs. Jede Option ist ein
 * normaler Link (funktioniert ohne JavaScript und mit Zurück-Taste).
 */
export function CollectionFilters({
  groups,
  selected,
  counts,
}: {
  groups: FilterGroup[];
  selected: string[];
  counts: FacetCounts;
}) {
  const {pathname, search} = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  const hrefWith = (values: string[]) => {
    const next = new URLSearchParams(search);
    next.delete('cursor');
    next.delete('direction');
    if (values.length) next.set('f', values.join(','));
    else next.delete('f');
    const q = next.toString();
    return `${pathname}${q ? `?${q}` : ''}`;
  };
  const toggle = (slug: string) =>
    hrefWith(selected.includes(slug) ? selected.filter((s) => s !== slug) : [...selected, slug]);

  // Offene Menüs schließen, wenn außerhalb geklickt wird
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      ref.current?.querySelectorAll('details[open]').forEach((d) => {
        if (!d.contains(e.target as Node)) d.removeAttribute('open');
      });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const labelOf = (slug: string) =>
    groups.flatMap((g) => g.values).find((v) => v.slug === slug)?.label ?? slug;

  return (
    <div className="filters" ref={ref}>
      <div className="filter-bar" role="group" aria-label="Filter">
        {groups.map((g) => {
          const n = g.values.filter((v) => selected.includes(v.slug)).length;
          return (
            <details key={g.key} className={n ? 'filter-group active' : 'filter-group'}>
              <summary>
                {g.title}
                {n ? <span className="filter-badge">{n}</span> : null}
              </summary>
              <div className="filter-menu">
                {g.values.map((v) => {
                  const on = selected.includes(v.slug);
                  const c = counts[v.slug] ?? 0;
                  const disabled = !on && c === 0;
                  return disabled ? (
                    <span key={v.slug} className="filter-option disabled">
                      <span className="filter-check" aria-hidden />
                      {v.label}
                      <span className="filter-count">0</span>
                    </span>
                  ) : (
                    <Link
                      key={v.slug}
                      to={toggle(v.slug)}
                      preventScrollReset
                      rel="nofollow"
                      className={on ? 'filter-option on' : 'filter-option'}
                      aria-pressed={on}
                    >
                      <span className="filter-check" aria-hidden />
                      {v.label}
                      <span className="filter-count">{c}</span>
                    </Link>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>
      {selected.length ? (
        <div className="filter-active">
          {selected.map((s) => (
            <Link key={s} to={toggle(s)} preventScrollReset rel="nofollow" className="filter-chip">
              {labelOf(s)} <span aria-label="entfernen">×</span>
            </Link>
          ))}
          <Link to={hrefWith([])} preventScrollReset rel="nofollow" className="filter-reset">
            Alle Filter zurücksetzen
          </Link>
        </div>
      ) : null}
    </div>
  );
}
