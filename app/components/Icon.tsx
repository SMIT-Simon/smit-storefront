import type {IconName} from '~/lib/categories';

type UiIcon =
  | IconName
  | 'search'
  | 'cart'
  | 'user'
  | 'menu'
  | 'check'
  | 'truck'
  | 'shield'
  | 'invoice'
  | 'headset'
  | 'arrow-right'
  | 'chevron-right';

const PATHS: Record<UiIcon, React.ReactNode> = {
  notebook: (
    <>
      <rect x="5" y="5" width="14" height="10" rx="1.5" />
      <path d="M3 18h18" />
    </>
  ),
  desktop: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="1.5" />
      <path d="M10 7h4M10 10h4" />
      <circle cx="12" cy="16.5" r="1" />
    </>
  ),
  aio: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M9 20h6M12 16v4" />
    </>
  ),
  monitor: (
    <>
      <rect x="2.5" y="4" width="19" height="12" rx="1" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  tablet: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  server: (
    <>
      <rect x="4" y="4" width="16" height="6" rx="1" />
      <rect x="4" y="14" width="16" height="6" rx="1" />
      <path d="M8 7h.01M8 17h.01" />
    </>
  ),
  accessory: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="6" />
      <path d="M12 3v6" />
    </>
  ),
  software: (
    <>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M3 8h18" />
      <path d="m10 12-2 2 2 2" />
      <path d="m14 12 2 2-2 2" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6" />
      <circle cx="9" cy="19" r="1.4" />
      <circle cx="17" cy="19" r="1.4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  check: <path d="m5 12 4.5 4.5L19 7" />,
  truck: (
    <>
      <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  shield: <path d="M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6z" />,
  invoice: (
    <>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M9 9h6M9 13h6M9 17h4" />
    </>
  ),
  headset: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="14" width="4" height="6" rx="1" />
      <rect x="17" y="14" width="4" height="6" rx="1" />
    </>
  ),
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  'chevron-right': <path d="m9 6 6 6-6 6" />,
};

export function Icon({
  name,
  size = 20,
  className,
}: {
  name: UiIcon;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
