import {Link} from 'react-router';
import type {Solution} from '~/lib/solutions';
import {siteImg} from '~/lib/site-images';

export function SolutionTiles({items}: {items: Solution[]}) {
  return (
    <div className="solution-tiles">
      {items.map((x) => (
        <Link key={x.slug} to={`/loesungen/${x.slug}`} className="solution-tile" prefetch="intent">
          <span className="solution-tile-img">
            <img {...siteImg(x.image, '(min-width: 64em) 300px, (min-width: 40em) 50vw, 100vw')} alt="" loading="lazy" />
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

