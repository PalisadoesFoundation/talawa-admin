import { useNavigate } from 'react-router';

export function UserNavItem({
  href,
  label,
  icon: Icon,
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
