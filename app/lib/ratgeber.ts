import {LANDINGS} from '~/lib/landings';

/**
 * Alle Ratgeber-/Themenseiten an einer Stelle – erscheinen automatisch im Footer
 * und in der HTML-Sitemap. Neue Themenseiten in landings.ts werden mit aufgenommen.
 */
export const RATGEBER: {to: string; label: string}[] = [
  {to: '/ratgeber/laptop-aus-deutschland', label: 'Laptop aus Deutschland'},
  {to: '/ratgeber/wortmann-server', label: 'Wortmann Server'},
  ...LANDINGS.map((l) => ({to: `/themen/${l.slug}`, label: l.keyword})),
];
