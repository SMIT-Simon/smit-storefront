import {osFromTags, SERVICE_PRODUCT_TYPES} from '~/lib/addons';

/** Kennzeichnung: Betriebssystem und buchbarer Vor-Ort-Service. */
export function ProductBadges({
  tags,
  productType,
  compact = false,
}: {
  tags?: string[] | null;
  productType?: string | null;
  compact?: boolean;
}) {
  const os = osFromTags(tags);
  const service = productType ? SERVICE_PRODUCT_TYPES.includes(productType) : false;
  if (!os && !service) return null;
  return (
    <div className={compact ? 'badges badges-compact' : 'badges'}>
      {os === 'pro' ? <span className="badge badge-os">Windows 11 Pro</span> : null}
      {os === 'home' ? <span className="badge badge-os">Windows 11 Home</span> : null}
      {os === 'none' ? (
        <span className="badge badge-noos">Ohne Betriebssystem{compact ? '' : ' – Windows zubuchbar'}</span>
      ) : null}
      {service ? (
        <span className="badge badge-service">{compact ? 'Vor-Ort-Service' : 'Vor-Ort-Service wählbar'}</span>
      ) : null}
    </div>
  );
}
