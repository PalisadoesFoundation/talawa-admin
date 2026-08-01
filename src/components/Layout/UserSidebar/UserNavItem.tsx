/**
 * `UserNavItem` renders a single navigation item for the user sidebar.
 *
 * @param href - The route path the item navigates to when clicked.
 * @param label - The display label shown next to the icon.
 * @param icon - The icon component rendered inside the navigation item.
 * @param active - Whether the item represents the currently active page.
 * @param tooltip - The tooltip text displayed on hover.
 */

import { useNavigate } from 'react-router';
export function UserNavItem({
  href,
  label,
  icon: icon,
  active,
  tooltip,
}: {
  href: string;
  label: string;
  icon: React.FC;
  active: boolean;
  tooltip: string;
}) {
  const navigate = useNavigate();
  const Icon = icon;
  return (
    <li>
      <a
        href={href}
        className={`sidebar-nav-item ${active ? 'active' : ''}`}
        aria-current={active ? 'page' : undefined}
        data-tooltip={tooltip}
        title={tooltip}
        onClick={(e) => {
          e.preventDefault();
          navigate(href);
        }}
      >
        <span className="icon">
          <Icon />
        </span>
        <span className="nav-label">{label}</span>
      </a>
    </li>
  );
}
