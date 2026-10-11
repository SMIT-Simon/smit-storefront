import {Link} from 'react-router';
import type {Solution} from '~/lib/solutions';

export function SolutionTiles({items}: {items: Solution[]}) {
  return (
    <div className="solution-tiles">
      {items.map((x) => (
        <Link key={x.slug} to={`/loesungen/${x.slug}`} className="solution-tile" prefetch="intent">
          <span className="solution-tile-img">
            <img src={x.image} alt="" loading="lazy" width={600} height={400} />
          </span>
          <span className="solution-tile-body">
            <strong>{x.name}</strong>
            <span>{x.teaser}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

